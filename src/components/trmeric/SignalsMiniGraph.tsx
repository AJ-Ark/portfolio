"use client";

import { useMemo, useState } from "react";
import type { TrmColors } from "./PrototypeFrame";

/* A working miniature of the Signals interaction model.
   Hover (or tap) a node: its neighbour graph lights up, the rest dims.
   Layout is precomputed — the point is the interaction, not the physics. */

type Sev = "green" | "amber" | "red";

interface Node { id: string; x: number; y: number; r: number; sev: Sev; label: string; }

const SEV_COLOR: Record<Sev, string> = {
  green: "#3FA46A",
  amber: "#FFA426",
  red: "#E5484D",
};

const NODES: Node[] = [
  /* Field ops — healthy cluster */
  { id: "a1", x: 105, y: 140, r: 6, sev: "green", label: "Rota gaps" },
  { id: "a2", x: 162, y: 108, r: 5, sev: "green", label: "Training backlog" },
  { id: "a3", x: 204, y: 182, r: 6, sev: "green", label: "Handover quality" },
  { id: "a4", x: 132, y: 218, r: 5, sev: "amber", label: "Overtime creep" },
  { id: "a5", x: 72, y: 192, r: 4, sev: "green", label: "Kit shortage" },
  /* ERP rollout — dense red centre: systemic risk */
  { id: "b1", x: 356, y: 150, r: 11, sev: "red", label: "Vendor slippage" },
  { id: "b2", x: 412, y: 118, r: 8, sev: "red", label: "Data migration" },
  { id: "b3", x: 318, y: 102, r: 7, sev: "amber", label: "Scope creep" },
  { id: "b4", x: 416, y: 202, r: 9, sev: "red", label: "Integration debt" },
  { id: "b5", x: 350, y: 238, r: 7, sev: "amber", label: "Change fatigue" },
  { id: "b6", x: 288, y: 176, r: 6, sev: "amber", label: "Licence cost" },
  { id: "b7", x: 458, y: 160, r: 6, sev: "red", label: "Key-person risk" },
  /* Data platform — mixed */
  { id: "c1", x: 566, y: 148, r: 7, sev: "amber", label: "Model drift" },
  { id: "c2", x: 622, y: 118, r: 5, sev: "green", label: "Pipeline SLA" },
  { id: "c3", x: 650, y: 200, r: 6, sev: "green", label: "Access requests" },
  { id: "c4", x: 586, y: 242, r: 7, sev: "amber", label: "Storage cost" },
  { id: "c5", x: 524, y: 206, r: 5, sev: "green", label: "Schema versioning" },
];

const EDGES: [string, string][] = [
  ["a1", "a2"], ["a1", "a4"], ["a2", "a3"], ["a3", "a4"], ["a4", "a5"], ["a1", "a5"],
  ["b1", "b2"], ["b1", "b3"], ["b1", "b4"], ["b1", "b5"], ["b1", "b6"], ["b1", "b7"],
  ["b2", "b7"], ["b4", "b7"], ["b2", "b4"], ["b3", "b6"], ["b5", "b6"],
  ["c1", "c2"], ["c1", "c4"], ["c2", "c3"], ["c3", "c4"], ["c4", "c5"], ["c1", "c5"],
  ["a3", "b6"], ["b4", "c5"], ["b2", "c1"],
];

const CLUSTERS = [
  { x: 140, label: "Field ops" },
  { x: 372, label: "ERP rollout" },
  { x: 590, label: "Data platform" },
];

export default function SignalsMiniGraph({ colors: c }: { colors: TrmColors }) {
  const [focus, setFocus] = useState<string | null>(null);

  const byId = useMemo(() => Object.fromEntries(NODES.map((n) => [n.id, n])), []);
  const neighbours = useMemo(() => {
    const map: Record<string, Set<string>> = {};
    NODES.forEach((n) => (map[n.id] = new Set([n.id])));
    EDGES.forEach(([a, b]) => {
      map[a].add(b);
      map[b].add(a);
    });
    return map;
  }, []);

  const lit = focus ? neighbours[focus] : null;
  const focused = focus ? byId[focus] : null;

  return (
    <div style={{ border: `1px solid ${c.line}`, borderRadius: 14, overflow: "hidden" }}>
      <style>{`
        @keyframes trmSigFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        .trm-sig-node {
          transform-box: fill-box;
          transform-origin: center;
          animation: trmSigFloat 5s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .trm-sig-node { animation: none !important; }
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
          Live · hover-to-highlight, in miniature
        </span>
        <span style={{ display: "flex", gap: ".9rem" }}>
          {(Object.keys(SEV_COLOR) as Sev[]).map((s) => (
            <span key={s} style={{ display: "inline-flex", alignItems: "center", gap: ".35rem", fontFamily: "var(--font-mono)", fontSize: ".5rem", letterSpacing: ".12em", textTransform: "uppercase", color: c.faint }}>
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: SEV_COLOR[s], display: "inline-block" }} />
              {s}
            </span>
          ))}
        </span>
      </div>

      <div style={{ background: c.base, padding: ".5rem .5rem 0" }}>
        <svg
          viewBox="0 0 720 330"
          role="img"
          aria-label="Miniature signal map: three clusters of risk nodes. Hovering a node highlights its neighbours and dims the rest — the dense red cluster in the centre reveals systemic risk."
          style={{ width: "100%", height: "auto", display: "block" }}
          onMouseLeave={() => setFocus(null)}
        >
          {/* edges */}
          {EDGES.map(([a, b]) => {
            const na = byId[a];
            const nb = byId[b];
            const on = lit ? lit.has(a) && lit.has(b) : false;
            return (
              <line
                key={`${a}-${b}`}
                x1={na.x}
                y1={na.y}
                x2={nb.x}
                y2={nb.y}
                stroke={on && focused ? SEV_COLOR[focused.sev] : c.faint}
                strokeWidth={on ? 1.6 : 0.7}
                opacity={lit ? (on ? 0.85 : 0.08) : 0.3}
                style={{ transition: "opacity .25s ease, stroke .25s ease" }}
              />
            );
          })}

          {/* nodes */}
          {NODES.map((n, i) => {
            const on = lit ? lit.has(n.id) : true;
            return (
              <g
                key={n.id}
                className="trm-sig-node"
                style={{ animationDelay: `${(i % 7) * -0.8}s`, animationDuration: `${4.5 + (i % 5) * 0.7}s` }}
              >
                {/* generous hit area */}
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={n.r + 12}
                  fill="transparent"
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setFocus(n.id)}
                  onClick={() => setFocus(focus === n.id ? null : n.id)}
                />
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={n.r}
                  fill={SEV_COLOR[n.sev]}
                  opacity={on ? 0.95 : 0.14}
                  stroke={focus === n.id ? c.ink : "none"}
                  strokeWidth={1.4}
                  style={{ transition: "opacity .25s ease", pointerEvents: "none" }}
                />
              </g>
            );
          })}

          {/* focused label */}
          {focused && (
            <text
              x={focused.x}
              y={focused.y - focused.r - 12}
              textAnchor="middle"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 11,
                letterSpacing: ".08em",
                fill: c.ink,
                stroke: c.base,
                strokeWidth: 4,
                paintOrder: "stroke",
                pointerEvents: "none",
              }}
            >
              {focused.label} · {focused.sev.toUpperCase()}
            </text>
          )}

          {/* cluster labels */}
          {CLUSTERS.map(({ x, label }) => (
            <text
              key={label}
              x={x}
              y={312}
              textAnchor="middle"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9.5,
                letterSpacing: ".18em",
                fill: c.faint,
                textTransform: "uppercase" as const,
              }}
            >
              {label.toUpperCase()}
            </text>
          ))}
        </svg>
      </div>

      <div style={{ padding: ".7rem 1.2rem", borderTop: `1px solid ${c.line}`, background: c.base2 }}>
        <p style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".12em", textTransform: "uppercase", color: c.faint, margin: 0 }}>
          Hover any node — neighbours light up, the map stays put. The dense red centre is the systemic-risk story.
        </p>
      </div>
    </div>
  );
}
