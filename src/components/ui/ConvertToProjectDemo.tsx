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

interface Row { label: string; source: "IN" | "AUTO"; content: string; }
const ROWS: Row[] = [
  { label: "Team", source: "IN", content: "Sarah Chen + 2 Engineers + PM" },
  { label: "Milestones", source: "AUTO", content: "Kickoff · Infra · Migration · Go-Live" },
  { label: "Budget", source: "IN", content: "$450K allocated · 3 cost centers" },
  { label: "Risk Register", source: "AUTO", content: "3 risks identified · Mitigations mapped" },
  { label: "Success Criteria", source: "IN", content: "100% cost reduction on legacy licenses" },
];

type Phase = "idle" | "converting" | "done";

export default function ConvertToProjectDemo() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [revealed, setRevealed] = useState(0);
  const timers = useRef<NodeJS.Timeout[]>([]);

  const convert = useCallback(() => {
    if (phase === "converting") return;
    timers.current.forEach(clearTimeout);
    timers.current = [];

    if (phase === "done") {
      setPhase("idle");
      setRevealed(0);
      return;
    }

    setPhase("converting");
    setRevealed(0);
    ROWS.forEach((_, i) => {
      timers.current.push(setTimeout(() => setRevealed((r) => r + 1), 350 + i * 320));
    });
    timers.current.push(setTimeout(() => setPhase("done"), 350 + ROWS.length * 320 + 200));
  }, [phase]);

  return (
    <div style={{ border: `1px solid ${LINE}`, borderRadius: "14px", overflow: "hidden", background: "#fff", boxShadow: "0 4px 24px -8px rgba(23,21,15,.14)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: ".8rem 1.2rem", borderBottom: `1px solid ${LINE}`, background: BASE2 }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".12em", textTransform: "uppercase", color: INK, fontWeight: 600 }}>
          Approved Demand → Project Canvas
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".08em", textTransform: "uppercase", color: "#3a7a4a", padding: ".2rem .5rem", borderRadius: "100px", background: "rgba(58,122,74,.1)" }}>
          Approved
        </span>
      </div>

      <div style={{ padding: "1.3rem 1.4rem" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: ".5rem", marginBottom: "1.3rem", minHeight: ROWS.length * 50 }}>
          {ROWS.map((row, i) => (
            <div
              key={row.label}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: ".6rem .9rem", borderRadius: "8px",
                border: `1px solid ${i < revealed ? LINA : LINE}`,
                background: i < revealed ? "rgba(255,164,38,.04)" : "transparent",
                opacity: i < revealed ? 1 : 0.3,
                transition: "all .35s cubic-bezier(.22,1,.36,1)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: ".48rem", letterSpacing: ".06em",
                  padding: ".15rem .4rem", borderRadius: "4px",
                  color: row.source === "AUTO" ? "#8b5cf6" : ACCD,
                  background: row.source === "AUTO" ? "rgba(139,92,246,.1)" : "rgba(255,164,38,.1)",
                }}>
                  {row.source}
                </span>
                <span style={{ fontSize: ".8rem", color: INK, fontWeight: 600 }}>{row.label}</span>
              </div>
              <span style={{ fontSize: ".72rem", color: DIM, textAlign: "right" }}>{i < revealed ? row.content : ""}</span>
            </div>
          ))}
        </div>

        <button
          onClick={convert}
          style={{
            width: "100%", fontFamily: "var(--font-mono)", fontSize: ".65rem", letterSpacing: ".12em", textTransform: "uppercase",
            color: phase === "done" ? ACCD : "#17150F",
            background: phase === "done" ? "transparent" : phase === "converting" ? FAINT : ACC,
            border: phase === "done" ? `1px solid ${LINA}` : "none",
            borderRadius: "6px", padding: ".75rem", cursor: phase === "converting" ? "default" : "pointer",
            transition: "all .25s ease",
          }}
          disabled={phase === "converting"}
        >
          {phase === "idle" && "Convert to project →"}
          {phase === "converting" && "Converting…"}
          {phase === "done" && "Converted! · Click to reset"}
        </button>
      </div>
    </div>
  );
}
