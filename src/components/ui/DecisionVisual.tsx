"use client";

import { useState } from "react";

/* ── Shared micro-tokens ── */
const INK = "#17150F";
const DIM = "#6f6a5e";
const FAINT = "#9b9488";
const LINE = "rgba(23,21,15,.12)";

type Compare = {
  kind: "compare";
  leftLabel: string;
  rightLabel: string;
  leftLines: string[];
  rightLines: string[];
};
type Wireframe = {
  kind: "wireframe";
  rows: { label: string; sub: string; muted?: boolean }[];
};
type Flow = {
  kind: "flow";
  steps: string[];
  stat?: { value: string; label: string };
};
type Rag = { kind: "rag" };
type Gradient = { kind: "gradient" };
type Tabs = {
  kind: "tabs";
  tabs: { label: string; lines: string[] }[];
};
type Cluster = { kind: "cluster" };
type Personality = { kind: "personality"; modes: string[] };

export type DecisionVisualData =
  | Compare
  | Wireframe
  | Flow
  | Rag
  | Gradient
  | Tabs
  | Cluster
  | Personality;

interface Props {
  data: DecisionVisualData;
  accent: string;
}

const boxStyle: React.CSSProperties = {
  border: `1px solid ${LINE}`,
  borderRadius: 10,
  overflow: "hidden",
  background: "#fff",
  marginBottom: "1rem",
};

const tabBtn = (active: boolean, accent: string): React.CSSProperties => ({
  flex: 1,
  padding: ".55rem .6rem",
  fontFamily: "var(--font-mono)",
  fontSize: ".58rem",
  letterSpacing: ".1em",
  textTransform: "uppercase",
  border: "none",
  cursor: "pointer",
  background: active ? accent : "transparent",
  color: active ? "#fff" : DIM,
  transition: "background .25s ease, color .25s ease",
});

export default function DecisionVisual({ data, accent }: Props) {
  if (data.kind === "compare") return <CompareViz data={data} accent={accent} />;
  if (data.kind === "wireframe") return <WireframeViz data={data} accent={accent} />;
  if (data.kind === "flow") return <FlowViz data={data} accent={accent} />;
  if (data.kind === "rag") return <RagViz accent={accent} />;
  if (data.kind === "gradient") return <GradientViz accent={accent} />;
  if (data.kind === "tabs") return <TabsViz data={data} accent={accent} />;
  if (data.kind === "cluster") return <ClusterViz accent={accent} />;
  if (data.kind === "personality") return <PersonalityViz data={data} accent={accent} />;
  return null;
}

/* ── Compare: click to toggle before/after ── */
function CompareViz({ data, accent }: { data: Compare; accent: string }) {
  const [active, setActive] = useState<"left" | "right">("left");
  const lines = active === "left" ? data.leftLines : data.rightLines;
  const isAfter = active === "right";
  return (
    <div style={boxStyle}>
      <div style={{ display: "flex", borderBottom: `1px solid ${LINE}` }}>
        <button onClick={() => setActive("left")} style={tabBtn(active === "left", "#8d8474")}>
          {data.leftLabel}
        </button>
        <button onClick={() => setActive("right")} style={tabBtn(active === "right", accent)}>
          {data.rightLabel}
        </button>
      </div>
      <div style={{ padding: "1rem 1.1rem", minHeight: 92, display: "flex", flexDirection: "column", gap: ".4rem", justifyContent: "center" }}>
        {lines.map((l, i) => (
          <div
            key={i}
            style={{
              padding: ".4rem .6rem",
              borderRadius: 6,
              fontSize: ".7rem",
              fontFamily: "var(--font-mono)",
              color: isAfter ? INK : FAINT,
              background: isAfter ? `${accent}12` : "rgba(0,0,0,.03)",
              border: isAfter ? `1px solid ${accent}33` : `1px dashed ${LINE}`,
              transition: "all .3s ease",
            }}
          >
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Wireframe: labeled card anatomy ── */
function WireframeViz({ data, accent }: { data: Wireframe; accent: string }) {
  const [hovered, setHovered] = useState<number | null>(null);
  return (
    <div style={{ ...boxStyle, padding: "1rem 1.1rem" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: ".35rem" }}>
        {data.rows.map((row, i) => {
          const isHot = hovered === i;
          const dark = !row.muted || isHot;
          return (
            <div
              key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: ".45rem .7rem",
                borderRadius: 6,
                background: isHot ? `${accent}10` : "transparent",
                border: `1px solid ${isHot ? accent + "44" : LINE}`,
                cursor: "default",
                transition: "all .2s ease",
              }}
            >
              <span style={{ fontSize: ".72rem", color: dark ? INK : FAINT, fontWeight: dark ? 600 : 400 }}>
                {row.label}
              </span>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", color: isHot ? accent : FAINT, letterSpacing: ".06em" }}>
                {row.sub}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Flow: connected steps, optional end stat ── */
function FlowViz({ data, accent }: { data: Flow; accent: string }) {
  return (
    <div style={{ ...boxStyle, padding: "1.2rem 1rem" }}>
      <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: ".3rem" }}>
        {data.steps.map((step, i) => (
          <span key={i} style={{ display: "flex", alignItems: "center", gap: ".3rem" }}>
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: ".6rem",
                padding: ".4rem .65rem",
                borderRadius: 100,
                border: `1px solid ${i === data.steps.length - 1 ? accent : LINE}`,
                background: i === data.steps.length - 1 ? `${accent}12` : "transparent",
                color: i === data.steps.length - 1 ? accent : DIM,
                whiteSpace: "nowrap",
              }}
            >
              {step}
            </span>
            {i < data.steps.length - 1 && (
              <span style={{ color: FAINT, fontSize: ".7rem" }}>→</span>
            )}
          </span>
        ))}
      </div>
      {data.stat && (
        <div style={{ display: "flex", alignItems: "baseline", gap: ".5rem", marginTop: "1rem", paddingTop: ".8rem", borderTop: `1px solid ${LINE}` }}>
          <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "1.6rem", color: accent, lineHeight: 1 }}>
            {data.stat.value}
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: ".58rem", letterSpacing: ".1em", textTransform: "uppercase", color: FAINT }}>
            {data.stat.label}
          </span>
        </div>
      )}
    </div>
  );
}

/* ── RAG: live animated severity dots ── */
function RagViz({ accent }: { accent: string }) {
  const items = [
    { color: "#22c55e", label: "On track", anim: "rag-glow" },
    { color: "#f59e0b", label: "At risk", anim: "rag-pulse" },
    { color: "#ef4444", label: "Critical", anim: "rag-vibrate" },
  ];
  return (
    <div style={{ ...boxStyle, padding: "1.2rem 1.1rem", display: "flex", justifyContent: "space-around" }}>
      {items.map(({ color, label, anim }) => (
        <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: ".5rem" }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: "50%",
              background: color,
              boxShadow: `0 0 8px ${color}99`,
              animation: `${anim} 1.6s ease-in-out infinite`,
            }}
          />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".08em", textTransform: "uppercase", color: DIM }}>
            {label}
          </span>
        </div>
      ))}
      <style>{`
        @keyframes rag-glow { 0%,100%{ opacity:.7 } 50%{ opacity:1 } }
        @keyframes rag-pulse { 0%,100%{ transform:scale(1) } 50%{ transform:scale(1.35) } }
        @keyframes rag-vibrate { 0%,100%{ transform:translateX(0) } 25%{ transform:translateX(-2px) } 75%{ transform:translateX(2px) } }
      `}</style>
    </div>
  );
}

/* ── Gradient: brand orange vs AI gradient button ── */
function GradientViz({ accent }: { accent: string }) {
  return (
    <div style={{ ...boxStyle, padding: "1.2rem 1.1rem", display: "flex", flexDirection: "column", gap: ".8rem" }}>
      <div style={{ display: "flex", alignItems: "center", gap: ".8rem" }}>
        <span style={{ padding: ".5rem 1rem", borderRadius: 100, background: accent, color: "#fff", fontFamily: "var(--font-mono)", fontSize: ".62rem", letterSpacing: ".06em" }}>
          New demand
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".08em", textTransform: "uppercase", color: FAINT }}>
          Brand action
        </span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: ".8rem" }}>
        <span style={{ padding: ".5rem 1rem", borderRadius: 100, background: "linear-gradient(135deg, #8b5cf6, #FFA426)", color: "#fff", fontFamily: "var(--font-mono)", fontSize: ".62rem", letterSpacing: ".06em" }}>
          Ask Tango
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".08em", textTransform: "uppercase", color: "#8b5cf6" }}>
          AI active
        </span>
      </div>
    </div>
  );
}

/* ── Tabs: click to switch persona/mode content ── */
function TabsViz({ data, accent }: { data: Tabs; accent: string }) {
  const [active, setActive] = useState(0);
  return (
    <div style={boxStyle}>
      <div style={{ display: "flex", borderBottom: `1px solid ${LINE}` }}>
        {data.tabs.map((t, i) => (
          <button key={t.label} onClick={() => setActive(i)} style={tabBtn(active === i, accent)}>
            {t.label}
          </button>
        ))}
      </div>
      <div style={{ padding: "1rem 1.1rem", minHeight: 80, display: "flex", flexDirection: "column", gap: ".4rem", justifyContent: "center" }}>
        {data.tabs[active].lines.map((l, i) => (
          <div
            key={i}
            style={{
              padding: ".4rem .6rem",
              borderRadius: 6,
              fontSize: ".7rem",
              fontFamily: "var(--font-mono)",
              color: INK,
              background: `${accent}10`,
              border: `1px solid ${accent}33`,
            }}
          >
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Cluster: severity-weighted node cluster (static SVG, hover glow) ── */
function ClusterViz({ accent }: { accent: string }) {
  const nodes = [
    { x: 80, y: 50, r: 14, c: "#ef4444" },
    { x: 110, y: 35, r: 6, c: "#9b9488" },
    { x: 105, y: 70, r: 7, c: "#f59e0b" },
    { x: 50, y: 65, r: 5, c: "#9b9488" },
    { x: 60, y: 30, r: 8, c: "#f59e0b" },
    { x: 140, y: 55, r: 5, c: "#9b9488" },
    { x: 30, y: 45, r: 5, c: "#9b9488" },
  ];
  return (
    <div style={{ ...boxStyle, padding: "1.2rem 1.1rem", display: "flex", justifyContent: "center" }}>
      <svg viewBox="0 0 170 100" style={{ width: "100%", maxWidth: 280, height: "auto" }}>
        {nodes.slice(1).map((n, i) => (
          <line key={i} x1={nodes[0].x} y1={nodes[0].y} x2={n.x} y2={n.y} stroke={LINE} strokeWidth="1" />
        ))}
        {nodes.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r={n.r} fill={n.c} opacity={i === 0 ? 1 : 0.85} />
        ))}
      </svg>
    </div>
  );
}

/* ── Personality: five interaction modes as a row of chips ── */
function PersonalityViz({ data, accent }: { data: Personality; accent: string }) {
  return (
    <div style={{ ...boxStyle, padding: "1.1rem", display: "flex", flexWrap: "wrap", gap: ".4rem" }}>
      {data.modes.map((m) => (
        <span
          key={m}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: ".58rem",
            letterSpacing: ".06em",
            padding: ".4rem .7rem",
            borderRadius: 100,
            border: `1px solid ${accent}33`,
            background: `${accent}0a`,
            color: INK,
          }}
        >
          {m}
        </span>
      ))}
    </div>
  );
}
