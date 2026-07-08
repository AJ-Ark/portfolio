# Experience Elevation Roadmap — "One Material, With Weather"

> Produced 2026-07-07 from a full-site audit (7 area auditors), award-landscape research,
> and a judged panel of three competing creative directions.
> Target: Awwwards SOTD / FWA-level immersive experience, built incrementally by one person.

## The verdict on the current site

The site already contains its award-winning idea: **a single persistent particle field that
morphs into each project's signature form** (butterfly / orbitals / lattice / ripples) **and a
warp-dive that doubles as the route loader**. That is genuinely distinctive, jury-grade
conceptual work. Everything around it is 30–40% executed:

- **The build cannot deploy.** `next build` fails: ESLint `prefer-const` error at
  `src/lib/i18n.ts:56`, and prerender crashes because `TranslationContext.tsx` drops its
  Provider during SSR (mounted-guard around lines 81–83).
- **The signature is hidden.** Case-study pages paint opaque backgrounds over the persistent
  canvas (`rippl/page.tsx` ~L276, `trmeric/page.tsx` ~L260) — the field burns GPU invisibly.
- **Zero scroll-driven animation anywhere in `src/`** — no `whileInView`, no `useScroll`.
  Lenis smooths scroll but nothing subscribes to it. The case studies are static magazine
  articles where a jury expects a film.
- **The shell is unfinished**: preloader is a fake 1.7s timer; cursor mounts only on home and
  half-works (`mixBlendMode:screen` invisible in light mode, no interactive states);
  `.resume-link`/`.footer-link` referenced but never defined; mobile menu and language
  switcher pop with no animation; regular navigations are hard cuts.
- **Asset discipline is absent**: ~56MB of GIFs, a 38MB `preload="auto"` video on Rippl,
  fonts via render-blocking external `<link>` instead of `next/font`.
- **i18n is a facade**: 7 of 15 locale files are byte-identical English with mojibake
  ("RÃ©sumÃ©"); hero/Footer/About copy is hardcoded English.
- **Best motion work in the repo is the standalone Realm site** (`public/realm/js/main.js`
  — scroll-scrubbed glyphs, FLIP bento, hover-intent) whose grammar was meant to be the
  template for everything and never got ported.

## The direction (winner of a 3-way judged panel)

Three directions were pitched and scored (originality / feasibility / memorability / coherence):

1. **THE LONG TAKE** — the site as one continuous film scrubbed by scroll (7/7/7/9)
2. **ONE FIELD, FOUR WEATHERS** — one living world, each project a climate district (9/5/9/8)
3. **ONE MATERIAL** — radical subtraction + obsessive completion; dust as the only material (6/9/7/9) ← **recommended base**

**Synthesis: "Everything here is made of the same dust, and the dust has weather."**

The GPU-resident dust field becomes the site's ONLY visual material — it draws the loader
wordmark, previews every project, carries every transition, breathes at chapter seams, and
settles into the AJ monogram at every page's end. One typographic voice (Fraunces italic +
JetBrains Mono), one easing family, one transition grammar, 60fps on a mid-range Android,
keyboard-complete, reduced-motion honest. Everything half-finished gets deleted or completed
— no third state.

**Graft 1 (from Four Weathers): the climate system as shader uniforms.** A `climate` uniform
block (palettePair per domain × theme, turbulence, density, wind, gravity) driven by a small
store fed by route domain, Lenis velocity/progress, and cursor velocity. The work index
becomes THE OVERLOOK (hover a row → that project's weather arrives); chapter seams inside
case studies become narrative weather (sparse/grey at the problem, warming/densifying toward
the outcome, streaking under fast scroll). NOT grafted: time-of-day sky tint, ambient sound.

**Graft 2 (from The Long Take): no hard cuts anywhere.** Warp-dive in for project entry, the
same shot reversed for back-navigation, a 400ms scatter-settle for nav/about/footer routes,
and a "Next: [project] →" epilogue on every case-study footer that warps into the next
domain's climate. Plus pointer-reactive Fraunces variable axes (wght/opsz already loaded,
never used) on the hero.

**Editorial ruling:** delete the unused `coverImage` data — formations ARE the covers on home
and work index; every case study must lead with strong real imagery in the first viewport
after the warp lands.

### Signature moments (what a juror screenshots)

1. **THE HONEST LOADER** — first visit: particles condense into "ARAVIND J" on the canvas
   (gated on real font+WebGL readiness, not a timer), hold, then exhale into the idle field
   as the hero mask-reveals line by line. sessionStorage skips it on return.
2. **THE OVERLOOK** (`/work`) — hover/focus a row → field morphs into that project's
   formation beside it, palette crossfades, cursor swells into an "Enter" lens, click =
   warp dive THROUGH the formation. Uses `setPreviewDomain`/`startWarp` that already exist.
3. **CHAPTER SEAMS** — between case-study chapters, content gradient-fades and the field
   shows through for a full viewport, its temperament keyed to the narrative beat.
4. **THE METAMORPHOSIS** (Realm) — pinned scroll-scrub: the hero's own particles reform
   egg → caterpillar → chrysalis → butterfly, forward and backward.
5. **THE CURSOR IS ONE PARTICLE** — global cursor borrowed from the field; nearby dust leans
   toward it; contextual states ("Enter", "Drag", hairline ring); velocity feeds repulsion.
6. **THE SETTLING** — every page ends with oversized Fraunces-italic "Say hello" + local
   time while the field slows and settles into the AJ monogram.

## Roadmap

### Phase 1 — Foundation + quick wins (days-scale, immediately jury-visible)

- [ ] Fix ship-blockers: TranslationContext SSR provider (render Provider with English
      defaults during SSR), `prefer-const` at `src/lib/i18n.ts:56`; add CI gate on `next build`
- [ ] Honest i18n: delete 7 byte-identical English locale files, fix mojibake, reconcile
      en.json vs projects.ts, complete `t()` coverage (home hero, Footer, About)
- [ ] Self-host fonts via `next/font`; remove render-blocking font links; gate Realm CDN
      prefetches to idle time on home route only
- [ ] Motion tokens module (one easing family, duration scale, stagger unit, one spring) +
      universal `<Reveal>` primitive applied to every static section — nothing pops
- [ ] Finish the hover/focus layer: `.resume-link`/`.footer-link`, underline-slide nav
      grammar, AnimatePresence mobile menu, Escape/click-outside on language switcher,
      `:focus-visible` site-wide
- [ ] Theme repair: fix 3 dead light-mode domain selectors in globals.css (compound
      `html[data-theme="light"][data-domain="…"]`), replace `/work` hardcoded dark hexes with
      vars, collapse duplicate `--pad`/`--spacing-page`
- [ ] Add `rozi` to `DomainSync.tsx` path map; wire all 6 Rozi infographic components to a
      shared `useInView` so their existing entrance choreography actually fires on scroll
- [ ] Asset triage: GIFs → muted in-view WebM/MP4 (pause offscreen + reduced-motion),
      `preload="metadata"` on RipplVideoCard, compress 38MB video, MOV→MP4, AVIF/WebP +
      `sizes` in next.config
- [ ] Home reel completeness: 01/05 progress rail, keyboard nav (fix scroll desync),
      reduced-motion path = plain scrollable stack

### Phase 2 — The signature centerpiece

- [ ] GPU dust engine: single custom ShaderMaterial; formation morph targets (idle, butterfly,
      orbitals, ripples, lattice, ARAVIND J wordmark) baked as attributes/DataTextures; morph,
      dive, repulsion, scrollVelocity, climate as uniforms; curl-noise idle drift, additive
      soft sprites, size-by-depth; 30–50k desktop / 8–15k mobile via detect-gpu; keep CPU
      field as fallback until shader path passes a real mid-range Android test
- [ ] Climate uniform block + small store; Lenis as the single rAF clock; scroll velocity +
      cursor velocity write into the store
- [ ] THE HONEST LOADER (see signature moments); wire `loading.tsx` into the same field
- [ ] THE OVERLOOK rebuild of `/work`
- [ ] Transition grammar, zero hard cuts + "Next: [project] →" match-cut epilogues on all
      four case studies
- [ ] Global cursor-as-one-particle (drop `mixBlendMode:screen` in light mode, suppress UA
      cursor on interactive elements)
- [ ] Home reel choreography: per-line masked reveals staggered against the spring, per-slide
      palette crossfade, hover excites the field, gradient edge on the reel-text panel,
      pointer-reactive Fraunces axes on the hero
- [ ] THE SETTLING on every page

### Phase 3 — Case-study depth (Trmeric flagship first)

- [ ] Refactor case studies to server components + client islands FIRST, then cut 2–3
      gradient-faded chapter seams per page with narrative weather
- [ ] Trmeric: transparent hero band un-occludes the amber lattice; IterationStrip becomes a
      draggable v13→v36 scrubber; brand page grows the mark on scroll (rhizome photos →
      traced outlines → ring forms → five golden-ratio rings stroke-draw); count-up metrics
- [ ] Trmeric [slug]: CSS-var theming (kill the dark→light slam), FLIP shared-element
      lightbox for evidence shots, bring trucible/signals to demand-owner-flow depth, fix
      79-vs-90 signals contradiction, sticky mobile progress dock
- [ ] Realm: pinned Metamorphosis scrub; screens gallery → pinned horizontal scrub on the
      single scroll axis; thin the ~85%-opaque panels at seams; load Lenis or delete the dead
      branch; self-host three.js/GSAP/fonts; ~20MB PNGs → AVIF + srcset
- [ ] Rippl: THE PROJECTION — scroll-linked light cone from the hero lamp projects sections
      in; DeviceSchematic stroke-draws; ReadingJourney plays as scrubbed sequence; two
      full-bleed pacing breaks; fix duplicated "08" numbering with a chapter rail
- [ ] Rozi: pin "Adjust karna padta hai" verbatim full-viewport with monsoon intensifying,
      palette gold→maroon; LifecycleMap steps down with scroll; count-up 40cr/93%/₹0;
      PersonaCard bars grow; staged hero entrance
- [ ] About: prove its own "the form is the argument" — Lenis-scrubbed morphs through the
      three selves (architecture lattice / butterfly / code-grid); delete the "On this site"
      tell-don't-show section; particle-dither portrait dissolve; scroll-drawn timeline

### Phase 4 — Polish, performance, submission readiness

- [ ] Hard gates (blocking): 60fps on real mid-range Android; LCP < 2.5s with hero TEXT as
      LCP element; initial payload ≤ 5–8MB; Lighthouse 90+
- [ ] Runtime hygiene: frameloop pauses on visibilitychange / demand when occluded; single
      Lenis-driven ticker (kill redundant rAF loops in SmoothScroll/CursorGlow); remove
      `scroll-behavior:smooth` double-smoothing; fix module-level mousemove leak in
      ParticleField; audit non-passive listeners; verify backdrop-filter cost on iGPUs
- [ ] Route shell completeness: branded `not-found.tsx`/`error.tsx` in the dust language, OG
      images for every route, sitemap/robots, delete dead scaffolding (unused deps, orphaned
      components, dead prefetches)
- [ ] Accessibility as a designed path: keyboard-complete traversal incl. all pins/scrubbers
      (each with skip affordance); reduced-motion = designed static frames + visible motion
      toggle in nav; test scrubs on trackpad/wheel/touch
- [ ] QA matrix per signature moment: light × dark × each domain palette × ≥1 non-English
      locale
- [ ] Editorial credibility: reconcile "3 working prototypes" vs "Four demonstrations"
      (Rippl); reframe "Anonymous interviewee" quote; thin repeated citations; re-verify
      every metric against its anchor
- [ ] Submissions: capture 30–60s site film + stills; CSSDA first (calibration) → Awwwards
      SOTD → FWA; do not submit before Phase 2 + Trmeric flagship are live

### Review backlog (from the Phase 1 full-diff review — quality, not bugs)

- [ ] `LazyMotion features={domAnimation}` + `m.*` to cut framer-motion's per-route payload
      (~30kB → ~5kB gzip) on every page that animates
- [ ] Stop double-shipping en.json: it is statically imported into the client bundle by
      TranslationContext AND served from /public/messages — pass it via RSC props or fetch it
- [ ] Pool IntersectionObservers in `useInView` (module-level Map by options key) — /work/rozi
      currently creates 11 observers where 2 would do
- [ ] Consider `<MotionConfig reducedMotion="user">` at the layout level to delete the ~16
      per-transition `reduceMotion ?` ternaries in Navigation/LanguageSwitcher
- [ ] Extract a shared `PlayOverlay` component (InlineVideo + RipplVideoCard duplicate it)
- [ ] Extract a `<Kicker>` primitive — the mono uppercase label style block is repeated ~14×
      across pages with drifting opacity/size values
- [ ] Unwind the `!important` in `.footer-link`/`.resume-link` by removing the inline
      color/border styles from Footer.tsx and about/page.tsx (like `.cta-link` already does)
- [ ] Migrate the few `var(--spacing-page)` call sites to `var(--pad)` and delete the alias
- [ ] RealmPrefetch's pinned CDN URLs duplicate public/realm/index.html's script tags — derive
      both from one manifest so a Realm dependency bump can't silently break the prefetch
- [ ] `React.memo` HomeReel's Slide/HeroContent/ProjectContent + hoist static style objects
      (the whole subtree re-renders per slide change)
