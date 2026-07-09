"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, type Transition } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { subscribeClimate, useParticle, useWarpNavigate } from "@/lib/particleContext";
import { useTranslation } from "@/lib/TranslationContext";
import { LOADER_MAX_MS } from "@/components/ui/Preloader";
import InlineVideo from "@/components/ui/InlineVideo";
import { EASE_OUT, SPRING } from "@/lib/motion";
import {
  prefersReducedMotionNow,
  usePrefersReducedMotion,
} from "@/hooks/usePrefersReducedMotion";
import type { Domain } from "@/data/projects";

interface ReelClip {
  kind: "video" | "image";
  src: string;
  poster?: string;
  alt: string;
}

interface DomainItem {
  slug: Domain;
  headline: string;
  body: string;
  label: string;
  accent: string;
  clip: ReelClip;
}

const WHEEL_THRESHOLD = 12;       // px of deltaY to count as an intentional tick
const TOUCH_THRESHOLD = 50;       // px of swipe distance before it registers
const TRANSITION_LOCK_MS = 800;   // matches SPRING's settle time (src/lib/motion.ts), blocks re-trigger mid-animation

/* Every card reserves the same right-side zone for its particle figure
   (unlike the old side-by-side grid, there's no left/center/right column
   to account for here — it's always the same single-card layout). */
const CARD_OFFSET_X = 0.5;

/* ── Per-line mask choreography ──────────────────────────────────────
   Incoming slide content rises line by line from behind overflow-hidden
   masks, staggered against the same SPRING the slides ride. Everything
   is state-driven CSS transforms; the server markup always ships the
   lines at translateY(0) — fully visible — and hiding only ever happens
   in effects after mount (SSR / no-JS / pre-hydration paint all see the
   complete content). */
const LINE_STAGGER_S = 0.08;   // ~80ms between lines
const LINE_HIDDEN_Y = "135%";  // parked fully below the mask window (see MASK_PAD)
const LINE_EXIT_Y = "-30%";    // outgoing content eases up slightly into the clip
const MASK_PAD = "0.18em";     // breathing room so descenders/ascenders never clip at rest
/* Hero reveal failsafe if 'aj:loader-done' never arrives. Must not beat the
   loader's own worst-case dispatch (LOADER_MAX_MS, exported by Preloader.tsx
   itself so the two files can never drift), or the fallback fires first and
   the reveal happens under the veil. A small margin on top covers the event
   dispatch/handling tick. */
const LOADER_FALLBACK_MS = LOADER_MAX_MS + 250;

type LinePhase = "visible" | "exit" | "staged";

/* The loader (Preloader.tsx) fires 'aj:loader-done' at most once per browser
   session (immediately on return visits) and stamps window.__ajLoaderDone as
   the synchronous "already happened" flag for late subscribers. Belt and
   braces: a module-scope listener (attached before any React mount) catches
   the event even if this chunk evaluates between dispatch scheduling and the
   deferred dispatch tick; the window flag covers this chunk loading after
   the event entirely (e.g. first landing on /about, then navigating home). */
let loaderDoneSeen = false;
if (typeof window !== "undefined") {
  window.addEventListener("aj:loader-done", () => { loaderDoneSeen = true; }, { once: true });
}
function loaderAlreadyDone(): boolean {
  return loaderDoneSeen || window.__ajLoaderDone === true;
}

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
      justify-content: flex-end !important;
      padding-bottom: 3.5rem !important;
    }
    /* On mobile the panel's gradient edge fades bottom-up instead of at the
       right edge. The color itself stays on .reel-text-bg's background-color
       (still var(--color-ground), so dark text stays readable in light mode
       AND it keeps crossfading with the per-slide palette) — only the mask
       shape changes here. Alpha stops mirror the old color-mix gradient. */
    .reel-text-bg {
      -webkit-mask-image: linear-gradient(to top, #000 28%, rgba(0,0,0,.55) 48%, transparent 78%) !important;
      mask-image: linear-gradient(to top, #000 28%, rgba(0,0,0,.55) 48%, transparent 78%) !important;
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
      // Multi-touch is the browser's (pinch-zoom must never be blocked);
      // dropping the anchor also keeps the remaining finger from firing a
      // stale swipe when the pinch ends.
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

    /* Focus is navigation too. Slides are never inert/aria-hidden, so Tab
       and screen-reader focus reach parked cards directly — focus moving
       into a parked slide drives the reel to that slide (and re-engages the
       hijack when it had been released). Focus landing anywhere OUTSIDE the
       reel while engaged must release() the hijack: the browser natively
       scrolls the focused element into view without asking us, and without
       release() the page then looks frozen — every wheel/arrow press being
       preventDefault-ed against slides that are no longer on screen. The
       native focus-scroll has already happened by the time focusin fires,
       so the in-reel branches re-pin the viewport explicitly (the reel owns
       scrollY 0; slides move via transforms, never real scroll). */
    function handleFocusIn(e: FocusEvent) {
      const target = e.target as HTMLElement | null;
      const container = containerRef.current;
      if (!target || !container) return;
      if (!container.contains(target)) {
        if (activeRef.current) release();
        return;
      }
      const slideEl = target.closest<HTMLElement>("[data-reel-slide]");
      if (!slideEl) return;
      const index = Number(slideEl.dataset.reelSlide);
      if (!Number.isFinite(index)) return;
      container.scrollTop = 0; // undo any focus-scroll of the overflow:hidden section
      if (!activeRef.current) {
        engage(index);
      } else {
        window.scrollTo(0, 0);
        // Deliberately no lockedRef check: focus must never be left sitting
        // on an off-view slide — the spring simply retargets mid-flight.
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
  }, [goTo, release, engage, totalSlides, reducedMotion]);

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

  /* Palette crossfade — the CSS palette (<html data-domain>) follows the
     active slide so the chrome fades with it (body already transitions
     background-color/color in globals.css). DomainTheme owns this attribute
     across route changes, but on "/" it resolves to no domain and leaves
     the attribute removed, so the reel may borrow it between routes. The
     hero slide hands the base palette back. Reduced motion: the calm path
     never shifts the palette. */
  useEffect(() => {
    const html = document.documentElement;
    if (reducedMotion || prefersReducedMotionNow() || slide === 0) {
      html.removeAttribute("data-domain");
      return;
    }
    const item = domains[slide - 1];
    if (item) html.setAttribute("data-domain", item.slug);
  }, [slide, domains, reducedMotion]);

  /* On unmount, hand the attribute back to DomainTheme — its pathname
     effect re-stamps the correct domain right after this cleanup runs. */
  useEffect(() => () => document.documentElement.removeAttribute("data-domain"), []);

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
          <HeroContent instant />
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
      ref={containerRef}
      aria-roledescription="carousel"
      aria-label={t("home.reel.ariaLabel")}
      style={{ height: "100dvh", position: "relative", overflow: "hidden" }}
    >
      <Slide index={0} active={slide} total={totalSlides}>
        <HeroContent active={slide === 0} />
      </Slide>
      {domains.map((item, i) => (
        <Slide key={item.slug} index={i + 1} active={slide} total={totalSlides} hinting={hinting && i === 0}>
          <ProjectContent item={item} active={slide === i + 1} />
        </Slide>
      ))}

      <ProgressRail current={slide} total={totalSlides} />

      {/* Announce slide position to screen readers on every index change.
          Numerals stay language-neutral; the slide word is translated. */}
      <div aria-live="polite" style={VISUALLY_HIDDEN}>
        {`${t("home.reel.slide")} ${slide + 1} / ${totalSlides} — ${slideTitle}`}
      </div>

      <style>{MOBILE_CSS + REEL_CSS}</style>
    </section>
  );
}

/* Parked (visually offscreen) slides stay in the accessibility tree and keep
   their links focusable at all times — the focusin navigation above depends
   on it, and screen-reader browse mode gets a plain linear read of hero +
   three cards (no aria-hidden, no inert, in SSR or at runtime). Click
   containment is pure CSS: the !important pair beats the inline
   pointerEvents:"auto" the slide content re-enables for itself, so a parked
   card can never swallow a stray click. The hinting slide is exempted so the
   peek-and-retreat card is genuinely clickable while it peeks. */
const REEL_CSS = `
  [data-reel-slide][data-parked],
  [data-reel-slide][data-parked] * { pointer-events: none !important; }
  /* Slow ken-burns for the still clips (Trmeric/Realm). The global
     reduced-motion rule (and html[data-motion="reduce"]) forces
     animation-duration to ~0 !important, so it holds a static frame there. */
  @keyframes reelClipZoom { from { transform: scale(1.03); } to { transform: scale(1.13); } }
  .reel-clip-still { animation: reelClipZoom 16s ease-in-out infinite alternate; will-change: transform; }
`;

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
      data-reel-slide={index}
      data-parked={isActive || hinting ? undefined : "true"}
      animate={{ y: yValue }}
      transition={transition}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 10 - Math.abs(diff),
        pointerEvents: "none",
        // SSR / pre-hydration position: framer's `animate` only writes the
        // transform client-side, so without this every absolute slide paints
        // stacked at inset:0 (all content overlapping the hero) until JS runs.
        // This inline transform ships the correct offset in the server HTML;
        // framer takes over the y on hydration (matching value → no jump).
        transform: `translateY(${diff * 100}%)`,
      }}
    >
      {/* pointer-events:none on the wrapper so fixed-position elements
          (Navigation, etc.) above this are never blocked by the transparent
          slide container. Content that needs clicks re-enables below —
          except while parked, where REEL_CSS forces the whole subtree
          click-dead (see its comment; slides stay in the a11y tree and
          focusable, focus-driven navigation handles the rest). */}
      {children}
    </motion.div>
  );
}

function HeroContent({ active = true, instant = false }: { active?: boolean; instant?: boolean }) {
  const { t } = useTranslation();
  const line1Ref = useRef<HTMLSpanElement | null>(null);
  const line2Ref = useRef<HTMLSpanElement | null>(null);

  /* First-visit entrance: hold the hero lines behind their masks until the
     loader exhales ('aj:loader-done'), then mask-reveal line by line. The
     hold is applied in an effect ONLY — the server markup (and any no-JS /
     pre-hydration paint) ships the hero fully visible. loaderAlreadyDone()
     covers mounts after the event already fired (the event is once per
     session); the timeout covers the event never arriving at all. */
  const [held, setHeld] = useState(false);
  useEffect(() => {
    if (instant || prefersReducedMotionNow() || loaderAlreadyDone()) return;
    let revealed = false;
    const reveal = () => {
      if (revealed) return;
      revealed = true;
      setHeld(false);
    };
    setHeld(true);
    window.addEventListener("aj:loader-done", reveal);
    const timer = window.setTimeout(reveal, LOADER_FALLBACK_MS);
    return () => {
      window.removeEventListener("aj:loader-done", reveal);
      window.clearTimeout(timer);
    };
  }, [instant]);

  const basePhase = useLineChoreo(active, instant);
  const phase: LinePhase = held ? "staged" : basePhase;

  /* Pointer-reactive Fraunces variable axes: the display lines' wght
     (±60 around the 260 rest) and opsz shift subtly with pointer position.
     Reads the pointer from the climate store — one write per rendered
     frame on the site's single rAF clock, smoothly lerped, and skipped
     entirely once settled (0.2 threshold). Applied via element.style in
     an effect only, so SSR markup and the no-JS render are untouched.
     Disabled under reduced motion and on coarse pointers. */
  useEffect(() => {
    if (instant || prefersReducedMotionNow()) return;
    if (!active) return; // don't lerp/write styles for an offscreen slide
    if (!window.matchMedia("(pointer: fine)").matches) return;
    const els = [line1Ref.current, line2Ref.current].filter(
      (el): el is HTMLSpanElement => el !== null,
    );
    if (els.length === 0) return;
    // Light + moderate optical size = a thin, refined display rather than a
    // heavy high-contrast one (design review: the bold hero read as chunky).
    const REST_WGHT = 260;
    const sizePx = parseFloat(window.getComputedStyle(els[0]).fontSize) || 64;
    const restOpsz = Math.min(56, Math.max(9, sizePx)); // capped low to soften stroke contrast
    let wght = REST_WGHT;
    let opsz = restOpsz;
    let lastW = -1;
    let lastO = -1;
    const unsubscribe = subscribeClimate((c) => {
      // Cursor parks at (9,9) when absent — treat as rest.
      const parked = Math.abs(c.cursorX) > 1.5 || Math.abs(c.cursorY) > 1.5;
      const nx = parked ? 0 : Math.max(-1, Math.min(1, c.cursorX));
      const ny = parked ? 0 : Math.max(-1, Math.min(1, c.cursorY));
      wght += (REST_WGHT + nx * 45 - wght) * 0.07;
      opsz += (Math.min(56, Math.max(9, restOpsz + ny * 12)) - opsz) * 0.07;
      if (Math.abs(wght - lastW) < 0.2 && Math.abs(opsz - lastO) < 0.2) return;
      lastW = wght;
      lastO = opsz;
      const value = `'wght' ${wght.toFixed(1)}, 'opsz' ${opsz.toFixed(1)}`;
      for (const el of els) el.style.setProperty("font-variation-settings", value);
    });
    return () => {
      unsubscribe();
      for (const el of els) el.style.removeProperty("font-variation-settings");
    };
  }, [instant, active]);

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
        {/* Flex column so the masks' padding/negative-margin pairs cancel
            arithmetically (block-level siblings would margin-collapse and
            add MASK_PAD of extra leading between the display lines). */}
        <h1 style={{ display: "flex", flexDirection: "column", alignItems: "stretch", fontFamily: "var(--font-display)", fontWeight: 260, lineHeight: 1.0, letterSpacing: "-.02em", marginBottom: "2.5rem" }}>
          <MaskLine as="span" phase={phase} order={0} style={{ fontSize: "clamp(2.6rem, 7.5vw, 6rem)", color: "var(--color-paper)" }}>
            <span ref={line1Ref}>{t("home.hero.line1")}</span>
          </MaskLine>
          <MaskLine as="span" phase={phase} order={1} style={{ fontSize: "clamp(2.6rem, 7.5vw, 6rem)", fontStyle: "italic", color: "var(--color-accent)", paddingLeft: "clamp(1rem, 4vw, 4rem)" }}>
            <span ref={line2Ref}>{t("home.hero.line2")}</span>
          </MaskLine>
          <MaskLine
            as="span"
            phase={phase}
            order={2}
            maskStyle={{ marginTop: `calc(1.5rem - ${MASK_PAD})` }}
            style={{ fontSize: "clamp(1.1rem, 2.8vw, 2.6rem)", color: "var(--color-graphite-light)", fontStyle: "normal", fontWeight: 300, letterSpacing: "-.01em" }}
          >
            {t("home.tagline")}
          </MaskLine>
        </h1>

        <MaskLine phase={phase} order={3}>
          <div style={{ display: "flex", alignItems: "center", gap: "2rem", paddingTop: "1.5rem", borderTop: "1px solid var(--line)", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--color-graphite-light)", opacity: 0.6 }}>
              {t("home.role1")}
            </span>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: ".6rem", letterSpacing: ".2em", textTransform: "uppercase", color: "var(--color-graphite-light)", opacity: 0.6 }}>
              {t("home.role2")}
            </span>
          </div>
        </MaskLine>
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

/* Desktop gradient edge: the panel's ground dissolves across the last
   ~1.6 page-gutters instead of ending in a hard rectangle, so the dust
   shows through its boundary. Lives on a mask so the COLOR stays a plain
   background-color underneath — which is what lets it crossfade with the
   per-slide palette (gradients themselves don't transition). */
const EDGE_FADE =
  "linear-gradient(to right, #000 calc(100% - var(--pad) * 1.6), rgba(0,0,0,.62) calc(100% - var(--pad) * .6), transparent 100%)";

/* The project clip that FILLS the left panel as its background (the copy
   overlays it). Rendered absolute-fill inside .reel-text-bg. Video
   (Rippl/Rozi) uses InlineVideo — preload:none + play-only-in-view, so
   parked slides never fetch it and reduced-motion shows the poster. Still
   (Trmeric/Realm, no footage yet) gets a slow ken-burns zoom, clipped by
   the panel's overflow and killed under reduced motion by the global rule. */
function ReelClip({ clip }: { clip: ReelClip }) {
  if (clip.kind === "video") {
    return (
      <InlineVideo
        src={clip.src}
        poster={clip.poster ?? ""}
        aria-label={clip.alt}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
      />
    );
  }
  return (
    <Image
      src={clip.src}
      alt={clip.alt}
      fill
      sizes="(max-width: 760px) 64vw, 760px"
      className="reel-clip-still"
      style={{ objectFit: "cover" }}
    />
  );
}

function ProjectContent({ item, active = false, instant = false }: { item: DomainItem; active?: boolean; instant?: boolean }) {
  const warpNav = useWarpNavigate();
  const { excite } = useParticle();
  const { t } = useTranslation();
  const phase = useLineChoreo(active, instant);

  /* Hover excites the field (excite() is a no-op under reduced motion —
     the instant check is belt and braces). Focus gets the same energy so
     keyboard users see the field respond too. */
  const wake = () => {
    if (!instant && !prefersReducedMotionNow()) excite(0.28);
  };

  return (
    <Link
      href={`/work/${item.slug}`}
      className="reel-card"
      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "100%", pointerEvents: "auto", position: "relative" }}
      onPointerEnter={wake}
      onFocus={wake}
      onClick={(e) => {
        // Enter through the particles: dive-in transition covers the route
        // change. With reduced motion (instant) the Link navigates natively —
        // no warp dive.
        if (instant) return;
        /* New-tab / new-window / download intents belong to the browser
           (same guard as WarpLink). */
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
        e.preventDefault();
        warpNav(`/work/${item.slug}`, item.slug);
      }}
    >
      <div
        className="reel-text"
        style={{
          maxWidth: "min(52ch, 64%)",
          flexShrink: 0,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 var(--pad)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* The project clip FILLS this panel as its background (the copy
            overlays it). A base ground colour shows before the poster/video
            paints; a left-weighted scrim keeps the text legible while the
            clip stays visible toward the right, where the same edge mask
            dissolves it into the dust field. zIndex -1 keeps the whole layer
            under the text (panel is position:relative + zIndex:1). */}
        <div
          aria-hidden="true"
          className="reel-text-bg"
          style={{
            position: "absolute",
            inset: 0,
            zIndex: -1,
            overflow: "hidden",
            backgroundColor: "var(--color-ground)",
            transition: "background-color 0.9s var(--ease)",
            WebkitMaskImage: EDGE_FADE,
            maskImage: EDGE_FADE,
          }}
        >
          <ReelClip clip={item.clip} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(100deg, var(--color-ground) 20%, color-mix(in srgb, var(--color-ground) 62%, transparent) 52%, color-mix(in srgb, var(--color-ground) 24%, transparent) 78%, transparent 100%)",
              transition: "background 0.9s var(--ease)",
            }}
          />
        </div>

        <div aria-hidden="true" style={{ position: "absolute", top: "2rem", left: "var(--pad)", width: 18, height: 18, borderTop: `1px solid ${item.accent}`, borderLeft: `1px solid ${item.accent}`, opacity: 0.6 }} />

        <MaskLine
          phase={phase}
          order={0}
          style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(2rem, 4.4vw, 4rem)", lineHeight: 1.0, letterSpacing: "-.02em", color: "var(--color-paper)" }}
          maskStyle={{ marginBottom: `calc(1.4rem - ${MASK_PAD})` }}
        >
          {/* Typography lives on the mask (see MaskLine); the heading inherits
              it (Tailwind preflight resets h* to font-size/weight inherit). */}
          <h2>{item.headline}</h2>
        </MaskLine>
        <MaskLine
          phase={phase}
          order={1}
          style={{ fontFamily: "var(--font-body)", fontSize: "1rem", color: "var(--color-paper)", lineHeight: 1.65 }}
          maskStyle={{ marginBottom: `calc(1.6rem - ${MASK_PAD})` }}
        >
          <p>{item.body}</p>
        </MaskLine>
        <motion.div
          aria-hidden="true"
          initial={false}
          animate={{ scaleX: phase === "staged" ? 0 : 1 }}
          transition={phase === "visible" ? { ...SPRING, delay: 2 * LINE_STAGGER_S } : { duration: 0 }}
          style={{ height: "1px", background: item.accent, opacity: 0.5, marginBottom: "1.2rem", maxWidth: "16rem", transformOrigin: "left center" }}
        />
        <MaskLine
          phase={phase}
          order={3}
          style={{ fontFamily: "var(--font-mono)", fontSize: ".58rem", letterSpacing: ".18em", textTransform: "uppercase", color: "var(--color-paper)", opacity: 0.75 }}
          maskStyle={{ marginBottom: `calc(.8rem - ${MASK_PAD})` }}
        >
          <span>{item.label}</span>
        </MaskLine>
        <MaskLine
          phase={phase}
          order={4}
          style={{ fontFamily: "var(--font-mono)", fontSize: ".68rem", letterSpacing: ".16em", textTransform: "uppercase", color: item.accent, opacity: 0.95 }}
        >
          <span data-cursor="enter" data-magnetic="">{t("home.reel.enter")}</span>
        </MaskLine>

        <div aria-hidden="true" style={{ position: "absolute", bottom: "2rem", right: "1.5rem", width: 18, height: 18, borderBottom: `1px solid ${item.accent}`, borderRight: `1px solid ${item.accent}`, opacity: 0.6 }} />
      </div>

      <div aria-hidden="true" className="reel-spacer" style={{ flex: 1, minWidth: "2rem", height: "100%" }} />
    </Link>
  );
}

/* ── Line-mask choreography engine ─────────────────────────────────── */

/* Resolves which phase a slide's lines are in:
   - "visible": at rest / springing up into place (staggered entrance)
   - "exit":    the slide is leaving — lines ease upward slightly into the clip
   - "staged":  parked hidden below the mask window, ready to enter
   The FIRST commit never hides the active slide (the server ships it fully
   visible — hydration parity); offscreen slides are staged in that same
   effect, invisibly, since they sit translated out of the viewport. */
function useLineChoreo(isActive: boolean, disabled: boolean): LinePhase {
  const [phase, setPhase] = useState<LinePhase>("visible");
  const mountedRef = useRef(false);

  useEffect(() => {
    if (disabled || prefersReducedMotionNow()) {
      setPhase("visible");
      return;
    }
    if (!mountedRef.current) {
      mountedRef.current = true;
      if (!isActive) setPhase("staged");
      return;
    }
    if (isActive) {
      setPhase("visible");
      return;
    }
    setPhase("exit");
    // Once the slide spring has settled (same lock the reel uses), park the
    // lines below their masks so the next entrance rises from the bottom.
    const timer = window.setTimeout(() => setPhase("staged"), TRANSITION_LOCK_MS);
    return () => window.clearTimeout(timer);
  }, [isActive, disabled]);

  return phase;
}

/* One masked line: an overflow-hidden window whose child rides pure CSS
   transforms driven by `phase`. Entrances share the reel's SPRING with an
   ~80ms per-line stagger; parking (staged) is instant since it happens
   offscreen. MASK_PAD pads the clip window (with compensating negative
   margins, so the layout footprint is unchanged) to keep ascenders and
   descenders unclipped at rest — Fraunces at line-height 1 paints outside
   its line box. The line's typography (`style`) lives on the MASK element
   so that em-based pad scales with the line's own font-size; the inner
   element inherits it. Spacing between lines goes through `maskStyle`
   (use calc(<gap> - MASK_PAD) to keep gaps identical to the pre-mask
   layout). `as="span"` keeps the markup valid inside <h1>. */
function MaskLine({
  phase,
  order,
  as = "div",
  style,
  maskStyle,
  children,
}: {
  phase: LinePhase;
  order: number;
  as?: "div" | "span";
  style?: React.CSSProperties;
  maskStyle?: React.CSSProperties;
  children: React.ReactNode;
}) {
  const y = phase === "visible" ? "0%" : phase === "exit" ? LINE_EXIT_Y : LINE_HIDDEN_Y;
  const transition: Transition =
    phase === "visible"
      ? { ...SPRING, delay: order * LINE_STAGGER_S }
      : phase === "exit"
        ? { duration: 0.45, ease: EASE_OUT }
        : { duration: 0 };
  const maskCss: React.CSSProperties = {
    display: "block",
    overflow: "hidden",
    padding: `${MASK_PAD} 0`,
    margin: `-${MASK_PAD} 0`,
    ...style,
    ...maskStyle,
  };
  const lineCss: React.CSSProperties = { display: "block" };

  if (as === "span") {
    return (
      <span style={maskCss}>
        <motion.span initial={false} animate={{ y }} transition={transition} style={lineCss}>
          {children}
        </motion.span>
      </span>
    );
  }
  return (
    <div style={maskCss}>
      <motion.div initial={false} animate={{ y }} transition={transition} style={lineCss}>
        {children}
      </motion.div>
    </div>
  );
}
