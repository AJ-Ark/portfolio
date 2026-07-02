"use client";

import type { TrmColors } from "./PrototypeFrame";

/* The RAG severity system, demonstrated instead of described.
   Three schematic project rows: green breathes, amber pulses, red vibrates.
   Severity must be perceptible in peripheral vision — so it moves. */

const STATES = [
  { key: "green", color: "#3FA46A", status: "On track", verb: "calm — a soft, slow glow", anim: "trmRagGlow 3.2s ease-in-out infinite" },
  { key: "amber", color: "#FFA426", status: "At risk", verb: "pulses — a ring asking for attention", anim: "none" },
  { key: "red", color: "#E5484D", status: "Critical", verb: "vibrates — impossible to ignore", anim: "trmRagShake .28s linear infinite" },
];

function Sparkle({ color, anim }: { color: string; anim: string }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill={color}
      aria-hidden
      style={{ animation: anim, transformOrigin: "center", display: "block" }}
    >
      <path d="M12 2c.6 4.8 2.4 7.4 3.4 8.4S19.2 12.6 22 12c-4.8.6-7.4 2.4-8.4 3.4S11.4 19.2 12 22c-.6-4.8-2.4-7.4-3.4-8.4S4.8 11.4 2 12c4.8-.6 7.4-2.4 8.4-3.4S11.4 4.8 12 2z" />
    </svg>
  );
}

export default function RagDemo({ colors: c }: { colors: TrmColors }) {
  return (
    <div
      role="img"
      aria-label="Demonstration of the RAG severity system: green projects glow calmly, amber projects pulse, red projects vibrate"
      style={{
        border: `1px solid ${c.line}`,
        borderRadius: 14,
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes trmRagGlow {
          0%, 100% { filter: drop-shadow(0 0 2px rgba(63,164,106,.5)); opacity: .85; }
          50% { filter: drop-shadow(0 0 9px rgba(63,164,106,.9)); opacity: 1; }
        }
        @keyframes trmRagRing {
          0% { transform: scale(.6); opacity: .9; }
          100% { transform: scale(2.1); opacity: 0; }
        }
        @keyframes trmRagShake {
          0% { transform: translate(0, 0); }
          25% { transform: translate(1px, -.5px); }
          50% { transform: translate(-1px, .5px); }
          75% { transform: translate(.5px, 1px); }
          100% { transform: translate(0, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .trm-rag-cell svg, .trm-rag-ring { animation: none !important; }
        }
      `}</style>

      <div
        style={{
          padding: ".8rem 1.2rem",
          borderBottom: `1px solid ${c.line}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: "1rem",
          flexWrap: "wrap",
        }}
      >
        <span style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".18em", textTransform: "uppercase", color: c.accd }}>
          Live · severity as motion
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: ".5rem", letterSpacing: ".12em", textTransform: "uppercase", color: c.faint }}>
          Readable in peripheral vision, before color
        </span>
      </div>

      <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)" }}>
        {STATES.map(({ key, color, status, verb, anim }, i) => (
          <div
            key={key}
            className="trm-rag-cell"
            style={{
              padding: "1.5rem 1.3rem",
              borderRight: i < 2 ? `1px solid ${c.line}` : "none",
              background: c.base,
            }}
          >
            {/* schematic project row */}
            <div style={{ display: "flex", alignItems: "center", gap: ".9rem", marginBottom: "1.1rem" }}>
              <span style={{ position: "relative", display: "inline-flex", width: 22, height: 22, flexShrink: 0 }}>
                {key === "amber" && (
                  <span
                    className="trm-rag-ring"
                    aria-hidden
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      border: `1.5px solid ${color}`,
                      animation: "trmRagRing 1.7s ease-out infinite",
                    }}
                  />
                )}
                <Sparkle color={color} anim={anim} />
              </span>
              {/* placeholder text bars */}
              <span aria-hidden style={{ display: "flex", flexDirection: "column", gap: 5, flex: 1 }}>
                <span style={{ height: 7, width: "72%", borderRadius: 4, background: c.line }} />
                <span style={{ height: 5, width: "46%", borderRadius: 4, background: c.line, opacity: 0.7 }} />
              </span>
            </div>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: ".58rem", letterSpacing: ".16em", textTransform: "uppercase", color, marginBottom: ".35rem" }}>
              {status}
            </div>
            <p style={{ fontSize: ".8125rem", color: c.dim, lineHeight: 1.55, margin: 0 }}>{verb}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
