"use client";

import { useEffect, useState } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

/* Manual override channel. A visible in-nav toggle (MotionToggle) can force
   motion on or off regardless of the OS setting. The chosen value lives in
   two mirrored places, checked before the OS media query:
     • html[data-motion="reduce"|"full"]  — the authoritative live source
     • localStorage 'aj_motion'           — persistence across reloads
   MotionToggle keeps both in sync and dispatches 'aj:motion-change' so this
   module can re-read reactively. */
export const MOTION_ATTR = "data-motion";
export const MOTION_STORAGE_KEY = "aj_motion";
export const MOTION_EVENT = "aj:motion-change";

/* Synchronous check for use inside effects and event handlers. The hook's
   state below is still false during the first post-hydration commit (SSR
   parity), so code that mutates scroll state or starts playback on mount
   must double-check the real preference. Resolution order: manual attribute →
   stored override → OS media query. */
export function prefersReducedMotionNow(): boolean {
  if (typeof window === "undefined") return false;
  const attr = document.documentElement.getAttribute(MOTION_ATTR);
  if (attr === "reduce") return true;
  if (attr === "full") return false;
  try {
    const stored = localStorage.getItem(MOTION_STORAGE_KEY);
    if (stored === "reduce") return true;
    if (stored === "full") return false;
  } catch {
    /* private-mode / disabled storage — fall through to the OS query */
  }
  return window.matchMedia(QUERY).matches;
}

/* Live-tracking hook — the single reduced-motion subscription for the site.
   The initial value must match what the server rendered (hydration parity),
   so pick it per call site: `false` (default) when the pre-knowledge render
   should behave as motion-allowed, or `null` when consumers need a distinct
   "unknown" state (e.g. InlineVideo neither autoplays nor shows its play
   affordance until the preference is known). The real value lands in an
   effect right after hydration and then tracks both the OS media query and
   the manual toggle's 'aj:motion-change' event. */
export function usePrefersReducedMotion(): boolean;
export function usePrefersReducedMotion(initial: null): boolean | null;
export function usePrefersReducedMotion(
  initial: boolean | null = false
): boolean | null {
  const [reduced, setReduced] = useState<boolean | null>(initial);
  useEffect(() => {
    const mq = window.matchMedia(QUERY);
    const update = () => setReduced(prefersReducedMotionNow());
    update();
    mq.addEventListener("change", update);
    window.addEventListener(MOTION_EVENT, update);
    return () => {
      mq.removeEventListener("change", update);
      window.removeEventListener(MOTION_EVENT, update);
    };
  }, []);
  return reduced;
}
