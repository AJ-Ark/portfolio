"use client";

import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import WordReveal from "@/components/ui/WordReveal";
import PlotInLines from "@/components/ui/PlotInLines";
import { projectsBySlug } from "@/data/projects";
import { useColorScheme } from "@/hooks/useColorScheme";

const project = projectsBySlug["trmeric"];

/* ── Accent is the same in dark + light ── */
const ACC  = "#FFA426";
const ACCB = "#FFB84D";
const LINA = "rgba(255,164,38,.26)";

const PHASES = [
  { letter: "A", label: "Shape", question: "What should we build?", persona: "Demand Manager", icon: "chat" as const, surfaces: ["Demand intake", "Canvas", "Tango AI scoping", "Ideation"], desc: "Capture intent. Structure the demand. Tango turns an idea into a scoped initiative in 90 seconds instead of 3 months." },
  { letter: "B", label: "Plan",  question: "Who builds it, by when?", persona: "Portfolio Planner", icon: "grid" as const, surfaces: ["Resource Manager", "Portfolio Monitor", "Budget", "Potential Hub"], desc: "Assign resources, set timelines, track budget. Force-graph visibility across the whole portfolio from the start." },
  { letter: "C", label: "Execute", question: "Are we on track?", persona: "Project Manager", icon: "flag" as const, surfaces: ["Project Manager", "RAID", "Signals", "Trucible", "Action Hub"], desc: "Keep initiatives on track. Surface risks before they become blockers. Knowledge stays close to the work." },
  { letter: "D", label: "Evaluate", question: "Did it deliver value?", persona: "Executive Sponsor", icon: "eye" as const, surfaces: ["Portfolio Monitor (CIO)", "Action Hub", "Kudos", "Cockpit"], desc: "Outcome tracking, recognition, and portfolio closure. The loop closes back to the next demand." },
];

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

/* ── Feature deep-dives ── */
interface FeatureDecision { decision: string; reasoning: string; }
interface Feature {
  num: string;
  slug: string;
  title: string;
  oneLiner: string;
  img: string;
  imgAlt: string;
  body: string;
  decisions: FeatureDecision[];
  theory: string;
  theoryRef: string;
  protoSrc?: string;
  protoHints?: string[];
}

const FEATURES: Feature[] = [
  {
    num: "01",
    slug: "demand-owner-flow",
    title: "Demand Owner Flow",
    oneLiner: "From a blank demand idea to a scoped, resourced, Tango-validated initiative.",
    img: "/images/trmeric/canvas.png",
    imgAlt: "Trmeric Demand Canvas, the structured intake surface where a demand moves from idea to scoped initiative",
    body: "The original onboarding dropped users onto a blank Tango screen with no context. First sessions showed users typing questions like 'what do I do here?', a blank state problem. The redesign introduced a storyboard-first approach: Tango opens with context about the user's role, surfaces the top three demand types relevant to them, and creates a pre-filled structure before the user has typed a word. The design question became: how do we make the first action feel like insight, not instruction?",
    decisions: [
      { decision: "Insight before action", reasoning: "Tango shows what it already knows about the context before asking the user to fill anything in. This shifts the first interaction from 'answer these questions' to 'is this right?', a much lower cognitive load entry point." },
      { decision: "4-line card structure", reasoning: "Every demand card carries four lines: Title, Milestone, Action, Tango input. Items that need no attention are muted gray; items requiring action are darker. The user scans the third line first. This was a deliberate attention signal system, not aesthetic choice." },
      { decision: "Tango as guide, not gatekeeper", reasoning: "Tango pre-fills the canvas with its best interpretation. The user corrects, not creates. This follows the Piaget principle of scaffolding: provide the structure, let the expert refine it. Early testing showed 81% acceptance of Tango's pre-filled scoping." },
    ],
    theory: "Progressive disclosure (Nielsen): reveal complexity only as needed. The create-demand overlay follows a conversational arc, not a form. Mental model alignment: users don't think in fields, they think in narratives. Tango speaks narrative first.",
    theoryRef: "Nielsen (1994) · Piaget scaffolding theory · Conversational UI design",
    protoSrc: "/prototypes/trmeric/demand-flow-all-in-one.html",
    protoHints: ["Start on the demand grid. Scan the third line of each card to find what needs action", "Click any demand row to expand it in place and see the full canvas", "Hit 'Ask Tango' to see the pre-flight conversation that scopes a demand in under 90 seconds"],
  },
  {
    num: "02",
    slug: "portfolio-monitor",
    title: "Portfolio Monitor",
    oneLiner: "Multi-portfolio force graph with persona-contextual views for CIOs, Portfolio Leaders, and Resource Managers.",
    img: "/images/trmeric/portfolio-monitor.png",
    imgAlt: "Trmeric Portfolio Monitor v36, the force-graph multi-portfolio view with persona-contextual category system",
    body: "The Portfolio Monitor went through 36 iterations (v13 to v36). Every version that added more features was rejected. The v36 that shipped had fewer visible controls than v13, but each control carried more context. The breakthrough came from a single directive from Siddharth: 'less is more.' Not less data. Less interface. The challenge was showing the full portfolio across all lifecycle phases to three completely different personas (Portfolio Leader, CIO, Resource Manager) using one unified surface that adapts rather than fragmenting into separate dashboards.",
    decisions: [
      { decision: "One control bar, three rows removed", reasoning: "v13 had three rows of filters, sorts, and view toggles. Each row added one capability but increased the perceived complexity of the page. Consolidating into a single dock-style control bar with icon pills reduced visual weight by 60% while preserving all functionality." },
      { decision: "Dashboard mode vs Action mode", reasoning: "From a June 2026 UX sync: 'You are either in dashboard mode or in action mode.' The dual-mode approach lets users toggle between viewing portfolio health and acting on it from the same surface, avoiding the context switch of navigating to a separate 'actions' page." },
      { decision: "Dynamic portfolio headers", reasoning: "The portfolio header changes based on the active persona. A CIO sees portfolio-level value metrics. A Resource Manager sees capacity and utilisation. A Portfolio Leader sees initiative status. Same data, different emphasis, always sourced from the same underlying graph." },
    ],
    theory: "Miller's Law (7±2 items in working memory) drove the control consolidation. Persona-contextual design: one surface, multiple lenses. The force-graph representation draws on network theory: clustering reveals relationships that a table cannot.",
    theoryRef: "Miller (1956) · Information scent theory · Force-directed graph (Fruchterman & Reingold)",
    protoSrc: "/prototypes/trmeric/portfolio-monitor.html",
    protoHints: ["Use the category pills in the control bar to filter by lifecycle phase", "Switch persona (top right). The page reorganises for CIO vs Portfolio Leader vs Resource Manager", "Hover any node in the force graph to see which initiatives are connected"],
  },
  {
    num: "03",
    slug: "project-manager",
    title: "Project Manager + RAID",
    oneLiner: "Project status and execution management built on one principle: Up-level is the only path forward.",
    img: "/images/trmeric/raid-workspace.png",
    imgAlt: "Trmeric Project Manager workspace, showing Scope, Schedule, and Spend health, the Execution Board, and the RAID tab with overdue, in-progress, and to-do items",
    body: "The Project Manager is built around a single idea: the only action that matters is moving a project forward. Every element on the page either shows the current state clearly or enables the next stage advance. The RAG severity system (Red/Amber/Green) is implemented not just as color but as animation: a green project is calm, an amber project subtly pulses, a red project vibrates. This means severity is perceptible in peripheral vision without reading any text. The RAID module (Risks, Assumptions, Issues, Dependencies) lives alongside the project status as a peer surface, not an afterthought.",
    decisions: [
      { decision: "RAG as animation, not just color", reasoning: "Color alone fails for colorblind users and is invisible at a glance when scanning many projects simultaneously. The sparkle icons animate differently by severity: green glows softly, amber pulses, red vibrates. Attention is drawn physically to what needs it, before the user has consciously focused." },
      { decision: "Up-level as the only update entry point", reasoning: "Earlier versions had inline editing, a status bar, and multiple update flows. Each created inconsistency in the data and confusion about what 'updating' meant. Collapsing all updates into one modal, the Up-level dialog, created a single truth point and removed ambiguity about where to go to change anything." },
      { decision: "Muted hierarchy for attention signals", reasoning: "Items on track have light, muted text. Items needing action have darker, heavier weight. This is a deliberate reversal of typical UI defaults (where everything is equally visible). The user's eye moves to the darker elements automatically, no badge counts needed." },
    ],
    theory: "Exception-based management: only show what deviates from plan. Attention economics (Davenport & Beck): the scarcest resource in enterprise software is not information but attention. Animation-as-severity borrows from auditory design: a sound that gets louder is a warning, regardless of pitch.",
    theoryRef: "Davenport & Beck (2001) · ISO 9241 attention principles · RAG status management",
    protoSrc: "/prototypes/trmeric/project-manager.html",
    protoHints: ["Notice the sparkle icon colours on each project row. Green is calm, amber pulses, red vibrates", "Click 'Up-level' on any project to open the single update modal. This is the only way to change status", "Open the RAID tab to see how risks, assumptions, issues, and dependencies are tracked alongside the project"],
  },
  {
    num: "04",
    slug: "trucible",
    title: "Trucible · Knowledge OS",
    oneLiner: "Wiki and Explorer modes for an enterprise context management system. Not a document store.",
    img: "/images/trmeric/trucible.png",
    imgAlt: "Trucible, dual-mode enterprise knowledge OS showing Wiki and Explorer views with qualitative context strength tiers",
    body: "The brief from Siddharth: 'Trucible is a context management system, not a document management system.' That single sentence changed the entire design direction. A document store is a filing cabinet: you put things in and retrieve them. A context engine actively understands what matters and makes that knowledge available to Tango across every surface. The visual language had to reflect this: Trucible doesn't show folders and files, it shows relationships and understanding depth. The context strength tiers replaced a percentage score (67% complete) with a living metaphor (Seedling to Warming Up to Deep Root).",
    decisions: [
      { decision: "Context tiers over percentage scores", reasoning: "A '67% complete' score creates anxiety about the missing 33% without indicating what matters. 'Warming Up' tells you the context is actively growing and usable. 'Deep Root' tells you Tango can draw on this confidently. The metaphors come from plant biology, the same language as the Trmeric brand. This was not decoration; it was alignment." },
      { decision: "Dual mode: Wiki vs Explorer", reasoning: "Wiki mode shows Tango-generated articles, structured, readable, sourced. Explorer mode shows the knowledge as a force-directed graph, folder tree, or list. The switch between modes is the same context, different lens. A knowledge worker reading to understand uses Wiki. A knowledge worker searching for something specific uses Explorer. Both are valid entry points." },
      { decision: "Trucible Trivia as preview panel", reasoning: "Before a user commits to reading a full article, a preview panel surfaces the three most relevant facts from that context. This is borrowed from search engine result snippets, the preview earns the click. In enterprise context, time is the scarcest resource." },
    ],
    theory: "Nonaka & Takeuchi knowledge spiral (1995): tacit-to-explicit knowledge conversion. Trucible makes organizational tacit knowledge (what people know but haven't written) explicit and searchable via Tango. Information architecture: card-based progressive disclosure. The dual mode mirrors Nielsen's 'search vs browse' dichotomy.",
    theoryRef: "Nonaka & Takeuchi (1995) · Nielsen (1997) search vs browse · PKM theory",
    protoSrc: "/prototypes/trmeric/trucible.html",
    protoHints: ["Switch between Wiki mode and Explorer mode using the toggle at the top", "Notice the context strength tiers. 'Deep Root' means Tango can draw on this confidently; 'Seedling' means it's still growing", "Click any source to see the connected status dot. Live sources glow green"],
  },
  {
    num: "05",
    slug: "signals",
    title: "Signals · D3 Force Graph",
    oneLiner: "An Obsidian-style force-directed signal map for early-warning detection across a project portfolio.",
    img: "/images/trmeric/signals-graph.png",
    imgAlt: "Trmeric Signals, D3 physics force graph clustered by project, with severity-coded bubbles and the Tango Agent signal briefing panel",
    body: "Signals began as a question: what if you could see all the early warnings in a portfolio at once, not as a table of flags but as a landscape of risk? The D3 force-directed simulation with 90 nodes creates natural clusters that reveal structural risk patterns: a cluster of red nodes means a systemic problem, not isolated issues. The interaction model evolved significantly: the original 'click to bloom' interaction expanded nodes on click, which lost context. The new 'hover to highlight' interaction draws the neighbour graph around any node you focus on, so you always know where you are in the full map.",
    decisions: [
      { decision: "Hover-to-highlight vs click-to-bloom", reasoning: "Click-to-bloom: you click a node and its connections expand outward. Problem: you lose the position of that node in the overall map. Hover-to-highlight: the node you hover shows its neighbour graph, dimming everything else. The full map stays visible. Borrowed directly from Obsidian's graph view, the pattern already existed and users intuitively knew it." },
      { decision: "Severity as physics, not color alone", reasoning: "High-severity nodes have higher 'weight' in the force simulation, so they attract more connections and cluster toward the center. This means the most critical risks are structurally visible (center-dense) before the user has read any labels. The severity color still exists, but the physics reinforces it spatially." },
      { decision: "PM flow integration via iframe", reasoning: "Signals is not a standalone tool. It lives beside the Project Manager. A signal click surfaces the relevant project card inline, so the user can act on the risk directly from the map without leaving the visualization context. The transition from map to action is zero-navigation." },
    ],
    theory: "Network theory (Barabási, 2002): scale-free networks have hubs that, if disrupted, cause cascading failures. Signals visualises the same structure in a project portfolio: the most-connected risks are the highest-priority. The force simulation uses Fruchterman-Reingold to produce natural layouts that humans can learn to read without training.",
    theoryRef: "Barabási (2002) · Fruchterman & Reingold (1991) · Obsidian graph UX",
    protoSrc: "/prototypes/trmeric/pm-signals.html",
    protoHints: ["Hover any node. The neighbour graph highlights around it while the rest dims", "Look at where clusters form naturally. Dense clusters reveal systemic risk, not isolated issues", "Click a node to surface the related project card inline, without leaving the map"],
  },
];

export default function TrmericPage() {
  const dark = useColorScheme();
  const BASE  = dark ? "#0F0D09" : "#FAF7F1";
  const BASE2 = dark ? "#1C1508" : "#F1EADC";
  const INK   = dark ? "#F2E8D0" : "#17150F";
  const DIM   = dark ? "rgba(242,232,208,.62)" : "rgba(23,21,15,.62)";
  const FAINT = dark ? "rgba(242,232,208,.36)" : "rgba(23,21,15,.36)";
  const ACCD  = dark ? "#FF9A35" : "#E8730E";
  const LINE  = dark ? "rgba(255,164,38,.14)" : "rgba(23,21,15,.12)";
  const SHADOW = dark ? "0 4px 32px -8px rgba(0,0,0,.65)" : "0 4px 24px -8px rgba(23,21,15,.14)";

  const s = {
    kicker: {
      fontFamily: "var(--font-mono)",
      fontSize: ".65rem",
      letterSpacing: ".22em",
      textTransform: "uppercase" as const,
      color: ACCD,
      display: "block",
      marginBottom: "1.1rem",
    },
    body: {
      fontSize: ".9375rem",
      color: DIM,
      lineHeight: 1.78,
      maxWidth: "56ch",
    },
  };

  return (
    <div style={{ background: BASE, color: INK, minHeight: "100vh" }}>
      <Navigation />

      <main id="main-content">

        {/* ═══════════════ 01 · HERO ═══════════════ */}
        <section className="mobile-stack" style={{ minHeight: "88vh", display: "grid", gridTemplateColumns: "55% 45%", alignItems: "center", padding: "8rem var(--pad) 5rem", gap: "3rem" }}>
          <div>
            <PlotInLines>
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
                <Image
                  src="/images/trmeric/trmericLogo.svg"
                  alt="Trmeric"
                  width={160}
                  height={38}
                  style={{ height: 32, width: "auto" }}
                />
                <span style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".2em", textTransform: "uppercase", color: FAINT }}>
                  Enterprise SaaS · AI Design · Founding Team · 2025–present
                </span>
              </div>
            </PlotInLines>
            <PlotInLines delay={80}>
              <h1 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "clamp(2.2rem, 5.5vw, 4.4rem)", lineHeight: 1.06, letterSpacing: "-.025em", color: INK }}>
                From the first idea{" "}
                <em style={{ fontStyle: "italic", color: ACC }}>to the board review.</em>{" "}
                I designed the whole journey.
              </h1>
            </PlotInLines>
            <PlotInLines delay={160}>
              <p style={{ fontSize: "clamp(.9375rem, 1.6vw, 1.15rem)", color: DIM, lineHeight: 1.7, maxWidth: "50ch", marginTop: "1.1rem" }}>
                Senior Product Designer on the founding team of Trmeric, an AI-native enterprise SaaS that takes demand from intake to portfolio value. I own the full design surface: IA, interaction design, design system, and production-grade prototypes that engineering builds from directly.
              </p>
            </PlotInLines>
            <PlotInLines delay={240}>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", marginTop: "2.5rem", paddingTop: "2rem", borderTop: `1px solid ${LINE}` }}>
                {[["ROLE","Senior Product Designer"],["TEAM","Siddharth Bohra (CEO) · Roshan PR (Eng)"],["CLIENTS","BHP · Veolia · EY · Seagate"],["TIMELINE","2025 – present"]].map(([l,v]) => (
                  <div key={l}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".2em", textTransform: "uppercase", color: FAINT, display: "block", marginBottom: ".3rem" }}>{l}</span>
                    <span style={{ fontSize: ".8rem", color: DIM, lineHeight: 1.5 }}>{v}</span>
                  </div>
                ))}
              </div>
            </PlotInLines>
          </div>

          <PlotInLines delay={120}>
            <div style={{ position: "relative", height: "520px", borderRadius: "16px", overflow: "hidden", border: `1px solid ${LINE}`, boxShadow: "0 24px 60px -20px rgba(23,21,15,.18)" }}>
              <Image src="/images/trmeric/grid.png" alt="Trmeric My Hub, the main demand grid" fill style={{ objectFit: "cover", objectPosition: "top left" }} priority />
            </div>
          </PlotInLines>
        </section>

        {/* ═══════════════ 02 · LOGLINE ═══════════════ */}
        <section style={{ padding: "5rem var(--pad)", borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}`, background: BASE2 }}>
          <div style={{ maxWidth: "880px", margin: "0 auto" }}>
            <span style={{ ...s.kicker, marginBottom: ".6rem" }}>The problem</span>
            <WordReveal as="p" delay={0} stagger={55} style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "clamp(1.5rem, 3vw, 2.4rem)", lineHeight: 1.15, letterSpacing: "-.02em", color: INK, maxWidth: "34ch" }}>
              Enterprise demand doesn't fail at the idea. It fails between the idea and the decision.
            </WordReveal>
          </div>
        </section>

        {/* ═══════════════ 03 · CONTEXT ═══════════════ */}
        <section style={{ padding: "6rem var(--pad)" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <span style={s.kicker}>What Trmeric is</span>
            <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }}>
              <div>
                <h2 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "clamp(1.6rem, 3vw, 2.4rem)", lineHeight: 1.12, letterSpacing: "-.02em", color: INK, marginBottom: "1.4rem" }}>
                  An AI-native B2B SaaS for{" "}<em style={{ fontStyle: "italic", color: ACC }}>demand management, resource management, and portfolio value.</em>
                </h2>
                <p style={{ ...s.body, marginBottom: "1rem" }}>Enterprises decide what to build, who builds it, and whether it delivered value, currently across emails, spreadsheets, and quarterly reviews that arrive too late to change anything.</p>
                <p style={s.body}>Trmeric introduces structured demand intake, Tango (an AI agent that scopes a demand in 90 seconds instead of 3 months), and portfolio-level value tracking that closes the loop from idea to outcome.</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ padding: "1.4rem 1.6rem", border: `1px solid ${LINE}`, borderRadius: "12px", background: BASE2 }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".18em", textTransform: "uppercase", color: FAINT, marginBottom: ".6rem" }}>Before Trmeric</div>
                  <p style={{ fontSize: ".875rem", color: DIM, lineHeight: 1.6 }}>Demand requests arrive as emails, get lost in spreadsheets, and have no lifecycle visibility. No structured intake. No AI scoping. No portfolio-level value tracking.</p>
                </div>
                <div style={{ padding: "1.4rem 1.6rem", border: `1px solid ${LINA}`, borderRadius: "12px", background: "rgba(255,164,38,.09)" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".18em", textTransform: "uppercase", color: ACC, marginBottom: ".6rem" }}>With Trmeric</div>
                  <p style={{ fontSize: ".875rem", color: DIM, lineHeight: 1.6 }}>Intake → AI scoping → resource planning → execution → portfolio value. One continuous workflow across all personas with Tango surfacing the right context for each.</p>
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".12em", color: ACCD, fontStyle: "italic", paddingLeft: ".4rem" }}>One rule: prototypes are the spec. Engineering builds from them directly.</div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ 04 · LIFECYCLE ═══════════════ */}
        <section style={{ padding: "5rem var(--pad)", borderTop: `1px solid ${LINE}`, background: BASE2 }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <span style={s.kicker}>Four lifecycle phases · 23 surfaces</span>
            <p style={{ ...s.body, marginBottom: "2.5rem", marginTop: ".5rem" }}>Every surface answers one question. The lifecycle is the spine; every feature is a response to a specific failure mode in how enterprises manage work.</p>
            <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", border: `1px solid ${LINE}`, borderRadius: "14px", overflow: "hidden" }}>
              {PHASES.map(({ letter, label, question, persona, icon, surfaces, desc }) => (
                <div key={letter} style={{ padding: "1.8rem 1.6rem", background: BASE, borderRight: `1px solid ${LINE}` }}>
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
                  <div style={{ display: "flex", flexDirection: "column", gap: ".4rem" }}>
                    {surfaces.map(n => <span key={n} style={{ fontFamily: "var(--font-mono)", fontSize: ".72rem", letterSpacing: ".04em", color: DIM, lineHeight: 1.4 }}>· {n}</span>)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ 05 · METRICS ═══════════════ */}
        <section style={{ padding: "4rem var(--pad)" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <span style={{ ...s.kicker, marginBottom: "1.5rem" }}>Outcomes, measured not claimed</span>
            <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", borderTop: `1px solid ${LINE}`, borderLeft: `1px solid ${LINE}` }}>
              {(project.metrics ?? []).map(({ value, label }) => (
                <div key={label} style={{ padding: "2rem 1.6rem", borderRight: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}` }}>
                  <div style={{ fontFamily: "var(--font-body)", fontWeight: 800, fontSize: "2.4rem", letterSpacing: "-.04em", color: ACC, lineHeight: 1, fontVariantNumeric: "tabular-nums", marginBottom: ".5rem" }}>{value}</div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: ".58rem", letterSpacing: ".14em", textTransform: "uppercase", color: FAINT }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ 06 · SURFACE GALLERY ═══════════════ */}
        <section style={{ padding: "5rem var(--pad)", borderTop: `1px solid ${LINE}`, background: BASE2 }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <span style={s.kicker}>The surface archive, 8 of 23</span>
            <p style={{ ...s.body, marginBottom: "2.5rem", marginTop: ".4rem" }}>Every screen is a production-grade prototype. Engineering builds from these directly.</p>
            <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
              {[
                { src: "/images/trmeric/cockpit.png", label: "Demand Cockpit", alt: "Demand Cockpit" },
                { src: "/images/trmeric/project-manager.png", label: "Project Manager", alt: "Project Manager" },
                { src: "/images/trmeric/resource-manager.png", label: "Resource Manager", alt: "Resource Manager" },
                { src: "/images/trmeric/raid.png", label: "RAID", alt: "RAID" },
                { src: "/images/trmeric/kudos.png", label: "Kudos", alt: "Kudos" },
                { src: "/images/trmeric/admin-console.png", label: "Admin Console", alt: "Admin Console" },
                { src: "/images/trmeric/actionhub.png", label: "Action Hub", alt: "Action Hub" },
                { src: "/images/trmeric/designsystem.png", label: "Design System v3", alt: "Design System" },
              ].map(({ src, label, alt }) => (
                <div key={src}>
                  <div style={{ position: "relative", height: "160px", borderRadius: "10px", overflow: "hidden", border: `1px solid ${LINE}`, boxShadow: SHADOW }}>
                    <Image src={src} alt={alt} fill style={{ objectFit: "cover", objectPosition: "top left" }} />
                  </div>
                  <p style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".12em", textTransform: "uppercase", color: FAINT, marginTop: ".5rem" }}>{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════ 07 · FEATURE DEEP-DIVES ═══════════════ */}
        <section style={{ borderTop: `1px solid ${LINE}` }}>
          <div style={{ padding: "5rem var(--pad) 2rem", maxWidth: "1100px", margin: "0 auto" }}>
            <span style={s.kicker}>Feature deep-dives</span>
            <h2 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "clamp(1.6rem, 3vw, 2.4rem)", letterSpacing: "-.02em", color: INK, maxWidth: "28ch", lineHeight: 1.15 }}>
              Five deep dives. The thought process behind each one.
            </h2>
          </div>

          {FEATURES.map((f, fi) => (
            <div
              key={f.slug}
              style={{ borderTop: `1px solid ${LINE}`, background: fi % 2 === 1 ? BASE2 : BASE }}
            >
              <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "5rem var(--pad)" }}>

                {/* Number + title row */}
                <div style={{ display: "flex", alignItems: "baseline", gap: "1.2rem", marginBottom: "2.5rem" }}>
                  <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "3rem", color: ACC, lineHeight: 1, opacity: 0.5 }}>{f.num}</span>
                  <div>
                    <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "clamp(1.3rem, 2.5vw, 2rem)", letterSpacing: "-.02em", color: INK, marginBottom: ".3rem" }}>{f.title}</h3>
                    <p style={{ fontFamily: "var(--font-body)", fontStyle: "italic", fontSize: ".9375rem", color: ACCD }}>{f.oneLiner}</p>
                  </div>
                </div>

                {/* Screenshot — full width, prominent */}
                <div style={{ position: "relative", width: "100%", height: "460px", borderRadius: "14px", overflow: "hidden", border: `1px solid ${LINE}`, boxShadow: SHADOW, marginBottom: "3rem" }}>
                  <Image src={f.img} alt={f.imgAlt} fill style={{ objectFit: "cover", objectPosition: "top left" }} />
                </div>

                {/* Body copy + decisions in 2-col */}
                <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start", marginBottom: "2.5rem" }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".2em", textTransform: "uppercase", color: FAINT, marginBottom: ".8rem" }}>Thought process</div>
                    <p style={{ fontSize: ".9375rem", color: DIM, lineHeight: 1.78, marginBottom: "1.4rem" }}>{f.body}</p>
                    {/* Theory reference */}
                    <div style={{ padding: "1rem 1.2rem", background: fi % 2 === 0 ? BASE2 : BASE, border: `1px solid ${LINE}`, borderRadius: "10px" }}>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: ".5rem", letterSpacing: ".18em", textTransform: "uppercase", color: ACC, marginBottom: ".4rem" }}>Theory grounding</div>
                      <p style={{ fontSize: ".8125rem", color: DIM, lineHeight: 1.65, marginBottom: ".5rem" }}>{f.theory}</p>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: ".5rem", letterSpacing: ".14em", color: FAINT }}>{f.theoryRef}</div>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".2em", textTransform: "uppercase", color: FAINT, marginBottom: ".8rem" }}>Key design decisions</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      {f.decisions.map(({ decision, reasoning }) => (
                        <div key={decision} style={{ padding: "1.1rem 1.3rem", border: `1px solid ${LINE}`, borderRadius: "10px", background: fi % 2 === 0 ? BASE2 : BASE }}>
                          <div style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: ".875rem", color: INK, marginBottom: ".4rem" }}>{decision}</div>
                          <p style={{ fontSize: ".8125rem", color: DIM, lineHeight: 1.65 }}>{reasoning}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Prototype CTA */}
                {f.protoSrc && (
                  <div style={{ paddingTop: "2rem", borderTop: `1px solid ${LINE}` }}>
                    {/* What to try — hints */}
                    {f.protoHints && (
                      <div style={{ marginBottom: "1.4rem" }}>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".18em", textTransform: "uppercase", color: FAINT, marginBottom: ".7rem" }}>
                          What to try
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: ".45rem" }}>
                          {f.protoHints.map((hint, hi) => (
                            <div key={hi} style={{ display: "flex", gap: ".7rem", alignItems: "flex-start" }}>
                              <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: ".9rem", color: ACC, lineHeight: 1.4, flexShrink: 0, marginTop: ".05rem" }}>
                                {hi + 1}.
                              </span>
                              <p style={{ fontSize: ".8125rem", color: DIM, lineHeight: 1.6, margin: 0 }}>{hint}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                      <a
                        href={f.protoSrc}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontFamily: "var(--font-mono)", fontSize: ".65rem", letterSpacing: ".18em", textTransform: "uppercase", color: BASE, background: ACC, borderRadius: "4px", padding: ".75rem 1.6rem", display: "inline-flex", alignItems: "center", gap: ".6rem" }}
                      >
                        Open the prototype →
                      </a>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".14em", textTransform: "uppercase", color: FAINT }}>
                        Opens fullscreen · real interactions
                      </span>
                      <Link
                        href={`/work/trmeric/${f.slug}`}
                        style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".14em", textTransform: "uppercase", color: ACCD, border: `1px solid ${LINA}`, borderRadius: "4px", padding: ".5rem .9rem", display: "inline-block" }}
                      >
                        Full case study →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </section>

        {/* ═══════════════ 08 · DESIGN SYSTEM ═══════════════ */}
        <section style={{ padding: "5rem var(--pad)", borderTop: `1px solid ${LINE}`, background: BASE2 }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start" }}>
              <div>
                <span style={s.kicker}>Design system, Trmeric DS v3</span>
                <h2 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "clamp(1.4rem, 2.5vw, 2rem)", letterSpacing: "-.02em", color: INK, marginBottom: "1.2rem", lineHeight: 1.2 }}>Built from the turmeric plant.</h2>
                <p style={{ ...s.body, marginBottom: "1rem" }}>Rhizome oranges. Powder golds. Leaf greens. Root browns. The palette references an actual object. That constraint made every color decision easier and the system more coherent.</p>
                <p style={{ ...s.body, marginBottom: "1.5rem" }}>One rule: <strong style={{ color: INK, fontWeight: 600 }}>no Claudian design.</strong> No heavy left-border accents. No accent rails used as decoration. Hierarchy does the work, not ornament.</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {[
                    { d: "Orange is brand, never AI", r: "The AI gradient (#8b5cf6 → #FFA426) appears exclusively in Tango contexts. When users see it, they know intelligence is active. Mixing orange into both buttons and AI collapses this critical signal." },
                    { d: "Buttons are pills, never hard rectangles", r: "Pills with border-radius: 9999px. Primary = solid orange, used once per region. This keeps the UI approachable and prevents visual hardness in a dense data product." },
                    { d: "Chips carry all semantic color", r: "Status, priority, and readiness are communicated via chips with tinted backgrounds. The surface stays neutral. Color earns its place only when it carries meaning." },
                  ].map(({ d, r }) => (
                    <div key={d} style={{ padding: "1rem 1.2rem", border: `1px solid ${LINE}`, borderRadius: "10px", background: BASE }}>
                      <div style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: ".875rem", color: INK, marginBottom: ".4rem" }}>{d}</div>
                      <p style={{ fontSize: ".8125rem", color: DIM, lineHeight: 1.6 }}>{r}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ position: "relative", height: "560px", borderRadius: "14px", overflow: "hidden", border: `1px solid ${LINE}`, boxShadow: SHADOW }}>
                <Image src="/images/trmeric/designsystem.png" alt="Trmeric Design System v3, token system and component library" fill style={{ objectFit: "cover", objectPosition: "top left" }} />
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════ 09 · LOGO, LOADED. ═══════════════ */}
        <section style={{ borderTop: `1px solid ${LINE}`, background: BASE }}>

          {/* ── Opening statement ── */}
          <div style={{ padding: "7rem var(--pad) 5rem", maxWidth: "1100px", margin: "0 auto" }}>
            <span style={s.kicker}>Brand identity · Logo, Loaded.</span>
            <h2 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "clamp(2rem, 4.5vw, 3.8rem)", letterSpacing: "-.025em", color: INK, lineHeight: 1.08, maxWidth: "20ch", marginBottom: "2rem" }}>
              The mark is not designed.{" "}
              <em style={{ fontStyle: "italic", color: ACC }}>It is grown.</em>
            </h2>
            <p style={{ ...s.body, fontSize: "1.0625rem", maxWidth: "52ch", lineHeight: 1.75 }}>
              Every logo tells you about the thing it names. Ours starts with a question: what does a turmeric rhizome look like on the inside? Not metaphorically. Literally. The mark is built from real cross-section data. What follows is how it got there.
            </p>
          </div>

          {/* ── 01: The completed mark — revealed full-width ── */}
          <div style={{ background: BASE2, borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}` }}>
            <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "5rem var(--pad)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "4rem 3rem", background: BASE2, borderRadius: "16px", border: `1px solid ${LINE}` }}>
                <Image
                  src="/images/trmeric/logo-story/01.png"
                  alt="Trmeric brand vision v1.0, the concentric ring mark paired with the trmeric wordmark, first presentation"
                  width={1000}
                  height={563}
                  style={{ width: "100%", height: "auto", borderRadius: "8px" }}
                />
              </div>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".16em", textTransform: "uppercase", color: FAINT, marginTop: "1rem" }}>
                Version 1.0 · Brand vision · First complete presentation of mark + wordmark
              </p>
            </div>
          </div>

          {/* ── 02: The positioning ── text left, image right ── */}
          <div style={{ borderBottom: `1px solid ${LINE}`, background: BASE2 }}>
            <div className="mobile-stack" style={{ maxWidth: "1100px", margin: "0 auto", padding: "5rem var(--pad)", display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "5rem", alignItems: "center" }}>
              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: ".58rem", letterSpacing: ".2em", textTransform: "uppercase", color: ACC, marginBottom: "1.2rem", opacity: 0.8 }}>
                  Where it begins
                </div>
                <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "clamp(1.4rem, 2.5vw, 2rem)", letterSpacing: "-.02em", color: INK, lineHeight: 1.2, marginBottom: "1.2rem" }}>
                  trmeric, for those who want to ascend.
                </h3>
                <p style={{ ...s.body, marginBottom: "1rem" }}>
                  Before the mark could take form, the brand needed a position. Four values anchored it: Simply essential. Superpower approach. Do it with style. Uplifting experience. These four quadrants became the brief for everything that followed, including the geometry of the logo itself.
                </p>
                <p style={s.body}>
                  The five rings in the final mark are not decorative. Each one carries one of these values, plus a fifth: Unleash potential, the culmination of the other four.
                </p>
              </div>
              <div style={{ position: "relative", borderRadius: "12px", overflow: "hidden", border: `1px solid ${LINE}`, boxShadow: SHADOW }}>
                <Image
                  src="/images/trmeric/logo-story/02.png"
                  alt="Trmeric brand positioning diagram, four quadrants: Simply essential, Superpower approach, Do it with style, Uplifting experience, with trmeric at centre"
                  width={960}
                  height={540}
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              </div>
            </div>
          </div>

          {/* ── 03: The plant ── full-width ── */}
          <div style={{ borderBottom: `1px solid ${LINE}` }}>
            <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "5rem var(--pad)" }}>
              <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "5rem", alignItems: "center" }}>
                <div style={{ position: "relative", borderRadius: "12px", overflow: "hidden", border: `1px solid ${LINE}`, boxShadow: SHADOW }}>
                  <Image
                    src="/images/trmeric/logo-story/04.png"
                    alt="Actual turmeric rhizomes photographed, compounding effect and organic shape as core brand concepts"
                    width={960}
                    height={540}
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: ".58rem", letterSpacing: ".2em", textTransform: "uppercase", color: ACC, marginBottom: "1.2rem", opacity: 0.8 }}>
                    The source material
                  </div>
                  <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "clamp(1.4rem, 2.5vw, 2rem)", letterSpacing: "-.02em", color: INK, lineHeight: 1.2, marginBottom: "1.2rem" }}>
                    It started with an actual turmeric plant.
                  </h3>
                  <p style={{ ...s.body, marginBottom: "1rem" }}>
                    Two core concepts emerged from studying the plant directly. The first: the <strong style={{ color: INK, fontWeight: 600 }}>compounding effect</strong>, turmeric grows rhizome by rhizome, each new bulb branching from the last, representing growth and the spreading of influence. The second: <strong style={{ color: INK, fontWeight: 600 }}>organic shape</strong>, no two bulbs are the same. The form is natural, unpredictable, and alive.
                  </p>
                  <p style={s.body}>
                    These are not metaphors bolted onto a geometric logo after the fact. They are the literal source of the mark.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ── 04: The derivation process ── wide image with annotation ── */}
          <div style={{ borderBottom: `1px solid ${LINE}`, background: BASE2 }}>
            <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "5rem var(--pad)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: ".58rem", letterSpacing: ".2em", textTransform: "uppercase", color: ACC, marginBottom: ".8rem", opacity: 0.8 }}>
                The derivation
              </div>
              <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "clamp(1.4rem, 2.5vw, 2rem)", letterSpacing: "-.02em", color: INK, lineHeight: 1.2, marginBottom: ".8rem", maxWidth: "28ch" }}>
                18 cross-sections. 3 groups. 1 mark.
              </h3>
              <p style={{ ...s.body, marginBottom: "2.5rem", maxWidth: "60ch" }}>
                Three primary rhizomes were selected. Each was sliced into six cross-sections and photographed at scale. Each group of six was traced and averaged into a single ring form (a, b, c, d, e, f), then paired and superimposed (a+b = X, c+d = Y, e+f = Z) to find the best organic shape. The final outline emerged from X+Y+Z: not a circle, but something that came from real plant geometry.
              </p>
              <div style={{ position: "relative", borderRadius: "12px", overflow: "hidden", border: `1px solid ${LINE}`, boxShadow: SHADOW }}>
                <Image
                  src="/images/trmeric/logo-story/03.png"
                  alt="Logo derivation process, 18 turmeric cross-sections photographed, traced, grouped, averaged into ring forms X Y Z, then combined into the final mark"
                  width={1440}
                  height={810}
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              </div>
              <p style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".14em", textTransform: "uppercase", color: FAINT, marginTop: "1rem" }}>
                Primary rhizome · Cross sections 1–18 · Abstracted forms a–f · Combined to X, Y, Z · Final mark
              </p>
            </div>
          </div>

          {/* ── 05: Golden ratio ── side by side ── */}
          <div style={{ borderBottom: `1px solid ${LINE}` }}>
            <div className="mobile-stack" style={{ maxWidth: "1100px", margin: "0 auto", padding: "5rem var(--pad)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>
              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: ".58rem", letterSpacing: ".2em", textTransform: "uppercase", color: ACC, marginBottom: "1.2rem", opacity: 0.8 }}>
                  The mathematics
                </div>
                <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "clamp(1.4rem, 2.5vw, 2rem)", letterSpacing: "-.02em", color: INK, lineHeight: 1.2, marginBottom: "1.2rem" }}>
                  Every ring is governed by the golden ratio.
                </h3>
                <p style={{ ...s.body, marginBottom: "1rem" }}>
                  The outermost stroke of the mark is 12px. Each successive inner ring is sized by multiplying ×0.809, the reciprocal of the golden ratio (1/φ, expressed as sin 54°). Five rings, five strokes, each one mathematically smaller than the last.
                </p>
                <p style={s.body}>
                  This is not aesthetic decoration. It means the mark has the same proportional logic as a nautilus shell, a sunflower spiral, or the branching pattern of the very rhizome it depicts. The plant and the ratio share the same geometry.
                </p>
                {/* Color swatches */}
                <div style={{ display: "flex", gap: ".5rem", marginTop: "1.8rem", alignItems: "center" }}>
                  {["#FFA426","#FF981C","#FF8C13","#FF7F0A","#FF7300"].map((c) => (
                    <div key={c} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: ".4rem" }}>
                      <div style={{ width: 32, height: 32, borderRadius: "50%", background: c }} />
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: ".4rem", letterSpacing: ".08em", color: FAINT }}>{c.slice(1)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ position: "relative", borderRadius: "12px", overflow: "hidden", border: `1px solid ${LINE}`, boxShadow: SHADOW }}>
                <Image
                  src="/images/trmeric/logo-story/05.png"
                  alt="Golden ratio applied to the Trmeric mark, construction diagram showing how a = 1.618, b = 1, and the spiral derived from them governs each ring stroke"
                  width={960}
                  height={540}
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              </div>
            </div>
          </div>

          {/* ── 06: Five rings meaning ── full-width editorial ── */}
          <div style={{ borderBottom: `1px solid ${LINE}`, background: BASE2 }}>
            <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "5rem var(--pad)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: ".58rem", letterSpacing: ".2em", textTransform: "uppercase", color: ACC, marginBottom: ".8rem", opacity: 0.8 }}>
                The meaning
              </div>
              <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "clamp(1.4rem, 2.5vw, 2rem)", letterSpacing: "-.02em", color: INK, lineHeight: 1.2, marginBottom: ".8rem", maxWidth: "24ch" }}>
                Five rings. Five brand promises.
              </h3>
              <p style={{ ...s.body, marginBottom: "2.5rem", maxWidth: "56ch" }}>
                The five rings within the mark are not concentric for aesthetic reasons. Each ring represents a pillar of what trmeric delivers, and they grow outward the same way trmeric's value compounds in an enterprise: starting small and essential, expanding to something that truly unleashes potential.
              </p>
              <div style={{ position: "relative", borderRadius: "12px", overflow: "hidden", border: `1px solid ${LINE}`, boxShadow: SHADOW }}>
                <Image
                  src="/images/trmeric/logo-story/06.png"
                  alt="The Five Rings: A Roadmap to Success, five circles of increasing size, each labelled: Simple & Essential, Superpower approach, Do it with style, Uplifting experience, Unleash Potential"
                  width={1440}
                  height={810}
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              </div>
            </div>
          </div>

          {/* ── 07: Color system ── ── */}
          <div style={{ borderBottom: `1px solid ${LINE}` }}>
            <div className="mobile-stack" style={{ maxWidth: "1100px", margin: "0 auto", padding: "5rem var(--pad)", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "5rem", alignItems: "center" }}>
              <div style={{ position: "relative", borderRadius: "12px", overflow: "hidden", border: `1px solid ${LINE}`, boxShadow: SHADOW }}>
                <Image
                  src="/images/trmeric/logo-story/07.png"
                  alt="Trmeric mark with color system, five rings in five amber-to-orange hues (FFA426, FF981C, FF8C13, FF7F0A, FF7300), each stroke width governed by the golden ratio"
                  width={960}
                  height={540}
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: ".58rem", letterSpacing: ".2em", textTransform: "uppercase", color: ACC, marginBottom: "1.2rem", opacity: 0.8 }}>
                  Colour and proportion, one ratio
                </div>
                <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "clamp(1.4rem, 2.5vw, 2rem)", letterSpacing: "-.02em", color: INK, lineHeight: 1.2, marginBottom: "1.2rem" }}>
                  The turmeric gradient. Five steps, one journey.
                </h3>
                <p style={{ ...s.body, marginBottom: "1rem" }}>
                  The five ring colors step from warm amber (#FFA426) to deep burnt orange (#FF7300), the exact gradient inside a freshly cut turmeric rhizome. Outer ring lightest, innermost most saturated, the deeper you go, the more concentrated the colour.
                </p>
                <p style={s.body}>
                  The right-hand diagram is the calculation behind it: the stroke thickness steps inward by the same ratio as the colour. 12px outer, divided by 0.809 (half the golden ratio, a = 1.618) at each ring, down to 4.99px innermost. One number, expressed twice, once in hue and once in thickness, not eyeballed to "look about right."
                </p>
              </div>
            </div>
          </div>

          {/* ── 08 + 09: Final lockup and colorways — the destination ── */}
          <div style={{ borderBottom: `1px solid ${LINE}`, background: BASE2 }}>
            <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "5rem var(--pad)" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: ".58rem", letterSpacing: ".2em", textTransform: "uppercase", color: ACC, marginBottom: ".8rem", opacity: 0.8 }}>
                The final form
              </div>
              <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "clamp(1.4rem, 2.5vw, 2rem)", letterSpacing: "-.02em", color: INK, lineHeight: 1.2, marginBottom: ".8rem", maxWidth: "24ch" }}>
                Simple shapes. All contexts.
              </h3>
              <p style={{ ...s.body, marginBottom: "2.5rem", maxWidth: "56ch" }}>
                The logo is constructed from simple shapes so it maintains legibility at every size. Minimum height: 32px. The horizontal lockup is the default. On dark backgrounds the mark renders in amber. On amber backgrounds it reverses to white. The mark was designed to work in all three without modification, because a brand that only works on white backgrounds has not been properly finished.
              </p>
              <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div style={{ position: "relative", borderRadius: "12px", overflow: "hidden", border: `1px solid ${LINE}`, boxShadow: SHADOW }}>
                  <Image
                    src="/images/trmeric/logo-story/08.png"
                    alt="Logo horizontal lockup with clearspace rules, minimum size 32px height, construction based on simple geometric shapes"
                    width={960}
                    height={540}
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                  <div style={{ padding: ".6rem 1rem", borderTop: `1px solid ${LINE}`, fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".12em", textTransform: "uppercase", color: FAINT, background: BASE }}>
                    Horizontal lockup · Clearspace rules · Minimum 32px
                  </div>
                </div>
                <div style={{ position: "relative", borderRadius: "12px", overflow: "hidden", border: `1px solid ${LINE}`, boxShadow: SHADOW }}>
                  <Image
                    src="/images/trmeric/logo-story/09.png"
                    alt="Logo colorways, primary on white, reversed on dark background, reversed on amber background"
                    width={960}
                    height={540}
                    style={{ width: "100%", height: "auto", display: "block" }}
                  />
                  <div style={{ padding: ".6rem 1rem", borderTop: `1px solid ${LINE}`, fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".12em", textTransform: "uppercase", color: FAINT, background: BASE }}>
                    Three colorways · Primary / Reversed dark / Reversed amber
                  </div>
                </div>
              </div>
            </div>
          </div>

        </section>

        {/* ═══════════════ 10 · REFLECTION ═══════════════ */}
        <section style={{ padding: "7rem var(--pad)", borderTop: `1px solid ${LINE}`, textAlign: "center" }}>
          <div style={{ maxWidth: "580px", margin: "0 auto" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: ".62rem", letterSpacing: ".2em", textTransform: "uppercase", color: ACCD, display: "block", marginBottom: "1.2rem" }}>On the work</span>
            <blockquote style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "clamp(1.15rem, 2.5vw, 1.6rem)", lineHeight: 1.3, letterSpacing: "-.015em", color: INK, margin: "0 0 .8rem" }}>
              "Prototypes are the spec. Engineering builds from them directly. That is the intended workflow, not an accident."
            </blockquote>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".16em", textTransform: "uppercase", color: FAINT }}>Aravind J · Trmeric · 2025–present</p>
          </div>
        </section>

        {/* ═══════════════ 10 · CTA ═══════════════ */}
        <section style={{ padding: "5rem var(--pad) 6rem", borderTop: `1px solid ${LINE}`, background: BASE2, textAlign: "center" }}>
          <span style={s.kicker}>Explore further</span>
          <p style={{ fontSize: ".9375rem", color: DIM, maxWidth: "38ch", margin: ".6rem auto 2rem", lineHeight: 1.65 }}>Five deep-dive case studies. Five live prototypes. One design system.</p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/work/trmeric/demand-owner-flow" style={{ fontFamily: "var(--font-mono)", fontSize: ".68rem", letterSpacing: ".18em", textTransform: "uppercase", color: BASE, background: ACC, borderRadius: "4px", padding: ".8rem 1.8rem", display: "inline-block" }}>Demand Owner Flow →</Link>
            <Link href="/work" style={{ fontFamily: "var(--font-mono)", fontSize: ".65rem", letterSpacing: ".16em", textTransform: "uppercase", color: ACCD, border: `1px solid ${LINA}`, borderRadius: "4px", padding: ".8rem 1.4rem", display: "inline-block" }}>← Back to work</Link>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
