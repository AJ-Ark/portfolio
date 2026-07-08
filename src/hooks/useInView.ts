"use client";

import { useEffect, useRef, useState } from "react";

/* ═══════════════════════════════════════════════════════════════════
   useInView — tiny IntersectionObserver hook for scroll choreography.

   Returns a `ref` to attach to the observed element and an `inView`
   boolean. `inView` starts false (so SSR markup renders the resting,
   fully-visible state) and flips true once the element intersects the
   viewport. With `once: true` (the default) it never flips back —
   entrance animations play exactly once.

   SSR-safe: the observer is pooled/created inside useEffect, and environments
   without IntersectionObserver reveal immediately instead of never.

   OBSERVER POOLING: every distinct (threshold, rootMargin) pair shares ONE
   IntersectionObserver across all elements that use it (the root is always the
   viewport). A page like /rozi mounts ~11 useInView hooks with identical
   options — pooling collapses those 11 observers into 1. A module-level Map
   keyed by the serialized options holds each pooled observer plus a per-element
   WeakMap of callbacks; the shared observer's own callback dispatches each
   entry to the right element's handler. A ref-count retires (disconnects) an
   observer once its last element unobserves. `once` is handled per-element in
   the callback (it unobserves just that node), so hooks with different `once`
   values still share the observer. Return API and observed behavior are
   unchanged; reduced-motion is handled entirely by the [data-reveal] CSS, so
   this hook stays motion-neutral.
   ═══════════════════════════════════════════════════════════════════ */

export interface UseInViewOptions {
  /** Disconnect after the first intersection (default true). */
  once?: boolean;
  /** IntersectionObserver threshold (default 0.15). */
  threshold?: number | number[];
  /** IntersectionObserver rootMargin, e.g. "0px 0px -10% 0px". */
  rootMargin?: string;
}

/* ── Observer pool (module-level, client-only usage) ── */
type EntryCallback = (entry: IntersectionObserverEntry) => void;

interface PooledObserver {
  observer: IntersectionObserver;
  /** element → its handler. WeakMap: never pins a detached node in memory. */
  callbacks: WeakMap<Element, EntryCallback>;
  /** live observed-element count; when it hits 0 the observer is retired. */
  count: number;
}

const observerPool = new Map<string, PooledObserver>();

function getPooledObserver(
  key: string,
  init: IntersectionObserverInit
): PooledObserver {
  let pooled = observerPool.get(key);
  if (!pooled) {
    const callbacks = new WeakMap<Element, EntryCallback>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        const cb = callbacks.get(entry.target);
        if (cb) cb(entry);
      }
    }, init);
    pooled = { observer, callbacks, count: 0 };
    observerPool.set(key, pooled);
  }
  return pooled;
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

    /* Pool key: elements sharing options share one observer. The key encodes
       exactly the fields that define the observer's config (root is always the
       viewport); `once` is intentionally excluded — it's per-element. */
    const key = `${thresholdKey}|${rootMargin ?? ""}`;
    const pooled = getPooledObserver(key, { threshold, rootMargin });

    let released = false;
    const release = () => {
      if (released) return;
      released = true;
      pooled.observer.unobserve(node);
      pooled.callbacks.delete(node);
      pooled.count -= 1;
      /* Retire the shared observer once nobody is left using it, so a pooled
         observer is never leaked for a config that's no longer on the page. */
      if (pooled.count <= 0) {
        pooled.observer.disconnect();
        observerPool.delete(key);
      }
    };

    pooled.callbacks.set(node, (entry) => {
      if (entry.isIntersecting) {
        setInView(true);
        /* once: stop observing THIS node only — never disconnect the shared
           observer out from under other elements still using it. */
        if (once) release();
      } else if (!once) {
        setInView(false);
      }
    });
    pooled.count += 1;
    pooled.observer.observe(node);

    return release;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [once, thresholdKey, rootMargin]);

  return { ref, inView };
}

export default useInView;
