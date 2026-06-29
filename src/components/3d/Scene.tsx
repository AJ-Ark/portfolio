"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import ParticleField from "./ParticleField";
import type { Domain } from "@/data/projects";

interface SceneProps {
  domain?: Domain | null;
  className?: string;
  style?: React.CSSProperties;
}

export default function Scene({ domain = null, className = "", style }: SceneProps) {
  return (
    <Canvas
      className={className}
      style={style}
      camera={{ position: [0, 0, 10], fov: 60 }}
      gl={{
        antialias: false,
        alpha: true,
        powerPreference: "high-performance",
      }}
      dpr={[1, 1.5]}
    >
      <Suspense fallback={null}>
        <ParticleField domain={domain} />
      </Suspense>
    </Canvas>
  );
}
