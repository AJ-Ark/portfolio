"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import useInView from "@/hooks/useInView";
import { prefersReducedMotionNow } from "@/hooks/usePrefersReducedMotion";

/* Screen-reader-only — globals.css has no .sr-only utility and is owned
   elsewhere, so the clip pattern lives here inline (same pattern as
   HomeReel.tsx / loading.tsx). */
const VISUALLY_HIDDEN: CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
  border: 0,
};

interface ParsedStat {
  prefix: string;
  number: number;
  decimals: number;
  suffix: string;
}

/* Splits "99.8%", "+72", "36" into a prefix/suffix the animation preserves
   and a numeric magnitude (with its original decimal precision) to count
   from 0 → value. Strings with no leading/embedded number (shouldn't occur
   in this file's callers) fall through to null and render as plain text. */
function parseStat(value: string): ParsedStat | null {
  const m = /^([^\d]*)(\d+(?:\.\d+)?)(.*)$/.exec(value);
  if (!m) return null;
  const [, prefix, numStr, suffix] = m;
  const decimals = numStr.includes(".") ? numStr.split(".")[1].length : 0;
  return { prefix, number: parseFloat(numStr), decimals, suffix };
}

function format(p: ParsedStat, n: number): string {
  return `${p.prefix}${n.toFixed(p.decimals)}${p.suffix}`;
}

interface CountUpProps {
  /** The final, real value exactly as it should read — e.g. "99.8%", "+72". */
  value: string;
  durationMs?: number;
  style?: CSSProperties;
  className?: string;
}

/**
 * A stat that counts up from 0 the first time it scrolls into view.
 *
 * SSR / no-JS / crawlers always see the real final value — that is this
 * component's one and only initial render everywhere. The "arm to zero,
 * then count up" treatment is applied client-side only, in an effect, and
 * only to stats that were NOT already on screen at mount (an
 * already-visible stat snapping to 0 and re-counting would just be the
 * value-flash equivalent of the opacity flash Reveal.tsx guards against).
 * Reduced motion: stays at the final value, no animation, ever.
 */
export default function CountUp({ value, durationMs = 1400, style, className }: CountUpProps) {
  /* Memoized on `value` alone — the rAF loop below calls setDisplay every
     frame, which re-renders this component every frame. An unmemoized
     parseStat(value) would hand the second effect a NEW object identity
     each of those renders, and since that object is one of the effect's
     deps, React would cancel-and-rerun it every frame; phase.current is
     already "done" by then, so the guard short-circuits and the animation
     dies after its first tick. Memoizing keeps the dependency stable
     across the animation's own re-renders. */
  const parsed = useMemo(() => parseStat(value), [value]);
  const { ref, inView } = useInView<HTMLSpanElement>({
    once: true,
    threshold: 0.6,
    rootMargin: "0px 0px -10% 0px",
  });
  const [display, setDisplay] = useState(value);
  const phase = useRef<"final" | "armed" | "done">("final");

  useEffect(() => {
    if (!parsed || prefersReducedMotionNow()) return;
    const el = ref.current;
    if (el && el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    phase.current = "armed";
    setDisplay(format(parsed, 0));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!parsed || phase.current !== "armed" || !inView) return;
    phase.current = "done";
    const target = parsed.number;
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const u = Math.min(1, (t - t0) / durationMs);
      const eased = 1 - Math.pow(1 - u, 3); // ease-out cubic
      setDisplay(format(parsed, target * eased));
      if (u < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, parsed, durationMs]);

  if (!parsed) {
    return (
      <span ref={ref} className={className} style={style}>
        {value}
      </span>
    );
  }

  return (
    <span ref={ref} className={className} style={style}>
      <span aria-hidden="true">{display}</span>
      <span style={VISUALLY_HIDDEN}>{value}</span>
    </span>
  );
}
