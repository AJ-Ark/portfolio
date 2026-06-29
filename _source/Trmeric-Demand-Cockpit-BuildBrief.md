# Trmeric — Demand Cockpit
### A single-file prototype build brief for Claude Code

> **Working name:** "Demand Cockpit." This is a **new, standalone vision** — *not* an edit of the existing demand-owner prototype. Build it from scratch as one self-contained HTML file.
>
> **Source of ideas:** concepts were distilled from a client (EY) reference deck, but **we do not copy their design**. We take the *interaction concepts and information architecture* only, and re-express everything in Trmeric's own visual language defined in §2. If anything here resembles a generic enterprise look (flat grey, black pill buttons, hard tab underlines, heavy grey empty boxes) — that is wrong; follow §2.

---

## 0. How to use this brief (instructions to the builder)

1. **Deliverable:** one self-contained `demand-cockpit.html` file. No build step, no framework, no external JS except fonts. Vanilla HTML + CSS + JS. Inline SVG for all icons and charts. It must run by simply opening the file in a browser.
2. **No backend.** All data is mocked in a JS object at the top of the script (see §5). Wire every interaction against that in-memory data; re-render on change. No `localStorage`.
3. **Use only the design tokens and component rules in §2.** Do not introduce new colors, fonts, or a different button style.
4. **Build the screens in §3 and the features in §4.** Each feature has anatomy, states, interactions, and acceptance criteria — satisfy the acceptance criteria.
5. **Fidelity bar:** this should look like a polished product prototype, not a wireframe. Real spacing, hover states, smooth transitions, micro-interactions, empty/loading/error states where noted.
6. **Accessibility-lite:** semantic buttons, keyboard-dismiss for overlays (Esc), focus-visible outlines. No ARIA audit needed for a prototype.

---

## 1. The vision — what we're building and why

**The Demand Cockpit is the demand owner's command surface.** It answers three questions instantly for every demand:

> **Where is it in its journey · what's blocking it (and who owns the next action) · what unblocks the next stage.**

That spine is the whole product thesis. Everything in this prototype exists to make a demand's *state and next action* legible and one click away. A demand is never just a status string — it is a stage, a set of blocking actions with owners, and a clear "to advance, you must…" gate.

**Primary persona:** a demand owner / demand manager (call them "Sam") who oversees a portfolio of demands and needs to triage what needs attention and act without digging.

**Two screens, one drawer:**
- **Demand Grid** (home) — the list of demands, each row expandable in place into its open actions.
- **Demand Detail** — a single demand's full record across lifecycle sections, with readiness state per section.
- **Tango drawer** — the AI assistant rail that, among other things, surfaces the stage-gate ("to advance, you must…") for the active demand.

---

## 2. Trmeric design system (authoritative — build to this)

### 2.1 Design tokens — put these in `:root`
```css
:root{
  /* Brand — orange is for forward motion / brand / primary CTA ONLY */
  --orange:#FFA426; --orange-deep:#F89622; --orange-dark:#E67E10; --orange-subtle:#FFF8F0;
  /* Neutrals */
  --n900:#1a1a1a; --n800:#333; --n700:#444; --n600:#666; --n500:#777; --n400:#999;
  --n300:#bbb; --n200:#e5e5e5; --n150:#eef0f3; --n100:#f4f5f7; --n50:#fafafa; --white:#fff;
  /* Semantic — meaning only, never decoration */
  --success:#10b981; --success-bg:#eaf7ef;
  --error:#e5484d;   --error-bg:#fdecec;
  --warning:#d08a00; --warning-bg:#fff4e6;
  --info:#3b82f6;    --info-bg:#eff6ff;
  /* AI / Tango — gradient reserved exclusively for AI/Tango contexts */
  --purple:#8b5cf6;  --purple-bg:#f5f3ff;
  --gradient-ai:linear-gradient(135deg,#8b5cf6 0%,#FFA426 100%);
  /* Radii */
  --r-sm:4px; --r-md:6px; --r-base:8px; --r-lg:12px; --r-xl:16px; --r-2xl:20px; --r-full:9999px;
  /* Shadow */
  --sh-1:0 1px 3px rgba(20,24,40,.06); --sh-2:0 2px 8px rgba(20,24,40,.06);
  --sh-3:0 4px 14px rgba(20,24,40,.08); --sh-4:0 16px 44px rgba(20,24,40,.18);
}
```
- **Font:** Poppins (Google Fonts), weights 400/500/600/700/800. Body 14px, line-height ~1.55.
- **Page background:** `--n150` (#eef0f3). Content sits on white floating cards.

### 2.2 Component rules (non-negotiable conventions)
- **Buttons are pills** (`border-radius:var(--r-full)`). Primary = solid orange (`--orange`) with white text, used sparingly (one primary per region). Secondary = white with `--n200` border. Ghost = transparent. **Never use solid-black pill buttons.**
- **Chips** (priority, status, readiness) are small pill tags with a tinted background + matching text color from the semantic set. Examples: High → `--error-bg`/`--error`; Medium → `--warning-bg`/`--warning`; Low → `--success-bg`/`--success`. Status chips (To Do / In Progress / Completed) use info/warning/success respectively.
- **Cards** are the primary surface: white, `1px solid var(--n200)`, `--r-xl` to `--r-2xl`, `--sh-2`/`--sh-3`. This is the "floating-card shell." Sections live inside cards.
- **No "Claudian design":** never use a thick colored left border-rail on cards or rows. Differentiate with chips, soft top/bottom dividers (`1px solid var(--n100)`), and spacing — not heavy rails.
- **Dividers** are soft 1px `--n100`/`--n150`. **No hard underlined tab bars in black** — active tab = orange text + 2px orange underline, inactive = `--n600`.
- **AI gradient** (`--gradient-ai`) appears ONLY in Tango / AI affordances (the Tango launcher, AI action buttons, "Generate with Tango"). Never as decoration elsewhere.
- **Avatars:** 28–32px circles, soft pastel background per person, initials in `--n900`.
- **Motion:** transitions 120–260ms, easing `cubic-bezier(.34,1.35,.5,1)` for playful pops, `cubic-bezier(0,0,.2,1)` for calm reveals. Expansions animate height/opacity; popovers scale from their anchor.
- **Icons:** inline SVG, 1.8–2px stroke, `currentColor`, ~16–18px.
- **Toasts:** dark pill (`--n900`), white text, bottom-center, auto-dismiss ~2.1s.

---

## 3. Screen architecture

Single-file app. A thin top app-bar (logo left; bell / settings / avatar right). A slim right icon-rail is optional and cosmetic (Tango, Demands, Actions) — keep it light, not a heavy nav. Main content area switches between **Grid** and **Detail** views via JS (no router). The **Tango drawer** slides in from the right over either view.

```
┌─────────────────────────────────────────────────────────────┐
│ trmeric            Demand Cockpit            🔔  ⚙  (avatar)  │  app bar
├─────────────────────────────────────────────────────────────┤
│  VIEW: Grid  ⇄  Detail            (Tango drawer overlays)     │
└─────────────────────────────────────────────────────────────┘
```
- **Grid view** is home. Clicking a demand's title/row → **Detail view** for that demand. A back affordance returns to Grid.
- **Tango drawer** opens from a Tango launcher (top pill or right-rail icon) and is contextual to the current demand when in Detail.

---

## 4. Feature specifications

Each feature = **Concept** (what we're taking) → **Our build** (the Trmeric expression) → **Anatomy / States / Interactions** → **Acceptance criteria**.

---

### F1 — Demand Grid with expand-in-place action table  *(centrepiece)*

**Concept.** A demand row expands *in place* to reveal its open actions as a compact table, so "what's blocking this and who owns it" is answered without navigating away.

**Our build.** The Grid is a stack of **demand cards** (not flat grey rows). Each collapsed card shows a summary row. An "N Actions" pill + chevron on the right expands the card downward to reveal an inline **action table** styled in Trmeric chips/avatars.

**Anatomy — collapsed demand card (one per demand):**
- Top line: demand ref (e.g., `DMD0001663`, small, `--n400`) and **demand title** (16px, 600).
- Right cluster: an **"N Actions" pill** (count of open actions) + chevron toggle.
- Summary row (label/value pairs, label in `--n400` 10.5px uppercase, value 13px): **Priority** (chip), **Portfolio**, **Total Cost**, **Budget**, **Manager** (avatar+name), **Creator** (avatar+name), **Status** (a mini stage progress bar + current stage label + "Xh in this stage").
- The visible summary columns are controlled by the Customize chooser (F5).

**Anatomy — expanded action table (revealed inline beneath the summary row):**
- A soft divider, then a lightweight table with header row (uppercase `--n400` 10px): **☑ · Priority · Task · Due · Assigned to · Section · Status · Created by**.
- Each action row: a checkbox (mark complete), priority chip, task name, due date, assignee avatar+name (or "Unassigned" with a neutral avatar), a **Section** chip (e.g., Scope, Business Case), a **Status** chip (To Do / In Progress / Completed), creator avatar+name.
- Row hover: subtle `--n50` background. Checking a box → strike-through + move to Completed status + toast "Action completed."

**States:** collapsed (default); expanded; empty (a demand with 0 open actions shows "No open actions — all clear ✓" in the expanded area, not a grey box).

**Interactions:** clicking the Actions pill / chevron toggles expansion with a height+opacity animation. Multiple cards may be open at once. Clicking the demand **title** opens Detail (F-detail). The chevron rotates on expand.

**Acceptance criteria:**
- [ ] At least 5 demand cards render from mock data with varied priority/stage/owners.
- [ ] Expanding a card reveals its real actions from data; counts match.
- [ ] Checking an action updates its status and the "N Actions" count live.
- [ ] No flat-grey rows, no black pills, no left rails — Trmeric cards + chips only.

---

### F2 — Lifecycle stage bar

**Concept.** A horizontal stepper makes a demand's position in its journey instantly readable, beating a single status word.

**Our build.** A 5-node horizontal stage bar: **Intake → Evaluation → Scope & Solutioning → Approval → Fulfilment.** Each node has a state: `complete` (filled green check), `current` (filled orange dot, bold label), `upcoming` (hollow grey). Connectors between nodes fill green up to current, grey after.

**Where it appears:** full-width at the top of **Detail view**; and as a **compact** version (just the colored segments + current stage label) inside each Grid card's Status column.

**States per node:** complete / current / upcoming. **Colors are semantic only** — green complete, orange current, grey upcoming. No black.

**Acceptance criteria:**
- [ ] Detail view shows the full labelled stage bar reflecting the demand's `stage`.
- [ ] Grid card Status shows the compact segmented version + "Xh in this stage."

---

### F3 — "To advance, you must…" stage-gate panel  *(in Tango drawer)*

**Concept.** Convert an ambiguous status into a concrete checklist of what unblocks the next stage.

**Our build.** When the Tango drawer is open on a demand, its top block is a **stage-gate card**: a one-line state summary + a "To move to *{next stage}*, you must:" checklist. Each checklist item is actionable — it links/scrolls to the section or action that satisfies it, and shows a check once satisfied.

**Anatomy:** Tango header (AI gradient sparkle + "Tango"), then: `"{Demand} is ready for {currentStage}."` then `"To move to {nextStage}, you must:"` followed by 2–4 items, each with a hollow/filled check and a short label (e.g., "Confirm demand details are reviewed", "Create a solution", "Resolve 2 high-priority actions"). Below: 2–3 suggested-prompt pills (ghost pills) and the "Ask Tango" input (pill, AI gradient border).

**States:** item satisfied (green check, muted text) vs outstanding (hollow check, link-styled). When all satisfied → the panel shows a primary "Advance to {nextStage}" pill.

**Acceptance criteria:**
- [ ] The gate reflects the active demand's stage and its real outstanding items (derived from unreviewed sections + open high-priority actions in data).
- [ ] Clicking an outstanding item scrolls to / highlights the relevant section.
- [ ] Satisfying all items reveals the "Advance" primary action (prototype: advances the stage in-memory + toast).

---

### F4 — Section readiness chips + per-section review

**Concept.** Each section of a demand carries a readiness state and a reviewer sign-off, rolling up to the demand.

**Our build.** In **Detail view**, the demand record is a set of section cards (Details, Problem Statement, Description, Objectives, Key Results, Ownership, Financials…). Each section header has a **readiness chip** — `Incomplete` (grey) → `Action Required` (amber) → `Pending Review` (neutral) → `Reviewed` (green) — and a **"Mark as Reviewed" → "Reviewed"** toggle button. The demand's overall outline chip rolls up: if all sections reviewed → `Complete` (green), else `Incomplete` (grey).

**Interactions:** clicking "Mark as Reviewed" flips that section to Reviewed (green), updates the rollup, and may satisfy an F3 gate item. An "Edit Section" ghost button is present (prototype: toggles a simple editable state or just a toast).

**Acceptance criteria:**
- [ ] Each section shows a readiness chip + review toggle.
- [ ] Reviewing all sections flips the demand rollup to Complete and ticks the matching F3 gate item.

---

### F5 — Customize column chooser (Grid)

**Concept.** Let the user choose which summary columns appear on demand cards.

**Our build.** A **"Customize"** secondary pill in the Grid toolbar opens a popover with checkboxes: Priority, Portfolio, Total Cost, Budget, Manager, Creator, Status. Toggling re-renders the Grid cards' summary row to show only checked columns. Trmeric checkbox styling; popover is a white card with `--sh-4`.

**Acceptance criteria:**
- [ ] Toggling a column hides/shows it across all demand cards immediately.
- [ ] Popover dismisses on outside-click / Esc.

---

### F6 — Tabbed sub-sections with count badges (Detail, where dense)

**Concept.** Split an overloaded section into tabs with item counts to tame density — *only where genuinely needed.*

**Our build.** For the heaviest grouping (e.g., the "Request Outline" group containing Overview / Strategy / Ownership / Financials), use a **stable-order tab strip**: active tab = orange text + 2px orange underline; each tab carries a small count chip. **Tabs never reorder on selection** — only the panel content changes. (This mirrors a fix we already standardized.) Do not tab-fragment light sections.

**Acceptance criteria:**
- [ ] Tab strip switches panel content without reordering tabs.
- [ ] Count chips reflect items per tab.

---

### F7 — Export modal + per-section overflow actions

**Concept.** Controlled export (pick parts + format) and per-section quick actions.

**Our build.** A **Download** secondary pill opens a modal: checkboxes for which parts to include (Outline / Scope / Work Order…) + format radios (PDF / CSV) + Cancel / primary Download (prototype: toast "Exported …"). Each section's overflow (⋯) menu offers **"Create an action"** (prototype: adds an action to that section + toast) and **"Exclude this section"** (prototype: dims/marks it excluded).

**Acceptance criteria:**
- [ ] Export modal opens, selections are reflected in the toast summary, dismiss on Esc/outside-click.
- [ ] Section ⋯ menu offers Create action / Exclude and both do something visible.

---

### F8 — Tango drawer (the AI rail)  *(supporting)*

**Concept.** A persistent assistant that hosts the stage-gate (F3), suggestions, and chat.

**Our build.** A right-side drawer (≈360px) sliding over content. Header: AI-gradient sparkle + "Tango" + expand + close. Body: the F3 stage-gate card (when on a demand) + a short list of Tango-generated insights (warm, specific — e.g., "2 high-priority actions are unassigned; assign owners to unblock evaluation"). Footer: suggested-prompt ghost pills + "Ask Tango" pill input with AI-gradient border. An **"actions Tango has taken · N"** chip is visible in the header to show agency.

**Acceptance criteria:**
- [ ] Drawer opens/closes smoothly from a launcher and over both views.
- [ ] On a demand, it shows that demand's gate + at least 2 specific insights.

---

## 5. Mock data (seed the prototype with this shape; expand to ≥6 demands)

```js
const PEOPLE = {
  AM:{name:'Andrea M.', av:'AM', c:'#cfe3f6'},
  MR:{name:'Max R.',    av:'MR', c:'#f6dccf'},
  CB:{name:'Christian B.',av:'CB',c:'#d6f0e2'},
  JS:{name:'Jothika S.', av:'JS', c:'#e7d8f6'},
  U: {name:'Unassigned', av:'U',  c:'#e8eaef'}
};

const STAGES = ['Intake','Evaluation','Scope & Solutioning','Approval','Fulfilment'];

// readiness: 'incomplete' | 'action' | 'pending' | 'reviewed'
const DEMANDS = [
  {
    id:'DMD0001663', title:'Americas AI Staffing Demand Planning',
    priority:'Medium', portfolio:'Technology', totalCost:200000, budget:112000,
    manager:'AM', creator:'MR', stage:2 /*index into STAGES*/, hoursInStage:19,
    sections:[
      {key:'details', name:'Details', readiness:'reviewed'},
      {key:'problem', name:'Problem Statement', readiness:'action'},
      {key:'objectives', name:'Objectives', readiness:'pending'},
      {key:'ownership', name:'Ownership', readiness:'incomplete'},
      {key:'financials', name:'Financials', readiness:'incomplete'}
    ],
    actions:[
      {id:'a1', priority:'High',   task:'Mark demand ready for evaluation', due:'Jun 24', assignee:'CB', section:'Scope',        status:'Completed',  creator:'MR'},
      {id:'a2', priority:'Medium', task:'Validate description and objectives', due:'Jun 24', assignee:'CB', section:'Business Case', status:'In Progress', creator:'MR'},
      {id:'a3', priority:'Low',    task:'Align on and create parent/child demands', due:'Jun 25', assignee:'U', section:'Business Case', status:'To Do', creator:'MR'}
    ]
  },
  // … add ≥5 more with varied priority (High/Medium/Low), stages (0–4),
  //    owners, and 0–4 actions each (include one demand with 0 open actions
  //    to exercise the empty state, and one fully reviewed → rollup Complete).
];
```
Numbers format as currency (`$200,000`). Derive each demand's open-action count (status ≠ Completed) for the "N Actions" pill and the F3 gate (e.g., outstanding high-priority actions + unreviewed sections).

---

## 6. Build order (suggested for the agent)

1. Scaffold: app bar, page bg, fonts, `:root` tokens, view-switch shell, toast helper.
2. **F1 Grid** with demand cards + expand-in-place action table (the centrepiece) + F5 Customize.
3. **Detail view**: F2 stage bar + section cards with **F4** readiness + **F6** tabs where dense.
4. **F8 Tango drawer** + **F3** stage-gate wired to the active demand.
5. **F7** export modal + section overflow.
6. Polish pass: hovers, transitions, empty states, Esc-dismiss, focus rings.

---

## 7. What NOT to do (explicit guardrails)

- ❌ No flat grey rows, black pill buttons, or cold underlined tab bars (that's the EY skin — not ours).
- ❌ No thick colored left border-rails on cards/rows ("Claudian design").
- ❌ No heavy grey empty-state blocks — empty states are light, encouraging, and on-brand.
- ❌ Do not use the AI gradient as decoration — Tango/AI contexts only.
- ❌ No `localStorage`/`sessionStorage`. No external frameworks/CDNs except the Poppins font.
- ❌ Do not invent new brand colors or fonts.

---

## 8. Definition of done

A single `demand-cockpit.html` that opens in a browser and demonstrates, end to end: a Grid of demand cards whose rows expand in place into owned, status-chipped action tables; a Detail view with a lifecycle stage bar and per-section readiness + review; a customizable column set; an export modal and section overflow actions; and a contextual Tango drawer whose "to advance, you must…" gate reflects — and updates with — the demand's real state. The whole thing reads unmistakably as **Trmeric** (orange-for-forward, Poppins, pill buttons, floating cards, semantic chips, Tango gradient), never as the EY reference.
