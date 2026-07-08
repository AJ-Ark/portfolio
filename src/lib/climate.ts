/* ══════════════════════════════════════════════════════════════════
   CLIMATE STORE — the dust engine's single source of shared state.

   Framework-free singleton (no React, no zustand). Everything here is
   read/written at rAF rate by the engine, Lenis (SmoothScroll) and any
   feature that wants to react to the field's "weather".

   Responsibilities:
   • Climate values (colors, turbulence, density, wind, gravity,
     excitement, scatter) smoothly interpolated toward targets each
     frame — nothing snaps.
   • Scroll velocity/progress published by SmoothScroll (Lenis).
   • Cursor position (NDC) + cursor velocity tracking.
   • The single rAF clock plumbing: SmoothScroll calls driveFrame()
     once per Lenis tick; registered frame drivers (the R3F advance())
     are invoked from here. A backup clock keeps the field alive if
     Lenis ever fails to construct.
   • Engine readiness (promise resolved once the GPU path — or the CPU
     fallback — has produced its first frame and text formations are
     baked).

   SSR-safe: no window/document access at module scope beyond guards.
   ══════════════════════════════════════════════════════════════════ */

import type { Domain } from "@/data/projects";

/* Every shape the field can hold. Domains map to their signature
   formations (rippl→orbitals, rozi→ripple rings, realm→butterfly,
   trmeric→lattice); the two text formations are runtime-baked. */
export type FormationName = Domain | "wordmark" | "monogram";

export interface ClimateState {
  /** Primary particle color, sRGB 0..1 components. */
  colorA: [number, number, number];
  /** Companion highlight color (near-camera particles shade toward it). */
  colorB: [number, number, number];
  /** 0..1 — curl-noise drift amplitude. */
  turbulence: number;
  /** 0..1 — fraction of particles rendered (GPU path culls the rest). */
  density: number;
  /** Lateral lean/drift strength. */
  wind: number;
  /** Downward settle (negative = updraft). */
  gravity: number;
  /** 0..1 transient energy — decays toward 0. Fed by excite(). */
  excitement: number;
  /** 0..1 transient scatter impulse — driven by scatterSettle(). */
  scatter: number;
  /** Normalized smoothed scroll velocity (signed, ~-2..2). */
  scrollVelocity: number;
  /** 0..1 document scroll progress. */
  scrollProgress: number;
  /** Smoothed pointer speed, ~0..1.5. */
  cursorVelocity: number;
  /** Pointer in NDC (-1..1). Parked at (9,9) when absent. */
  cursorX: number;
  cursorY: number;
}

function hex(h: string): [number, number, number] {
  const n = parseInt(h.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

/* colorA mirrors the CPU field's DARK_COLORS/LIGHT_COLORS exactly so a
   fallback swap is invisible; colorB is a brighter/deeper companion
   derived from each domain's palette accents in globals.css. */
const PALETTES: Record<"dark" | "light", Record<Domain | "idle", { a: [number, number, number]; b: [number, number, number] }>> = {
  dark: {
    idle:    { a: hex("#ac9c7a"), b: hex("#d8c8a4") },
    rippl:   { a: hex("#4FA8A0"), b: hex("#8FD8CF") },
    realm:   { a: hex("#d9b46a"), b: hex("#f1d8a3") },
    trmeric: { a: hex("#FFA426"), b: hex("#FFD08A") },
    rozi:    { a: hex("#C2745A"), b: hex("#E89B72") },
  },
  light: {
    idle:    { a: hex("#3a352E"), b: hex("#6a6152") },
    rippl:   { a: hex("#246660"), b: hex("#3E8A82") },
    realm:   { a: hex("#6B5020"), b: hex("#97742E") },
    trmeric: { a: hex("#8A4E06"), b: hex("#B87010") },
    rozi:    { a: hex("#7A2A14"), b: hex("#C94030") },
  },
};

/* Per-formation weather targets — each domain has a temperament. */
const WEATHER: Record<FormationName | "idle", { turbulence: number; density: number; wind: number; gravity: number }> = {
  idle:     { turbulence: 0.50, density: 0.85, wind: 0.12, gravity: 0 },
  rippl:    { turbulence: 0.25, density: 0.92, wind: 0.05, gravity: 0 },
  rozi:     { turbulence: 0.60, density: 0.95, wind: 0.30, gravity: 0.06 },
  realm:    { turbulence: 0.45, density: 0.92, wind: 0.18, gravity: -0.02 },
  trmeric:  { turbulence: 0.08, density: 1.00, wind: 0.02, gravity: 0 },  // low drift — the lattice must read precise/structured
  wordmark: { turbulence: 0.06, density: 1.00, wind: 0.02, gravity: 0 },
  monogram: { turbulence: 0.08, density: 1.00, wind: 0.02, gravity: 0 },
};

/* ── Live state (mutated in place — zero per-frame allocation) ── */
const state: ClimateState = {
  colorA: [...PALETTES.dark.idle.a] as [number, number, number],
  colorB: [...PALETTES.dark.idle.b] as [number, number, number],
  turbulence: WEATHER.idle.turbulence,
  density: WEATHER.idle.density,
  wind: WEATHER.idle.wind,
  gravity: WEATHER.idle.gravity,
  excitement: 0,
  scatter: 0,
  scrollVelocity: 0,
  scrollProgress: 0,
  cursorVelocity: 0,
  cursorX: 9,
  cursorY: 9,
};

const target = {
  colorA: [...PALETTES.dark.idle.a],
  colorB: [...PALETTES.dark.idle.b],
  turbulence: WEATHER.idle.turbulence,
  density: WEATHER.idle.density,
  wind: WEATHER.idle.wind,
  gravity: WEATHER.idle.gravity,
};

/** Read the live climate. The returned object is the store's own —
 *  treat it as read-only; it mutates every frame. */
export function getClimate(): Readonly<ClimateState> {
  return state;
}

type ClimateListener = (c: Readonly<ClimateState>) => void;
const listeners = new Set<ClimateListener>();
/* Array snapshot rebuilt on (un)subscribe — runFrame iterates this with
   a plain indexed loop so the hot path allocates nothing. */
let listenerList: ClimateListener[] = [];

/** Subscribe to climate ticks. Called at rAF rate after each frame's
 *  interpolation — keep handlers allocation-free and cheap; do NOT set
 *  React state per call without throttling. Returns unsubscribe. */
export function subscribeClimate(fn: ClimateListener): () => void {
  listeners.add(fn);
  listenerList = Array.from(listeners);
  return () => {
    listeners.delete(fn);
    listenerList = Array.from(listeners);
  };
}

/** Point the climate at a formation/domain/theme. Colors come from the
 *  domain (text formations borrow the active domain's palette, idle
 *  otherwise); weather comes from the formation's temperament. */
export function applyClimatePreset(formation: FormationName | null, domain: Domain | null, dark: boolean) {
  const isText = formation === "wordmark" || formation === "monogram";
  const colorKey: Domain | "idle" = (isText ? domain : (formation as Domain | null)) ?? domain ?? "idle";
  const pal = PALETTES[dark ? "dark" : "light"][colorKey] ?? PALETTES[dark ? "dark" : "light"].idle;
  const wea = WEATHER[formation ?? "idle"] ?? WEATHER.idle;
  target.colorA[0] = pal.a[0]; target.colorA[1] = pal.a[1]; target.colorA[2] = pal.a[2];
  target.colorB[0] = pal.b[0]; target.colorB[1] = pal.b[1]; target.colorB[2] = pal.b[2];
  target.turbulence = wea.turbulence;
  target.density = wea.density;
  target.wind = wea.wind;
  target.gravity = wea.gravity;
}

/* ── Excitement ── */
let exciteTau = 1.2; // seconds

/** Kick the field's energy up. Decays exponentially back to calm.
 *  Max-envelope semantics: a new kick only takes over (level AND tau)
 *  when it exceeds the CURRENT decayed level — a weak excite can never
 *  cut short a stronger excitement still in flight. */
export function excite(intensity: number, decayMs = 1200) {
  const v = Math.min(1, Math.max(0, intensity));
  if (v <= state.excitement) return;
  exciteTau = Math.max(0.05, decayMs / 1000);
  state.excitement = v;
}

/* ── Scatter impulse (scatterSettle) ── */
let scatterStart = -1;
let scatterDur = 0.4;

export function triggerScatter(durationMs = 400) {
  scatterStart = nowSec();
  scatterDur = Math.max(0.12, durationMs / 1000);
}

function nowSec(): number {
  return (typeof performance !== "undefined" ? performance.now() : Date.now()) / 1000;
}

/* ── Scroll publishing (SmoothScroll / Lenis) ── */
let rawScrollVel = 0;
let lastScrollPublish = 0;

/** Called by SmoothScroll once per Lenis tick.
 *  @param velocityNorm signed, normalized (≈ px-per-frame / viewport-height, pre-scaled)
 *  @param progress 0..1 document scroll progress */
export function publishScroll(velocityNorm: number, progress: number) {
  rawScrollVel = Number.isFinite(velocityNorm) ? velocityNorm : 0;
  if (Number.isFinite(progress)) state.scrollProgress = Math.min(1, Math.max(0, progress));
  lastScrollPublish = nowSec();
}

/* ── Cursor tracking (NDC + velocity) ── */
let rawCursorVel = 0;
let lastPointerTime = 0;
let pointerRefs = 0;
let removePointerListeners: (() => void) | null = null;

/** Install the global pointer listeners (idempotent, ref-counted).
 *  Returns a disposer. */
export function initPointerTracking(): () => void {
  pointerRefs++;
  if (!removePointerListeners && typeof window !== "undefined") {
    let px = 9, py = 9, pt = 0;
    const onMove = (clientX: number, clientY: number) => {
      const x = (clientX / window.innerWidth) * 2 - 1;
      const y = -(clientY / window.innerHeight) * 2 + 1;
      const t = nowSec();
      if (pt > 0 && px < 5) {
        const dt = Math.max(1 / 240, t - pt);
        const v = Math.hypot(x - px, y - py) / dt; // NDC per second
        rawCursorVel = Math.min(1.5, v * 0.12);
      }
      px = x; py = y; pt = t;
      state.cursorX = x;
      state.cursorY = y;
      lastPointerTime = t;
    };
    const onMouse = (e: MouseEvent) => onMove(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t0 = e.touches[0];
      if (t0) onMove(t0.clientX, t0.clientY);
    };
    const onTouchEnd = () => {
      state.cursorX = 9;
      state.cursorY = 9;
      px = 9; py = 9;
      rawCursorVel = 0;
    };
    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("touchstart", onTouch, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    removePointerListeners = () => {
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }
  return () => {
    pointerRefs = Math.max(0, pointerRefs - 1);
    if (pointerRefs === 0 && removePointerListeners) {
      removePointerListeners();
      removePointerListeners = null;
    }
  };
}

/* ── Per-frame interpolation ── */
function tickClimate(dt: number) {
  const kColor = 1 - Math.exp(-dt * 2.2);   // matches the old 0.03/frame color lerp feel
  const kWeather = 1 - Math.exp(-dt * 3);
  for (let i = 0; i < 3; i++) {
    state.colorA[i] += (target.colorA[i] - state.colorA[i]) * kColor;
    state.colorB[i] += (target.colorB[i] - state.colorB[i]) * kColor;
  }
  state.turbulence += (target.turbulence - state.turbulence) * kWeather;
  state.density += (target.density - state.density) * kWeather;
  state.wind += (target.wind - state.wind) * kWeather;
  state.gravity += (target.gravity - state.gravity) * kWeather;

  /* Excitement decays exponentially toward calm. */
  state.excitement *= Math.exp(-dt / exciteTau);
  if (state.excitement < 0.002) state.excitement = 0;

  /* Scatter envelope: fast rise (~22% of the window), eased resettle. */
  if (scatterStart >= 0) {
    const u = (nowSec() - scatterStart) / scatterDur;
    if (u >= 1) {
      state.scatter = 0;
      scatterStart = -1;
    } else if (u < 0.22) {
      const r = u / 0.22;
      state.scatter = 1 - (1 - r) * (1 - r); // ease-out rise
    } else {
      const r = (u - 0.22) / 0.78;
      state.scatter = 1 - r * r * (3 - 2 * r); // smoothstep fall
    }
  }

  /* Scroll velocity: smooth toward the raw published value; decay the
     raw value if Lenis stops publishing (e.g. backup clock running). */
  if (nowSec() - lastScrollPublish > 0.2) rawScrollVel *= Math.exp(-dt * 6);
  state.scrollVelocity += (rawScrollVel - state.scrollVelocity) * (1 - Math.exp(-dt * 8));

  /* Cursor velocity: smooth + decay when the pointer goes quiet. */
  if (nowSec() - lastPointerTime > 0.12) rawCursorVel *= Math.exp(-dt * 10);
  state.cursorVelocity += (rawCursorVel - state.cursorVelocity) * (1 - Math.exp(-dt * 9));
}

/* ── The single rAF clock ──
   SmoothScroll's Lenis loop calls driveFrame(time) once per frame.
   Registered drivers (the R3F advance()) are invoked from here, so
   scroll, climate and rendering share one clock. */
type FrameDriver = (timeMs: number) => void;
const drivers = new Set<FrameDriver>();
/* Array snapshot rebuilt on (un)register — see listenerList above. */
let driverList: FrameDriver[] = [];

/** Register a per-frame driver (e.g. R3F's advance — which expects
 *  SECONDS; drivers receive the raw rAF timestamp in MILLISECONDS and
 *  convert at their own boundary). Returns unregister. */
export function registerFrameDriver(fn: FrameDriver): () => void {
  drivers.add(fn);
  driverList = Array.from(drivers);
  return () => {
    drivers.delete(fn);
    driverList = Array.from(drivers);
  };
}

let lastTickMs = 0;
let lastExternalDrive = 0;

/** Advance the world by one frame. Called by SmoothScroll's rAF loop. */
export function driveFrame(timeMs: number) {
  lastExternalDrive = typeof performance !== "undefined" ? performance.now() : Date.now();
  runFrame(timeMs);
}

function runFrame(timeMs: number) {
  if (lastTickMs === 0) lastTickMs = timeMs;
  let dt = (timeMs - lastTickMs) / 1000;
  if (dt <= 0.0005) return; // double-drive guard (watchdog overlap)
  lastTickMs = timeMs;
  dt = Math.min(dt, 0.1);

  tickClimate(dt);

  /* Occlusion escape hatch: a page that fully covers the canvas can set
     <html data-canvas-occluded="1"> — climate keeps ticking (cheap) but
     rendering work is dropped. */
  const occluded =
    typeof document !== "undefined" &&
    document.documentElement.hasAttribute("data-canvas-occluded");
  /* Indexed loops over the stable snapshots — zero per-frame allocation.
     Locals capture the current snapshot, so a mid-loop (un)subscribe
     (which swaps in a NEW array) can't skip or double-call anyone. */
  if (!occluded) {
    const ds = driverList;
    for (let i = 0; i < ds.length; i++) ds[i](timeMs);
  }
  const ls = listenerList;
  for (let i = 0; i < ls.length; i++) ls[i](state);
}

/** ms since the external (Lenis) clock last drove a frame. */
export function lastDriveAge(): number {
  const now = typeof performance !== "undefined" ? performance.now() : Date.now();
  return now - lastExternalDrive;
}

/* Backup clock — keeps the field alive if Lenis never constructs.
   Self-terminates as soon as the external clock resumes. */
let backupRaf = 0;

export function ensureBackupClock() {
  if (backupRaf || typeof window === "undefined") return;
  const loop = (t: number) => {
    if (performance.now() - lastExternalDrive < 500) {
      backupRaf = 0;
      return;
    }
    runFrame(t);
    backupRaf = requestAnimationFrame(loop);
  };
  backupRaf = requestAnimationFrame(loop);
}

export function stopBackupClock() {
  if (backupRaf) cancelAnimationFrame(backupRaf);
  backupRaf = 0;
}

/* ── Engine readiness ── */
let resolveReady: (() => void) | null = null;
const readyPromise: Promise<void> =
  typeof window === "undefined"
    ? Promise.resolve()
    : new Promise<void>((res) => {
        resolveReady = res;
      });

/** Resolves when the engine (GPU path or CPU fallback) has compiled,
 *  rendered its first frame, and — on the GPU path — baked the text
 *  formations. Resolves immediately on the server. */
export function engineReadyPromise(): Promise<void> {
  return readyPromise;
}

/** Idempotent — called by the engine, the fallback probe, and a
 *  time-based failsafe so the promise can never hang forever. */
export function markEngineReady() {
  if (resolveReady) {
    resolveReady();
    resolveReady = null;
  }
}
