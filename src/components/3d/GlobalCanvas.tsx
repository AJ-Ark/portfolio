"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import ParticleField from "./ParticleField";
import { useParticle } from "@/lib/particleContext";

export default function GlobalCanvas() {
  const { activeDomain, previewOffsetX, warping } = useParticle();

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, 1.5]}
        style={{ width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          {/* During the warp the cluster recenters (offset 0) so the camera
              dives straight into it rather than past its edge. */}
          <ParticleField domain={activeDomain} offsetX={warping ? 0 : previewOffsetX} warping={warping} />
        </Suspense>
      </Canvas>
    </div>
  );
}
