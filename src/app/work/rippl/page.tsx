"use client";

import Image from "next/image";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import WordReveal from "@/components/ui/WordReveal";
import Reveal from "@/components/ui/Reveal";
import NextProject from "@/components/ui/NextProject";
import RipplVideoCard from "@/components/ui/RipplVideoCard";
import InlineVideo from "@/components/ui/InlineVideo";
import { useColorScheme } from "@/hooks/useColorScheme";

/* ── Palette — CSS vars so sub-components auto-adapt to dark/light ── */
const BASE  = "var(--color-ground)";
const BASE2 = "var(--color-ground-2)";
const PAPER = "var(--color-paper)";
const DIM   = "var(--color-dim)";
const FAINT = "var(--color-faint)";
const ACC   = "var(--color-accent)";
const ACCB  = "var(--color-accent-bright)";
const LINE  = "var(--line)";
const LINEW = "var(--line-weak)";

/* ── SVG: Before / After reading journey ── */
function ReadingJourneySVG() {
  const nodeR = 22;
  const cols  = [150, 290, 430, 570, 710, 850];
  const rowA  = 60;   // without Rippl
  const rowB  = 180;  // with Rippl

  const nodesA = [
    { x: cols[0], label: "Open book",   sub: "Intent" },
    { x: cols[1], label: "Phone buzzes", sub: "Interrupt" },
    { x: cols[2], label: "Focus lost",   sub: "Distraction" },
    { x: cols[3], label: "Try again",    sub: "Re-engage" },
    { x: cols[4], label: "Skim",         sub: "Compromise" },
  ];

  const nodesB = [
    { x: cols[0], label: "Open book",   sub: "Intent" },
    { x: cols[1], label: "Mark term",   sub: "Natural gesture" },
    { x: cols[2], label: "Rippl sees",  sub: "Recognition" },
    { x: cols[3], label: "Info projected", sub: "Alongside page" },
    { x: cols[4], label: "Keep reading", sub: "Flow preserved" },
    { x: cols[5], label: "Notes saved", sub: "Recall ready" },
  ];

  return (
    <svg
      viewBox="0 0 1020 260"
      style={{ width: "100%", maxWidth: 1020, display: "block" }}
      aria-label="Before and after comparison of reading experience with and without Rippl"
    >
      {/* Row labels */}
      <text x="0" y={rowA - nodeR - 10} fontFamily="var(--font-mono)" fontSize="9" letterSpacing="2" fill={FAINT} textAnchor="start" textDecoration="none">WITHOUT RIPPL</text>
      <text x="0" y={rowB - nodeR - 10} fontFamily="var(--font-mono)" fontSize="9" letterSpacing="2" fill={ACC} textAnchor="start">WITH RIPPL</text>

      {/* Path A — muted */}
      {nodesA.slice(0, -1).map((n, i) => (
        <line key={i} x1={n.x + nodeR} y1={rowA} x2={nodesA[i + 1].x - nodeR} y2={rowA}
          stroke={FAINT} strokeWidth="1" strokeDasharray="4 3" />
      ))}
      {nodesA.map((n) => (
        <g key={n.x}>
          <circle cx={n.x} cy={rowA} r={nodeR} fill="none" stroke={FAINT} strokeWidth="1" />
          <text x={n.x} y={rowA + 4} fontFamily="var(--font-mono)" fontSize="7.5" fill={FAINT} textAnchor="middle">{n.label.split(" ")[0]}</text>
          <text x={n.x} y={rowA + 13} fontFamily="var(--font-mono)" fontSize="7.5" fill={FAINT} textAnchor="middle">{n.label.split(" ")[1] ?? ""}</text>
          <text x={n.x} y={rowA + nodeR + 14} fontFamily="var(--font-mono)" fontSize="7" fill={FAINT} textAnchor="middle" opacity="0.6">{n.sub}</text>
        </g>
      ))}
      {/* Outcome A */}
      <text x={nodesA[4].x + nodeR + 16} y={rowA + 5} fontFamily="var(--font-display)" fontSize="16" fontStyle="italic" fill={FAINT}>→ Forgotten</text>

      {/* Path B — orange */}
      {nodesB.slice(0, -1).map((n, i) => (
        <line key={i} x1={n.x + nodeR} y1={rowB} x2={nodesB[i + 1].x - nodeR} y2={rowB}
          stroke={ACC} strokeWidth="1.5" />
      ))}
      {nodesB.map((n) => (
        <g key={n.x}>
          <circle cx={n.x} cy={rowB} r={nodeR} fill={n.sub === "Natural gesture" || n.sub === "Recognition" ? "color-mix(in srgb, var(--color-accent) 13%, transparent)" : "none"} stroke={n.x === cols[0] ? FAINT : ACC} strokeWidth="1.5" />
          <text x={n.x} y={rowB + 4} fontFamily="var(--font-mono)" fontSize="7.5" fill={n.x === cols[0] ? FAINT : PAPER} textAnchor="middle">{n.label.split(" ")[0]}</text>
          <text x={n.x} y={rowB + 13} fontFamily="var(--font-mono)" fontSize="7.5" fill={n.x === cols[0] ? FAINT : PAPER} textAnchor="middle">{n.label.split(" ")[1] ?? ""}</text>
          <text x={n.x} y={rowB + nodeR + 14} fontFamily="var(--font-mono)" fontSize="7" fill={ACC} textAnchor="middle" opacity="0.8">{n.sub}</text>
        </g>
      ))}
      {/* Outcome B */}
      <text x={nodesB[5].x + nodeR + 16} y={rowB + 5} fontFamily="var(--font-display)" fontSize="16" fontStyle="italic" fill={ACC}>→ Retained</text>

      {/* Divider */}
      <line x1="0" y1="120" x2="1020" y2="120" stroke={LINEW} strokeWidth="1" />
    </svg>
  );
}

/* ── SVG: Recognition pipeline ── */
function PipelineSVG() {
  const stages = [
    { label: "Camera",    sub: "30fps capture", icon: "⬡" },
    { label: "Frame",     sub: "Region detect",  icon: "⬡" },
    { label: "Python OCR",sub: "Text extract",   icon: "⬡" },
    { label: "Lookup",    sub: "Knowledge base", icon: "⬡" },
    { label: "Projection",sub: "Beside page",    icon: "⬡" },
  ];
  const w = 140, gap = 20, h = 80;
  const total = stages.length * w + (stages.length - 1) * gap;

  return (
    <svg
      viewBox={`0 0 ${total} ${h + 20}`}
      style={{ width: "100%", maxWidth: total, display: "block" }}
      aria-label="Rippl recognition pipeline: camera capture through to projected output"
    >
      {stages.map((s, i) => {
        const x = i * (w + gap);
        const isLast = i === stages.length - 1;
        return (
          <g key={s.label}>
            {/* Box */}
            <rect x={x} y={0} width={w} height={h} rx="6"
              fill={isLast ? "color-mix(in srgb, var(--color-accent) 9%, transparent)" : LINEW}
              stroke={isLast ? ACC : LINEW}
              strokeWidth="1"
            />
            {/* Step number */}
            <text x={x + 10} y={18} fontFamily="var(--font-mono)" fontSize="9" fill={isLast ? ACC : FAINT}>0{i + 1}</text>
            {/* Label */}
            <text x={x + w / 2} y={38} fontFamily="var(--font-body)" fontSize="12" fontWeight="600" fill={isLast ? PAPER : DIM} textAnchor="middle">{s.label}</text>
            {/* Sub */}
            <text x={x + w / 2} y={54} fontFamily="var(--font-mono)" fontSize="8.5" fill={isLast ? ACC : FAINT} textAnchor="middle">{s.sub}</text>
            {/* Arrow */}
            {!isLast && (
              <path d={`M${x + w + 4},${h / 2} L${x + w + gap - 4},${h / 2}`}
                stroke={ACC} strokeWidth="1.5" fill="none"
                markerEnd="url(#arr)" />
            )}
          </g>
        );
      })}
      <defs>
        <marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6" fill="none" stroke={ACC} strokeWidth="1.2" />
        </marker>
      </defs>
    </svg>
  );
}

/* ── SVG: Device schematic ── */
function DeviceSchematicSVG() {
  return (
    <svg viewBox="0 0 320 400" style={{ width: "100%", maxWidth: 280, display: "block" }}
      aria-label="Rippl device schematic showing lamp body, camera module, and projector module">
      {/* Base */}
      <rect x="110" y="360" width="100" height="14" rx="4" fill="none" stroke={LINEW} strokeWidth="1.5" />
      {/* Stem */}
      <rect x="152" y="200" width="16" height="162" fill="none" stroke={LINEW} strokeWidth="1.5" />
      {/* Arm curve */}
      <path d="M160,200 Q160,130 210,120" fill="none" stroke={LINEW} strokeWidth="1.5" />
      {/* Lamp head */}
      <ellipse cx="220" cy="110" rx="34" ry="20" fill="none" stroke={PAPER} strokeWidth="1.5" opacity="0.6" />
      <line x1="196" y1="116" x2="186" y2="160" stroke={PAPER} strokeWidth="1" opacity="0.3" />
      <line x1="220" y1="130" x2="220" y2="160" stroke={PAPER} strokeWidth="1" opacity="0.3" />
      <line x1="244" y1="116" x2="254" y2="160" stroke={PAPER} strokeWidth="1" opacity="0.3" />

      {/* Camera module — attached to arm */}
      <rect x="130" y="178" width="36" height="26" rx="4" fill="none" stroke={ACC} strokeWidth="1.5" />
      <circle cx="148" cy="191" r="7" fill="none" stroke={ACC} strokeWidth="1" />
      <circle cx="148" cy="191" r="3" fill="color-mix(in srgb, var(--color-accent) 25%, transparent)" stroke={ACC} strokeWidth="1" />

      {/* Projector cone — projects downward */}
      <path d="M130,210 L94,290 L176,290 L162,210 Z" fill="color-mix(in srgb, var(--color-accent) 6%, transparent)" stroke={LINE} strokeWidth="1" />
      <text x="135" y="255" fontFamily="var(--font-mono)" fontSize="8" fill={ACC} opacity="0.7">PROJECTION</text>

      {/* Labels */}
      <line x1="254" y1="110" x2="290" y2="90" stroke={LINEW} strokeWidth="1" />
      <text x="292" y="88" fontFamily="var(--font-mono)" fontSize="9" fill={FAINT}>Lamp head</text>

      <line x1="166" y1="191" x2="185" y2="170" stroke={LINE} strokeWidth="1" />
      <text x="187" y="168" fontFamily="var(--font-mono)" fontSize="9" fill={ACC}>Camera</text>

      <line x1="130" y1="230" x2="84" y2="215" stroke={LINE} strokeWidth="1" />
      <text x="12" y="213" fontFamily="var(--font-mono)" fontSize="9" fill={ACC}>Projector</text>

      <line x1="160" y1="360" x2="160" y2="390" stroke={LINEW} strokeWidth="1" />
      <text x="112" y="398" fontFamily="var(--font-mono)" fontSize="9" fill={FAINT}>Weighted base</text>
    </svg>
  );
}

/* ── Flow diagram primitives — recreated IA, not the original sketches ── */
interface FStep { label: string; kind?: "action" | "option"; }

function FlowChip({ label, kind = "action" }: FStep) {
  const isAction = kind === "action";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: isAction ? ".55rem .5rem" : ".5rem .9rem",
        minHeight: isAction ? "3.4rem" : "auto",
        minWidth: isAction ? "3.4rem" : "auto",
        borderRadius: isAction ? "50%" : "100px",
        border: `1px solid ${isAction ? ACC : FAINT}`,
        background: isAction ? "color-mix(in srgb, var(--color-accent) 6%, transparent)" : "transparent",
        color: isAction ? ACCB : PAPER,
        fontFamily: "var(--font-mono)",
        fontSize: ".58rem",
        lineHeight: 1.25,
        letterSpacing: ".01em",
        whiteSpace: "pre-line",
      }}
    >
      {label}
    </span>
  );
}

function FlowArrow({ vertical = false }: { vertical?: boolean }) {
  return (
    <span
      aria-hidden="true"
      style={{
        flexShrink: 0,
        width: vertical ? "1px" : "1.4rem",
        height: vertical ? "1.2rem" : "1px",
        borderTop: vertical ? "none" : `1px dashed ${FAINT}`,
        borderLeft: vertical ? `1px dashed ${FAINT}` : "none",
        margin: vertical ? "0 0 0 1.7rem" : "0",
      }}
    />
  );
}

/* A single horizontal chain of steps */
function FlowChain({ steps }: { steps: FStep[] }) {
  return (
    <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: ".4rem", rowGap: "1.4rem" }}>
      {steps.map((s, i) => (
        <span key={i} style={{ display: "flex", alignItems: "center", gap: ".4rem" }}>
          <FlowChip {...s} />
          {i < steps.length - 1 && <FlowArrow />}
        </span>
      ))}
    </div>
  );
}

/* A trunk step that forks into multiple parallel branch chains */
function FlowFork({ trunk, branches }: { trunk: FStep; branches: FStep[][] }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: ".4rem" }}>
      <FlowChip {...trunk} />
      <span style={{ display: "flex", flexDirection: "column", marginTop: ".2rem" }}>
        {branches.map((branch, bi) => (
          <span key={bi} style={{ display: "flex", alignItems: "center" }}>
            <FlowArrow />
            <FlowChain steps={branch} />
          </span>
        ))}
      </span>
    </div>
  );
}

export default function RipplPage() {
  const dark = useColorScheme();
  const GRAD_BASE = dark ? "#0d0904" : "#F7F3EC";
  const GRAD_88   = dark ? "rgba(13,9,4,.88)"  : "rgba(247,243,236,.88)";
  const GRAD_45   = dark ? "rgba(13,9,4,.45)"  : "rgba(247,243,236,.45)";

  return (
    <>
      <Navigation />
      <main id="main-content" style={{ background: BASE, color: PAPER }}>

        {/* ═══════════════════════════════════════════
            01 · HERO — massive type, full-bleed image
        ═══════════════════════════════════════════ */}
        <section style={{
          minHeight: "100dvh", display: "flex", flexDirection: "column",
          justifyContent: "flex-end", position: "relative", overflow: "hidden",
          padding: "0 var(--pad) 4rem",
        }}>
          <div style={{ position: "absolute", inset: 0 }}>
            <Image src="/images/rippl/rippl-hero.jpg"
              alt="Rippl projector lamp on a study desk, illuminating an open book" fill
              style={{ objectFit: "cover", objectPosition: "center 40%" }} priority />
          </div>
          <div aria-hidden="true" style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(to top, ${GRAD_BASE} 0%, ${GRAD_88} 35%, ${GRAD_45} 65%, transparent 100%)`,
          }} />

          {/* Huge title — top-left, cropped */}
          <div style={{ position: "absolute", top: "10vh", left: "var(--pad)", zIndex: 2 }}>
            <div style={{
              fontFamily: "var(--font-display)", fontWeight: 400,
              fontSize: "clamp(6rem, 22vw, 20rem)", lineHeight: 0.85,
              letterSpacing: "-.06em", color: PAPER, opacity: 0.12,
              userSelect: "none", pointerEvents: "none",
            }} aria-hidden="true">Rippl</div>
          </div>

          <Reveal stagger style={{ position: "relative", zIndex: 3 }}>
            <div style={{
              fontFamily: "var(--font-mono)", fontSize: ".6rem",
              letterSpacing: ".28em", textTransform: "uppercase",
              color: ACC, opacity: 0.85, marginBottom: "1.4rem",
            }}>
              01 · Product × Interaction · 12 Weeks · NID Gandhinagar · 2023
            </div>

            <h1 style={{
              fontFamily: "var(--font-display)", fontWeight: 400,
              fontSize: "clamp(2.8rem, 7vw, 6rem)", lineHeight: 1.0,
              letterSpacing: "-.02em", color: PAPER, marginBottom: "1.4rem",
            }}>
              Notes that{" "}
              <em style={{ fontStyle: "italic", color: ACCB }}>ripple</em>
              <br />beyond the page.
            </h1>

            <p style={{ fontSize: "clamp(.9rem, 1.5vw, 1.1rem)", color: DIM, maxWidth: "44ch", lineHeight: 1.7, marginBottom: "2.5rem" }}>
              An advanced projector-table lamp that makes reading and note-taking
              more focused, immersive, and interactive, without replacing the book.
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "2.5rem", paddingTop: "1.8rem", borderTop: `1px solid ${LINEW}` }}>
              {[["Role","Research & Design"],["Duration","12 weeks"],["Focus","Learning & memory"],["Prototypes","3 working builds"]].map(([l,v]) => (
                <div key={l}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: ".5rem", letterSpacing: ".2em", textTransform: "uppercase", color: FAINT, display: "block", marginBottom: ".3rem" }}>{l}</span>
                  <span style={{ fontSize: ".8rem", color: DIM }}>{v}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </section>

        {/* ═══════════════════════════════════════════
            02 · MANIFESTO
        ═══════════════════════════════════════════ */}
        <section style={{ padding: "8rem var(--pad)", borderTop: `1px solid ${LINEW}` }}>
          <div style={{ maxWidth: "980px", margin: "0 auto" }}>
            <Reveal as="span" style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".26em", textTransform: "uppercase", color: ACC, opacity: 0.8, display: "block", marginBottom: "2.5rem" }}>The premise</Reveal>
            <WordReveal as="p" delay={0} stagger={38} style={{
              fontFamily: "var(--font-display)", fontWeight: 400,
              fontSize: "clamp(2rem, 5.5vw, 5rem)", lineHeight: 1.0,
              letterSpacing: "-.025em", color: PAPER, maxWidth: "18ch", marginBottom: "3rem",
            }}>
              Reading asks for attention. Technology keeps taking it.
            </WordReveal>
            <Reveal style={{ borderLeft: `2px solid ${ACC}`, paddingLeft: "1.8rem", maxWidth: "46ch" }}>
              <p style={{ fontSize: "clamp(.9rem, 1.4vw, 1.1rem)", color: DIM, lineHeight: 1.7 }}>
                I observed distracted reading among my peers at NID and began an
                ambiguous journey: could emerging technology improve learning without
                interrupting its most natural ritual?
              </p>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".16em", textTransform: "uppercase", color: FAINT, display: "block", marginTop: ".8rem" }}>Initial observation / NID Gandhinagar</span>
            </Reveal>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            03 · WHO NEEDS THIS — PERSONAS
        ═══════════════════════════════════════════ */}
        <section style={{ padding: "0 var(--pad) 6rem var(--pad)" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <Reveal as="span" style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".26em", textTransform: "uppercase", color: FAINT, opacity: 0.6, display: "block", marginBottom: "2rem" }}>Who needs this</Reveal>
            <Reveal className="mobile-stack" stagger style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderTop: `1px solid ${LINEW}`, borderLeft: `1px solid ${LINEW}` }}>
              {[
                { who: "Medical students", context: "Dense terminology, high-stakes recall, limited time.", need: "Instant definitions beside the text, without losing place." },
                { who: "Civil exam aspirants", context: "Months of multi-subject revision, cross-referencing sources.", need: "Linked notes that surface related material automatically." },
                { who: "Research scholars", context: "Annotating papers, connecting ideas across books and journals.", need: "Projection layer that keeps context visible while reading." },
              ].map(({ who, context, need }) => (
                <div key={who} style={{ height: "100%", padding: "2rem 1.8rem", borderRight: `1px solid ${LINEW}`, borderBottom: `1px solid ${LINEW}` }}>
                  <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "1.1rem", color: ACCB, marginBottom: ".6rem" }}>{who}</div>
                  <p style={{ fontSize: ".8125rem", color: FAINT, lineHeight: 1.6, marginBottom: ".8rem" }}>{context}</p>
                  <div style={{ borderTop: `1px solid ${LINE}`, paddingTop: ".6rem" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: ".5rem", letterSpacing: ".16em", textTransform: "uppercase", color: ACC, display: "block", marginBottom: ".3rem" }}>Core need</span>
                    <p style={{ fontSize: ".8125rem", color: DIM, lineHeight: 1.6 }}>{need}</p>
                  </div>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            04 · THE OBJECT + SCHEMATIC
        ═══════════════════════════════════════════ */}
        <section style={{ padding: "6rem var(--pad)", background: BASE2, borderTop: `1px solid ${LINEW}` }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <Reveal as="span" style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".2em", textTransform: "uppercase", color: FAINT, display: "block", marginBottom: "3rem" }}>02 / The object</Reveal>
            <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
              <Reveal stagger>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".26em", textTransform: "uppercase", color: ACC, opacity: 0.85, display: "block", marginBottom: "1rem" }}>What is Rippl?</span>
                <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(2rem, 4.5vw, 3.8rem)", lineHeight: 1.05, letterSpacing: "-.01em", color: PAPER, marginBottom: "1.4rem" }}>
                  A lamp that{" "}<em style={{ fontStyle: "italic", color: ACCB }}>thinks with you.</em>
                </h2>
                <p style={{ fontSize: ".9375rem", color: DIM, lineHeight: 1.78, maxWidth: "44ch", marginBottom: "1.2rem" }}>
                  Rippl lives in your study space. It looks like a table lamp. It works like a reading companion. Point it at the book you're reading, mark a term, and it fills the space beside your page with exactly what you need, without you touching a screen.
                </p>
                <p style={{ fontSize: ".9375rem", color: DIM, lineHeight: 1.78, maxWidth: "44ch" }}>
                  Three components in one object: a lamp, a camera, and a projector. Three things people already understand, combined into something that asks for no behaviour change.
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem", marginTop: "1.6rem" }}>
                  {["Text recognition","Focused projection","Handwriting capture","Distraction-free","OCR + Python"].map(t => (
                    <span key={t} style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".12em", textTransform: "uppercase", color: ACC, background: `rgba(79,168,160,.08)`, border: `1px solid ${LINE}`, borderRadius: "4px", padding: ".3rem .7rem" }}>{t}</span>
                  ))}
                </div>
              </Reveal>

              {/* Device schematic + photo */}
              <Reveal stagger style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "center", padding: "2rem", background: BASE, borderRadius: "14px", border: `1px solid ${LINEW}` }}>
                  <DeviceSchematicSVG />
                </div>
                <div style={{ position: "relative", height: "280px", borderRadius: "12px", overflow: "hidden", border: `1px solid ${LINEW}` }}>
                  <Image src="/images/rippl/rippl-device.jpg" alt="Physical form study of the Rippl projector-table lamp, table lamp mode" fill style={{ objectFit: "cover" }} />
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: ".6rem 1rem", background: "rgba(13,9,4,.75)", borderTop: `1px solid ${LINEW}`, fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".14em", textTransform: "uppercase", color: FAINT }}>
                    01 · Table lamp mode · Physical form study
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            05 · RESEARCH
        ═══════════════════════════════════════════ */}
        <section style={{ padding: "6rem var(--pad)", borderTop: `1px solid ${LINEW}` }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <Reveal as="span" style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".2em", textTransform: "uppercase", color: FAINT, display: "block", marginBottom: "3rem" }}>03 / Research</Reveal>
            <Reveal as="h2" delay={0.1} style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(2rem, 5vw, 4.2rem)", lineHeight: 1.08, letterSpacing: "-.015em", color: PAPER, maxWidth: "22ch", marginBottom: "3rem" }}>
              We reach for a book. Then the internet{" "}<em style={{ fontStyle: "italic", color: ACC }}>reaches back.</em>
            </Reveal>

            <Reveal as="blockquote" style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "clamp(1.1rem, 2.4vw, 1.7rem)", lineHeight: 1.35, color: PAPER, borderLeft: `3px solid ${ACC}`, paddingLeft: "1.8rem", maxWidth: "46ch", marginBottom: "3.5rem" }}>
              "Picture this: you're all set to hit the books, but before you know it, your phone buzzes, social media beckons, and your focus takes a fall."
              <footer style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".16em", textTransform: "uppercase", color: FAINT, marginTop: ".8rem", fontStyle: "normal" }}>Anonymous interviewee · NID research session</footer>
            </Reveal>

            <Reveal style={{ position: "relative", width: "100%", height: "360px", borderRadius: "14px", overflow: "hidden", border: `1px solid ${LINEW}`, marginBottom: "3rem" }}>
              <Image src="/images/rippl/findings.png" alt="Research synthesis: what emerged from studying distracted reading patterns across NID students and peers" fill style={{ objectFit: "contain", background: BASE2, padding: "1rem" }} />
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: ".6rem 1rem", background: "rgba(13,9,4,.8)", borderTop: `1px solid ${LINEW}`, fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".14em", textTransform: "uppercase", color: FAINT }}>
                01 · Research findings synthesis
              </div>
            </Reveal>

            <Reveal className="mobile-stack" stagger style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderTop: `1px solid ${LINEW}`, borderLeft: `1px solid ${LINEW}` }}>
              {[
                { num: "01", h: "Impaired focus", b: "Technological interruptions reduce comprehension and make it harder to remain inside the material. The cost isn't just time. It's the depth of understanding that forms while uninterrupted." },
                { num: "02", h: "Limited recall", b: "Passive reading makes essential information harder to retrieve when it matters. Without an active encoding mechanism, information enters short-term memory and exits before it's used." },
                { num: "03", h: "Low engagement", b: "Traditional reading offers few moments for active, two-way participation. The book gives; the reader takes. There is no feedback loop that signals whether understanding has formed." },
              ].map(({ num, h, b }) => (
                <div key={num} style={{ height: "100%", padding: "2.2rem 1.8rem", borderRight: `1px solid ${LINEW}`, borderBottom: `1px solid ${LINEW}` }}>
                  <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "2rem", color: ACC, display: "block", lineHeight: 1, marginBottom: ".8rem" }}>{num}</span>
                  <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: ".9375rem", color: PAPER, letterSpacing: "-.01em", marginBottom: ".6rem" }}>{h}</h3>
                  <p style={{ fontSize: ".8125rem", color: DIM, lineHeight: 1.7 }}>{b}</p>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            06 · READING JOURNEY — SVG DIAGRAM
        ═══════════════════════════════════════════ */}
        <section style={{ padding: "5rem var(--pad)", background: BASE2, borderTop: `1px solid ${LINEW}` }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <Reveal as="span" style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".26em", textTransform: "uppercase", color: ACC, opacity: 0.8, display: "block", marginBottom: "1rem" }}>The transformation</Reveal>
            <Reveal as="h2" delay={0.1} style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)", lineHeight: 1.1, color: PAPER, marginBottom: "2.5rem", maxWidth: "28ch" }}>
              What changes when notes ripple back.
            </Reveal>
            <Reveal style={{ padding: "2rem", background: BASE, borderRadius: "14px", border: `1px solid ${LINEW}` }}>
              <ReadingJourneySVG />
            </Reveal>
            <Reveal as="p" delay={0.1} style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".14em", textTransform: "uppercase", color: FAINT, marginTop: "1rem" }}>
              The intervention happens at the moment of marking, the gesture that already exists in every reader's practice.
            </Reveal>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            07 · DESIGN QUESTION
        ═══════════════════════════════════════════ */}
        <section style={{ padding: "7rem var(--pad)", borderTop: `1px solid ${LINEW}`, textAlign: "center" }}>
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <Reveal as="span" style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".26em", textTransform: "uppercase", color: ACC, opacity: 0.8, display: "block", marginBottom: "1.5rem" }}>The design question</Reveal>
            <Reveal as="h2" delay={0.1} style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(1.5rem, 3.5vw, 2.6rem)", lineHeight: 1.25, letterSpacing: "-.01em", color: PAPER, marginBottom: "3rem" }}>
              How might we create an engaging learning experience that combats distraction, improves retention, and deepens understanding?
            </Reveal>
            <Reveal stagger delay={0.15} style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              {["Focus better","Retrieve effortlessly","Interact naturally"].map(o => (
                <span key={o} style={{ fontFamily: "var(--font-mono)", fontSize: ".62rem", letterSpacing: ".18em", textTransform: "uppercase", color: ACC, border: `1px solid ${LINE}`, borderRadius: "100px", padding: ".55rem 1.4rem" }}>{o}</span>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            08 · RECOGNITION PIPELINE
        ═══════════════════════════════════════════ */}
        <section style={{ padding: "6rem var(--pad)", background: BASE2, borderTop: `1px solid ${LINEW}` }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <Reveal as="span" style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".2em", textTransform: "uppercase", color: FAINT, display: "block", marginBottom: "3rem" }}>04 / How it works</Reveal>
            <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start", marginBottom: "3rem" }}>
              <Reveal stagger>
                <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(1.8rem, 3.5vw, 3rem)", lineHeight: 1.1, color: PAPER, marginBottom: "1.4rem" }}>
                  The recognition<br /><em style={{ fontStyle: "italic", color: ACCB }}>pipeline.</em>
                </h2>
                <p style={{ fontSize: ".9375rem", color: DIM, lineHeight: 1.78, maxWidth: "44ch", marginBottom: "1rem" }}>
                  When a user marks a term, Rippl's camera captures a frame of the page. A Python OCR model extracts the highlighted text, queries a knowledge base, and returns structured information, all within the time it takes to lift the pen.
                </p>
                <p style={{ fontSize: ".9375rem", color: DIM, lineHeight: 1.78, maxWidth: "44ch" }}>
                  The handwriting recognition model was trained separately to handle margin annotations and personal notes, treating the reader's own writing as input, not just the printed text.
                </p>
              </Reveal>
              <Reveal stagger>
                <div style={{ padding: "2rem 1.5rem", background: BASE, borderRadius: "14px", border: `1px solid ${LINEW}` }}>
                  <PipelineSVG />
                </div>
                <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: ".8rem", marginTop: "1rem" }}>
                  {[
                    ["OCR Engine","Python + Tesseract"],
                    ["Handwriting","Custom trained model"],
                    ["Frame rate","30fps capture"],
                    ["Latency","Sub-2s response"],
                  ].map(([k, v]) => (
                    <div key={k} style={{ padding: ".8rem 1rem", background: BASE, border: `1px solid ${LINEW}`, borderRadius: "8px" }}>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: ".5rem", letterSpacing: ".16em", textTransform: "uppercase", color: FAINT, display: "block", marginBottom: ".2rem" }}>{k}</span>
                      <span style={{ fontSize: ".8125rem", color: DIM }}>{v}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            09 · THE INTERACTION
        ═══════════════════════════════════════════ */}
        <section style={{ padding: "6rem var(--pad)", borderTop: `1px solid ${LINEW}` }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <Reveal as="span" style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".2em", textTransform: "uppercase", color: FAINT, display: "block", marginBottom: "3rem" }}>05 / Experience</Reveal>
            <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "4rem", alignItems: "start" }}>
              <Reveal stagger>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".26em", textTransform: "uppercase", color: ACC, opacity: 0.85, display: "block", marginBottom: "1rem" }}>A natural gesture</span>
                <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(2.2rem, 4.5vw, 4rem)", lineHeight: 0.96, letterSpacing: "-.015em", color: PAPER, marginBottom: "1.4rem" }}>
                  Mark it.<br /><em style={{ fontStyle: "italic", color: ACCB }}>Meet more.</em>
                </h2>
                <p style={{ fontSize: ".9375rem", color: DIM, lineHeight: 1.78, maxWidth: "38ch" }}>
                  Highlight a term as you already would. Rippl recognises the mark, projects relevant information, and lets you keep what matters beside the original page, without switching context.
                </p>
              </Reveal>
              <Reveal stagger style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {[
                  { num: "01", label: "Mark a passage", src: "/images/rippl/interaction-mark.png", alt: "Reader highlighting a term in a book" },
                  { num: "02", label: "Explore the projection", src: "/images/rippl/interaction-project.png", alt: "Rippl projecting learning assistance beside the open book" },
                ].map(({ num, label, src, alt }) => (
                  <div key={num} style={{ borderRadius: "14px", overflow: "hidden", border: `1px solid ${LINEW}` }}>
                    <div style={{ position: "relative", height: "300px", background: "#fff" }}>
                      <Image src={src} alt={alt} fill style={{ objectFit: "contain", padding: "1.4rem" }} />
                    </div>
                    <div style={{ padding: ".7rem 1rem", background: BASE2, borderTop: `1px solid ${LINEW}`, display: "flex", gap: ".8rem", alignItems: "center" }}>
                      <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "1.2rem", color: ACC, lineHeight: 1 }}>{num}</span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".14em", textTransform: "uppercase", color: FAINT }}>{label}</span>
                    </div>
                  </div>
                ))}
              </Reveal>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            10 · INTERFACE + MODES
        ═══════════════════════════════════════════ */}
        <section style={{ padding: "6rem var(--pad)", background: BASE2, borderTop: `1px solid ${LINEW}` }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <Reveal as="span" style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".2em", textTransform: "uppercase", color: FAINT, display: "block", marginBottom: "3rem" }}>06 / Interface</Reveal>
            <Reveal as="span" delay={0.1} style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".26em", textTransform: "uppercase", color: ACC, opacity: 0.85, display: "block", marginBottom: ".8rem" }}>The projected layer</Reveal>
            <Reveal as="h2" delay={0.2} style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(1.8rem, 4vw, 3.2rem)", lineHeight: 1.1, color: PAPER, marginBottom: "2.5rem" }}>
              Information,{" "}<em style={{ fontStyle: "italic", color: ACCB }}>where attention is.</em>
            </Reveal>
            <Reveal style={{ padding: "1.8rem 2rem", border: `1px solid ${LINEW}`, borderRadius: "14px", background: BASE2, overflowX: "auto", marginBottom: "3.5rem" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".16em", textTransform: "uppercase", color: ACCB, marginBottom: "1.4rem", display: "block" }}>
                Recognise · retrieve · retain
              </span>
              <FlowFork
                trunk={{ label: "Reads a book,\nin doubt" }}
                branches={[
                  [
                    { label: "Highlights\nvirtually", kind: "option" },
                    { label: "Rippl looks online\nfor context", kind: "option" },
                    { label: "Results appear\nvia projection", kind: "option" },
                    { label: "Finds useful\ncontent" },
                  ],
                  [
                    { label: "Looks for\nkey points", kind: "option" },
                    { label: "Finds useful\ncontent" },
                  ],
                ]}
              />
            </Reveal>

            {/* One object, two modes */}
            <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "center", paddingTop: "3rem", borderTop: `1px solid ${LINEW}` }}>
              <Reveal stagger>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".26em", textTransform: "uppercase", color: ACC, opacity: 0.85, display: "block", marginBottom: "1rem" }}>One object, two modes</span>
                <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(1.6rem, 3vw, 2.4rem)", lineHeight: 1.12, color: PAPER, marginBottom: "1rem" }}>
                  Study light.<br /><em style={{ fontStyle: "italic", color: ACCB }}>Portable projector.</em>
                </h3>
                <p style={{ fontSize: ".9375rem", color: DIM, lineHeight: 1.78, maxWidth: "40ch" }}>
                  The same device serves two modes: a reading lamp with projection intelligence, and a standalone portable projector you can carry to a classroom or lecture. No compromise on either. No settings to switch. The device reads the context.
                </p>
              </Reveal>
              <Reveal style={{ position: "relative", height: "360px", borderRadius: "14px", overflow: "hidden", border: `1px solid ${LINEW}` }}>
                <Image src="/images/rippl/projector-mode.png" alt="Rippl in standalone portable projector mode, tilted and freestanding" fill style={{ objectFit: "cover" }} />
              </Reveal>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            07 · INFORMATION ARCHITECTURE — recreated flows + real GIFs
        ═══════════════════════════════════════════ */}
        <section style={{ padding: "6rem var(--pad)", borderTop: `1px solid ${LINEW}` }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <Reveal as="span" style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".2em", textTransform: "uppercase", color: FAINT, display: "block", marginBottom: "3rem" }}>07 / Information architecture</Reveal>
            <Reveal as="h2" delay={0.1} style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(1.8rem, 3.5vw, 3rem)", lineHeight: 1.08, color: PAPER, marginBottom: ".8rem" }}>
              Every flow, mapped before it was built.
            </Reveal>
            <Reveal as="p" delay={0.2} style={{ fontSize: ".9375rem", color: DIM, lineHeight: 1.78, maxWidth: "52ch", marginBottom: "3.5rem" }}>
              Each interaction was diagrammed end to end before a single screen was wired up: every state, every branch, every fallback. The three flows below were carried through to working prototypes, captured here exactly as they run.
            </Reveal>

            {/* ── Marking & Annotating ── */}
            <div style={{ marginBottom: "3.5rem" }}>
              <Reveal className="mobile-stack" stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem", alignItems: "center", marginBottom: "1.6rem" }}>
                <div style={{ position: "relative", height: "280px", borderRadius: "12px", overflow: "hidden", border: `1px solid ${LINEW}` }}>
                  <InlineVideo src="/videos/rippl/flows/marking.mp4" poster="/videos/rippl/flows/marking-poster.webp" aria-label="Recorded interaction: marking a passage and choosing Annotate to generate an AI summary" style={{ width: "100%", height: "100%" }} />
                </div>
                <div>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".16em", textTransform: "uppercase", color: ACCB, marginBottom: ".6rem", display: "block" }}>01 · Marking &amp; annotating</span>
                  <p style={{ fontSize: ".88rem", color: DIM, lineHeight: 1.68 }}>
                    A mark on the page is the only gesture required. Everything past that, what kind of help to generate, in what form, is chosen after the fact, never before.
                  </p>
                </div>
              </Reveal>
              <Reveal style={{ padding: "1.6rem 1.8rem", border: `1px solid ${LINEW}`, borderRadius: "12px", background: BASE2, overflowX: "auto" }}>
                <FlowFork
                  trunk={{ label: "Marks\ncontent" }}
                  branches={[
                    [
                      { label: "Option\nappears" },
                      { label: "Annotate", kind: "option" },
                      { label: "AI / Image / Video", kind: "option" },
                      { label: "Generate image, brief,\nmemory card, or quiz", kind: "option" },
                      { label: "Saves\ncontent" },
                    ],
                  ]}
                />
              </Reveal>
            </div>

            {/* ── Sorting & Categorizing ── */}
            <div style={{ marginBottom: "3.5rem" }}>
              <Reveal className="mobile-stack" stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem", alignItems: "center", marginBottom: "1.6rem" }}>
                <div>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".16em", textTransform: "uppercase", color: ACCB, marginBottom: ".6rem", display: "block" }}>02 · Sorting &amp; categorizing</span>
                  <p style={{ fontSize: ".88rem", color: DIM, lineHeight: 1.68 }}>
                    The same mark gesture branches into categorization instead of annotation. One input, two destinations, chosen at the point of need rather than decided in advance.
                  </p>
                </div>
                <div style={{ position: "relative", height: "280px", borderRadius: "12px", overflow: "hidden", border: `1px solid ${LINEW}` }}>
                  <InlineVideo src="/videos/rippl/flows/sorting.mp4" poster="/videos/rippl/flows/sorting-poster.webp" aria-label="Recorded interaction: marking a passage and choosing Categorize to file it under an existing category" style={{ width: "100%", height: "100%" }} />
                </div>
              </Reveal>
              <Reveal style={{ padding: "1.6rem 1.8rem", border: `1px solid ${LINEW}`, borderRadius: "12px", background: BASE2, overflowX: "auto" }}>
                <FlowFork
                  trunk={{ label: "Marks\ncontent" }}
                  branches={[
                    [
                      { label: "Option\nappears" },
                      { label: "Categorize", kind: "option" },
                      { label: "Categories\nappear" },
                      { label: "Selects\ncategory" },
                    ],
                  ]}
                />
              </Reveal>
            </div>

            {/* ── Navigating history ── */}
            <div>
              <Reveal className="mobile-stack" stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem", alignItems: "center", marginBottom: "1.6rem" }}>
                <div style={{ position: "relative", height: "280px", borderRadius: "12px", overflow: "hidden", border: `1px solid ${LINEW}` }}>
                  <InlineVideo src="/videos/rippl/flows/history.mp4" poster="/videos/rippl/flows/history-poster.webp" aria-label="Recorded interaction: opening history and navigating previously marked, saved, and flash-carded content" style={{ width: "100%", height: "100%" }} />
                </div>
                <div>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".16em", textTransform: "uppercase", color: ACCB, marginBottom: ".6rem", display: "block" }}>03 · Navigating history</span>
                  <p style={{ fontSize: ".88rem", color: DIM, lineHeight: 1.68 }}>
                    Three ways back into past work, previously marked passages, saved content, or flash cards, all converging on the same view, edit, or find actions. The reader never has to remember which bucket something landed in.
                  </p>
                </div>
              </Reveal>
              <Reveal style={{ padding: "1.6rem 1.8rem", border: `1px solid ${LINEW}`, borderRadius: "12px", background: BASE2, overflowX: "auto" }}>
                <FlowFork
                  trunk={{ label: "Clicks\nhistory" }}
                  branches={[
                    [{ label: "Previously marked", kind: "option" }, { label: "View, edit, or find", kind: "option" }],
                    [{ label: "Saved content", kind: "option" }, { label: "View, edit, or find", kind: "option" }],
                    [{ label: "Flash card", kind: "option" }, { label: "View, edit, or find", kind: "option" }],
                  ]}
                />
              </Reveal>
            </div>

            {/* ── Also mapped: startup, search, settings (no GIF, diagram only) ── */}
            <div style={{ marginTop: "3.5rem", paddingTop: "2.5rem", borderTop: `1px solid ${LINEW}` }}>
              <Reveal as="span" style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".16em", textTransform: "uppercase", color: FAINT, marginBottom: "1.6rem", display: "block" }}>
                Also mapped, before being built
              </Reveal>
              <Reveal stagger style={{ display: "flex", flexDirection: "column", gap: "1.4rem" }}>
                <div style={{ padding: "1.3rem 1.5rem", border: `1px solid ${LINEW}`, borderRadius: "10px", overflowX: "auto" }}>
                  <div style={{ fontSize: ".7rem", color: FAINT, marginBottom: ".9rem", fontFamily: "var(--font-mono)", letterSpacing: ".06em" }}>STARTUP</div>
                  <FlowFork
                    trunk={{ label: "Logo →\n'X' mark" }}
                    branches={[[{ label: "Places book\non mark" }, { label: "Camera\nscans" }, { label: "Pen control deck\nappears", kind: "option" }]]}
                  />
                </div>
                <div style={{ padding: "1.3rem 1.5rem", border: `1px solid ${LINEW}`, borderRadius: "10px", overflowX: "auto" }}>
                  <div style={{ fontSize: ".7rem", color: FAINT, marginBottom: ".9rem", fontFamily: "var(--font-mono)", letterSpacing: ".06em" }}>SEARCH</div>
                  <FlowFork
                    trunk={{ label: "Enter search\nquery" }}
                    branches={[
                      [{ label: "Single syllable", kind: "option" }, { label: "Word detect", kind: "option" }],
                      [{ label: "Context search", kind: "option" }, { label: "Content highlights", kind: "option" }],
                    ]}
                  />
                </div>
                <div style={{ padding: "1.3rem 1.5rem", border: `1px solid ${LINEW}`, borderRadius: "10px", overflowX: "auto" }}>
                  <div style={{ fontSize: ".7rem", color: FAINT, marginBottom: ".9rem", fontFamily: "var(--font-mono)", letterSpacing: ".06em" }}>SETTINGS</div>
                  <FlowFork
                    trunk={{ label: "Settings" }}
                    branches={[
                      [{ label: "Connectivity", kind: "option" }, { label: "Bluetooth, Wi-Fi,\nexternal device", kind: "option" }],
                      [{ label: "Preferences", kind: "option" }, { label: "Keyword entry,\nvisibility", kind: "option" }],
                      [{ label: "Configurations", kind: "option" }, { label: "Select AI model →\nSave parameters", kind: "option" }],
                    ]}
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            08 · PROTOTYPE DEMOS — video placeholders
        ═══════════════════════════════════════════ */}
        <section style={{ padding: "6rem var(--pad)", borderTop: `1px solid ${LINEW}` }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <Reveal as="span" style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".2em", textTransform: "uppercase", color: FAINT, display: "block", marginBottom: "3rem" }}>08 / Prototype demonstrations</Reveal>
            <Reveal as="h2" delay={0.1} style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(1.8rem, 3.5vw, 3rem)", lineHeight: 1.08, color: PAPER, marginBottom: ".8rem" }}>
              Four demonstrations.<br /><em style={{ fontStyle: "italic", color: ACC }}>Four stages of learning.</em>
            </Reveal>
            <Reveal as="p" delay={0.2} style={{ fontSize: ".9375rem", color: DIM, lineHeight: 1.78, maxWidth: "48ch", marginBottom: "2.5rem" }}>
              Each prototype was built to test a specific hypothesis. They were run publicly, not in a lab, to capture unscripted reactions from real readers.
            </Reveal>

            <Reveal className="mobile-stack" stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {[
                {
                  num: "01",
                  title: "Basics of Filmmaking · Video Assistance",
                  desc: "A physical book with a taped marker triggers a projected video walkthrough of the highlighted concept. Tests whether projected video assistance deepens comprehension versus text alone.",
                  tag: "Video assistance · OCR trigger",
                  src: "/videos/rippl/video-assistance.mp4",
                  poster: "/videos/rippl/video-assistance-poster.webp",
                  freezeAt: 6,
                },
                {
                  num: "02",
                  title: "Projector Camera Swivel",
                  desc: "Visualisation of the mechanical head: how the projector-camera unit rotates to follow the marked region across different page positions. The swivel eliminates the need to reposition the device.",
                  tag: "Hardware · Mechanism study",
                  src: "/videos/rippl/projector-camera.mp4",
                  poster: "/videos/rippl/projector-camera-poster.webp",
                  freezeAt: 0.1,
                },
                {
                  num: "03",
                  title: "Handwriting Recognition",
                  desc: "A Python handwriting model trained on margin annotations. The reader writes a note in their own hand; Rippl reads it, identifies related content, and surfaces connections to other pages.",
                  tag: "Python · Custom model · Handwriting",
                  src: "/videos/rippl/handwriting.mp4",
                  poster: "/videos/rippl/handwriting-poster.webp",
                  freezeAt: 18,
                },
                {
                  num: "04",
                  title: "Text Recognition · OCR Live",
                  desc: "Core OCR pipeline operating in real time: the camera reads the highlighted passage, passes it to the recognition engine, and projects contextual information beside the page within two seconds.",
                  tag: "OCR · Real-time · Live demo",
                  src: "/videos/rippl/text-recognition.mp4",
                  poster: "/videos/rippl/text-recognition-poster.webp",
                  freezeAt: 12,
                },
              ].map(({ num, title, desc, tag, src, poster, freezeAt }) => (
                <div key={num} style={{ height: "100%", border: `1px solid ${LINEW}`, borderRadius: "14px", overflow: "hidden" }}>
                  {/* Video */}
                  <div style={{ borderBottom: `1px solid ${LINEW}` }}>
                    <RipplVideoCard src={src} num={num} accent={ACC} freezeAt={freezeAt} poster={poster} />
                  </div>
                  <div style={{ padding: "1.4rem 1.4rem 1.6rem" }}>
                    <div style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: ".9rem", color: PAPER, marginBottom: ".5rem" }}>{title}</div>
                    <p style={{ fontSize: ".8125rem", color: DIM, lineHeight: 1.65, marginBottom: ".8rem" }}>{desc}</p>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: ".5rem", letterSpacing: ".14em", textTransform: "uppercase", color: ACC, opacity: 0.7 }}>{tag}</span>
                  </div>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            12 · DESIGN PROCESS
        ═══════════════════════════════════════════ */}
        <section style={{ padding: "6rem var(--pad)", background: BASE2, borderTop: `1px solid ${LINEW}` }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <Reveal as="span" style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".2em", textTransform: "uppercase", color: FAINT, display: "block", marginBottom: "3rem" }}>08 / Design process</Reveal>
            <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
              <Reveal stagger>
                <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(1.8rem, 3.5vw, 3rem)", lineHeight: 1.1, color: PAPER, marginBottom: "1.4rem" }}>
                  From daily objects to a{" "}<em style={{ fontStyle: "italic", color: ACC }}>new form factor.</em>
                </h2>
                <p style={{ fontSize: ".9375rem", color: DIM, lineHeight: 1.78, maxWidth: "42ch", marginBottom: "1.2rem" }}>
                  The form came from studying objects already trusted in the study space. A table lamp gives light and permission to concentrate. A projector throws content onto a surface. A camera captures and interprets. Three behaviours people already know, merged into one form that asks for no new mental model.
                </p>
                <p style={{ fontSize: ".9375rem", color: DIM, lineHeight: 1.78, maxWidth: "42ch" }}>
                  The interaction had to feel invisible. If the user had to think about the device, the device had failed. Every design decision was tested against this rule.
                </p>
                <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: ".8rem", marginTop: "1.8rem" }}>
                  {[["Table lamp","Familiar, warm, present"],["Projector","Content onto surface"],["Camera","Capture + interpret"]].map(([obj, desc]) => (
                    <div key={obj} style={{ padding: ".8rem", background: BASE, border: `1px solid ${LINEW}`, borderRadius: "8px" }}>
                      <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: ".9rem", color: ACCB, display: "block", marginBottom: ".3rem" }}>{obj}</span>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: ".5rem", letterSpacing: ".1em", color: FAINT }}>{desc}</span>
                    </div>
                  ))}
                </div>
              </Reveal>
              <Reveal style={{ position: "relative", height: "400px", borderRadius: "14px", overflow: "hidden", border: `1px solid ${LINEW}` }}>
                <Image src="/images/rippl/design-process.png" alt="Rippl design process, ideation sketches, form studies, and component selection" fill style={{ objectFit: "contain", background: BASE, padding: "1.5rem" }} />
              </Reveal>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            13 · PRINCIPLES + METRICS
        ═══════════════════════════════════════════ */}
        <section style={{ padding: "5rem var(--pad)", borderTop: `1px solid ${LINEW}` }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <Reveal as="span" style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".26em", textTransform: "uppercase", color: ACC, opacity: 0.8, display: "block", marginBottom: "2rem" }}>Built around the reader</Reveal>
            <Reveal className="mobile-stack" stagger style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", borderTop: `1px solid ${LINEW}`, borderLeft: `1px solid ${LINEW}`, marginBottom: "0" }}>
              {[
                { num: "01", h: "Clear projection", b: "Sharp, legible information exactly where it is useful: beside the text you just marked, not on a separate screen competing for attention." },
                { num: "02", h: "Automatic recognition", b: "Text capture that turns a familiar mark into a doorway. You highlight. Rippl does the rest. No buttons, no modes, no app to open." },
                { num: "03", h: "Quiet compatibility", b: "A layer that works with books and notes instead of competing with them. It enhances the reading ritual; it does not replace it." },
              ].map(({ num, h, b }) => (
                <div key={num} style={{ height: "100%", padding: "2.2rem 1.8rem", borderRight: `1px solid ${LINEW}`, borderBottom: `1px solid ${LINEW}` }}>
                  <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "2rem", color: ACC, display: "block", lineHeight: 1, marginBottom: ".8rem" }}>{num}</span>
                  <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "1rem", color: PAPER, letterSpacing: "-.01em", marginBottom: ".6rem" }}>{h}</h3>
                  <p style={{ fontSize: ".875rem", color: DIM, lineHeight: 1.7 }}>{b}</p>
                </div>
              ))}
            </Reveal>
            {/* Stats strip */}
            <Reveal className="mobile-stack" stagger style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", borderLeft: `1px solid ${LINEW}` }}>
              {[["12 weeks","Project duration"],["3","Working prototypes"]].map(([val, label]) => (
                <div key={label} style={{ height: "100%", padding: "1.8rem 1.6rem", borderRight: `1px solid ${LINEW}`, borderBottom: `1px solid ${LINEW}` }}>
                  <div style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "2.4rem", color: ACC, lineHeight: 1, fontVariantNumeric: "tabular-nums", marginBottom: ".4rem" }}>{val}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".16em", textTransform: "uppercase", color: FAINT }}>{label}</div>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            14 · REFLECTION
        ═══════════════════════════════════════════ */}
        <section style={{ padding: "8rem var(--pad)", background: BASE2, borderTop: `1px solid ${LINEW}`, textAlign: "center" }}>
          <Reveal stagger style={{ maxWidth: "680px", margin: "0 auto" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".22em", textTransform: "uppercase", color: ACC, display: "block", marginBottom: "1.5rem", opacity: 0.8 }}>Reflection</span>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(1.6rem, 3.8vw, 3rem)", lineHeight: 1.15, letterSpacing: "-.01em", color: PAPER, marginBottom: "2rem" }}>
              Learning becomes meaningful when it crosses the distance from{" "}
              <em style={{ fontStyle: "italic", color: ACCB }}>knowing</em>{" "}to{" "}
              <em style={{ fontStyle: "italic", color: ACCB }}>doing.</em>
            </h2>
            <p style={{ fontSize: ".9375rem", color: DIM, lineHeight: 1.78, maxWidth: "48ch", margin: "0 auto 2rem" }}>
              By combining hands-on experience with cognitive learning, we can remember important lessons and make better choices. Rippl explores that transition, not as another screen, but as a more attentive relationship with the objects already in front of us.
            </p>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: ".58rem", letterSpacing: ".18em", textTransform: "uppercase", color: FAINT }}>
              Aravind J · NID Gandhinagar · 2023
            </p>
          </Reveal>
        </section>

        {/* ═══════════════════════════════════════════
            15 · EPILOGUE — match-cut into Trmeric
        ═══════════════════════════════════════════ */}
        <NextProject current="rippl" />

      </main>
      <Footer />
    </>
  );
}
