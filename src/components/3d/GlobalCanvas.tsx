"use client";

/* ══════════════════════════════════════════════════════════════════
   GLOBAL CANVAS — one fixed, full-viewport canvas behind every page.

   Engine selection happens here:
   • gpu  → DustField (custom RawShaderMaterial, 8–40k particles)
   • cpu  → the original ParticleField (5k PointsMaterial dots) when
            WebGL2 exists but the shaders fail to compile, on software
            rasterizers, or with the ?cpu-particles debug flag
   • none → no WebGL2 at all: no canvas, page runs field-less

   frameloop="never": rendering is driven by the single Lenis rAF clock
   in SmoothScroll via the climate store (registerFrameDriver → R3F
   advance). A watchdog spins up a backup clock if Lenis never drives.
   ══════════════════════════════════════════════════════════════════ */

import { Canvas, advance, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import ParticleField from "./ParticleField";
import DustField from "./engine/DustField";
import { detectTier, type EngineTier } from "./engine/tier";
import { useParticle } from "@/lib/particleContext";
import { useColorScheme } from "@/hooks/useColorScheme";
import {
  applyClimatePreset,
  ensureBackupClock,
  stopBackupClock,
  initPointerTracking,
  lastDriveAge,
  markEngineReady,
  registerFrameDriver,
} from "@/lib/climate";

/* CPU fallback has no text bake — its first frame IS engine readiness. */
function ReadyProbe() {
  const done = useRef(false);
  useFrame(() => {
    if (!done.current) {
      done.current = true;
      markEngineReady();
    }
  });
  return null;
}

export default function GlobalCanvas() {
  const { activeDomain, activeFormation, formationOffsetX, warping, warpMode } = useParticle();
  const dark = useColorScheme();

  /* Tier detection probes a WebGL2 context and preflight-compiles the
     engine shaders — main-thread work that must NOT run mid-hydration.
     Deferred to an effect: nothing renders until the tier resolves (one
     frame of delay; engineReady's failsafe covers the pathological
     cases). detectTier() caches, so this costs once per session. */
  const [tier, setTier] = useState<EngineTier | null>(null);
  useEffect(() => {
    setTier(detectTier());
  }, []);

  /* This canvas renders when the single Lenis clock ticks.
     UNIT CONTRACT: the climate store hands drivers the rAF timestamp in
     MILLISECONDS, but R3F's advance() under frameloop="never" expects
     SECONDS (it diffs the timestamp against clock.elapsedTime to derive
     each useFrame delta). Convert here — passing ms inflates every
     delta ~1000x and saturates/blows past the motion clamps. */
  useEffect(() => registerFrameDriver((t) => advance(t / 1000)), []);

  /* Cursor NDC + velocity tracking for the climate store. */
  useEffect(() => initPointerTracking(), []);

  /* Route domain / preview / theme → climate targets. */
  useEffect(() => {
    applyClimatePreset(activeFormation, activeDomain, dark);
  }, [activeFormation, activeDomain, dark]);

  /* Watchdog: if the external clock goes quiet while visible, self-drive.
     Plus a readiness failsafe so engineReady() can never hang. */
  useEffect(() => {
    const iv = window.setInterval(() => {
      if (!document.hidden && lastDriveAge() > 1000) ensureBackupClock();
    }, 1000);
    const failsafe = window.setTimeout(() => markEngineReady(), 8000);
    return () => {
      window.clearInterval(iv);
      window.clearTimeout(failsafe);
      stopBackupClock();
    };
  }, []);

  /* No WebGL2 → no field; release anything awaiting the engine. */
  useEffect(() => {
    if (tier?.mode === "none") markEngineReady();
  }, [tier]);

  /* Tier not resolved yet (pre-effect) or no WebGL2 at all → no canvas. */
  if (!tier || tier.mode === "none") return null;

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
        frameloop="never"
        camera={{ position: [0, 0, 10], fov: 60 }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: "high-performance",
        }}
        dpr={[1, tier.maxDpr]}
        style={{ width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          {tier.mode === "gpu" ? (
            /* During the warp the cluster recenters (offset 0) so the
               camera dives straight into it rather than past its edge —
               formationOffsetX already resolves to 0 while warping. */
            <DustField
              formation={activeFormation}
              offsetX={formationOffsetX}
              warping={warping}
              warpMode={warpMode}
              count={tier.count}
            />
          ) : (
            /* CPU fallback — the original field, untouched. It only
               understands domain formations and the inward dive, so
               reverse warps degrade to a plain chrome fade. */
            <>
              <ParticleField
                domain={activeDomain}
                offsetX={formationOffsetX}
                warping={warping && warpMode !== "out"}
              />
              <ReadyProbe />
            </>
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
