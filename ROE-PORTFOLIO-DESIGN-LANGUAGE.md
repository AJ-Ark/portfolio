# Portfolio Design Language — "Warm Editorial Immersion"

A spec for generating portfolio / case-study pages that feel like **one family** while
each project keeps its own character. Extracted from the two pages already built
(`realm/` and the landing + `rippl/`), not invented.

> **How to use this file.** Paste the whole thing into your generator (Codex/Claude/etc.)
> along with the *Project Brief* at the bottom filled in. Treat everything under
> **THE INVARIANT SPINE** as hard constraints — not suggestions, not starting points.
> The generator's job is to *tune the dials*, never to design a new system. If a
> generation invents new structure, type roles, or motion grammar, it has failed the
> brief — re-run it pointing at the **Anti-Drift Checklist**.

---

## 0. Why past attempts drifted

Generators drift when handed a *vibe* ("an immersive nature portfolio") because they fill
the gaps by inventing a whole new system. The fix is to give them:
1. A fixed **spine** (type roles, color architecture, motion grammar, spatial scale, section archetypes) that must be reused verbatim, and
2. A small set of **dials** (5 of them) that are the *only* things allowed to change per project.

Two projects can look noticeably different and still be one family — *if* they share the
spine and differ only on the dials. That is the entire trick.

---

## 1. The one idea

**Warm editorial immersion.** A paper-warm canvas, one saturated accent, expo-soft motion,
hairline structure, and a calm eyebrow→display→body→label type rhythm — used to *narrate a
project as a story you scroll through*, not a grid of screenshots. Every project, whether a
nature AR piece, an industrial prototype, or a B2B SaaS, is told this way.

---

## 2. THE INVARIANT SPINE (never changes across projects)

### 2.1 Base philosophy: warm, never cold
The background is always a warm tone — a paper cream in light mode, a near-black with a
green/brown bias in dark mode. **Never** pure white (`#fff` as the page base), never a cold
neutral grey (`#f5f5f5`, `#1e1e1e`), never blue-black. Warmth is the connective tissue.

- Light base examples in use: `#FAF7F1`, `#F1EADC`
- Dark base examples in use: `#0a0f0a`, `#060a06` (forest-biased black)
- Text is an off-white / off-ink with warmth, never `#000`/`#fff`: e.g. `#17150F` on light, `#ece6d6` on dark.

### 2.2 Type system — four roles, always present
Every page uses exactly these roles. The *faces* change per project (a dial); the *roles,
scale logic, and treatment* do not.

| Role | Treatment | In use |
|---|---|---|
| **Eyebrow / label** | small, UPPERCASE, wide tracking (`.12–.28em`), accent or faint color. Often the project's "technical" voice. | Mono (`JetBrains Mono`) on light pages; tracked Inter on Realm |
| **Display** | the personality voice. Large, `clamp()`-scaled, can use italic for emphasis on a single word. Lower font-weight at large sizes (300–500). | `Fraunces` italic (Realm) / `General Sans` bold (landing) |
| **Body** | comfortable reading. `line-height:1.6–1.7`, weight 300 (dark) / 500 (light), color is *dimmed* text not full-contrast. | Inter / General Sans |
| **Meta / caption** | the smallest tier — figcaptions, stats labels, nav tags. Often italic display (Realm) or mono (landing). | — |

Rules that never change:
- **Measure is capped in `ch`**, never full-width: body 42–54ch, leads/pull-quotes 22–32ch.
- **Display uses `clamp()`** for fluid sizing, e.g. `clamp(2.4rem,5vw,3.4rem)`.
- **Italic = emphasis**, used on *one* word/phrase, tinted toward the accent's bright tone.
- Exactly **one accent color** carries eyebrows, links, interactive states, and key numbers.

### 2.3 Color architecture — base + ink + ONE accent + hairline
Define a `:root` with this shape every time. Only the *values* change per project.

```
--base / --base-2     /* warm background + one step */
--ink / --text        /* warm foreground */
--text-dim            /* ~60% — body copy lives here */
--text-faint          /* ~38% — meta, captions */
--accent              /* THE one saturated hue */
--accent-bright       /* lighter tint, for italic emphasis + key numbers */
--accent-deep         /* darker, for hover/links on light bases */
--line                /* hairline: accent or ink at 10–18% alpha */
--rad / --r-lg / --r-xl  /* radius scale */
--ease                /* the motion curve (see 2.4) */
--display / --sans / --mono  /* the three faces */
--pad: clamp(20px, 6vw, 120px);  /* page gutter */
```

Never introduce a second saturated accent. Never use a grey hairline — tint it with the
accent or ink. Greens/reds for status dots are allowed but only as tiny functional pips.

### 2.4 Motion grammar — expo-out, slow settle, scroll-driven
- **One easing family for everything:** an expo-out curve. Use `cubic-bezier(.16,1,.3,1)` or
  `cubic-bezier(.22,1,.36,1)` — they are interchangeable in character (fast out, long soft
  settle). Do not mix in `ease-in-out`, bounces, or springs.
- **The reveal:** elements enter with `opacity:0; transform:translateY(20–28px)` →
  settle over `.8–.9s`. Stagger siblings by ~`.1s` (light) or section-led delays (Realm).
- **Nothing pops.** Anything appearing mid-scroll glides/blurs in. (Realm learned this the
  hard way — particles teleporting in felt broken; they now settle over 1.6s. Apply the
  principle: no instant state changes on entry.)
- **Hover:** translate by 2–4px and/or nudge an arrow `translateX(3–4px)`; `.3s`. Restrained.
- **Scroll is the narrator.** Use scroll-progress to drive disclosure (text sections revealing
  one at a time) and, where it fits, to *scrub* an animation forward/back. Respect
  `prefers-reduced-motion`: autoplay/scrub becomes static.

### 2.5 Spatial system
- **Page gutter:** `--pad: clamp(20px, 6vw, 120px)`; content `max-width` ~1180px, centered.
- **Hairline structure:** sections and stats are divided by `1px solid var(--line)` — borders
  do the structural work, not boxes-on-grey. Card edges are hairline too.
- **Radius scale:** small `16–18px`, large `22–28px`. Consistent within a page.
- **Shadows:** soft, large negative-spread, low alpha, e.g.
  `0 30px 70px -30px rgba(20,16,8,.34)` / `0 40px 80px -30px rgba(0,0,0,.8)` on dark.
  No hard/short drop shadows.

### 2.6 Section archetypes (the page skeleton)
A case study is assembled from these blocks, roughly in this order. Reuse the *structure*;
the content and medium are the project's own.

1. **Nav** — brand mark + italic/mono wordmark, sparse links, one pill CTA.
2. **Hero** — eyebrow → display headline (with one italic emphasis word) → dimmed sub →
   uppercase meta line → scroll cue.
3. **Logline / thesis** — a large display sentence, word-by-word reveal, capped ~22–32ch.
4. **Problem → Pivot** — the tension and the reframe, often a two-column "from / to" where the
   "to" column is tinted with the accent. Stats sit on hairline rows.
5. **Process / cycle** — numbered steps or a loop; numbers in display+accent.
6. **Gallery / screens** — horizontal track or showcase of the *medium* (AR screens, product
   shots, UI). Hairline-bordered, soft float shadow, figcaption in meta type.
7. **Reflection / pull-quote** — a centered italic display lead, generous vertical space.
8. **CTA / "enter"** — the live link / artifact (QR, download, launch).
9. **Footer** — italic/mono tag, contact, year.

Not every project needs all nine; never add archetypes outside this set without reason.

### 2.7 Copy voice
Calm, concrete, first-person-light. Eyebrows are technical/categorical ("LIVE · WEBAR",
"FIELD RESEARCH"). Headlines make one claim with one emphasized word. Body explains *why it
was built* and *what changed*, not feature lists. No marketing exclamation. **No em-dashes in
UI copy** — use commas, colons, or periods.

---

## 3. THE DIALS (the only things that change per project)

| Dial | Range | Picks the project's *feel* |
|---|---|---|
| **1. Base luminance** | dark immersive ⟷ light editorial | dark = atmospheric/emotional; light = clear/credible |
| **2. Display typeface** | expressive serif ⟷ neutral grotesk | serif italic = poetic/natural; grotesk = precise/engineered |
| **3. Accent hue** | one saturated warm/cool | the project's signature color |
| **4. Medium / texture** | particles ⟷ product shots ⟷ data UI ⟷ blueprints | what fills galleries + the hero's "alive" element |
| **5. Motion intensity** | high immersion ⟷ calm restraint | how much the page moves on its own |

Everything else (Section 2) stays put.

---

## 4. Three tuned presets (paste-ready `:root` starting points)

### 4.1 Realm of Elementals — *nature / immersive* (the reference, already built)
Dark, serif, gold, organic, high-motion, poetic.
```css
:root{
  --base:#0a0f0a; --base-2:#0e150d;
  --ink:#ece6d6; --text-dim:rgba(236,230,214,.62); --text-faint:rgba(236,230,214,.38);
  --accent:#d9b46a; --accent-bright:#f1d8a3; --accent-deep:#a07f44;
  --line:rgba(217,180,106,.18); --rad:18px;
  --ease:cubic-bezier(.22,1,.36,1);
  --display:"Fraunces",Georgia,serif; --sans:"Inter",system-ui,sans-serif;
  --pad:clamp(20px,6vw,120px);
}
```
Medium: Three.js particle field, breathing/flap micro-animations, scroll-scrubbed glyphs.
Copy register: lyrical ("Where vanishing wings are kept alive").

### 4.2 Industrial-design / research prototype — *precise / material*
The physical-prop, research-heavy project. Keep it a **family member**, tune toward
*engineered calm*: light or mid base, a neutral grotesk display, **mono carries dimensions /
measurements / spec callouts** (it earns its keep here), motion is measured (no autoplay
drama — reveals + one scrubbed exploded-diagram). One restrained accent.
```css
:root{
  --base:#F4F1EA; --base-2:#E9E3D6; --paper:#fff;
  --ink:#1A1814; --text-dim:#544f45; --text-faint:#938c7f;
  --accent:#C2410C; --accent-bright:#EA580C; --accent-deep:#9A3412; /* burnt industrial orange */
  --line:#E2DBCC; --rad:14px; --r-lg:20px;
  --ease:cubic-bezier(.16,1,.3,1);
  --display:"General Sans",system-ui,sans-serif; --sans:"General Sans",system-ui,sans-serif;
  --mono:"JetBrains Mono",monospace;
  --pad:clamp(20px,6vw,120px);
}
```
Medium: product/prototype photography, exploded views, dimension callouts in mono,
research findings as hairline stat rows. Galleries show the *object* and the *process*.
Copy register: factual, evidence-led ("12 sessions, 3 form factors, one survivor").

> **Live reference for this preset: `aravindj.xyz/rippl`** (the reading-companion lamp).
> Its existing case study is the *content* to recreate — problem + verbatim user quotes,
> prototype **video** clips, looping **interaction GIFs**, **IA diagrams**, design-process /
> research-synthesis, epilogue-to-next-project. Today it's minimalist white with no accent;
> recreating it in this language means keeping every one of those artifacts and sections, but
> giving it the warm base, the single burnt-orange accent, the four type roles (mono carrying
> the research/spec labels), and expo-soft scroll reveals. Don't strip the content to fit the
> style — wrap the style around the content. Videos/GIFs sit in hairline-bordered frames with
> the soft float shadow; IA diagrams get a `--base-2` plate; quotes become italic display leads.

### 4.3 Trmeric — *B2B SaaS / clarity*
Light, neutral, orange, UI-forward, systematic. This is essentially the existing landing
dialect — keep it.
```css
:root{
  --base:#FAF7F1; --base-2:#F1EADC; --paper:#fff;
  --ink:#17150F; --text-dim:#6f6a5e; --text-faint:#9b9488;
  --accent:#FFA426; --accent-bright:#FFB84D; --accent-deep:#E8730E;
  --line:#E8E1D2; --rad:16px; --r-lg:22px; --r-xl:28px;
  --ease:cubic-bezier(.16,1,.3,1);
  --display:"General Sans",system-ui,sans-serif; --sans:"General Sans",system-ui,sans-serif;
  --mono:"JetBrains Mono",monospace;
  --pad:clamp(20px,6vw,120px);
}
```
Medium: real product UI shots (browser/device framed, float shadow, hairline border),
persona narratives, surface-count stats. Motion: snappy but restrained (no scrub drama).
Copy register: confident, systems-minded ("23 surfaces, three personas, one journey").

> Notice all three share: warm base, one accent, expo-out `--ease`, the same `--pad`, the same
> radius/hairline/shadow logic, the same four type roles. That shared skeleton is what makes
> them read as one portfolio. Only the five dials moved.

---

## 5. Anti-Drift Checklist (a generation must pass all of these)

- [ ] Background is a **warm** tone (no pure white, no cold grey, no blue-black).
- [ ] Exactly **one** saturated accent; eyebrows/links/key-numbers all use it.
- [ ] Hairlines are **tinted** (accent/ink alpha), never plain grey; borders do the structural work.
- [ ] All motion uses **one expo-out easing**; nothing pops in; reveals are translateY+opacity ~.8–.9s.
- [ ] Type uses the **four roles** (eyebrow / display / body / meta) with a mono or tracked label voice.
- [ ] Display headline has **one italic/emphasis** word, tinted to `--accent-bright`.
- [ ] Body measure is capped in **ch** (≤54ch); leads ≤32ch.
- [ ] Page is built from the **Section 2.6 archetypes**, in a narrative scroll order — not a screenshot grid.
- [ ] `--pad`, radius scale, and soft large-offset shadow logic match the spine.
- [ ] `prefers-reduced-motion` disables autoplay/scrub.
- [ ] **No em-dashes** in copy.
- [ ] It only moved the **five dials** — if it invented a new type scale, layout system, or motion style, reject and re-run.

---

## 6. Project Brief — fill this in, then generate

```
PROJECT NAME:
ONE-LINE THESIS (what it is + the one emphasized word):
PROJECT TYPE (nature-immersive / industrial-research / saas-clarity / other):
DIAL SETTINGS:
  1. Base luminance:  dark | light | mid
  2. Display face:    serif-expressive | grotesk-neutral   (proposed: ______)
  3. Accent hue:      ______  (one saturated color; give hex if known)
  4. Medium/texture:  particles | product-photo | exploded-diagram | product-UI | ______
  5. Motion intensity: high-immersion | measured | restrained
SECTIONS TO INCLUDE (from 2.6):  nav, hero, logline, problem→pivot, process, gallery, reflection, CTA, footer
KEY CONTENT:
  - The problem / why it was built:
  - The pivot / what changed:
  - 3–5 stats or research findings:
  - The medium to showcase (what fills the gallery):
  - The live artifact / CTA (link, QR, download):
CONSTRAINTS:  Static site, no build step. Reuse the spine in Sections 2–5 verbatim;
              only tune the five dials. Pass every item in the Section 5 checklist.
```

---

*Source of truth: this file describes the system already implemented in `realm/css/style.css`
and the landing/`rippl/style.css`. When in doubt, open those files and match them — do not
reinvent.*
