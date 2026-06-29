"use client";

import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import type { Domain } from "@/data/projects";

interface ParticleFieldProps {
  domain?: Domain | null;
}

const PARTICLE_COUNT = 5000;

// ─── Per-particle seed (stable across renders) ───
function makeSeeds(count: number): Float32Array {
  const s = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    s[i * 3] = Math.random();
    s[i * 3 + 1] = Math.random();
    s[i * 3 + 2] = Math.random();
  }
  return s;
}

// ─── Target position calculators ───
function rippleTarget(i: number, seed: Float32Array, t: number): [number, number, number] {
  const rings = 14;
  const ring = Math.floor(i / (PARTICLE_COUNT / rings));
  const angle = (i / (PARTICLE_COUNT / rings)) * Math.PI * 2 + t * 0.08;
  const radius = (ring + 1) * 0.55 + Math.sin(t * 0.4 + ring * 0.5) * 0.25;
  const scatter = (seed[i * 3] - 0.5) * 0.5;
  return [
    Math.cos(angle) * radius + scatter,
    (seed[i * 3 + 1] - 0.5) * 0.6 + Math.sin(t * 0.3 + i * 0.001) * 0.1,
    Math.sin(angle) * radius + scatter * 0.5,
  ];
}

function organicTarget(i: number, seed: Float32Array, t: number): [number, number, number] {
  const angle = (i / PARTICLE_COUNT) * Math.PI * 4;
  const t2 = i / PARTICLE_COUNT;
  // Butterfly wing silhouette (parametric)
  const r = Math.pow(Math.abs(Math.cos(angle * 2)), 0.4) * 3.2;
  const drift = Math.sin(t * 0.25 + seed[i * 3] * 6) * 0.6;
  const breathe = Math.sin(t * 0.5 + seed[i * 3 + 1] * 4) * 0.2;
  return [
    Math.cos(angle) * r + drift,
    Math.sin(angle) * r * 0.55 + breathe + (seed[i * 3 + 2] - 0.5) * 0.4,
    (seed[i * 3] - 0.5) * 2.5 + Math.sin(t * 0.2 + t2 * 6) * 0.3,
  ];
}

function latticeTarget(i: number, seed: Float32Array, t: number): [number, number, number] {
  const gridSize = Math.ceil(Math.cbrt(PARTICLE_COUNT));
  const gx = (i % gridSize) - gridSize * 0.5;
  const gy = (Math.floor(i / gridSize) % gridSize) - gridSize * 0.5;
  const gz = Math.floor(i / (gridSize * gridSize)) - gridSize * 0.5;
  // Data-flow pulse along X axis
  const flow = Math.sin(t * 0.7 + gx * 0.4 + gy * 0.2) * 0.12;
  return [gx * 0.55 + flow, gy * 0.55 + flow * 0.5, gz * 0.5];
}

function idleTarget(i: number, seed: Float32Array, t: number): [number, number, number] {
  // Fibonacci sphere — slow drift
  const phi = Math.acos(1 - (2 * (i + 0.5)) / PARTICLE_COUNT);
  const theta = Math.PI * (1 + Math.sqrt(5)) * i;
  const r = 3.8 + Math.sin(t * 0.15 + seed[i * 3] * 4) * 0.4;
  return [
    r * Math.sin(phi) * Math.cos(theta + t * 0.04),
    r * Math.cos(phi) * 0.55,
    r * Math.sin(phi) * Math.sin(theta + t * 0.04),
  ];
}

function getTargetPosition(
  domain: Domain | null,
  i: number,
  seed: Float32Array,
  t: number
): [number, number, number] {
  if (domain === "rippl") return rippleTarget(i, seed, t);
  if (domain === "realm") return organicTarget(i, seed, t);
  if (domain === "trmeric") return latticeTarget(i, seed, t);
  return idleTarget(i, seed, t);
}

const DOMAIN_COLORS: Record<string, THREE.Color> = {
  rippl: new THREE.Color("#78B9C5"),
  realm: new THREE.Color("#4A9E8E"),
  trmeric: new THREE.Color("#FFA426"),
  idle: new THREE.Color("#4A453E"),
};

function getDomainColor(domain: Domain | null): THREE.Color {
  return DOMAIN_COLORS[domain ?? "idle"] ?? DOMAIN_COLORS.idle;
}

export default function ParticleField({ domain = null }: ParticleFieldProps) {
  const points = useRef<THREE.Points>(null!);
  const posAttr = useRef<THREE.BufferAttribute>(null!);
  const timeRef = useRef(0);
  const prevDomain = useRef<Domain | null>(domain);
  const morphRef = useRef(1); // 0 = prev, 1 = current

  const { size } = useThree();

  const seeds = useMemo(() => makeSeeds(PARTICLE_COUNT), []);

  const initialPositions = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3);
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const [x, y, z] = idleTarget(i, seeds, 0);
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;
    }
    return pos;
  }, [seeds]);

  // Kick off morph when domain changes
  const domainRef = useRef<Domain | null>(domain);
  if (domain !== domainRef.current) {
    prevDomain.current = domainRef.current;
    domainRef.current = domain;
    morphRef.current = 0; // reset morph progress
  }

  useFrame((_, delta) => {
    timeRef.current += delta;
    const t = timeRef.current;

    if (!posAttr.current) return;
    const pos = posAttr.current.array as Float32Array;

    // Advance morph (0→1 over ~1.2s with ease)
    if (morphRef.current < 1) {
      morphRef.current = Math.min(1, morphRef.current + delta / 1.2);
    }
    const morphEased = morphRef.current < 1
      ? 1 - Math.pow(1 - morphRef.current, 3) // cubic ease-out
      : 1;

    // Per-particle: lerp between prev and current target
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const [tx, ty, tz] = getTargetPosition(domainRef.current, i, seeds, t);
      const [px, py, pz] = getTargetPosition(prevDomain.current, i, seeds, t);

      const cx = pos[i * 3];
      const cy = pos[i * 3 + 1];
      const cz = pos[i * 3 + 2];

      // Interpolated target (cross-fade between two behaviours)
      const itx = px + (tx - px) * morphEased;
      const ity = py + (ty - py) * morphEased;
      const itz = pz + (tz - pz) * morphEased;

      // Smooth approach to interpolated target
      const lerpSpeed = 0.05;
      pos[i * 3] = cx + (itx - cx) * lerpSpeed;
      pos[i * 3 + 1] = cy + (ity - cy) * lerpSpeed;
      pos[i * 3 + 2] = cz + (itz - cz) * lerpSpeed;
    }

    posAttr.current.needsUpdate = true;

    // Slow rotation — axis changes per domain
    if (points.current) {
      points.current.rotation.y += delta * (domainRef.current === "trmeric" ? 0.06 : 0.03);
      points.current.rotation.x = Math.sin(t * 0.08) * 0.06;
    }

    // Color lerp
    const mat = points.current?.material as THREE.PointsMaterial;
    if (mat) {
      const target = getDomainColor(domainRef.current);
      mat.color.lerp(target, 0.025);
      mat.opacity = 0.55 + Math.sin(t * 0.4) * 0.08;
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
        size={size.width < 768 ? 0.022 : 0.013}
        color={getDomainColor(domain)}
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
