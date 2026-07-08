"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import useInView from "@/hooks/useInView";
import { prefersReducedMotionNow } from "@/hooks/usePrefersReducedMotion";
import type { TrmColors } from "./PrototypeFrame";

/* GROW THE MARK — the five-ring mark assembles itself once, the first time
   this section scrolls into view: rhizome photograph → traced outline →
   averaged ring form → five golden-ratio rings stroke-drawing themselves
   at their exact weights (12 / 9.71 / 7.85 / 6.35 / 4.99, the same ×0.809
   sequence described in the copy above). Pure CSS transitions, staggered
   by transition-delay — no per-frame JS, no scrub, triggers once.

   Reduced motion: renders the finished mark immediately. This is checked
   BEFORE anything is ever set to a "pre-animation" (hidden/undrawn) state,
   so a reduced-motion visitor never sees so much as a flash of the seed
   state — the default render (SSR, no-JS, crawlers, reduced motion) IS the
   finished mark; only capable, motion-allowing clients ever get armed back
   to the seed state to replay the draw. Same "don't hide what's already
   safe to show" convention as Reveal.tsx.

   Three-mode state machine (not just a `grown` boolean) — this matters:
   arming to "seed" must be INSTANT (transition: none). If arming used the
   same long, staggered transition-delay the real draw uses, a visitor who
   scrolls to this section quickly (within ~1.7s of mount) would promote
   back to "final" WHILE the arm-to-seed transition was still sitting in
   its own delay window, having never painted the seed appearance at all —
   the ring's computed style would never have left "final", so the whole
   draw would silently no-op (verified happening in testing). Splitting
   "seed" (instant, invisible off-screen snap) from "growing" (the one
   transition that actually animates) removes that race entirely. */

const RING_COLORS = ["#FFA426", "#FF981C", "#FF8C13", "#FF7F0A", "#FF7300"];
const RING_STROKES = [12, 9.71, 7.85, 6.35, 4.99]; // outer → inner, ×0.809 each step
const RING_RADII = [150, 121.35, 98.17, 79.42, 64.27];
const CX = 200;
const CY = 200;

/* Three independently-traced (and deliberately jittered) cross-section
   outlines that "average" into the single smooth ring form — a stylised
   recreation of the derivation shown in the photograph and diagram above,
   not additional real photography (same honesty convention as
   IterationStrip's "Schematic · reconstructed" labelling). */
const TRACE_A = "M200,45 C265,42 315,85 330,145 C348,208 325,270 270,308 C220,342 155,338 112,300 C68,258 50,195 70,138 C90,82 140,48 200,45 Z";
const TRACE_B = "M200,65 C245,58 300,78 322,135 C342,195 335,258 288,295 C238,330 170,330 128,292 C82,255 60,205 78,150 C98,95 150,72 200,65 Z";
const TRACE_C = "M200,50 C258,52 310,82 328,142 C350,202 328,262 275,302 C226,338 160,332 118,296 C72,260 58,198 74,142 C92,88 142,48 200,50 Z";
const TRACE_AVERAGED = "M200,55 C255,50 305,80 325,140 C345,200 330,265 280,300 C230,335 165,335 120,298 C75,261 55,200 72,145 C89,90 145,60 200,55 Z";

type Mode = "static" | "seed" | "growing";

export default function GrowTheMark({ colors: c }: { colors: TrmColors }) {
  const { ref, inView } = useInView<HTMLDivElement>({ once: true, threshold: 0.45, rootMargin: "0px 0px -10% 0px" });
  const [mode, setMode] = useState<Mode>("static");

  /* Arm the seed state once, client-side — instantly, no transition —
     skipping anything already on screen at mount (an above-the-fold mark
     snapping to "seed" and re-growing would just be the value-flash
     Reveal.tsx already guards against) and skipping entirely under
     reduced motion. */
  useEffect(() => {
    if (prefersReducedMotionNow()) return;
    const el = ref.current;
    if (el && el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    setMode("seed");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* The one real trigger: promote to the animated draw once armed AND in view. */
  useEffect(() => {
    if (mode === "seed" && inView) setMode("growing");
  }, [mode, inView]);

  const grown = mode !== "seed"; // "static" and "growing" both show the final/grown target
  const animated = mode === "growing"; // only this transition is ever allowed to take time

  return (
    <div ref={ref} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.2rem" }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 380,
          aspectRatio: "1 / 1",
        }}
        role="img"
        aria-label="Animated derivation of the trmeric mark: a rhizome cross-section photograph traces into an outline, averages into a ring form, then five golden-ratio rings stroke-draw themselves at their exact weights."
      >
        {/* photograph — fades out as the traced outline fades in */}
        <Image
          src="/images/trmeric/logo-story/04.png"
          alt=""
          aria-hidden="true"
          fill
          sizes="380px"
          style={{
            objectFit: "cover",
            borderRadius: "50%",
            opacity: grown ? 0 : 1,
            transition: animated ? "opacity 900ms ease" : "none",
          }}
        />
        <svg viewBox="0 0 400 400" aria-hidden="true" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
          {/* three jittered traces — visible only during the seed state, fading out as the averaged outline fades up */}
          {[TRACE_A, TRACE_B, TRACE_C].map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke={c.faint}
              strokeWidth={1}
              style={{
                opacity: grown ? 0 : 0.4,
                transition: animated ? `opacity 700ms ease ${850 + i * 90}ms` : "none",
              }}
            />
          ))}
          {/* the single averaged outline they resolve into */}
          <path
            d={TRACE_AVERAGED}
            fill="none"
            stroke={c.accd}
            strokeWidth={2}
            style={{
              opacity: grown ? 0 : 1,
              transition: animated ? "opacity 900ms ease 800ms" : "none",
            }}
          />
          {/* five golden-ratio rings, stroke-drawn outer → inner */}
          {RING_RADII.map((r, i) => {
            const circumference = 2 * Math.PI * r;
            return (
              <circle
                key={i}
                cx={CX}
                cy={CY}
                r={r}
                fill="none"
                stroke={RING_COLORS[i]}
                strokeWidth={RING_STROKES[i]}
                strokeLinecap="round"
                transform={`rotate(-90 ${CX} ${CY})`}
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: grown ? 0 : circumference,
                  opacity: grown ? 1 : 0,
                  transition: animated
                    ? `stroke-dashoffset 1100ms ease-out ${1700 + i * 190}ms, opacity 260ms ease ${1700 + i * 190}ms`
                    : "none",
                }}
              />
            );
          })}
        </svg>
      </div>
      <p style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".14em", textTransform: "uppercase", color: c.faint, textAlign: "center", maxWidth: "44ch" }}>
        Rendered live, not a screenshot · photograph → traced outline → averaged form → five golden-ratio rings
      </p>
    </div>
  );
}
