# DUST ENGINE — Public API

> The GPU particle engine behind every page ("One Material, With Weather").
> This file is the contract for feature work. Consume the engine ONLY through
> these APIs — do not import from `src/components/3d/engine/*` internals or
> mutate the canvas/camera directly.

**Architecture at a glance**

```
layout.tsx
└─ ParticleProvider (src/lib/particleContext.tsx)   ← React state + transition primitives
   ├─ WebGLLayer
   │  ├─ GlobalCanvas (ssr:false)                   ← tier switch: GPU DustField | CPU ParticleField | none
   │  ├─ DomainSync   (ssr:false)                   ← pathname → setDomain (drives the particles)
   │  └─ DomainTheme                                ← pathname → <html data-domain> (drives CSS palette)
   └─ SmoothScroll (Lenis)                          ← THE single rAF clock; publishes scroll into climate
src/lib/climate.ts                                  ← framework-free store: weather, clock, readiness
```

- **GPU path** (`engine/DustField.tsx`): one `THREE.Points` + RawShaderMaterial. All 7
  formations are baked once into vertex attributes; morphing, curl-noise drift, cursor
  repulsion, dive, weather all run in the vertex shader. 8k–40k particles by GPU tier.
- **CPU fallback** (`ParticleField.tsx`, unchanged): the original 5k-dot field. Used when
  WebGL2 exists but the engine shaders fail preflight compile, on software rasterizers,
  or with the **`?cpu-particles`** debug flag. No WebGL2 at all → no canvas (page still works).
- Rendering is **driven by Lenis' rAF** (`frameloop="never"` + `advance()`), pauses on
  `visibilitychange`, and a watchdog backup clock covers Lenis failure. Never add your own
  rAF loop for canvas work — subscribe to the climate store instead.

---

## 1. Formations

```ts
type Domain = "rippl" | "realm" | "trmeric" | "rozi";          // src/data/projects.ts
type FormationName = Domain | "wordmark" | "monogram";          // src/lib/climate.ts
```

| Formation | Shape | Notes |
|---|---|---|
| `null` (idle) | breathing fibonacci-sphere dust shell | default between domains |
| `"rippl"` | 7 inclined orbital rings | slow stately spin |
| `"rozi"` | 14 concentric ripple rings | gentle spin, monsoon weather |
| `"realm"` | butterfly (body + 2 wing lobes) | held face-on, flutters |
| `"trmeric"` | cube lattice | fastest spin, calm weather |
| `"wordmark"` | **"ARAVIND J"** in Fraunces italic | runtime-baked from the real font |
| `"monogram"` | **"AJ"** in Fraunces italic | runtime-baked from the real font |

Text formations are sampled from an offscreen canvas **after `document.fonts.ready`**
resolves and re-baked on significant resizes. Before the bake lands they alias the idle
cloud — gate loader choreography on `engineReady()` (below). On the **CPU fallback**,
`wordmark`/`monogram` are not available: the field falls back to the plain domain/idle
formation (design your moment to degrade to that gracefully).

Morphs take **1.2s cubic-out**. Rapid formation changes (hover flickers) are safe: the
engine keeps a 3-slot blend so interrupted morphs continue from the exact current shape.

---

## 2. React context — `useParticle()` (src/lib/particleContext.tsx)

```ts
const {
  // ── unchanged v1 API ──────────────────────────────────────────────
  domain,            // Domain | null — route-derived (set by DomainSync only)
  setDomain,         // (d: Domain | null) => void
  previewDomain,     // Domain | null — hover/slide preview
  setPreviewDomain,  // (d: Domain | null, offsetX?: number) => void
  activeDomain,      // Domain | null — warp > preview > route (unchanged semantics)
  previewOffsetX,    // number, -1..1
  warping,           // boolean — true during EITHER warp direction
  startWarp,         // (d: Domain) => void — the inward dive (used by useWarpNavigate)

  // ── engine v2 additions ───────────────────────────────────────────
  warpMode,          // "in" | "out" | null
  activeFormation,   // FormationName | null — warp > requestFormation > preview > route
  formationOffsetX,  // number — resolved offset (0 while warping)
  reverseWarp,       // () => void
  scatterSettle,     // (durationMs?: number) => void        (default 400)
  requestFormation,  // (name: FormationName | null, opts?: { offsetX?: number; owner?: string }) => void
  excite,            // (intensity: 0..1, decayMs?: number) => void  (default 1200)
  engineReady,       // () => Promise<void>
} = useParticle();
```

### `requestFormation(name, opts?)` — OWNER-KEYED STACK

Overrides what the field shows, above preview/route but **below warp**. Multiple
independent features can hold a formation request at once (the loader's wordmark, the
footer's monogram, a hovered list row, a hover-preview link, …) — this is an **owner-keyed
stack**, not a single last-writer-wins slot:

- Each `owner` string holds **at most one** entry. Calling `requestFormation(name, { owner })`
  again for the same owner **moves that entry to the top** (updates it in place, doesn't
  duplicate it).
- `requestFormation(null, { owner })` removes **only that owner's** entry. Whatever was
  underneath — another owner's request, or nothing (falling through to preview/route) —
  resumes. It can **never** clobber a different owner's active override.
- The field shows the **top of the stack** (the most recently requested/re-requested
  owner). `activeFormation = warpDomain ?? topOfStack?.name ?? previewDomain ?? domain`.
- Omitting `owner` uses a shared legacy slot (`"__legacy__"`) — fine for one-off/ad-hoc
  calls, but **any feature that both sets and later releases a formation must pass a
  stable, unique owner string**, or its release can remove a different call site's request
  that happens to also be using the legacy slot.

**Current owners** (keep this list in sync when you add a new call site):

| Owner | Call site | When |
|---|---|---|
| `"loader"` | `Preloader.tsx` | first-visit condense→hold→exhale |
| `"settling"` | `Settling.tsx` | footer band in view (monogram) |
| `"overlook"` | `app/work/page.tsx` | hovering/focusing a project row |
| `"next-project"` | `NextProject.tsx` | hovering/focusing the epilogue link |

`opts.offsetX` (-1 left … 0 center … 1 right) seats the **top** entry's cluster
horizontally, same convention as `setPreviewDomain`; it has no effect on entries buried
lower in the stack (they simply aren't visible until they reach the top).

```tsx
// THE SETTLING — every page's footer morphs the field into the monogram
// while the band is in view; releases ONLY this owner's entry on
// exit/unmount, so it can never strand or clobber another feature's
// concurrently-held override (or be stranded/clobbered by one).
useEffect(() => {
  if (!inView) return;
  requestFormation("monogram", { offsetX: 0, owner: "settling" });
  return () => requestFormation(null, { owner: "settling" }); // ALWAYS release on unmount
}, [inView, requestFormation]);
```

```tsx
// A hover preview that must win even over a lower feature's currently-
// active override — push it later (i.e. render/hover it "on top"), and
// release with the SAME owner on leave:
const preview = (on: boolean) =>
  requestFormation(on ? domain : null, { owner: "next-project" });
```

```tsx
// THE HONEST LOADER — condense into the wordmark, hold, exhale. Owned
// (owner: "loader") so its release can never remove another feature's
// entry, and vice versa:
useEffect(() => {
  let alive = true;
  engineReady().then(() => {
    if (!alive) return;
    requestFormation("wordmark", { owner: "loader" });
    // ...hold, then:
    // requestFormation(null, { owner: "loader" }); (idle) as the hero mask-reveals
  });
  return () => { alive = false; requestFormation(null, { owner: "loader" }); };
}, []);
```

### `reverseWarp()`
The project-entry dive played backward — the camera pulls **out** through the dust
(z 10 → ~17.5) while the chrome fades via the same `<html data-warp>` mechanism. Use it
around back-navigation exactly like `useWarpNavigate` uses `startWarp`:

```tsx
const { reverseWarp } = useParticle();
const router = useRouter();
function goBack(href: string) {
  if (prefersReducedMotionNow()) { router.push(href); return; }
  router.prefetch(href);
  reverseWarp();
  setTimeout(() => router.push(href), 900);   // WARP_NAV_MS
}
```
Release is automatic: 400ms after the pathname changes (4s failsafe), `data-warp` clears
and the camera eases home. No-op under reduced motion (navigate plainly yourself).
On the CPU fallback the reverse dive degrades to the chrome fade only.

### `scatterSettle(durationMs = 400)`
A burst-outward-and-resettle impulse for ordinary route changes (nav/about/footer — the
"no hard cuts" grammar). Fire it right when you trigger the navigation; the impulse rides
over whatever formation morph the route change causes. No-op under reduced motion.

### `excite(intensity, decayMs = 1200)`
Kicks the field's energy (turbulence amplitude, dot size/brightness, time speed) and
decays exponentially back to calm. Intensity clamps to 0..1; repeated calls keep the max.
Use for hover excitement on the reel, CTA emphasis, etc. No-op under reduced motion.

```tsx
<button onMouseEnter={() => excite(0.5)} onMouseDown={() => excite(1, 600)} …
```

### `engineReady(): Promise<void>`
Resolves when the engine is compiled, has rendered its first frame, and (GPU path) both
text formations are baked. Also resolves on: CPU fallback first frame, "no WebGL" case,
and an 8s failsafe — **it can never hang**, so it is safe to gate the loader on it.
Call it in effects only (client). On the server it resolves immediately.

### Unchanged guarantees (do not re-implement)
- `useWarpNavigate()(href, domain)` — full entry transition: prefetch → `startWarp` →
  navigate at 900ms → auto-release. Realm gets the hard-nav/`__beginWarp` handshake.
- `setPreviewDomain(d, offsetX?)` — hover/slide previews (HomeReel, DomainPortalCard).
- `activeDomain` still means `warp ?? preview ?? route` and ignores `requestFormation`
  overrides — use `activeFormation` if you need what's visually on screen.

---

## 3. Climate store (src/lib/climate.ts — re-exported from particleContext)

Framework-free singleton; safe to import anywhere (client). Zero-allocation reads.

```ts
import { getClimate, subscribeClimate } from "@/lib/particleContext"; // or "@/lib/climate"

interface ClimateState {
  colorA: [r, g, b];        // primary particle color (0..1 sRGB), per domain × theme
  colorB: [r, g, b];        // highlight companion color
  turbulence: number;       // 0..1 curl-drift amplitude
  density: number;          // 0..1 fraction of particles rendered
  wind: number;             // lateral lean
  gravity: number;          // downward settle (negative = updraft)
  excitement: number;       // 0..1, transient (excite())
  scatter: number;          // 0..1, transient (scatterSettle())
  scrollVelocity: number;   // smoothed, signed, ≈ -2..2 (Lenis)
  scrollProgress: number;   // 0..1 document progress
  cursorVelocity: number;   // smoothed pointer speed ≈ 0..1.5
  cursorX: number;          // NDC -1..1 (parked at 9,9 when absent)
  cursorY: number;
}
```

- `getClimate(): Readonly<ClimateState>` — returns the **live, mutating** object. Read
  fields inside your own frame/effect code; never mutate; never cache components of it
  across frames by reference expectations.
- `subscribeClimate(fn): () => void` — `fn(climate)` is called **once per rendered frame**
  (rAF rate). Keep handlers allocation-free; don't `setState` per call without throttling.

```tsx
// Chapter seam: DOM gradient reacting to the field's temperament
useEffect(() => subscribeClimate((c) => {
  el.current?.style.setProperty("--seam-heat", String(c.excitement + c.turbulence));
}), []);
```

**Targets, not snaps:** everything interpolates smoothly toward its target each frame.
Weather + palette targets are set automatically from `activeFormation` × `activeDomain`
× theme (`applyClimatePreset` — already wired in GlobalCanvas; you should not call it).

Advanced (rarely needed directly — prefer the context methods):
`excite()`, `triggerScatter()`, `publishScroll()` (SmoothScroll only),
`registerFrameDriver()` (engine only), `engineReadyPromise()`, `markEngineReady()`.

---

## 4. The single clock & document-level switches

- **One rAF loop** lives in `SmoothScroll.tsx` (Lenis). It publishes scroll
  velocity/progress, ticks the climate, and advances the R3F canvas. It **pauses when the
  tab is hidden**. Do not create per-component rAF loops for canvas-coupled work —
  `subscribeClimate` is your frame callback.
- **`<html data-warp="1">`** — set during warps (both directions); globals.css fades
  header/main/footer. Managed by the context; don't set it yourself.
- **`<html data-canvas-occluded="1">`** — *opt-in occlusion hint.* If your page/section
  fully covers the canvas with opaque paint, set this attribute to drop all rendering
  work (climate keeps ticking); remove it when the field shows through again:

```tsx
useEffect(() => {
  document.documentElement.setAttribute("data-canvas-occluded", "1");
  return () => document.documentElement.removeAttribute("data-canvas-occluded");
}, []);
```

- **`?cpu-particles`** query flag — forces the CPU fallback branch (debug/QA).

---

## 5. Tiering, fallback, performance budget

| Tier | Particles | DPR cap | Path |
|---|---|---|---|
| desktop-high | 40 000 | 1.5 | GPU |
| desktop-low | 20 000 | 1.25 | GPU |
| mobile / mobile-low | 12 000 / 8 000 | 1.25 | GPU |
| cpu-fallback | 5 000 | 1.5 | CPU `ParticleField` |
| no-webgl | 0 | — | no canvas |

Detection (`engine/tier.ts`) is a synchronous, dependency-free heuristic: WebGL2 probe +
**preflight compile of the actual engine shaders** + renderer-string/`deviceMemory`/core
sniff. A shader that fails to compile can never blank the canvas — the CPU field takes over.

Budget rules for feature agents: no per-frame allocation in `subscribeClimate` handlers;
no reading `getComputedStyle`/layout in them; DOM writes limited to CSS custom props or
transforms.

---

## 6. Reduced motion (designed calm path)

When `prefers-reduced-motion: reduce` (checked live *and* via `prefersReducedMotionNow()`):

- the field renders as a **calm, slow, dim ambient** (time at 15%, turbulence ×0.25,
  dimmed alpha, minimal repulsion);
- **formation changes resolve instantly** (no 1.2s morph);
- `reverseWarp`, `scatterSettle`, `excite` are **no-ops**; `useWarpNavigate` already
  falls back to plain navigation;
- the camera never dives.

Your features must supply their own calm equivalents on top (e.g. loader = static
wordmark skip, settling = static footer).

---

## 7. Theming

Palettes are handled for you: `colorA` mirrors the old field colors exactly, `colorB` is
a per-domain highlight; both flip with `data-theme`. Blending flips too — **additive glow
in dark mode, normal ink in light mode** (additive washes out on cream). If you build
DOM visuals that must match the dust, read `colorA/colorB` from the climate store instead
of hardcoding hexes.

---

## 8. File ownership map (engine internals — do not import)

```
src/components/3d/engine/DustField.tsx      GPU points component
src/components/3d/engine/shaders.ts         GLSL + preflight compile
src/components/3d/engine/formations.ts      attribute baking (analytic formations)
src/components/3d/engine/textFormation.ts   wordmark/monogram canvas sampling
src/components/3d/engine/tier.ts            GPU tier heuristic
src/components/3d/ParticleField.tsx         CPU fallback (frozen v1 field)
src/components/3d/GlobalCanvas.tsx          tier switch + clock/climate wiring
src/lib/climate.ts                          store (public API re-exported via particleContext)
src/lib/particleContext.tsx                 THE public React API
```
