/* ══════════════════════════════════════════════════════════════════
   FORMATION BAKER — computes every static formation ONCE at engine
   init and packs it into vertex attributes. The per-frame animation
   (orbit speeds, ring pulses, flutter, lattice flow, idle breathing)
   lives in the vertex shader (shaders.ts) — nothing per-frame here.

   The math is a direct port of the CPU target functions in
   ParticleField.tsx, with footprints normalized so 12k/20k/40k
   particles occupy the same world-space extent the 5k CPU field does.
   ══════════════════════════════════════════════════════════════════ */

import type { FormationName } from "@/lib/climate";

/* Keep in sync with the id comments in shaders.ts evalFormation(). */
export const FORMATION_TYPE: Record<"idle" | FormationName, number> = {
  idle: 0,
  rippl: 1,
  rozi: 2,
  realm: 3,
  trmeric: 4,
  wordmark: 5,
  monogram: 6,
};

export function formationTypeOf(f: FormationName | null): number {
  return FORMATION_TYPE[f ?? "idle"];
}

export interface BakedFormations {
  count: number;
  /** Idle fibonacci sphere at t = 0 (vec3) — doubles as `position`. */
  position: Float32Array;
  /** (angle0, baseRadius, scatter, orbitIndex) per particle. */
  aOrbital: Float32Array;
  /** (angle0, ringIndex, y0, scatter) per particle. */
  aRipple: Float32Array;
  /** (x0, y0, z0static, side·(1|2) or 0 = body) per particle. */
  aOrganic: Float32Array;
  /** (x, y, z, 0) cube-grid point per particle. */
  aLattice: Float32Array;
  /** (s0, s1, s2, cullKey) per particle. cullKey is an independent
   *  random reserved for density culling — never reused by any
   *  formation math (see shaders.ts). */
  aSeed: Float32Array;
}

const WING_SCALE = 1.7;

export function bakeFormations(count: number): BakedFormations {
  const position = new Float32Array(count * 3);
  const aOrbital = new Float32Array(count * 4);
  const aRipple = new Float32Array(count * 4);
  const aOrganic = new Float32Array(count * 4);
  const aLattice = new Float32Array(count * 4);
  const aSeed = new Float32Array(count * 4);

  /* Lattice spacing normalized so the cube keeps the CPU field's
     footprint at any count (5000 → gridSize 18 → spacing 0.55). */
  const gridSize = Math.ceil(Math.cbrt(count));
  const spacing = 9.9 / gridSize;
  const zSpacing = 9.0 / gridSize;

  const ORBITS = 7;
  const perOrbit = count / ORBITS;

  const RINGS = 14;
  const perRing = count / RINGS;

  for (let i = 0; i < count; i++) {
    const s0 = Math.random();
    const s1 = Math.random();
    const s2 = Math.random();
    aSeed[i * 4] = s0;
    aSeed[i * 4 + 1] = s1;
    aSeed[i * 4 + 2] = s2;
    /* Independent cull key. s0/s1/s2 all shape formations (rozi ring
       scatter, realm body/wing selector, wing radius...), so density
       culling must key on a channel none of that math touches or the
       thinned subset is spatially biased. Idle breathing phase (which
       previously lived here as a copy of s0) now reads aSeed.x. */
    aSeed[i * 4 + 3] = Math.random();

    /* ── IDLE — fibonacci sphere, y flattened ×0.62, r 6.8 ── */
    {
      const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      const r = 6.8;
      position[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      position[i * 3 + 1] = r * Math.cos(phi) * 0.62;
      position[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }

    /* ── ORBITAL (rippl) — 7 inclined rings at power-law radii ── */
    {
      const orbit = i % ORBITS;
      const posInOrbit = Math.floor(i / ORBITS);
      const baseRadius = 0.5 + Math.pow(orbit + 1, 1.2) * 0.6;
      const angle0 = (posInOrbit / perOrbit) * Math.PI * 2;
      const scatter = (s1 - 0.5) * 0.05;
      aOrbital[i * 4] = angle0;
      aOrbital[i * 4 + 1] = baseRadius;
      aOrbital[i * 4 + 2] = scatter;
      aOrbital[i * 4 + 3] = orbit;
    }

    /* ── RIPPLE (rozi) — 14 concentric rings ── */
    {
      const ring = Math.floor(i / perRing);
      const angle0 = (i / perRing) * Math.PI * 2;
      const y0 = (s1 - 0.5) * 0.6;
      const scatter = (s0 - 0.5) * 0.5;
      aRipple[i * 4] = angle0;
      aRipple[i * 4 + 1] = ring;
      aRipple[i * 4 + 2] = y0;
      aRipple[i * 4 + 3] = scatter;
    }

    /* ── ORGANIC (realm) — butterfly: body spine + two wing lobes ── */
    {
      if (s0 < 0.035) {
        /* Body spine — x is animated in-shader, bake 0. */
        const along = (s1 - 0.5) * 2;
        aOrganic[i * 4] = 0;
        aOrganic[i * 4 + 1] = along * 1.7 * WING_SCALE;
        aOrganic[i * 4 + 2] = (s2 - 0.5) * 0.12;
        aOrganic[i * 4 + 3] = 0;
      } else {
        const side = i % 2 === 0 ? 1 : -1;
        const isForewing = s1 < 0.62;

        const rad = Math.sqrt((s0 * 37.13) % 1);
        const ang = s2 * Math.PI * 2;

        const cx = isForewing ? 1.3 : 0.9;
        const cy = isForewing ? 0.8 : -0.75;
        const rx = isForewing ? 1.5 : 1.0;
        const ry = isForewing ? 1.1 : 0.9;
        const rot = isForewing ? -0.3 : 0.3;

        const ex = Math.cos(ang) * rad * rx;
        const ey = Math.sin(ang) * rad * ry;
        const rc = Math.cos(rot);
        const rs = Math.sin(rot);
        const wx = ex * rc - ey * rs + cx;
        const wy = ey * rc + ex * rs + cy;

        /* Bake flutter-less, drift-less position; shader animates both. */
        aOrganic[i * 4] = side * wx * WING_SCALE;
        aOrganic[i * 4 + 1] = wy * WING_SCALE;
        aOrganic[i * 4 + 2] = (s2 - 0.5) * 1.0; /* static depth part */
        aOrganic[i * 4 + 3] = side * (isForewing ? 1 : 2);
      }
    }

    /* ── LATTICE (trmeric) — centered cube grid ── */
    {
      const gx = (i % gridSize) - gridSize * 0.5;
      const gy = (Math.floor(i / gridSize) % gridSize) - gridSize * 0.5;
      const gz = Math.floor(i / (gridSize * gridSize)) - gridSize * 0.5;
      aLattice[i * 4] = gx * spacing;
      aLattice[i * 4 + 1] = gy * spacing;
      aLattice[i * 4 + 2] = gz * zSpacing;
      aLattice[i * 4 + 3] = 0;
    }
  }

  return { count, position, aOrbital, aRipple, aOrganic, aLattice, aSeed };
}
