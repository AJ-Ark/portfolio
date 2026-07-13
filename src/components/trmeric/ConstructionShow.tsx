"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import useInView from "@/hooks/useInView";
import { usePrefersReducedMotion, prefersReducedMotionNow } from "@/hooks/usePrefersReducedMotion";
import type { TrmColors } from "./PrototypeFrame";
import {
  STACK,
  ARCS,
  MARK,
  BOTTOM_DOTS,
  ARRAY_DOTS,
  CALIPERS,
  RULERS,
  CLIP_BARS,
  CLIP_MAIN,
} from "./goldenDiagram";

/* THE CONSTRUCTION — one continuous show, two acts, one timeline.

   ACT I · THE FORM (absorbed from GrowTheMark): the rhizome photograph
   gives way to its traced outlines, the traces average into a ring form,
   and the five real rings stroke-draw themselves at their authored
   weights — the mark, grown.

   ACT II · THE PROPORTION (the authored Logo_golden.svg diagram, exact
   vectors): the stage cross-fades to the construction diagram — stroke
   gauges appear, take the spin up the sweep arcs, land as the sizing
   array (each dot ×0.809 of the last), calipers hand each gauge back to
   its ring, and the ring stack settles.

   Same three-mode machine as before (static | seed | growing): the
   default render is the finished Act II diagram (SSR / no-JS /
   reduced-motion all see it complete); motion-allowing clients arm back
   to "seed" and play the full two-act show once in view, then settle to
   "static" so hover isolation is instant. Hovering any ring, dot, bar or
   swatch isolates that ring across whichever act is on stage. */

/* ── Act II timeline (ms), offset to start after Act I ── */
const OFF = 4300;
const T = {
  dot: (i: number) => OFF + 200 + i * 150,
  arc: (i: number) => OFF + 1150 + i * 150,
  TRAVEL: 1300,
  arrive: (i: number) => OFF + (i < 4 ? 2480 + i * 150 : 3260),
  ruler0: OFF + 2620,
  ruler4: OFF + 3380,
  cal: (i: number) => OFF + 3560 + i * 230,
  bar: (i: number) => OFF + 3760 + i * 230,
  fall: (i: number) => OFF + 3920 + i * 230,
  SETTLE: OFF + 5700,
};

/* ── Act I timeline (ms) ── */
const T1 = {
  photoOut: 0,       // photograph fades as the traces take over (900ms)
  trace: (i: number) => 850 + i * 90,
  averagedOut: 800,
  ring: (i: number) => 1700 + i * 190, // stroke-draw, 1200ms each
  layerOut: 3850,    // whole act fades off stage (450ms)
  layerIn: 4150,     // act II fades on
};

/* Stylised derivation traces (authored in a 400×400 box), from the
   GrowTheMark sequence — scaled into the mark's native viewBox. */
const TRACE_A = "M200,45 C265,42 315,85 330,145 C348,208 325,270 270,308 C220,342 155,338 112,300 C68,258 50,195 70,138 C90,82 140,48 200,45 Z";
const TRACE_B = "M200,65 C245,58 300,78 322,135 C342,195 335,258 288,295 C238,330 170,330 128,292 C82,255 60,205 78,150 C98,95 150,72 200,65 Z";
const TRACE_C = "M200,50 C258,52 310,82 328,142 C350,202 328,262 275,302 C226,338 160,332 118,296 C72,260 58,198 74,142 C92,88 142,48 200,50 Z";
const TRACE_AVERAGED = "M200,55 C255,50 305,80 325,140 C345,200 330,265 280,300 C230,335 165,335 120,298 C75,261 55,200 72,145 C89,90 145,60 200,55 Z";
const TRACE_FIT = `scale(${(260.8 / 400).toFixed(4)} ${(262.48 / 400).toFixed(4)})`;

type Mode = "static" | "seed" | "growing";

export default function ConstructionShow({ colors: c }: { colors: TrmColors }) {
  const { ref, inView } = useInView<HTMLDivElement>({ once: true, threshold: 0.3, rootMargin: "0px 0px -8% 0px" });
  const [mode, setMode] = useState<Mode>("static");
  const [hover, setHover] = useState<number | null>(null);
  const [motionPathOK, setMotionPathOK] = useState(false);
  const reducedLive = usePrefersReducedMotion();

  useEffect(() => {
    setMotionPathOK(
      typeof CSS !== "undefined" && CSS.supports("offset-path", 'path("M0 0 L1 1")')
    );
  }, []);

  /* Arm the seed state once, client-side, instantly — skipping anything
     already on screen at mount and skipping under reduced motion. */
  useEffect(() => {
    if (prefersReducedMotionNow()) return;
    const el = ref.current;
    if (el && el.getBoundingClientRect().top < window.innerHeight * 0.9) return;
    setMode("seed");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (mode === "seed" && inView) setMode("growing");
  }, [mode, inView]);

  /* Settle to "static" after the full show so hover transitions drop the
     staggered delays. */
  useEffect(() => {
    if (mode !== "growing") return;
    const t = setTimeout(() => setMode("static"), T.SETTLE);
    return () => clearTimeout(t);
  }, [mode]);

  const replay = () => {
    if (prefersReducedMotionNow()) return;
    setMode("seed");
    requestAnimationFrame(() => requestAnimationFrame(() => setMode("growing")));
  };

  const grown = mode !== "seed";
  const animated = mode === "growing";
  /* Seed must SNAP to the hidden state (no transition): replay arms seed for
     only two animation frames before promoting to "growing" — any transition
     here means elements barely start fading, then the growing branch's long
     delays freeze them at ~full opacity and the previous render stays on
     stage for the whole run. The .2s ease is for hover-dim in "static" only. */
  const idle = mode === "seed" ? "none" : "opacity .2s ease";

  const mono = (size: string): React.CSSProperties => ({
    fontFamily: "var(--font-mono)",
    fontSize: size,
    letterSpacing: ".16em",
    textTransform: "uppercase",
  });

  const dim = (i: number) => (hover === null ? 1 : hover === i ? 1 : 0.12);

  const fade = (delay: number, dur = 420): React.CSSProperties => ({
    opacity: grown ? 1 : 0,
    transition: animated ? `opacity ${dur}ms ease ${delay}ms` : idle,
  });
  const pop = (delay: number): React.CSSProperties => ({
    opacity: grown ? 1 : 0,
    transform: grown ? "scale(1)" : "scale(.2)",
    transformBox: "fill-box",
    transformOrigin: "center",
    transition: animated
      ? `opacity 320ms ease ${delay}ms, transform 420ms cubic-bezier(.2,1.4,.4,1) ${delay}ms`
      : idle,
  });

  const svgText = (size: number): React.CSSProperties => ({
    fontFamily: "var(--font-mono)",
    fontSize: size,
    letterSpacing: ".08em",
  });

  const actCaption: React.CSSProperties = {
    position: "absolute",
    left: "1.2rem",
    bottom: ".9rem",
    ...mono(".52rem"),
    letterSpacing: ".18em",
    pointerEvents: "none",
  };

  return (
    <div
      ref={ref}
      className="trm-gold"
      data-mode={mode}
      style={{ border: `1px solid ${c.line}`, borderRadius: 14, overflow: "hidden", background: c.base }}
    >
      <style>{`
        @keyframes trmGoldTravel {
          0%   { offset-distance: 100%; opacity: 0; }
          6%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { offset-distance: 0%; opacity: 0; }
        }
        .trm-gold[data-mode="growing"] .trm-gold-trav {
          animation: trmGoldTravel var(--dur) cubic-bezier(.5,.05,.35,1) var(--delay) both;
        }
        .trm-gold:not([data-mode="growing"]) .trm-gold-trav { opacity: 0; }
      `}</style>

      {/* header */}
      <div
        style={{
          padding: ".8rem 1.2rem",
          borderBottom: `1px solid ${c.line}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <span style={{ display: "flex", alignItems: "baseline", gap: ".7rem", flexWrap: "wrap" }}>
          <span style={{ ...mono(".62rem"), color: c.accd }}>The construction</span>
          <span style={{ ...mono(".55rem"), color: c.dim }}>
            · the mark grows itself — form first, then proportion
          </span>
        </span>
        {reducedLive !== true && (
          <button
            onClick={replay}
            style={{
              ...mono(".52rem"),
              color: c.accd,
              background: "transparent",
              border: `1px solid ${c.line}`,
              borderRadius: 999,
              padding: ".35rem .85rem",
              cursor: "pointer",
            }}
          >
            ↺ Replay
          </button>
        )}
      </div>

      {/* stage — two acts, one frame */}
      <div
        role="img"
        aria-label="Two-act construction of the trmeric mark. Act one, the form: a rhizome photograph gives way to traced outlines that average into a ring form, and the five rings draw themselves at their authored stroke weights. Act two, the proportion: the stage becomes the golden-ratio diagram — stroke gauges sweep up into a sizing array of five dots, each 0.809 times the previous, from 12 pixels down to 4.99, and calipers hand each gauge back into the ring stack."
        style={{ position: "relative", aspectRatio: "874/538" }}
      >
        {/* ── ACT I · THE FORM ── */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: animated || mode === "seed" ? (grown ? 0 : 1) : 0,
            transition: animated ? `opacity 450ms ease ${T1.layerOut}ms` : "none",
            pointerEvents: "none",
          }}
        >
          <div style={{ position: "relative", height: "84%", aspectRatio: "1/1" }}>
            <Image
              src="/images/trmeric/logo-story/04.png"
              alt=""
              fill
              sizes="500px"
              style={{
                objectFit: "cover",
                borderRadius: "50%",
                opacity: grown ? 0 : 1,
                transition: animated ? `opacity 900ms ease ${T1.photoOut}ms` : "none",
              }}
            />
            <svg viewBox="0 0 260.8 262.48" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
              <g transform={TRACE_FIT}>
                {[TRACE_A, TRACE_B, TRACE_C].map((d, i) => (
                  <path
                    key={i}
                    d={d}
                    fill="none"
                    stroke={c.faint}
                    strokeWidth={1.6}
                    style={{
                      opacity: grown ? 0 : 0.4,
                      transition: animated ? `opacity 700ms ease ${T1.trace(i)}ms` : "none",
                    }}
                  />
                ))}
                <path
                  d={TRACE_AVERAGED}
                  fill="none"
                  stroke={c.accd}
                  strokeWidth={3}
                  style={{
                    opacity: grown ? 0 : 1,
                    transition: animated ? `opacity 900ms ease ${T1.averagedOut}ms` : "none",
                  }}
                />
              </g>
              {MARK.map((r, i) => (
                <path
                  key={r.hex}
                  d={r.d}
                  fill="none"
                  stroke={r.hex}
                  strokeWidth={r.width}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  pathLength={1}
                  style={{
                    strokeDasharray: 1,
                    strokeDashoffset: grown ? 0 : 1,
                    opacity: grown ? 1 : 0,
                    transition: animated
                      ? `stroke-dashoffset 1200ms ease-out ${T1.ring(i)}ms, opacity 260ms ease ${T1.ring(i)}ms`
                      : "none",
                  }}
                />
              ))}
            </svg>
          </div>
        </div>

        {/* ── ACT II · THE PROPORTION ── */}
        <svg
          viewBox="80 248 874 538"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            opacity: grown ? 1 : 0,
            transition: animated ? `opacity 450ms ease ${T1.layerIn}ms` : "none",
          }}
          onMouseLeave={() => setHover(null)}
        >
          <defs>
            {STACK.map((r, i) => (
              <path key={i} id={`trmGold-r${i}`} d={r.d} />
            ))}
            <clipPath id="trmGoldBars">
              <rect x={CLIP_BARS.x} y={CLIP_BARS.y} width={CLIP_BARS.w} height={CLIP_BARS.h} />
            </clipPath>
            <clipPath id="trmGoldMain">
              <rect x={CLIP_MAIN.x} y={CLIP_MAIN.y} width={CLIP_MAIN.w} height={CLIP_MAIN.h} />
            </clipPath>
          </defs>

          {/* the ghost ring stack — falls into place, ring by ring */}
          <g clipPath="url(#trmGoldMain)">
            {STACK.map((r, i) => (
              <g
                key={r.hex}
                style={{
                  opacity: grown ? 0.6 * dim(i) : 0,
                  transform: grown ? "translateY(0)" : "translateY(-18px)",
                  transition: animated
                    ? `opacity 420ms ease ${T.fall(i)}ms, transform 560ms cubic-bezier(.16,1,.3,1) ${T.fall(i)}ms`
                    : idle,
                }}
              >
                <use href={`#trmGold-r${i}`} fill="none" stroke={c.dim} strokeWidth={0.7} />
              </g>
            ))}
          </g>

          {/* the thickness bars — each ring's gauge, seen in the column */}
          <g clipPath="url(#trmGoldBars)">
            {STACK.map((r, i) => (
              <use
                key={r.hex}
                href={`#trmGold-r${i}`}
                fill={r.hex}
                onMouseEnter={() => setHover(i)}
                style={{ ...fade(T.bar(i)), opacity: grown ? dim(i) : 0, cursor: "pointer" }}
              />
            ))}
          </g>

          {/* the stroke gauges, at the foot of the stack */}
          {BOTTOM_DOTS.map((d, i) => (
            <circle
              key={d.hex}
              cx={d.cx}
              cy={d.cy}
              r={d.r}
              fill={d.hex}
              onMouseEnter={() => setHover(i)}
              style={{ ...pop(T.dot(i)), opacity: grown ? dim(i) : 0, cursor: "pointer" }}
            />
          ))}

          {/* the spin — authored sweep arcs + travelers riding them */}
          {ARCS.map((d, i) => (
            <path
              key={i}
              d={d}
              fill="none"
              stroke={c.faint}
              strokeWidth={0.6}
              strokeDasharray="100 20"
              style={{ ...fade(T.arc(i), 600), opacity: grown ? 0.8 * dim(i) : 0 }}
            />
          ))}
          {motionPathOK &&
            reducedLive !== true &&
            ARCS.map((d, i) => (
              <circle
                key={i}
                className="trm-gold-trav"
                r={ARRAY_DOTS[i].r}
                fill={ARRAY_DOTS[i].hex}
                style={
                  {
                    offsetPath: `path("${d}")`,
                    "--delay": `${T.arc(i)}ms`,
                    "--dur": `${T.TRAVEL}ms`,
                  } as React.CSSProperties
                }
              />
            ))}

          {/* the sizing array — five gauges, each 0.809× the last */}
          {ARRAY_DOTS.map((d, i) => (
            <circle
              key={d.hex}
              cx={d.cx}
              cy={d.cy}
              r={d.r}
              fill={d.hex}
              onMouseEnter={() => setHover(i)}
              style={{ ...pop(T.arrive(i)), opacity: grown ? dim(i) : 0, cursor: "pointer" }}
            />
          ))}

          {/* rulers + gauge labels, as authored */}
          {RULERS.map((r, i) => (
            <line
              key={i}
              x1={r.x1}
              y1={r.y1}
              x2={r.x2}
              y2={r.y2}
              stroke={r.hex}
              strokeWidth={r.w}
              strokeLinecap="round"
              style={fade(i === 0 ? T.ruler0 : T.ruler4)}
            />
          ))}
          <text x={800} y={288} fill={c.ink} style={{ ...svgText(15), fontWeight: 600, ...fade(T.ruler0) }}>
            12px (x)
          </text>
          <text x={800} y={427} fill={c.ink} style={{ ...svgText(15), fontWeight: 600, ...fade(T.ruler4) }}>
            4.99px
          </text>

          {/* calipers — each gauge handed back to its ring's thickness */}
          {CALIPERS.map((k, i) => (
            <g
              key={i}
              style={{
                opacity: grown ? 0.85 * dim(i) : 0,
                clipPath: grown ? "inset(-3px 0% -3px 0%)" : "inset(-3px 0% -3px 100%)",
                transition: animated
                  ? `opacity 200ms ease ${T.cal(i)}ms, clip-path 480ms ease-out ${T.cal(i)}ms`
                  : idle,
              }}
            >
              {[k.y1, k.y2].map((y) => (
                <line
                  key={y}
                  x1={348.25}
                  y1={y}
                  x2={k.x2}
                  y2={y}
                  stroke={c.dim}
                  strokeWidth={0.9}
                  strokeLinecap="round"
                  strokeDasharray="2 5"
                />
              ))}
            </g>
          ))}
        </svg>

        {/* act captions */}
        <span
          style={{
            ...actCaption,
            color: c.accd,
            opacity: animated || mode === "seed" ? (grown ? 0 : 1) : 0,
            transition: animated ? `opacity 400ms ease ${T1.layerOut}ms` : "none",
          }}
        >
          Act I · the form — photograph → trace → average → draw
        </span>
        <span
          style={{
            ...actCaption,
            color: c.accd,
            opacity: grown ? 1 : 0,
            transition: animated ? `opacity 400ms ease ${T1.layerIn + 200}ms` : "none",
          }}
        >
          Act II · the proportion — gauges spin into the sizing array
        </span>
      </div>

      {/* the description, as facts — one strip for both acts */}
      <div
        className="mobile-stack"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          borderTop: `1px solid ${c.line}`,
          background: c.base2,
        }}
      >
        {[
          { v: "18 sections → 1 outline", l: "traced in threes, averaged, combined" },
          { v: "12px → 4.99px", l: "five strokes, one gauge chain" },
          { v: "×0.809 per ring", l: "half the golden ratio · a = 1.618 · sin 54°" },
        ].map(({ v, l }) => (
          <div key={v} style={{ padding: "1.1rem 1.2rem", borderRight: `1px solid ${c.line}` }}>
            <div style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: ".95rem", letterSpacing: "-.01em", color: c.ink, marginBottom: ".3rem", fontVariantNumeric: "tabular-nums" as const }}>
              {v}
            </div>
            <div style={{ ...mono(".5rem"), color: c.faint, letterSpacing: ".1em", lineHeight: 1.6 }}>{l}</div>
          </div>
        ))}
        <div style={{ padding: "1.1rem 1.2rem" }}>
          <div style={{ display: "flex", gap: ".45rem", marginBottom: ".45rem" }}>
            {["#FFA426", "#FF981C", "#FF8C13", "#FF7F0A", "#FF7300"].map((hex, i) => (
              <span
                key={hex}
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                style={{
                  width: 16,
                  height: 16,
                  borderRadius: "50%",
                  background: hex,
                  display: "inline-block",
                  cursor: "pointer",
                  opacity: hover === null || hover === i ? 1 : 0.25,
                  transition: "opacity .2s ease",
                }}
              />
            ))}
          </div>
          <div style={{ ...mono(".5rem"), color: c.faint, letterSpacing: ".1em", lineHeight: 1.6 }}>
            the same ratio, spoken in hue
          </div>
        </div>
      </div>
      <div style={{ padding: ".55rem 1.2rem", borderTop: `1px solid ${c.line}` }}>
        <p style={{ ...mono(".48rem"), color: c.faint, margin: 0, letterSpacing: ".14em" }}>
          Exact production vectors · hover any element to isolate its ring
        </p>
      </div>
    </div>
  );
}
