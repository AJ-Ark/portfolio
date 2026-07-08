"use client";

import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/* Synchronous check for use inside effects and event handlers. The hook's
   state below is still false during the first post-hydration commit (SSR
   parity), so code that mutates scroll state or starts playback on mount
   must double-check the real media query. */
export function prefersReducedMotionNow(): boolean {
  return typeof window !== "undefined" && window.matchMedia(QUERY).matches;
}

/* Live-tracking hook — the single reduced-motion subscription for the site.
   The initial value must match what the server rendered (hydration parity),
   so pick it per call site: `false` (default) when the pre-knowledge render
   should behave as motion-allowed, or `null` when consumers need a distinct
   "unknown" state (e.g. InlineVideo neither autoplays nor shows its play
   affordance until the preference is known). The real value lands in an
   effect right after hydration. */
export function usePrefersReducedMotion(): boolean;
export function usePrefersReducedMotion(initial: null): boolean | null;
export function usePrefersReducedMotion(
  initial: boolean | null = false
): boolean | null {
  const [reduced, setReduced] = useState<boolean | null>(initial);
  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}
