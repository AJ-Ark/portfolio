"use client";

import { useTranslation } from "@/lib/TranslationContext";
import {
  type PhaseMetaEntry,
  phaseLabelKey,
  phaseQuestionKey,
  phasePersonaKey,
  phaseDescKey,
} from "./trmericPhaseMeta";

/* ── Accent is the same in dark + light ── */
const ACC = "#FFA426";
const ACCB = "#FFB84D";
const LINA = "rgba(255,164,38,.26)";
const BASE = "var(--trm-base)";
const DIM = "var(--trm-dim)";
const ACCD = "var(--trm-accd)";
const LINE = "var(--trm-line)";

/* Minimal monochrome persona markers — same line-art register as the
   pipeline/schematic diagrams elsewhere on the site, not character illustration. */
function PersonaIcon({ kind }: { kind: "chat" | "grid" | "flag" | "eye" }) {
  const common = { fill: "none", stroke: ACC, strokeWidth: 1.3, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return (
    <svg width="15" height="15" viewBox="0 0 16 16" {...common}>
      {kind === "chat" && (
        <>
          <path d="M2 3.5h12v7H6.5L3.5 13v-2.5H2v-7z" />
          <circle cx="8" cy="7" r=".6" fill={ACC} stroke="none" />
        </>
      )}
      {kind === "grid" && (
        <>
          <rect x="2" y="2" width="5" height="5" rx=".6" />
          <rect x="9" y="2" width="5" height="5" rx=".6" />
          <rect x="2" y="9" width="5" height="5" rx=".6" />
          <rect x="9" y="9" width="5" height="5" rx=".6" />
        </>
      )}
      {kind === "flag" && (
        <>
          <path d="M3.5 1.5v13" />
          <path d="M3.5 2.5h9l-2.5 3 2.5 3h-9" />
        </>
      )}
      {kind === "eye" && (
        <>
          <path d="M1.5 8S4 3.5 8 3.5 14.5 8 14.5 8 12 12.5 8 12.5 1.5 8 1.5 8z" />
          <circle cx="8" cy="8" r="2" />
        </>
      )}
    </svg>
  );
}

/* One lifecycle-phase card in the "04 · LIFECYCLE" grid. Needs
   useTranslation(), so it's the client leaf the server page hands the
   static per-phase data (letter/icon/surfaces/anchor) to. */
export default function PhaseCard({ letter, icon, surfaces, anchor }: PhaseMetaEntry) {
  const { t } = useTranslation();
  const label = t(phaseLabelKey(letter));
  const question = t(phaseQuestionKey(letter));
  const persona = t(phasePersonaKey(letter));
  const desc = t(phaseDescKey(letter));

  return (
    <a
      href={anchor}
      className="trm-phase-card"
      style={{ padding: "1.8rem 1.6rem", background: BASE, borderRight: `1px solid ${LINE}`, textDecoration: "none", display: "block", height: "100%", transition: "background .3s ease" }}
    >
      <div style={{ fontFamily: "var(--font-body)", fontWeight: 800, fontSize: "2.6rem", letterSpacing: "-.04em", color: ACC, lineHeight: 1, marginBottom: ".4rem" }}>{letter}</div>
      <div style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".16em", textTransform: "uppercase", color: ACCB, marginBottom: ".3rem" }}>{label}</div>
      <div style={{ fontFamily: "var(--font-body)", fontStyle: "italic", fontSize: ".8125rem", color: ACCD, marginBottom: ".7rem" }}>{question}</div>
      <div style={{ display: "flex", alignItems: "center", gap: ".45rem", marginBottom: "1rem", paddingBottom: ".9rem", borderBottom: `1px solid ${LINE}` }}>
        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "24px", height: "24px", borderRadius: "50%", border: `1px solid ${LINA}`, flexShrink: 0 }}>
          <PersonaIcon kind={icon} />
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: ".58rem", letterSpacing: ".08em", textTransform: "uppercase", color: DIM }}>{persona}</span>
      </div>
      <p style={{ fontSize: ".8125rem", color: DIM, lineHeight: 1.6, marginBottom: "1rem" }}>{desc}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: ".4rem", marginBottom: "1.1rem" }}>
        {surfaces.map((n) => <span key={n} style={{ fontFamily: "var(--font-mono)", fontSize: ".72rem", letterSpacing: ".04em", color: DIM, lineHeight: 1.4 }}>· {n}</span>)}
      </div>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".16em", textTransform: "uppercase", color: ACCD }}>
        See the work ↓
      </span>
    </a>
  );
}
