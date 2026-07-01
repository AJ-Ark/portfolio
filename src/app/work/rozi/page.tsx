import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";
import type { CSSProperties } from "react";

export const metadata: Metadata = {
  title: "Rozi · No middlemen, just work",
  description:
    "A two-sided labour marketplace connecting India's informal workers directly to employers. Top 5 at SARVA Designathon 2021.",
};

/* -- Palette -- */
const GND   = "#0c0806";
const GND2  = "#160d08";
const PAP   = "#f0e8d5";
const DIM   = "rgba(240,232,213,.6)";
const FAINT = "rgba(240,232,213,.28)";
const ACC   = "#C94030";
const ACCB  = "#E85540";
const LINE  = "rgba(201,64,48,.22)";
const LINEW = "rgba(240,232,213,.1)";

const FLOWS = [
  { src: "/images/rozi/flow-01-language.gif",  label: "Language selection",     desc: "Hindi, regional, English" },
  { src: "/images/rozi/flow-05-employee.gif",  label: "Worker registration",    desc: "OTP-based, no literacy barrier" },
  { src: "/images/rozi/flow-02-jobs.gif",      label: "Browse jobs by PINCODE", desc: "Location-first job discovery" },
  { src: "/images/rozi/flow-03-contact.gif",   label: "Contact employer",       desc: "Direct, no intermediary" },
  { src: "/images/rozi/flow-07-confirm.gif",   label: "Confirm assignment",     desc: "Clear pay and hours upfront" },
];

const SCREENS = [
  "/images/rozi/screen-01.png",
  "/images/rozi/screen-02.png",
  "/images/rozi/screen-03.png",
  "/images/rozi/screen-04.png",
];

/* ─────────────────────────────────────────────────────
   LIFECYCLE ARC: five stages of a migrant worker's life
───────────────────────────────────────────────────────*/
function LifecycleMapSVG() {
  const MONO = '"JetBrains Mono", monospace';
  const nodes = [
    { x:  100, y: 215, num: "01", stage: "ENTRY",         a1: "Leaves village",            a2: "Takes first contractor work" },
    { x:  300, y: 150, num: "02", stage: "SECONDARY",      a1: "Sends remittances home",    a2: "Wage negotiated by contractor" },
    { x:  540, y:  85, num: "03", stage: "PEAK EARNING",   a1: "Primary wage earner",       a2: "Highest exploitation risk" },
    { x:  760, y: 155, num: "04", stage: "EXIT TRIGGER",   a1: "Illness or injury halts",   a2: "No contractor safety net" },
    { x:  980, y: 215, num: "05", stage: "RETURN",         a1: "Back to village",           a2: "Cycle continues for children" },
  ];
  const arcPath = "M 100,215 C 185,185 238,140 300,150 C 362,160 440,68 540,85 C 640,102 700,145 760,155 C 825,168 930,215 980,215";

  return (
    <svg viewBox="0 0 1100 340" style={{ width: "100%", display: "block" }}
      aria-label="Lifecycle of a migrant worker: five stages from village entry to return">
      <defs>
        <linearGradient id="lc-grad" x1="0" y1="0" x2="1100" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor={ACC} stopOpacity="0.3" />
          <stop offset="45%"  stopColor={ACC} stopOpacity="1"   />
          <stop offset="55%"  stopColor={ACC} stopOpacity="1"   />
          <stop offset="100%" stopColor={ACC} stopOpacity="0.3" />
        </linearGradient>
      </defs>
      {nodes.map(n => (
        <line key={n.num} x1={n.x} y1={20} x2={n.x} y2={300}
          stroke={FAINT} strokeWidth="0.5" strokeDasharray="2,10" />
      ))}
      <path d={arcPath} fill="none" stroke="url(#lc-grad)" strokeWidth="1.5" />
      {nodes.map(n => (
        <g key={n.num}>
          <text x={n.x} y={n.y - 42} textAnchor="middle" fill={ACC}
            style={{ fontFamily: MONO, fontSize: "8px", letterSpacing: "2px" }}>{n.num}</text>
          <text x={n.x} y={n.y - 27} textAnchor="middle" fill={PAP}
            style={{ fontFamily: MONO, fontSize: "9px", letterSpacing: "1.5px" }}>{n.stage}</text>
          <line x1={n.x} y1={n.y - 19} x2={n.x} y2={n.y - 11} stroke={FAINT} strokeWidth="0.5" />
          <circle cx={n.x} cy={n.y} r={8} fill={GND2} stroke={ACC} strokeWidth="1.5" />
          <circle cx={n.x} cy={n.y} r={3} fill={ACC} />
          <text x={n.x} y={n.y + 30} textAnchor="middle" fill={DIM}
            style={{ fontFamily: MONO, fontSize: "8.5px" }}>{n.a1}</text>
          <text x={n.x} y={n.y + 44} textAnchor="middle" fill={FAINT}
            style={{ fontFamily: MONO, fontSize: "8px" }}>{n.a2}</text>
        </g>
      ))}
    </svg>
  );
}

/* ─────────────────────────────────────────────────────
   OPPORTUNITY MAP: seven systemic gaps
───────────────────────────────────────────────────────*/
function OpportunityMapSVG() {
  const MONO  = '"JetBrains Mono", monospace';
  const SERIF = '"Fraunces", Georgia, serif';
  const cx = 540, cy = 280;
  const sectors: { sx:number; sy:number; lx:number; ly:number; anchor:"middle"|"start"|"end"; label:string; desc:string }[] = [
    { sx: 540, sy:  95, lx: 540, ly: 40,  anchor: "middle", label: "Healthcare",  desc: "Access to formal care" },
    { sx: 684, sy: 165, lx: 736, ly: 152, anchor: "start",  label: "Jobs",        desc: "Direct placement" },
    { sx: 720, sy: 320, lx: 774, ly: 320, anchor: "start",  label: "Banking",     desc: "Wage security" },
    { sx: 614, sy: 442, lx: 630, ly: 492, anchor: "middle", label: "Payments",    desc: "Assured pay" },
    { sx: 466, sy: 442, lx: 450, ly: 492, anchor: "middle", label: "Community",   desc: "Peer networks" },
    { sx: 360, sy: 320, lx: 306, ly: 320, anchor: "end",    label: "Voting",      desc: "Civic access" },
    { sx: 396, sy: 165, lx: 344, ly: 152, anchor: "end",    label: "Upskilling",  desc: "Skill laddering" },
  ];
  return (
    <svg viewBox="0 0 1080 560" style={{ width: "100%", display: "block" }}
      aria-label="Opportunity map: seven systemic gaps faced by migrant workers">
      <circle cx={cx} cy={cy} r="195" fill="none" stroke={FAINT} strokeWidth="0.5" strokeDasharray="3,10" />
      <circle cx={cx} cy={cy} r="98"  fill="none" stroke={FAINT} strokeWidth="0.5" strokeDasharray="2,8" strokeOpacity="0.6" />
      {sectors.map(s => (
        <g key={s.label}>
          <line x1={cx} y1={cy} x2={s.sx} y2={s.sy} stroke={ACC} strokeWidth="0.8" strokeOpacity="0.4" />
          <circle cx={s.sx} cy={s.sy} r={7} fill={GND2} stroke={ACC} strokeWidth="1.5" />
          <circle cx={s.sx} cy={s.sy} r={2.5} fill={ACC} />
          <text x={s.lx} y={s.ly} textAnchor={s.anchor} fill={PAP}
            style={{ fontFamily: MONO, fontSize: "11px", letterSpacing: "1px" }}>{s.label}</text>
          <text x={s.lx} y={s.ly + 16} textAnchor={s.anchor} fill={DIM}
            style={{ fontFamily: MONO, fontSize: "9px" }}>{s.desc}</text>
        </g>
      ))}
      <circle cx={cx} cy={cy} r={72} fill={GND2} stroke={ACC} strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r={62} fill="none" stroke={ACC} strokeWidth="0.5" strokeOpacity="0.3" />
      <text x={cx} y={cy - 8}  textAnchor="middle" fill={PAP}
        style={{ fontFamily: SERIF, fontSize: "15px", fontStyle: "italic" }}>Migrant</text>
      <text x={cx} y={cy + 13} textAnchor="middle" fill={PAP}
        style={{ fontFamily: SERIF, fontSize: "15px", fontStyle: "italic" }}>Workers</text>
      <text x={cx} y={cy + 34} textAnchor="middle" fill={ACC}
        style={{ fontFamily: MONO, fontSize: "7px", letterSpacing: "2px" }}>SYSTEM GAP</text>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────
   LABEL shared style helper
───────────────────────────────────────────────────────*/
const labelStyle: CSSProperties = {
  fontFamily: "var(--font-mono)", fontSize: ".6rem",
  letterSpacing: ".26em", textTransform: "uppercase",
  color: ACC, opacity: 0.85, display: "block",
};

export default function RoziPage() {
  return (
    <>
      <Navigation />
      <main id="main-content" style={{ background: GND, color: PAP }}>

        {/* ═══════════════════════════════════════
            01 · HERO
        ═══════════════════════════════════════ */}
        <section style={{
          minHeight: "100dvh", display: "flex", flexDirection: "column",
          justifyContent: "flex-end", position: "relative", overflow: "hidden",
          padding: "0 var(--pad) 4rem",
        }}>
          <div style={{ position: "absolute", inset: 0 }}>
            <Image
              src="/images/rozi/hero-phones.png"
              alt="Rozi app on two Android phones showing the job listing and worker onboarding screens"
              fill
              style={{ objectFit: "cover", objectPosition: "center 35%" }}
              priority
            />
          </div>
          <div aria-hidden="true" style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(to top, ${GND} 0%, rgba(12,8,6,.88) 35%, rgba(12,8,6,.5) 65%, transparent 100%)`,
          }} />
          <div aria-hidden="true" style={{
            position: "absolute", top: "10vh", left: "var(--pad)", zIndex: 2,
            fontFamily: "var(--font-display)", fontWeight: 400,
            fontSize: "clamp(6rem, 22vw, 20rem)", lineHeight: 0.85,
            letterSpacing: "-.06em", color: PAP, opacity: 0.06,
            userSelect: "none", pointerEvents: "none",
          }}>Rozi</div>

          <div style={{ position: "relative", zIndex: 3 }}>
            <div style={{ ...labelStyle, marginBottom: "1.4rem" }}>
              UX Research · Service Design · SARVA Designathon 2021
            </div>
            <h1 style={{
              fontFamily: "var(--font-display)", fontWeight: 400,
              fontSize: "clamp(2.8rem, 7vw, 6rem)", lineHeight: 1.0,
              letterSpacing: "-.02em", color: PAP, marginBottom: "1.4rem",
            }}>
              No middlemen.<br />
              <em style={{ fontStyle: "italic", color: ACCB }}>Just work.</em>
            </h1>
            <p style={{ fontSize: "clamp(.9rem, 1.5vw, 1.1rem)", color: DIM, maxWidth: "48ch", lineHeight: 1.7, marginBottom: "2.5rem" }}>
              A marketplace connecting India's 40 crore informal workers to employers directly. Register, find work, get paid. The contractor takes nothing.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "2.5rem", paddingTop: "1.8rem", borderTop: `1px solid ${LINEW}` }}>
              {[
                ["Outcome",  "Top 5 nationally"],
                ["Sprint",   "24 hours"],
                ["Platform", "Two-sided marketplace"],
                ["Role",     "UX Research + Service Design"],
              ].map(([l, v]) => (
                <div key={l}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: ".5rem", letterSpacing: ".2em", textTransform: "uppercase", color: FAINT, display: "block", marginBottom: ".3rem" }}>{l}</span>
                  <span style={{ fontSize: ".8rem", color: DIM }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            02 · PROBLEM
        ═══════════════════════════════════════ */}
        <section style={{ borderTop: `1px solid ${LINEW}` }}>
          {/* Scale stat */}
          <div style={{ background: GND2, padding: "6rem var(--pad) 5rem", borderBottom: `1px solid ${LINEW}` }}>
            <div style={{ display: "flex", gap: "0", alignItems: "stretch", maxWidth: "1100px" }}>
              {[
                { value: "40 cr",  label: "Informal workers in India" },
                { value: "93%",    label: "Of the workforce is informal" },
                { value: "₹0",     label: "Legal recourse when wages are skimmed" },
              ].map(({ value, label }, i) => (
                <div key={label} style={{
                  flex: 1, padding: "2rem 3rem",
                  borderLeft: i === 0 ? "none" : `1px solid ${LINEW}`,
                }}>
                  <div style={{
                    fontFamily: "var(--font-display)", fontWeight: 300,
                    fontSize: "clamp(2.6rem, 5.5vw, 4.5rem)", lineHeight: 1,
                    letterSpacing: "-.03em", color: ACC, marginBottom: ".6rem",
                  }}>{value}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".18em", textTransform: "uppercase", color: DIM }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Problem body */}
          <div style={{ padding: "8rem var(--pad)", background: GND }}>
            <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center", maxWidth: "1100px" }}>
              <div>
                <span style={{ ...labelStyle, marginBottom: "2.5rem" }}>The problem</span>
                <p style={{
                  fontFamily: "var(--font-display)", fontWeight: 400,
                  fontSize: "clamp(1.6rem, 3.5vw, 3rem)", lineHeight: 1.1,
                  letterSpacing: "-.02em", color: PAP, marginBottom: "2rem",
                }}>
                  A contractor in between means wages skimmed, hours hidden, and no recourse when either side breaks trust.
                </p>
                <p style={{ fontSize: "1rem", color: DIM, lineHeight: 1.7, marginBottom: "1.2rem" }}>
                  Field visits and life-mapping sessions at railway stations and bus stands revealed the same pattern: the contractor system extracts from both worker and employer while offering neither side a verifiable record of the transaction.
                </p>
                <p style={{ fontSize: "1rem", color: DIM, lineHeight: 1.7 }}>
                  Workers earn what the contractor decides to pass on. Employers pay what the contractor decides to charge. No paperwork. No accountability. No alternative.
                </p>
              </div>
              <div>
                <div style={{ position: "relative", borderRadius: "2px", overflow: "hidden", aspectRatio: "4/3", border: `1px solid ${LINE}`, marginBottom: "1.5rem" }}>
                  <Image src="/images/rozi/field-visit.png" alt="Field visit documentation: meeting with migrant workers at transport hubs" fill style={{ objectFit: "cover" }} />
                </div>
                <div style={{ borderLeft: `2px solid ${ACC}`, paddingLeft: "1.5rem" }}>
                  <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "clamp(1rem, 2vw, 1.3rem)", color: PAP, lineHeight: 1.4, marginBottom: ".8rem" }}>
                    "The contractor tells me one wage, tells the malik something else. By the time I find out, I've already worked the month."
                  </p>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: ".48rem", letterSpacing: ".16em", textTransform: "uppercase", color: FAINT }}>Field interview · Bus stand, Chennai</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            03 · PLATFORM OVERVIEW
        ═══════════════════════════════════════ */}
        <section style={{ background: GND2, borderTop: `1px solid ${LINEW}` }}>
          <div style={{ padding: "8rem var(--pad) 0" }}>
            <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", maxWidth: "1100px", marginBottom: "4rem" }}>
              <div>
                <span style={{ ...labelStyle, marginBottom: "1.5rem" }}>The platform</span>
                <p style={{
                  fontFamily: "var(--font-display)", fontWeight: 400,
                  fontSize: "clamp(1.8rem, 4vw, 3.2rem)", lineHeight: 1.05,
                  letterSpacing: "-.02em", color: PAP, marginBottom: "2rem",
                }}>
                  One app.<br />Two sides.<br />No contractor.
                </p>
              </div>
              <div>
                <p style={{ fontSize: "1rem", color: DIM, lineHeight: 1.7, marginBottom: "1.4rem" }}>
                  Workers browse by PINCODE, apply in two taps, and get a digital record of the agreed wage. Employers post with KYC verification and review profiles without a middleman setting the price.
                </p>
                <p style={{ fontSize: "1rem", color: DIM, lineHeight: 1.7 }}>
                  Both sides can withdraw, report, and rate. Every transaction leaves a record. The platform earns by being useful, not by controlling information.
                </p>
              </div>
            </div>
          </div>
          <div style={{ overflow: "hidden", maxHeight: "520px" }}>
            <Image
              src="/images/rozi/solution.png"
              alt="Rozi platform architecture: employee side and employer side"
              width={1400}
              height={700}
              style={{ width: "100%", height: "auto", display: "block" }}
            />
          </div>
        </section>

        {/* ═══════════════════════════════════════
            04 · KEY FLOWS
        ═══════════════════════════════════════ */}
        <section style={{ padding: "8rem var(--pad)", borderTop: `1px solid ${LINEW}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "2rem", marginBottom: "4rem", maxWidth: "1200px" }}>
            <div>
              <span style={{ ...labelStyle, marginBottom: "1rem" }}>The product in motion</span>
              <p style={{
                fontFamily: "var(--font-display)", fontWeight: 400,
                fontSize: "clamp(1.4rem, 3vw, 2.6rem)", lineHeight: 1.1,
                letterSpacing: "-.02em", color: PAP,
              }}>
                Five key journeys, recorded from the prototype.
              </p>
            </div>
            <p style={{ fontSize: ".875rem", color: DIM, lineHeight: 1.7, maxWidth: "32ch" }}>
              Each flow was designed to work on low-end Android phones, on 2G networks, and for users with limited literacy or English.
            </p>
          </div>
          <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1.5rem" }}>
            {FLOWS.map(({ src, label, desc }) => (
              <div key={src} style={{ display: "flex", flexDirection: "column", gap: ".8rem" }}>
                <div style={{ borderRadius: "6px", overflow: "hidden", background: GND2, border: `1px solid ${LINE}` }}>
                  <Image src={src} alt={label} width={280} height={560} style={{ width: "100%", height: "auto", display: "block" }} unoptimized />
                </div>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".18em", textTransform: "uppercase", color: ACC, display: "block" }}>{label}</span>
                <span style={{ fontSize: ".75rem", color: DIM }}>{desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════
            05 · RESEARCH PROCESS
        ═══════════════════════════════════════ */}
        <section style={{ borderTop: `1px solid ${LINEW}` }}>

          {/* Section header */}
          <div style={{ background: GND2, padding: "8rem var(--pad) 6rem" }}>
            <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", maxWidth: "1200px" }}>
              <div>
                <span style={{ ...labelStyle, marginBottom: "2rem" }}>Research grounding · 24-hour sprint</span>
                <h2 style={{
                  fontFamily: "var(--font-display)", fontWeight: 400,
                  fontSize: "clamp(2rem, 4.5vw, 3.8rem)", lineHeight: 1.0,
                  letterSpacing: "-.025em", color: PAP,
                }}>
                  We started in<br />the field, not<br />in the brief.
                </h2>
              </div>
              <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: "1.4rem" }}>
                <p style={{ fontSize: "1rem", color: DIM, lineHeight: 1.7 }}>
                  Within the first two hours of the 24-hour sprint, the team was at railway stations and bus stands — talking to workers, not about them. Three discrete phases followed: empathize, define, ideate. Each phase had a concrete output that fed the next.
                </p>
                <p style={{ fontSize: "1rem", color: DIM, lineHeight: 1.7 }}>
                  Everything in the product can be traced back to something someone said in a field interview or a specific gap the lifecycle map revealed.
                </p>
              </div>
            </div>
          </div>

          {/* Research stats */}
          <div style={{ background: GND, borderTop: `1px solid ${LINEW}`, borderBottom: `1px solid ${LINEW}` }}>
            <div style={{ padding: "3.5rem var(--pad)", display: "flex", flexWrap: "wrap", maxWidth: "1200px" }}>
              {[
                { value: "4+",  label: "Field locations" },
                { value: "12+", label: "Worker interviews" },
                { value: "3",   label: "Design phases in 24h" },
                { value: "7",   label: "Systemic gaps mapped" },
              ].map(({ value, label }, i) => (
                <div key={label} style={{
                  flex: "1 1 180px", padding: "0 3rem",
                  borderLeft: i === 0 ? "none" : `1px solid ${LINEW}`,
                }}>
                  <div style={{
                    fontFamily: "var(--font-display)", fontWeight: 300,
                    fontSize: "clamp(2.2rem, 4vw, 3.5rem)", lineHeight: 1,
                    letterSpacing: "-.03em", color: ACC, marginBottom: ".5rem",
                  }}>{value}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: ".5rem", letterSpacing: ".18em", textTransform: "uppercase", color: DIM }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── EMPATHIZE ── */}
          <div style={{ background: GND, padding: "8rem var(--pad)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "4rem" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".26em", textTransform: "uppercase", color: ACC, opacity: 0.7 }}>01 · Empathize</span>
              <div style={{ flex: 1, height: "1px", background: LINE, maxWidth: "12rem" }} />
            </div>

            <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start", maxWidth: "1200px", marginBottom: "4rem" }}>
              <div>
                <h3 style={{
                  fontFamily: "var(--font-display)", fontWeight: 400,
                  fontSize: "clamp(1.6rem, 3vw, 2.6rem)", lineHeight: 1.1,
                  letterSpacing: "-.02em", color: PAP, marginBottom: "1.6rem",
                }}>
                  Railway stations, bus stands, and construction sites.
                </h3>
                <p style={{ fontSize: "1rem", color: DIM, lineHeight: 1.7, marginBottom: "1.2rem" }}>
                  Life-mapping sessions with workers who navigate the contractor system daily — people entering it for the first time, people who had been in the cycle for decades, and people actively trying to exit it.
                </p>
                <p style={{ fontSize: "1rem", color: DIM, lineHeight: 1.7 }}>
                  The pattern was consistent across every conversation: workers don't know their wage until payday. Contractors negotiate on both sides, extracting a margin from each without either party's knowledge. There is no shared ground truth.
                </p>
              </div>
              <div style={{ position: "relative", borderRadius: "2px", overflow: "hidden", aspectRatio: "4/3", border: `1px solid ${LINE}` }}>
                <Image src="/images/rozi/field-visit.png" alt="Field visit documentation: meeting with migrant workers at transport hubs" fill style={{ objectFit: "cover" }} />
              </div>
            </div>

            {/* Pull quote */}
            <div style={{ borderLeft: `2px solid ${ACC}`, paddingLeft: "2rem", margin: "0 0 4rem" }}>
              <p style={{
                fontFamily: "var(--font-display)", fontStyle: "italic",
                fontSize: "clamp(1.2rem, 2.5vw, 1.9rem)", color: PAP, lineHeight: 1.3,
                marginBottom: ".8rem",
              }}>
                "The contractor tells me one wage, tells the malik something else. By the time I find out, I've already worked the month."
              </p>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: ".48rem", letterSpacing: ".16em", textTransform: "uppercase", color: FAINT }}>Field interview · Bus stand, Chennai</span>
            </div>

            {/* Insight cards */}
            <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", maxWidth: "1200px" }}>
              {[
                { label: "Information asymmetry",    text: "The contractor controls all communication between worker and employer. Neither side has ground truth on what the other was told." },
                { label: "No paper trail",            text: "Wage agreements are verbal. Deductions are arbitrary. There is no record that either party can appeal to or escalate." },
                { label: "Trust by proximity",        text: "Workers trust contractors because they are the only known contact in a new city. Platform trust must be built on something different." },
              ].map(({ label, text }) => (
                <div key={label} style={{ padding: "2rem", background: GND2, border: `1px solid ${LINE}` }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: ".5rem", letterSpacing: ".18em", textTransform: "uppercase", color: ACC, display: "block", marginBottom: ".8rem" }}>{label}</span>
                  <p style={{ fontSize: ".875rem", color: DIM, lineHeight: 1.65 }}>{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── DEFINE ── */}
          <div style={{ background: GND2, borderTop: `1px solid ${LINEW}`, padding: "8rem var(--pad)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "4rem" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".26em", textTransform: "uppercase", color: ACC, opacity: 0.7 }}>02 · Define</span>
              <div style={{ flex: 1, height: "1px", background: LINE, maxWidth: "12rem" }} />
            </div>

            <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start", maxWidth: "1200px", marginBottom: "4rem" }}>
              <div>
                <h3 style={{
                  fontFamily: "var(--font-display)", fontWeight: 400,
                  fontSize: "clamp(1.6rem, 3vw, 2.6rem)", lineHeight: 1.1,
                  letterSpacing: "-.02em", color: PAP, marginBottom: "1.6rem",
                }}>
                  Five stages from village entry to return.
                </h3>
                <p style={{ fontSize: "1rem", color: DIM, lineHeight: 1.7, marginBottom: "1.2rem" }}>
                  We mapped the full arc of a migrant worker's economic life to find exactly where the contractor system extracts value — and where a direct platform could create it instead.
                </p>
                <p style={{ fontSize: "1rem", color: DIM, lineHeight: 1.7 }}>
                  Stage 03 (Peak Earning) carries the highest exploitation risk: maximum wages, minimum protections, least visibility into contractor behaviour. Stage 04 (Exit Trigger) is where the absence of any safety net is most costly — illness or injury with no recourse.
                </p>
              </div>
              <div>
                <p style={{ fontSize: "1rem", color: DIM, lineHeight: 1.7, marginBottom: "1.2rem" }}>
                  The lifecycle doesn't end at "found work." It continues through the return home, through the cultural reintegration, and — most damagingly — through the children who inherit the contractor relationship as their own default entry point.
                </p>
                <div style={{ padding: "1.5rem", background: GND, border: `1px solid ${LINE}`, borderLeft: `2px solid ${ACC}` }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: ".5rem", letterSpacing: ".18em", textTransform: "uppercase", color: ACC, display: "block", marginBottom: ".5rem" }}>Design principle</span>
                  <p style={{ fontSize: ".875rem", color: DIM, lineHeight: 1.6 }}>
                    Intervene at Stage 01 (Entry) before the contractor relationship forms. And at Stage 04 (Exit Trigger) where there is currently no safety net at all.
                  </p>
                </div>
              </div>
            </div>

            <div style={{ background: GND, border: `1px solid ${LINE}`, borderRadius: "2px", padding: "3.5rem 2.5rem" }}>
              <LifecycleMapSVG />
            </div>
          </div>

          {/* ── IDEATE ── */}
          <div style={{ background: GND, borderTop: `1px solid ${LINEW}`, padding: "8rem var(--pad)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", marginBottom: "4rem" }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".26em", textTransform: "uppercase", color: ACC, opacity: 0.7 }}>03 · Ideate</span>
              <div style={{ flex: 1, height: "1px", background: LINE, maxWidth: "12rem" }} />
            </div>

            <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start", maxWidth: "1200px", marginBottom: "4rem" }}>
              <div>
                <h3 style={{
                  fontFamily: "var(--font-display)", fontWeight: 400,
                  fontSize: "clamp(1.6rem, 3vw, 2.6rem)", lineHeight: 1.1,
                  letterSpacing: "-.02em", color: PAP, marginBottom: "1.6rem",
                }}>
                  Seven systemic gaps. One rule: don't replicate the contractor logic.
                </h3>
                <p style={{ fontSize: "1rem", color: DIM, lineHeight: 1.7 }}>
                  The opportunity map asked: if the contractor system extracts value at every node a worker touches, what direct infrastructure could create value at those same nodes? We constrained every idea with a single rule — the platform cannot become a new intermediary controlling a different part of the same chain.
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                {[
                  ["Healthcare",  "Access to formal care without contractor as gatekeeper"],
                  ["Jobs",        "Direct placement with verified employers"],
                  ["Banking",     "Wage security and digital payment records"],
                  ["Payments",    "Assured pay on agreed schedule, not contractor schedule"],
                  ["Community",   "Peer networks and mutual aid outside the contractor chain"],
                  ["Voting",      "Civic access at worksite, not just home district"],
                  ["Upskilling",  "Skill laddering to higher-wage formal work"],
                ].map(([label, desc], i) => (
                  <div key={label} style={{
                    display: "flex", gap: "1.5rem", alignItems: "baseline",
                    padding: "1rem 0",
                    borderTop: i === 0 ? `1px solid ${LINE}` : "none",
                    borderBottom: `1px solid ${LINE}`,
                  }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: ".5rem", letterSpacing: ".16em", textTransform: "uppercase", color: ACC, flexShrink: 0, width: "6.5rem" }}>{label}</span>
                    <span style={{ fontSize: ".8rem", color: DIM, lineHeight: 1.5 }}>{desc}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background: GND2, border: `1px solid ${LINE}`, borderRadius: "2px", padding: "3.5rem 2.5rem" }}>
              <OpportunityMapSVG />
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            05.5 · SOLUTION — HOW MIGHT WE
        ═══════════════════════════════════════ */}
        <section style={{ borderTop: `1px solid ${LINEW}`, background: GND }}>
          <div style={{ padding: "8rem var(--pad)" }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

              {/* Header */}
              <div style={{ marginBottom: "5.5rem" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".26em", textTransform: "uppercase", color: ACC, opacity: 0.7, display: "block", marginBottom: "1.4rem" }}>Solution</span>
                <h2 style={{
                  fontFamily: "var(--font-display)", fontWeight: 400,
                  fontSize: "clamp(1.5rem, 3vw, 2.6rem)", lineHeight: 1.1,
                  letterSpacing: "-.025em", color: PAP,
                }}>
                  How might we solve our{" "}
                  <em style={{ fontStyle: "italic", color: ACC }}>user group&apos;s problem?</em>
                </h2>
              </div>

              {/* Two-column: ghost framing question left, HMW cards right */}
              <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>

                {/* Ghost text */}
                <div>
                  <p style={{
                    fontFamily: "var(--font-display)", fontWeight: 700,
                    fontSize: "clamp(1.6rem, 2.8vw, 2.5rem)",
                    color: "rgba(240,232,213,.08)", lineHeight: 1.2,
                    letterSpacing: "-.01em", userSelect: "none",
                  }}>
                    What and how can we design for these socio&#8209;economic groups?
                  </p>
                </div>

                {/* Staggered HMW cards */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                  {([
                    { q: "How might we create an application that helps them find work without having to ask for it?", filled: true },
                    { q: "How might we facilitate the user group with the tech they are already familiar with?",       filled: false },
                    { q: "How might we help this community stay safe when the contractor is no longer their safety net?", filled: true },
                  ] as { q: string; filled: boolean }[]).map(({ q, filled }, i) => (
                    <div
                      key={i}
                      style={{
                        padding: "2rem 2.4rem",
                        borderRadius: "20px",
                        background: filled ? ACC : GND2,
                        border: `1.5px solid ${filled ? "transparent" : LINE}`,
                        color: filled ? PAP : ACCB,
                        fontSize: ".95rem", fontWeight: 700, lineHeight: 1.45,
                        marginLeft: i % 2 === 1 ? "1.5rem" : "0",
                      }}
                    >
                      {q}
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            06 · INCLUSIVE DESIGN
        ═══════════════════════════════════════ */}
        <section style={{ borderTop: `1px solid ${LINEW}`, background: GND2 }}>
          <div style={{ padding: "8rem var(--pad)" }}>
            <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "start", maxWidth: "1200px", marginBottom: "5rem" }}>
              <div>
                <span style={{ ...labelStyle, marginBottom: "2rem" }}>Designed for who actually needs it</span>
                <h2 style={{
                  fontFamily: "var(--font-display)", fontWeight: 400,
                  fontSize: "clamp(1.8rem, 4vw, 3.2rem)", lineHeight: 1.1,
                  letterSpacing: "-.02em", color: PAP, marginBottom: "1.8rem",
                }}>
                  Hindi-first. Android-first. Works at a railway kiosk.
                </h2>
                <p style={{ fontSize: "1rem", color: DIM, lineHeight: 1.7, marginBottom: "1.2rem" }}>
                  Multi-regional language support, OTP-based registration with no email required, and physical access points at railway stations and post offices for workers who are offline-first.
                </p>
                <p style={{ fontSize: "1rem", color: DIM, lineHeight: 1.7 }}>
                  Employers go through KYC verification. Workers get an in-app record of every transaction. Both sides get something the contractor system never offered: accountability they can read and act on.
                </p>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {SCREENS.map((src, i) => (
                  <div key={i} style={{ borderRadius: "6px", overflow: "hidden", background: GND, border: `1px solid ${LINE}` }}>
                    <Image src={src} alt={`Rozi app screen ${i + 1}`} width={300} height={600} style={{ width: "100%", height: "auto", display: "block" }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Design principles */}
            <div style={{ borderTop: `1px solid ${LINEW}`, paddingTop: "4rem" }}>
              <span style={{ ...labelStyle, marginBottom: "2.5rem" }}>Inclusive design principles</span>
              <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.5rem", maxWidth: "1200px" }}>
                {[
                  { label: "No email required",      text: "OTP via SMS is the only credential. A smartphone number is the baseline." },
                  { label: "Multilingual by default", text: "Hindi and regional languages are first-class, not translations. English is optional." },
                  { label: "Offline-first fallback",  text: "Railway station kiosks and post office access for workers without smartphones." },
                  { label: "Voice-compatible",        text: "Every critical flow supports voice navigation for users with limited literacy." },
                ].map(({ label, text }) => (
                  <div key={label} style={{ padding: "1.8rem", background: GND, border: `1px solid ${LINE}` }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: ".5rem", letterSpacing: ".16em", textTransform: "uppercase", color: ACC, display: "block", marginBottom: ".7rem" }}>{label}</span>
                    <p style={{ fontSize: ".8rem", color: DIM, lineHeight: 1.6 }}>{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            07 · OUTCOME + CLOSE
        ═══════════════════════════════════════ */}
        <section style={{ borderTop: `1px solid ${LINEW}`, background: GND }}>
          {/* Outcome callout */}
          <div style={{ padding: "8rem var(--pad)", borderBottom: `1px solid ${LINEW}` }}>
            <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center", maxWidth: "1100px" }}>
              <div>
                <span style={{ ...labelStyle, marginBottom: "2rem" }}>Outcome</span>
                <p style={{
                  fontFamily: "var(--font-display)", fontWeight: 300,
                  fontSize: "clamp(4rem, 10vw, 8rem)", lineHeight: 0.95,
                  letterSpacing: "-.04em", color: ACC,
                }}>Top 5</p>
                <p style={{
                  fontFamily: "var(--font-display)", fontWeight: 400,
                  fontSize: "clamp(1.2rem, 2.5vw, 2rem)", lineHeight: 1.2,
                  letterSpacing: "-.02em", color: PAP, marginTop: "1rem",
                }}>
                  SARVA Designathon 2021<br />
                  <span style={{ color: DIM, fontWeight: 300 }}>National finalist, out of teams across India</span>
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                <p style={{ fontSize: "1rem", color: DIM, lineHeight: 1.7 }}>
                  Twenty-four hours. One team. A live brief on informal labour, wage exploitation, and digital exclusion. The research grounding, the two-sided platform model, and the inclusive design constraints were all derived in field, not in a conference room.
                </p>
                <p style={{ fontSize: "1rem", color: DIM, lineHeight: 1.7 }}>
                  What made it to the judging panel: a service model where the platform's incentives are aligned with the worker's, not the intermediary's. No skimming. No gatekeeping. Just a verified record of an agreed transaction.
                </p>
              </div>
            </div>
          </div>

          {/* Close */}
          <div style={{ padding: "6rem var(--pad)", background: GND2 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem", maxWidth: "900px" }}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                {["UX Research", "Service Design", "Inclusive Design", "Two-sided Platform", "Information Architecture"].map((tag) => (
                  <span key={tag} style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".16em", textTransform: "uppercase", color: DIM, border: `1px solid ${LINE}`, padding: ".4rem .8rem", borderRadius: "100px" }}>
                    {tag}
                  </span>
                ))}
              </div>
              <Link href="/work" style={{ fontFamily: "var(--font-mono)", fontSize: ".62rem", letterSpacing: ".2em", textTransform: "uppercase", color: ACC }}>
                ← Back to all work
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
