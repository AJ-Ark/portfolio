"use client";

import { useEffect, useRef, useState } from "react";

/* ═══════════════════════════════════════════════════════════════════
   useInView — tiny IntersectionObserver hook for scroll choreography.

   Returns a `ref` to attach to the observed element and an `inView`
   boolean. `inView` starts false (so SSR markup renders the resting,
   fully-visible state) and flips true once the element intersects the
   viewport. With `once: true` (the default) it never flips back —
   entrance animations play exactly once.

   SSR-safe: the observer is created inside useEffect, and environments
   without IntersectionObserver reveal immediately instead of never.
   ═══════════════════════════════════════════════════════════════════ */

export interface UseInViewOptions {
  /** Disconnect after the first intersection (default true). */
  once?: boolean;
  /** IntersectionObserver threshold (default 0.15). */
  threshold?: number | number[];
  /** IntersectionObserver rootMargin, e.g. "0px 0px -10% 0px". */
  rootMargin?: string;
}

export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewOptions = {}
) {
  const { once = true, threshold = 0.15, rootMargin } = options;
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  /* Stable dep for number | number[] thresholds. */
  const thresholdKey = Array.isArray(threshold)
    ? threshold.join(",")
    : String(threshold);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    /* No IntersectionObserver (very old browsers): show content
       immediately rather than leaving it un-choreographed forever. */
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) observer.disconnect();
          } else if (!once) {
            setInView(false);
          }
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [once, thresholdKey, rootMargin]);

  return { ref, inView };
}

export default useInView;
