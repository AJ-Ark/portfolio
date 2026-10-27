"use client";

/* ══════════════════════════════════════════════════════════════════
   THE SURVEY — homepage, v3.

   One wheel tick / swipe / key press = exactly one slide (hero + one
   "elevation" per project), carousel-over transition — same hijack
   grammar the old HomeReel used. What's different: no video/image
   background, no timed disclosure. Each slide is static construction-
   document copy (index, title, one-liner, CTA), and the GPU dust field
   holds that project's formation for exactly as long as its slide is on
   screen — driven by `slide` state directly, not a timer. The formation
   shape IS the glimpse (orbital rings, cube lattice, butterfly, ripple
   rings — ENGINE-API.md §1).

   Reduced motion: the hijack is skipped entirely — slides render as a
   plain, natively-scrollable stack, no formation driving (same calm-path
   convention as DomainTheme/HomeReel/Overlook).

   Consumes ONLY the public engine API (useParticle) and the shared
   project data (src/data/projects.ts) — no coupling to the old reel.
   ══════════════════════════════════════════════════════════════════ */

import Link from "next/link";
import { motion, type Transition } from "framer-motion";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
  type ReactNode,
} from "react";
import Reveal from "@/components/ui/Reveal";
import { useParticle, useWarpNavigate } from "@/lib/particleContext";
import { useTranslation } from "@/lib/TranslationContext";
import { SPRING } from "@/lib/motion";
import {
  prefersReducedMotionNow,
  usePrefersReducedMotion,
} from "@/hooks/usePrefersReducedMotion";
import { projectsBySlug, type Domain, type Project } from "@/data/projects";

/* Curated order — Realm leads as the flagship/newest piece, same order
   the previous homepage used. Independent of data/projects.ts' own
   array order (which /work sorts differently). */
const SURVEY_ORDER: Domain[] = ["realm", "rippl", "trmeric", "rozi"];

/* Seats the particle cluster right-of-center, clear of the text column —
   same convention as HomeReel's CARD_OFFSET_X and Overlook's
   FORMATION_OFFSET_X. */
const FORMATION_OFFSET_X = 0.5;

const SURVEY_OWNER = "home-survey";

const WHEEL_THRESHOLD = 12;       // px of deltaY to count as an intentional tick
const TOUCH_THRESHOLD = 50;       // px of swipe distance before it registers
const TRANSITION_LOCK_MS = 800;   // matches SPRING's settle time, blocks re-trigger mid-animation

/* Screen-reader-only — same clip pattern HomeReel used (globals.css owns
   no .sr-only utility). */
const VISUALLY_HIDDEN: React.CSSProperties = {
  position: "absolute",
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: "hidden",
  clip: "rect(0 0 0 0)",
  whiteSpace: "nowrap",
  border: 0,
};

/* SmoothScroll creates the Lenis instance in its own effect, which commits
   AFTER this component's effects (React fires child effects before parent
   effects on mount). Retry across a few frames rather than trust it's
   there on the first try. */
function withLenis(fn: (lenis: NonNullable<Window["__lenis"]>) => void, attempts = 30) {
  if (window.__lenis) { fn(window.__lenis); return; }
  if (attempts <= 0) return;
  requestAnimationFrame(() => withLenis(fn, attempts - 1));
}

export default function HomeSurvey() {
  const reducedMotion = usePrefersReducedMotion();
  return reducedMotion ? <SurveyStack /> : <SurveyCarousel />;
}

/* ── Reduced motion: plain, natively-scrollable stack ────────────────
   No hijack, no formation driving — the calm-path convention this
   codebase already uses (DomainTheme/HomeReel/Overlook all skip
   formation/palette changes under reduced motion). */
function SurveyStack() {
  return (
    <div className="survey">
      <style>{SURVEY_CSS}</style>
      <section className="survey-hero">
        <HeroContent />
      </section>
      {SURVEY_ORDER.map((slug, i) => (
        <section key={slug} className="survey-row">
          <ProjectContent index={i + 1} total={SURVEY_ORDER.length} project={projectsBySlug[slug]} />
        </section>
      ))}
    </div>
  );
}

/* ── Default: the hijacked, one-slide-at-a-time carousel ─────────────── */
function SurveyCarousel() {
  const totalSlides = SURVEY_ORDER.length + 1; // +1 for hero
  const { requestFormation } = useParticle();
  const { t } = useTranslation();
  const [slide, setSlide] = useState(0);
  const slideRef = useRef(0);
  slideRef.current = slide;
  const activeRef = useRef(true);
  const lockedRef = useRef(false);
  const touchStartY = useRef<number | null>(null);
  const containerRef = useRef<HTMLElement | null>(null);

  const goTo = useCallback((next: number) => {
    const clamped = Math.max(0, Math.min(totalSlides - 1, next));
    if (clamped === slideRef.current) return;
    lockedRef.current = true;
    setSlide(clamped);
    window.setTimeout(() => { lockedRef.current = false; }, TRANSITION_LOCK_MS);
  }, [totalSlides]);

  const release = useCallback(() => {
    activeRef.current = false;
    withLenis((lenis) => lenis.start());
  }, []);

  const engage = useCallback((atSlide: number) => {
    activeRef.current = true;
    setSlide(atSlide);
    window.scrollTo(0, 0);
    withLenis((lenis) => { lenis.scrollTo(0, { immediate: true }); lenis.stop(); });
  }, []);

  /* This block sits first on the page, so it owns the screen from scrollY
     0. Force manual scroll restoration and pin scrollY to 0 on mount — a
     reload mid-scroll would otherwise land past this block before React
     mounts, desyncing slide state from real scroll position. */
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
    withLenis((lenis) => { lenis.scrollTo(0, { immediate: true }); lenis.stop(); });
    return () => { withLenis((lenis) => lenis.start()); };
  }, []);

  useEffect(() => {
    function handleWheel(e: WheelEvent) {
      if (!activeRef.current) return;
      const goingDown = e.deltaY > 0;
      const atEnd = goingDown && slideRef.current >= totalSlides - 1;
      if (!atEnd || lockedRef.current) e.preventDefault();
      if (lockedRef.current) return;
      if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) return;

      if (goingDown) {
        if (slideRef.current < totalSlides - 1) goTo(slideRef.current + 1);
        else release();
      } else if (slideRef.current > 0) {
        goTo(slideRef.current - 1);
      }
    }

    function handleTouchStart(e: TouchEvent) {
      touchStartY.current = e.touches[0].clientY;
    }
    function handleTouchMove(e: TouchEvent) {
      if (e.touches.length > 1) { touchStartY.current = null; return; }
      if (!activeRef.current || touchStartY.current === null) return;
      const dy = touchStartY.current - e.touches[0].clientY;
      const goingDown = dy > 0;
      const atEnd = goingDown && slideRef.current >= totalSlides - 1;
      if (!atEnd || lockedRef.current) e.preventDefault();
      if (lockedRef.current) return;
      if (Math.abs(dy) < TOUCH_THRESHOLD) return;

      if (goingDown) {
        if (slideRef.current < totalSlides - 1) {
          goTo(slideRef.current + 1);
          touchStartY.current = e.touches[0].clientY;
        } else {
          release();
        }
      } else if (slideRef.current > 0) {
        goTo(slideRef.current - 1);
        touchStartY.current = e.touches[0].clientY;
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (!activeRef.current) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && target.closest("input, textarea, select, button, [contenteditable='true']")) return;

      if (e.key === "Home" || e.key === "End") {
        e.preventDefault();
        if (lockedRef.current) return;
        goTo(e.key === "Home" ? 0 : totalSlides - 1);
        return;
      }

      let dir = 0;
      if (e.key === "ArrowDown" || e.key === "PageDown") dir = 1;
      else if (e.key === "ArrowUp" || e.key === "PageUp") dir = -1;
      else if (e.key === " ") dir = e.shiftKey ? -1 : 1;
      else return;

      const atEnd = dir > 0 && slideRef.current >= totalSlides - 1;
      if (!atEnd || lockedRef.current) e.preventDefault();
      if (lockedRef.current) return;

      if (dir > 0) {
        if (slideRef.current < totalSlides - 1) goTo(slideRef.current + 1);
        else release();
      } else if (slideRef.current > 0) {
        goTo(slideRef.current - 1);
      }
    }

    /* Focus landing outside the reel releases the hijack (native scroll
       already moved the viewport there); focus landing on a parked slide
       re-engages onto it. */
    function handleFocusIn(e: FocusEvent) {
      const target = e.target as HTMLElement | null;
      const container = containerRef.current;
      if (!target || !container) return;
      if (!container.contains(target)) {
        const following =
          container.compareDocumentPosition(target) &
          Node.DOCUMENT_POSITION_FOLLOWING;
        if (activeRef.current && following) release();
        return;
      }
      const slideEl = target.closest<HTMLElement>("[data-survey-slide]");
      if (!slideEl) return;
      const index = Number(slideEl.dataset.surveySlide);
      if (!Number.isFinite(index)) return;
      container.scrollTop = 0;
      if (!activeRef.current) {
        engage(index);
      } else {
        window.scrollTo(0, 0);
        if (index !== slideRef.current) goTo(index);
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("focusin", handleFocusIn);
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("focusin", handleFocusIn);
    };
  }, [goTo, release, engage, totalSlides]);

  /* Re-engage once the user scrolls back up to the very top of the page. */
  useEffect(() => {
    function handleScroll() {
      if (activeRef.current) return;
      if (window.scrollY <= 2) engage(totalSlides - 1);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [engage, totalSlides]);

  /* Formation + palette follow `slide` directly — no timer, no observer.
     The field shows exactly the project whose slide is on screen. */
  useEffect(() => {
    if (prefersReducedMotionNow()) return;
    const activeSlug = slide === 0 ? null : SURVEY_ORDER[slide - 1];
    requestFormation(activeSlug, {
      offsetX: activeSlug ? FORMATION_OFFSET_X : 0,
      owner: SURVEY_OWNER,
    });
    const html = document.documentElement;
    if (activeSlug) html.setAttribute("data-domain", activeSlug);
    else html.removeAttribute("data-domain");
  }, [slide, requestFormation]);

  useEffect(() => {
    return () => {
      requestFormation(null, { owner: SURVEY_OWNER });
      document.documentElement.removeAttribute("data-domain");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const slideTitle = slide === 0 ? t("home.hero.line1") : projectsBySlug[SURVEY_ORDER[slide - 1]]?.title ?? "";

  return (
    <section
      ref={containerRef}
      aria-roledescription="carousel"
      aria-label={t("home.reel.ariaLabel")}
      style={{ height: "100dvh", position: "relative", overflow: "hidden" }}
    >
      <Slide index={0} active={slide} total={totalSlides}>
        <div className="survey-hero">
          <HeroContent />
        </div>
      </Slide>
      {SURVEY_ORDER.map((slug, i) => (
        <Slide key={slug} index={i + 1} active={slide} total={totalSlides}>
          <div className="survey-row">
            <ProjectContent index={i + 1} total={SURVEY_ORDER.length} project={projectsBySlug[slug]} />
          </div>
        </Slide>
      ))}

      <div aria-live="polite" style={VISUALLY_HIDDEN}>
        {`${t("home.reel.slide")} ${slide + 1} / ${totalSlides} — ${slideTitle}`}
      </div>

      <style>{SURVEY_CSS + CAROUSEL_CSS}</style>
    </section>
  );
}

/* Parked (visually offscreen) slides stay in the accessibility tree and
   keep their links focusable — the focusin navigation above depends on
   it. Click containment is pure CSS: the !important pair beats the
   inline pointerEvents:"auto" the active slide re-enables for itself. */
function Slide({ index, active, total, children }: {
  index: number;
  active: number;
  total: number;
  children: ReactNode;
}) {
  const diff = index - active;
  const transition: Transition = SPRING;

  return (
    <motion.div
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} / ${total}`}
      data-survey-slide={index}
      data-parked={diff === 0 ? undefined : "true"}
      animate={{ y: `${diff * 100}%` }}
      transition={transition}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 10 - Math.abs(diff),
        pointerEvents: "none",
        // SSR / pre-hydration position — framer's `animate` only writes
        // the transform client-side.
        transform: `translateY(${diff * 100}%)`,
      }}
    >
      {children}
    </motion.div>
  );
}

function HeroContent() {
  const { t } = useTranslation();
  return (
    <Reveal stagger delay={0.1} style={{ position: "relative", zIndex: 1 }}>
      <h1
        style={{
          display: "flex",
          flexDirection: "column",
          fontFamily: "var(--font-display)",
          fontWeight: 260,
          lineHeight: 1.0,
          letterSpacing: "-.02em",
          marginBottom: "2.5rem",
        }}
      >
        <span style={{ fontSize: "clamp(2.6rem, 7.5vw, 6rem)", color: "var(--color-paper)" }}>
          {t("home.hero.line1")}
        </span>
        <span
          style={{
            fontSize: "clamp(2.6rem, 7.5vw, 6rem)",
            fontStyle: "italic",
            color: "var(--color-accent)",
            paddingLeft: "clamp(1rem, 4vw, 4rem)",
          }}
        >
          {t("home.hero.line2")}
        </span>
        <span
          style={{
            fontSize: "clamp(1.1rem, 2.8vw, 2.6rem)",
            color: "var(--color-graphite-light)",
            fontWeight: 300,
            marginTop: "1.5rem",
          }}
        >
          {t("home.tagline")}
        </span>
      </h1>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "2rem",
          paddingTop: "1.5rem",
          borderTop: "1px solid var(--line)",
          flexWrap: "wrap",
        }}
      >
        <span className="survey-role">{t("home.role1")}</span>
        <span className="survey-role">{t("home.role2")}</span>
      </div>
      <div className="survey-scroll-cue" aria-hidden="true">
        <span className="survey-scroll-line" />
        <span>{t("home.scroll")}</span>
      </div>
    </Reveal>
  );
}

function ProjectContent({
  index,
  total,
  project,
}: {
  index: number;
  total: number;
  project: Project;
}) {
  const { t } = useTranslation();
  const warpNav = useWarpNavigate();
  const pad = (n: number) => String(n).padStart(2, "0");

  function onNavigate(e: MouseEvent<HTMLAnchorElement>) {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    warpNav(`/work/${project.slug}`, project.domain);
  }

  return (
    <Link
      href={`/work/${project.slug}`}
      className="survey-link"
      data-cursor="enter"
      onClick={onNavigate}
      style={{ "--survey-accent": project.accent, pointerEvents: "auto" } as CSSProperties}
    >
      <Reveal className="survey-content" stagger delay={0.05}>
        <div className="survey-index">
          <span className="survey-index-num">{pad(index)}</span>
          <span className="survey-index-total">/ {pad(total)}</span>
        </div>

        <h2 className="survey-title">{project.title}</h2>
        <p className="survey-oneliner">{project.oneLiner}</p>

        <span className="survey-cta">{t("home.reel.enter")}</span>
      </Reveal>
    </Link>
  );
}

const SURVEY_CSS = `
  .survey { position: relative; }

  .survey-hero {
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 0 var(--pad) 4.5rem;
    position: relative;
  }

  /* Small mono labels sit directly over the live particle field — no
     solid backdrop behind them. A dark halo (same technique /work uses
     for its row annotations) lifts them off the bright flecks so they
     stay legible without a boxy card, in both themes. */
  .survey-role,
  .survey-scroll-cue,
  .survey-index-total,
  .survey-index-num,
  .survey-cta {
    text-shadow: 0 1px 14px rgba(0, 0, 0, .7), 0 0 3px rgba(0, 0, 0, .6);
  }

  .survey-role {
    font-family: var(--font-mono);
    font-size: .68rem;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: var(--color-paper);
    opacity: .85;
  }

  .survey-scroll-cue {
    display: inline-flex;
    align-items: center;
    gap: .65rem;
    margin-top: 3rem;
    font-family: var(--font-mono);
    font-size: .65rem;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: var(--color-paper);
    opacity: .7;
  }
  .survey-scroll-line {
    width: 2rem;
    height: 1px;
    background: var(--line);
  }

  .survey-row {
    min-height: 100dvh;
    height: 100%;
    display: flex;
    align-items: center;
    position: relative;
    border-top: 1px solid var(--line);
  }

  .survey-link {
    display: block;
    width: 100%;
    padding: 4rem var(--pad);
    text-decoration: none;
    color: inherit;
  }

  .survey-content {
    max-width: min(48ch, 62%);
    position: relative;
    z-index: 1;
  }

  .survey-index {
    display: flex;
    align-items: baseline;
    gap: .5rem;
    font-family: var(--font-mono);
    margin-bottom: 1.4rem;
  }
  .survey-index-num {
    font-size: .8rem;
    letter-spacing: .1em;
    color: var(--survey-accent);
  }
  .survey-index-total {
    font-size: .65rem;
    letter-spacing: .1em;
    color: var(--color-paper);
    opacity: .6;
  }

  .survey-title {
    font-family: var(--font-display);
    font-optical-sizing: auto;
    font-weight: 340;
    font-size: clamp(2.4rem, 5.5vw, 4.6rem);
    line-height: 1.02;
    letter-spacing: -.02em;
    color: var(--color-paper);
    margin: 0 0 1.1rem;
  }

  .survey-oneliner {
    font-family: var(--font-body);
    font-size: 1.1rem;
    line-height: 1.6;
    color: var(--color-graphite-light);
    max-width: 38ch;
    margin: 0 0 2.4rem;
  }

  .survey-cta {
    display: inline-flex;
    align-items: center;
    gap: .65rem;
    font-family: var(--font-mono);
    font-size: .68rem;
    letter-spacing: .16em;
    text-transform: uppercase;
    color: var(--survey-accent);
  }
  .survey-cta::before {
    content: "";
    width: 2rem;
    height: 1px;
    background: currentColor;
  }

  @media (max-width: 760px) {
    .survey-content { max-width: 100%; }
  }
`;

/* Carousel-only additions: parked-slide click containment. */
const CAROUSEL_CSS = `
  [data-survey-slide][data-parked],
  [data-survey-slide][data-parked] * { pointer-events: none !important; }
  .survey-row { border-top: none; }
`;
