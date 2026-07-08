"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { driveFrame, publishScroll } from "@/lib/climate";

declare global {
  interface Window {
    /** Single shared Lenis instance, escape-hatched for components that
     *  need to pause/resume page-level smooth scroll (e.g. a scroll-hijacked
     *  pagination block) without threading a context through the tree. */
    __lenis?: Lenis;
  }
}

/* ══════════════════════════════════════════════════════════════════
   SmoothScroll owns THE single rAF clock for the whole site:
   Lenis ticks → scroll velocity/progress publish into the climate
   store → driveFrame() advances the climate and every registered
   frame driver (the R3F canvas). One loop, one timeline.

   The loop pauses on visibilitychange (hidden) and resumes on return;
   the climate store's backup clock (see GlobalCanvas) covers the
   pathological case where Lenis never constructs.
   ══════════════════════════════════════════════════════════════════ */

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;
    window.__lenis = lenis;

    let raf = 0;
    let running = false;

    function tick(time: number) {
      lenis.raf(time);

      /* Publish scroll state into the climate store. Velocity is
         normalized against viewport height so "one screen per second"
         reads the same on any display. */
      const vh = Math.max(1, window.innerHeight);
      const velocityNorm = (lenis.velocity ?? 0) / vh * 8;
      const progress = Number.isFinite(lenis.progress) ? lenis.progress : 0;
      publishScroll(velocityNorm, progress);

      /* Advance climate + every registered driver (the WebGL canvas). */
      driveFrame(time);

      raf = requestAnimationFrame(tick);
    }

    const start = () => {
      if (running) return;
      running = true;
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    start();

    /* Pause all rendering work while the tab is hidden. */
    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  return <>{children}</>;
}
