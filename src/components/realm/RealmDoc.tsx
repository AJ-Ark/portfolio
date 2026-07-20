"use client";

import { useRef, type CSSProperties } from "react";
import { useTranslation } from "@/lib/TranslationContext";
import RealmHeroScene from "./RealmHeroScene";
import RealmInteractions from "./RealmInteractions";

/* ══════════════════════════════════════════════════════════════════
   REALM OF ELEMENTALS — the full case-study doc, ported from the
   standalone public/realm/index.html into a real route. Markup below
   is machine-converted from that HTML (scripts/html-to-jsx.cjs) rather
   than hand-transcribed — same discipline as the CSS scoping pass
   (scripts/scope-realm-css.cjs) — because hand-typing ~800 lines of
   dense, precisely-classed markup is exactly where silent transcription
   errors hide. Three things were adjusted by hand on top of the
   machine output:
     1. i18n: data-i18n/-html attributes (a bespoke DOM-walking
        translator in the standalone doc) replaced with this site's
        real t() — the realm.* keys already live in the SAME
        /public/messages/*.json files that translator was already
        fetching, so nothing new had to be authored.
     2. Asset paths: "assets/..." was relative to /realm/index.html;
        rewritten to "/realm/assets/..." (the files themselves didn't
        move) so they resolve correctly from /work/realm.
     3. Structural: the old top nav, mobile menu, preloader cover, and
        footer epilogue are gone — replaced by the site's own
        <Navigation/>, <RealmSectionRail/>, the real dust-warp arrival,
        and <NextProject/> respectively (wired in page.tsx). Everything
        else — every section, every class, every bit of copy — is the
        original, unchanged.

   The three.js hero/metamorphosis scene and every scroll-driven
   behaviour (reveal, logline, count-up, parallax, the screens gallery,
   the research bento) live in RealmHeroScene / RealmInteractions —
   both effects scoped to `root`, mounted here. ══════════════════════════════════════════════════════════════════ */

export default function RealmDoc() {
  const rootRef = useRef<HTMLDivElement>(null);
  const { t } = useTranslation();

  return (
    <div ref={rootRef} className="realm-doc">
      <RealmHeroScene />
      <div className="bg-veil" aria-hidden="true"></div>

      {/* shared svg defs — the butterfly glyph, reused by the research
          bento's icons and the footer (now <NextProject/>'s domain, but
          this def is still referenced from within the sections below) */}
      <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true">
        <defs>
          <g id="bf-glyph">
            <path fill="currentColor" d="M50 50c-6-16-18-24-30-22-9 1.5-13 9-10 18 3 9 16 16 27 14 5-1 9-4 13-10zM50 50c6-16 18-24 30-22 9 1.5 13 9 10 18-3 9-16 16-27 14-5-1-9-4-13-10zM50 50c-4 12-6 22-5 31 .4 4 5 4 5 0 1-9-1-19-5-31z" opacity=".9"></path>
            <circle cx="50" cy="34" r="3.2" fill="currentColor"></circle>
          </g>
        </defs>
      </svg>

      {/* ═══ HERO ═══ */}
      <section className="hero" id="top">
        <div className="hero__veil"></div>
        <div className="hero__inner">
          <p className="hero__eyebrow reveal">
            Realm of
          </p>
          <h1 className="hero__title">
            <span className="hero__title-em reveal" data-d="1">
              Elementals
            </span>
          </h1>
          <p className="hero__tag reveal" data-d="2">
            {t("realm.subtitle")}
          </p>
          <p className="hero__meta reveal" data-d="3" dangerouslySetInnerHTML={{ __html: t("realm.tagline") }} /* was data-i18n-html="realm.tagline" */ />
        </div>
        <div className="hero__scroll reveal" data-d="4">
          <span>{t("realm.scroll")}</span>
          <i></i>
        </div>
      </section>
      <section className="logline section" id="intro">
        <div className="wrap">
          <p className="logline__lead">
            <span className="word">
              The
            </span>
            {" "}
            <span className="word">
              small
            </span>
            {" "}
            <span className="word">
              things
            </span>
            {" "}
            <span className="word">
              you
            </span>
            {" "}
            <span className="word">
              do,
            </span>
            {" "}
            <span className="word">
              for
            </span>
            {" "}
            <span className="word">
              yourself
            </span>
            {" "}
            <span className="word">
              and
            </span>
            {" "}
            <span className="word">
              for
            </span>
            {" "}
            <span className="word">
              the
            </span>
            {" "}
            <span className="word">
              world
            </span>
            {" "}
            <span className="word">
              around
            </span>
            {" "}
            <span className="word">
              you,
            </span>
            {" "}
            <span className="word">
              become
            </span>
            {" "}
            <span className="word">
              a
            </span>
            {" "}
            <span className="word">
              living
            </span>
            {" "}
            <span className="word">
              creature
            </span>
            {" "}
            <span className="word">
              you
            </span>
            {" "}
            <span className="word">
              can
            </span>
            {" "}
            <span className="word">
              watch
            </span>
            {" "}
            <span className="word">
              grow.
            </span>
            {" "}
            <span className="word">
              You
            </span>
            {" "}
            <span className="word">
              live
            </span>
            {" "}
            <span className="word">
              it.
            </span>
            {" "}
            <span className="word">
              The
            </span>
            {" "}
            <span className="word">
              realm
            </span>
            {" "}
            <span className="word">
              shows
            </span>
            {" "}
            <span className="word">
              it.
            </span>
          </p>
          <div className="logline__pillars">
            <div className="pillar reveal">
              <span className="pillar__n">
                01
              </span>
              <h3>
                Act
              </h3>
              <p>
                One real act a day, for yourself or the world.
              </p>
            </div>
            <div className="pillar reveal" data-d="1">
              <span className="pillar__n">
                02
              </span>
              <h3>
                See
              </h3>
              <p>
                Your care grows into a living creature.
              </p>
            </div>
            <div className="pillar reveal" data-d="2">
              <span className="pillar__n">
                03
              </span>
              <h3>
                Learn
              </h3>
              <p>
                Meet a real, threatened species.
              </p>
            </div>
            <div className="pillar reveal" data-d="3">
              <span className="pillar__n">
                04
              </span>
              <h3>
                Become
              </h3>
              <p>
                Help nature, and it helps you back.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The rail (RealmSectionRail, mounted in page.tsx) watches this
          wrapper's intersection to decide when it's on screen — deliberately
          starting at Problem, not the hero: "where am I in the tour" has
          nothing to orient yet while the hero is still on screen. */}
      <div id="realm-story">
      {/* ═══ PROBLEM ═══ */}
      <section className="section problem" id="problem">
        <div className="wrap">
          <span className="kicker reveal">
            01 · The Problem
          </span>
          <h2 className="display reveal" data-d="1">
            We are told the planet is dying.
            <br />
            <em>
              And we feel nothing.
            </em>
          </h2>
          <div className="problem__grid">
            <div className="problem__text reveal" data-d="2">
              <p>
                The crisis is everywhere and felt nowhere. We hear the planet is collapsing, yet nothing we do each day seems to touch it. The damage is far away, slow, abstract. Our own choices feel too small to matter.
              </p>
              <p>
                So we look away. Not from cruelty, but because we can never see the line between what we do and what becomes of the world, or of ourselves. What you cannot see, you cannot care for.
              </p>
            </div>
            <div className="problem__stats">
              <div className="stat reveal" data-d="1">
                <b data-count="22">
                  0
                </b>
                <span>
                  % decline in butterfly numbers in 20 years
                </span>
              </div>
              <div className="stat reveal" data-d="2">
                <b data-count="40">
                  0
                </b>
                <span>
                  % of insect species in decline worldwide
                </span>
              </div>
              <div className="stat reveal" data-d="3">
                <b>
                  1 of 5
                </b>
                <span>
                  pollinator species at risk of extinction
                </span>
              </div>
            </div>
          </div>
          <figure className="problem__plate reveal">
            <picture>
              <source type="image/avif" srcSet="/realm/assets/sketch-confrontation-sm.avif 564w, /realm/assets/sketch-confrontation.avif 1024w" sizes="(max-width:680px) 92vw, 620px" />
              <source type="image/webp" srcSet="/realm/assets/sketch-confrontation-sm.webp 564w, /realm/assets/sketch-confrontation.webp 1024w" sizes="(max-width:680px) 92vw, 620px" />
              <img src="/realm/assets/sketch-confrontation.png" width="1024" height="1024" loading="lazy" decoding="async" alt="A storyboard sketch: a hand holds a phone where a grey butterfly asks, 'I don't feel well. Do you know why we are disappearing?'" />
            </picture>
            <figcaption>
              An early concept asked the user to confront a dying creature directly.
            </figcaption>
          </figure>
        </div>
      </section>

      {/* ═══ PIVOT ═══ */}
      <section className="section pivot" id="pivot">
        <div className="wrap">
          <span className="kicker reveal">
            02 · The Pivot
          </span>
          <h2 className="display reveal" data-d="1">
            Guilt makes us look away.
            <br />
            <em>
              Care makes us look closer.
            </em>
          </h2>
          <div className="pivot__cols">
            <div className="pivot__col pivot__col--from reveal" data-d="1">
              <span className="pivot__label">
                We began with
              </span>
              <h3>
                Confrontation
              </h3>
              <p>
                Shock the user. Show the damage. Make them feel the weight of extinction. It was honest, and it pushed people away. Fear closes the hand.
              </p>
            </div>
            <div className="pivot__arrow reveal" data-d="2" aria-hidden="true">
              <svg viewBox="0 0 120 24">
                <path d="M2 12h112m0 0-12-8m12 8-12 8" fill="none" stroke="currentColor" strokeWidth="1.5"></path>
              </svg>
            </div>
            <div className="pivot__col pivot__col--to reveal" data-d="3">
              <span className="pivot__label">
                We arrived at
              </span>
              <h3>
                Care
              </h3>
              <p>
                Give the user something fragile to love. Attachment does what argument cannot. It makes the abstract personal, and the personal worth protecting.
              </p>
            </div>
          </div>
          <blockquote className="pullquote reveal">
            “People don't protect what they're afraid of.
            <br />
            They protect what they've come to love.”
          </blockquote>
        </div>
      </section>

      {/* ═══ APP ═══ */}
      <section className="section app" id="app">
        <div className="wrap">
          <span className="kicker reveal">
            03 · The Design Response
          </span>
          <h2 className="display reveal" data-d="1">
            <em>
              Realm of Elementals
            </em>
          </h2>
          <p className="lede reveal" data-d="2">
            Realm of Elementals is a web app that turns your real acts of self-care and sustainable living into a living world you can watch grow. No download, no account. You do the small things; the realm makes their effect visible. Right now that world is a single butterfly. In time, it becomes many species, a whole ecosystem that answers to how you live.
          </p>
          <div className="exchange reveal" data-d="3">
            <div className="exchange__col">
              <span className="exchange__label">
                For you
              </span>
              <p>
                A quiet daily ritual, a creature that needs you, and proof that small habits add up.
              </p>
            </div>
            <div className="exchange__col">
              <span className="exchange__label">
                For the world
              </span>
              <p>
                Real acts of care and sustainability, and a person who has started to notice.
              </p>
            </div>
          </div>
          <p className="reveal" data-d="4">
            <a href="#research" className="btn btn--ghost app__research-link">
              Dive into the research behind it →
            </a>
          </p>
        </div>
        {/* horizontal scroll gallery */}
        <div className="screens" id="screens">
          <div className="screens__track" id="screensTrack">
            <figure className="screen">
              <picture>
                <source type="image/avif" srcSet="/realm/assets/ui-naming-sm.avif 812w, /realm/assets/ui-naming.avif 1476w" sizes="300px" />
                <source type="image/webp" srcSet="/realm/assets/ui-naming-sm.webp 812w, /realm/assets/ui-naming.webp 1476w" sizes="300px" />
                <img src="/realm/assets/ui-naming.png" width="1476" height="2680" loading="lazy" decoding="async" alt="App screen: a Common Jezebel butterfly, 'Who am I?' and a field to name her." />
              </picture>
              <figcaption>
                <b>
                  Meet her
                </b>
                A real species, named by you.
              </figcaption>
            </figure>
            <figure className="screen">
              <picture>
                {/* No AVIF source: this image has genuine transparency and the
                       encoder available at build time strips alpha from AVIF. WebP
                       (alpha preserved) and the PNG fallback keep it. */}
                <source type="image/webp" srcSet="/realm/assets/ui-egg-sm.webp 812w, /realm/assets/ui-egg.webp 1476w" sizes="300px" />
                <img src="/realm/assets/ui-egg.png" width="1476" height="2680" loading="lazy" decoding="async" alt="App screen: a golden egg in your care, growth at 53%." />
              </picture>
              <figcaption>
                <b>
                  Raise her
                </b>
                From an egg, day by day.
              </figcaption>
            </figure>
            <figure className="screen">
              <picture>
                <source type="image/avif" srcSet="/realm/assets/ui-offering-sm.avif 812w, /realm/assets/ui-offering.avif 1476w" sizes="300px" />
                <source type="image/webp" srcSet="/realm/assets/ui-offering-sm.webp 812w, /realm/assets/ui-offering.webp 1476w" sizes="300px" />
                <img src="/realm/assets/ui-offering.png" width="1476" height="2882" loading="lazy" decoding="async" alt="App screen: Today's Offering, small real-world acts of care." />
              </picture>
              <figcaption>
                <b>
                  Today's offering
                </b>
                One real act, every day.
              </figcaption>
            </figure>
            <figure className="screen">
              <picture>
                <source type="image/avif" srcSet="/realm/assets/ui-chrysalis-sm.avif 812w, /realm/assets/ui-chrysalis.avif 1476w" sizes="300px" />
                <source type="image/webp" srcSet="/realm/assets/ui-chrysalis-sm.webp 812w, /realm/assets/ui-chrysalis.webp 1476w" sizes="300px" />
                <img src="/realm/assets/ui-chrysalis.png" width="1476" height="2680" loading="lazy" decoding="async" alt="App screen: a green chrysalis. 'She's becoming something new. Three breaths. That's all she asks.'" />
              </picture>
              <figcaption>
                <b>
                  Transform
                </b>
                Breathe with her as she changes.
              </figcaption>
            </figure>
            <figure className="screen">
              <picture>
                <source type="image/avif" srcSet="/realm/assets/ui-ar-sm.avif 812w, /realm/assets/ui-ar.avif 1476w" sizes="300px" />
                <source type="image/webp" srcSet="/realm/assets/ui-ar-sm.webp 812w, /realm/assets/ui-ar.webp 1476w" sizes="300px" />
                <img src="/realm/assets/ui-ar.png" width="1476" height="2680" loading="lazy" decoding="async" alt="App screen: AR activation, a glowing egg aligning in the camera view." />
              </picture>
              <figcaption>
                <b>
                  Step through
                </b>
                The realm opens in your room.
              </figcaption>
            </figure>
            <figure className="screen">
              <picture>
                <source type="image/avif" srcSet="/realm/assets/ui-status-sm.avif 812w, /realm/assets/ui-status.avif 1476w" sizes="300px" />
                <source type="image/webp" srcSet="/realm/assets/ui-status-sm.webp 812w, /realm/assets/ui-status.webp 1476w" sizes="300px" />
                <img src="/realm/assets/ui-status.png" width="1476" height="2882" loading="lazy" decoding="async" alt="App screen: Nila's status, day 1 of her life, vitality 100%." />
              </picture>
              <figcaption>
                <b>
                  She remembers
                </b>
                Your care, kept alive.
              </figcaption>
            </figure>
          </div>
        </div>
        <p className="screens__hint reveal">
          Scroll to explore →
        </p>
      </section>

      {/* ═══ LIFECYCLE + PLATES ═══ */}
      <section className="section lifecycle" id="lifecycle">
        <div className="wrap">
          <span className="kicker reveal">
            04 · The Becoming
          </span>
          <h2 className="display reveal" data-d="1">
            Four stages.
            <em>
              Earned, not given.
            </em>
          </h2>
          <p className="lede reveal" data-d="2">
            She grows only when you show up. Tasks done in the real world move her through a life, roughly a week of small, deliberate care.
          </p>
        </div>
        {/* Motion-OK: main.js pins this panel (GSAP ScrollTrigger) and scrubs
               the background field's own particles through egg → caterpillar →
               chrysalis → butterfly as the reader scrolls, forward and back. The
               text below just follows along, snapping between the four stages.
               Reduced motion: CSS un-pins this into a plain static 4-up grid
               (see the prefers-reduced-motion block in style.css) — no pin, no
               scrub, everything readable at once. */}
        <div className="cycle-pin" id="cyclePin">
          <div className="cycle-pin__rail" aria-hidden="true">
            <i className="cycle-pin__rail-fill" id="cyclePinFill"></i>
            <span className="cycle-pin__dot is-active" data-stage="0"></span>
            {" "}
            <span className="cycle-pin__dot" data-stage="1"></span>
            {" "}
            <span className="cycle-pin__dot" data-stage="2"></span>
            {" "}
            <span className="cycle-pin__dot" data-stage="3"></span>
          </div>
          <div className="cycle-pin__stages">
            <div className="cycle-pin__stage is-active" data-stage="0">
              <span className="cycle-pin__n">
                01 · Egg
              </span>
              <h3>
                The Egg
              </h3>
              <p>
                She arrives in your care, waiting. The realm is quiet until you begin.
              </p>
            </div>
            <div className="cycle-pin__stage" data-stage="1">
              <span className="cycle-pin__n">
                02 · Caterpillar
              </span>
              <h3>
                The Caterpillar
              </h3>
              <p>
                She hatches and feeds. Each day of care thickens her toward the next threshold.
              </p>
            </div>
            <div className="cycle-pin__stage" data-stage="2">
              <span className="cycle-pin__n">
                03 · Chrysalis
              </span>
              <h3>
                The Chrysalis
              </h3>
              <p>
                She folds inward. Three slow breaths from you, and the change begins.
              </p>
            </div>
            <div className="cycle-pin__stage" data-stage="3">
              <span className="cycle-pin__n">
                04 · Butterfly
              </span>
              <h3>
                The Butterfly
              </h3>
              <p>
                She opens her wings, takes your name, and flies free in the realm.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="section plates">
        <div className="plate">
          <figure className="plate__img reveal">
            <picture>
              <source type="image/avif" srcSet="/realm/assets/sketch-egg-sm.avif 564w, /realm/assets/sketch-egg.avif 1024w" sizes="(max-width:760px) 92vw, 545px" />
              <source type="image/webp" srcSet="/realm/assets/sketch-egg-sm.webp 564w, /realm/assets/sketch-egg.webp 1024w" sizes="(max-width:760px) 92vw, 545px" />
              <img src="/realm/assets/sketch-egg.png" width="1024" height="1024" loading="lazy" decoding="async" alt="Sketch: a person discovers a glowing egg." />
            </picture>
          </figure>
          <div className="plate__txt reveal" data-d="1">
            <span className="kicker">
              A quiet beginning
            </span>
            <h3 className="display-sm">
              It starts with something you could lose.
            </h3>
            <p>
              The first moment is deliberately small. No mission, no countdown, just a fragile life handed to you, and the question of whether you'll come back tomorrow.
            </p>
          </div>
        </div>
        <div className="plate plate--rev">
          <figure className="plate__img reveal">
            <picture>
              <source type="image/avif" srcSet="/realm/assets/sketch-emergence-sm.avif 564w, /realm/assets/sketch-emergence.avif 1024w" sizes="(max-width:760px) 92vw, 545px" />
              <source type="image/webp" srcSet="/realm/assets/sketch-emergence-sm.webp 564w, /realm/assets/sketch-emergence.webp 1024w" sizes="(max-width:760px) 92vw, 545px" />
              <img src="/realm/assets/sketch-emergence.png" width="1024" height="1024" loading="lazy" decoding="async" alt="Sketch: a butterfly emerges in augmented reality from a phone." />
            </picture>
          </figure>
          <div className="plate__txt reveal" data-d="1">
            <span className="kicker">
              A precious moment
            </span>
            <h3 className="display-sm">
              “Because of you, I made it.”
            </h3>
            <p>
              When she finally emerges, it is in your space, through your camera, a private, unrepeatable moment of arrival. The reward for care is not points. It is presence.
            </p>
          </div>
        </div>
        <div className="plate">
          <figure className="plate__img reveal">
            <picture>
              <source type="image/avif" srcSet="/realm/assets/sketch-liveshere-sm.avif 564w, /realm/assets/sketch-liveshere.avif 1024w" sizes="(max-width:760px) 92vw, 545px" />
              <source type="image/webp" srcSet="/realm/assets/sketch-liveshere-sm.webp 564w, /realm/assets/sketch-liveshere.webp 1024w" sizes="(max-width:760px) 92vw, 545px" />
              <img src="/realm/assets/sketch-liveshere.png" width="1024" height="1024" loading="lazy" decoding="async" alt="Sketch: a butterfly badge placed on a desk, taken from a weekend market." />
            </picture>
          </figure>
          <div className="plate__txt reveal" data-d="1">
            <span className="kicker">
              It lives here now
            </span>
            <h3 className="display-sm">
              A creature that follows you home.
            </h3>
            <p>
              A physical badge carries her identity into the world. Scan it on any phone and your realm returns, and the butterfly becomes a small companion you keep, not an app you close.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ INSTALLATION ═══ */}
      <section className="section installation" id="installation">
        <div className="installation__bg" aria-hidden="true"></div>
        <div className="wrap">
          <span className="kicker reveal">
            05 · Into the Room
          </span>
          <h2 className="display reveal" data-d="1">
            The realm became a place
            <br />
            you could
            <em>
              walk into.
            </em>
          </h2>
          <p className="lede reveal" data-d="2">
            For the final showcase, the digital world spilled into a physical one. A bouquet of paper butterflies became an AR marker. Point a phone at it and the swarm comes alive, every wing a creature someone had raised.
          </p>
        </div>
        <div className="installation__media">
          <figure className="installation__hero reveal">
            <picture>
              <source type="image/avif" srcSet="/realm/assets/installation-hands.avif" />
              <source type="image/webp" srcSet="/realm/assets/installation-hands.webp" />
              <img src="/realm/assets/installation-hands.png" width="749" height="1000" loading="lazy" decoding="async" alt="Visitor holds a phone at the installation; the camera reveals a swarm of AR butterflies rising from a paper bouquet." />
            </picture>
          </figure>
          <div className="installation__side">
            <figure className="reveal" data-d="1">
              <picture>
                <source type="image/avif" srcSet="/realm/assets/fieldtest-1-sm.avif 876w, /realm/assets/fieldtest-1.avif 1593w" sizes="(max-width:760px) 45vw, 462px" />
                <source type="image/webp" srcSet="/realm/assets/fieldtest-1-sm.webp 876w, /realm/assets/fieldtest-1.webp 1593w" sizes="(max-width:760px) 45vw, 462px" />
                <img src="/realm/assets/fieldtest-1.png" width="1593" height="1106" loading="lazy" decoding="async" alt="Field test: a visitor interacting with the installation." />
              </picture>
            </figure>
            <figure className="reveal" data-d="2">
              <picture>
                {/* No AVIF source: transparency preserved via WebP/PNG only (the
                     build-time AVIF encoder strips alpha). */}
                <source type="image/webp" srcSet="/realm/assets/fieldtest-2-sm.webp 876w, /realm/assets/fieldtest-2.webp 1593w" sizes="(max-width:760px) 45vw, 462px" />
                <img src="/realm/assets/fieldtest-2.png" width="1593" height="1106" loading="lazy" decoding="async" alt="Field test: visitors at the Realm of Elementals installation." />
              </picture>
            </figure>
          </div>
        </div>
      </section>

      {/* ═══ ENTER ═══ */}
      <section className="section enter" id="enter">
        <div className="enter__bg" aria-hidden="true"></div>
        <div className="wrap">
          <span className="kicker reveal">
            Visit the realm
          </span>
          <h2 className="display reveal" data-d="1">
            It is waiting
            <br />
            for
            <em>
              you.
            </em>
          </h2>
          <p className="lede reveal" data-d="2">
            No download, no account. Open the realm on your phone, point the camera at the butterfly, and the swarm comes alive in the room with you.
          </p>
          <div className="enter__steps2">
            <figure className="enter__card reveal" data-d="2">
              <span className="enter__step">
                Step 1 · Open
              </span>
              <a className="enter__card-frame enter__qr-card" href="https://realmofelementals.art" target="_blank" rel="noopener" aria-label="Open realmofelementals.art">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 29" shapeRendering="crispEdges">
                  <path stroke="#0a0f0a" d="M0 0.5h7m1 0h3m2 0h2m1 0h1m1 0h1m3 0h7M0 1.5h1m5 0h1m2 0h1m2 0h4m2 0h3m1 0h1m5 0h1M0 2.5h1m1 0h3m1 0h1m4 0h2m1 0h1m2 0h2m1 0h1m1 0h1m1 0h3m1 0h1M0 3.5h1m1 0h3m1 0h1m1 0h1m1 0h3m5 0h1m1 0h1m1 0h1m1 0h3m1 0h1M0 4.5h1m1 0h3m1 0h1m1 0h2m2 0h1m4 0h2m3 0h1m1 0h3m1 0h1M0 5.5h1m5 0h1m1 0h1m1 0h1m1 0h1m3 0h1m2 0h2m1 0h1m5 0h1M0 6.5h7m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M8 7.5h2m3 0h1m1 0h3m1 0h2M0 8.5h1m3 0h1m1 0h4m3 0h1m3 0h1m2 0h6m2 0h1M0 9.5h1m4 0h1m2 0h3m2 0h2m1 0h1m5 0h7M0 10.5h1m1 0h2m1 0h4m2 0h2m3 0h1m3 0h1m2 0h1m4 0h1M1 11.5h2m7 0h3m1 0h1m2 0h2m1 0h1m1 0h1m1 0h2m1 0h2M1 12.5h3m2 0h1m1 0h1m1 0h1m1 0h10m5 0h1M1 13.5h2m2 0h1m3 0h1m1 0h1m5 0h2m3 0h7M1 14.5h1m1 0h1m2 0h3m3 0h4m2 0h1m1 0h1m4 0h2m1 0h1M0 15.5h2m1 0h1m1 0h1m1 0h4m2 0h1m1 0h3m2 0h1m2 0h1m3 0h2M0 16.5h1m2 0h4m4 0h3m3 0h1m2 0h2m5 0h1M0 17.5h1m1 0h1m1 0h1m4 0h2m2 0h2m1 0h1m1 0h1m3 0h4m1 0h2M3 18.5h1m2 0h1m2 0h1m2 0h1m3 0h2m2 0h1m1 0h1m3 0h1m1 0h1M2 19.5h4m2 0h1m2 0h2m1 0h1m2 0h2m1 0h2m5 0h2M0 20.5h3m1 0h4m2 0h1m2 0h5m1 0h7m2 0h1M8 21.5h1m3 0h1m6 0h2m3 0h1m3 0h1M0 22.5h7m1 0h1m4 0h3m3 0h2m1 0h1m1 0h3m1 0h1M0 23.5h1m5 0h1m3 0h1m1 0h2m1 0h3m1 0h2m3 0h1m3 0h1M0 24.5h1m1 0h3m1 0h1m1 0h1m1 0h1m1 0h2m3 0h1m1 0h7m1 0h2M0 25.5h1m1 0h3m1 0h1m3 0h1m1 0h1m1 0h1m1 0h1m2 0h3m5 0h1M0 26.5h1m1 0h3m1 0h1m3 0h2m1 0h1m2 0h6m3 0h4M0 27.5h1m5 0h1m2 0h4m4 0h1m2 0h1m1 0h4m1 0h2M0 28.5h7m1 0h1m3 0h1m1 0h2m2 0h1m1 0h2m2 0h1m2 0h1"></path>
                </svg>
              </a>
              <figcaption>
                Scan to open the realm on your phone
              </figcaption>
            </figure>
            <div className="enter__arrow reveal" data-d="2" aria-hidden="true">
              <svg viewBox="0 0 60 24">
                <path d="M2 12h54m0 0-11-7m11 7-11 7" fill="none" stroke="currentColor" strokeWidth="1.5"></path>
              </svg>
            </div>
            <figure className="enter__card reveal" data-d="3">
              <span className="enter__step">
                Step 2 · Summon
              </span>
              <div className="enter__card-frame enter__target">
                <picture>
                  <source type="image/avif" srcSet="/realm/assets/target-emerald-peacock-landscape-sm.avif 726w, /realm/assets/target-emerald-peacock-landscape.avif 1319w" sizes="(max-width:640px) 92vw, 469px" />
                  <source type="image/webp" srcSet="/realm/assets/target-emerald-peacock-landscape-sm.webp 726w, /realm/assets/target-emerald-peacock-landscape.webp 1319w" sizes="(max-width:640px) 92vw, 469px" />
                  <img src="/realm/assets/target-emerald-peacock-landscape.png" width="1319" height="720" loading="lazy" decoding="async" alt="The Emerald Peacock butterfly marker. Point your camera at it to summon the swarm." />
                </picture>
              </div>
              <figcaption>
                Point your camera here to summon the swarm
              </figcaption>
            </figure>
          </div>
          <div className="enter__links reveal" data-d="4">
            <a href="https://realmofelementals.art" target="_blank" rel="noopener" className="btn">
              Enter the realm →
            </a>
            <a href="/realm/assets/target-emerald-peacock-landscape.png" download="" className="enter__url">
              Download the marker to print ↓
            </a>
          </div>
        </div>
      </section>

      {/* ═══ REFLECTION ═══ */}
      <section className="section reflection" id="reflection">
        <div className="wrap">
          <span className="kicker reveal">
            06 · Reflection
          </span>
          <h2 className="display reveal" data-d="1">
            What stayed with people
            <br />
            was not the data.
          </h2>
          <div className="reflection__grid">
            <p className="reflection__lead reveal" data-d="2">
              It was the name they gave her. The morning they remembered to do her offering. The small, irrational worry that she might not make it. Attachment, it turns out, is a conservation technology.
            </p>
            <ul className="reflection__list reveal" data-d="3">
              <li>
                <b>
                  Care over guilt.
                </b>
                Emotional attachment outperformed fear in every test session.
              </li>
              <li>
                <b>
                  Friction by design.
                </b>
                Slow growth made the creature feel real, not gamified.
              </li>
              <li>
                <b>
                  No install, no account.
                </b>
                WebAR removed every barrier between curiosity and care.
              </li>
              <li>
                <b>
                  Digital → physical → real.
                </b>
                The badge and installation closed the loop back to the world.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* ═══ RESEARCH ═══ */}
      <section className="section research" id="research">
        <div className="wrap">
          <span className="kicker reveal">
            07 · The Research
          </span>
          <h2 className="display reveal" data-d="1">
            Why this
            <em>
              was built.
            </em>
          </h2>
          <p className="lede reveal" data-d="2">
            Eight ideas behind the realm. Click any tile to open it.
          </p>
          <div className="bento reveal" id="bento" data-d="2">
            <button className="btile" type="button" aria-expanded="false" data-i="0" style={{ "--accent": "#7BBFB5" } as CSSProperties}>
              <span className="btile__head">
                <span className="btile__num">
                  01
                </span>
                {" "}
                <span className="btile__tag" style={{ background: "rgba(123,191,181,0.12)", color: "#7BBFB5" }}>
                  The Problem
                </span>
              </span>
              {" "}
              <span className="btile__art" aria-hidden="true">
                <svg viewBox="0 0 120 120" fill="none" stroke="currentColor">
                  <circle cx="60" cy="60" r="50" strokeWidth="1" opacity=".16" className="gx-breathe"></circle>
                  <circle cx="60" cy="60" r="37" strokeWidth="1.2" opacity=".28" className="gx-breathe" style={{ animationDelay: ".5s" }}></circle>
                  <circle cx="60" cy="60" r="24" strokeWidth="1.5" opacity=".48" className="gx-breathe" style={{ animationDelay: "1s" }}></circle>
                  <circle cx="60" cy="60" r="6" fill="currentColor" stroke="none" className="gx-pulse"></circle>
                </svg>
              </span>
              {" "}
              <span className="btile__hint">
                Extinction of experience
              </span>
              {" "}
              <span className="btile__detail">
                <span className="btile__headline">
                  The world is losing its nature, and nobody notices.
                </span>
                {" "}
                <span className="btile__body">
                  Biologist Robert Pyle called it the "Extinction of Experience." Urban populations have lost daily contact with the natural world, not through malice but through the ordinary accumulation of cities. The feedback loop: less exposure, less familiarity, less feeling, less action. Until even the absence goes unremarked.
                </span>
                {" "}
                <span className="btile__source">
                  Pyle, R. (1993). The Thunder Tree.
                </span>
              </span>
            </button>
            <button className="btile" type="button" aria-expanded="false" data-i="1" style={{ "--accent": "#C9A84C" } as CSSProperties}>
              <span className="btile__head">
                <span className="btile__num">
                  02
                </span>
                {" "}
                <span className="btile__tag" style={{ background: "rgba(201,168,76,0.10)", color: "#C9A84C" }}>
                  Policy Gap
                </span>
              </span>
              {" "}
              <span className="btile__art" aria-hidden="true">
                <svg viewBox="0 0 120 120" fill="none" stroke="currentColor">
                  <rect x="16" y="44" width="32" height="32" rx="7" strokeWidth="1.6" opacity=".7"></rect>
                  <rect x="72" y="44" width="32" height="32" rx="7" strokeWidth="1.6" opacity=".38"></rect>
                  <line x1="50" y1="60" x2="70" y2="60" strokeWidth="1.5" strokeDasharray="2 4" opacity=".55" className="gx-dash"></line>
                  <circle cx="60" cy="60" r="2.5" fill="currentColor" stroke="none" className="gx-pulse"></circle>
                </svg>
              </span>
              {" "}
              <span className="btile__hint">
                Policy cannot reach you
              </span>
              {" "}
              <span className="btile__detail">
                <span className="btile__headline">
                  Policy knows what to do. It cannot reach the individual.
                </span>
                {" "}
                <span className="btile__body">
                  CBD Kunming-Montreal 2030 Targets: 30% of land conserved. OECM principles establish protection. These frameworks are precise. They operate at institutional scale. They have no mechanism for a person in a city to feel what is being lost and choose differently. The gap between policy and behaviour is where design lives.
                </span>
                {" "}
                <span className="btile__source">
                  CBD COP15 (2022). Kunming-Montreal Framework.
                </span>
              </span>
            </button>
            <button className="btile" type="button" aria-expanded="false" data-i="2" style={{ "--accent": "#9F97E8" } as CSSProperties}>
              <span className="btile__head">
                <span className="btile__num">
                  03
                </span>
                {" "}
                <span className="btile__tag" style={{ background: "rgba(127,119,221,0.12)", color: "#9F97E8" }}>
                  Neuroscience
                </span>
              </span>
              {" "}
              <span className="btile__art" aria-hidden="true">
                <svg viewBox="0 0 120 120" fill="none" stroke="currentColor">
                  <circle cx="46" cy="60" r="22" strokeWidth="1.6" opacity=".5"></circle>
                  <circle cx="74" cy="60" r="22" strokeWidth="1.6" opacity=".5"></circle>
                  <circle cx="46" cy="60" r="3.5" fill="currentColor" stroke="none" className="gx-travel"></circle>
                </svg>
              </span>
              {" "}
              <span className="btile__hint">
                Emotion gates memory
              </span>
              {" "}
              <span className="btile__detail">
                <span className="btile__headline">
                  Emotion is the gate to memory. Facts don't pass through it alone.
                </span>
                {" "}
                <span className="btile__body">
                  The amygdala feeds directly into the hippocampus. Emotional arousal is the biological prerequisite for long-term memory encoding. Bloom's three learning domains: Cognitive, Affective, Psychomotor. Environmental education has historically only addressed one. The feeling must precede the fact, not follow it.
                </span>
                {" "}
                <span className="btile__source">
                  Bloom (1956). Taxonomy of Educational Objectives.
                </span>
              </span>
            </button>
            <button className="btile" type="button" aria-expanded="false" data-i="3" style={{ "--accent": "#E8925A" } as CSSProperties}>
              <span className="btile__head">
                <span className="btile__num">
                  04
                </span>
                {" "}
                <span className="btile__tag" style={{ background: "rgba(232,146,90,0.10)", color: "#E8925A" }}>
                  Decentering
                </span>
              </span>
              {" "}
              <span className="btile__art" aria-hidden="true">
                <svg viewBox="0 0 120 120" fill="none" stroke="currentColor">
                  <circle cx="48" cy="60" r="22" strokeWidth="1.4" strokeDasharray="3 4" opacity=".4" className="gx-spin"></circle>
                  <circle cx="72" cy="60" r="22" strokeWidth="1.8" opacity=".68"></circle>
                  <circle cx="72" cy="60" r="5" fill="currentColor" stroke="none" className="gx-pulse"></circle>
                </svg>
              </span>
              {" "}
              <span className="btile__hint">
                Change needs a threshold
              </span>
              {" "}
              <span className="btile__detail">
                <span className="btile__headline">
                  Identity cannot be changed from inside itself.
                </span>
                {" "}
                <span className="btile__body">
                  Decentering: a metacognitive process of stepping outside a fixed self-model. Four stages: disengagement, liminality, immersion, reintegration. The brain is a prediction machine that fiercely protects its models. Ritual has always been how humans safely update them. The chrysalis breathing exercise is a 42-second secular ritual. The stillness is the mechanism.
                </span>
                {" "}
                <span className="btile__source">
                  Bernstein et al. (2015). Perspectives on Psychological Science.
                </span>
              </span>
            </button>
            <button className="btile" type="button" aria-expanded="false" data-i="4" style={{ "--accent": "#52b788" } as CSSProperties}>
              <span className="btile__head">
                <span className="btile__num">
                  05
                </span>
                {" "}
                <span className="btile__tag" style={{ background: "rgba(45,106,79,0.15)", color: "#52b788" }}>
                  Mayeroff
                </span>
              </span>
              {" "}
              <span className="btile__art" aria-hidden="true">
                <svg viewBox="0 0 120 120" fill="none" stroke="currentColor">
                  <g className="gx-spin">
                    <circle cx="60" cy="60" r="34" strokeWidth="1" opacity=".2"></circle>
                    <line x1="70.0" y1="60.0" x2="94.0" y2="60.0" strokeWidth="1" opacity=".28"></line>
                    <line x1="67.1" y1="67.1" x2="84.0" y2="84.0" strokeWidth="1" opacity=".28"></line>
                    <line x1="60.0" y1="70.0" x2="60.0" y2="94.0" strokeWidth="1" opacity=".28"></line>
                    <line x1="52.9" y1="67.1" x2="36.0" y2="84.0" strokeWidth="1" opacity=".28"></line>
                    <line x1="50.0" y1="60.0" x2="26.0" y2="60.0" strokeWidth="1" opacity=".28"></line>
                    <line x1="52.9" y1="52.9" x2="36.0" y2="36.0" strokeWidth="1" opacity=".28"></line>
                    <line x1="60.0" y1="50.0" x2="60.0" y2="26.0" strokeWidth="1" opacity=".28"></line>
                    <line x1="67.1" y1="52.9" x2="84.0" y2="36.0" strokeWidth="1" opacity=".28"></line>
                    <circle cx="94.0" cy="60.0" r="3" fill="currentColor" stroke="none" opacity=".6"></circle>
                    <circle cx="84.0" cy="84.0" r="3" fill="currentColor" stroke="none" opacity=".6"></circle>
                    <circle cx="60.0" cy="94.0" r="3" fill="currentColor" stroke="none" opacity=".6"></circle>
                    <circle cx="36.0" cy="84.0" r="3" fill="currentColor" stroke="none" opacity=".6"></circle>
                    <circle cx="26.0" cy="60.0" r="3" fill="currentColor" stroke="none" opacity=".6"></circle>
                    <circle cx="36.0" cy="36.0" r="3" fill="currentColor" stroke="none" opacity=".6"></circle>
                    <circle cx="60.0" cy="26.0" r="3" fill="currentColor" stroke="none" opacity=".6"></circle>
                    <circle cx="84.0" cy="36.0" r="3" fill="currentColor" stroke="none" opacity=".6"></circle>
                  </g>
                  <circle cx="60" cy="60" r="7" fill="currentColor" stroke="none" className="gx-pulse"></circle>
                </svg>
              </span>
              {" "}
              <span className="btile__hint">
                Care is a practice
              </span>
              {" "}
              <span className="btile__detail">
                <span className="btile__headline">
                  Caring is not a feeling. It is a practice.
                </span>
                {" "}
                <span className="btile__body">
                  Milton Mayeroff, On Caring (1971): knowing, patience, honesty, trust, humility, hope, courage, devotion. And reciprocity: caring flows both ways, or it is not caring. The butterfly gives first: morning messages, observations, presence. Then it asks. That order is not a design decision. It is Mayeroff's prerequisite.
                </span>
                {" "}
                <span className="btile__source">
                  Mayeroff, M. (1971). On Caring. Harper & Row.
                </span>
              </span>
            </button>
            <button className="btile" type="button" aria-expanded="false" data-i="5" style={{ "--accent": "#C9A84C" } as CSSProperties}>
              <span className="btile__head">
                <span className="btile__num">
                  06
                </span>
                {" "}
                <span className="btile__tag" style={{ background: "rgba(201,168,76,0.10)", color: "#C9A84C" }}>
                  Tamagotchi Effect
                </span>
              </span>
              {" "}
              <span className="btile__art" aria-hidden="true">
                <svg viewBox="0 0 120 120" fill="none" stroke="currentColor">
                  <rect x="38" y="26" width="44" height="68" rx="17" strokeWidth="1.6" opacity=".55"></rect>
                  <path d="M48 60 h6 l4 -12 l6 24 l4 -12 h6" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="gx-pulse"></path>
                  <circle cx="60" cy="84" r="2.5" fill="currentColor" stroke="none" opacity=".5"></circle>
                </svg>
              </span>
              {" "}
              <span className="btile__hint">
                Attachment through need
              </span>
              {" "}
              <span className="btile__detail">
                <span className="btile__headline">
                  Genuine attachment forms through need, not charm.
                </span>
                {" "}
                <span className="btile__body">
                  In 1996 Bandai reversed the logic of entertainment. The Tamagotchi made demands: it could die of neglect. The mechanism: the creature needs you, not the other way around. Mentor Shoban Shah (RCA London): "Let them care for it for 7 to 10 days. As they feed and interact, they build a bond. Post this bonding, introduce the confrontation."
                </span>
                {" "}
                <span className="btile__source">
                  Allison, A. (2006). Millennial Monsters.
                </span>
              </span>
            </button>
            <button className="btile" type="button" aria-expanded="false" data-i="6" style={{ "--accent": "#7BBFB5" } as CSSProperties}>
              <span className="btile__head">
                <span className="btile__num">
                  07
                </span>
                {" "}
                <span className="btile__tag" style={{ background: "rgba(123,191,181,0.10)", color: "#7BBFB5" }}>
                  The Butterfly
                </span>
              </span>
              {" "}
              <span className="btile__art" aria-hidden="true">
                <svg viewBox="0 0 120 120">
                  <g fill="currentColor" opacity=".85">
                    <g transform="translate(15 15) scale(0.42)">
                      <use href="#bf-glyph" className="gx-flap"></use>
                    </g>
                    <g transform="translate(63 15) scale(0.42)">
                      <use href="#bf-glyph" className="gx-flap" style={{ animationDelay: ".6s" }}></use>
                    </g>
                    <g transform="translate(15 63) scale(0.42)">
                      <use href="#bf-glyph" className="gx-flap" style={{ animationDelay: "1.2s" }}></use>
                    </g>
                    <g transform="translate(63 63) scale(0.42)">
                      <use href="#bf-glyph" className="gx-flap" style={{ animationDelay: "1.8s" }}></use>
                    </g>
                  </g>
                </svg>
              </span>
              {" "}
              <span className="btile__hint">
                Four real species
              </span>
              {" "}
              <span className="btile__detail">
                <span className="btile__headline">
                  Four species. One entry point into the natural world.
                </span>
                {" "}
                <span className="btile__body">
                  Crimson Rose: legally protected, Schedule II India 2022, migrates across the Palk Strait. Blue Mormon: largest Indian butterfly, Western Ghats endemic. Tailed Jay: electric green-black, pan-India. Common Emigrant: migratory, the ordinary miracle most people walk past without noticing. Each species carries its own story. The realm eventually tells all of them.
                </span>
                {" "}
                <span className="btile__source">
                  Wildlife Protection Act, India (2022).
                </span>
              </span>
            </button>
            <button className="btile" type="button" aria-expanded="false" data-i="7" style={{ "--accent": "#E8925A" } as CSSProperties}>
              <span className="btile__head">
                <span className="btile__num">
                  08
                </span>
                {" "}
                <span className="btile__tag" style={{ background: "rgba(232,146,90,0.10)", color: "#E8925A" }}>
                  The Proof
                </span>
              </span>
              {" "}
              <span className="btile__art" aria-hidden="true">
                <svg viewBox="0 0 120 120" fill="none" stroke="currentColor">
                  <line x1="22" y1="66" x2="98" y2="66" strokeWidth="1" strokeDasharray="2 5" opacity=".22" className="gx-dash"></line>
                  <g fill="currentColor" stroke="none" opacity=".5">
                    <circle cx="24" cy="66" r="3.5"></circle>
                    <circle cx="31" cy="66" r="3.5"></circle>
                    <circle cx="38" cy="66" r="3.5"></circle>
                  </g>
                  <path d="M60 48 q7 7 0 30 q-7 -23 0 -30 Z" strokeWidth="1.6" opacity=".7" className="gx-sway"></path>
                  <g transform="translate(76 45) scale(0.38)" fill="currentColor" stroke="none">
                    <use href="#bf-glyph" className="gx-flap"></use>
                  </g>
                </svg>
              </span>
              {" "}
              <span className="btile__hint">
                Proven in a garden
              </span>
              {" "}
              <span className="btile__detail">
                <span className="btile__headline">
                  The mechanism was proven in a garden, not a lab.
                </span>
                {" "}
                <span className="btile__body">
                  An Oleander Hawk Moth caterpillar appeared at home. A family member wanted to discard it. It was brought inside. For two weeks it was observed: feeding, growing, becoming a moth. When it flew she said: "It doesn't even know you took care of it." The reply: "That's exactly what nature does to us." One woman. Two weeks. No lecture.
                </span>
                {" "}
                <span className="btile__source">
                  Personal observation. Tiruchirappalli, 2025.
                </span>
              </span>
            </button>
          </div>
        </div>
      </section>
      </div>

      <RealmInteractions rootRef={rootRef} />
    </div>
  );
}
