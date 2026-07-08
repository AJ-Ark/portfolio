"use client";

import { useMemo, useState } from "react";
import Shot from "./Shot";
import type { TrmColors } from "./PrototypeFrame";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/* The 24-iteration story (v13 → v36), scrubbed instead of narrated.
   A native <input type="range"> drives everything — pointer drag, touch
   drag, and full keyboard support (←/→ step one iteration, Home/End jump
   to v13/v36) come for free from the browser rather than being
   hand-rolled, and it's a real, accessible slider (role="slider" is
   implicit) rather than a div wearing a slider costume.

   The frame crossfades between the reconstructed v13 schematic and the
   real, shipped v36 screenshot as the scrubber moves — there is no
   screenshot for every intermediate version, so the crossfade itself IS
   the honest representation of "36 iterations happened between these two
   states" rather than fabricating 22 screenshots that never existed. The
   strip always resolves to the real v36 photo at the right-hand end.

   Reduced motion: renders the original static before/after + tick-strip
   layout — no drag surface, nothing to operate, just the two end states
   side by side. */

const V_MIN = 13;
const V_MAX = 36;

const MILESTONES: { v: number; text: string }[] = [
  { v: 13, text: "v13 · three rows of controls" },
  { v: 21, text: "every feature-add rejected" },
  { v: 27, text: "“less is more” — Siddharth" },
  { v: 32, text: "dashboard ↔ action mode" },
  { v: 36, text: "v36 · shipped" },
];

/* Line-art reconstruction of the rejected v13 layout. Same schematic
   register as the persona icons — stroke only, no fills. */
function V13Schematic({ colors: c }: { colors: TrmColors }) {
  const stroke = { fill: "none" as const, stroke: c.faint, strokeWidth: 1.1 };
  const pillRow = (y: number, widths: number[], gap = 8) => {
    let x = 24;
    return widths.map((w, i) => {
      const r = <rect key={`${y}-${i}`} x={x} y={y} width={w} height={16} rx={8} {...stroke} />;
      x += w + gap;
      return r;
    });
  };
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        borderRadius: 14,
        border: `1px dashed ${c.line}`,
        background: c.base,
        overflow: "hidden",
        position: "relative",
      }}
    >
      <svg viewBox="0 0 640 400" style={{ width: "100%", height: "100%", display: "block" }} aria-label="Schematic reconstruction of Portfolio Monitor v13: three stacked rows of filter controls compressing the canvas">
        {/* chrome */}
        <rect x="12" y="12" width="616" height="376" rx="10" {...stroke} opacity={0.7} />
        <circle cx="30" cy="28" r="3" {...stroke} />
        <circle cx="42" cy="28" r="3" {...stroke} />
        <circle cx="54" cy="28" r="3" {...stroke} />
        {/* three rows of controls — the problem */}
        {pillRow(48, [64, 52, 76, 58, 48, 70, 54])}
        {pillRow(74, [88, 64, 56, 92, 60, 72])}
        {pillRow(100, [70, 110, 58, 84, 66])}
        <text x="592" y="86" textAnchor="end" style={{ fontFamily: "var(--font-mono)", fontSize: 10, letterSpacing: ".14em", fill: "#E5484D" }}>
          3 ROWS
        </text>
        {/* squeezed canvas with a cramped graph */}
        <rect x="24" y="130" width="592" height="244" rx="8" {...stroke} opacity={0.5} />
        {[
          [180, 250, 9], [230, 210, 6], [280, 270, 7], [330, 230, 11], [385, 275, 6],
          [430, 220, 8], [480, 260, 5], [250, 300, 5], [360, 320, 7], [440, 310, 5],
          [520, 240, 6], [540, 300, 4], [150, 300, 5], [310, 180, 5], [400, 175, 4],
        ].map(([x, y, r], i) => (
          <circle key={i} cx={x} cy={y} r={r} {...stroke} opacity={0.6} />
        ))}
        {[
          [180, 250, 230, 210], [230, 210, 310, 180], [280, 270, 330, 230], [330, 230, 430, 220],
          [385, 275, 330, 230], [430, 220, 520, 240], [480, 260, 440, 310], [360, 320, 330, 230],
        ].map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} {...stroke} opacity={0.3} />
        ))}
      </svg>
      <span
        style={{
          position: "absolute",
          left: 14,
          bottom: 12,
          fontFamily: "var(--font-mono)",
          fontSize: ".5rem",
          letterSpacing: ".16em",
          textTransform: "uppercase",
          color: c.faint,
        }}
      >
        Schematic · reconstructed from v13
      </span>
    </div>
  );
}

/* The tick row shared by both the interactive scrubber and the static
   reduced-motion fallback — milestone labels above, 24 hairline ticks
   below, taller + accented at each milestone. `active` (a v-number or
   null) is exact-match only, matching the spec: annotations pop in at
   their exact tick positions, not "any tick at or past this one". */
function TickRow({ colors: c, active }: { colors: TrmColors; active: number | null }) {
  return (
    <div style={{ position: "relative", paddingTop: "2.1rem" }}>
      {MILESTONES.map(({ v, text }) => {
        const reached = active !== null && active >= v;
        const popped = active === v;
        return (
          <span
            key={v}
            className="trm-iter-label"
            style={{
              position: "absolute",
              top: 0,
              left: `${((v - V_MIN) / (V_MAX - V_MIN)) * 100}%`,
              transform: `${v === V_MIN ? "" : v === V_MAX ? "translateX(-100%)" : "translateX(-50%)"} scale(${popped ? 1.1 : 1})`,
              transformOrigin: v === V_MIN ? "left top" : v === V_MAX ? "right top" : "center top",
              fontFamily: "var(--font-mono)",
              fontSize: ".52rem",
              letterSpacing: ".1em",
              textTransform: "uppercase",
              color: popped ? c.acc : reached ? c.accd : c.faint,
              opacity: popped ? 1 : reached ? 0.85 : 0.5,
              whiteSpace: "nowrap",
              transition: "transform .25s cubic-bezier(.16,1,.3,1), color .25s ease, opacity .25s ease",
            }}
          >
            {text}
          </span>
        );
      })}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        {Array.from({ length: V_MAX - V_MIN + 1 }, (_, i) => {
          const v = V_MIN + i;
          const isMilestone = MILESTONES.some((m) => m.v === v);
          const popped = active === v;
          return (
            <span
              key={v}
              style={{
                width: popped ? 2.5 : 1.5,
                height: isMilestone ? (popped ? 32 : 26) : 13,
                background: popped ? c.acc : isMilestone ? c.acc : c.line,
                display: "block",
                transition: "width .2s ease, height .2s ease",
              }}
            />
          );
        })}
      </div>
      <div style={{ height: 1, background: c.line, marginTop: 0 }} />
      <style>{`
        @media (max-width: 900px) {
          .trm-iter-label { display: none; }
        }
      `}</style>
    </div>
  );
}

/* Reduced-motion fallback: the original static before/after layout, no
   drag surface, nothing to operate. */
function StaticIterationTimeline({ colors: c }: { colors: TrmColors }) {
  return (
    <div>
      <div style={{ marginBottom: "2.2rem" }}>
        <TickRow colors={c} active={null} />
      </div>
      <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", alignItems: "start" }}>
        <div>
          <div style={{ aspectRatio: "16/10" }}>
            <V13Schematic colors={c} />
          </div>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".14em", textTransform: "uppercase", color: c.faint, marginTop: ".7rem" }}>
            v13 — every capability visible, nothing legible · rejected
          </p>
        </div>
        <div>
          <Shot
            src="/images/trmeric/portfolio-monitor.png"
            alt="Portfolio Monitor v36, the shipped version: a single dock-style control bar and a full-height force graph"
            ratio="16/10"
            border={`1px solid ${c.line}`}
            accent={c.acc}
            sizes="(max-width: 900px) 100vw, 550px"
          />
          <p style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".14em", textTransform: "uppercase", color: c.accd, marginTop: ".7rem" }}>
            v36 — one control bar, more context per control · shipped
          </p>
        </div>
      </div>
    </div>
  );
}

export default function IterationStrip({ colors: c }: { colors: TrmColors }) {
  const reducedMotion = usePrefersReducedMotion();
  const [iter, setIter] = useState(V_MAX); // rests on the real, shipped v36 shot

  const progress = (iter - V_MIN) / (V_MAX - V_MIN);
  const exact = useMemo(() => MILESTONES.find((m) => m.v === iter) ?? null, [iter]);

  if (reducedMotion) return <StaticIterationTimeline colors={c} />;

  return (
    <div>
      <div style={{ marginBottom: "1.6rem" }}>
        <TickRow colors={c} active={iter} />
      </div>

      {/* the crossfading frame: v13 schematic ↔ real v36 screenshot.
          Only the visually-dominant layer is interactive: gate pointer-events
          AND inert on opacity, or the transparent-but-on-top v36 Shot button
          would intercept clicks over the v13 schematic and stay tabbable. */}
      <div style={{ position: "relative", aspectRatio: "16/10", borderRadius: 14, overflow: "hidden" }}>
        <div
          inert={progress >= 0.5}
          style={{ position: "absolute", inset: 0, opacity: 1 - progress, transition: "none", pointerEvents: progress < 0.5 ? "auto" : "none" }}
        >
          <V13Schematic colors={c} />
        </div>
        <div
          inert={progress < 0.5}
          style={{ position: "absolute", inset: 0, opacity: progress, transition: "none", pointerEvents: progress >= 0.5 ? "auto" : "none" }}
        >
          <Shot
            src="/images/trmeric/portfolio-monitor.png"
            alt="Portfolio Monitor v36, the shipped version: a single dock-style control bar and a full-height force graph"
            ratio="16/10"
            border={`1px solid ${c.line}`}
            accent={c.acc}
            sizes="(max-width: 900px) 100vw, 550px"
          />
        </div>
      </div>

      {/* the scrubber itself */}
      <div className="trm-iter-scrubber" style={{ position: "relative", marginTop: "1.1rem", height: "1.8rem", display: "flex", alignItems: "center" }}>
        <input
          type="range"
          className="trm-iter-input"
          min={V_MIN}
          max={V_MAX}
          step={1}
          value={iter}
          onChange={(e) => setIter(Number(e.target.value))}
          aria-label="Portfolio Monitor iteration, version 13 to version 36"
          aria-valuetext={`Version ${iter}${exact ? ` — ${exact.text}` : ""}`}
          style={{ ["--trm-acc" as string]: c.acc, ["--trm-line" as string]: c.line }}
          /* Chromium mutates a styled (-webkit-appearance:none) range
             input's live style attribute (adds caret-color: transparent)
             before React's hydration walk reaches it — a browser-internal
             artifact, not an SSR/CSR content difference (verified: every
             prop this component actually controls matches exactly). This
             is the documented escape hatch for that class of mismatch. */
          suppressHydrationWarning
        />
      </div>

      {/* live readout */}
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "center", gap: ".7rem", marginTop: ".9rem", flexWrap: "wrap" }}>
        <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "1.3rem", color: c.acc, fontVariantNumeric: "tabular-nums" }}>
          v{iter}
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: ".62rem", letterSpacing: ".1em", textTransform: "uppercase", color: c.dim }}>
          {exact ? exact.text : "drag, or use ← → (Home/End for the ends)"}
        </span>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: ".6rem" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".14em", textTransform: "uppercase", color: iter === V_MIN ? c.accd : c.faint, transition: "color .25s ease" }}>
          v13 — every capability visible, nothing legible · rejected
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".14em", textTransform: "uppercase", color: iter === V_MAX ? c.accd : c.faint, transition: "color .25s ease", textAlign: "right" }}>
          v36 — one control bar, more context per control · shipped
        </span>
      </div>

      <style>{`
        .trm-iter-input {
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 100%;
          margin: 0;
          background: transparent;
          cursor: ew-resize;
          touch-action: pan-y;
        }
        .trm-iter-input:focus-visible {
          outline: 2px solid var(--trm-acc);
          outline-offset: 4px;
          border-radius: 999px;
        }
        .trm-iter-input::-webkit-slider-runnable-track {
          height: 2px;
          background: var(--trm-line);
          border-radius: 999px;
        }
        .trm-iter-input::-moz-range-track {
          height: 2px;
          background: var(--trm-line);
          border-radius: 999px;
        }
        .trm-iter-input::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 18px;
          height: 18px;
          margin-top: -8px;
          border-radius: 50%;
          background: var(--trm-acc);
          border: 3px solid color-mix(in srgb, var(--trm-acc) 30%, white 70%);
          box-shadow: 0 2px 10px -2px rgba(0,0,0,.4);
          cursor: ew-resize;
        }
        .trm-iter-input::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: var(--trm-acc);
          border: 3px solid color-mix(in srgb, var(--trm-acc) 30%, white 70%);
          box-shadow: 0 2px 10px -2px rgba(0,0,0,.4);
          cursor: ew-resize;
        }
      `}</style>
    </div>
  );
}
