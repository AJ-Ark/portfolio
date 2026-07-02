"use client";

import Shot from "./Shot";
import type { TrmColors } from "./PrototypeFrame";

/* The 36-iteration story, shown instead of narrated.
   Left: a line-art reconstruction of v13 (three rows of controls).
   Right: the real v36 that shipped (one control bar).
   Above: the 24 ticks between them, annotated at the turning points. */

const TICKS = 24; // v13 → v36 inclusive

const MILESTONES: { at: number; text: string }[] = [
  { at: 0, text: "v13 · three rows of controls" },
  { at: 8, text: "every feature-add rejected" },
  { at: 14, text: "“less is more” — Siddharth" },
  { at: 19, text: "dashboard ↔ action mode" },
  { at: 23, text: "v36 · shipped" },
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
        aspectRatio: "16/10",
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

export default function IterationStrip({ colors: c }: { colors: TrmColors }) {
  return (
    <div>
      {/* tick strip */}
      <div style={{ marginBottom: "2.2rem" }}>
        <div style={{ position: "relative", paddingTop: "2.1rem" }}>
          {/* milestone labels */}
          {MILESTONES.map(({ at, text }) => (
            <span
              key={at}
              className="trm-iter-label"
              style={{
                position: "absolute",
                top: 0,
                left: `${(at / (TICKS - 1)) * 100}%`,
                transform: at === 0 ? "none" : at === TICKS - 1 ? "translateX(-100%)" : "translateX(-50%)",
                fontFamily: "var(--font-mono)",
                fontSize: ".52rem",
                letterSpacing: ".1em",
                textTransform: "uppercase",
                color: at === TICKS - 1 ? c.accd : c.faint,
                whiteSpace: "nowrap",
              }}
            >
              {text}
            </span>
          ))}
          {/* ticks */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            {Array.from({ length: TICKS }, (_, i) => {
              const isMilestone = MILESTONES.some((m) => m.at === i);
              return (
                <span
                  key={i}
                  style={{
                    width: 1.5,
                    height: isMilestone ? 26 : 13,
                    background: isMilestone ? c.acc : c.line,
                    display: "block",
                  }}
                />
              );
            })}
          </div>
          <div style={{ height: 1, background: c.line, marginTop: 0 }} />
        </div>
        <style>{`
          @media (max-width: 900px) {
            .trm-iter-label { display: none; }
          }
        `}</style>
      </div>

      {/* before / after */}
      <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", alignItems: "start" }}>
        <div>
          <V13Schematic colors={c} />
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
