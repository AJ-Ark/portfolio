"use client";

import {
  createElement,
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { DURATION, REVEAL_DISTANCE, STAGGER } from "@/lib/motion";
import { prefersReducedMotionNow } from "@/hooks/usePrefersReducedMotion";

interface RevealProps {
  children?: ReactNode;
  /** Rendered element — any intrinsic HTML tag. */
  as?: keyof HTMLElementTagNameMap;
  /** Delay in seconds before the reveal (or before the first staggered child). */
  delay?: number;
  /** Travel distance in px (opacity 0→1, y→0). */
  y?: number;
  /** Stagger direct children: `true` = the standard 0.1s beat, or a custom
      interval in seconds. Children are animated in place — never wrapped. */
  stagger?: boolean | number;
  className?: string;
  style?: CSSProperties;
}

/**
 * Universal scroll-reveal primitive — the ONLY way static sections should
 * enter. CSS-driven and SSR-safe by construction:
 *
 *  - The server HTML ships fully visible (no hidden styles), so content
 *    renders without JS, before hydration, and for crawlers — and the LCP
 *    element is never opacity:0.
 *  - After hydration, elements still below the first viewport get
 *    [data-reveal] (hidden via globals.css) and flip to [data-reveal="in"]
 *    when they enter view; the transition tokens live in globals.css.
 *  - Both attributes are removed once the transition finishes, so the
 *    reveal rules can never linger on an element's own transitions.
 *  - Reduced motion: nothing is ever hidden (checked here and belt-and-
 *    braces in the globals.css media query).
 *
 *   <Reveal as="section" className="…">…</Reveal>
 *   <Reveal stagger>{cards}</Reveal>
 */
export default function Reveal({
  children,
  as = "div",
  delay = 0,
  y = REVEAL_DISTANCE,
  stagger = false,
  className,
  style,
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotionNow()) return;

    /* Elements already inside (or above) the first viewport stay visible —
       hiding them after paint would flash content out and back in. The 10%
       bottom margin mirrors the observer's rootMargin below. */
    const fold = window.innerHeight * 0.9;
    if (el.getBoundingClientRect().top < fold) return;

    const interval = stagger === true ? STAGGER : stagger || 0;
    const targets =
      interval > 0 ? (Array.from(el.children) as HTMLElement[]) : [el];

    targets.forEach((t, i) => {
      t.style.setProperty("--reveal-y", `${y}px`);
      t.style.setProperty("--reveal-delay", `${delay + i * interval}s`);
      t.setAttribute("data-reveal", "");
    });

    const cleanup = () => {
      targets.forEach((t) => {
        t.removeAttribute("data-reveal");
        t.style.removeProperty("--reveal-y");
        t.style.removeProperty("--reveal-delay");
      });
    };

    let timer = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        targets.forEach((t) => t.setAttribute("data-reveal", "in"));
        /* Restore pristine styles after the last child has finished, so the
           reveal transition can't delay or override later hover/theme
           transitions on the same elements. */
        const total =
          (delay + interval * (targets.length - 1) + DURATION.base) * 1000;
        timer = window.setTimeout(cleanup, total + 200);
      },
      { rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      window.clearTimeout(timer);
      cleanup();
    };
  }, [delay, y, stagger]);

  return createElement(as, { ref, className, style }, children);
}
