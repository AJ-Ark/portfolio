"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useParticle, useWarpNavigate } from "@/lib/particleContext";
import { useTranslation } from "@/lib/TranslationContext";
import { SPRING } from "@/lib/motion";
import {
  prefersReducedMotionNow,
  usePrefersReducedMotion,
} from "@/hooks/usePrefersReducedMotion";
import type { Domain } from "@/data/projects";

interface DomainItem {
  slug: Domain;
  headline: string;
  body: string;
  label: string;
  accent: string;
}

const WHEEL_THRESHOLD = 12;       // px of deltaY to count as an intentional tick
const TOUCH_THRESHOLD = 50;       // px of swipe distance before it registers
const TRANSITION_LOCK_MS = 800;   // matches SPRING's settle time (src/lib/motion.ts), blocks re-trigger mid-animation

/* Every card reserves the same right-side zone for its particle figure
   (unlike the old side-by-side grid, there's no left/center/right column
   to account for here — it's always the same single-card layout). */
const CARD_OFFSET_X = 0.5;

/* Screen-reader-only — globals.css has no .sr-only utility and is owned
   elsewhere, so the clip pattern lives here inline. */
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

/* Shared by both render branches (hijacked reel + reduced-motion stack). */
const MOBILE_CSS = `
  @media (max-width: 760px) {
    .reel-spacer { display: none !important; }
    .reel-text {
      max-width: 100% !important;
      /* Fade to the THEME ground (not a hardcoded near-black) so the
         dark text stays readable in light mode. */
      background: linear-gradient(to top,
        var(--color-ground) 28%,
        color-mix(in srgb, var(--color-ground) 55%, transparent) 48%,
        transparent 78%) !important;
      justify-content: flex-end !important;
      padding-bottom: 3.5rem !important;
    }
  }
`;

/* SmoothScroll creates the Lenis instance in its own effect, which — being
   a parent of this component — commits AFTER this component's effects
   (React fires child effects before parent effects on mount). A single
   `window.__lenis?.stop()` call on mount can silently no-op because the
   instance doesn't exist yet, leaving Lenis fighting the hijack until
   something re-calls stop() later. Retry across a few frames instead of
   trusting it's there on the first try. */
function withLenis(fn: (lenis: NonNullable<Window["__lenis"]>) => void, attempts = 30) {
  if (window.__lenis) { fn(window.__lenis); return; }
  if (attempts <= 0) return;
  requestAnimationFrame(() => withLenis(fn, attempts - 1));
}

/* Reduced motion means the reel must not hijack scroll AT ALL — those
   visitors get the same content as a plain, normally scrollable stack.
   usePrefersReducedMotion starts false (server/first-render parity), so
   effects that mutate scroll state (pin to top, stop Lenis) double-check
   prefersReducedMotionNow() — otherwise they run once for reduced-motion
   users during the first commit, wiping e.g. the browser's restored
   scroll position on back-navigation before the state flips. */

/**
 * Hero + the three project cards as one reels-style paginated block.
 * One wheel tick / swipe / key press = exactly one slide, carousel-over
 * transition. Scrolling past the last slide releases control back to normal
 * page scroll (Lenis resumes) so the About section below scrolls in
 * normally; scrolling back up to the top of the page re-engages the hijack.
 * With prefers-reduced-motion the whole hijack is skipped and the slides
 * render as a normally scrollable vertical stack instead.
 */
export default function HomeReel({ domains }: { domains: DomainItem[] }) {
  const reducedMotion = usePrefersReducedMotion();
  const totalSlides = domains.length + 1; // +1 for hero
  const { setPreviewDomain } = useParticle();
  const { t } = useTranslation();
  const [slide, setSlide] = useState(0);
  const [hinting, setHinting] = useState(false);
  const slideRef = useRef(0);
  slideRef.current = slide;
  const activeRef = useRef(true);
  const lockedRef = useRef(false);
  const touchStartY = useRef<number | null>(null);

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

  /* This block sits first on the page, so it owns the screen from scrollY 0.
     Browsers restore the previous scroll position on reload by default —
     after repeatedly testing this page mid-scroll, a fresh reload can land
     scrollY somewhere past this block before React even mounts, which is
     exactly what desyncs the slide state (stuck at 0 / Hero) from the real
     scroll position (already down at About/Footer). Force manual
     restoration and pin scrollY to 0 on every mount. */
  useEffect(() => {
    if (reducedMotion || prefersReducedMotionNow()) {
      // The stack scrolls natively; give the browser its default behaviour back.
      if ("scrollRestoration" in window.history) {
        window.history.scrollRestoration = "auto";
      }
      return;
    }
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
    withLenis((lenis) => { lenis.scrollTo(0, { immediate: true }); lenis.stop(); });
    return () => { withLenis((lenis) => lenis.start()); };
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion || prefersReducedMotionNow()) return;

    function handleWheel(e: WheelEvent) {
      if (!activeRef.current) return;
      // Block real scroll for every wheel event while hijacking, not just
      // the ones that trigger a slide change — otherwise small-delta
      // trackpad events (and events during the transition lock) leak
      // through and drift the real page scroll position out of sync with
      // the slide we think is showing.
      const goingDown = e.deltaY > 0;
      const atEnd = goingDown && slideRef.current >= totalSlides - 1;
      // While the transition lock is running the reel is still engaged, so
      // even the at-end press must be swallowed — otherwise it leaks a
      // native scroll without release() and desyncs scrollY from the reel.
      if (!atEnd || lockedRef.current) e.preventDefault();
      if (lockedRef.current) return;
      if (Math.abs(e.deltaY) < WHEEL_THRESHOLD) return;

      if (goingDown) {
        if (slideRef.current < totalSlides - 1) {
          goTo(slideRef.current + 1);
        } else {
          release();
        }
      } else if (slideRef.current > 0) {
        goTo(slideRef.current - 1);
      }
    }

    function handleTouchStart(e: TouchEvent) {
      touchStartY.current = e.touches[0].clientY;
    }
    function handleTouchMove(e: TouchEvent) {
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

    /* Keyboard drives the exact same code path as wheel. While the reel is
       engaged the browser's native key-scroll MUST be preventDefault-ed —
       Lenis.stop() does not intercept keyboard scrolling, so without this
       Space/PageDown silently scroll the real document underneath the
       hijack and desync scrollY from the slide state. */
    function handleKeyDown(e: KeyboardEvent) {
      if (!activeRef.current) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      // Let form controls and buttons keep their native key behaviour
      // (Space activates buttons, arrows move carets).
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

      // Same policy as wheel: swallow the native scroll for every handled
      // press — except the final downward press on the last slide, which
      // releases the reel and lets the browser carry that same event on
      // into the page below. During the transition lock even that press is
      // swallowed: release() wouldn't run, so letting it through would
      // native-scroll the document while the reel is still engaged.
      const atEnd = dir > 0 && slideRef.current >= totalSlides - 1;
      if (!atEnd || lockedRef.current) e.preventDefault();
      if (lockedRef.current) return;

      if (dir > 0) {
        if (slideRef.current < totalSlides - 1) {
          goTo(slideRef.current + 1);
        } else {
          release();
        }
      } else if (slideRef.current > 0) {
        goTo(slideRef.current - 1);
      }
    }

    window.addEventListener("wheel", handleWheel, { passive: false });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [goTo, release, totalSlides, reducedMotion]);

  /* Re-engage once the user scrolls back up to the very top of the page,
     i.e. back to where this block naturally sits. */
  useEffect(() => {
    if (reducedMotion) return;
    function handleScroll() {
      if (activeRef.current) return;
      if (window.scrollY <= 2) engage(totalSlides - 1);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [engage, totalSlides, reducedMotion]);

  useEffect(() => {
    if (reducedMotion || slide === 0) {
      setPreviewDomain(null);
      return;
    }
    const item = domains[slide - 1];
    if (!item) return;
    const isMobile = typeof window !== "undefined" && window.innerWidth <= 760;
    setPreviewDomain(item.slug, isMobile ? 0 : CARD_OFFSET_X);
  }, [slide, domains, setPreviewDomain, reducedMotion]);

  /* Clear the preview when the reel unmounts (navigation away) so a stale
     preview never overrides the route-driven domain on the next page. */
  useEffect(() => () => setPreviewDomain(null), [setPreviewDomain]);

  /* After 2 s idle on the hero slide, nudge the first project card up as a
     "peek-and-retreat" hint, then pull it back — letting visitors know there
     is scrollable content below without any text cue needed. */
  useEffect(() => {
    if (reducedMotion || slide !== 0) { setHinting(false); return; }
    const t = window.setTimeout(() => setHinting(true), 2000);
    return () => window.clearTimeout(t);
  }, [slide, reducedMotion]);

  /* Cancel the hint the moment the user touches anything. Listeners are
     attached only while the hint is showing — not for the reel's lifetime. */
  useEffect(() => {
    if (!hinting) return;
    function cancel() { setHinting(false); }
    window.addEventListener("wheel", cancel, { passive: true });
    window.addEventListener("touchstart", cancel, { passive: true });
    window.addEventListener("keydown", cancel, { passive: true });
    return () => {
      window.removeEventListener("wheel", cancel);
      window.removeEventListener("touchstart", cancel);
      window.removeEventListener("keydown", cancel);
    };
  }, [hinting]);

  /* ── Reduced-motion branch: a real alternative render, not shorter
        animations. Plain vertically stacked sections, native scrolling,
        no springs, no wheel/keyboard interception, no warp dive. ── */
  if (reducedMotion) {
    return (
      <div>
        <section style={{ height: "100dvh", position: "relative" }}>
          <HeroContent />
        </section>
        {domains.map((item) => (
          <section key={item.slug} style={{ height: "100dvh", position: "relative" }}>
            <ProjectContent item={item} instant />
          </section>
        ))}
        <style>{MOBILE_CSS}</style>
      </div>
    );
  }

  const slideTitle = slide === 0 ? t("home.hero.line1") : domains[slide - 1]?.headline ?? "";

  return (
    <section
      aria-roledescription="carousel"
      aria-label={t("home.reel.ariaLabel")}
      style={{ height: "100dvh", position: "relative", overflow: "hidden" }}
    >
      <Slide index={0} active={slide} total={totalSlides}>
        <HeroContent />
      </Slide>
      {domains.map((item, i) => (
        <Slide key={item.slug} index={i + 1} active={slide} total={totalSlides} hinting={hinting && i === 0}>
          <ProjectContent item={item} />
        </Slide>
      ))}

      <ProgressRail current={slide} total={totalSlides} />

      {/* Announce slide position to screen readers on every index change.
          Numerals stay language-neutral; the slide word is translated. */}
      <div aria-live="polite" style={VISUALLY_HIDDEN}>
        {`${t("home.reel.slide")} ${slide + 1} / ${totalSlides} — ${slideTitle}`}
      </div>

      <style>{MOBILE_CSS}</style>
    </section>
  );
}

/* Quiet editorial progress indicator — mono numerals around a hairline
   whose fill rides the same spring as the slides. Bottom-left, below the
   content band of every slide (hero copy and .reel-text both keep a
   3.5rem bottom padding, so 1.6rem is always clear). */
function ProgressRail({ current, total }: { current: number; total: number }) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        left: "var(--pad)",
        bottom: "1.6rem",
        zIndex: 20,
        display: "flex",
        alignItems: "center",
        gap: ".7rem",
        pointerEvents: "none",
      }}
    >
      <span style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".18em", color: "var(--color-accent)", opacity: 0.9, fontVariantNumeric: "tabular-nums" }}>
        {pad(current + 1)}
      </span>
      <span style={{ position: "relative", display: "block", width: "3rem", height: "1px", background: "var(--line)", overflow: "hidden" }}>
        <motion.span
          animate={{ scaleX: (current + 1) / total }}
          transition={SPRING}
          style={{ position: "absolute", inset: 0, display: "block", background: "var(--color-accent)", opacity: 0.8, transformOrigin: "left center" }}
        />
      </span>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".18em", color: "var(--color-graphite-light)", opacity: 0.45, fontVariantNumeric: "tabular-nums" }}>
        {pad(total)}
      </span>
    </div>
  );
}

function Slide({ index, active, total, hinting = false, children }: {
  index: number;
  active: number;
  total: number;
  hinting?: boolean;
  children: React.ReactNode;
}) {
  const diff = index - active;
  const isActive = diff === 0;

  /* When hinting, override the normal y position with a keyframe sequence:
     slide partially into view (~18%), hold briefly, then retreat. */
  const yValue = hinting
    ? ["100%", "82%", "82%", "100%"]
    : `${diff * 100}%`;
  const transition = hinting
    ? { duration: 1.6, times: [0, 0.35, 0.7, 1], ease: ["easeOut", "easeIn", "easeIn", "easeOut"] as import("framer-motion").Easing[] }
    : SPRING;

  return (
    <motion.div
      role="group"
      aria-roledescription="slide"
      aria-label={`${index + 1} / ${total}`}
      animate={{ y: yValue }}
      transition={transition}
      aria-hidden={!isActive}
      inert={!isActive}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 10 - Math.abs(diff),
        pointerEvents: "none",
      }}
    >
      {/* pointer-events:none on the wrapper so fixed-position elements
          (Navigation, etc.) above this are never blocked by the transparent
          slide container. Content that needs clicks re-enables below. */}
      {children}
    </motion.div>
  );
}

function HeroContent() {
  const { t } = useTranslation();
  return (
    <div
      style={{
        height: "100%",
        pointerEvents: "auto",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "0 var(--pad) 3.5rem",
        position: "relative",
      }}
    >
      <div aria-hidden="true" style={{ position: "absolute", top: "50%", left: 0, right: 0, height: "1px", background: "var(--line)", opacity: 0.4 }} />
      <div aria-hidden="true" style={{ position: "absolute", top: 0, bottom: 0, right: "var(--pad)", width: "1px", background: "var(--line)", opacity: 0.25 }} />

      <div style={{ position: "relative", zIndex: 2 }}>
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 300, lineHeight: 1.0, letterSpacing: "-.025em", marginBottom: "2.5rem" }}>
          <span style={{ display: "block", fontSize: "clamp(2.6rem, 7.5vw, 6rem)", color: "var(--color-paper)" }}>{t("home.hero.line1")}</span>
          <span style={{ display: "block", fontSize: "clamp(2.6rem, 7.5vw, 6rem)", fontStyle: "italic", color: "var(--color-accent)", paddingLeft: "clamp(1rem, 4vw, 4rem)" }}>{t("home.hero.line2")}</span>
          <span style={{ display: "block", fontSize: "clamp(1.1rem, 2.8vw, 2.6rem)", color: "var(--color-graphite-light)", fontStyle: "normal", marginTop: "1.5rem", fontWeight: 300, letterSpacing: "-.01em" }}>
            {t("home.tagline")}
          </span>
        </h1>

        <div style={{ display: "flex", alignItems: "center", gap: "2rem", paddingTop: "1.5rem", borderTop: "1px solid var(--line)", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--color-graphite-light)", opacity: 0.6 }}>
            {t("home.role1")}
          </span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--color-graphite-light)", opacity: 0.6 }}>
            {t("home.role2")}
          </span>
        </div>
      </div>

      <div aria-hidden="true" style={{ position: "absolute", bottom: "2rem", right: "var(--pad)", display: "flex", flexDirection: "column", alignItems: "center", gap: ".5rem" }}>
        <div style={{ width: "1px", height: "48px", background: "linear-gradient(to bottom, var(--color-accent), transparent)", opacity: 0.5 }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: ".45rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--color-graphite-light)", writingMode: "vertical-rl", opacity: 0.4 }}>
          {t("home.scroll")}
        </span>
      </div>
    </div>
  );
}

function ProjectContent({ item, instant = false }: { item: DomainItem; instant?: boolean }) {
  const warpNav = useWarpNavigate();
  const { t } = useTranslation();
  return (
    <Link
      href={`/work/${item.slug}`}
      className="reel-card"
      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "100%", pointerEvents: "auto", position: "relative" }}
      onClick={(e) => {
        // Enter through the particles: dive-in transition covers the route
        // change. With reduced motion (instant) the Link navigates natively —
        // no warp dive.
        if (instant) return;
        e.preventDefault();
        warpNav(`/work/${item.slug}`, item.slug);
      }}
    >
      <div
        className="reel-text"
        style={{
          maxWidth: "min(44ch, 55%)",
          flexShrink: 0,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "var(--color-ground)",
          padding: "0 var(--pad)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div aria-hidden="true" style={{ position: "absolute", top: "2rem", left: "var(--pad)", width: 18, height: 18, borderTop: `1px solid ${item.accent}`, borderLeft: `1px solid ${item.accent}`, opacity: 0.6 }} />

        <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(2.2rem, 5vw, 4.5rem)", lineHeight: 1.0, letterSpacing: "-.02em", color: "var(--color-paper)", marginBottom: "1.4rem" }}>
          {item.headline}
        </h2>
        <p style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "var(--color-graphite-light)", lineHeight: 1.65, marginBottom: "1.6rem" }}>
          {item.body}
        </p>
        <div style={{ height: "1px", background: item.accent, opacity: 0.5, marginBottom: "1.2rem", maxWidth: "16rem" }} />
        <span style={{ fontFamily: "var(--font-mono)", fontSize: ".58rem", letterSpacing: ".18em", textTransform: "uppercase", color: "var(--color-graphite-light)", display: "block", marginBottom: ".8rem", opacity: 0.6 }}>
          {item.label}
        </span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: ".68rem", letterSpacing: ".16em", textTransform: "uppercase", color: item.accent, opacity: 0.9 }}>
          {t("home.reel.enter")}
        </span>

        <div aria-hidden="true" style={{ position: "absolute", bottom: "2rem", right: "1.5rem", width: 18, height: 18, borderBottom: `1px solid ${item.accent}`, borderRight: `1px solid ${item.accent}`, opacity: 0.6 }} />
      </div>

      <div aria-hidden="true" className="reel-spacer" style={{ flex: 1, minWidth: "2rem", height: "100%" }} />
    </Link>
  );
}
