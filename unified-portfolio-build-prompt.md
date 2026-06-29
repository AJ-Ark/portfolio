# Aravind J — Unified Immersive Portfolio

## Build brief for Claude Code

> **Who this is for:** A Claude Code session in VS Code. Read this file completely before writing any code. This is the single source of truth. The builder should ask no clarifying questions — everything needed is here or marked `[PLACEHOLDER — Aravind to supply]`. This is not a content brief; the three projects already have written one-pagers (linked below). This is a brief for the **unifying experience layer** that binds them into one award-calibre site.

---

## 0. The one-sentence brief

Build a single immersive portfolio that takes three existing project one-pagers — **Trmeric**, **Realm of Elementals**, and **Rippl** — and unifies them inside one spatial design language: an **architectural section you move through**, populated by a **particle ecosystem that behaves differently in each domain**. Full WebGL. But the job of the site is to land Aravind a senior product design / UX research role, so every spectacular moment must make his thinking *more* legible, never less.

**Existing material to read and absorb (do not rebuild these — extract their content and re-house it):**
- Trmeric one-pager: [Aravind to supply local path or URL]
- Realm of Elementals one-pager: [Aravind to supply local path or URL]
- Rippl one-pager: https://www.aravindj.xyz/rippl

---

## 1. The core concept (read this twice — everything depends on it)

### 1.1 The spatial metaphor: an architectural section

Aravind is a licensed architect. The site is built as an **architectural section** — a cut through a building that reveals its interior depth. The visitor does not scroll a flat page; they **move inward along a Z-axis**, from the public facade to the deepest private rooms.

This is not decoration. **The section IS the information architecture:**

```
PLANE 0  (facade / Z=0)      → Hero. Who Aravind is. The threshold.
PLANE 1  (Z=-1)              → The three domains, suspended in space as portals.
PLANE 2  (Z=-2)              → Inside a domain: the project case study (a "room").
PLANE 3  (Z=-3)              → Inside a project: features / sandbox / showcase (alcoves).
```

Moving deeper = scrolling / clicking a portal. Moving back out = a persistent "section indicator" (a thin architectural elevation line on the left edge showing current depth, like a building section drawing with the current floor lit). The visitor always knows how deep they are and how to surface.

**Architectural vocabulary to use literally in the visual system:**
- Section lines, datum lines, dimension ticks, axonometric grid, poché (the solid-fill of a cut wall) used as the dark mass behind content.
- Hairline construction lines that draw themselves in on scroll, like a drawing being plotted.
- A measured grid that never fully disappears — content sits *on* an architectural grid, not floating in void.

### 1.2 The living layer: a particle ecosystem

Within this built space lives a **particle system** — the same engine, three behaviours, one per domain. This is what makes the three projects feel like one organism while still being distinct.

| Domain | Particle behaviour | Why it's true to the project |
|---|---|---|
| **Trmeric** | Particles form a **structured lattice / data-grid** — they snap into orthogonal formation, flow along connections, resolve into order. | Trmeric is enterprise structure imposed on chaos: demand → resource → portfolio. Order emerging from noise. |
| **Realm of Elementals** | Particles drift **organically** — swarm, scatter, and coalesce into a **butterfly / wing silhouette** then dissolve. Soft, breathing, alive. | The thesis is care, lifecycle, decentering. Living motion. |
| **Rippl** | Particles emanate as **concentric ripple rings** from points of interaction — a drop, then waves outward across the field. | Rippl = "notes that ripple beyond the page." Literal. |

**The transition between domains is the signature moment:** as the visitor moves from one domain-room to the next, the particles **morph** from one behaviour into the next — the data-lattice loosens into an organic swarm loosens into ripple-rings. One continuous field of particles, re-choreographed. This single morphing field is the thing the site is remembered for. No other portfolio has it because no other person is an architect-who-codes-who-researches.

### 1.3 Why these two systems together

The **architecture** is the rigour (structure, depth, intentional space — his SPA Vijayawada self). The **particles** are the life (research, behaviour, ecology, care — his NID self). The frontend craft binding them in real-time WebGL is the web-developer self. **The site's form is literally an argument for who he is.** State this in the About section explicitly — it's the strongest narrative hook he has.

---

## 2. Non-negotiables (the awwwards/legibility contract)

This site must be simultaneously **immersive** and **recruiter-legible**. Resolve the tension with these hard rules:

1. **The 5-second test.** Within 5 seconds of load, a design director must know: this person is a senior product designer + researcher with an architecture background who builds his own prototypes. The hero earns the spectacle by stating this fast.
2. **Skip-to-content always available.** A persistent, quiet "View work →" affordance lets anyone bypass the cinematics and land on a clean, scannable work index. Recruiters in a hurry must never be trapped in an experience.
3. **Every immersive moment has a static fallback.** `prefers-reduced-motion` and low-power devices get a beautiful, fully-functional flat version. The content is identical; only the choreography is removed.
4. **Performance budget is sacred.** Target 60fps on a 2021 MacBook Air and a mid-tier Android. If the particle count threatens this, reduce particle count — never sacrifice scroll smoothness. Adaptive quality tiers based on device capability.
5. **Readability beats spectacle inside case studies.** Hero and domain-transitions can be heavy WebGL. Once inside a project (Plane 2/3), the WebGL recedes to an **ambient background** and the content becomes editorial long-read: high-contrast, generous type, fast. A design director reads case studies; they do not read particles.

---

## 3. Site architecture

```
/                          → Hero (Plane 0) + the three domain portals (Plane 1)
/work/trmeric              → Trmeric domain room (Plane 2)
/work/trmeric/[slug]       → Trmeric feature deep-dives / sandbox (Plane 3)
/work/realm                → Realm of Elementals room (Plane 2)
/work/realm/[slug]         → Realm sub-pieces (Plane 3)
/work/rippl                → Rippl room (Plane 2)
/work/rippl/[slug]         → Rippl sub-pieces (Plane 3)
/about                     → The architect-who-codes-who-researches narrative
/work                      → Flat, fast, scannable index (the recruiter bypass)
```

**Three domains, established in this order on the landing portal plane:**
1. **Rippl** — academic / industrial + interaction design. Research-led. (12 weeks, projector-lamp, OCR/handwriting, hi-fi UI.)
2. **Realm of Elementals** — M.Des graduation. WebAR, care, behavioural change.
3. **Trmeric** — professional. The enterprise SaaS body of work, with many sub-features as a sandbox/showcase.

> Note on ordering: Aravind specified "this project (Rippl), then Realm, then Trmeric." Honour that left-to-right / first-to-last order on the portal plane. But the **flat `/work` index** should let recruiters re-sort by recency or type.

**Extensibility:** adding a fourth domain = adding one portal on Plane 1 + one content route. The particle engine must accept a new "behaviour profile" as a config object, not a code rewrite.

---

## 4. The unified design language

The three existing one-pagers each have their own look. **Throw out their individual styling. Build one system that supersedes all three.** This is NOT the Trmeric design system (turmeric palette) — that belongs to the product. This is *Aravind's personal* language.

### 4.1 Palette — "drafting table at dusk"

A warm architectural-drawing palette, not a tech-portfolio palette:

- **Ground:** a deep warm near-black, like blueprint paper gone dark — `#14110E` or similar. Poché / cut-mass fills.
- **Paper:** a warm off-white for content planes — `#F2ECE0`, the colour of trace paper / vellum. Never pure white.
- **Graphite:** the line colour — a warm dark grey `#3A352E` for construction lines, grids, section marks.
- **Three domain accents** (each owns one accent; they appear as the particle colour + section highlight when you're in that room):
  - Rippl → a clear **water-cyan** (echo the site's existing `#78B9C5`).
  - Realm → **bioluminescent teal** `#4A9E8E` (the thesis colour).
  - Trmeric → **warm turmeric** `#FFA426` (the product colour).
- The accents are used *sparingly and meaningfully* — they tell you which domain's gravity you're in. The base experience is graphite-on-vellum-on-dark. Restraint is what reads as "senior."

No neon. No purple AI-gradients (that's a Trmeric-internal thing, not Aravind's). No glassmorphism. The reference is **architectural drawings, risograph print, and good editorial design** — not Dribbble.

### 4.2 Typography

- **Display:** a characterful editorial serif with architectural precision. Consider **Fraunces** (has an "architectural" optical axis) or **Newsreader**. Big, confident, set tight.
- **Body:** a clean grotesque — **Inter** or **General Sans**. Highly readable for long-form case studies.
- **Drafting/labels:** a mono — **JetBrains Mono** or a technical mono — used ONLY for the architectural apparatus: dimension ticks, section labels (`SECTION A–A`), depth indicators, metadata. This mono-as-drafting-annotation is a strong unifying motif. Use it like a draftsperson letters a drawing.

### 4.3 The persistent architectural apparatus

These elements appear site-wide and are the visual glue:

- **Section elevation indicator** (left edge): a thin vertical drawing showing the four planes as floors, the current one lit in the active domain accent. Click a floor to jump. This is the nav + the depth-meter + the wayfinding, all one element.
- **Datum line:** a single horizontal hairline that runs across every page at a consistent height — content hangs off it. The "ground line" of the drawing.
- **Dimension annotations:** key numbers (12 weeks, 87% completion, 1000+ participants) are presented as *dimension callouts* — the number with architectural extension lines and ticks, as if measuring the work. This turns metrics into part of the drawing language. Strong, ownable, and recruiter-friendly (numbers pop).
- **Plot-in animation:** construction lines and content draw themselves in on enter, like a plotter laying down a drawing. Fast (<1.2s), respects reduced-motion.

---

## 5. The experience, plane by plane

### 5.1 PLANE 0 — Hero / facade

- Open on the **morphing particle field** in its resting state, suspended in dark space, with the first construction lines plotting in.
- Headline plots in — Aravind's positioning, fast and honest. Draft (refine): *"Architect by training. Designer by practice. I build the thing to understand the thing."* Or pull from his real voice. The point: architecture + design + builder, in one breath.
- Below: a single quiet line of who/what — "Senior Product Designer & UX Researcher · M.Des New Media Design, NID Gandhinagar."
- Persistent **"View work →"** bypass (the recruiter escape hatch) and the section indicator, both present from second one.
- A clear scroll/move-inward affordance. Moving inward transitions camera depth from Z=0 toward Plane 1, particles beginning to organise.

### 5.2 PLANE 1 — The three portals

- Three portals suspended in the architectural section, in order: **Rippl · Realm · Trmeric**.
- Each portal is a "doorway" in the section — an architectural opening (think a framed aperture, axonometric) through which you glimpse that domain's particle behaviour: ripples for Rippl, the butterfly-swarm for Realm, the data-lattice for Trmeric. Hovering a portal makes its particle behaviour bloom and pulls its accent colour forward.
- Each portal card carries only: domain name, one honest line, the dimension-callout of its headline metric, and the accent. No paragraph. The portal sells the *idea*; the room delivers the depth.
- Entering a portal = camera dives through the aperture to Plane 2, the particle field morphing into that domain's behaviour during the transit. **This transit is the signature moment — make it cinematic but <1.5s.**

### 5.3 PLANE 2 — The domain room (case study)

Once inside, **WebGL recedes to ambient background** and content becomes a focused editorial long-read. Each room follows one template:

- **Room hero:** domain title, the descriptor, a metadata strip as drafting annotations (role, duration, year, keywords — set in the mono, as a drawing's title block).
- **The narrative:** problem → research → approach → outcome. Long-form, first person, specific. Pull the real content from the existing one-pagers — do not invent.
- **Dimension callouts** for the metrics.
- **Decision blocks:** the key design decisions, with the *why*. This is what gets Aravind hired — show the reasoning.
- **Image grids / embedded media** from the source material. Placeholder blocks (solid accent colour + descriptive label like `Screenshot: Rippl marking & recognition`) where exports aren't yet supplied.
- **Sub-piece index (Plane 3 entry):** a grid of the smaller features / sandbox items within this domain.

**Per-domain content anchors (from the real material):**

- **Rippl** (`/work/rippl`): A 12-week project. A projector-table-lamp that fights distracted reading and turns notetaking into a two-way interaction ("notes that ripple back to you"). Research-led: questionnaires with NID peers, triad analysis, pain-point synthesis (impaired focus, limited retention, lack of interactive experience). Industrial form (table-lamp → camera-vision → portable projector). Working prototypes: OCR text recognition, Python handwriting-recognition model, projector-camera swivel. Hi-fi UI: marking & saving, sorting/categorising, history navigation. Show the **research-to-hardware-to-interface** full-stack range — this is his proof he's a researcher, not just a visual designer.
- **Realm of Elementals** (`/work/realm`): M.Des graduation, NID Gandhinagar (2024–2026). A WebAR butterfly-raising experience that **extends the reach** of the Tata Motors Lakehouse (Pimpri) to people who'll never visit in person. Built on Mayeroff's *On Caring* and Bernstein's decentering. The conceptual pivot: a *Daphnis nerii* Oleander Hawk Moth caterpillar found near his home in Tiruchirappalli, mistaken for a snake by his mother, raised through its full lifecycle. Confrontation → care. Guide: Dr. Jignesh Khakhar. Keywords: WebAR, ecological identity, care, decentering, behavioural change. Accent teal.
- **Trmeric** (`/work/trmeric`): Professional. Senior Product Designer, sole designer on the founding team (Siddharth Bohra, CEO/Product; Roshan PR, Eng Lead). An AI-native enterprise SaaS platform for demand → resource → portfolio management. He owns the full design surface; his prototypes are the spec engineering builds from. Metrics as dimension callouts: 99.8% time-to-scope reduction; 87% completion vs 23% baseline; 81% Tango suggestion acceptance; 83% adoption; +72 NPS; 4.6/5 CSAT. This is the domain with the deepest Plane-3 sandbox.

### 5.4 PLANE 3 — Sub-pieces / sandbox / showcase

The deepest plane. Small features, experiments, and showcase pieces within a domain. **Two presentation modes, mixable:**

- **Sandbox:** for the things Aravind built as working code — an `<EmbedPrototype>` sandboxed iframe so a recruiter can *use the real thing*. This is his unfair advantage; lean into it for Trmeric features and any Rippl/Realm interactive pieces.
- **Showcase:** for things best shown as curated screenshots / video — an image-and-caption gallery.

A given sub-piece page mixes both: a short context paragraph, the live sandbox if one exists, and a screenshot showcase of states that don't demo well live.

**Trmeric Plane-3 candidates** (curate for portfolio relevance; full list in the prior Trmeric brief): Demand Owner Flow, Portfolio Monitor, Project Manager + RAID, Tango (AI agent design language), Trucible (knowledge OS), Signals (D3 force graph). Each is a sandbox or showcase or both.

**Realm Plane-3 candidates:** the WebAR experience walkthrough, the badge/image-marker system, the seven-day care arc, the lifecycle screens.

**Rippl Plane-3 candidates:** the OCR/handwriting prototype clips, the projector-swivel visualisation, the hi-fi UI flows (marking, sorting, history).

---

## 6. Technology

- **Stack:** Next.js (App Router) + TypeScript + Tailwind.
- **3D/WebGL:** **React Three Fiber + drei** for the particle system and camera depth-rig. The particle engine is GPU-instanced (`Points` / instanced meshes, shader-driven) so tens of thousands of particles morph at 60fps. The three domain behaviours are **shader uniforms / config profiles** swapped on transition — one engine, three profiles, one morph.
- **Camera depth-rig:** a single scroll/interaction-driven camera that travels the Z-axis across the four planes. Plane transitions are camera dollies, not page reloads — but each plane still maps to a real route for shareability and SEO.
- **Scroll/transition orchestration:** keep it lean — prefer R3F's own loop + a light scroll lib over a heavy GSAP timeline. One orchestrated entrance, smooth plane dollies, nothing gratuitous.
- **Content:** MDX for case studies. Central `/data/projects.ts` for domain + sub-piece metadata (so portals, `/work` index, and section indicator all read one source). Particle behaviour profiles in `/data/particle-profiles.ts`.
- **Prototype embeds:** `<EmbedPrototype>` — sandboxed, lazy-loaded iframe with a drafting-style toolbar (title in mono, fullscreen toggle).
- **Adaptive quality:** detect device tier; scale particle count + resolution. Hard fallback to the static flat version on `prefers-reduced-motion` or WebGL-unavailable.
- **Hosting:** Vercel. Static-generate every plane that can be. Lazy-load the WebGL bundle so first paint (text + skip link) is instant even before the 3D hydrates.
- **Images:** `next/image`. Placeholder colour blocks with descriptive labels where exports aren't supplied.

---

## 7. Component inventory

| Component | Role |
|---|---|
| `<ParticleField>` | The R3F GPU particle engine. Accepts a behaviour profile; handles morph transitions between profiles. The heart of the site. |
| `<SectionRig>` | The camera depth-rig. Maps scroll/route to Z-plane. Drives plane transitions. |
| `<SectionIndicator>` | Left-edge architectural elevation showing the four planes; current depth lit in active accent; click-to-jump. Nav + wayfinding + depth-meter. |
| `<DatumLine>` | The persistent horizontal ground hairline content hangs off. |
| `<DimensionCallout>` | A metric rendered as an architectural dimension annotation (number + extension lines + ticks + mono label). |
| `<DomainPortal>` | A Plane-1 aperture into a domain; glimpses its particle behaviour; pulls accent on hover; dives in on click. |
| `<CaseStudyLayout>` | Plane-2 MDX wrapper: title block, drafting metadata strip, editorial prose, decision blocks, image grids, sub-piece index. |
| `<DecisionBlock>` | A highlighted design decision: the call, the reasoning, optional before/after. Accent left-rule. |
| `<EmbedPrototype>` | Plane-3 sandboxed live-prototype iframe with drafting toolbar + fullscreen. Lazy. |
| `<ShowcaseGallery>` | Plane-3 screenshot/video gallery with captions. |
| `<PlotInLines>` | The construction-line draw-in animation wrapper. Reduced-motion aware. |
| `<WorkIndex>` | The flat, fast, no-3D recruiter-bypass list at `/work`, re-sortable. |
| `<Navigation>` / `<Footer>` | Minimal chrome: name as a drafting title-block mark; email; LinkedIn. |

---

## 8. Build order

1. **Scaffold:** Next.js + TS + Tailwind + R3F/drei. Design tokens (palette, type, drafting mono). Global styles. Font loading. Lazy-load boundary for the WebGL bundle so text paints first.
2. **The architectural apparatus (no 3D yet):** `<SectionIndicator>`, `<DatumLine>`, `<DimensionCallout>`, `<PlotInLines>`, drafting type system. Build the *flat* `/work` recruiter-bypass index now — prove the site is fully usable with zero WebGL before any spectacle exists. **This is the legibility insurance.**
3. **`<ParticleField>` engine** with ONE profile (Rippl ripples) — get GPU particles at 60fps first.
4. **Add the other two profiles** (Realm organic/butterfly, Trmeric lattice) + the morph between profiles. Tune the signature transition.
5. **`<SectionRig>` camera depth-rig:** Planes 0→1 working — hero into the three portals, particles morphing on transit.
6. **`<CaseStudyLayout>` (Plane 2)** with one domain fully built end-to-end (**Rippl** — the content is already public and complete). This is the template all rooms follow.
7. **Plane 3** for Rippl: one `<EmbedPrototype>` + one `<ShowcaseGallery>`.
8. **Realm + Trmeric rooms** — clone the template, pour in content from their one-pagers, swap accent + particle profile.
9. **Trmeric Plane-3 sandbox** — the six curated feature deep-dives.
10. **About** — the architect/designer/builder argument, explicitly tying the site's own form to who he is.
11. **Polish:** plane-transition timing, plot-in choreography, reduced-motion + low-power fallbacks, adaptive quality tiers, mobile, meta tags, OG images, 90fps-feel audit on a mid Air.

---

## 9. What NOT to do

- No `localStorage`/`sessionStorage`.
- No generic "particles.js floating dots" — particles must always be *doing* one of the three meaningful behaviours, never ambient confetti.
- No purple AI-gradient (Trmeric-internal only). No neon, no glassmorphism, no dark-mode-developer-terminal aesthetic.
- No trapping the recruiter: the bypass and the static fallback are mandatory, not optional.
- No "Hi, I'm Aravind, a designer based in…" hero. No numbered 01/02/03 section markers unless content is genuinely sequential (dimension annotations are fine — they're drawing language, not list markers).
- No buzzwords in copy: leverage, empower, seamless, innovative, cutting-edge — banned.
- Don't let the WebGL block first paint, ever. Text and the skip-link render first.
- Don't rebuild the three one-pagers' individual styling — supersede them with the one unified language.

---

## 10. Voice & copy

- First person throughout — his site, his voice.
- Specific over impressive: "I trained an OCR + handwriting model and built the projector-camera rig" beats "I create immersive learning experiences."
- Show the thinking. Every room makes the reader understand *why*, not just *what*.
- The tone: a senior designer explaining their work to a design director over coffee — relaxed, exact, confident without performing it.
- The About page must explicitly name the trick: the site's architecture-plus-particles form is itself the argument — structure from architecture, life from research, real-time craft from code. Say it plainly; it's his single strongest hook.

---

## 11. Definition of done (v1)

- Loads with text + skip-link instantly; WebGL hydrates after.
- Hero passes the 5-second test; persistent recruiter bypass present from load.
- Three portals on Plane 1, in order Rippl · Realm · Trmeric, each glimpsing its particle behaviour.
- The morphing particle field works across all three profiles with a clean signature transition, holding 60fps on a 2021 Air.
- All three domain rooms built from real content, each with its accent + particle profile.
- At least Rippl fully built to Plane 3 (one live sandbox + one showcase). Trmeric has its six-feature sandbox index.
- Flat `/work` index fully usable with zero WebGL.
- `prefers-reduced-motion` + WebGL-absent both yield a complete, beautiful static site.
- Responsive to 375px. Keyboard-accessible. No console errors, no layout shift, no broken links.
- All placeholder media clearly labelled with what replaces it.
