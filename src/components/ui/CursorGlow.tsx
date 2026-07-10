"use client";

/* ══════════════════════════════════════════════════════════════════
   THE CURSOR IS ONE PARTICLE
   One 6px dot borrowed from the dust field — the same accent, the same
   glow — that follows the pointer on every route. A trailing halo
   becomes a hairline ring over links/buttons and swells into a worded
   lens ("Enter" / "Drag") over [data-cursor] targets. Elements tagged
   [data-magnetic] lean a few px toward the pointer and spring back.

   Wiring:
   • Mounted ONCE in src/app/layout.tsx (inside ParticleProvider +
     TranslationProvider), so it exists on every route.
   • Pointer position + velocity feed the climate store via the
     engine's ref-counted initPointerTracking() — the dust field's
     vertex shader reads cursorX/Y/velocity for repulsion, so nearby
     dust leans around the cursor — a smooth, continuous reaction (no
     discrete excite pulses on hover/flick; those read as the field
     "resetting"). Only a deliberate press ripples the field.
   • Per-frame work rides the site's single clock through
     subscribeClimate() — no private rAF loop, no React re-render per
     pointer move. Contextual states are event-delegated (pointerover)
     and written straight to data-attributes on the root element.

   Gating (all-or-nothing, tracked live):
   • fine pointer only — touch/coarse pointers render NOTHING and the
     native cursor is left alone;
   • prefers-reduced-motion renders NOTHING (the calm path is the
     honest OS cursor — no magnetics, no excite, no suppression);
   • the UA cursor is hidden ONLY while <html data-custom-cursor="1">
     is stamped by this component (see globals.css), and never over
     text-entry elements — the I-beam always survives;
   • keyboard focus outlines are untouched.

   SSR-safe: renders null on the server and on the first client render
   (activation resolves in an effect), so hydration always matches and
   no-JS visitors keep their native cursor.
   ══════════════════════════════════════════════════════════════════ */

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslation } from "@/lib/TranslationContext";
import { subscribeClimate, initPointerTracking, excite } from "@/lib/climate";

type Mode = "default" | "link" | "enter" | "drag" | "native";

/* Interactive elements that get the hairline ring. */
const INTERACTIVE = 'a, button, [role="button"]';
/* Text-entry elements where the native I-beam must never be replaced. */
const NATIVE_TEXT =
  'input, textarea, select, [contenteditable]:not([contenteditable="false"])';

function resolveMode(el: Element | null): Mode {
  if (!el) return "default";
  /* Hard rule first: text entry always keeps its native cursor. */
  if (el.closest(NATIVE_TEXT)) return "native";
  const tagged = el.closest("[data-cursor]");
  if (tagged) {
    const v = tagged.getAttribute("data-cursor");
    if (v === "enter") return "enter";
    if (v === "drag") return "drag";
    if (v === "native") return "native"; // opt-out escape hatch
  }
  if (el.closest(INTERACTIVE)) return "link";
  return "default";
}

const clamp = (v: number, lo: number, hi: number) =>
  v < lo ? lo : v > hi ? hi : v;

/* Magnetic spring constants — gently underdamped (c_crit ≈ 26). */
const MAG_K = 170;
const MAG_C = 16;
const MAG_PULL = 0.22; // fraction of pointer-to-center offset
const MAG_MAX = 6; // px — "a few px", never more

export default function CursorGlow() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);
  /* Installed by the main effect so the route-change effect can reach
     the contextual state (mode, lens target, magnet) that lives inside
     that effect's closure. */
  const clearContextualRef = useRef<(() => void) | null>(null);

  /* Activation: fine pointer AND motion allowed — tracked live so
     plugging in a mouse or toggling the OS motion setting flips the
     cursor on/off without a reload. */
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setActive(fine.matches && !reduce.matches);
    update();
    fine.addEventListener("change", update);
    reduce.addEventListener("change", update);
    return () => {
      fine.removeEventListener("change", update);
      reduce.removeEventListener("change", update);
    };
  }, []);

  /* Route change: the hovered element is gone — drop ALL contextual
     state so an "Enter" lens can't linger over the new page and the
     frame tick can't keep springing a now-detached magnet (keyboard
     navigation never fires the pointerover that would release it). */
  useEffect(() => {
    const root = rootRef.current;
    if (root) root.dataset.mode = "default";
    clearContextualRef.current?.();
  }, [pathname]);

  useEffect(() => {
    if (!active) return;
    const root = rootRef.current;
    const dot = dotRef.current;
    const halo = haloRef.current;
    if (!root || !dot || !halo) return;

    /* globals.css gates every cursor:none rule on this attribute, so
       the UA cursor is suppressed only while we can actually replace it. */
    document.documentElement.setAttribute("data-custom-cursor", "1");

    /* Feed pointer NDC + velocity into the climate store (ref-counted,
       shared with GlobalCanvas). The engine reads cursorX/Y/velocity
       every frame — this is what makes nearby dust lean around us. */
    const disposePointer = initPointerTracking();

    /* ── pointer state: written by events, consumed by the frame tick ── */
    const p = { x: -100, y: -100, hx: -100, hy: -100, seen: false };
    let down = false;

    /* ── magnetic state: one active magnet + one still springing home ── */
    let magEl: HTMLElement | null = null;
    let magCX = 0,
      magCY = 0; // cached rest-center (read once per hover — no per-frame layout)
    let magX = 0,
      magY = 0,
      magVX = 0,
      magVY = 0;
    let magWX = NaN, // last offsets actually written — NaN forces a write
      magWY = NaN;
    let magPrev = ""; // prior inline transform, restored on release
    let releasing: {
      el: HTMLElement;
      x: number;
      y: number;
      vx: number;
      vy: number;
      prev: string;
    } | null = null;
    let hotEl: Element | null = null; // current [data-cursor] target

    const setMode = (m: Mode) => {
      if (root.dataset.mode !== m) root.dataset.mode = m;
    };

    const captureMagnet = (el: HTMLElement) => {
      magEl = el;
      magPrev = el.style.transform;
      const r = el.getBoundingClientRect();
      magCX = r.left + r.width / 2;
      magCY = r.top + r.height / 2;
      magX = 0;
      magY = 0;
      magVX = 0;
      magVY = 0;
      magWX = NaN;
      magWY = NaN;
    };

    const releaseMagnet = () => {
      if (!magEl) return;
      /* Only one release slot — settle any previous one instantly. */
      if (releasing) releasing.el.style.transform = releasing.prev;
      releasing = { el: magEl, x: magX, y: magY, vx: magVX, vy: magVY, prev: magPrev };
      magEl = null;
    };

    /* Hard drop — restore saved inline transforms immediately, no
       spring-back. Used when the hovered elements may already be out
       of the document (route change, teardown). */
    const dropMagnets = () => {
      if (magEl) {
        magEl.style.transform = magPrev;
        magEl = null;
      }
      if (releasing) {
        releasing.el.style.transform = releasing.prev;
        releasing = null;
      }
    };

    clearContextualRef.current = () => {
      setMode("default");
      hotEl = null;
      dropMagnets();
    };

    /* ── event delegation — one listener set for the whole document ── */

    const onMove = (e: PointerEvent) => {
      p.x = e.clientX;
      p.y = e.clientY;
      if (!p.seen) {
        p.seen = true;
        p.hx = e.clientX; // halo teleports on (re)entry — no cross-screen swim
        p.hy = e.clientY;
        root.removeAttribute("data-hidden");
      }
    };

    const onOver = (e: PointerEvent) => {
      const el = e.target instanceof Element ? e.target : null;
      setMode(resolveMode(el));

      /* Track the lens target for the cursor mode only. The field no longer
         pulses on hover — a discrete excite() on every [data-cursor] entry
         read as the dust "resetting" on every hover. It reacts purely via the
         smooth cursor-lean (shader local repulsion) now, which is continuous. */
      const tagged = el ? el.closest("[data-cursor]") : null;
      if (tagged !== hotEl) hotEl = tagged;

      const m = el ? el.closest<HTMLElement>("[data-magnetic]") : null;
      if (m !== magEl) {
        releaseMagnet();
        if (m) captureMagnet(m);
      }
    };

    const onOut = (e: PointerEvent) => {
      if (e.relatedTarget) return; // still inside the document
      p.seen = false;
      root.setAttribute("data-hidden", "1");
      setMode("default");
      hotEl = null;
      releaseMagnet();
    };

    const onBlur = () => {
      p.seen = false;
      root.setAttribute("data-hidden", "1");
      hotEl = null; // pointerout-equivalent: no stale lens target survives
      releaseMagnet();
    };

    const onDown = () => {
      down = true;
      excite(0.5, 600); // the press ripples through the dust
    };
    const onUp = () => {
      down = false;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerout", onOut, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("pointercancel", onUp, { passive: true });
    window.addEventListener("blur", onBlur);

    /* ── frame tick: rides the site's single clock (Lenis → climate).
       Transforms only — no layout reads, no allocation beyond the
       transform strings the DOM API requires. The clock never idles,
       so each write is guarded: once a spring settles it snaps to its
       exact target, the values compare equal to the last write, and
       the string builds + style writes are skipped until pointer
       movement or a press wakes them again. ── */
    let lastT = performance.now();
    let pressS = 1; // smoothed press scale (transform is JS-owned — CSS can't ease it)
    let dWX = NaN, // last-written dot x/y/scale — NaN forces the first write
      dWY = NaN,
      dWS = NaN;
    let hWX = NaN, // last-written halo x/y/scale
      hWY = NaN,
      hWS = NaN;
    const unsub = subscribeClimate((c) => {
      const now = performance.now();
      const dt = clamp((now - lastT) / 1000, 0.0005, 0.05);
      lastT = now;

      /* Dot snaps to the pointer; halo trails a breath behind. */
      const kH = 1 - Math.exp(-dt * 16);
      p.hx += (p.x - p.hx) * kH;
      p.hy += (p.y - p.hy) * kH;
      if (Math.abs(p.x - p.hx) < 0.05 && Math.abs(p.y - p.hy) < 0.05) {
        p.hx = p.x; // settled — snap so the write guard can sleep
        p.hy = p.y;
      }
      const pressT = down ? 0.6 : 1;
      pressS += (pressT - pressS) * (1 - Math.exp(-dt * 18));
      if (Math.abs(pressT - pressS) < 0.001) pressS = pressT;

      if (p.x !== dWX || p.y !== dWY || pressS !== dWS) {
        dot.style.transform = `translate3d(${p.x}px, ${p.y}px, 0) translate(-50%, -50%) scale(${pressS})`;
        dWX = p.x;
        dWY = p.y;
        dWS = pressS;
      }
      const hs = 1 - (1 - pressS) * 0.15; // halo tenses far less than the dot
      if (p.hx !== hWX || p.hy !== hWY || hs !== hWS) {
        halo.style.transform = `translate3d(${p.hx}px, ${p.hy}px, 0) translate(-50%, -50%) scale(${hs})`;
        hWX = p.hx;
        hWY = p.hy;
        hWS = hs;
      }

      /* No velocity excite: the dust already follows the cursor via smooth
         local repulsion, so discrete flick-kicks only read as jitter. */

      /* Belt-and-braces: if a magnet left the document without a
         pointerout (route changes are cleared eagerly, but React can
         drop nodes any time), restore it and let go — never keep
         springing a detached node. */
      if (magEl && !magEl.isConnected) {
        magEl.style.transform = magPrev;
        magEl = null;
      }

      /* Magnetic pull — spring toward (pointer − rest-center) · k, clamped. */
      if (magEl) {
        const tx = clamp((p.x - magCX) * MAG_PULL, -MAG_MAX, MAG_MAX);
        const ty = clamp((p.y - magCY) * MAG_PULL, -MAG_MAX, MAG_MAX);
        magVX += (MAG_K * (tx - magX) - MAG_C * magVX) * dt;
        magVY += (MAG_K * (ty - magY) - MAG_C * magVY) * dt;
        magX += magVX * dt;
        magY += magVY * dt;
        if (
          Math.abs(tx - magX) < 0.05 &&
          Math.abs(ty - magY) < 0.05 &&
          Math.abs(magVX) < 1 &&
          Math.abs(magVY) < 1
        ) {
          magX = tx; // settled on a still pointer — snap and sleep
          magY = ty;
          magVX = 0;
          magVY = 0;
        }
        if (magX !== magWX || magY !== magWY) {
          magEl.style.transform = `translate3d(${magX}px, ${magY}px, 0)`;
          magWX = magX;
          magWY = magY;
        }
      }

      /* A released magnet that lost its node mid-spring: restore, stop. */
      if (releasing && !releasing.el.isConnected) {
        releasing.el.style.transform = releasing.prev;
        releasing = null;
      }

      /* Spring-back of a released magnet, then restore its own transform. */
      if (releasing) {
        const r = releasing;
        r.vx += (-MAG_K * r.x - MAG_C * r.vx) * dt;
        r.vy += (-MAG_K * r.y - MAG_C * r.vy) * dt;
        r.x += r.vx * dt;
        r.y += r.vy * dt;
        if (
          Math.abs(r.x) < 0.15 &&
          Math.abs(r.y) < 0.15 &&
          Math.abs(r.vx) < 2 &&
          Math.abs(r.vy) < 2
        ) {
          r.el.style.transform = r.prev;
          releasing = null;
        } else {
          r.el.style.transform = `translate3d(${r.x}px, ${r.y}px, 0)`;
        }
      }
    });

    return () => {
      unsub();
      disposePointer();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerout", onOut);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("blur", onBlur);
      clearContextualRef.current = null;
      dropMagnets();
      document.documentElement.removeAttribute("data-custom-cursor");
    };
  }, [active]);

  /* Server render + first client render + coarse pointers + reduced
     motion: nothing at all — the native cursor is left alone. */
  if (!active) return null;

  return (
    <div
      ref={rootRef}
      className="cg"
      aria-hidden="true"
      data-mode="default"
      data-hidden="1"
    >
      <div
        ref={dotRef}
        className="cg-dot"
        style={{ transform: "translate3d(-100px, -100px, 0)" }}
      />
      <div
        ref={haloRef}
        className="cg-halo"
        style={{ transform: "translate3d(-100px, -100px, 0)" }}
      >
        <span className="cg-label cg-label--enter">{t("cursor.enter")}</span>
        <span className="cg-label cg-label--drag">{t("cursor.drag")}</span>
      </div>
    </div>
  );
}
