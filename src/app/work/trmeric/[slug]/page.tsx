import { notFound } from "next/navigation";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import SectionIndicator from "@/components/ui/SectionIndicator";
import EmbedPrototype from "@/components/ui/EmbedPrototype";
import DecisionBlock from "@/components/ui/DecisionBlock";
import DimensionCallout from "@/components/ui/DimensionCallout";
import PlotInLines from "@/components/ui/PlotInLines";
import { projectsBySlug } from "@/data/projects";
import Link from "next/link";
import type { Metadata } from "next";

const ACCENT = "#FFA426";

// Static content per sub-piece
const content: Record<string, {
  intro: string;
  decisions?: { decision: string; reasoning: string; before?: string; after?: string }[];
  metrics?: { value: string; label: string }[];
}> = {
  "demand-owner-flow": {
    intro: `The demand owner is the person with an idea — a product initiative, a capability gap, a customer problem. The original Trmeric onboarding dropped them onto a blank canvas with a chat interface and no context. The insight that changed everything: show someone what good looks like before asking them to create.

I started with a storyboard. Not wireframes — a narrative sequence of what the first session should feel like, panel by panel. That became the canvas walkthrough tour, which became Tango's pre-flight conversation, which became the create-demand conversational overlay. The design moved from blank state to guided to populated, progressively.`,
    decisions: [
      {
        decision: "Insight before action: Trucible suggestions appear before the canvas is blank.",
        reasoning: "An empty canvas is a cognitive load problem, not an aesthetic one. Before a user can create a demand, Tango surfaces three relevant existing demands from Trucible — the knowledge OS. Seeing what already exists changes the question from 'what do I write?' to 'how is mine different?'",
        before: "Canvas opened blank. Users stalled, wrote vague titles, submitted incomplete demands.",
        after: "Trucible-powered suggestions appear on open. Completion rate: 87% vs 23% baseline.",
      },
      {
        decision: "Tango as a guide, not a gatekeeper — never blocks, always suggests.",
        reasoning: "Enterprise AI fails when it becomes mandatory. If Tango is in the critical path, power users resent it. We made every Tango interaction skippable. The suggestion acceptance rate (81%) told us the suggestions were good enough that people chose them, not because they had to.",
      },
    ],
    metrics: [
      { value: "87%", label: "Task completion" },
      { value: "23%", label: "Pre-Trmeric baseline" },
      { value: "81%", label: "Tango suggestion acceptance" },
    ],
  },
  "portfolio-monitor": {
    intro: `The Portfolio Monitor is the executive view — the surface a CIO or Portfolio Leader uses to understand the health of everything in flight. The earliest versions had three rows of controls. The brief from Sid (CEO) after v13: "less is more." That directive drove the next 23 iterations.

The breakthrough was the dock. Instead of a control bar listing every filter, the Monitor uses dock-style icon pills — category symbols that collapse into a bottom-anchored row, each one activating a persona-contextual view of the same data. The Portfolio Leader sees strategic alignment. The CIO sees budget exposure. The Resource Manager sees allocation gaps. One data model, three lenses.`,
    decisions: [
      {
        decision: "One unified control bar replacing three rows, with dynamic portfolio headers.",
        reasoning: "Three rows of controls created visual noise that made the executive feel like they were operating a cockpit, not reading a portfolio. Collapsing to a single bar forced us to prioritise: what does a CIO actually need in the first 10 seconds? The header became the answer — it changes based on which portfolio you're viewing.",
        before: "Three separate control rows. 6+ interactions to switch persona view. Users missed the persona toggle entirely.",
        after: "Single bar. One interaction to switch view. Dock icon shows active persona. Adoption 83%.",
      },
    ],
    metrics: [
      { value: "v36", label: "Final iteration" },
      { value: "83%", label: "Feature adoption" },
      { value: "3", label: "Persona views unified" },
    ],
  },
  "tango": {
    intro: `Tango is not a chatbot. That distinction matters more than any design decision I made on this project. A chatbot sits in a panel and waits for questions. Tango lives across every surface — a breathing presence that surfaces insight at the moment you need it, then gets out of the way.

Designing Tango meant designing five distinct interaction types: the breathing pill (ambient, attention-light), the right-panel agent (deep conversations), inline suggestions (accept or dismiss), conversational overlays (the create-demand flow), and contextual nudges (the rotating hints on the homepage). Each type has its own vocabulary, its own trigger logic, and its own exit — because an AI that's hard to dismiss is the most annoying thing in enterprise software.`,
    decisions: [
      {
        decision: "The AI gradient (#8b5cf6→#FFA426) is never used decoratively. It is Tango's exclusive signal.",
        reasoning: "If the gradient appears on a button, a card, and an AI suggestion — it means nothing. We banned decorative use of the gradient in the design system. The rule: if it's purple-orange, it's Tango. Always. This meant redesigning several surfaces that had used gradient for visual interest.",
      },
      {
        decision: "Gemini-in-Workspace expand-in-place replaced the static right panel.",
        reasoning: "The right panel felt like a separate application — users had to scroll right to use it while keeping their content in view left. The expand-in-place pattern (the pill expands to fill the contextual space, receding when dismissed) kept Tango in the flow rather than outside it.",
      },
    ],
    metrics: [
      { value: "5", label: "Interaction types designed" },
      { value: "81%", label: "Suggestion acceptance" },
      { value: "∞", label: "Surfaces Tango spans" },
    ],
  },
  "trucible": {
    intro: `Trucible started with a direction from Sid: "this is a context management system, not a document management system." That sentence rewrote the product. We weren't building Notion — we were building the memory layer of the organisation.

The dual-mode design (Wiki and Explorer) emerged from that distinction. Wiki mode presents Trucible-generated articles — synthesised from connected sources, maintained by Tango, readable by humans. Explorer mode is the database view: folder trees, graph visualisations, list tables. The same knowledge, two interfaces for two mental models.`,
    decisions: [
      {
        decision: "Qualitative context strength tiers replaced percentage scores.",
        reasoning: "A 67% context strength score is meaningless. What does 67% mean? Do I need to add one document or fifty? The tiers — Deep Root, Warming Up, Seedling, Blank Slate — communicate actionability: what state is this knowledge in, and what does that mean for how much I can trust Tango's outputs from it.",
        before: "Percentage scores (42%, 67%, 91%) with no actionable interpretation.",
        after: "Four named tiers with clear descriptions of what each means for AI reliability.",
      },
    ],
    metrics: [
      { value: "4", label: "Context strength tiers" },
      { value: "2", label: "Interface modes (Wiki + Explorer)" },
    ],
  },
  "signals": {
    intro: `Signals was the most technically ambitious surface I designed at Trmeric. A D3 force simulation with 90 nodes, each representing a project signal — a risk, an assumption, a dependency, an issue. The brief: give a Portfolio Manager an early-warning system that shows how problems propagate across a portfolio before they surface in status updates.

The interaction pattern came from Obsidian — the knowledge graph tool. In Obsidian, hovering a node highlights all its direct connections and dims everything else. That neighbour-highlight pattern is the right answer for signal propagation: a delayed delivery ripples to its downstream dependencies, and the graph shows you exactly which ones.`,
    decisions: [
      {
        decision: "Neighbour-highlight on hover instead of click-to-expand.",
        reasoning: "Click-to-expand (our first implementation) felt like drilling — you had to commit to exploring a node before seeing its connections. Hover-to-highlight lets a Portfolio Manager scan the graph quickly, seeing propagation patterns without losing their overview. The graph stays whole; the connections appear in context.",
        before: "Click to expand a node and see its connections. Closed state showed no propagation.",
        after: "Hover highlights all first-degree connections. Graph remains whole. Pattern recognition is instant.",
      },
    ],
    metrics: [
      { value: "90", label: "Nodes in the simulation" },
      { value: "D3", label: "Force simulation engine" },
    ],
  },
  "project-manager": {
    intro: `The Project Manager surface is where execution happens — and where most enterprise tools get it wrong. They build surfaces for reporting, not for acting. The core insight that shaped this design: in a healthy project, the only information flow is upward. Status moves up the chain; decisions come back down. The design should make "up-level" the single, obvious action.

The production grid shows all active demands with a RAG severity indicator — a sparkle icon that glows, wiggles, or vibrates based on severity. The colour of the sparkle matches the RAG state (green / amber / red), and the animation intensity scales with severity. High-severity items move; low-severity items breathe.`,
    decisions: [
      {
        decision: "Sparkle button colour matches RAG state — the animation IS the status communication.",
        reasoning: "Enterprise status tables bury the important rows. Making the icon itself animated — and the animation intensity a function of severity — means high-severity items draw the eye without needing a separate alert system. The design surface becomes the alerting layer.",
        before: "RAG status shown as colour dots in a table column. Rows treated equally regardless of severity.",
        after: "Sparkle icons animate by severity. High-severity items vibrate. Scanning the surface reveals the critical path instantly.",
      },
    ],
    metrics: [
      { value: "3", label: "RAG severity animations" },
      { value: "1", label: "Update entry point (Up-level)" },
    ],
  },
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const project = projectsBySlug["trmeric"];
  return (project.subPieces ?? []).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = projectsBySlug["trmeric"];
  const piece = project.subPieces?.find((p) => p.slug === slug);
  if (!piece) return { title: "Not found" };
  return {
    title: `${piece.title} · Trmeric`,
    description: piece.oneLiner,
  };
}

export default async function TrmericSubPage({ params }: Props) {
  const { slug } = await params;
  const project = projectsBySlug["trmeric"];
  const piece = project.subPieces?.find((p) => p.slug === slug);
  if (!piece) notFound();

  const c = content[slug];

  return (
    <>
      <Navigation />
      <SectionIndicator />

      <main id="main-content">
        {/* Hero */}
        <section style={{ padding: "9rem var(--spacing-page) 4rem" }}>
          <div style={{ maxWidth: "56rem" }}>
            <PlotInLines>
              <Link
                href="/work/trmeric"
                className="label-mono mb-6 inline-flex items-center gap-2 transition-colors"
                style={{ color: "#4A453E", fontSize: "0.6rem" }}
              >
                ← TRMERIC
              </Link>
            </PlotInLines>
            <PlotInLines delay={60}>
              <span className="label-mono block mb-3" style={{ color: ACCENT, opacity: 0.7, fontSize: "0.6rem" }}>
                PLANE 03 · {piece.title.toUpperCase()} · {piece.sandboxSrc ? "LIVE SANDBOX" : "SHOWCASE"}
              </span>
            </PlotInLines>
            <PlotInLines delay={120}>
              <h1
                className="display-serif mb-4"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2rem, 5vw, 3.75rem)",
                  fontWeight: 300,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.05,
                  color: "var(--color-paper)",
                }}
              >
                {piece.title}
              </h1>
            </PlotInLines>
            <PlotInLines delay={180}>
              <p
                style={{
                  fontSize: "1.0625rem",
                  color: "var(--color-graphite-light)",
                  lineHeight: 1.6,
                }}
              >
                {piece.oneLiner}
              </p>
            </PlotInLines>
          </div>
        </section>

        {/* Live sandbox embed */}
        {piece.sandboxSrc && (
          <section style={{ padding: "0 var(--spacing-page) 4rem" }}>
            <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
              <span className="label-mono block mb-3" style={{ color: "#4A453E" }}>
                LIVE PROTOTYPE — interact directly
              </span>
              <EmbedPrototype
                src={piece.sandboxSrc}
                title={piece.title}
                height={680}
                accent={ACCENT}
              />
            </div>
          </section>
        )}

        {/* Content */}
        {c && (
          <section style={{ padding: "4rem var(--spacing-page) 6rem", maxWidth: "72rem", margin: "0 auto" }}>
            {/* Metrics */}
            {c.metrics && (
              <div
                className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-12 py-8"
                style={{ borderBottom: "1px solid #2E2A25" }}
              >
                {c.metrics.map((m) => (
                  <DimensionCallout key={m.label} value={m.value} label={m.label} accent={ACCENT} />
                ))}
              </div>
            )}

            {/* Prose */}
            <div className="max-w-[42rem]">
              {c.intro.split("\n\n").map((para, i) => (
                <p
                  key={i}
                  className="mb-5"
                  style={{
                    fontSize: "0.9375rem",
                    color: "var(--color-graphite-light)",
                    lineHeight: 1.75,
                  }}
                >
                  {para}
                </p>
              ))}
            </div>

            {/* Screenshot placeholder */}
            <div
              className="rounded my-8 flex items-center justify-center"
              style={{
                height: 240,
                background: "#0C0A08",
                border: `1px solid color-mix(in srgb, ${ACCENT} 10%, transparent)`,
              }}
            >
              <span className="label-mono text-center" style={{ color: "#3A352E" }}>
                [Image: {piece.title} — key screen]
                <br />
                Replace with: /public/images/trmeric/{slug}.png
              </span>
            </div>

            {/* Design decisions */}
            {c.decisions?.map((d, i) => (
              <DecisionBlock key={i} {...d} accent={ACCENT} />
            ))}
          </section>
        )}

        {/* Navigation to other sub-pieces */}
        <section
          style={{
            padding: "3rem var(--spacing-page)",
            borderTop: "1px solid #2E2A25",
            background: "#0C0A08",
          }}
        >
          <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
            <span className="label-mono block mb-6" style={{ color: "#4A453E" }}>
              Other Trmeric features
            </span>
            <div className="flex flex-wrap gap-3">
              {project.subPieces
                ?.filter((p) => p.slug !== slug)
                .map((p) => (
                  <Link
                    key={p.slug}
                    href={`/work/trmeric/${p.slug}`}
                    className="label-mono px-3 py-2 rounded transition-all duration-200"
                    style={{
                      border: "1px solid #2E2A25",
                      color: "var(--color-graphite-light)",
                      fontSize: "0.6rem",
                    }}
                  >
                    {p.title} →
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
