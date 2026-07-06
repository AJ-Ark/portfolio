# Aravind Jegajeeva Rajasekar — Personal Design Portfolio

## Build brief for Claude Code

> **Who this is for:** A Claude Code session in VS Code. Read this file completely before writing any code. This is the single source of truth for the portfolio website. The builder should ask no clarifying questions — everything needed is here or explicitly marked `[PLACEHOLDER — Aravind to supply]`.

---

## 0. About Aravind

Aravind is a product designer whose thinking was shaped by three disciplines learned in sequence: six years of architecture at SPA Vijayawada (Council of Architecture licensed), self-taught web design and frontend development, and an M.Des in New Media Design at the National Institute of Design (NID), Gandhinagar. Architecture taught him to hold a system in his head at full scale while still caring about the door handle. Web development gave him a medium where he could build and test ideas the same day he had them. NID gave him the research rigour to know when an instinct is actually an insight — and when it isn't.

He is not a visual-only designer. He prototypes in code (single-file HTML/CSS/JS, sometimes 10,000+ lines), writes engineering specs, builds design systems, and sits in product strategy discussions as an equal. His prototypes are not wireframes — they are functional, interactive, data-driven artifacts that get used in client demos and product reviews. He works at the intersection of product thinking, interaction design, and frontend craft.

**Current role:** Senior Product Designer at Trmeric — an AI-native enterprise SaaS platform. Sole designer on the founding team, owning the full design surface from IA to production-grade prototypes.
**Education:** M.Des New Media Design, NID Gandhinagar (2024–2026). B.Arch, SPA Vijayawada (6 years, Council of Architecture licensed).
**Location:** Tiruchirappalli, Tamil Nadu, India.

---

## 1. Site architecture

This is a personal portfolio website with three (or more) project domains. The structure:

```
/                       → Home (landing)
/about                  → About page (bio, background, philosophy)
/work                   → Work index (all projects)
/work/trmeric           → Trmeric case study (umbrella)
/work/trmeric/[slug]    → Individual Trmeric feature deep-dives
/work/realm             → Realm of Elementals case study
/work/[old-project]     → Third project case study [PLACEHOLDER — Aravind to supply project name and details]
```

The architecture must be extensible — adding a fourth or fifth project domain should require only adding a new route and content file, not restructuring anything.

---

## 2. Design direction

### 2.1 What this is NOT

- Not a Dribbble gallery of pretty screens with no context.
- Not a minimalist single-page scroll with three thumbnail cards.
- Not a dark-mode-by-default "developer portfolio" with terminal aesthetics.
- Not a template. No Framer/Webflow template energy. No "Hi, I'm [name], a [role] based in [city]" hero.
- No numbered section markers (01 / 02 / 03) unless content is genuinely sequential.
- No generic stock-photo hero. No abstract gradient blob backgrounds.

### 2.2 What this IS

A portfolio that reflects how Aravind actually works: deep, research-grounded, systems-oriented, and built with craft. The site itself should feel like one of his prototypes — considered, interactive where it serves understanding, and showing real work rather than describing it.

**Personality keywords:** Warm but rigorous. Quiet confidence. Shows the thinking, not just the outcome. Indian sensibility without cliché. The kind of portfolio a design director reads top to bottom.

### 2.3 Design tokens (starting point — refine these)

**Typography:**
- Display: A characterful serif or semi-serif that feels warm and editorial — not cold Swiss modernism, not trendy geometric sans. Consider: Instrument Serif, Newsreader, Source Serif 4, or Fraunces. Pick one and commit.
- Body: A clean, highly readable sans-serif. Poppins is familiar to Aravind but might be too associated with Trmeric — consider Inter, General Sans, or Satoshi for distinction. Or use Poppins if the whole site should feel continuous with his work.
- Mono/utility: JetBrains Mono or similar, only for code snippets or data labels.

**Color:**
- The palette should be warm. Aravind's work lives in warm oranges (`#FFA426`), earthy tones, and teal accents (`#4A9E8E` — the Bioluminescent Teal from his thesis). These are his actual working colors, not arbitrary choices. Build the portfolio palette from this material:
  - A warm neutral for backgrounds (not pure white, not the cliché cream #F4F1EA)
  - `#FFA426` or a close sibling as the primary accent (this is literally his brand at Trmeric)
  - `#4A9E8E` or a teal/green as a secondary accent (this is literally his thesis accent color)
  - A near-black for text that has warmth (not pure #000, not cool gray)
- No neon. No acid green. No blue-heavy palettes.

**Layout:**
- Generous whitespace. Let content breathe.
- Asymmetric grids where they serve the content (not forced asymmetry for style).
- Case study pages should feel like editorial long-reads — the kind of thing you'd see in a well-produced design publication.
- Mobile-first responsive. It must work beautifully on phone screens.

**Signature element:**
- This is the ONE thing the portfolio should be remembered for. Suggestion (refine this): an interactive prototype embed system — the case study pages can literally embed his working HTML prototypes in sandboxed iframes so visitors can interact with the real thing, not just see screenshots. This is his superpower and no other portfolio does it.

### 2.4 Motion

- Page transitions: smooth, considered. Not flashy.
- Scroll-triggered reveals: subtle fade-up, not dramatic parallax.
- Hover states on project cards: meaningful, showing a hint of the project's personality.
- Respect `prefers-reduced-motion`.
- Ambient motion on the home page is fine if it serves the narrative. An orchestrated entrance sequence on first load can work if it's fast (<2s total).

---

## 3. Technology

**Stack:** Next.js (App Router) with TypeScript, Tailwind CSS.
**Why Next.js:** Static generation for speed, file-based routing for extensibility, and Aravind will iterate on this in Claude Code over time — React component architecture makes that clean.
**Hosting:** Vercel (assumed — optimize for it).
**Content:** MDX for case study pages. Project metadata in a central `/data/projects.ts` file so the work index and home page pull from one source.
**Fonts:** Google Fonts or self-hosted. No paid font dependencies.
**Images:** Use `next/image` for optimization. Placeholder images where Aravind hasn't supplied them yet — use solid color blocks with the project's accent color and a label like "Screenshot: Demand Canvas grid view" so he knows exactly what to replace.
**Prototype embeds:** An `<EmbedPrototype>` component that renders an iframe with sandbox attributes, a toolbar showing the prototype name, and expand/collapse controls.

---

## 4. Page specifications

### 4.1 Home / Landing

**Job:** Make someone want to keep reading. Establish who Aravind is and the caliber of his work in under 5 seconds.

**Content:**
- A headline that captures his positioning. Not "Hi, I'm Aravind." Something closer to his actual voice. Suggestion: draw from the way he describes himself in his thesis — the convergence of architecture, web, and design research. Keep it honest and specific, not clever-for-the-sake-of-it.
- A curated selection of 2–3 featured projects (Trmeric, Realm of Elementals, [third project]) as cards/tiles that lead into the case studies. Each card shows: project name, a one-line descriptor, a representative visual (screenshot or color block placeholder), and the project's accent color as a subtle design element.
- A brief "currently" section: "Senior Product Designer at Trmeric. M.Des New Media Design, NID Gandhinagar (2026)."
- Navigation to /about, /work, and individual projects.

**What it should NOT have:**
- A testimonials carousel.
- A "services" section.
- A contact form (a mailto link and LinkedIn are sufficient).
- An "experience" timeline on the homepage.

### 4.2 About

**Job:** Give context on how Aravind's background produced the designer he is today. This page should feel personal and editorial, not a resume dump.

**Content (draw from his real history):**
- The arc: Architecture at SPA Vijayawada (six years, Council of Architecture licensed) → self-taught web design and frontend development → NID Gandhinagar (New Media Design, M.Des) → Trmeric as sole product designer on the founding team.
- The thread that runs through all of it: he has always designed systems — buildings are systems, interfaces are systems, behaviors are systems. Architecture gave him the patience to think at multiple scales simultaneously. Code gave him a medium where he could test ideas the same day he had them. NID gave him the research rigour to know when an instinct is actually an insight.
- His design philosophy: he prototypes to think, not to present. The prototype IS the design artifact — not a translation of it. When engineering builds from his prototypes directly, that's the intended workflow.
- A professional headshot placeholder.
- Links: LinkedIn, email. GitHub if he wants.
- Education: NID Gandhinagar (M.Des New Media Design, 2024–2026), SPA Vijayawada (B.Arch, 6 years, Council of Architecture licensed).

**Tone:** First person. Honest. The same voice as his thesis "Note from the Author." Not performatively humble, not boastful. Just true.

### 4.3 Work index

**Job:** Show all projects at a glance. Let visitors filter or browse by domain/type.

**Content:**
- All projects as cards in a responsive grid.
- Each card: project name, domain tag (Trmeric / Academic / [Third domain]), a one-liner, a representative image, and the project accent color.
- Clicking a card goes to the case study page.
- Optional: filter pills by domain (All / Trmeric / Academic / Other).

### 4.4 Trmeric — Umbrella case study

**Job:** Explain Trmeric as a platform, Aravind's role, and then provide entry points into individual feature deep-dives.

**Structure:**

#### Hero section
- "Trmeric" as the project title.
- One-liner: "Designing the product experience for an AI-native enterprise platform — from demand intake to portfolio value realization."
- Role: Senior Product Designer. Sole designer on the founding team — Siddharth Bohra (CEO/Product), Roshan PR (Engineering Lead), and a small cross-functional team.
- Timeline: 2025–present.
- Clients referenced: Talvera, Solace Health, Meridian, Veltrix (show as subtle logo marks or text chips).

#### Context section
- What Trmeric is: An AI-native B2B SaaS platform for demand management, resource management, and portfolio management. It helps enterprises decide what to build, who builds it, and whether it delivered value.
- Why it matters: Enterprise demand management is broken — requests arrive as emails, get lost in spreadsheets, and have no lifecycle visibility. Trmeric introduces structured demand intake, AI-powered scoping (via an agent called Tango), and portfolio-level value tracking.
- Aravind's scope: He is the sole product designer on a founding team. He owns the full design surface — from information architecture and interaction design to the design system, high-fidelity prototyping, and client-facing deliverables. His prototypes are the product spec — engineering builds from them directly.
- Measured outcomes (use these as callouts in the case study, not in the hero): 99.8% reduction in time-to-scope for new demands; 87% task completion rate vs 23% baseline; 81% AI suggestion acceptance rate (Tango); 83% feature adoption across early accounts; +72 NPS; 4.6/5 CSAT.

#### Design system section
- Briefly showcase the Trmeric Design System v3: the token system, the warm "turmeric plant" palette, the Tango AI interaction patterns, the "no Claudian design" principle (his own coined rule against heavy left-border accents).
- A visual showing the design system in use — could be a grid of component examples or an embedded version of the DS HTML file.

#### Feature deep-dives (sub-project index)
A grid of cards linking to individual feature case studies. These are the ones worth showcasing (curated from the full prototype catalogue for portfolio relevance):

**1. Demand Owner Flow**
- Slug: `/work/trmeric/demand-owner-flow`
- One-liner: "The end-to-end journey from a new demand idea to a scoped, resourced initiative."
- What to cover: The new-user onboarding problem (Tango landing page was confusing), the storyboard-first approach, the canvas walkthrough tour, the Trucible-powered demand suggestions, the Tango pre-flight conversation design, the create-demand conversational overlay. Show the progression from blank state to a fully populated demand canvas.
- Key design decisions: Insight-before-action, progressive disclosure, Tango as a guide not a gatekeeper.
- Prototype: `demand-owner-flow-newuser.html` (can be embedded).

**2. Portfolio Monitor**
- Slug: `/work/trmeric/portfolio-monitor`
- One-liner: "A multi-portfolio explorer with persona-contextual views for portfolio leaders, CIOs, and cross-functional managers."
- What to cover: The force-graph multi-portfolio map, the persona-contextual category system (with different views for Portfolio Leader vs CIO vs Resource Manager vs Demand Manager), the canvas promotion from initiative-level to portfolio-level, Tango as a Gemini-in-Workspace style breathing pill, the product tour. The "less is more" directive from Sid that drove the progressive consolidation from v13 through v36.
- Key design decisions: One unified control bar replacing three rows. Categories as dock-style icon pills. Dynamic portfolio headers.
- Prototype: `portfolio-monitor-v36.html` (can be embedded).

**3. Project Manager Flow + RAID**
- Slug: `/work/trmeric/project-manager`
- One-liner: "A project status and execution management surface built on one principle: Up-level is the only path."
- What to cover: The production grid with RAG severity sparkle icons (animated glow/wiggle/vibrate by severity), the Up-level modal as the single update entry point, the RAID module, the Step 7 recap as an inline-editable surface, the engineering spec that was written alongside the prototype.
- Key design decisions: The sparkle button color-matching RAG state, the explicit "Move to UAT" stage advance replacing the rejected Tango sparkle badge on stage dots.
- Prototype: `project-manager-flow.html` (can be embedded).

**4. Tango — The AI Agent Design**
- Slug: `/work/trmeric/tango`
- One-liner: "Designing the interaction patterns for an AI agent that lives across every surface of an enterprise platform."
- What to cover: This is a cross-cutting case study about Tango's design language, not a single prototype. Cover: the five Tango interaction types (breathing pill, right-panel agent, inline suggestions, conversational overlays, contextual nudges), the AI gradient (`#8b5cf6→#FFA426`) reserved strictly for AI contexts, the "orange is brand, not AI" rule, the evolution from a static right-panel chat to the Gemini-in-Workspace expand-in-place pattern, the rotating contextual hints, the think-pill animation. Draw from multiple prototypes.
- Key design decisions: AI gradient never used decoratively. Tango never blocks — always suggests.

**5. Trucible — Knowledge OS**
- Slug: `/work/trmeric/trucible`
- One-liner: "An enterprise knowledge foundation with Wiki and Explorer modes, built to make organizational context searchable and alive."
- What to cover: The dual-mode design (Wiki as Tango-generated article, Explorer as folder/tree/list/graph), the qualitative context strength tiers (Deep Root / Warming Up / Seedling / Blank Slate replacing percentage scores), Trucible Trivia as a preview panel, connected sources with live status dots. Direction from Sid: "Trucible is a context management system, not a document management system."
- Prototype: `trucible-v5.html` (can be embedded).

**6. Signals — D3 Force Graph**
- Slug: `/work/trmeric/signals`
- One-liner: "An Obsidian-style force-directed signal map for early-warning detection across a project portfolio."
- What to cover: The D3 physics simulation with 90 nodes, the neighbour-highlight interaction pattern (borrowed from Obsidian), severity-coded dots, the PM flow integration via iframe. The journey from click-to-bloom to hover-to-highlight.
- Prototype: `trmeric-signals-briefing.html` (can be embedded).

**Optional features to include if depth is needed (shorter treatments):**
- Admin Console (self-service onboarding, agentic Tango walkthroughs)
- Kudos / Gamification (no-points streak model, 12 universal badges)
- Hub redesign (Measure/Mobilize/Magnify three-column structure, persona switching)
- Tango Personalized Home Screen (data cards from real user JSON)
- Veltrix portfolio review + initiative brief (client deliverable)
- Marketing website (three.js 3D ring scene)
- KP Lifecycle (18-step SVG lifecycle diagram for Solace Health)

### 4.5 Realm of Elementals — Case study

**Job:** Present Aravind's M.Des graduation project as a complete design research narrative.

**Project facts:**
- Title: "Realm of Elementals"
- Subtitle / descriptor: A WebAR butterfly-raising experience that extends the reach of the Tata Motors Lakehouse, Pimpri — designed for the people who will never visit it in person.
- Institution: National Institute of Design (NID), Gandhinagar.
- Programme: M.Des, New Media Design.
- Year: 2024–2026.
- Guide: Dr. Jignesh Khakhar (Disciplinary Lead, New Media Design).
- Client/partner: Tata Motors Lakehouse (Mr. S.J.R. Kutty).
- Collaborators: Shoban Shah (RCA), Ashish (AR development), Nivedita and Sarvesh (GP cohort).
- Keywords: WebAR, Ecological Identity, Care, Decentering, Behavioural Change.
- Accent color: Bioluminescent Teal `#4A9E8E`.

**Narrative arc (from the thesis document itself):**
The project started with a brief from Tata Motors on the NID portal in 2023 — an ecology + architecture + experience design + technology brief that matched Aravind's exact intersection of skills. Selected alongside Nivedita and Sarvesh. Early concepts explored confrontation-based approaches (Extinction Mirror, the Museum). After a break in 2024–25 where Aravind stepped back to observe as a consumer and nature-lover, the project restarted in November 2025 as "Realm of Elementals." The pivotal conceptual shift came not from a research paper but from a caterpillar — a *Daphnis nerii* Oleander Hawk Moth found near his home in Tiruchirappalli, initially mistaken for a snake by his mother, which Aravind identified and observed through its full lifecycle. That experience — of witnessing, of waiting, of something shifting from fear to curiosity to care — became the project's emotional spine. The research then pulled toward Milton Mayeroff (*On Caring*), Bernstein's decentering framework, and the neuroscience of behavioural change. Built March–May 2026. Graduated June 2026.

**Structure for the case study:**
1. The brief and why it mattered personally.
2. Research: nine ways of seeing nature, the confrontation-to-care pivot, the caterpillar moment.
3. Design: the WebAR experience design, the butterfly lifecycle as a care mechanic, screen flows.
4. Build: the technology stack, the AR implementation.
5. Reflection: "This project started with a butterfly and became a study of care."

**Visuals:** Aravind has the full thesis document as 11 HTML chapter files and a merged PDF. Selected spreads, diagrams, and screen captures should be used as images. Placeholder image blocks where specific exports haven't been supplied yet.

### 4.6 Third project — [PLACEHOLDER]

> **Aravind:** The site architecture has a slot at `/work/[slug]` ready for a third project. Two strong candidates from your actual work:
>
> **Candidate A — Elemental Bender (Interactive Installation, OTA Tokyo)**
> A real-time gesture-controlled installation using MediaPipe hand-tracking + Three.js, built for a public venue in Tokyo. 1,000+ participants interacted with it. This is a strong portfolio piece because it demonstrates physical-digital interaction design, technical implementation, and public-scale deployment — a rare combination. Slug suggestion: `/work/elemental-bender`.
>
> **Candidate B — An earlier academic/internship project** (e.g., TATA Motors design research internship, or architecture thesis work from SPA Vijayawada).
>
> When you've decided, fill in this section with:
> - Project name and slug
> - One-line descriptor
> - Timeline and your role
> - The narrative arc (problem → approach → outcome)
> - Key images/screenshots you want to feature
> - Whether it was professional, academic, or personal work
>
> The case study template is identical to the others — context, process, decisions, outcome.

---

## 5. Component inventory

Build these as reusable React components:

| Component | Description |
|---|---|
| `<ProjectCard>` | Card for the work index and home featured section. Props: title, slug, oneLiner, domain, accentColor, image. |
| `<CaseStudyLayout>` | MDX wrapper for case study pages. Handles hero, metadata strip, prose styling, image grids, and section navigation. |
| `<EmbedPrototype>` | Sandboxed iframe for embedding live HTML prototypes. Props: src, title, height. Toolbar with title and fullscreen toggle. Lazy-loaded. |
| `<ImageGrid>` | Responsive image grid for case study visuals. 1-col, 2-col, 3-col variants. Supports captions. |
| `<ProcessStep>` | For showing design process sequences — a step label, description, and optional image. NOT numbered by default (only number if the content is genuinely sequential). |
| `<DecisionBlock>` | For highlighting key design decisions — the decision, the reasoning, and optionally a before/after. Uses the accent color as a subtle left highlight. |
| `<MetaStrip>` | Horizontal strip showing project metadata: role, timeline, team, client/partner. |
| `<Navigation>` | Top nav with logo/name, links, and mobile hamburger. Sticky, minimal. |
| `<Footer>` | Simple footer with email, LinkedIn, and a copyright line. |

---

## 6. Content files structure

```
/src
  /app
    /page.tsx                    → Home
    /about/page.tsx              → About
    /work/page.tsx               → Work index
    /work/trmeric/page.tsx       → Trmeric umbrella
    /work/trmeric/[slug]/page.tsx → Feature deep-dives (MDX)
    /work/realm/page.tsx         → Realm of Elementals
    /work/[slug]/page.tsx        → Future projects
  /components
    /ProjectCard.tsx
    /CaseStudyLayout.tsx
    /EmbedPrototype.tsx
    /ImageGrid.tsx
    /DecisionBlock.tsx
    /Navigation.tsx
    /Footer.tsx
  /data
    /projects.ts                 → Central project metadata
  /content
    /trmeric
      /demand-owner-flow.mdx
      /portfolio-monitor.mdx
      /project-manager.mdx
      /tango.mdx
      /trucible.mdx
      /signals.mdx
    /realm.mdx
  /styles
    /globals.css                 → Tailwind base + custom tokens
  /public
    /images
      /trmeric/                  → Trmeric screenshots (placeholder blocks initially)
      /realm/                    → Realm of Elementals images
      /prototypes/               → HTML prototype files for iframe embedding
```

---

## 7. Build order

1. **Scaffold:** Next.js App Router project, Tailwind config with custom tokens (colors, fonts, spacing), global styles, font loading.
2. **Navigation + Footer:** Build these first so every page has chrome from the start.
3. **Home page:** Hero, featured projects (using placeholder content), "currently" section.
4. **Work index page:** Project grid with filtering.
5. **Trmeric umbrella page:** Hero, context, design system showcase, feature deep-dive index.
6. **One feature deep-dive (Demand Owner Flow):** Build the full case study template with MDX, `EmbedPrototype`, `ImageGrid`, `DecisionBlock`. This is the template all others follow.
7. **Realm of Elementals page:** Adapt the case study template for the thesis project.
8. **Remaining Trmeric deep-dives:** Clone the template, swap content.
9. **About page.**
10. **Polish pass:** Page transitions, hover states, scroll reveals, mobile responsiveness, meta tags, OG images.

---

## 8. What NOT to do

- Do not use `localStorage` or `sessionStorage`.
- Do not add a CMS, a blog, a contact form, or an analytics dashboard.
- Do not add dark mode toggle — pick one mode (light, warm) and commit. Dark mode can come later.
- Do not use any stock images or placeholder services like Unsplash. Use solid color blocks with descriptive labels for missing images.
- Do not add loading spinners or skeleton screens for initial build — the site is statically generated.
- Do not over-animate. One orchestrated entrance on the home page is fine. Scroll-triggered fade-ups are fine. Parallax, GSAP timelines, and page transition libraries are overkill for v1.
- Do not use numbered section markers (01, 02, 03) unless the content is a genuine ordered sequence.
- Do not write copy that sounds like a LinkedIn headline. Write like a designer talking to another designer.

---

## 9. Definition of done (v1)

A Next.js site that runs with `npm run dev` and deploys to Vercel, containing:

- A home page with a distinctive hero, 2–3 featured project cards, and navigation.
- A work index page showing all projects.
- A Trmeric umbrella case study with context, design system showcase, and a grid of 6 feature deep-dive cards.
- At least one complete feature deep-dive (Demand Owner Flow) with prose, image placeholders, design decisions, and a working prototype embed iframe.
- A Realm of Elementals case study page with the full narrative arc.
- A placeholder page for the third project.
- An about page with Aravind's background story.
- Responsive down to 375px. Keyboard-accessible. Reduced-motion respected.
- No broken links, no console errors, no layout shifts.
- All placeholder images clearly labeled with what should replace them.

---

## 10. Voice and copy guidance

When writing ANY copy for this site — headlines, descriptions, case study prose — follow these rules:

- Write in first person where it's Aravind speaking (About page, case study reflections). Use third person nowhere — this is his site, his voice.
- Be specific. "I built a 15-prototype design system for an enterprise SaaS platform" is better than "I create impactful digital experiences."
- Show the thinking. Every case study should make the reader feel like they understand WHY decisions were made, not just WHAT was built.
- No buzzwords: "leverage," "empower," "seamless," "cutting-edge," "innovative." These words are banned.
- The tone is: a senior designer explaining their work to a design director over coffee. Relaxed, specific, and confident without performing confidence.
- When in doubt, read Aravind's own thesis prose for his voice: "This project started with a butterfly and became a study of care. I did not plan that."
