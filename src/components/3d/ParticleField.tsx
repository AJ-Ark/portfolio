"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { Domain } from "@/data/projects";
import { useColorScheme } from "@/hooks/useColorScheme";

interface ParticleFieldProps {
  domain?: Domain | null;
  /** Normalized horizontal offset (-1 left edge .. 0 center .. 1 right edge)
   *  for where the cluster should sit on screen. */
  offsetX?: number;
}

const PARTICLE_COUNT = 5000;

/* ── Module-level cursor — updated on window, never causes React re-renders ── */
const cursor = { x: 0, y: 0 };
if (typeof window !== "undefined") {
  window.addEventListener(
    "mousemove",
    (e) => {
      cursor.x = (e.clientX / window.innerWidth) * 2 - 1;
      cursor.y = -(e.clientY / window.innerHeight) * 2 + 1;
    },
    { passive: true }
  );
}

/* ── Seeds ── */
function makeSeeds(count: number): Float32Array {
  const s = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    s[i * 3]     = Math.random();
    s[i * 3 + 1] = Math.random();
    s[i * 3 + 2] = Math.random();
  }
  return s;
}

/* ── Target shapes ── */

/* Solar-system / compounding orbital rings for Rippl.
   7 inclined rings at power-law radii, each breathing and micro-vibrating.
   Inner orbits spin faster (Kepler-like), giving a layered living depth. */
function orbitalTarget(i: number, seed: Float32Array, t: number): [number, number, number] {
  const ORBIT_COUNT = 7;
  const orbit = i % ORBIT_COUNT;
  const posInOrbit = Math.floor(i / ORBIT_COUNT);
  const particlesPerOrbit = PARTICLE_COUNT / ORBIT_COUNT;

  // Power-law radii — inner close, outer progressively spaced
  const baseRadius = 0.5 + Math.pow(orbit + 1, 1.2) * 0.6;

  // Slow breath: orbit expands and contracts as a unit, each at its own phase
  const breathe = Math.sin(t * 0.25 + orbit * 1.1) * 0.2;
  // Micro-vibration: faster, smaller — the "alive / tense" feel
  const vibrate = Math.sin(t * 1.5 + orbit * 0.8 + seed[i * 3] * 6.28) * 0.025;
  const radius = baseRadius + breathe + vibrate;

  // Kepler-like: inner orbits rotate faster
  const fraction = posInOrbit / particlesPerOrbit;
  const angSpeed = 0.06 / (orbit + 1);
  const angle = fraction * Math.PI * 2 + t * angSpeed;

  // Each orbit at a distinct inclination — 3D solar-system perspective
  const inclination = orbit * 0.13;
  const cosInc = Math.cos(inclination);
  const sinInc = Math.sin(inclination);

  const x = Math.cos(angle) * radius;
  const yFlat = Math.sin(angle) * radius;

  // Thin scatter perpendicular to orbit plane for diffuse cloud feel
  const scatter = (seed[i * 3 + 1] - 0.5) * 0.05;

  return [
    x + scatter * 0.3,
    yFlat * cosInc + scatter,
    yFlat * sinInc + scatter * 0.5,
  ];
}

function rippleTarget(i: number, seed: Float32Array, t: number): [number, number, number] {
  const rings  = 14;
  const ring   = Math.floor(i / (PARTICLE_COUNT / rings));
  const angle  = (i / (PARTICLE_COUNT / rings)) * Math.PI * 2 + t * 0.08;
  const radius = (ring + 1) * 0.55 + Math.sin(t * 0.4 + ring * 0.5) * 0.25;
  const scatter = (seed[i * 3] - 0.5) * 0.5;
  return [
    Math.cos(angle) * radius + scatter,
    (seed[i * 3 + 1] - 0.5) * 0.6 + Math.sin(t * 0.3 + i * 0.001) * 0.1,
    Math.sin(angle) * radius + scatter * 0.5,
  ];
}

/* Butterfly silhouette: two wing lobes (forewing + hindwing), mirrored
   left/right, plus a thin body down the spine. Particles fill the wing
   area (not just trace an outline) so the shape reads clearly at
   particle density, with a slow flutter for life. Scaled up to match
   the visual footprint of the ripple and lattice domains. */
const WING_SCALE = 1.7;

function organicTarget(i: number, seed: Float32Array, t: number): [number, number, number] {
  const s0 = seed[i * 3];
  const s1 = seed[i * 3 + 1];
  const s2 = seed[i * 3 + 2];

  /* ~3.5% of particles form the body/spine */
  if (s0 < 0.035) {
    const along  = (s1 - 0.5) * 2;
    const bodyY  = along * 1.7 * WING_SCALE;
    const wiggle = Math.sin(t * 0.6 + s2 * 3) * 0.03 * WING_SCALE;
    return [wiggle, bodyY, (s2 - 0.5) * 0.12];
  }

  const side       = i % 2 === 0 ? 1 : -1;
  const isForewing = s1 < 0.62; // larger upper wing vs smaller lower (hind) wing

  const rad = Math.sqrt((s0 * 37.13) % 1); // decorrelated, area-uniform radius
  const ang = s2 * Math.PI * 2;

  const cx  = isForewing ? 1.3 : 0.9;
  const cy  = isForewing ? 0.8 : -0.75;
  const rx  = isForewing ? 1.5 : 1.0;
  const ry  = isForewing ? 1.1 : 0.9;
  const rot = isForewing ? -0.3 : 0.3;

  const ex = Math.cos(ang) * rad * rx;
  const ey = Math.sin(ang) * rad * ry;
  const rc = Math.cos(rot), rs = Math.sin(rot);
  let wx = ex * rc - ey * rs + cx;
  const wy = ey * rc + ex * rs + cy;

  /* Slow flutter: wings breathe in/out about the body, like a gentle flap */
  const flutter = 1 + Math.sin(t * 1.0 + (isForewing ? 0 : 1.4)) * 0.06;
  wx *= flutter;

  const drift  = Math.sin(t * 0.3 + s0 * 6) * 0.05;
  const depthZ = (s2 - 0.5) * 1.0 + Math.sin(t * 0.2 + s1 * 6) * 0.15;

  return [side * (wx + drift) * WING_SCALE, wy * WING_SCALE, depthZ];
}

function latticeTarget(i: number, seed: Float32Array, t: number): [number, number, number] {
  const gridSize = Math.ceil(Math.cbrt(PARTICLE_COUNT));
  const gx = (i % gridSize) - gridSize * 0.5;
  const gy = (Math.floor(i / gridSize) % gridSize) - gridSize * 0.5;
  const gz = Math.floor(i / (gridSize * gridSize)) - gridSize * 0.5;
  const flow = Math.sin(t * 0.7 + gx * 0.4 + gy * 0.2) * 0.12;
  return [gx * 0.55 + flow, gy * 0.55 + flow * 0.5, gz * 0.5];
}

function idleTarget(i: number, seed: Float32Array, t: number): [number, number, number] {
  const phi   = Math.acos(1 - (2 * (i + 0.5)) / PARTICLE_COUNT);
  const theta = Math.PI * (1 + Math.sqrt(5)) * i;
  /* Larger radius so the resting field reaches toward the edges of the
     viewport instead of reading as a small, timid cluster mid-screen. */
  const r     = 6.8 + Math.sin(t * 0.15 + seed[i * 3] * 4) * 0.6;
  return [
    r * Math.sin(phi) * Math.cos(theta + t * 0.04),
    r * Math.cos(phi) * 0.62,
    r * Math.sin(phi) * Math.sin(theta + t * 0.04),
  ];
}

function getTargetPosition(
  domain: Domain | null,
  i: number,
  seed: Float32Array,
  t: number
): [number, number, number] {
  if (domain === "rippl")   return orbitalTarget(i, seed, t);
  if (domain === "rozi")    return rippleTarget(i, seed, t);
  if (domain === "realm")   return organicTarget(i, seed, t);
  if (domain === "trmeric") return latticeTarget(i, seed, t);
  return idleTarget(i, seed, t);
}

/* ── Particle colors — darker in light mode for contrast ── */
const DARK_COLORS: Record<string, THREE.Color> = {
  rippl:   new THREE.Color("#4FA8A0"),
  realm:   new THREE.Color("#d9b46a"),
  trmeric: new THREE.Color("#FFA426"),
  rozi:    new THREE.Color("#C2745A"),
  idle:    new THREE.Color("#7a6e58"),
};
const LIGHT_COLORS: Record<string, THREE.Color> = {
  rippl:   new THREE.Color("#246660"),
  realm:   new THREE.Color("#6B5020"),
  trmeric: new THREE.Color("#B87010"),
  rozi:    new THREE.Color("#7A2A14"),
  idle:    new THREE.Color("#3a352E"),
};

function getDomainColor(domain: Domain | null, dark: boolean): THREE.Color {
  const map = dark ? DARK_COLORS : LIGHT_COLORS;
  return map[domain ?? "idle"] ?? map.idle;
}

export default function ParticleField({ domain = null, offsetX = 0 }: ParticleFieldProps) {
  const dark    = useColorScheme();
  const darkRef = useRef(dark);
  darkRef.current = dark;

  const points  = useRef<THREE.Points>(null!);
  const posAttr = useRef<THREE.BufferAttribute>(null!);
  const timeRef = useRef(0);
  const prevDomain = useRef<Domain | null>(domain);
  const morphRef   = useRef(1);
  const domainRef  = useRef<Domain | null>(domain);
  const offsetXRef = useRef(0);
  const offsetXTarget = useRef(offsetX);
  offsetXTarget.current = offsetX;

  const { size, camera } = useThree();

  const seeds = useMemo(() => makeSeeds(PARTICLE_COUNT), []);

  const initialPositions = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const [x, y, z] = idleTarget(i, seeds, 0);
      pos[i * 3] = x; pos[i * 3 + 1] = y; pos[i * 3 + 2] = z;
    }
    return pos;
  }, [seeds]);

  /* Domain change → reset morph */
  if (domain !== domainRef.current) {
    prevDomain.current = domainRef.current;
    domainRef.current  = domain;
    morphRef.current   = 0;
  }

  useFrame((_, delta) => {
    timeRef.current += delta;
    const t = timeRef.current;

    if (!posAttr.current) return;
    const pos = posAttr.current.array as Float32Array;

    /* Morph progress */
    if (morphRef.current < 1) morphRef.current = Math.min(1, morphRef.current + delta / 1.2);
    const morphEased = morphRef.current < 1 ? 1 - Math.pow(1 - morphRef.current, 3) : 1;

    /* Cursor → world space (project onto z=0 plane) */
    const cam = camera as THREE.PerspectiveCamera;
    const fovRad  = (cam.fov * Math.PI) / 180;
    const halfH   = cam.position.z * Math.tan(fovRad / 2);
    const halfW   = halfH * (size.width / size.height);
    const curWX   = cursor.x * halfW;
    const curWY   = cursor.y * halfH;
    const repelRadius = 1.6;
    const repelStr    = 0.28;

    /* Ease the horizontal offset toward its target and apply it as the
       points object's own position (not baked into particle positions) so
       rotation still happens around the shape's own center instead of
       orbiting around world origin. */
    offsetXRef.current += (offsetXTarget.current - offsetXRef.current) * 0.06;
    if (points.current) points.current.position.x = offsetXRef.current * halfW;

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const [tx, ty, tz] = getTargetPosition(domainRef.current,  i, seeds, t);
      const [px, py, pz] = getTargetPosition(prevDomain.current, i, seeds, t);

      const cx = pos[i * 3];
      const cy = pos[i * 3 + 1];
      const cz = pos[i * 3 + 2];

      /* Lerped target */
      const itx = px + (tx - px) * morphEased;
      const ity = py + (ty - py) * morphEased;
      const itz = pz + (tz - pz) * morphEased;

      /* Smooth approach */
      let nx = cx + (itx - cx) * 0.05;
      let ny = cy + (ity - cy) * 0.05;
      const nz = cz + (itz - cz) * 0.05;

      /* Cursor repulsion (XY only) — curWX is world space, particle x is
         local to the (possibly offset) points object, so shift the cursor
         into local space before comparing. */
      const dx   = nx - (curWX - offsetXRef.current * halfW);
      const dy   = ny - curWY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < repelRadius && dist > 0.001) {
        const strength = ((repelRadius - dist) / repelRadius) * repelStr;
        nx += (dx / dist) * strength;
        ny += (dy / dist) * strength;
      }

      pos[i * 3]     = nx;
      pos[i * 3 + 1] = ny;
      pos[i * 3 + 2] = nz;
    }

    posAttr.current.needsUpdate = true;

    /* Rotation */
    if (points.current) {
      if (domainRef.current === "realm") {
        // The butterfly silhouette is flat (built in the XY plane) — free
        // spin would swing it edge-on to the camera at certain angles and
        // read as two odd slivers instead of wings. Ease back to face-on
        // instead of accumulating rotation, with just a faint tilt for life.
        points.current.rotation.y += (0 - points.current.rotation.y) * 0.08;
        points.current.rotation.x += (Math.sin(t * 0.2) * 0.025 - points.current.rotation.x) * 0.08;
      } else {
        const rotSpeed =
          domainRef.current === "trmeric" ? 0.06   // lattice — fastest
          : domainRef.current === "rozi"  ? 0.022  // ripple rings — gentle
          : domainRef.current === "rippl" ? 0.015  // orbital — slow, stately
          : 0.025;                                  // default
        points.current.rotation.y += delta * rotSpeed;
        points.current.rotation.x  = Math.sin(t * 0.08) * 0.06;
      }
    }

    /* Color + opacity */
    const mat = points.current?.material as THREE.PointsMaterial;
    if (mat) {
      mat.color.lerp(getDomainColor(domainRef.current, darkRef.current), 0.03);
      const baseOpacity = darkRef.current ? 0.65 : 0.80;
      mat.opacity = baseOpacity + Math.sin(t * 0.35) * 0.1;
    }
  });

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          ref={posAttr}
          attach="attributes-position"
          args={[initialPositions, 3]}
          count={PARTICLE_COUNT}
        />
      </bufferGeometry>
      <pointsMaterial
        size={size.width < 768 ? 0.038 : 0.024}
        color={getDomainColor(domain, dark)}
        transparent
        opacity={dark ? 0.65 : 0.80}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
