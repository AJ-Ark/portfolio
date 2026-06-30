import Image from "next/image";
import { notFound } from "next/navigation";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import TangoConversationDemo from "@/components/ui/TangoConversationDemo";
import EnrichmentDemo from "@/components/ui/EnrichmentDemo";
import ConvertToProjectDemo from "@/components/ui/ConvertToProjectDemo";
import { projectsBySlug } from "@/data/projects";
import Link from "next/link";
import type { Metadata } from "next";

/* ── Palette (Trmeric light / amber) ── */
const BASE  = "#FAF7F1";
const BASE2 = "#F1EADC";
const INK   = "#17150F";
const DIM   = "#6f6a5e";
const FAINT = "#9b9488";
const ACC   = "#FFA426";
const ACCB  = "#FFB84D";
const ACCD  = "#E8730E";
const LINE  = "rgba(23,21,15,.12)";
const LINA  = "rgba(255,164,38,.2)";
const SHADOW = "0 4px 24px -8px rgba(23,21,15,.14)";

interface StageItem { label: string; detail: string; stat?: string; weight?: number; }
interface InnovationItem {
  title: string;
  before: string[];
  after: string[];
  rationale: string;
  result: string;
}
interface QuoteItem { quote: string; attribution: string; }
interface ReflectionItem { title: string; body: string; metric?: string; }
interface PersonaItem { role: string; quote: string; frustrations: string[]; wants: string[]; uses: string[]; }
interface PathItem { name: string; steps: string[]; note: string; }
interface PrincipleItem { title: string; detail: string; }
interface DiscoveryItem { title: string; points: string[]; flag?: "warning" | "confirm"; }
interface LearningItem { title: string; principle: string; stat: string; }

/* ── Research-style case study fields (portfolio-monitor) ── */
interface ResearchStat { value: string; label: string; sub: string; }
interface PersonaTrait { label: string; detail: string; }
interface Topology { name: string; subtitle: string; desc: string; hierarchy: string; scale: string; }
interface RitualItem { cadence: string; detail: string; }
interface IAPriorityItem { rank: number; name: string; desc: string; level: "critical" | "high" | "medium"; }
interface TemporalCard { phase: string; question: string; subQuestion: string; dims: string[]; action: string; }
interface PainPoint { title: string; detail: string; }
interface ValueRung { num: string; label: string; title: string; desc: string; example: string; isTango?: boolean; }
interface TrustPillar { title: string; detail: string; }
interface JobItem { title: string; desc: string; trigger: string; }
interface DesignBet { title: string; desc: string; }
interface EngagementMode { title: string; cadence: string; desc: string; features: string[]; success: string; }
interface DirectionPrinciple { title: string; detail: string; }
interface WalkthroughStep { num: string; title: string; img: string; imgAlt: string; caption: string; }

const content: Record<string, {
  intro: string;
  heroStat?: { before: string; after: string; label: string };
  oldWay?: StageItem[];
  newWay?: StageItem[];
  emotionalArc?: string;
  personas?: PersonaItem[];
  paths?: PathItem[];
  innovations?: InnovationItem[];
  discoveries?: DiscoveryItem[];
  principles?: PrincipleItem[];
  decisions?: { decision: string; reasoning: string; before?: string; after?: string }[];
  learnings?: LearningItem[];
  quotes?: QuoteItem[];
  reflectionWorked?: ReflectionItem[];
  reflectionDifferent?: { title: string; body: string }[];
  metrics?: { value: string; label: string }[];
  /* research-style fields */
  personaName?: string;
  personaTags?: string[];
  personaTraits?: PersonaTrait[];
  researchStats?: ResearchStat[];
  topologies?: Topology[];
  rituals?: RitualItem[];
  goodDay?: string[];
  badDay?: string[];
  iaPriorities?: IAPriorityItem[];
  temporalModes?: TemporalCard[];
  painPoints?: PainPoint[];
  valueChain?: ValueRung[];
  trustPillars?: TrustPillar[];
  jobs?: JobItem[];
  designBets?: DesignBet[];
  engagementModes?: EngagementMode[];
  directionPrinciples?: DirectionPrinciple[];
  closingQuote?: { quote: string; attribution: string };
  walkthrough?: WalkthroughStep[];
}> = {
  "demand-owner-flow": {
    intro: "The demand owner is the person with an idea: a product initiative, a capability gap, a customer problem. The original Trmeric onboarding dropped them onto a blank canvas with a chat interface and no context. The insight that changed everything: show someone what good looks like before asking them to create. The result, eventually, was Trmeric Missions: a system that compresses an 8-week enterprise project initiation process into a 10-minute conversation.",
    heroStat: { before: "8 weeks", after: "10 min", label: "Project initiation time" },
    oldWay: [
      { label: "Week 1–2", weight: 2, detail: "Initial request and clarification hell. Incomplete form submissions, missing context, email ping-pong with 4–7 exchange cycles, 2–3 days between each response.", stat: "64% of submissions incomplete" },
      { label: "Week 3–4", weight: 2, detail: "Solution architecture and estimation. Manual searches across 4–6 systems for similar projects, resource history, budget constraints, strategic alignment data.", stat: "12+ hours gathering context" },
      { label: "Week 5–6", weight: 2, detail: "Resource hunting and allocation. Chasing resource managers, checking availability across teams, negotiating allocation percentages, resolving conflicts.", stat: "5–8 days average allocation time" },
      { label: "Week 7–8", weight: 2, detail: "Approval chase and project setup. Waiting for stakeholder attention, answering clarifying questions, re-sending with updates, manual project canvas creation.", stat: "5–10 days approval bottleneck" },
    ],
    emotionalArc: "Across all three personas, the emotional arc told the story: enthusiasm in week one curdled into confusion by week three, then frustration, then resignation by week eight. That arc, not the calendar, was the real design brief.",
    newWay: [
      { label: "2 min", weight: 2, detail: "Natural conversation. Tango conducts intelligent intake. No forms. Adaptive questioning based on role and context." },
      { label: "5 min", weight: 5, detail: "AI enrichment. Automatic context gathering from organisational data: similar projects, budget history, strategic alignment." },
      { label: "2 min", weight: 2, detail: "Smart resource matching. Context-aware suggestions filtered by skills, availability, and role requirements. Not bulk lists." },
      { label: "1 min", weight: 1, detail: "Execution-ready. Fully formed project canvas. Team assigned. Milestones defined. Ready for planning, not setup." },
    ],
    personas: [
      {
        role: "Executive Sponsor",
        quote: "I need to make fast decisions, but I can't approve what I don't understand.",
        frustrations: ["Approval bottlenecks: projects stalled waiting for sign-off", "Incomplete context: missing critical information", "Decision theatre: delays that aren't actually about complexity"],
        wants: ["Strategic visibility into portfolio health", "Complete context before approval", "Confidence that governance isn't blocking velocity"],
        uses: ["Portfolio Dashboard", "Fast-track Approval Queue"],
      },
      {
        role: "Demand Manager",
        quote: "I don't have time to fill out 37 fields. Just tell me what you need to know.",
        frustrations: ["Clarification loops: 4–7 email cycles per project", "Context archaeology: searching 4–6 systems manually", "Sequential workflow: can't build team while defining scope"],
        wants: ["Natural conversation instead of forms", "AI that gathers context automatically", "Flexible workflow with no forced sequences"],
        uses: ["Tango Conversation", "Demand Canvas"],
      },
      {
        role: "Portfolio Planner",
        quote: "By the time I see conflicts, it's already a crisis.",
        frustrations: ["Reactive firefighting: resource conflicts discovered late", "Capacity blind spots: no real-time visibility", "Manual optimisation: portfolio balancing in spreadsheets"],
        wants: ["Proactive conflict detection before allocation", "Real-time capacity planning across the portfolio", "Projects that arrive execution-ready"],
        uses: ["Resource Allocation", "Portfolio View"],
      },
    ],
    paths: [
      {
        name: "Demand Flow",
        steps: ["Idea & shaping: Tango conversation", "Estimation: AI enrichment", "Approval gate: context-rich decision"],
        note: "Inherits roles and costs from the demand but allows a fresh start at execution.",
      },
      {
        name: "Direct Flow",
        steps: ["Create project: skip estimation phase", "Build team: direct allocation", "Milestones: define timeline"],
        note: "Bypasses estimation entirely for work that doesn't need a governance gate.",
      },
    ],
    innovations: [
      {
        title: "Replace 37 fields with 5 smart questions",
        before: ["PROJECT REQUEST FORM", "37 required fields", "One-size-fits-all approach"],
        after: ["What's your role?", "PM branch: 3 questions", "Tech branch: 5 questions", "Exec branch: 2 questions"],
        rationale: "Generic forms optimise for data collection, not human understanding. When questions adapt to role and expertise, users provide richer context in fewer steps, and never abandon mid-way.",
        result: "64% incomplete → 87% fewer cycles",
      },
      {
        title: "Show the AI's work, no black box",
        before: ["Project brief submitted", "Black box processing", "Result appears", "User sees nothing, trust collapses"],
        after: ["Brief in", "Scanning 200+ projects ✓", "Matching patterns found ✓", "Scoring OKR aligned ✓", "Output visible"],
        rationale: "Black boxes destroy trust, especially with AI. Showing each enrichment step as it runs turns 30 seconds of wait into 30 seconds of confidence-building.",
        result: "12+ hours → 30 seconds",
      },
      {
        title: "Let users start where they think",
        before: ["Demand (Step 1) locked", "Request (Step 2) locked", "Assign (Step 3) blocked if Demand not created first"],
        after: ["Start from Demand, or", "Start from Resources", "Both sync in under 2 seconds, both ways"],
        rationale: "Rigid workflows create workarounds. Resource managers often spot available talent before demands exist. Forcing a sequence ignores how real allocation decisions happen: opportunistically, from either side.",
        result: "5–8 days → 2 minutes",
      },
      {
        title: "One click converts approval to execution",
        before: ["Approved demand ✓", "New system entry required", "Re-enter name, team, budget", "Hours of duplicated data entry"],
        after: ["Approved demand ✓", "1 click triggers project canvas", "Team, milestones, budget, dependencies all mapped"],
        rationale: "Approved demands already contain all the data needed to start. Re-entering it in a separate system wastes hours and introduces errors. The data should follow the decision, automatically.",
        result: "Days of setup → instantly ready",
      },
    ],
    discoveries: [
      {
        title: "Found 3 similar cloud migrations",
        points: ["Average duration: 8.5 months", "Budget range: $420K – $480K", "Success rate: 87% on-time", "Based on AWS Migration 2024, Azure Migration 2023, GCP Migration 2024"],
        flag: "confirm",
      },
      {
        title: "Team availability conflict",
        points: ["Sarah Chen, Cloud Architect, is 80% allocated until March", "Suggested alternative: Michael Kim, 92% match"],
        flag: "warning",
      },
      {
        title: "Budget aligns with Q2 allocation",
        points: ["Estimated cost: $450K", "Q2 available: $680K", "Confidence: High"],
        flag: "confirm",
      },
      {
        title: "Supports 2 strategic initiatives",
        points: ["Cloud-First Transformation", "Cost Optimization 2025", "+25 strategic alignment score"],
        flag: "confirm",
      },
    ],
    principles: [
      { title: "No forced sequences", detail: "Team-first, scope-first, or parallel: the system never locks a step because a previous one isn't complete." },
      { title: "Show your work", detail: "AI processing is never invisible. Each step surfaces in real time: scan, match, score, output, always visible." },
      { title: "Smart defaults, easy overrides", detail: "AI suggests a 12-week estimate; the user can set 8. The system assists, it never dictates." },
      { title: "Graceful degradation", detail: "Draft state is always saveable. No validation gates block progress, supporting the messy, non-linear reality of planning." },
      { title: "Conversation ends, work begins", detail: "Tango outputs directly to a structured project canvas. A 73% reduction in post-conversation data entry, zero manual re-entry needed." },
    ],
    quotes: [
      { quote: "I can finally build my team and define work in parallel. The system doesn't force me to finish one before starting the other. That alone saved us two weeks.", attribution: "Portfolio Manager, Fortune 500 Manufacturing" },
      { quote: "The AI enrichment is like having a research analyst who never sleeps. It finds connections and context I would have missed entirely.", attribution: "Demand Manager, Tech Services" },
      { quote: "We went from reactive firefighting to proactive portfolio optimisation. Conflict visibility changed everything.", attribution: "CTO, Financial Services" },
    ],
    learnings: [
      { title: "Show the AI's work", principle: "Users distrust opaque systems. Expose the reasoning, expose what changed, let people override it. Transparency is the foundation of trust, not an optional feature.", stat: "81% of AI suggestions were accepted when users could see the reasoning" },
      { title: "Avoid one-size-fits-all", principle: "Enterprise users carry different mental models. Engineering leadership thinks in sprints and resources; a division manager thinks in budgets and timelines. Design for the mental model, not the data schema.", stat: "3 distinct personas required 3 completely different conversation flows" },
      { title: "Governance is not friction", principle: "Embed compliance into the flow so it happens automatically, not as a blocking gate. Speed and governance coexist when they're designed together, not traded off.", stat: "Zero compliance violations while reducing process time by 99.8%" },
      { title: "Conversation beats configuration", principle: "Every dropdown, checkbox, and form field is cognitive load. Natural conversation captures the same data with less friction. The best interface is the one users already know how to use: language.", stat: "87% completion rate vs 23% with traditional forms" },
    ],
    reflectionWorked: [
      { title: "Conversational UX bet", body: "Replacing forms with natural conversation was a risk that paid off. Users didn't need training, they just talked.", metric: "87% completion, up from 23%" },
      { title: "AI enrichment transparency", body: "Showing users exactly what the AI did, and letting them override it, built trust. The 'show your work' approach turned skeptics into advocates.", metric: "81% AI suggestion acceptance" },
      { title: "Adaptive resource architecture", body: "Building the resource system to learn from organisational patterns meant recommendations got smarter with every project created.", metric: "+72 NPS score" },
    ],
    reflectionDifferent: [
      { title: "Earlier leadership reviews", body: "I waited too long to bring stakeholders into the design process. Earlier alignment would have prevented two rounds of rework on the governance model." },
      { title: "More iterative user testing", body: "Testing in larger batches meant some usability issues compounded. Smaller, more frequent sessions would have caught issues earlier." },
      { title: "Better documentation", body: "As a solo designer, I under-invested in documenting design decisions. This made handoff harder and slowed onboarding of a second designer later." },
    ],
    metrics: [
      { value: "99.8%", label: "Faster project creation" },
      { value: "87%", label: "Fewer clarification cycles" },
      { value: "81%", label: "Fewer false starts" },
      { value: "4.6/5", label: "User satisfaction" },
      { value: "83%", label: "Adoption, 3 months" },
      { value: "+72", label: "NPS" },
    ],
  },
  "portfolio-monitor": {
    intro: "The Portfolio Monitor is the executive view, the surface a CIO or Portfolio Leader uses to understand the health of everything in flight. The earliest versions had three rows of controls. The brief from Sid (CEO) after v13: \"less is more.\" That directive drove the next 23 iterations.\n\nBefore any of those iterations, there was a research foundation: who is this person, how do they actually spend a Monday, what do they need to see first, and why does every enterprise PPM tool get abandoned for Excel the night before the board meeting. That research is what follows.",
    personaName: "The IT Portfolio Leader",
    personaTags: ["Enterprise IT", "Governance-first", "AI-skeptical but open", "Politically exposed"],
    personaTraits: [
      { label: "Goal", detail: "Govern a large book of work to maximise delivered value, with no surprises. \"Are we doing the right projects?\" is always the question." },
      { label: "Biggest fear", detail: "Being surprised by a failure in a board meeting. A number they can't defend. Strategic spend that delivered nothing." },
      { label: "What success looks like", detail: "No surprises. A defensible narrative. Faster invest, kill, and rebalance decisions. Board questions answered in real time." },
      { label: "AI posture", detail: "Skeptical but open. Trusts transparent, bounded, reversible assistance. Will not bet their credibility on a black box." },
    ],
    researchStats: [
      { value: "200–1000+", label: "Projects under governance", sub: "Internal EPMO: dozens to hundreds. IT services delivery VP: accounts rolled up by vertical." },
      { value: "~70%", label: "Time spent assembling data, not deciding", sub: "The data-gathering tax: reconciling Excel, PPM tools, Jira, and finance systems before every review." },
      { value: "Managing vs. Governing", label: "The core distinction", sub: "Managing is doing projects right. Governing is doing the right projects. This feature is a governance instrument." },
    ],
    topologies: [
      { name: "Internal EPMO / CIO", subtitle: "Governance hierarchy", desc: "Governs internal change initiatives organised as a governance hierarchy.", hierarchy: "Portfolio → Program → Project → Demand", scale: "50–300 active projects. Asks: are we aligned, on budget, delivering value?" },
      { name: "IT Services Delivery VP", subtitle: "Account roll-up (LTI, TCS, Infosys)", desc: "Owns a delivery portfolio of client engagements, each with its own P&L.", hierarchy: "Vertical → Account → Engagement → Project", scale: "1,000+ engagements. At this scale: exception-first, rollup-driven. No one reads 1,000 rows." },
    ],
    rituals: [
      { cadence: "Weekly", detail: "Portfolio ops review. Walk reds and ambers. Assign actions." },
      { cadence: "Monthly", detail: "Steering committee. Portfolio governance board. Financials review." },
      { cadence: "Quarterly", detail: "QBR. Re-prioritisation. Fund or defund decisions. Re-forecast." },
      { cadence: "Annual", detail: "Portfolio planning and budgeting. Strategic alignment refresh." },
    ],
    goodDay: ["No surprises: reds are known and being managed", "The tool matches reality, not contradicting it", "A board question answered instantly with evidence", "The deck is ready before the meeting, not during"],
    badDay: ["A surprise red in a room full of stakeholders", "Conflicting numbers across systems", "A CFO question they cannot answer on the spot", "Scrambling to rebuild a deck the night before"],
    iaPriorities: [
      { rank: 1, name: "Health / RAG + trend", desc: "Evidence-backed, not self-reported. An AI-derived composite showing constituent signals.", level: "critical" },
      { rank: 2, name: "Exceptions / what changed", desc: "New reds, newly-at-risk, breached thresholds. The delta since the last view.", level: "critical" },
      { rank: 3, name: "Financials: burn / CPI / EAC", desc: "Budget vs. actual vs. forecast, cost performance index, estimate at completion.", level: "high" },
      { rank: 4, name: "Schedule: milestones / SPI", desc: "Milestone status, slippage counts, schedule performance index.", level: "high" },
      { rank: 5, name: "Strategic alignment / value by theme", desc: "Is the spend delivering on business goals? Contribution per strategic objective.", level: "high" },
      { rank: 6, name: "Resource / capacity", desc: "Utilisation, over-allocation hotspots, key-person risk.", level: "medium" },
      { rank: 7, name: "Risk / issue counts", desc: "Aggregate exposure. Which risks actually threaten outcomes vs. noise.", level: "medium" },
      { rank: 8, name: "Dependencies / blockers", desc: "Cross-program dependency chains. Cascading failure paths.", level: "medium" },
      { rank: 9, name: "Benefits realisation", desc: "Are promised outcomes landing? Retrospective ROI feeds the next investment cycle.", level: "medium" },
    ],
    temporalModes: [
      { phase: "Past · Archived", question: "Did we deliver?", subQuestion: "Was it worth it?", dims: ["Primary: retrospective ROI, benefits realised", "Financials: actuals vs. budget, final cost", "Schedule: on-time delivery rate, closure"], action: "Learn · Close · Archive" },
      { phase: "Present · Running", question: "What needs attention?", subQuestion: "What's on fire right now?", dims: ["Primary: live RAG and trend, exceptions", "Financials: burn rate, CPI", "Resources: over-allocation now"], action: "Decide · Act · Escalate" },
      { phase: "Future · Upcoming", question: "Can we absorb this?", subQuestion: "What are we committing to?", dims: ["Primary: pipeline, predicted RAG", "Financials: budget headroom, forecast", "Resources: future demand vs. supply"], action: "Approve · Defer · Reject" },
    ],
    painPoints: [
      { title: "The spreadsheet trap", detail: "Even orgs that own enterprise PPM tools export to Excel and PowerPoint for the actual review. The tool is built for analysts, not executives. The narrative can't be expressed in it." },
      { title: "Stale and distrusted data", detail: "Status is self-reported and lagging. Numbers conflict across systems. \"The tool says green, but I know it's red.\" When data is doubted, no decision can be made from it." },
      { title: "Fragmentation", detail: "Portfolio truth lives across PPM, finance system, Jira, email, and spreadsheets. Reconciling them is manual, slow, error-prone, and repeated every governance cycle." },
      { title: "Alert fatigue vs. missed signals", detail: "Either too many undifferentiated alerts that train leaders to ignore them, or the one signal that mattered was buried in a table they didn't scroll to." },
      { title: "No narrative layer", detail: "The tool cannot tell the story. It shows tables and charts but cannot synthesise \"here's what's happening and here's what it means.\" Hence the PowerPoint habit." },
      { title: "Configured for analysts, not executives", detail: "Heavy, deeply configurable, requiring training and analysts to operate. The executive who needs to decide is never the one who built the view, and they can tell." },
    ],
    valueChain: [
      { num: "1", label: "Where all tools are today", title: "Show me the data", desc: "Here are your 1,000 projects. Here's their RAG status. The VP still has to scan, interpret, and connect the dots. All the cognitive work is theirs.", example: "Here is your portfolio table with 847 rows." },
      { num: "2", label: "Exception surfacing", title: "Tell me what changed", desc: "Since last Monday, 7 projects flipped red, 3 flipped green, 2 missed a milestone. The VP doesn't scan 1,000 rows, they look at 7 things.", example: "7 programs changed status since your last review." },
      { num: "3", label: "Cross-portfolio signal synthesis", title: "Tell me why it matters", desc: "Of those 7 that went red, 5 are isolated and recoverable. But 2 are connected: they share the same team lead. If she stays over-allocated, both miss Q2.", example: "2 of those 7 share a dependency. One failure cascades." },
      { num: "✦", label: "Agentic AI, Tango's domain", title: "Tell me what to do", desc: "Option A: extend the lead's contract by 6 weeks, both projects recover. Option B: descope the Phase 2 milestone. Option C: pull a contractor from the bench. The VP decides; Tango did the investigation.", example: "3 options ready. Tango recommends Option A. Your call.", isTango: true },
    ],
    trustPillars: [
      { title: "Cited evidence", detail: "Every Tango insight links to source data. The VP can click \"why?\" and see the milestone, the cost variance, the resource utilisation figure. They can read it out in the board meeting." },
      { title: "Confidence", detail: "Tango says \"83% likely to miss Q2 if no action.\" That qualifier matters. They're not told a certainty, they're given a weighted signal to decide how hard to act on." },
      { title: "Human override", detail: "Tango drafts the decision. The VP owns it. Nothing happens automatically on fund, kill, or rebalance, the executive reviews, adjusts, and approves. Their name is on it." },
    ],
    jobs: [
      { title: "Monday triage", desc: "Orient after the weekend. Find what changed and what's at risk before the week begins. Fast, async, exception-first.", trigger: "Start of week, email or notification. Mode: Monitoring." },
      { title: "Weekly review", desc: "Walk the reds and ambers with the team. Decide corrective actions. Assign owners. Clear blockers. Requires drill-down to specific programs.", trigger: "Governance meeting. Mode: Decision." },
      { title: "Resource / budget rebalance", desc: "Where am I over-committed? What can I reallocate? Simulate a change: if we shift this team from X to Y, what happens to the portfolio?", trigger: "Capacity conflict or budget pressure. Mode: What-if simulation." },
      { title: "Board prep", desc: "Draft the state-of-the-portfolio narrative with evidence. Generate the deck. Make it defensible and ready the night before, not the morning of.", trigger: "Upcoming board or steering committee. Mode: Presentation." },
      { title: "Live defence", desc: "Answer a CFO or board question in real time, during the meeting. Pull the source data instantly. The number must be traceable in under 10 seconds.", trigger: "A challenge in a meeting. Mode: drill-down from Presentation." },
    ],
    designBets: [
      { title: "Narrative-first, evidence-linked synthesis: the Tango Brief", desc: "Lead every view with a one-paragraph, cited \"state of the portfolio.\" Tango writes it. The VP reads it. It is the wedge against the spreadsheet and PowerPoint default. If the VP can walk into any meeting armed only with this brief and be confident, the feature has won." },
      { title: "Two topologies, one model", desc: "Support both the deep internal governance hierarchy (Portfolio → Program → Project → Demand) and the wide services account roll-up (Vertical → Account → Engagement). The same dataset, multiple views. A CIO and a delivery VP both get what they need from the same platform." },
      { title: "A visible trust contract for agentic AI", desc: "Every Tango recommendation shows evidence, confidence, and reversibility. Human confirmation gates on high-stakes moves. This is what converts a skeptical, politically-exposed executive into a daily user. Without this, any AI feature is decoration." },
    ],
    engagementModes: [
      { title: "Monitoring", cadence: "Daily · Async", desc: "Signal-first exception feed and portfolio-health bento. Tango opens with the brief. The VP reads and orients, no scanning required.", features: ["Exception feed (what changed)", "Tango morning brief", "Portfolio health tiles", "Temporal toggle: Past / Now / Future"], success: "VP opens Trmeric before the weekly review instead of asking an analyst." },
      { title: "Decision", cadence: "Weekly · Semi-sync", desc: "Drill-down, what-if simulation, and action assignment. Tango proposes rebalances with evidence. The VP approves or overrides.", features: ["Portfolio → Program → Project drill-down", "Views by theme, BU, stage, account", "What-if reallocation simulation", "Action assignment with owner tracking"], success: "A reallocation decision made from a Tango recommendation in the weekly review." },
      { title: "Presentation", cadence: "Monthly / Quarterly · Sync", desc: "Auto-assembled, editable, evidence-linked board narrative generated from the live portfolio. Exportable, but also defensible live in the room.", features: ["AI-generated portfolio narrative", "Editable before presenting", "Live drill-down from any slide", "Export to PDF / PPTX"], success: "VP presents from Trmeric, not a hand-built PowerPoint deck." },
    ],
    directionPrinciples: [
      { title: "Tango speaks first", detail: "The VP never stares at a blank interface or a wall of data. They read a brief that orients them." },
      { title: "Conversation is embedded, not separated", detail: "The input lives inside the surface, not in a sidebar panel. Like the update input in Project Live, elevated to portfolio scale." },
      { title: "The workspace transforms, not accumulates", detail: "When the VP asks something, the content area reshapes around the answer. It doesn't add a chat bubble, it becomes the answer." },
      { title: "Modularity and control", detail: "The VP can pin views, rearrange what's in their workspace, and decide what their brief emphasises. Control without requiring it." },
    ],
    closingQuote: { quote: "Tango's job is to be the VP's best analyst: one who already read everything, connected all the dots, drafted the options, and is waiting at 8am Monday with a one-page brief and three recommended moves, but who knows the VP is the one who signs off, and always shows their working so the VP can defend the call in any room.", attribution: "Design direction note, Tango for Portfolio" },
    decisions: [
      {
        decision: "One unified control bar replacing three rows, with dynamic portfolio headers.",
        reasoning: "Three rows of controls created visual noise that made the executive feel like they were operating a cockpit, not reading a portfolio. Collapsing to a single bar forced us to prioritise: what does a CIO actually need in the first 10 seconds? The header became the answer, changing based on which portfolio you're viewing.",
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
  "trucible": {
    intro: "Trucible started with a direction from Sid: \"this is a context management system, not a document management system.\" That sentence rewrote the product. We weren't building Notion. We were building the memory layer of the organisation.\n\nThe dual-mode design (Wiki and Explorer) emerged from that distinction. Wiki mode presents Trucible-generated articles, synthesised from connected sources, maintained by Tango, readable by humans. Explorer mode is the database view: folder trees, graph visualisations, list tables. The same knowledge, two interfaces for two mental models.",
    decisions: [
      {
        decision: "Qualitative context strength tiers replaced percentage scores.",
        reasoning: "A 67% context strength score is meaningless. What does 67% mean? Do I need to add one document or fifty? The tiers (Deep Root, Warming Up, Seedling, Blank Slate) communicate actionability: what state is this knowledge in, and what does that mean for how much I can trust Tango's outputs from it.",
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
    intro: "Signals was the most technically ambitious surface I designed at Trmeric. A D3 force simulation with dozens of nodes, each representing a project signal: a risk, an assumption, a dependency, an issue. The brief: give a Portfolio Manager an early-warning system that shows how problems propagate across a portfolio before they surface in status updates.\n\nThe interaction pattern came from Obsidian, the knowledge graph tool. In Obsidian, hovering a node highlights all its direct connections and dims everything else. That neighbour-highlight pattern is the right answer for signal propagation: a delayed delivery ripples to its downstream dependencies, and the graph shows you exactly which ones.",
    decisions: [
      {
        decision: "Cluster by project, not flat node soup.",
        reasoning: "An undifferentiated cloud of 79 signal dots is unreadable. Clustering by project (Kaiser Migration, BHP Sync, Unified Customer) lets a Portfolio Manager see at a glance which initiative is generating the most noise, with red rings marking clusters that need a decision today.",
        before: "Click-to-expand (our first implementation) felt like drilling. You had to commit to exploring a node before seeing its connections.",
        after: "Hover highlights all first-degree connections. Graph remains whole. Pattern recognition is instant.",
      },
    ],
    metrics: [
      { value: "79", label: "Live signals tracked" },
      { value: "D3", label: "Force simulation engine" },
    ],
  },
  "project-manager": {
    intro: "The Project Manager surface is where execution happens, and where most enterprise tools get it wrong. They build surfaces for reporting, not for acting. The core insight that shaped this design: in a healthy project, the only information flow is upward. Status moves up the chain; decisions come back down. The design should make \"up-level\" the single, obvious action, reachable from wherever a PM happens to be, not buried three clicks into a project they have to open first.\n\nThe execution board shows Scope, Schedule, and Spend health as three independent rings, each with its own status and its own one-click Update action. Tango sits alongside as an insight feed, not a separate destination, surfacing risk patterns and historical precedent inline with the work itself.",
    walkthrough: [
      {
        num: "01",
        title: "Tango flags it before you go looking",
        img: "/images/trmeric/uplevel-grid.png",
        imgAlt: "Projects grid with Tango insights panel surfacing stale and blocked projects, each with an Up-level button, plus a bulk Up-level all with Tango action",
        caption: "The grid view never makes a PM hunt for what's stale. Tango reads update timestamps and blocker flags directly: \"EY Digital status hasn't been updated in 2 days, UAT milestone is at risk.\" Each flagged row gets its own Up-level button inline, plus a bulk action when several projects have gone quiet at once.",
      },
      {
        num: "02",
        title: "Up-level from the grid, see the diff instantly",
        img: "/images/trmeric/uplevel-confirm.png",
        imgAlt: "Confirmation banner showing Up-levelled from grid with before-and-after values for Schedule, Scope, and Spend, plus an automatically logged RAID assumption",
        caption: "Click Up-level and the change doesn't just save silently. A banner shows exactly what moved: Scope 78% → 84%, Schedule confirmed On Track, Spend confirmed On Track, and a new RAID item logged automatically (an assumption about UAT completion). An animated trail visibly connects the quick action to the health rings it just updated, so the PM sees cause and effect, not just a refreshed number.",
      },
      {
        num: "03",
        title: "Or skip the form entirely: tell Tango what happened",
        img: "/images/trmeric/uplevel-catchmeup.png",
        imgAlt: "Catch me up text input prompting Share what changed since last update, Tango will parse scope, schedule, spend and flag any risks automatically",
        caption: "\"Catch me up\" is the other entry point: one free-text box. \"Share what changed since last update, Tango will parse scope, schedule, spend and flag any risks automatically.\" A PM writes a sentence the way they'd say it out loud. Review & commit stays disabled until there's something to parse, so it's never an empty submit.",
      },
      {
        num: "04",
        title: "Committed, logged, and visible in the activity feed",
        img: "/images/trmeric/uplevel-committed.png",
        imgAlt: "Toast notification confirming Up-level committed, health cards updated, one RAID item added, with the change appearing as a Just updated entry in the project activity feed",
        caption: "A toast confirms what changed: \"Up-level committed. Health cards updated, 1 RAID item added.\" The same update appears in the project's activity feed as \"Status committed, Scope → 84%, Schedule → 56%, via Review & commit,\" timestamped. Nothing about the update is invisible after the fact.",
      },
    ],
    decisions: [
      {
        decision: "Three independent health rings instead of one rolled-up status.",
        reasoning: "A single 'at risk' badge hides which dimension is actually the problem. Splitting Scope, Schedule, and Spend into three rings, each independently up-levelled, means the Schedule can be at risk while Scope and Spend stay calmly on track, and everyone can see exactly which lever needs attention.",
        before: "RAG status shown as colour dots in a table column. Rows treated equally regardless of severity.",
        after: "Three rings with independent status. Tango surfaces risk patterns directly beside the board. Scanning the surface reveals the critical path instantly.",
      },
      {
        decision: "The sparkle icon's animation rate IS the severity, not just its colour.",
        reasoning: "An on-track item gets a slow breathing pulse: a gentle scale and glow on a 3.5-second cycle, about 17 times a minute, calm enough to ignore. An at-risk item gets a visible wiggle on a 2-second cycle, about 30 times a minute, enough motion to catch peripheral vision without being alarming. A critical item gets a single deliberate shake (four quick steps across 400 milliseconds) followed by a long rest, repeating on a 1.1-second cycle, about 54 times a minute. That pacing was deliberate: constant vibration reads as background noise the eye learns to filter out, but one sharp burst followed by stillness reads as a distinct alarm each time it fires.",
      },
      {
        decision: "Two entry points into the same update, grid Up-level and free-text Catch me up.",
        reasoning: "Some updates are a single confirmed number, on-track stays on-track, and a one-click Up-level is correct. Other updates are a paragraph of context a PM already has in their head and doesn't want to decompose into three separate fields. Catch me up takes the sentence and has Tango parse it into Scope, Schedule, Spend, and any risks, so the PM writes once in their own words instead of filling a form.",
      },
      {
        decision: "Up-level moved from a hover-only button to an always-visible cell.",
        reasoning: "An internal UX sync flagged that hover-only actions are invisible until a PM happens to mouse over the right row, which means stale projects stay stale simply because nobody hovered. The redesign made the update cell permanently visible, carrying both the freshness state (how long since the last update) and the action together, so staleness itself becomes a visible, scannable signal across the whole grid, not something you discover by accident.",
      },
    ],
    metrics: [
      { value: "3", label: "Independent health rings" },
      { value: "2", label: "Update entry points: grid + free text" },
      { value: "1.1s", label: "Critical alarm cycle" },
      { value: "1", label: "RAID item auto-logged per up-level" },
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

const sectionImg: Record<string, string> = {
  "demand-owner-flow": "/images/trmeric/canvas.png",
  "portfolio-monitor": "/images/trmeric/portfolio-monitor.png",
  "trucible": "/images/trmeric/trucible.png",
  "signals": "/images/trmeric/signals-graph.png",
  "project-manager": "/images/trmeric/raid-workspace.png",
};

export default async function TrmericSubPage({ params }: Props) {
  const { slug } = await params;
  const project = projectsBySlug["trmeric"];
  const piece = project.subPieces?.find((p) => p.slug === slug);
  if (!piece) notFound();

  const c = content[slug];
  const heroImg = sectionImg[slug];

  return (
    <div style={{ background: BASE, color: INK, minHeight: "100vh" }}>
      <Navigation />

      <main id="main-content">
        {/* ═══ HERO ═══ */}
        <section style={{ padding: "9rem var(--pad) 4rem" }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <Link
              href="/work/trmeric"
              style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".16em", textTransform: "uppercase", color: FAINT, marginBottom: "1.5rem", display: "inline-block" }}
            >
              ← Trmeric
            </Link>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".2em", textTransform: "uppercase", color: ACCD, marginBottom: "1rem" }}>
              {piece.sandboxSrc ? "Live prototype" : "Showcase"} · Feature deep-dive
            </div>
            <h1 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "clamp(2rem, 5vw, 3.6rem)", letterSpacing: "-.025em", lineHeight: 1.05, color: INK, marginBottom: "1rem" }}>
              {piece.title}
            </h1>
            <p style={{ fontSize: "1.0625rem", color: DIM, lineHeight: 1.65, maxWidth: "52ch" }}>
              {piece.oneLiner}
            </p>

            {/* Hero stat, if present */}
            {c?.heroStat && (
              <div style={{ display: "flex", alignItems: "center", gap: "2rem", marginTop: "2.5rem", paddingTop: "2rem", borderTop: `1px solid ${LINE}` }}>
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".16em", textTransform: "uppercase", color: FAINT, marginBottom: ".3rem" }}>Before</div>
                  <div style={{ fontFamily: "var(--font-body)", fontWeight: 800, fontSize: "1.8rem", color: FAINT, fontVariantNumeric: "tabular-nums" }}>{c.heroStat.before}</div>
                </div>
                <span style={{ color: ACC, fontSize: "1.4rem" }}>→</span>
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".16em", textTransform: "uppercase", color: ACCD, marginBottom: ".3rem" }}>After</div>
                  <div style={{ fontFamily: "var(--font-body)", fontWeight: 800, fontSize: "1.8rem", color: ACC, fontVariantNumeric: "tabular-nums" }}>{c.heroStat.after}</div>
                </div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".1em", textTransform: "uppercase", color: DIM, paddingLeft: "1rem", borderLeft: `1px solid ${LINE}` }}>
                  {c.heroStat.label}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* ═══ HERO SCREENSHOT ═══ */}
        {heroImg && (
          <section style={{ padding: "0 var(--pad) 4rem" }}>
            <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
              <div style={{ position: "relative", width: "100%", height: "480px", borderRadius: "14px", overflow: "hidden", border: `1px solid ${LINE}`, boxShadow: SHADOW }}>
                <Image src={heroImg} alt={`${piece.title} screenshot`} fill style={{ objectFit: "cover", objectPosition: "top left" }} />
              </div>
            </div>
          </section>
        )}

        {/* ═══ PROTOTYPE CTA ═══ */}
        {piece.sandboxSrc && (
          <section style={{ padding: "0 var(--pad) 4rem" }}>
            <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1.2rem", padding: "1.6rem 1.8rem", border: `1px solid ${LINA}`, borderRadius: "14px", background: "rgba(255,164,38,.05)" }}>
                <div>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: ".58rem", letterSpacing: ".16em", textTransform: "uppercase", color: ACCD, marginBottom: ".5rem", display: "block" }}>
                    Live prototype
                  </span>
                  <p style={{ fontSize: ".88rem", color: INK, fontWeight: 600 }}>
                    This is a real, working build, not a mockup. Open it and click through it yourself.
                  </p>
                </div>
                <a
                  href={`/prototypes/${piece.sandboxSrc}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontFamily: "var(--font-mono)", fontSize: ".68rem", letterSpacing: ".16em", textTransform: "uppercase", color: "#fff", background: ACC, borderRadius: "4px", padding: ".8rem 1.6rem", display: "inline-flex", alignItems: "center", gap: ".5rem", whiteSpace: "nowrap" }}
                >
                  Access the prototype →
                </a>
              </div>
            </div>
          </section>
        )}

        {c && (
          <>
            {/* ═══ INTRO ═══ */}
            <section style={{ padding: "4rem var(--pad)", borderTop: `1px solid ${LINE}`, background: BASE2 }}>
              <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                {c.intro.split("\n\n").map((para, i) => (
                  <p key={i} style={{ fontSize: ".9375rem", color: DIM, lineHeight: 1.78, maxWidth: "62ch", marginBottom: "1.2rem" }}>{para}</p>
                ))}
              </div>
            </section>

            {/* ═══ WALKTHROUGH SEQUENCE ═══ */}
            {c.walkthrough && (
              <section style={{ padding: "5rem var(--pad)", borderTop: `1px solid ${LINE}` }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".2em", textTransform: "uppercase", color: ACCD, marginBottom: ".5rem", display: "block" }}>The actual interaction, screen by screen</span>
                  <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "1.4rem", color: INK, marginBottom: ".6rem" }}>Up-level, end to end</h3>
                  <p style={{ fontSize: ".9375rem", color: DIM, marginBottom: "2.5rem", maxWidth: "60ch" }}>Four real screens from the working prototype, in sequence. Not mockups, this is the actual flow a PM walks through to move a project's status forward.</p>

                  <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
                    {c.walkthrough.map((step) => (
                      <div key={step.num} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2.5rem", alignItems: "center" }}>
                        <div style={{ position: "relative", height: "320px", borderRadius: "12px", overflow: "hidden", border: `1px solid ${LINE}`, boxShadow: SHADOW }}>
                          <Image src={step.img} alt={step.imgAlt} fill style={{ objectFit: "cover", objectPosition: "top left" }} />
                        </div>
                        <div>
                          <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "2rem", color: ACC, opacity: 0.6, lineHeight: 1, display: "block", marginBottom: ".6rem" }}>{step.num}</span>
                          <h4 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "1.1rem", color: INK, marginBottom: ".8rem" }}>{step.title}</h4>
                          <p style={{ fontSize: ".88rem", color: DIM, lineHeight: 1.7 }}>{step.caption}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* ═══ PERSONA DEEP-DIVE ═══ */}
            {c.personaTraits && (
              <section style={{ padding: "5rem var(--pad)", borderTop: `1px solid ${LINE}` }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".2em", textTransform: "uppercase", color: ACCD, marginBottom: ".5rem", display: "block" }}>Research · Who they are</span>
                  <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "1.5rem", color: INK, marginBottom: ".6rem" }}>{c.personaName}</h3>
                  <p style={{ fontSize: ".9375rem", color: DIM, marginBottom: "1.2rem", maxWidth: "60ch" }}>Not a project manager. Not a delivery lead. A governance role, accountable for asking "are we doing the right things?" not "are we doing things right?"</p>
                  {c.personaTags && (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: ".5rem", marginBottom: "2.5rem" }}>
                      {c.personaTags.map((t) => (
                        <span key={t} style={{ fontFamily: "var(--font-mono)", fontSize: ".58rem", letterSpacing: ".06em", padding: ".35rem .7rem", borderRadius: "100px", border: `1px solid ${LINA}`, color: ACCD, background: "rgba(255,164,38,.06)" }}>{t}</span>
                      ))}
                    </div>
                  )}

                  <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: "2.5rem" }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                      {c.personaTraits.map((t) => (
                        <div key={t.label} style={{ display: "flex", gap: "1rem", padding: "1rem 1.2rem", border: `1px solid ${LINE}`, borderRadius: "10px", background: BASE2 }}>
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: ACC, flexShrink: 0, marginTop: ".4rem" }} />
                          <div>
                            <div style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".12em", textTransform: "uppercase", color: ACCD, marginBottom: ".35rem" }}>{t.label}</div>
                            <p style={{ fontSize: ".84rem", color: DIM, lineHeight: 1.65 }}>{t.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {c.researchStats && (
                      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        {c.researchStats.map((s) => (
                          <div key={s.label} style={{ padding: "1.2rem 1.3rem", border: `1px solid ${LINE}`, borderRadius: "10px", background: BASE }}>
                            <div style={{ fontFamily: "var(--font-body)", fontWeight: 800, fontSize: s.value.length > 12 ? "1.1rem" : "1.6rem", letterSpacing: "-.02em", color: ACC, marginBottom: ".3rem", lineHeight: 1.2 }}>{s.value}</div>
                            <div style={{ fontSize: ".78rem", color: INK, fontWeight: 600, marginBottom: ".3rem" }}>{s.label}</div>
                            <p style={{ fontSize: ".72rem", color: FAINT, lineHeight: 1.5 }}>{s.sub}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {c.topologies && (
                    <div style={{ marginTop: "2.5rem" }}>
                      <div style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".16em", textTransform: "uppercase", color: FAINT, marginBottom: "1rem" }}>Two operating topologies</div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem" }}>
                        {c.topologies.map((t) => (
                          <div key={t.name} style={{ padding: "1.3rem 1.4rem", borderLeft: `3px solid ${ACC}`, border: `1px solid ${LINE}`, borderLeftWidth: "3px", borderRadius: "8px", background: BASE2 }}>
                            <div style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: ".92rem", color: INK, marginBottom: ".2rem" }}>{t.name}</div>
                            <div style={{ fontFamily: "var(--font-mono)", fontSize: ".58rem", color: FAINT, marginBottom: ".7rem" }}>{t.subtitle}</div>
                            <p style={{ fontSize: ".78rem", color: DIM, lineHeight: 1.6, marginBottom: ".7rem" }}>{t.desc}</p>
                            <div style={{ fontSize: ".74rem", color: INK, fontWeight: 600, marginBottom: ".4rem" }}>{t.hierarchy}</div>
                            <p style={{ fontSize: ".72rem", color: FAINT, lineHeight: 1.5 }}>{t.scale}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* ═══ DAY IN THE LIFE ═══ */}
            {c.rituals && (
              <section style={{ padding: "5rem var(--pad)", borderTop: `1px solid ${LINE}`, background: BASE2 }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".2em", textTransform: "uppercase", color: ACCD, marginBottom: ".5rem", display: "block" }}>Research · How they operate</span>
                  <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "1.4rem", color: INK, marginBottom: ".6rem" }}>A day in the life</h3>
                  <p style={{ fontSize: ".9375rem", color: DIM, marginBottom: "2rem", maxWidth: "58ch" }}>They don't open a tool because they're curious. They open it because something demands attention, or to prepare for a room where they'll be questioned.</p>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: ".8rem", marginBottom: "2rem" }}>
                    {c.rituals.map((r) => (
                      <div key={r.cadence} style={{ padding: "1.2rem", border: `1px solid ${LINE}`, borderRadius: "10px", background: BASE, textAlign: "center" }}>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: ".62rem", letterSpacing: ".1em", textTransform: "uppercase", color: ACCD, fontWeight: 700, marginBottom: ".5rem" }}>{r.cadence}</div>
                        <p style={{ fontSize: ".74rem", color: DIM, lineHeight: 1.55 }}>{r.detail}</p>
                      </div>
                    ))}
                  </div>

                  {(c.goodDay || c.badDay) && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem" }}>
                      {c.goodDay && (
                        <div style={{ padding: "1.3rem 1.5rem", borderTop: "3px solid #3a7a4a", border: `1px solid ${LINE}`, borderTopWidth: "3px", borderRadius: "8px", background: BASE }}>
                          <div style={{ fontFamily: "var(--font-mono)", fontSize: ".62rem", letterSpacing: ".1em", textTransform: "uppercase", color: "#3a7a4a", fontWeight: 700, marginBottom: ".8rem" }}>A good day</div>
                          {c.goodDay.map((g) => <div key={g} style={{ fontSize: ".78rem", color: DIM, lineHeight: 1.6, marginBottom: ".4rem" }}>· {g}</div>)}
                        </div>
                      )}
                      {c.badDay && (
                        <div style={{ padding: "1.3rem 1.5rem", borderTop: "3px solid #b5402a", border: `1px solid ${LINE}`, borderTopWidth: "3px", borderRadius: "8px", background: BASE }}>
                          <div style={{ fontFamily: "var(--font-mono)", fontSize: ".62rem", letterSpacing: ".1em", textTransform: "uppercase", color: "#b5402a", fontWeight: 700, marginBottom: ".8rem" }}>A bad day</div>
                          {c.badDay.map((b) => <div key={b} style={{ fontSize: ".78rem", color: DIM, lineHeight: 1.6, marginBottom: ".4rem" }}>· {b}</div>)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* ═══ INFORMATION ARCHITECTURE ═══ */}
            {c.iaPriorities && (
              <section style={{ padding: "5rem var(--pad)", borderTop: `1px solid ${LINE}` }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".2em", textTransform: "uppercase", color: ACCD, marginBottom: ".5rem", display: "block" }}>Research · What they need to see</span>
                  <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "1.4rem", color: INK, marginBottom: ".6rem" }}>Information architecture, ranked</h3>
                  <p style={{ fontSize: ".9375rem", color: DIM, marginBottom: "2rem", maxWidth: "58ch" }}>Not everything at once. Signal first, then synthesis, then summary, then drill-down. The density preference is a cascade, not a wall.</p>

                  <div style={{ display: "flex", flexDirection: "column", gap: ".5rem", marginBottom: "3rem" }}>
                    {c.iaPriorities.map((item) => (
                      <div key={item.rank} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: ".8rem 1.1rem", border: `1px solid ${LINE}`, borderRadius: "8px", background: item.rank <= 2 ? "rgba(255,164,38,.04)" : BASE2 }}>
                        <span style={{
                          width: 26, height: 26, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
                          fontFamily: "var(--font-mono)", fontSize: ".68rem", fontWeight: 700,
                          background: item.rank === 1 ? ACC : item.rank === 2 ? "rgba(255,164,38,.25)" : BASE2,
                          color: item.rank <= 2 ? "#5a3c10" : FAINT,
                          border: item.rank > 2 ? `1px solid ${LINE}` : "none",
                        }}>{item.rank}</span>
                        <span style={{ fontSize: ".84rem", fontWeight: 600, color: INK, flex: "0 0 220px" }}>{item.name}</span>
                        <span style={{ fontSize: ".76rem", color: DIM, flex: 1 }}>{item.desc}</span>
                        <span style={{
                          fontFamily: "var(--font-mono)", fontSize: ".5rem", letterSpacing: ".08em", textTransform: "uppercase", fontWeight: 700,
                          padding: ".25rem .6rem", borderRadius: "100px", flexShrink: 0,
                          color: item.level === "critical" ? "#b5402a" : item.level === "high" ? "#9a6500" : "#2563eb",
                          background: item.level === "critical" ? "rgba(181,64,42,.08)" : item.level === "high" ? "rgba(154,101,0,.08)" : "rgba(37,99,235,.08)",
                        }}>{item.level}</span>
                      </div>
                    ))}
                  </div>

                  {c.temporalModes && (
                    <>
                      <div style={{ display: "flex", alignItems: "center", gap: ".8rem", marginBottom: ".6rem" }}>
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: ".5rem", letterSpacing: ".08em", padding: ".2rem .5rem", borderRadius: "4px", background: ACC, color: "#fff", fontWeight: 700 }}>NEW</span>
                        <h4 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "1.05rem", color: INK }}>The missing dimension: temporal state</h4>
                      </div>
                      <p style={{ fontSize: ".84rem", color: DIM, marginBottom: "1.5rem", maxWidth: "58ch" }}>The portfolio is not one view, it's three completely different mental modes. This is absent from every current PPM tool. It's a major design opportunity.</p>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
                        {c.temporalModes.map((m) => (
                          <div key={m.phase} style={{ border: `1px solid ${m.phase.includes("Present") ? LINA : LINE}`, borderRadius: "10px", overflow: "hidden", background: BASE }}>
                            <div style={{ padding: "1.1rem 1.2rem", borderBottom: `1px solid ${LINE}` }}>
                              <div style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".1em", textTransform: "uppercase", color: ACCD, marginBottom: ".6rem" }}>{m.phase}</div>
                              <div style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: ".95rem", color: INK }}>{m.question}</div>
                              <div style={{ fontSize: ".74rem", color: FAINT, fontStyle: "italic", marginTop: ".2rem" }}>"{m.subQuestion}"</div>
                            </div>
                            <div style={{ padding: "1rem 1.2rem" }}>
                              {m.dims.map((d) => (
                                <div key={d} style={{ fontSize: ".72rem", color: DIM, lineHeight: 1.55, marginBottom: ".4rem" }}>{d}</div>
                              ))}
                              <div style={{ marginTop: ".8rem", padding: ".5rem .7rem", borderRadius: "6px", background: BASE2, fontSize: ".68rem", color: ACCD, fontWeight: 600 }}>{m.action}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </section>
            )}

            {/* ═══ WHY CURRENT TOOLS FAIL ═══ */}
            {c.painPoints && (
              <section style={{ padding: "5rem var(--pad)", borderTop: `1px solid ${LINE}`, background: BASE2 }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".2em", textTransform: "uppercase", color: ACCD, marginBottom: ".5rem", display: "block" }}>Research · Current reality</span>
                  <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "1.4rem", color: INK, marginBottom: ".6rem" }}>Why current tools fail</h3>
                  <p style={{ fontSize: ".9375rem", color: DIM, marginBottom: "2rem", maxWidth: "58ch" }}>Planview, Clarity, ServiceNow SPM, Jira Align: all powerful. All abandoned in favour of Excel the day before the board meeting.</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
                    {c.painPoints.map((p) => (
                      <div key={p.title} style={{ padding: "1.2rem 1.4rem", border: `1px solid ${LINE}`, borderRadius: "10px", background: BASE }}>
                        <h4 style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: ".88rem", color: INK, marginBottom: ".5rem" }}>{p.title}</h4>
                        <p style={{ fontSize: ".78rem", color: DIM, lineHeight: 1.6 }}>{p.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* ═══ AI VALUE CHAIN ═══ */}
            {c.valueChain && (
              <section style={{ padding: "5rem var(--pad)", borderTop: `1px solid ${LINE}` }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".2em", textTransform: "uppercase", color: ACCD, marginBottom: ".5rem", display: "block" }}>Research · The AI opportunity</span>
                  <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "1.4rem", color: INK, marginBottom: ".6rem" }}>Moving up the value chain</h3>
                  <p style={{ fontSize: ".9375rem", color: DIM, marginBottom: "2.5rem", maxWidth: "58ch" }}>The shift from "show me the data" to "tell me what changed, why it matters, and what to do." Four rungs, and Tango needs to reach all four.</p>

                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {c.valueChain.map((rung, i) => (
                      <div key={rung.num} style={{ display: "flex", gap: "1.4rem", padding: "1.4rem 0", borderBottom: i < c.valueChain!.length - 1 ? `1px solid ${LINE}` : "none" }}>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 40, flexShrink: 0 }}>
                          <span style={{
                            width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                            fontFamily: "var(--font-mono)", fontSize: ".72rem", fontWeight: 700,
                            background: rung.isTango ? "linear-gradient(135deg, #8b5cf6, #FFA426)" : "#fff",
                            color: rung.isTango ? "#fff" : FAINT,
                            border: rung.isTango ? "none" : `2px solid ${LINE}`,
                          }}>{rung.num}</span>
                        </div>
                        <div>
                          <div style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".1em", textTransform: "uppercase", color: rung.isTango ? "#8b5cf6" : FAINT, marginBottom: ".3rem" }}>{rung.label}</div>
                          <div style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "1rem", color: INK, marginBottom: ".4rem" }}>{rung.title}</div>
                          <p style={{ fontSize: ".82rem", color: DIM, lineHeight: 1.65, marginBottom: ".6rem", maxWidth: "58ch" }}>{rung.desc}</p>
                          <span style={{
                            display: "inline-block", fontFamily: "var(--font-mono)", fontSize: ".68rem", padding: ".35rem .8rem", borderRadius: "100px",
                            background: rung.isTango ? "rgba(255,164,38,.08)" : BASE2,
                            color: rung.isTango ? ACCD : DIM,
                            fontStyle: rung.isTango ? "normal" : "italic",
                            fontWeight: rung.isTango ? 600 : 400,
                          }}>{rung.isTango && "✦ "}{rung.example}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {c.trustPillars && (
                    <div style={{ marginTop: "2.5rem" }}>
                      <h4 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "1.05rem", color: INK, marginBottom: ".4rem" }}>The trust contract</h4>
                      <p style={{ fontSize: ".84rem", color: DIM, marginBottom: "1.5rem", maxWidth: "58ch" }}>This persona is politically exposed. Every number they present, they must be able to defend. Tango's authority depends on three non-negotiables.</p>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
                        {c.trustPillars.map((p) => (
                          <div key={p.title} style={{ padding: "1.3rem", border: `1px solid ${LINE}`, borderRadius: "10px", background: BASE2, textAlign: "center" }}>
                            <h5 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: ".88rem", color: INK, marginBottom: ".5rem" }}>{p.title}</h5>
                            <p style={{ fontSize: ".76rem", color: DIM, lineHeight: 1.6 }}>{p.detail}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* ═══ JOBS TO BE DONE ═══ */}
            {c.jobs && (
              <section style={{ padding: "5rem var(--pad)", borderTop: `1px solid ${LINE}`, background: BASE2 }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".2em", textTransform: "uppercase", color: ACCD, marginBottom: ".5rem", display: "block" }}>Research · Jobs to be done</span>
                  <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "1.4rem", color: INK, marginBottom: ".6rem" }}>The five core scenarios</h3>
                  <p style={{ fontSize: ".9375rem", color: DIM, marginBottom: "2rem", maxWidth: "58ch" }}>When do they open the portfolio? What are they trying to accomplish? Design for these, nothing else is priority.</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: ".8rem" }}>
                    {c.jobs.map((j, i) => (
                      <div key={j.title} style={{ display: "flex", gap: "1.2rem", padding: "1.2rem 1.4rem", border: `1px solid ${LINE}`, borderRadius: "10px", background: BASE }}>
                        <span style={{ width: 32, height: 32, borderRadius: "8px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-mono)", fontSize: ".78rem", fontWeight: 700, color: ACCD, background: "rgba(255,164,38,.08)", border: `1.5px solid ${LINA}` }}>{i + 1}</span>
                        <div>
                          <div style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: ".92rem", color: INK, marginBottom: ".3rem" }}>{j.title}</div>
                          <p style={{ fontSize: ".82rem", color: DIM, lineHeight: 1.6, marginBottom: ".4rem" }}>{j.desc}</p>
                          <div style={{ fontFamily: "var(--font-mono)", fontSize: ".62rem", color: ACCD }}>→ {j.trigger}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* ═══ DESIGN BETS ═══ */}
            {c.designBets && (
              <section style={{ padding: "5rem var(--pad)", borderTop: `1px solid ${LINE}` }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".2em", textTransform: "uppercase", color: ACCD, marginBottom: ".5rem", display: "block" }}>Research → Design direction</span>
                  <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "1.4rem", color: INK, marginBottom: ".6rem" }}>Three design bets</h3>
                  <p style={{ fontSize: ".9375rem", color: DIM, marginBottom: "2rem", maxWidth: "58ch" }}>These are the decisions that determine whether this feature beats Excel and PowerPoint, or becomes another tool people export out of.</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {c.designBets.map((b, i) => (
                      <div key={b.title} style={{ display: "flex", gap: "1.4rem", padding: "1.4rem", borderLeft: `4px solid ${ACC}`, border: `1px solid ${LINE}`, borderLeftWidth: "4px", borderRadius: "8px", background: BASE2 }}>
                        <span style={{ fontFamily: "var(--font-body)", fontWeight: 800, fontSize: "2.2rem", color: "rgba(23,21,15,.14)", lineHeight: 1, flexShrink: 0, width: 44 }}>{String(i + 1).padStart(2, "0")}</span>
                        <div>
                          <div style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: ".96rem", color: INK, marginBottom: ".5rem" }}>{b.title}</div>
                          <p style={{ fontSize: ".82rem", color: DIM, lineHeight: 1.68 }}>{b.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* ═══ ENGAGEMENT MODES ═══ */}
            {c.engagementModes && (
              <section style={{ padding: "5rem var(--pad)", borderTop: `1px solid ${LINE}`, background: BASE2 }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".2em", textTransform: "uppercase", color: ACCD, marginBottom: ".5rem", display: "block" }}>Three modes of engagement</span>
                  <p style={{ fontSize: ".9375rem", color: DIM, marginBottom: "2rem", maxWidth: "58ch" }}>Not one screen. Three distinct purposes, each needing a different visual posture.</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.2rem" }}>
                    {c.engagementModes.map((m) => (
                      <div key={m.title} style={{ padding: "1.4rem", border: `1px solid ${LINE}`, borderRadius: "12px", background: BASE, display: "flex", flexDirection: "column", gap: ".9rem" }}>
                        <div>
                          <div style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "1.05rem", color: INK }}>{m.title}</div>
                          <div style={{ fontFamily: "var(--font-mono)", fontSize: ".58rem", letterSpacing: ".06em", color: FAINT, marginTop: ".15rem" }}>{m.cadence}</div>
                        </div>
                        <p style={{ fontSize: ".78rem", color: DIM, lineHeight: 1.6 }}>{m.desc}</p>
                        <div style={{ display: "flex", flexDirection: "column", gap: ".35rem" }}>
                          {m.features.map((f) => (
                            <div key={f} style={{ fontSize: ".72rem", color: INK, display: "flex", gap: ".4rem" }}>
                              <span style={{ color: ACC }}>→</span>{f}
                            </div>
                          ))}
                        </div>
                        <div style={{ marginTop: "auto", padding: ".6rem .8rem", borderRadius: "6px", background: BASE2, fontSize: ".68rem", color: DIM, lineHeight: 1.5 }}>
                          <strong style={{ color: INK }}>Success: </strong>{m.success}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* ═══ DESIGN DIRECTION PRINCIPLES + CLOSING QUOTE ═══ */}
            {c.directionPrinciples && (
              <section style={{ padding: "5rem var(--pad)", borderTop: `1px solid ${LINE}` }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                  <div style={{ padding: "2rem 2.2rem", borderRadius: "16px", border: `1.5px solid ${LINA}`, background: `linear-gradient(160deg, rgba(255,164,38,.05), ${BASE})`, marginBottom: c.closingQuote ? "1.5rem" : 0 }}>
                    <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "1.3rem", color: INK, marginBottom: ".6rem" }}>The experience we're building toward</h3>
                    <p style={{ fontSize: ".88rem", color: DIM, lineHeight: 1.7, marginBottom: "1.8rem", maxWidth: "62ch" }}>Not a chat interface. Not a traditional dashboard. A living briefing surface with a conversation layer, like a financial newspaper that knows you, updates in real time, and you can talk back to. Tango is the editor. The workspace is the publication.</p>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                      {c.directionPrinciples.map((p) => (
                        <div key={p.title} style={{ display: "flex", gap: ".8rem", padding: "1rem 1.1rem", background: "#fff", borderRadius: "8px", border: `1px solid ${LINE}` }}>
                          <span style={{ width: 7, height: 7, borderRadius: "50%", background: ACC, flexShrink: 0, marginTop: ".4rem" }} />
                          <div>
                            <div style={{ fontSize: ".84rem", fontWeight: 600, color: INK }}>{p.title}</div>
                            <p style={{ fontSize: ".76rem", color: DIM, lineHeight: 1.55, marginTop: ".2rem" }}>{p.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {c.closingQuote && (
                    <div style={{ padding: "1.8rem 2rem", borderRadius: "14px", background: "linear-gradient(135deg, rgba(139,92,246,.05), rgba(255,164,38,.05))", border: "1.5px solid rgba(139,92,246,.18)" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: ".4rem", fontFamily: "var(--font-mono)", fontSize: ".6rem", fontWeight: 700, letterSpacing: ".06em", color: "#fff", background: "linear-gradient(135deg, #8b5cf6, #FFA426)", padding: ".3rem .8rem", borderRadius: "100px", marginBottom: "1rem" }}>✦ Tango</span>
                      <blockquote style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "1.05rem", color: INK, lineHeight: 1.7, maxWidth: "64ch" }}>
                        "{c.closingQuote.quote}"
                      </blockquote>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* ═══ TRY THE CONVERSATION (interactive, demand-owner-flow only) ═══ */}
            {slug === "demand-owner-flow" && (
              <section style={{ padding: "5rem var(--pad)", borderTop: `1px solid ${LINE}` }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".2em", textTransform: "uppercase", color: ACCD, marginBottom: ".5rem", display: "block" }}>Try it yourself</span>
                  <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "1.4rem", color: INK, marginBottom: ".6rem" }}>The actual conversation, recreated</h3>
                  <p style={{ fontSize: ".875rem", color: DIM, marginBottom: "2rem", maxWidth: "58ch" }}>Click through it. This is the real Tango intake flow: three quick choices, an enrichment pass, and a populated demand canvas.</p>
                  <div style={{ maxWidth: "640px" }}>
                    <TangoConversationDemo />
                  </div>
                </div>
              </section>
            )}

            {/* ═══ OLD WAY / NEW WAY ═══ */}
            {(c.oldWay || c.newWay) && (
              <section style={{ padding: "5rem var(--pad)", borderTop: `1px solid ${LINE}` }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".2em", textTransform: "uppercase", color: ACCD, marginBottom: "2rem", display: "block" }}>The transformation</span>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem" }}>
                    {c.oldWay && (
                      <div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".18em", textTransform: "uppercase", color: FAINT, marginBottom: "1.2rem" }}>The old way</div>
                        {c.heroStat && (
                          <div style={{ marginBottom: "1.4rem" }}>
                            <div style={{ display: "flex", height: "10px", borderRadius: "5px", overflow: "hidden", border: `1px solid ${LINE}`, background: BASE2 }}>
                              {c.oldWay.map((s, i) => (
                                <div key={s.label} style={{ flex: s.weight ?? 1, borderRight: i < c.oldWay!.length - 1 ? `1px solid ${BASE}` : "none", background: `rgba(155,148,136,${0.25 + i * 0.15})` }} />
                              ))}
                            </div>
                            <div style={{ fontFamily: "var(--font-mono)", fontSize: ".58rem", letterSpacing: ".06em", color: FAINT, marginTop: ".5rem" }}>
                              {c.heroStat.before} total
                            </div>
                          </div>
                        )}
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                          {c.oldWay.map((s) => (
                            <div key={s.label} style={{ padding: "1.1rem 1.3rem", border: `1px solid ${LINE}`, borderRadius: "10px", background: BASE2 }}>
                              <div style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".1em", textTransform: "uppercase", color: FAINT, marginBottom: ".4rem" }}>{s.label}</div>
                              <p style={{ fontSize: ".8125rem", color: DIM, lineHeight: 1.6, marginBottom: s.stat ? ".5rem" : 0 }}>{s.detail}</p>
                              {s.stat && <div style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", color: "#b5402a", fontStyle: "italic" }}>{s.stat}</div>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {c.newWay && (
                      <div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".18em", textTransform: "uppercase", color: ACCD, marginBottom: "1.2rem" }}>Powered by Trmeric</div>
                        {c.heroStat && (
                          <div style={{ marginBottom: "1.4rem" }}>
                            <div style={{ display: "flex", height: "10px", borderRadius: "5px", overflow: "hidden", border: `1px solid ${LINA}` }}>
                              {c.newWay.map((s, i) => (
                                <div key={`${s.label}-${i}`} style={{ flex: s.weight ?? 1, borderRight: i < c.newWay!.length - 1 ? `1px solid ${BASE}` : "none", background: ACC, opacity: 0.4 + i * 0.18 }} />
                              ))}
                            </div>
                            <div style={{ fontFamily: "var(--font-mono)", fontSize: ".58rem", letterSpacing: ".06em", color: ACCD, marginTop: ".5rem" }}>
                              {c.heroStat.after} total
                            </div>
                          </div>
                        )}
                        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                          {c.newWay.map((s, i) => (
                            <div key={`${s.label}-${i}`} style={{ padding: "1.1rem 1.3rem", border: `1px solid ${LINA}`, borderRadius: "10px", background: "rgba(255,164,38,.04)" }}>
                              <div style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".1em", textTransform: "uppercase", color: ACC, marginBottom: ".4rem" }}>{s.label}</div>
                              <p style={{ fontSize: ".8125rem", color: DIM, lineHeight: 1.6 }}>{s.detail}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* ═══ EMOTIONAL ARC ═══ */}
            {c.emotionalArc && (
              <section style={{ padding: "3rem var(--pad)", borderTop: `1px solid ${LINE}`, background: BASE2 }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                    <div style={{ flexShrink: 0, width: 180, height: 6, borderRadius: 3, background: "linear-gradient(90deg, #d9c9a8 0%, #e8a857 35%, #d9783a 65%, #b5402a 100%)" }} />
                    <p style={{ fontSize: ".85rem", color: DIM, lineHeight: 1.65, fontStyle: "italic", fontFamily: "var(--font-display)" }}>{c.emotionalArc}</p>
                  </div>
                </div>
              </section>
            )}

            {/* ═══ METRICS ═══ */}
            {c.metrics && (
              <section style={{ padding: "4rem var(--pad)", borderTop: `1px solid ${LINE}`, background: BASE2 }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                  <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.min(c.metrics.length, 6)}, 1fr)`, borderTop: `1px solid ${LINE}`, borderLeft: `1px solid ${LINE}` }}>
                    {c.metrics.map((m) => (
                      <div key={m.label} style={{ padding: "1.6rem 1.2rem", borderRight: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}`, background: BASE }}>
                        <div style={{ fontFamily: "var(--font-body)", fontWeight: 800, fontSize: "1.7rem", letterSpacing: "-.03em", color: ACC, lineHeight: 1, fontVariantNumeric: "tabular-nums", marginBottom: ".4rem" }}>{m.value}</div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".1em", textTransform: "uppercase", color: FAINT }}>{m.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* ═══ PERSONAS ═══ */}
            {c.personas && (
              <section style={{ padding: "5rem var(--pad)", borderTop: `1px solid ${LINE}` }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".2em", textTransform: "uppercase", color: ACCD, marginBottom: ".5rem", display: "block" }}>Who we designed for</span>
                  <p style={{ fontSize: ".9375rem", color: DIM, marginBottom: "2.5rem", maxWidth: "56ch" }}>Three roles, three completely different mental models. Each needed a different entry point into the same system.</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
                    {c.personas.map((p) => (
                      <div key={p.role} style={{ border: `1px solid ${LINE}`, borderRadius: "12px", overflow: "hidden", background: BASE2 }}>
                        <div style={{ padding: "1.4rem", borderBottom: `1px solid ${LINE}` }}>
                          <div style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".14em", textTransform: "uppercase", color: ACCD, marginBottom: ".6rem" }}>{p.role}</div>
                          <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: ".95rem", color: INK, lineHeight: 1.4 }}>"{p.quote}"</p>
                        </div>
                        <div style={{ padding: "1.2rem 1.4rem" }}>
                          <div style={{ fontFamily: "var(--font-mono)", fontSize: ".5rem", letterSpacing: ".12em", textTransform: "uppercase", color: "#b5402a", marginBottom: ".5rem" }}>Frustrated by</div>
                          {p.frustrations.map((f) => <div key={f} style={{ fontSize: ".76rem", color: DIM, lineHeight: 1.55, marginBottom: ".4rem" }}>· {f}</div>)}
                          <div style={{ fontFamily: "var(--font-mono)", fontSize: ".5rem", letterSpacing: ".12em", textTransform: "uppercase", color: "#3a7a4a", marginTop: ".9rem", marginBottom: ".5rem" }}>Wants</div>
                          {p.wants.map((w) => <div key={w} style={{ fontSize: ".76rem", color: DIM, lineHeight: 1.55, marginBottom: ".4rem" }}>· {w}</div>)}
                          <div style={{ display: "flex", flexWrap: "wrap", gap: ".4rem", marginTop: "1rem", paddingTop: ".9rem", borderTop: `1px solid ${LINE}` }}>
                            {p.uses.map((u) => (
                              <span key={u} style={{ fontFamily: "var(--font-mono)", fontSize: ".52rem", letterSpacing: ".06em", padding: ".3rem .6rem", borderRadius: "100px", border: `1px solid ${LINA}`, color: ACCD, background: "rgba(255,164,38,.06)" }}>{u}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* ═══ TWO PATHS ═══ */}
            {c.paths && (
              <section style={{ padding: "5rem var(--pad)", borderTop: `1px solid ${LINE}`, background: BASE2 }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".2em", textTransform: "uppercase", color: ACCD, marginBottom: ".5rem", display: "block" }}>System architecture</span>
                  <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "1.4rem", color: INK, marginBottom: "2rem" }}>Two paths to execution</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                    {c.paths.map((path) => (
                      <div key={path.name} style={{ border: `1px solid ${LINE}`, borderRadius: "12px", padding: "1.6rem", background: BASE }}>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".16em", textTransform: "uppercase", color: ACC, marginBottom: "1.2rem" }}>{path.name}</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: ".7rem", marginBottom: "1.2rem" }}>
                          {path.steps.map((s, i) => (
                            <div key={s} style={{ display: "flex", alignItems: "center", gap: ".7rem" }}>
                              <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "1.1rem", color: ACCD, width: "1.4rem" }}>{i + 1}</span>
                              <span style={{ fontSize: ".82rem", color: INK }}>{s}</span>
                            </div>
                          ))}
                        </div>
                        <p style={{ fontSize: ".78rem", color: FAINT, lineHeight: 1.55, fontStyle: "italic" }}>{path.note}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ textAlign: "center", marginTop: "1.5rem", fontFamily: "var(--font-mono)", fontSize: ".62rem", letterSpacing: ".14em", textTransform: "uppercase", color: ACC }}>
                    Both converge on: Execution-ready project · 10 minutes
                  </div>
                </div>
              </section>
            )}

            {/* ═══ CONVERT TO PROJECT (interactive, demand-owner-flow only) ═══ */}
            {slug === "demand-owner-flow" && (
              <section style={{ padding: "5rem var(--pad)", borderTop: `1px solid ${LINE}` }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".2em", textTransform: "uppercase", color: ACCD, marginBottom: ".5rem", display: "block" }}>The convergence point</span>
                  <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "1.4rem", color: INK, marginBottom: ".6rem" }}>One click, fully formed</h3>
                  <p style={{ fontSize: ".875rem", color: DIM, marginBottom: "2rem", maxWidth: "58ch" }}>Click convert. Every field an approved demand already has gets inherited; everything else, Tango generates.</p>
                  <div style={{ maxWidth: "560px" }}>
                    <ConvertToProjectDemo />
                  </div>
                </div>
              </section>
            )}

            {/* ═══ KEY INNOVATIONS ═══ */}
            {c.innovations && (
              <section style={{ padding: "5rem var(--pad)", borderTop: `1px solid ${LINE}` }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".2em", textTransform: "uppercase", color: ACCD, marginBottom: "2.5rem", display: "block" }}>Key innovations</span>
                  <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>
                    {c.innovations.map((inv, i) => (
                      <div key={inv.title} style={{ paddingTop: i === 0 ? 0 : "2.5rem", borderTop: i === 0 ? "none" : `1px solid ${LINE}` }}>
                        <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "1.2rem", color: INK, marginBottom: "1.2rem", letterSpacing: "-.01em" }}>
                          {String(i + 1).padStart(2, "0")} · {inv.title}
                        </h3>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.2rem" }}>
                          <div style={{ padding: "1rem 1.2rem", border: `1px solid ${LINE}`, borderRadius: "10px", background: BASE2 }}>
                            <div style={{ fontFamily: "var(--font-mono)", fontSize: ".5rem", letterSpacing: ".14em", textTransform: "uppercase", color: FAINT, marginBottom: ".6rem" }}>Before</div>
                            {inv.before.map((b) => <div key={b} style={{ fontSize: ".78rem", color: DIM, marginBottom: ".35rem" }}>{b}</div>)}
                          </div>
                          <div style={{ padding: "1rem 1.2rem", border: `1px solid ${LINA}`, borderRadius: "10px", background: "rgba(255,164,38,.04)" }}>
                            <div style={{ fontFamily: "var(--font-mono)", fontSize: ".5rem", letterSpacing: ".14em", textTransform: "uppercase", color: ACC, marginBottom: ".6rem" }}>After</div>
                            {inv.after.map((a) => <div key={a} style={{ fontSize: ".78rem", color: INK, marginBottom: ".35rem" }}>{a}</div>)}
                          </div>
                        </div>
                        <p style={{ fontSize: ".875rem", color: DIM, lineHeight: 1.7, maxWidth: "62ch", marginBottom: ".8rem" }}>{inv.rationale}</p>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: ".62rem", letterSpacing: ".1em", color: ACCD, fontStyle: "italic" }}>{inv.result}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* ═══ AI DISCOVERIES (interactive) ═══ */}
            {c.discoveries && (
              <section style={{ padding: "5rem var(--pad)", borderTop: `1px solid ${LINE}`, background: BASE2 }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".2em", textTransform: "uppercase", color: ACCD, marginBottom: ".5rem", display: "block" }}>AI enrichment, in the open</span>
                  <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "1.4rem", color: INK, marginBottom: ".6rem" }}>What Tango discovers, on one real project</h3>
                  <p style={{ fontSize: ".875rem", color: DIM, marginBottom: "2rem", maxWidth: "58ch" }}>Run it. Every step is shown, nothing inferred silently. This is the actual sequence: source scan, then insight reveal.</p>
                  <EnrichmentDemo />
                </div>
              </section>
            )}

            {/* ═══ CORE PRINCIPLES ═══ */}
            {c.principles && (
              <section style={{ padding: "5rem var(--pad)", borderTop: `1px solid ${LINE}` }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".2em", textTransform: "uppercase", color: ACCD, marginBottom: "2rem", display: "block" }}>Core design principles</span>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", borderTop: `1px solid ${LINE}`, borderLeft: `1px solid ${LINE}` }}>
                    {c.principles.map((p, i) => (
                      <div key={p.title} style={{ padding: "1.6rem 1.4rem", borderRight: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}` }}>
                        <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "1.6rem", color: ACC, display: "block", marginBottom: ".7rem", opacity: 0.6 }}>{String(i + 1).padStart(2, "0")}</span>
                        <h4 style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: ".88rem", color: INK, marginBottom: ".5rem" }}>{p.title}</h4>
                        <p style={{ fontSize: ".78rem", color: DIM, lineHeight: 1.6 }}>{p.detail}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* ═══ DECISIONS (legacy format, other slugs) ═══ */}
            {c.decisions && (
              <section style={{ padding: "5rem var(--pad)", borderTop: `1px solid ${LINE}` }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".2em", textTransform: "uppercase", color: ACCD, marginBottom: "2rem", display: "block" }}>Design decisions</span>
                  <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    {c.decisions.map((d, i) => (
                      <div key={i} style={{ padding: "1.6rem", border: `1px solid ${LINE}`, borderRadius: "12px", background: BASE2 }}>
                        <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "1rem", color: INK, marginBottom: ".8rem" }}>{d.decision}</h3>
                        <p style={{ fontSize: ".875rem", color: DIM, lineHeight: 1.7, marginBottom: d.before ? "1rem" : 0 }}>{d.reasoning}</p>
                        {d.before && d.after && (
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                            <div style={{ fontSize: ".78rem", color: FAINT }}><strong style={{ color: DIM }}>Before:</strong> {d.before}</div>
                            <div style={{ fontSize: ".78rem", color: ACCD }}><strong style={{ color: ACC }}>After:</strong> {d.after}</div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* ═══ QUOTES ═══ */}
            {c.quotes && (
              <section style={{ padding: "5rem var(--pad)", borderTop: `1px solid ${LINE}`, background: BASE2 }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".2em", textTransform: "uppercase", color: ACCD, marginBottom: "2rem", display: "block" }}>What users say</span>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>
                    {c.quotes.map((q) => (
                      <div key={q.attribution} style={{ padding: "1.6rem", border: `1px solid ${LINE}`, borderRadius: "12px", background: BASE }}>
                        <p style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "1rem", color: INK, lineHeight: 1.5, marginBottom: "1rem" }}>"{q.quote}"</p>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".08em", textTransform: "uppercase", color: FAINT }}>{q.attribution}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* ═══ LEARNINGS ═══ */}
            {c.learnings && (
              <section style={{ padding: "5rem var(--pad)", borderTop: `1px solid ${LINE}` }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".2em", textTransform: "uppercase", color: ACCD, marginBottom: ".5rem", display: "block" }}>For designers building AI products</span>
                  <h3 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "1.4rem", color: INK, marginBottom: "2rem" }}>Learnings that apply beyond this project</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.5rem" }}>
                    {c.learnings.map((l, i) => (
                      <div key={l.title} style={{ padding: "1.6rem", border: `1px solid ${LINE}`, borderRadius: "12px", background: BASE2 }}>
                        <div style={{ display: "flex", alignItems: "baseline", gap: ".8rem", marginBottom: ".9rem" }}>
                          <span style={{ fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: "1.4rem", color: ACC, opacity: 0.6 }}>{String(i + 1).padStart(2, "0")}</span>
                          <h4 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "1rem", color: INK }}>{l.title}</h4>
                        </div>
                        <p style={{ fontSize: ".85rem", color: DIM, lineHeight: 1.68, marginBottom: ".9rem" }}>{l.principle}</p>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: ".62rem", letterSpacing: ".04em", color: ACCD, fontStyle: "italic", paddingTop: ".8rem", borderTop: `1px solid ${LINE}` }}>{l.stat}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* ═══ REFLECTION ═══ */}
            {(c.reflectionWorked || c.reflectionDifferent) && (
              <section style={{ padding: "5rem var(--pad)", borderTop: `1px solid ${LINE}` }}>
                <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
                  <span style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".2em", textTransform: "uppercase", color: ACCD, marginBottom: "2rem", display: "block" }}>Looking back</span>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem" }}>
                    {c.reflectionWorked && (
                      <div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".16em", textTransform: "uppercase", color: ACC, marginBottom: "1.2rem" }}>What worked</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                          {c.reflectionWorked.map((r) => (
                            <div key={r.title}>
                              <div style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: ".9rem", color: INK, marginBottom: ".4rem" }}>{r.title}</div>
                              <p style={{ fontSize: ".8125rem", color: DIM, lineHeight: 1.65, marginBottom: r.metric ? ".4rem" : 0 }}>{r.body}</p>
                              {r.metric && <div style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", color: ACCD, fontStyle: "italic" }}>{r.metric}</div>}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {c.reflectionDifferent && (
                      <div>
                        <div style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".16em", textTransform: "uppercase", color: FAINT, marginBottom: "1.2rem" }}>What I'd do differently</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                          {c.reflectionDifferent.map((r) => (
                            <div key={r.title}>
                              <div style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: ".9rem", color: INK, marginBottom: ".4rem" }}>{r.title}</div>
                              <p style={{ fontSize: ".8125rem", color: DIM, lineHeight: 1.65 }}>{r.body}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}
          </>
        )}

        {/* ═══ OTHER FEATURES ═══ */}
        <section style={{ padding: "3rem var(--pad)", borderTop: `1px solid ${LINE}`, background: BASE2 }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".16em", textTransform: "uppercase", color: FAINT, display: "block", marginBottom: "1.2rem" }}>
              Other Trmeric features
            </span>
            <div style={{ display: "flex", flexWrap: "wrap", gap: ".75rem" }}>
              {project.subPieces
                ?.filter((p) => p.slug !== slug)
                .map((p) => (
                  <Link
                    key={p.slug}
                    href={`/work/trmeric/${p.slug}`}
                    style={{ fontFamily: "var(--font-mono)", fontSize: ".62rem", letterSpacing: ".12em", textTransform: "uppercase", color: DIM, border: `1px solid ${LINE}`, borderRadius: "4px", padding: ".5rem .9rem", display: "inline-block" }}
                  >
                    {p.title} →
                  </Link>
                ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
