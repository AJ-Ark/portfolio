"use client";

import { useState, useRef, useCallback } from "react";

const ACC = "#FFA426";
const ACCD = "#E8730E";
const INK = "#17150F";
const DIM = "#6f6a5e";
const FAINT = "#9b9488";
const LINE = "rgba(23,21,15,.12)";
const LINA = "rgba(255,164,38,.22)";
const BASE2 = "#F1EADC";

type SourceState = "queued" | "scanning" | "done";

interface Source { key: string; label: string; target: number; suffix: string; }
const SOURCES: Source[] = [
  { key: "historical", label: "Historical Projects", target: 3, suffix: " found" },
  { key: "resources", label: "Resource Availability", target: 427, suffix: " resources" },
  { key: "budget", label: "Budget Constraints", target: 4, suffix: " quarters" },
  { key: "strategic", label: "Strategic Alignment", target: 12, suffix: " initiatives" },
];

interface Discovery { title: string; points: string[]; flag: "warning" | "confirm"; }
const DISCOVERIES: Discovery[] = [
  { title: "Found 3 similar cloud migrations", points: ["Average duration: 8.5 months", "Budget range: $420K – $480K", "Success rate: 87% on-time"], flag: "confirm" },
  { title: "Team availability conflict", points: ["Sarah Chen, Cloud Architect, is 80% allocated until March", "Suggested alternative: Michael Kim, 92% match"], flag: "warning" },
  { title: "Budget aligns with Q2 allocation", points: ["Estimated cost: $450K", "Q2 available: $680K", "Confidence: High"], flag: "confirm" },
  { title: "Supports 2 strategic initiatives", points: ["Cloud-First Transformation", "Cost Optimization 2025", "+25 strategic alignment score"], flag: "confirm" },
];

export default function EnrichmentDemo() {
  const [states, setStates] = useState<SourceState[]>(SOURCES.map(() => "queued"));
  const [counts, setCounts] = useState<number[]>(SOURCES.map(() => 0));
  const [revealed, setRevealed] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const timers = useRef<NodeJS.Timeout[]>([]);

  const run = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    setStates(SOURCES.map(() => "queued"));
    setCounts(SOURCES.map(() => 0));
    setRevealed(0);
    setDone(false);
    setRunning(true);

    let cursor = 0;
    SOURCES.forEach((src, i) => {
      const startAt = cursor;
      timers.current.push(setTimeout(() => {
        setStates((s) => { const n = [...s]; n[i] = "scanning"; return n; });
        const steps = 16;
        for (let k = 1; k <= steps; k++) {
          timers.current.push(setTimeout(() => {
            setCounts((c) => { const n = [...c]; n[i] = Math.round((src.target * k) / steps); return n; });
          }, (k * 500) / steps));
        }
        timers.current.push(setTimeout(() => {
          setStates((s) => { const n = [...s]; n[i] = "done"; return n; });
        }, 550));
      }, startAt));
      cursor += 650;
    });

    DISCOVERIES.forEach((_, i) => {
      timers.current.push(setTimeout(() => {
        setRevealed((r) => Math.max(r, i + 1));
      }, cursor + 300 + i * 350));
    });

    timers.current.push(setTimeout(() => {
      setRunning(false);
      setDone(true);
    }, cursor + 300 + DISCOVERIES.length * 350 + 200));
  }, []);

  return (
    <div style={{ border: `1px solid ${LINE}`, borderRadius: "14px", overflow: "hidden", background: "#fff", boxShadow: "0 4px 24px -8px rgba(23,21,15,.14)" }}>
      {/* Toolbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: ".8rem 1.2rem", borderBottom: `1px solid ${LINE}`, background: BASE2 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".12em", textTransform: "uppercase", color: INK, fontWeight: 600 }}>
          AI Enrichment
        </span>
        <button
          onClick={run}
          disabled={running}
          style={{
            fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".1em", textTransform: "uppercase",
            color: running ? FAINT : "#fff", background: running ? "transparent" : ACC,
            border: running ? `1px solid ${LINE}` : "none", borderRadius: "4px", padding: ".4rem .8rem",
            cursor: running ? "default" : "pointer",
          }}
        >
          {running ? "Running…" : done ? "Replay ↻" : "Run analysis →"}
        </button>
      </div>

      <div style={{ padding: "1.3rem 1.4rem" }}>
        {/* Source rows */}
        <div style={{ display: "flex", flexDirection: "column", gap: ".5rem", marginBottom: "1.3rem" }}>
          {SOURCES.map((src, i) => (
            <div key={src.key} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: ".5rem .8rem", borderRadius: "8px", background: states[i] === "scanning" ? "rgba(255,164,38,.06)" : "transparent", border: `1px solid ${states[i] === "scanning" ? LINA : "transparent"}` }}>
              <span style={{ fontSize: ".78rem", color: INK }}>{src.label}</span>
              <div style={{ display: "flex", alignItems: "center", gap: ".7rem" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: ".68rem", color: ACCD, fontVariantNumeric: "tabular-nums", minWidth: "4.5rem", textAlign: "right" }}>
                  {states[i] !== "queued" ? `${counts[i]}${src.suffix}` : "·"}
                </span>
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: ".5rem", letterSpacing: ".08em", textTransform: "uppercase",
                  padding: ".2rem .5rem", borderRadius: "100px",
                  color: states[i] === "done" ? "#3a7a4a" : states[i] === "scanning" ? ACCD : FAINT,
                  background: states[i] === "done" ? "rgba(58,122,74,.1)" : states[i] === "scanning" ? "rgba(255,164,38,.1)" : BASE2,
                }}>
                  {states[i]}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Discoveries */}
        {revealed > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: ".7rem" }}>
            {DISCOVERIES.slice(0, revealed).map((d) => (
              <div
                key={d.title}
                style={{
                  padding: "1rem 1.1rem",
                  border: `1px solid ${d.flag === "warning" ? "rgba(217,120,58,.4)" : LINE}`,
                  borderRadius: "10px",
                  background: d.flag === "warning" ? "rgba(217,120,58,.05)" : BASE2,
                  animation: "enrich-fade-in .4s ease both",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: ".5rem", marginBottom: ".5rem" }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: d.flag === "warning" ? "#d9783a" : "#3a7a4a", flexShrink: 0 }} />
                  <h4 style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: ".8rem", color: INK }}>{d.title}</h4>
                </div>
                {d.points.map((pt) => (
                  <div key={pt} style={{ fontSize: ".72rem", color: DIM, lineHeight: 1.55 }}>{pt}</div>
                ))}
              </div>
            ))}
          </div>
        )}

        {!running && !done && revealed === 0 && (
          <p style={{ fontSize: ".78rem", color: FAINT, fontStyle: "italic", textAlign: "center", padding: "1rem 0" }}>
            Click "Run analysis" to watch Tango enrich a real demand in real time.
          </p>
        )}

        {done && (
          <div style={{ display: "flex", alignItems: "baseline", gap: "1rem", marginTop: "1.2rem", paddingTop: "1rem", borderTop: `1px solid ${LINE}` }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: ".62rem", color: FAINT }}>Manual research: 12+ hours</span>
            <span style={{ color: ACC }}>→</span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: ".62rem", color: ACCD, fontWeight: 600 }}>This pass: under 3 seconds</span>
          </div>
        )}
      </div>

      <style>{`@keyframes enrich-fade-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
