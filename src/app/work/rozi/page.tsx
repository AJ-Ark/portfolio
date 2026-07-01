import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rozi · No middlemen, just work",
  description:
    "A two-sided labour marketplace connecting India's informal workers directly to employers. Top 5 at SARVA Designathon 2021.",
};

/* -- Palette (dark, warm red-orange accent) -- */
const GND   = "#0c0806";
const GND2  = "#160d08";
const PAP   = "#f0e8d5";
const DIM   = "rgba(240,232,213,.6)";
const FAINT = "rgba(240,232,213,.28)";
const ACC   = "#C94030";
const ACCB  = "#E85540";
const LINE  = "rgba(201,64,48,.18)";
const LINEW = "rgba(240,232,213,.1)";

const FLOWS = [
  { src: "/images/rozi/flow-01-language.gif",  label: "Language selection",     desc: "Hindi, regional, English" },
  { src: "/images/rozi/flow-05-employee.gif",  label: "Worker registration",    desc: "OTP-based, no literacy barrier" },
  { src: "/images/rozi/flow-02-jobs.gif",      label: "Browse jobs by PINCODE", desc: "Location-first job discovery" },
  { src: "/images/rozi/flow-03-contact.gif",   label: "Contact employer",       desc: "Direct, no intermediary" },
  { src: "/images/rozi/flow-07-confirm.gif",   label: "Confirm assignment",     desc: "Clear pay and hours upfront" },
];

/* ── Lifecycle arc: five stages of a migrant worker's working life ── */
function LifecycleMapSVG() {
  const FILL_GND2  = "#160d08";
  const STROKE_ACC = "#C94030";
  const TEXT_PAP   = "#f0e8d5";
  const TEXT_DIM   = "rgba(240,232,213,.55)";
  const TEXT_FAINT = "rgba(240,232,213,.25)";
  const MONO       = '"JetBrains Mono", monospace';

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
      aria-label="Life cycle of a migrant worker: five stages from village entry to return">
      <defs>
        <linearGradient id="lc-grad" x1="0" y1="0" x2="1100" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor={STROKE_ACC} stopOpacity="0.3" />
          <stop offset="45%"  stopColor={STROKE_ACC} stopOpacity="1"   />
          <stop offset="55%"  stopColor={STROKE_ACC} stopOpacity="1"   />
          <stop offset="100%" stopColor={STROKE_ACC} stopOpacity="0.3" />
        </linearGradient>
      </defs>

      {/* Faint vertical guides */}
      {nodes.map(n => (
        <line key={n.num} x1={n.x} y1={20} x2={n.x} y2={300}
          stroke={TEXT_FAINT} strokeWidth="0.5" strokeDasharray="2,10" />
      ))}

      {/* Arc */}
      <path d={arcPath} fill="none" stroke="url(#lc-grad)" strokeWidth="1.5" />

      {nodes.map(n => (
        <g key={n.num}>
          <text x={n.x} y={n.y - 42} textAnchor="middle" fill={STROKE_ACC}
            style={{ fontFamily: MONO, fontSize: "8px", letterSpacing: "2px" }}>{n.num}</text>
          <text x={n.x} y={n.y - 27} textAnchor="middle" fill={TEXT_PAP}
            style={{ fontFamily: MONO, fontSize: "9px", letterSpacing: "1.5px" }}>{n.stage}</text>
          <line x1={n.x} y1={n.y - 19} x2={n.x} y2={n.y - 11}
            stroke={TEXT_FAINT} strokeWidth="0.5" />
          <circle cx={n.x} cy={n.y} r={8} fill={FILL_GND2} stroke={STROKE_ACC} strokeWidth="1.5" />
          <circle cx={n.x} cy={n.y} r={3} fill={STROKE_ACC} />
          <text x={n.x} y={n.y + 30} textAnchor="middle" fill={TEXT_DIM}
            style={{ fontFamily: MONO, fontSize: "8.5px" }}>{n.a1}</text>
          <text x={n.x} y={n.y + 44} textAnchor="middle" fill={TEXT_FAINT}
            style={{ fontFamily: MONO, fontSize: "8px" }}>{n.a2}</text>
        </g>
      ))}
    </svg>
  );
}

/* ── Radial map: seven system gaps a migrant worker faces ── */
function OpportunityMapSVG() {
  const FILL_GND2  = "#160d08";
  const STROKE_ACC = "#C94030";
  const TEXT_PAP   = "#f0e8d5";
  const TEXT_DIM   = "rgba(240,232,213,.55)";
  const TEXT_FAINT = "rgba(240,232,213,.2)";
  const MONO       = '"JetBrains Mono", monospace';
  const SERIF      = '"Fraunces", Georgia, serif';

  const cx = 540, cy = 280;

  /*  Spoke-end nodes + label anchor positions, laid out at r≈185 from centre,
      labels pushed to r≈245. Text anchors chosen per quadrant. */
  const sectors: {
    sx: number; sy: number;
    lx: number; ly: number;
    anchor: "middle" | "start" | "end";
    label: string; desc: string;
  }[] = [
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
      aria-label="Opportunity map: seven systemic gaps faced by migrant workers — healthcare, jobs, banking, payments, community, voting, upskilling">

      {/* Guide rings */}
      <circle cx={cx} cy={cy} r="195" fill="none" stroke={TEXT_FAINT} strokeWidth="0.5" strokeDasharray="3,10" />
      <circle cx={cx} cy={cy} r="98"  fill="none" stroke={TEXT_FAINT} strokeWidth="0.5" strokeDasharray="2,8" strokeOpacity="0.6" />

      {/* Spokes + nodes + labels */}
      {sectors.map(s => (
        <g key={s.label}>
          <line x1={cx} y1={cy} x2={s.sx} y2={s.sy}
            stroke={STROKE_ACC} strokeWidth="0.8" strokeOpacity="0.4" />
          <circle cx={s.sx} cy={s.sy} r={7} fill={FILL_GND2} stroke={STROKE_ACC} strokeWidth="1.5" />
          <circle cx={s.sx} cy={s.sy} r={2.5} fill={STROKE_ACC} />
          <text x={s.lx} y={s.ly} textAnchor={s.anchor} fill={TEXT_PAP}
            style={{ fontFamily: MONO, fontSize: "11px", letterSpacing: "1px" }}>{s.label}</text>
          <text x={s.lx} y={s.ly + 16} textAnchor={s.anchor} fill={TEXT_DIM}
            style={{ fontFamily: MONO, fontSize: "9px" }}>{s.desc}</text>
        </g>
      ))}

      {/* Centre */}
      <circle cx={cx} cy={cy} r={72} fill={FILL_GND2} stroke={STROKE_ACC} strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r={62} fill="none" stroke={STROKE_ACC} strokeWidth="0.5" strokeOpacity="0.3" />
      <text x={cx} y={cy - 8}  textAnchor="middle" fill={TEXT_PAP}
        style={{ fontFamily: SERIF, fontSize: "15px", fontStyle: "italic" }}>Migrant</text>
      <text x={cx} y={cy + 13} textAnchor="middle" fill={TEXT_PAP}
        style={{ fontFamily: SERIF, fontSize: "15px", fontStyle: "italic" }}>Workers</text>
      <text x={cx} y={cy + 34} textAnchor="middle" fill={STROKE_ACC}
        style={{ fontFamily: MONO, fontSize: "7px", letterSpacing: "2px" }}>SYSTEM GAP</text>
    </svg>
  );
}

const SCREENS = [
  "/images/rozi/screen-01.png",
  "/images/rozi/screen-02.png",
  "/images/rozi/screen-03.png",
  "/images/rozi/screen-04.png",
];

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
            letterSpacing: "-.06em", color: PAP, opacity: 0.07,
            userSelect: "none", pointerEvents: "none",
          }}>Rozi</div>

          <div style={{ position: "relative", zIndex: 3 }}>
            <div style={{
              fontFamily: "var(--font-mono)", fontSize: ".6rem",
              letterSpacing: ".28em", textTransform: "uppercase",
              color: ACC, opacity: 0.85, marginBottom: "1.4rem",
            }}>
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
        <section style={{ padding: "8rem var(--pad)", borderTop: `1px solid ${LINEW}` }}>
          <div
            className="mobile-stack"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center", maxWidth: "1100px" }}
          >
            <div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".26em", textTransform: "uppercase", color: ACC, opacity: 0.8, display: "block", marginBottom: "2.5rem" }}>The problem</span>
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(1.6rem, 3.5vw, 3rem)", lineHeight: 1.1, letterSpacing: "-.02em", color: PAP, marginBottom: "2rem" }}>
                A contractor in between means wages skimmed, hours hidden, and no recourse when either side breaks trust.
              </p>
              <p style={{ fontSize: "1rem", color: DIM, lineHeight: 1.7, maxWidth: "40ch" }}>
                Field visits and life-mapping sessions at railway stations and bus stands revealed the same pattern: the contractor system extracts from both worker and employer while offering neither side a verifiable record of the transaction.
              </p>
            </div>
            <div style={{ position: "relative", borderRadius: "2px", overflow: "hidden", aspectRatio: "4/3" }}>
              <Image
                src="/images/rozi/field-visit.png"
                alt="Field visit documentation: meeting with migrant workers at transport hubs"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            03 · PLATFORM OVERVIEW
        ═══════════════════════════════════════ */}
        <section style={{ background: GND2, borderTop: `1px solid ${LINEW}`, borderBottom: `1px solid ${LINEW}` }}>
          <div style={{ padding: "6rem var(--pad) 0" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".26em", textTransform: "uppercase", color: ACC, opacity: 0.8, display: "block", marginBottom: "1rem" }}>The platform</span>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(1.6rem, 3.5vw, 3.2rem)", lineHeight: 1.05, letterSpacing: "-.02em", color: PAP, maxWidth: "22ch", marginBottom: "3rem" }}>
              One app. Two sides. No contractor.
            </p>
            <p style={{ fontSize: "1rem", color: DIM, lineHeight: 1.7, maxWidth: "52ch", marginBottom: "3rem" }}>
              Workers browse by PINCODE, apply in two taps, and get a digital record of the agreed wage. Employers post with KYC verification and review profiles without a middleman setting the price. Both sides can withdraw, report, and rate.
            </p>
          </div>
          <div style={{ overflow: "hidden", maxHeight: "520px" }}>
            <Image
              src="/images/rozi/solution.png"
              alt="Rozi platform architecture: employee side and employer side side-by-side"
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
          <span style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".26em", textTransform: "uppercase", color: ACC, opacity: 0.8, display: "block", marginBottom: "1rem" }}>The product in motion</span>
          <p style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(1.4rem, 3vw, 2.6rem)", lineHeight: 1.1, letterSpacing: "-.02em", color: PAP, maxWidth: "28ch", marginBottom: "4rem" }}>
            Five key journeys, recorded from the prototype.
          </p>

          <div
            className="mobile-stack"
            style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1.5rem" }}
          >
            {FLOWS.map(({ src, label, desc }) => (
              <div key={src} style={{ display: "flex", flexDirection: "column", gap: ".8rem" }}>
                <div style={{ borderRadius: "6px", overflow: "hidden", background: GND2, border: `1px solid ${LINE}` }}>
                  <Image
                    src={src}
                    alt={label}
                    width={280}
                    height={560}
                    style={{ width: "100%", height: "auto", display: "block" }}
                    unoptimized
                  />
                </div>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".18em", textTransform: "uppercase", color: ACC, display: "block" }}>{label}</span>
                <span style={{ fontSize: ".75rem", color: DIM }}>{desc}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ═══════════════════════════════════════
            05 · RESEARCH PROCESS
        ═══════════════════════════════════════ */}
        <section style={{ padding: "8rem var(--pad)", background: GND2, borderTop: `1px solid ${LINEW}` }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".26em", textTransform: "uppercase", color: ACC, opacity: 0.8, display: "block", marginBottom: "3rem" }}>Research grounding · 24-hour sprint</span>

          <div
            className="mobile-stack"
            style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2.5rem", maxWidth: "1200px" }}
          >
            {/* EMPATHIZE — field visit photo */}
            <div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".22em", textTransform: "uppercase", color: ACC, opacity: 0.7, display: "block", marginBottom: ".8rem" }}>Empathize</span>
              <div style={{ borderRadius: "2px", overflow: "hidden", marginBottom: "1.2rem", background: GND }}>
                <Image src="/images/rozi/field-visit.png" alt="Field visit: meeting migrant workers at transport hubs" width={600} height={400} style={{ width: "100%", height: "auto", display: "block" }} />
              </div>
              <span style={{ fontSize: ".9rem", color: PAP, display: "block", marginBottom: ".4rem" }}>Field visits</span>
              <span style={{ fontSize: ".8rem", color: DIM, lineHeight: 1.6 }}>Railway stations, bus stands, job sites. Life-mapping sessions with workers who navigate this system daily.</span>
            </div>

            {/* DEFINE — lifecycle arc SVG */}
            <div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".22em", textTransform: "uppercase", color: ACC, opacity: 0.7, display: "block", marginBottom: ".8rem" }}>Define</span>
              <div style={{ borderRadius: "2px", overflow: "hidden", marginBottom: "1.2rem", background: GND, padding: "1.5rem 1rem 1rem" }}>
                <LifecycleMapSVG />
              </div>
              <span style={{ fontSize: ".9rem", color: PAP, display: "block", marginBottom: ".4rem" }}>Life of a migrant worker</span>
              <span style={{ fontSize: ".8rem", color: DIM, lineHeight: 1.6 }}>Five stages from village entry to return, mapped to find where the contractor system extracts value.</span>
            </div>

            {/* IDEATE — opportunity map SVG */}
            <div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".22em", textTransform: "uppercase", color: ACC, opacity: 0.7, display: "block", marginBottom: ".8rem" }}>Ideate</span>
              <div style={{ borderRadius: "2px", overflow: "hidden", marginBottom: "1.2rem", background: GND, padding: "1rem" }}>
                <OpportunityMapSVG />
              </div>
              <span style={{ fontSize: ".9rem", color: PAP, display: "block", marginBottom: ".4rem" }}>Opportunity mapping</span>
              <span style={{ fontSize: ".8rem", color: DIM, lineHeight: 1.6 }}>Seven system gaps where a platform could intervene without replicating the contractor logic.</span>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            06 · INCLUSIVE DESIGN
        ═══════════════════════════════════════ */}
        <section style={{ padding: "8rem var(--pad)", borderTop: `1px solid ${LINEW}` }}>
          <div
            className="mobile-stack"
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center", maxWidth: "1100px" }}
          >
            <div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".26em", textTransform: "uppercase", color: ACC, opacity: 0.8, display: "block", marginBottom: "2rem" }}>Designed for who actually needs it</span>
              <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(1.8rem, 4vw, 3.2rem)", lineHeight: 1.1, letterSpacing: "-.02em", color: PAP, marginBottom: "1.6rem" }}>
                Hindi-first. Android-first. Works at a railway kiosk.
              </h2>
              <p style={{ fontSize: "1rem", color: DIM, lineHeight: 1.7, marginBottom: "1.2rem" }}>
                Multi-regional language support, OTP-based registration with no email required, and physical access points at railway stations and post offices for workers who are offline-first.
              </p>
              <p style={{ fontSize: "1rem", color: DIM, lineHeight: 1.7 }}>
                Employers go through KYC verification. Workers get an in-app record of every transaction. Both sides get something the contractor system never offered: accountability.
              </p>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {SCREENS.map((src, i) => (
                <div key={i} style={{ borderRadius: "6px", overflow: "hidden", background: GND2, border: `1px solid ${LINE}` }}>
                  <Image
                    src={src}
                    alt={`Rozi app screen ${i + 1}`}
                    width={300}
                    height={600}
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
            07 · CLOSE
        ═══════════════════════════════════════ */}
        <section style={{ padding: "8rem var(--pad) 6rem", borderTop: `1px solid ${LINEW}`, background: GND2 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "3rem", maxWidth: "900px" }}>
            <div>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".22em", textTransform: "uppercase", color: ACC, opacity: 0.7, display: "block", marginBottom: ".8rem" }}>Project context</span>
              <p style={{ fontSize: ".9rem", color: DIM, lineHeight: 1.7, maxWidth: "52ch" }}>
                SARVA Designathon 2021, national level. 24-hour sprint. Top 5 finalist out of teams from across India. Problem space: informal labour, wage exploitation, digital exclusion. Role: solo researcher and designer.
              </p>
            </div>
            <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap" }}>
              {["UX Research", "Service Design", "Inclusive Design", "Two-sided Platform", "Information Architecture"].map((tag) => (
                <span
                  key={tag}
                  style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".16em", textTransform: "uppercase", color: DIM, border: `1px solid ${LINE}`, padding: ".4rem .8rem", borderRadius: "100px" }}
                >
                  {tag}
                </span>
              ))}
            </div>
            <Link
              href="/work"
              style={{ fontFamily: "var(--font-mono)", fontSize: ".65rem", letterSpacing: ".2em", textTransform: "uppercase", color: ACC }}
            >
              Back to all work
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
