"use client";

/* ══════════════════════════════════════════════════════════════════
   DUST FIELD — the GPU particle engine. One THREE.Points object with
   a RawShaderMaterial; every formation is baked once into vertex
   attributes and all motion (morph, drift, repulsion, dive, weather)
   runs in the vertex shader. The CPU per frame only eases a handful
   of scalars into uniforms — zero per-frame allocation.

   Back-compat contract with the old ParticleField:
   • same camera dive (z 10 → 1.25, factors 0.06/0.045) during warp,
   • same per-domain object rotation (butterfly stays face-on),
   • same offsetX easing (points.position.x = offset · halfW),
   • same rotation-corrected cursor repulsion in local space,
   • colors mirror DARK_COLORS/LIGHT_COLORS via the climate store.

   New: 'wordmark' / 'monogram' text formations (runtime-baked from the
   display font), reverse warp (camera pulls back out for back-nav),
   scatter impulse, climate-driven weather, reduced-motion calm path.
   ══════════════════════════════════════════════════════════════════ */

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useColorScheme } from "@/hooks/useColorScheme";
import { usePrefersReducedMotion, prefersReducedMotionNow } from "@/hooks/usePrefersReducedMotion";
import { getClimate, markEngineReady, type FormationName } from "@/lib/climate";
import { bakeFormations, formationTypeOf } from "./formations";
import { bakeTextFormation } from "./textFormation";
import { DUST_VERTEX, DUST_FRAGMENT } from "./shaders";

interface DustFieldProps {
  /** What shape the field should hold (warp > override > preview > route). */
  formation: FormationName | null;
  /** Normalized horizontal offset (-1..1) for the cluster's screen seat. */
  offsetX?: number;
  /** True while a warp (either direction) owns the screen. */
  warping?: boolean;
  /** 'in' = dive into the cluster; 'out' = the same shot reversed. */
  warpMode?: "in" | "out" | null;
  /** Particle count from tier detection. */
  count: number;
}

/* Per-formation object rotation speeds (rad/s) — flat formations
   (butterfly, text) ease back to face-on instead. */
function rotSpeedFor(f: FormationName | null): number | null {
  if (f === "realm" || f === "wordmark" || f === "monogram") return null;
  if (f === "trmeric") return 0.06;
  if (f === "rozi") return 0.022;
  if (f === "rippl") return 0.015;
  return 0.025;
}

export default function DustField({
  formation = null,
  offsetX = 0,
  warping = false,
  warpMode = null,
  count,
}: DustFieldProps) {
  const dark = useColorScheme();
  const darkRef = useRef(dark);
  darkRef.current = dark;

  const rmHook = usePrefersReducedMotion();
  const rmRef = useRef(false);
  useEffect(() => {
    rmRef.current = rmHook || prefersReducedMotionNow();
  }, [rmHook]);

  const warpModeRef = useRef<"in" | "out" | null>(warpMode);
  warpModeRef.current = warping ? warpMode ?? "in" : null;

  const offsetTargetRef = useRef(offsetX);
  offsetTargetRef.current = offsetX;
  const offsetXRef = useRef(0);

  const pointsRef = useRef<THREE.Points>(null!);
  const timeRef = useRef(0);
  const { size } = useThree();

  /* ── Geometry: bake all analytic formations once ── */
  const { geometry, wordAttr, monoAttr } = useMemo(() => {
    const baked = bakeFormations(count);
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(baked.position, 3));
    g.setAttribute("aOrbital", new THREE.BufferAttribute(baked.aOrbital, 4));
    g.setAttribute("aRipple", new THREE.BufferAttribute(baked.aRipple, 4));
    g.setAttribute("aOrganic", new THREE.BufferAttribute(baked.aOrganic, 4));
    g.setAttribute("aLattice", new THREE.BufferAttribute(baked.aLattice, 4));
    g.setAttribute("aSeed", new THREE.BufferAttribute(baked.aSeed, 4));

    /* Text formations start as a copy of the idle cloud; the real glyph
       targets land asynchronously once fonts are ready. */
    const mkText = () => {
      const a = new Float32Array(count * 4);
      for (let i = 0; i < count; i++) {
        a[i * 4] = baked.position[i * 3];
        a[i * 4 + 1] = baked.position[i * 3 + 1];
        a[i * 4 + 2] = baked.position[i * 3 + 2];
        a[i * 4 + 3] = Math.random();
      }
      return new THREE.BufferAttribute(a, 4);
    };
    const wordAttr = mkText();
    const monoAttr = mkText();
    g.setAttribute("aWord", wordAttr);
    g.setAttribute("aMono", monoAttr);

    /* Never let three compute a bounding sphere over animated dust. */
    g.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 64);
    return { geometry: g, wordAttr, monoAttr };
  }, [count]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  /* ── Material — raw shader, uniforms only ── */
  const material = useMemo(
    () =>
      new THREE.RawShaderMaterial({
        vertexShader: DUST_VERTEX,
        fragmentShader: DUST_FRAGMENT,
        transparent: true,
        depthWrite: false,
        depthTest: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uTypeA: { value: 0 },
          uTypeB: { value: 0 },
          uTypeC: { value: 0 },
          uMixAB: { value: 1 },
          uMix: { value: 1 },
          uCursor: { value: new Float32Array([9, 9, 0]) },
          uRepelRadius: { value: 1.8 },
          uRepelStrength: { value: 0.32 },
          uDive: { value: 0 },
          uTurbulence: { value: 0.5 },
          uWind: { value: 0.1 },
          uGravity: { value: 0 },
          uExcitement: { value: 0 },
          uDensity: { value: 1 },
          uScrollVel: { value: 0 },
          uScatter: { value: 0 },
          uSize: { value: 0.03 },
          uPixelScale: { value: 1000 },
          uAlpha: { value: 0.5 },
          uColorA: { value: new Float32Array([0.67, 0.61, 0.48]) },
          uColorB: { value: new Float32Array([0.85, 0.78, 0.64]) },
        },
      }),
    []
  );

  useEffect(() => () => material.dispose(), [material]);

  /* ── Morph slots ──
     visual = mix( mix(A, B, mixAB frozen), C, mix animated ).
     On a formation change: A←B, B←C, mixAB←current eased mix, C←new,
     mix←0 — the current blend is preserved exactly, no popping. */
  const slots = useRef({
    a: null as FormationName | null,
    b: null as FormationName | null,
    c: formation,
    mixAB: 1,
  });
  const morphRef = useRef(1);
  const formationRef = useRef<FormationName | null | undefined>(undefined);

  if (formation !== formationRef.current) {
    const first = formationRef.current === undefined;
    formationRef.current = formation;
    const u = material.uniforms;
    if (prefersReducedMotionNow()) {
      /* Reduced motion: transitions resolve instantly. */
      slots.current.a = formation;
      slots.current.b = formation;
      slots.current.c = formation;
      slots.current.mixAB = 1;
      morphRef.current = 1;
    } else if (first) {
      /* First mount: glide in from the idle field, like the CPU field's
         resolve-on-arrival (idle → idle is a no-op morph). */
      slots.current.a = null;
      slots.current.b = null;
      slots.current.c = formation;
      slots.current.mixAB = 1;
      morphRef.current = formation === null ? 1 : 0;
    } else {
      /* Bounded-error interruption. The plain shift below (A←B, B←C,
         mixAB←eased) is exact ONLY when the previous morph had already
         fully resolved (mixAB===1, i.e. A===B — A's weight is moot).
         If a THIRD change arrives while the frozen pair is still
         blending (mixAB<1), the plain shift silently drops slot A's
         remaining (1-mixAB) contribution: a pop of
         (1-eased)·(1-mixAB)·(A−B) in a single frame. Two changes
         inside 1.2s (e.g. hover sweeping across work rows) hit this.

         Bound the error instead of eating it: when C still carries
         little visual weight (eased<0.5), don't fold it into the
         frozen pair at all — keep A/B/mixAB exactly as they are and
         only retarget the animated slot C, restarting its morph from
         0. The discarded pop is now bounded by C's own small eased
         weight, not by A's whole remaining share. Once C already
         carries ≥half the blend (eased≥0.5) — or the frozen pair had
         already resolved (mixAB===1, the original exact case) — the
         plain shift's error, (1-eased)·(1-mixAB), is small precisely
         because eased is large, so it's the better trade. */
      const eased = 1 - Math.pow(1 - morphRef.current, 3);
      if (slots.current.mixAB < 1 && eased < 0.5) {
        slots.current.c = formation;
      } else {
        slots.current.a = slots.current.b;
        slots.current.b = slots.current.c;
        slots.current.mixAB = eased;
        slots.current.c = formation;
      }
      morphRef.current = 0;
    }
    u.uTypeA.value = formationTypeOf(slots.current.a);
    u.uTypeB.value = formationTypeOf(slots.current.b);
    u.uTypeC.value = formationTypeOf(slots.current.c);
    u.uMixAB.value = slots.current.mixAB;
    u.uMix.value = morphRef.current;
  }

  /* ── Text formation baking (gated on real font readiness) ── */
  const textBakedRef = useRef<{ promise: Promise<void>; resolve: () => void; done: boolean } | null>(null);
  if (!textBakedRef.current) {
    let resolve!: () => void;
    const promise = new Promise<void>((r) => (resolve = r));
    textBakedRef.current = { promise, resolve, done: false };
  }

  /* Resize (or first-load) re-bakes overwrite aWord/aMono outright. If
     that formation is actually on screen (in ANY morph slot — a/b/c all
     share the same buffer for a given type), snapping the buffer pops
     every particle to its new site in one frame. Instead, capture the
     pre-bake data and CPU-lerp toward the new bake over a short window;
     see the useFrame block below. Formations sampling deterministically
     per index (textFormation.ts) already keeps this residual shift
     small — this just removes the last-mile pop. */
  const wordBlendRef = useRef<{ from: Float32Array; to: Float32Array; elapsed: number; dur: number } | null>(null);
  const monoBlendRef = useRef<{ from: Float32Array; to: Float32Array; elapsed: number; dur: number } | null>(null);

  /* A `count` change swaps in a freshly-sized geometry (new wordAttr/
     monoAttr). Drop any in-flight blend keyed to the old buffers — its
     from/to arrays are the wrong length for the new attribute and would
     read out of bounds (NaN) if left running against it. */
  useEffect(() => {
    wordBlendRef.current = null;
    monoBlendRef.current = null;
  }, [wordAttr, monoAttr]);

  useEffect(() => {
    let cancelled = false;
    /* Debounce: resize storms re-run this effect; bake once settled. */
    const timer = window.setTimeout(() => {
      const aspect = size.width / Math.max(1, size.height);
      const halfW10 = 5.7735 * aspect; /* half viewport width in world units at z=10, fov 60 */
      Promise.all([
        bakeTextFormation("ARAVIND J", count, Math.min(10.5, 2 * halfW10 * 0.88)),
        bakeTextFormation("AJ", count, Math.min(5.2, 2 * halfW10 * 0.55)),
      ])
        .then(([word, mono]) => {
          if (cancelled) return;
          const wordLive =
            slots.current.a === "wordmark" || slots.current.b === "wordmark" || slots.current.c === "wordmark";
          const monoLive =
            slots.current.a === "monogram" || slots.current.b === "monogram" || slots.current.c === "monogram";
          const calm = prefersReducedMotionNow();

          if (wordLive && !calm) {
            wordBlendRef.current = {
              from: Float32Array.from(wordAttr.array as Float32Array),
              to: word,
              elapsed: 0,
              dur: 0.5,
            };
          } else {
            wordBlendRef.current = null;
            (wordAttr.array as Float32Array).set(word);
            wordAttr.needsUpdate = true;
          }

          if (monoLive && !calm) {
            monoBlendRef.current = {
              from: Float32Array.from(monoAttr.array as Float32Array),
              to: mono,
              elapsed: 0,
              dur: 0.5,
            };
          } else {
            monoBlendRef.current = null;
            (monoAttr.array as Float32Array).set(mono);
            monoAttr.needsUpdate = true;
          }

          if (textBakedRef.current && !textBakedRef.current.done) {
            textBakedRef.current.done = true;
            textBakedRef.current.resolve();
          }
        })
        .catch(() => {
          /* Never block readiness on a bake failure. */
          if (textBakedRef.current && !textBakedRef.current.done) {
            textBakedRef.current.done = true;
            textBakedRef.current.resolve();
          }
        });
    }, 250);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [size.width, size.height, count, wordAttr, monoAttr]);

  /* ── Engine readiness: first rendered frame + text bake ── */
  const firstFrameRef = useRef<{ promise: Promise<void>; resolve: () => void; done: boolean } | null>(null);
  if (!firstFrameRef.current) {
    let resolve!: () => void;
    const promise = new Promise<void>((r) => (resolve = r));
    firstFrameRef.current = { promise, resolve, done: false };
  }

  useEffect(() => {
    let alive = true;
    Promise.all([textBakedRef.current!.promise, firstFrameRef.current!.promise]).then(() => {
      if (alive) markEngineReady();
    });
    return () => {
      alive = false;
    };
  }, []);

  /* ── Frame loop — uniform writes only, no allocation ── */
  useFrame((state, delta) => {
    const u = material.uniforms;
    const clim = getClimate();
    const rm = rmRef.current;
    const d = Math.min(delta, 0.05);

    /* Text re-bake smoothing (see the bake effect above): CPU-lerp the
       live aWord/aMono buffer from its pre-bake snapshot toward the new
       bake over a short window instead of the buffer just snapping.
       No allocation — arrays are pre-captured, this only ever runs for
       ~0.5s right after a re-bake that touched the on-screen formation. */
    const wb = wordBlendRef.current;
    if (wb) {
      wb.elapsed += d;
      const bu = Math.min(1, wb.elapsed / wb.dur);
      const eased = 1 - Math.pow(1 - bu, 3);
      const arr = wordAttr.array as Float32Array;
      for (let i = 0; i < arr.length; i++) arr[i] = wb.from[i] + (wb.to[i] - wb.from[i]) * eased;
      wordAttr.needsUpdate = true;
      if (bu >= 1) wordBlendRef.current = null;
    }
    const mb = monoBlendRef.current;
    if (mb) {
      mb.elapsed += d;
      const bu = Math.min(1, mb.elapsed / mb.dur);
      const eased = 1 - Math.pow(1 - bu, 3);
      const arr = monoAttr.array as Float32Array;
      for (let i = 0; i < arr.length; i++) arr[i] = mb.from[i] + (mb.to[i] - mb.from[i]) * eased;
      monoAttr.needsUpdate = true;
      if (bu >= 1) monoBlendRef.current = null;
    }

    /* Reduced motion: a calm, slow, dim ambient. */
    const timeScale = rm ? 0.15 : 1 + clim.excitement * 0.7;
    timeRef.current += d * timeScale;
    const t = timeRef.current;
    u.uTime.value = t;

    /* Morph progression (1.2 s, cubic-out — same as the CPU field). */
    if (morphRef.current < 1) {
      morphRef.current = rm ? 1 : Math.min(1, morphRef.current + d / 1.2);
      if (morphRef.current >= 1) {
        /* Normalize slots so the NEXT change starts pop-free. */
        slots.current.a = slots.current.c;
        slots.current.b = slots.current.c;
        slots.current.mixAB = 1;
        u.uTypeA.value = formationTypeOf(slots.current.a);
        u.uTypeB.value = formationTypeOf(slots.current.b);
        u.uMixAB.value = 1;
      }
    }
    u.uMix.value = 1 - Math.pow(1 - morphRef.current, 3);

    /* Warp camera: 'in' dives to z 1.25, 'out' pulls back to z 17.5,
       release eases home to z 10. Reduced motion pins the camera. */
    const cam = state.camera as THREE.PerspectiveCamera;
    const mode = warpModeRef.current;
    const camTarget = rm ? 10 : mode === "in" ? 1.25 : mode === "out" ? 17.5 : 10;
    cam.position.z += (camTarget - cam.position.z) * (mode ? 0.06 : 0.045);
    const dive = Math.max(0, Math.min(1, (10 - cam.position.z) / 8.75));
    u.uDive.value = dive;

    /* Viewport → world mapping at the cluster plane. */
    const fovRad = (cam.fov * Math.PI) / 180;
    const tanHalf = Math.tan(fovRad / 2);
    const halfH = cam.position.z * tanHalf;
    const halfW = halfH * (state.size.width / state.size.height);

    /* Horizontal offset — object translation, not baked into vertices. */
    offsetXRef.current += (offsetTargetRef.current - offsetXRef.current) * 0.06;
    const pts = pointsRef.current;
    if (pts) pts.position.x = offsetXRef.current * halfW;

    /* Rotation — same grammar as the CPU field. */
    if (pts) {
      const speed = rotSpeedFor(slots.current.c);
      if (speed === null) {
        pts.rotation.y += (0 - pts.rotation.y) * 0.08;
        pts.rotation.x += (Math.sin(t * 0.2) * 0.025 - pts.rotation.x) * 0.08;
      } else {
        pts.rotation.y += d * speed * (1 + dive * 2.2) * (rm ? 0.3 : 1);
        pts.rotation.x = Math.sin(t * 0.08) * 0.06;
      }
    }

    /* Cursor → world → LOCAL space of the Y-rotated points object. */
    const rotY = pts ? pts.rotation.y : 0;
    const curWX = clim.cursorX * halfW;
    const curWY = clim.cursorY * halfH;
    const rel = curWX - offsetXRef.current * halfW;
    const cur = u.uCursor.value as Float32Array;
    cur[0] = rel * Math.cos(rotY);
    cur[1] = curWY;
    cur[2] = rel * Math.sin(rotY);

    const cv = Math.min(1.5, clim.cursorVelocity);
    u.uRepelRadius.value = 1.8 * (1 + cv * 0.5);
    u.uRepelStrength.value = (rm ? 0.08 : 0.32) * (1 + cv * 1.2);

    /* Climate → uniforms. */
    const ca = u.uColorA.value as Float32Array;
    const cb = u.uColorB.value as Float32Array;
    ca[0] = clim.colorA[0]; ca[1] = clim.colorA[1]; ca[2] = clim.colorA[2];
    cb[0] = clim.colorB[0]; cb[1] = clim.colorB[1]; cb[2] = clim.colorB[2];
    u.uTurbulence.value = clim.turbulence * (rm ? 0.25 : 1);
    u.uWind.value = clim.wind * (rm ? 0.3 : 1);
    u.uGravity.value = clim.gravity * (rm ? 0.3 : 1);
    u.uExcitement.value = rm ? 0 : clim.excitement;
    u.uDensity.value = clim.density;
    u.uScrollVel.value = rm ? 0 : Math.max(-1.2, Math.min(1.2, clim.scrollVelocity));
    u.uScatter.value = rm ? 0 : clim.scatter;

    /* Size / alpha — scaled down as count scales up so total coverage
       and additive brightness stay in the CPU field's register. */
    const dpr = state.viewport.dpr;
    u.uPixelScale.value = (state.size.height * dpr) / (2 * tanHalf);
    const mobile = state.size.width < 768;
    const countScale = 5000 / count;
    u.uSize.value = (mobile ? 0.05 : 0.03) * Math.pow(countScale, 0.4);

    const darkNow = darkRef.current;
    const alphaBase = darkNow
      ? 0.65 * Math.pow(countScale, 0.45) /* additive accumulates */
      : 0.85 * Math.pow(countScale, 0.3);
    u.uAlpha.value =
      Math.min(0.95, alphaBase + Math.sin(t * 0.35) * 0.06 + dive * 0.25) * (rm ? 0.8 : 1);

    /* Blending per theme: additive glow on dark grounds, normal ink on
       light grounds (additive washes out on cream). State-only change,
       no shader recompile. */
    const wantBlend = darkNow ? THREE.AdditiveBlending : THREE.NormalBlending;
    if (material.blending !== wantBlend) material.blending = wantBlend;

    if (!firstFrameRef.current!.done) {
      firstFrameRef.current!.done = true;
      firstFrameRef.current!.resolve();
    }
  });

  return <points ref={pointsRef} geometry={geometry} material={material} frustumCulled={false} />;
}
