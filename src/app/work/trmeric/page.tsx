import Image from "next/image";
import Link from "next/link";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import WordReveal from "@/components/ui/WordReveal";
import PlotInLines from "@/components/ui/PlotInLines";
import Reveal from "@/components/ui/Reveal";
import WarpLink from "@/components/ui/WarpLink";
import NextProject from "@/components/ui/NextProject";
import Shot from "@/components/trmeric/Shot";
import PrototypeFrame, { type TrmColors } from "@/components/trmeric/PrototypeFrame";
import RagDemo from "@/components/trmeric/RagDemo";
import SignalsMiniGraph from "@/components/trmeric/SignalsMiniGraph";
import IterationStrip from "@/components/trmeric/IterationStrip";
import { type RailFeature } from "@/components/trmeric/PhaseRail";
import SurfaceGallery from "@/components/trmeric/SurfaceGallery";
import TrmericTheme from "@/components/trmeric/TrmericTheme";
import ChapterSeam from "@/components/trmeric/ChapterSeam";
import CountUp from "@/components/trmeric/CountUp";
import PhaseCard from "@/components/trmeric/PhaseCard";
import PhaseLabelText from "@/components/trmeric/PhaseLabelText";
import TrmericPhaseRailNav from "@/components/trmeric/TrmericPhaseRailNav";
import { PHASE_META } from "@/components/trmeric/trmericPhaseMeta";
import { projectsBySlug } from "@/data/projects";

const project = projectsBySlug["trmeric"];

/* ── Accent is the same in dark + light — the rest read from the CSS
   custom properties TrmericTheme (a client component) sets from
   useColorScheme(), so this whole page can be a server component. Values
   are byte-identical to what used to be computed inline per render. ── */
const ACC  = "#FFA426";
const ACCB = "#FFB84D";
const LINA = "rgba(255,164,38,.26)";
const BASE  = "var(--trm-base)";
const BASE2 = "var(--trm-base2)";
const INK   = "var(--trm-ink)";
const DIM   = "var(--trm-dim)";
const FAINT = "var(--trm-faint)";
const ACCD  = "var(--trm-accd)";
const LINE  = "var(--trm-line)";
const SHADOW = "var(--trm-shadow)";

const C: TrmColors = { base: BASE, base2: BASE2, ink: INK, dim: DIM, faint: FAINT, line: LINE, acc: ACC, accd: ACCD };

/* ── Feature deep-dives ── */
interface FeatureDecision { decision: string; reasoning: string; }
interface Feature {
  num: string;
  slug: string;
  phase: string;
  railTitle: string;
  title: string;
  oneLiner: string;
  stat: { value: string; label: string };
  img: string;
  imgAlt: string;
  imgRatio: string;
  body: string;
  decisions: FeatureDecision[];
  theory: string;
  theoryRef: string;
  protoSrc?: string;
  protoPoster?: string;
  protoHints?: string[];
}

const FEATURES: Feature[] = [
  {
    num: "01",
    slug: "demand-owner-flow",
    phase: "A",
    railTitle: "Demand Owner Flow",
    title: "Demand Owner Flow",
    oneLiner: "From a blank demand idea to a scoped, resourced, Tango-validated initiative.",
    stat: { value: "99.8%", label: "time-to-scope cut · 8 weeks → 10 min" },
    img: "/images/trmeric/canvas.png",
    imgAlt: "Trmeric Demand Canvas, the structured intake surface where a demand moves from idea to scoped initiative",
    imgRatio: "16/10",
    body: "The original onboarding dropped users onto a blank Tango screen with no context. First sessions showed users typing questions like 'what do I do here?', a blank state problem. The redesign introduced a storyboard-first approach: Tango opens with context about the user's role, surfaces the top three demand types relevant to them, and creates a pre-filled structure before the user has typed a word. The design question became: how do we make the first action feel like insight, not instruction?",
    decisions: [
      { decision: "Insight before action", reasoning: "Tango shows what it already knows about the context before asking the user to fill anything in. This shifts the first interaction from 'answer these questions' to 'is this right?', a much lower cognitive load entry point." },
      { decision: "4-line card structure", reasoning: "Every demand card carries four lines: Title, Milestone, Action, Tango input. Items that need no attention are muted gray; items requiring action are darker. The user scans the third line first. This was a deliberate attention signal system, not aesthetic choice." },
      { decision: "Tango as guide, not gatekeeper", reasoning: "Tango pre-fills the canvas with its best interpretation. The user corrects, not creates. This follows the Piaget principle of scaffolding: provide the structure, let the expert refine it. Early testing showed 81% acceptance of Tango's pre-filled scoping." },
    ],
    theory: "Progressive disclosure (Nielsen): reveal complexity only as needed. The create-demand overlay follows a conversational arc, not a form. Mental model alignment: users don't think in fields, they think in narratives. Tango speaks narrative first.",
    theoryRef: "Nielsen (1994) · Piaget scaffolding theory · Conversational UI design",
    protoSrc: "/prototypes/trmeric/demand-flow-all-in-one.html",
    protoPoster: "/images/trmeric/allinone.png",
    protoHints: ["Start on the demand grid. Scan the third line of each card to find what needs action", "Click any demand row to expand it in place and see the full canvas", "Hit 'Ask Tango' to see the pre-flight conversation that scopes a demand in under 90 seconds"],
  },
  {
    num: "02",
    slug: "portfolio-monitor",
    phase: "B",
    railTitle: "Portfolio Monitor",
    title: "Portfolio Monitor",
    oneLiner: "Multi-portfolio force graph with persona-contextual views for CIOs, Portfolio Leaders, and Resource Managers.",
    stat: { value: "36", label: "iterations · v13 → v36" },
    img: "/images/trmeric/portfolio-monitor.png",
    imgAlt: "Trmeric Portfolio Monitor v36, the force-graph multi-portfolio view with persona-contextual category system",
    imgRatio: "16/10",
    body: "The Portfolio Monitor went through 36 iterations (v13 to v36). Every version that added more features was rejected. The v36 that shipped had fewer visible controls than v13, but each control carried more context. The breakthrough came from a single directive from Siddharth: 'less is more.' Not less data. Less interface. The challenge was showing the full portfolio across all lifecycle phases to three completely different personas (Portfolio Leader, CIO, Resource Manager) using one unified surface that adapts rather than fragmenting into separate dashboards.",
    decisions: [
      { decision: "One control bar, three rows removed", reasoning: "v13 had three rows of filters, sorts, and view toggles. Each row added one capability but increased the perceived complexity of the page. Consolidating into a single dock-style control bar with icon pills reduced visual weight by 60% while preserving all functionality." },
      { decision: "Dashboard mode vs Action mode", reasoning: "From a June 2026 UX sync: 'You are either in dashboard mode or in action mode.' The dual-mode approach lets users toggle between viewing portfolio health and acting on it from the same surface, avoiding the context switch of navigating to a separate 'actions' page." },
      { decision: "Dynamic portfolio headers", reasoning: "The portfolio header changes based on the active persona. A CIO sees portfolio-level value metrics. A Resource Manager sees capacity and utilisation. A Portfolio Leader sees initiative status. Same data, different emphasis, always sourced from the same underlying graph." },
    ],
    theory: "Miller's Law (7±2 items in working memory) drove the control consolidation. Persona-contextual design: one surface, multiple lenses. The force-graph representation draws on network theory: clustering reveals relationships that a table cannot.",
    theoryRef: "Miller (1956) · Information scent theory · Force-directed graph (Fruchterman & Reingold)",
    protoSrc: "/prototypes/trmeric/portfolio-monitor.html",
    protoPoster: "/images/trmeric/portfolio-monitor.png",
    protoHints: ["Use the category pills in the control bar to filter by lifecycle phase", "Switch persona (top right). The page reorganises for CIO vs Portfolio Leader vs Resource Manager", "Hover any node in the force graph to see which initiatives are connected"],
  },
  {
    num: "03",
    slug: "project-manager",
    phase: "C",
    railTitle: "PM + RAID",
    title: "Project Manager + RAID",
    oneLiner: "Project status and execution management built on one principle: Up-level is the only path forward.",
    stat: { value: "87%", label: "task completion · vs 23% baseline" },
    img: "/images/trmeric/raid-workspace.png",
    imgAlt: "Trmeric Project Manager workspace, showing Scope, Schedule, and Spend health, the Execution Board, and the RAID tab with overdue, in-progress, and to-do items",
    imgRatio: "16/9",
    body: "The Project Manager is built around a single idea: the only action that matters is moving a project forward. Every element on the page either shows the current state clearly or enables the next stage advance. The RAG severity system (Red/Amber/Green) is implemented not just as color but as animation: a green project is calm, an amber project subtly pulses, a red project vibrates. This means severity is perceptible in peripheral vision without reading any text. The RAID module (Risks, Assumptions, Issues, Dependencies) lives alongside the project status as a peer surface, not an afterthought.",
    decisions: [
      { decision: "RAG as animation, not just color", reasoning: "Color alone fails for colorblind users and is invisible at a glance when scanning many projects simultaneously. The sparkle icons animate differently by severity: green glows softly, amber pulses, red vibrates. Attention is drawn physically to what needs it, before the user has consciously focused." },
      { decision: "Up-level as the only update entry point", reasoning: "Earlier versions had inline editing, a status bar, and multiple update flows. Each created inconsistency in the data and confusion about what 'updating' meant. Collapsing all updates into one modal, the Up-level dialog, created a single truth point and removed ambiguity about where to go to change anything." },
      { decision: "Muted hierarchy for attention signals", reasoning: "Items on track have light, muted text. Items needing action have darker, heavier weight. This is a deliberate reversal of typical UI defaults (where everything is equally visible). The user's eye moves to the darker elements automatically, no badge counts needed." },
    ],
    theory: "Exception-based management: only show what deviates from plan. Attention economics (Davenport & Beck): the scarcest resource in enterprise software is not information but attention. Animation-as-severity borrows from auditory design: a sound that gets louder is a warning, regardless of pitch.",
    theoryRef: "Davenport & Beck (2001) · ISO 9241 attention principles · RAG status management",
    protoSrc: "/prototypes/trmeric/project-manager.html",
    protoPoster: "/images/trmeric/project-manager.png",
    protoHints: ["Notice the sparkle icon colours on each project row. Green is calm, amber pulses, red vibrates", "Click 'Up-level' on any project to open the single update modal. This is the only way to change status", "Open the RAID tab to see how risks, assumptions, issues, and dependencies are tracked alongside the project"],
  },
  {
    num: "04",
    slug: "trucible",
    phase: "C",
    railTitle: "Trucible",
    title: "Trucible · Knowledge OS",
    oneLiner: "Wiki and Explorer modes for an enterprise context management system. Not a document store.",
    stat: { value: "23", label: "surfaces feed one context engine" },
    img: "/images/trmeric/trucible.png",
    imgAlt: "Trucible, dual-mode enterprise knowledge OS showing Wiki and Explorer views with qualitative context strength tiers",
    imgRatio: "16/10",
    body: "The brief from Siddharth: 'Trucible is a context management system, not a document management system.' That single sentence changed the entire design direction. A document store is a filing cabinet: you put things in and retrieve them. A context engine actively understands what matters and makes that knowledge available to Tango across every surface. The visual language had to reflect this: Trucible doesn't show folders and files, it shows relationships and understanding depth. The context strength tiers replaced a percentage score (67% complete) with a living metaphor (Seedling to Warming Up to Deep Root).",
    decisions: [
      { decision: "Context tiers over percentage scores", reasoning: "A '67% complete' score creates anxiety about the missing 33% without indicating what matters. 'Warming Up' tells you the context is actively growing and usable. 'Deep Root' tells you Tango can draw on this confidently. The metaphors come from plant biology, the same language as the Trmeric brand. This was not decoration; it was alignment." },
      { decision: "Dual mode: Wiki vs Explorer", reasoning: "Wiki mode shows Tango-generated articles, structured, readable, sourced. Explorer mode shows the knowledge as a force-directed graph, folder tree, or list. The switch between modes is the same context, different lens. A knowledge worker reading to understand uses Wiki. A knowledge worker searching for something specific uses Explorer. Both are valid entry points." },
      { decision: "Trucible Trivia as preview panel", reasoning: "Before a user commits to reading a full article, a preview panel surfaces the three most relevant facts from that context. This is borrowed from search engine result snippets, the preview earns the click. In enterprise context, time is the scarcest resource." },
    ],
    theory: "Nonaka & Takeuchi knowledge spiral (1995): tacit-to-explicit knowledge conversion. Trucible makes organizational tacit knowledge (what people know but haven't written) explicit and searchable via Tango. Information architecture: card-based progressive disclosure. The dual mode mirrors Nielsen's 'search vs browse' dichotomy.",
    theoryRef: "Nonaka & Takeuchi (1995) · Nielsen (1997) search vs browse · PKM theory",
    protoSrc: "/prototypes/trmeric/trucible.html",
    protoPoster: "/images/trmeric/trucible.png",
    protoHints: ["Switch between Wiki mode and Explorer mode using the toggle at the top", "Notice the context strength tiers. 'Deep Root' means Tango can draw on this confidently; 'Seedling' means it's still growing", "Click any source to see the connected status dot. Live sources glow green"],
  },
  {
    num: "05",
    slug: "signals",
    phase: "C",
    railTitle: "Signals",
    title: "Signals · D3 Force Graph",
    oneLiner: "An Obsidian-style force-directed signal map for early-warning detection across a project portfolio.",
    stat: { value: "90", label: "signals on one living map" },
    img: "/images/trmeric/signals-graph.png",
    imgAlt: "Trmeric Signals, D3 physics force graph clustered by project, with severity-coded bubbles and the Tango Agent signal briefing panel",
    imgRatio: "16/9",
    body: "Signals began as a question: what if you could see all the early warnings in a portfolio at once, not as a table of flags but as a landscape of risk? The D3 force-directed simulation with 79 nodes creates natural clusters that reveal structural risk patterns: a cluster of red nodes means a systemic problem, not isolated issues. The interaction model evolved significantly: the original 'click to bloom' interaction expanded nodes on click, which lost context. The new 'hover to highlight' interaction draws the neighbour graph around any node you focus on, so you always know where you are in the full map.",
    decisions: [
      { decision: "Hover-to-highlight vs click-to-bloom", reasoning: "Click-to-bloom: you click a node and its connections expand outward. Problem: you lose the position of that node in the overall map. Hover-to-highlight: the node you hover shows its neighbour graph, dimming everything else. The full map stays visible. Borrowed directly from Obsidian's graph view, the pattern already existed and users intuitively knew it." },
      { decision: "Severity as physics, not color alone", reasoning: "High-severity nodes have higher 'weight' in the force simulation, so they attract more connections and cluster toward the center. This means the most critical risks are structurally visible (center-dense) before the user has read any labels. The severity color still exists, but the physics reinforces it spatially." },
      { decision: "PM flow integration via iframe", reasoning: "Signals is not a standalone tool. It lives beside the Project Manager. A signal click surfaces the relevant project card inline, so the user can act on the risk directly from the map without leaving the visualization context. The transition from map to action is zero-navigation." },
    ],
    theory: "Network theory (Barabási, 2002): scale-free networks have hubs that, if disrupted, cause cascading failures. Signals visualises the same structure in a project portfolio: the most-connected risks are the highest-priority. The force simulation uses Fruchterman-Reingold to produce natural layouts that humans can learn to read without training.",
    theoryRef: "Barabási (2002) · Fruchterman & Reingold (1991) · Obsidian graph UX",
    protoSrc: "/prototypes/trmeric/pm-signals.html",
    protoPoster: "/images/trmeric/pm-signals.png",
    protoHints: ["Hover any node. The neighbour graph highlights around it while the rest dims", "Look at where clusters form naturally. Dense clusters reveal systemic risk, not isolated issues", "Click a node to surface the related project card inline, without leaving the map"],
  },
];

const RAIL_FEATURES: RailFeature[] = FEATURES.map((f) => ({
  id: f.slug,
  num: f.num,
  title: f.railTitle,
  phase: f.phase,
}));

/* Which headline metric proves itself in which deep dive */
const METRIC_ANCHORS: Record<string, string> = {
  "Time-to-scope reduction": "#demand-owner-flow",
  "Task completion (vs 23% baseline)": "#project-manager",
  "Tango AI acceptance rate": "#demand-owner-flow",
};

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

export default function TrmericPage() {
  return (
    /* <main> itself no longer paints ground colour — it used to (opaque
       BASE across 100% of the page), which fully occluded the persistent
       dust field everywhere, not just during warp transitions. Each
       section below now paints its OWN opaque background where it needs
       one; the hero and the three ChapterSeam bands (the problem framing,
       the outcomes/metrics, the closing reflection) deliberately paint
       none, so the amber trmeric lattice shows through in those bands.
       html[data-warp] still fades header/main/footer during warp dives —
       that guarantee is unaffected by where the opaque paint lives. */
    <TrmericTheme>
      <Navigation />

      <main id="main-content">

        {/* ═══════════════ 01 · HERO — transparent, dust shows through ═══ */}
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
                  Enterprise SaaS · AI Design · Founding Team · 2024–present
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
                {[["ROLE","Senior Product Designer"],["TEAM","Siddharth Bohra (CEO) · Roshan PR (Eng)"],["CLIENTS","Talvera · Aquenta · Meridian · Veltrix"],["TIMELINE","2024 – present"]].map(([l,v]) => (
                  <div key={l}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".2em", textTransform: "uppercase", color: FAINT, display: "block", marginBottom: ".3rem" }}>{l}</span>
                    <span style={{ fontSize: ".8rem", color: DIM, lineHeight: 1.5 }}>{v}</span>
                  </div>
                ))}
              </div>
            </PlotInLines>
          </div>

          <PlotInLines delay={120}>
            <Shot
              src="/images/trmeric/grid.png"
              alt="Trmeric My Hub, the main demand grid"
              ratio="16/10"
              radius={16}
              border={`1px solid ${LINE}`}
              shadow="0 24px 60px -20px rgba(23,21,15,.18)"
              accent={ACC}
              priority
              sizes="(max-width: 900px) 100vw, 45vw"
            />
          </PlotInLines>
        </section>

        {/* ═══════════════ 02 · LOGLINE — chapter seam: the problem ═══════
            Sparse, cool-toned band — the dust field shows through raw,
            unwarmed, while the copy names the failure mode. Continues
            straight out of the transparent hero above (fadeTop:
            "transparent"), then fades to opaque BASE before CONTEXT. ═══ */}
        <ChapterSeam tone="cool" fadeTop="transparent" fadeBottom={BASE} minHeight="52vh">
          <div style={{ maxWidth: "880px", margin: "0 auto", padding: "0 var(--pad)" }}>
            <Reveal as="span" style={{ ...s.kicker, marginBottom: ".6rem" }}>The problem</Reveal>
            <WordReveal as="p" delay={0} stagger={55} style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "clamp(1.5rem, 3vw, 2.4rem)", lineHeight: 1.15, letterSpacing: "-.02em", color: INK, maxWidth: "34ch" }}>
              Enterprise demand doesn't fail at the idea. It fails between the idea and the decision.
            </WordReveal>
          </div>
        </ChapterSeam>

        {/* ═══════════════ 03 · CONTEXT ═══════════════ */}
        <section style={{ padding: "6rem var(--pad)", background: BASE }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <Reveal as="span" style={s.kicker}>What Trmeric is</Reveal>
            <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start" }}>
              <Reveal>
                <h2 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "clamp(1.6rem, 3vw, 2.4rem)", lineHeight: 1.12, letterSpacing: "-.02em", color: INK, marginBottom: "1.4rem" }}>
                  An AI-native B2B SaaS for{" "}<em style={{ fontStyle: "italic", color: ACC }}>demand management, resource management, and portfolio value.</em>
                </h2>
                <p style={{ ...s.body, marginBottom: "1rem" }}>Enterprises decide what to build, who builds it, and whether it delivered value, currently across emails, spreadsheets, and quarterly reviews that arrive too late to change anything.</p>
                <p style={s.body}>Trmeric introduces structured demand intake, Tango (an AI agent that scopes a demand in 90 seconds instead of 3 months), and portfolio-level value tracking that closes the loop from idea to outcome.</p>
              </Reveal>
              <Reveal stagger delay={0.1} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ padding: "1.4rem 1.6rem", border: `1px solid ${LINE}`, borderRadius: "12px", background: BASE2 }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".18em", textTransform: "uppercase", color: FAINT, marginBottom: ".6rem" }}>Before Trmeric</div>
                  <p style={{ fontSize: ".875rem", color: DIM, lineHeight: 1.6 }}>Demand requests arrive as emails, get lost in spreadsheets, and have no lifecycle visibility. No structured intake. No AI scoping. No portfolio-level value tracking.</p>
                </div>
                <div style={{ padding: "1.4rem 1.6rem", border: `1px solid ${LINA}`, borderRadius: "12px", background: "rgba(255,164,38,.09)" }}>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".18em", textTransform: "uppercase", color: ACC, marginBottom: ".6rem" }}>With Trmeric</div>
                  <p style={{ fontSize: ".875rem", color: DIM, lineHeight: 1.6 }}>Intake → AI scoping → resource planning → execution → portfolio value. One continuous workflow across all personas with Tango surfacing the right context for each.</p>
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".12em", color: ACCD, fontStyle: "italic", paddingLeft: ".4rem" }}>One rule: prototypes are the spec. Engineering builds from them directly.</div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ═══════════════ 04 · LIFECYCLE ═══════════════ */}
        <section style={{ padding: "5rem var(--pad)", borderTop: `1px solid ${LINE}`, background: BASE2 }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <Reveal as="span" style={s.kicker}>Four lifecycle phases · 23 surfaces</Reveal>
            <Reveal as="p" style={{ ...s.body, marginBottom: "2.5rem", marginTop: ".5rem" }}>Every surface answers one question. The lifecycle is the spine; every feature is a response to a specific failure mode in how enterprises manage work. Each phase links to the work below.</Reveal>
            <Reveal className="mobile-stack" stagger style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", border: `1px solid ${LINE}`, borderRadius: "14px", overflow: "hidden" }}>
              {PHASE_META.map((p) => (
                <PhaseCard key={p.letter} {...p} />
              ))}
            </Reveal>
          </div>
        </section>

        {/* ═══════════════ 05 · METRICS — chapter seam: outcomes ══════════
            Warm, dense band — the lattice pinned explicit and dense while
            every headline number counts up from 0. Fades from/to the
            BASE2 either side (Lifecycle above, Surface Gallery below). ═══ */}
        <ChapterSeam tone="warm" fadeTop={BASE2} fadeBottom={BASE2} minHeight="56vh">
          <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 var(--pad)" }}>
            <Reveal as="span" style={{ ...s.kicker, marginBottom: "1.5rem" }}>Outcomes, measured not claimed</Reveal>
            <Reveal className="mobile-stack" stagger style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", borderTop: `1px solid ${LINE}`, borderLeft: `1px solid ${LINE}` }}>
              {(project.metrics ?? []).map(({ value, label }) => {
                const anchor = METRIC_ANCHORS[label];
                const inner = (
                  <>
                    <CountUp value={value} style={{ display: "block", fontFamily: "var(--font-body)", fontWeight: 800, fontSize: "2.4rem", letterSpacing: "-.04em", color: ACC, lineHeight: 1, fontVariantNumeric: "tabular-nums", marginBottom: ".5rem" }} />
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: ".58rem", letterSpacing: ".14em", textTransform: "uppercase", color: FAINT }}>{label}</div>
                    {anchor && (
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: ".5rem", letterSpacing: ".14em", textTransform: "uppercase", color: ACCD, marginTop: ".6rem" }}>See how ↓</div>
                    )}
                  </>
                );
                const cellStyle: React.CSSProperties = { padding: "2rem 1.6rem", borderRight: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}`, textDecoration: "none", display: "block", height: "100%" };
                return anchor
                  ? <a key={label} href={anchor} style={cellStyle}>{inner}</a>
                  : <div key={label} style={cellStyle}>{inner}</div>;
              })}
            </Reveal>
          </div>
        </ChapterSeam>

        {/* ═══════════════ 06 · SURFACE GALLERY ═══════════════ */}
        <section id="surfaces" style={{ padding: "5rem var(--pad)", borderTop: `1px solid ${LINE}`, background: BASE2, scrollMarginTop: "4rem" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <Reveal as="span" style={s.kicker}>The surface archive · 12 of 23</Reveal>
            <Reveal as="p" style={{ ...s.body, marginBottom: "2.5rem", marginTop: ".4rem" }}>
              Every screen is a production-grade prototype, and every tile below is real: click a shot to view it full-size, or open the live prototype it was built as.
            </Reveal>
            <Reveal>
              <SurfaceGallery colors={C} />
            </Reveal>
          </div>
        </section>

        {/* ═══════════════ 07 · FEATURE DEEP-DIVES ═══════════════ */}
        <section id="deep-dives" style={{ borderTop: `1px solid ${LINE}`, background: BASE }}>
          <TrmericPhaseRailNav
            features={RAIL_FEATURES}
            watchId="deep-dives"
            colors={C}
          />
          <div style={{ padding: "5rem var(--pad) 2rem", maxWidth: "1100px", margin: "0 auto" }}>
            <Reveal>
              <span style={s.kicker}>Feature deep-dives</span>
              <h2 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "clamp(1.6rem, 3vw, 2.4rem)", letterSpacing: "-.02em", color: INK, maxWidth: "28ch", lineHeight: 1.15 }}>
                Five deep dives. The thought process behind each one.
              </h2>
            </Reveal>
          </div>

          {FEATURES.map((f, fi) => (
            <div
              key={f.slug}
              id={f.slug}
              style={{ borderTop: `1px solid ${LINE}`, background: fi % 2 === 1 ? BASE2 : BASE, scrollMarginTop: "3.5rem" }}
            >
              <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "5rem var(--pad)" }}>

                {/* Number + title + headline stat row */}
                <Reveal className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: "1.5rem", alignItems: "end", marginBottom: "2.5rem" }}>
                  <div style={{ display: "flex", alignItems: "baseline", gap: "1.2rem" }}>
                    <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "3rem", color: ACC, lineHeight: 1, opacity: 0.5 }}>{f.num}</span>
                    <div>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".2em", textTransform: "uppercase", color: ACCD, marginBottom: ".4rem" }}>
                        Phase {f.phase} · <PhaseLabelText letter={f.phase} />
                      </div>
                      <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "clamp(1.3rem, 2.5vw, 2rem)", letterSpacing: "-.02em", color: INK, marginBottom: ".3rem" }}>{f.title}</h3>
                      <p style={{ fontFamily: "var(--font-body)", fontStyle: "italic", fontSize: ".9375rem", color: ACCD }}>{f.oneLiner}</p>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <CountUp value={f.stat.value} style={{ display: "block", fontFamily: "var(--font-body)", fontWeight: 800, fontSize: "2.6rem", letterSpacing: "-.04em", color: ACC, lineHeight: 1, fontVariantNumeric: "tabular-nums" }} />
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".14em", textTransform: "uppercase", color: FAINT, marginTop: ".4rem", maxWidth: "22ch" }}>{f.stat.label}</div>
                  </div>
                </Reveal>

                {/* Hero visual: the iteration story for Portfolio Monitor, a true-ratio shot for the rest */}
                {f.slug === "portfolio-monitor" ? (
                  <Reveal style={{ marginBottom: "3rem" }}>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".2em", textTransform: "uppercase", color: FAINT, marginBottom: "1.4rem" }}>
                      The iteration record, shown not narrated
                    </div>
                    <IterationStrip colors={C} />
                  </Reveal>
                ) : (
                  <Reveal style={{ marginBottom: "3rem" }}>
                    <Shot
                      src={f.img}
                      alt={f.imgAlt}
                      ratio={f.imgRatio}
                      border={`1px solid ${LINE}`}
                      shadow={SHADOW}
                      accent={ACC}
                    />
                  </Reveal>
                )}

                {/* Body copy + decisions in 2-col */}
                <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "start", marginBottom: "2.5rem" }}>
                  <Reveal>
                    <div style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".2em", textTransform: "uppercase", color: FAINT, marginBottom: ".8rem" }}>Thought process</div>
                    <p style={{ fontSize: ".9375rem", color: DIM, lineHeight: 1.78, marginBottom: "1.4rem" }}>{f.body}</p>
                    {/* Theory reference */}
                    <div style={{ padding: "1rem 1.2rem", background: fi % 2 === 0 ? BASE2 : BASE, border: `1px solid ${LINE}`, borderRadius: "10px" }}>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: ".5rem", letterSpacing: ".18em", textTransform: "uppercase", color: ACC, marginBottom: ".4rem" }}>Theory grounding</div>
                      <p style={{ fontSize: ".8125rem", color: DIM, lineHeight: 1.65, marginBottom: ".5rem" }}>{f.theory}</p>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: ".5rem", letterSpacing: ".14em", color: FAINT }}>{f.theoryRef}</div>
                    </div>
                  </Reveal>

                  <div>
                    <Reveal style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".2em", textTransform: "uppercase", color: FAINT, marginBottom: ".8rem" }}>Key design decisions</Reveal>
                    <Reveal stagger delay={0.1} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                      {f.decisions.map(({ decision, reasoning }) => (
                        <div key={decision} style={{ padding: "1.1rem 1.3rem", border: `1px solid ${LINE}`, borderRadius: "10px", background: fi % 2 === 0 ? BASE2 : BASE }}>
                          <div style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: ".875rem", color: INK, marginBottom: ".4rem" }}>{decision}</div>
                          <p style={{ fontSize: ".8125rem", color: DIM, lineHeight: 1.65 }}>{reasoning}</p>
                        </div>
                      ))}
                    </Reveal>
                  </div>
                </div>

                {/* Working micro-demos: the claim, demonstrated */}
                {f.slug === "project-manager" && (
                  <Reveal style={{ marginBottom: "2.5rem" }}>
                    <RagDemo colors={C} />
                  </Reveal>
                )}
                {f.slug === "signals" && (
                  <Reveal style={{ marginBottom: "2.5rem" }}>
                    <SignalsMiniGraph colors={C} />
                  </Reveal>
                )}

                {/* Live prototype, in place */}
                {f.protoSrc && (
                  <div style={{ paddingTop: "2rem", borderTop: `1px solid ${LINE}` }}>
                    <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "1rem 3rem", alignItems: "baseline", marginBottom: "1.4rem" }}>
                      <Reveal style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".2em", textTransform: "uppercase", color: ACCD }}>
                        Try it live
                      </Reveal>
                      {f.protoHints && (
                        <Reveal className="mobile-stack" stagger delay={0.1} style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.2rem" }}>
                          {f.protoHints.map((hint, hi) => (
                            <div key={hi} style={{ display: "flex", gap: ".6rem", alignItems: "flex-start" }}>
                              <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: ".9rem", color: ACC, lineHeight: 1.4, flexShrink: 0 }}>
                                {hi + 1}.
                              </span>
                              <p style={{ fontSize: ".78rem", color: DIM, lineHeight: 1.55, margin: 0 }}>{hint}</p>
                            </div>
                          ))}
                        </Reveal>
                      )}
                    </div>

                    <Reveal>
                      <PrototypeFrame
                        src={f.protoSrc}
                        poster={f.protoPoster ?? f.img}
                        title={f.title}
                        colors={C}
                      />
                    </Reveal>

                    <Reveal style={{ display: "flex", gap: "1.2rem", alignItems: "center", flexWrap: "wrap", marginTop: "1.2rem" }}>
                      <Link
                        href={`/work/trmeric/${f.slug}`}
                        style={{ fontFamily: "var(--font-mono)", fontSize: ".58rem", letterSpacing: ".14em", textTransform: "uppercase", color: ACCD, border: `1px solid ${LINA}`, borderRadius: "4px", padding: ".55rem 1rem", display: "inline-block" }}
                      >
                        Full case study →
                      </Link>
                      <span style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".14em", textTransform: "uppercase", color: FAINT }}>
                        Prototypes are the spec — this is what engineering builds from
                      </span>
                    </Reveal>
                  </div>
                )}
              </div>
            </div>
          ))}
        </section>

        {/* ═══════════════ 08 · DESIGN SYSTEM ═══════════════ */}
        <section id="design-system" style={{ padding: "5rem var(--pad)", borderTop: `1px solid ${LINE}`, background: BASE2, scrollMarginTop: "4rem" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", alignItems: "start" }}>
              <div>
                <Reveal>
                  <span style={s.kicker}>Design system, Trmeric DS v3</span>
                  <h2 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "clamp(1.4rem, 2.5vw, 2rem)", letterSpacing: "-.02em", color: INK, marginBottom: "1.2rem", lineHeight: 1.2 }}>Built from the turmeric plant.</h2>
                  <p style={{ ...s.body, marginBottom: "1rem" }}>Rhizome oranges. Powder golds. Leaf greens. Root browns. The palette references an actual object. That constraint made every color decision easier and the system more coherent.</p>
                  <p style={{ ...s.body, marginBottom: "1.5rem" }}>One rule: <strong style={{ color: INK, fontWeight: 600 }}>restraint over decoration.</strong> No heavy left-border accents. No accent rails used as decoration. Hierarchy does the work, not ornament.</p>
                </Reveal>
                <Reveal stagger delay={0.1} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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
                </Reveal>
              </div>
              <Reveal delay={0.15} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <Shot
                  src="/images/trmeric/designsystem.png"
                  alt="Trmeric Design System v3, token system and component library"
                  ratio="16/10"
                  border={`1px solid ${LINE}`}
                  shadow={SHADOW}
                  accent={ACC}
                  sizes="(max-width: 900px) 100vw, 550px"
                />
                <a
                  href="/prototypes/trmeric/design-system.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".16em", textTransform: "uppercase", color: ACCD, border: `1px solid ${LINA}`, borderRadius: 999, padding: ".55rem 1.1rem", alignSelf: "flex-start", textDecoration: "none" }}
                >
                  Browse the living design system ↗
                </a>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ═══════════════ 09 · BRAND STORY TEASER ═══════════════ */}
        <section style={{ borderTop: `1px solid ${LINE}`, background: BASE }}>
          <div className="mobile-stack" style={{ maxWidth: "1100px", margin: "0 auto", padding: "6rem var(--pad)", display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "4rem", alignItems: "center" }}>
            <Reveal>
              <span style={s.kicker}>Brand identity · Logo, Loaded.</span>
              <h2 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", letterSpacing: "-.025em", color: INK, lineHeight: 1.1, maxWidth: "18ch", marginBottom: "1.4rem" }}>
                The mark is not designed.{" "}
                <em style={{ fontStyle: "italic", color: ACC }}>It is grown.</em>
              </h2>
              <p style={{ ...s.body, marginBottom: "2rem" }}>
                18 cross-sections of real turmeric rhizomes, traced, averaged, and superimposed. Five rings sized by the golden ratio, carrying five brand promises. The full derivation, from actual plant to final lockup, has its own page.
              </p>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
                <Link
                  href="/work/trmeric/brand"
                  style={{ fontFamily: "var(--font-mono)", fontSize: ".65rem", letterSpacing: ".18em", textTransform: "uppercase", color: BASE, background: ACC, borderRadius: "4px", padding: ".75rem 1.6rem", display: "inline-block", textDecoration: "none" }}
                >
                  Read the brand story →
                </Link>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".14em", textTransform: "uppercase", color: FAINT }}>
                  9 boards · derivation · ratio · colorways
                </span>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <Shot
                src="/images/trmeric/logo-story/01.png"
                alt="Trmeric brand vision v1.0, the concentric ring mark paired with the trmeric wordmark"
                ratio="16/9"
                border={`1px solid ${LINE}`}
                shadow={SHADOW}
                accent={ACC}
                sizes="(max-width: 900px) 100vw, 640px"
              />
            </Reveal>
          </div>
        </section>

        {/* ═══════════════ 10 · REFLECTION — chapter seam: the close ═════
            Third and final seam — warm, resolved, the dust settled and
            calm behind the closing word. Fades from BASE (brand teaser)
            to BASE2 (the CTA). ═══════════════════════════════════════ */}
        <ChapterSeam tone="warm" fadeTop={BASE} fadeBottom={BASE2} minHeight="60vh" style={{ textAlign: "center" }}>
          <Reveal style={{ maxWidth: "580px", margin: "0 auto", padding: "0 var(--pad)" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: ".62rem", letterSpacing: ".2em", textTransform: "uppercase", color: ACCD, display: "block", marginBottom: "1.2rem" }}>On the work</span>
            <blockquote style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "clamp(1.15rem, 2.5vw, 1.6rem)", lineHeight: 1.3, letterSpacing: "-.015em", color: INK, margin: "0 0 .8rem" }}>
              "Prototypes are the spec. Engineering builds from them directly. That is the intended workflow, not an accident."
            </blockquote>
            <p style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".16em", textTransform: "uppercase", color: FAINT }}>Aravind J · Trmeric · 2024–present</p>
          </Reveal>
        </ChapterSeam>

        {/* ═══════════════ 11 · CTA ═══════════════ */}
        <section style={{ padding: "5rem var(--pad) 6rem", borderTop: `1px solid ${LINE}`, background: BASE2, textAlign: "center" }}>
          <Reveal as="span" style={s.kicker}>Explore further</Reveal>
          <Reveal as="p" style={{ fontSize: ".9375rem", color: DIM, maxWidth: "38ch", margin: ".6rem auto 2rem", lineHeight: 1.65 }}>Five deep-dive case studies. Twelve live prototypes. One design system. One grown mark.</Reveal>
          <Reveal delay={0.1} style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <WarpLink href="/work/trmeric/demand-owner-flow" variant="settle" style={{ fontFamily: "var(--font-mono)", fontSize: ".68rem", letterSpacing: ".18em", textTransform: "uppercase", color: BASE, background: ACC, borderRadius: "4px", padding: ".8rem 1.8rem", display: "inline-block" }}>Demand Owner Flow →</WarpLink>
            <WarpLink href="/work/trmeric/brand" variant="settle" style={{ fontFamily: "var(--font-mono)", fontSize: ".65rem", letterSpacing: ".16em", textTransform: "uppercase", color: ACCD, border: `1px solid ${LINA}`, borderRadius: "4px", padding: ".8rem 1.4rem", display: "inline-block" }}>Brand story →</WarpLink>
          </Reveal>
        </section>

        {/* ═══════════════ 12 · EPILOGUE — match-cut into Rozi ═══════════════ */}
        <NextProject current="trmeric" />

      </main>
      <Footer />
    </TrmericTheme>
  );
}
