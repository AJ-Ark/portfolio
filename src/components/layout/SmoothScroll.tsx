"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";

declare global {
  interface Window {
    /** Single shared Lenis instance, escape-hatched for components that
     *  need to pause/resume page-level smooth scroll (e.g. a scroll-hijacked
     *  pagination block) without threading a context through the tree. */
    __lenis?: Lenis;
  }
}

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

    let raf: number;
    function tick(time: number) {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  return <>{children}</>;
}
