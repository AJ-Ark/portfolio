"use client";

import { useState, useRef, useEffect } from "react";

const ACC = "#FFA426";
const ACCD = "#E8730E";
const INK = "#17150F";
const DIM = "#6f6a5e";
const FAINT = "#9b9488";
const LINE = "rgba(23,21,15,.12)";
const LINA = "rgba(255,164,38,.22)";

type Step = 0 | 1 | 2 | 3 | 4;

const PROJECT_TYPES = ["Cloud Migration", "Product Launch", "Process Improvement"];
const OBJECTIVES = ["Cost Reduction", "Performance Improvement", "Compliance"];
const TIMELINES = ["3 months", "6 months", "12 months"];

const CONFIDENCE: Record<Step, number> = { 0: 0, 1: 20, 2: 45, 3: 65, 4: 100 };

const ENRICH_LINES = [
  "Scanning organizational data",
  "Matching 3 similar projects",
  "Analyzing budget history",
  "Generating recommendations",
];

interface Msg { from: "tango" | "you"; text: string; }

export default function TangoConversationDemo() {
  const [step, setStep] = useState<Step>(0);
  const [type, setType] = useState<string | null>(null);
  const [objective, setObjective] = useState<string | null>(null);
  const [timeline, setTimeline] = useState<string | null>(null);
  const [enrichDone, setEnrichDone] = useState(0);
  const enrichTimer = useRef<NodeJS.Timeout[]>([]);

  const messages: Msg[] = [];
  messages.push({ from: "tango", text: "What kind of project are we shaping today?" });
  if (type) {
    messages.push({ from: "you", text: type });
    messages.push({ from: "tango", text: "Got it. What's the primary objective?" });
  }
  if (objective) {
    messages.push({ from: "you", text: objective });
    messages.push({ from: "tango", text: "One more thing: what's the timeline?" });
  }
  if (timeline) {
    messages.push({ from: "you", text: timeline });
  }

  useEffect(() => {
    if (step !== 3) return;
    enrichTimer.current.forEach(clearTimeout);
    enrichTimer.current = ENRICH_LINES.map((_, i) =>
      setTimeout(() => setEnrichDone((d) => Math.max(d, i + 1)), 500 + i * 650)
    );
    enrichTimer.current.push(
      setTimeout(() => setStep(4), 500 + ENRICH_LINES.length * 650 + 400)
    );
    return () => enrichTimer.current.forEach(clearTimeout);
  }, [step]);

  function pick(setter: (v: string) => void, value: string, next: Step) {
    setter(value);
    setTimeout(() => setStep(next), 250);
  }

  function reset() {
    enrichTimer.current.forEach(clearTimeout);
    setStep(0);
    setType(null);
    setObjective(null);
    setTimeline(null);
    setEnrichDone(0);
  }

  return (
    <div style={{ border: `1px solid ${LINE}`, borderRadius: "14px", overflow: "hidden", background: "#fff", boxShadow: "0 4px 24px -8px rgba(23,21,15,.14)" }}>
      {/* Toolbar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: ".8rem 1.2rem", borderBottom: `1px solid ${LINE}`, background: "linear-gradient(135deg, rgba(139,92,246,.06), rgba(255,164,38,.06))" }}>
        <div style={{ display: "flex", alignItems: "center", gap: ".6rem" }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "linear-gradient(135deg, #8b5cf6, #FFA426)" }} />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".12em", textTransform: "uppercase", color: INK, fontWeight: 600 }}>Tango</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".08em", color: FAINT }}>Demand intake</span>
        </div>
        {step > 0 && (
          <button onClick={reset} style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".1em", textTransform: "uppercase", color: FAINT, background: "none", border: `1px solid ${LINE}`, borderRadius: "4px", padding: ".3rem .6rem", cursor: "pointer" }}>
            Reset
          </button>
        )}
      </div>

      {/* Confidence bar */}
      <div style={{ padding: ".6rem 1.2rem", borderBottom: `1px solid ${LINE}`, display: "flex", alignItems: "center", gap: ".8rem" }}>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: ".5rem", letterSpacing: ".1em", textTransform: "uppercase", color: FAINT, whiteSpace: "nowrap" }}>Confidence</span>
        <div style={{ flex: 1, height: 4, borderRadius: 2, background: BASE2_BG }}>
          <div style={{ height: "100%", borderRadius: 2, width: `${CONFIDENCE[step]}%`, background: `linear-gradient(90deg, ${ACC}, ${ACCD})`, transition: "width .5s cubic-bezier(.22,1,.36,1)" }} />
        </div>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", color: ACCD, fontWeight: 600, minWidth: "2.4rem", textAlign: "right" }}>{CONFIDENCE[step]}%</span>
      </div>

      {/* Conversation */}
      <div style={{ padding: "1.4rem", minHeight: 260, display: "flex", flexDirection: "column", gap: ".8rem" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.from === "you" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "80%",
              padding: ".6rem .9rem",
              borderRadius: m.from === "you" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
              background: m.from === "you" ? ACC : BASE2_BG,
              color: m.from === "you" ? "#fff" : INK,
              fontSize: ".82rem",
              lineHeight: 1.5,
            }}>
              {m.text}
            </div>
          </div>
        ))}

        {/* Step 0: project type buttons */}
        {step === 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem", marginTop: ".3rem" }}>
            {PROJECT_TYPES.map((t) => (
              <button key={t} onClick={() => pick(setType, t, 1)} style={chipStyle}>{t}</button>
            ))}
          </div>
        )}
        {/* Step 1: objective buttons */}
        {step === 1 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem", marginTop: ".3rem" }}>
            {OBJECTIVES.map((o) => (
              <button key={o} onClick={() => pick(setObjective, o, 2)} style={chipStyle}>{o}</button>
            ))}
          </div>
        )}
        {/* Step 2: timeline buttons */}
        {step === 2 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem", marginTop: ".3rem" }}>
            {TIMELINES.map((t) => (
              <button key={t} onClick={() => pick(setTimeline, t, 3)} style={chipStyle}>{t}</button>
            ))}
          </div>
        )}

        {/* Step 3: enrichment checklist */}
        {step === 3 && (
          <div style={{ marginTop: ".3rem", padding: ".9rem 1rem", border: `1px solid ${LINA}`, borderRadius: "10px", background: "rgba(255,164,38,.04)" }}>
            {ENRICH_LINES.map((line, i) => (
              <div key={line} style={{ display: "flex", alignItems: "center", gap: ".6rem", padding: ".3rem 0", opacity: i < enrichDone ? 1 : 0.35, transition: "opacity .3s ease" }}>
                <span style={{
                  width: 14, height: 14, borderRadius: "50%", flexShrink: 0,
                  border: `1.5px solid ${i < enrichDone ? ACCD : FAINT}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: i < enrichDone ? ACCD : "transparent",
                  transition: "all .3s ease",
                }}>
                  {i < enrichDone && <span style={{ color: "#fff", fontSize: ".5rem", lineHeight: 1 }}>✓</span>}
                </span>
                <span style={{ fontSize: ".78rem", color: i < enrichDone ? INK : FAINT }}>{line}</span>
              </div>
            ))}
          </div>
        )}

        {/* Step 4: completion */}
        {step === 4 && (
          <div style={{ marginTop: ".3rem" }}>
            <div style={{ padding: ".9rem 1rem", border: `1px solid ${LINA}`, borderRadius: "10px", background: "rgba(255,164,38,.06)", marginBottom: ".8rem" }}>
              <p style={{ fontSize: ".82rem", color: INK, lineHeight: 1.5, marginBottom: ".6rem" }}>Your demand canvas is ready for review. All fields populated, team suggested, budget estimated.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: ".4rem" }}>
                {[`Type: ${type}`, `Objective: ${objective}`, `Timeline: ${timeline}`].map((tag) => (
                  <span key={tag} style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", padding: ".3rem .6rem", borderRadius: "100px", border: `1px solid ${LINA}`, color: ACCD, background: "#fff" }}>{tag}</span>
                ))}
              </div>
            </div>
            <button onClick={reset} style={{ fontFamily: "var(--font-mono)", fontSize: ".62rem", letterSpacing: ".1em", textTransform: "uppercase", color: "#fff", background: ACC, border: "none", borderRadius: "4px", padding: ".55rem 1.1rem", cursor: "pointer" }}>
              Run again →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const BASE2_BG = "#F1EADC";

const chipStyle: React.CSSProperties = {
  fontFamily: "var(--font-mono)",
  fontSize: ".68rem",
  padding: ".5rem 1rem",
  borderRadius: "100px",
  border: `1px solid ${LINA}`,
  background: "#fff",
  color: ACCD,
  cursor: "pointer",
};
