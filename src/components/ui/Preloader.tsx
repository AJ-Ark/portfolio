"use client";

/* ══════════════════════════════════════════════════════════════════
   THE HONEST LOADER — the site's identity performing its own arrival.

   First visit (sessionStorage "aj_seen" absent): a chrome-less veil in
   the page's own ground color holds while the REAL work finishes —
   Promise.all([document.fonts.ready, engineReady()]). No fake timer.
   When both resolve AND the engine tier is 'gpu' (only that path can
   actually render text formations — see the CPU-tier note below), the
   veil dissolves to expose the actual canvas as the dust condenses
   into the "ARAVIND J" wordmark (requestFormation("wordmark", { owner:
   "loader" })), holds ~900ms legible, then exhales back into the idle
   field (requestFormation(null, { owner: "loader" })) while the chrome
   fades in and window fires "aj:loader-done" — the hero choreographs
   its reveal against that event. window.__ajLoaderDone is the
   synchronous flag for anything that mounts after the event fired.

   The `owner: "loader"` tag is this component's slot in particleContext's
   owner-keyed formation stack — releasing with that owner can only ever
   remove OUR entry, never another feature's concurrently-held override
   (Settling's monogram, a hovered work row, …). See ENGINE-API.md §2.

   Return visits: no cover at all — the event fires on mount.

   CPU-tier / no-canvas note: ParticleField (the CPU fallback) only
   understands DOMAIN formations, not "wordmark" — requesting it there is
   a silent visual no-op, which used to hold an empty stage for the full
   condense+hold window. getEngineTier() gates the choreography: only
   'gpu' gets the condense+hold; 'cpu' / 'none' / an undetected tier get
   a short quiet veil (QUIET_VEIL_MS) then lift straight through.

   Failsafes, by construction:
   • SSR / no-JS — renders null on the server and on the first client
     render; the cover only exists after the mount effect runs, so
     server HTML always ships fully visible and hydration matches.
   • A hard timeout (HARD_TIMEOUT_MS) lifts the cover and fires the
     event even if fonts/engine readiness never resolves. Once
     readiness DOES resolve before that fires, the timer is disarmed —
     the condense+hold choreography gets its own bounded window instead
     of being guillotined by the flat ceiling (see LOADER_MAX_MS).
   • Reduced motion — designed calm path: a beat of ground color, then
     a simple quick fade. No formation, no hold.
   • sessionStorage unreadable (privacy modes) counts as "seen" —
     never block.

   While the veil is up (phase 'veil' or 'field'), <html data-loader>
   hides header/main/footer through the same mechanism the warp uses
   (globals.css already gives them a 0.5s opacity transition), so the
   canvas — which sits UNDER the content at z-index 0 — performs alone
   once the veil dissolves. The SAME phase-driven effect also marks that
   chrome `inert` + aria-hidden and moves focus onto the veil itself
   (labeled, focusable) — identically for BOTH the first-visit and the
   reduced-motion path, since it's driven by `phase`, not by which
   branch stamped it. On lift, inert/aria-hidden are removed and focus
   returns to the top of the document (without scrolling).

   Accepted tradeoff: stamping the veil from a mount effect means the
   veil's own contentful text (the wordmark) is the first paint the
   visitor sees rather than the eventual hero — on a slow first visit
   that can push perceived/measured LCP out to the veil's lift. We keep
   the veil itself non-empty (real text, not a blank rect) specifically
   to keep that first paint meaningful; a real before/after LCP
   measurement is a Phase 4 item, not solved here.
   ══════════════════════════════════════════════════════════════════ */

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useParticle } from "@/lib/particleContext";
import { useTranslation } from "@/lib/TranslationContext";
import { prefersReducedMotionNow } from "@/hooks/usePrefersReducedMotion";
import { getEngineTier } from "@/components/3d/engine/tier";

/** Fired on window when the entrance finishes (or immediately on return
 *  visits). Check window.__ajLoaderDone before subscribing — the event
 *  fires at most once per browser session. */
export const LOADER_DONE_EVENT = "aj:loader-done";

/** This component's slot in the owner-keyed formation stack
 *  (particleContext.requestFormation's `owner` option). */
const FORMATION_OWNER = "loader";

const SEEN_KEY = "aj_seen";

const HARD_TIMEOUT_MS = 4000; // ceiling for WAITING on readiness — disarmed once it resolves
const CONDENSE_MS = 1050; // the engine's morph, mostly landed (shortened on review)
const HOLD_MS = 400; // the wordmark holds, legible — brief, the entrance shouldn't stall
const QUIET_VEIL_MS = 600; // non-gpu tiers: a beat of held veil (no condense) instead of an empty stage
const VEIL_FADE_MS = 600; // veil dissolves while the dust condenses
const CALM_FADE_MS = 350; // reduced-motion / lift quick fade
const LIFT_MS = 600; // chrome fade-in tail before unmount

/** Worst-case time from mount to `fireDone()` on the first-visit path:
 *  readiness may take up to HARD_TIMEOUT_MS to resolve (or the failsafe
 *  fires instead), and once it does the GPU choreography needs the full
 *  condense + hold. Anything that must not outlast the loader (e.g. a
 *  hero-reveal failsafe) should budget at least this much. The dispatch
 *  path below clamps its own hold so it can never exceed this number. */
export const LOADER_MAX_MS = HARD_TIMEOUT_MS + CONDENSE_MS + HOLD_MS; // 4000 + 1250 + 900

declare global {
  interface Window {
    /** Synchronous "the entrance already happened" flag — read this before
     *  adding a LOADER_DONE_EVENT listener in late-mounting components. */
    __ajLoaderDone?: boolean;
  }
}

type Phase =
  | "idle" //  server render / return visit — nothing in the DOM
  | "veil" //  opaque ground-color cover + tiny mono wordmark fallback
  | "field" // veil transparent: the real canvas condenses into the wordmark
  | "lift" //  exhale — formation released, chrome fading back in
  | "done"; // unmounted

const VISUALLY_HIDDEN: CSSProperties = {
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

/** Move focus to the top of the document without scrolling — used when
 *  the veil lifts and the real chrome regains interactivity. Body has no
 *  tabindex by default, so one is added just long enough to focus it. */
function focusDocumentStart() {
  if (typeof document === "undefined") return;
  const body = document.body;
  const hadTabIndex = body.hasAttribute("tabindex");
  if (!hadTabIndex) body.setAttribute("tabindex", "-1");
  body.focus({ preventScroll: true });
  if (!hadTabIndex) body.removeAttribute("tabindex");
}

export default function Preloader() {
  const [phase, setPhase] = useState<Phase>("idle");
  const { requestFormation, engineReady } = useParticle();
  const { t } = useTranslation();
  const veilRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    /* Unreadable storage counts as seen — never block. */
    let seen = true;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === "1";
    } catch {}

    const timers: number[] = [];
    const later = (fn: () => void, ms: number) =>
      timers.push(window.setTimeout(fn, ms));

    const fireDone = () => {
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {}
      if (!window.__ajLoaderDone) {
        window.__ajLoaderDone = true;
        /* Deferred one tick so siblings committed in this same pass (whose
           mount effects run after ours) still catch the event. */
        window.setTimeout(
          () => window.dispatchEvent(new Event(LOADER_DONE_EVENT)),
          0
        );
      }
    };

    /* RETURN VISIT — no cover at all. */
    if (seen) {
      fireDone();
      return;
    }

    /* REDUCED MOTION — the designed calm path: a beat of ground color,
       then a simple quick fade. No formation, no hold. Chrome
       inert/aria-hidden + focus handling is phase-driven below, so this
       path gets IDENTICAL a11y treatment to the first-visit path even
       though it never touches the formation engine. */
    if (prefersReducedMotionNow()) {
      setPhase("veil");
      later(() => {
        setPhase("lift");
        fireDone();
      }, 300);
      later(() => setPhase("done"), 300 + CALM_FADE_MS);
      return () => timers.forEach((id) => window.clearTimeout(id));
    }

    /* FIRST VISIT — gate on the real work, not a timer. */
    const startedAt = performance.now();
    setPhase("veil");

    let lifted = false;
    const lift = () => {
      if (lifted) return;
      lifted = true;
      requestFormation(null, { owner: FORMATION_OWNER }); // exhale — releases ONLY our own override
      setPhase("lift");
      fireDone();
      later(() => setPhase("done"), LIFT_MS);
    };

    /* Readiness failsafe: if fonts/engine readiness never resolves, don't
       hold the cover forever. Disarmed the moment readiness actually
       arrives (below) so a late-but-real resolution still gets its full
       condense+hold window instead of being cut off by this flat ceiling. */
    const readinessTimeoutId = window.setTimeout(lift, HARD_TIMEOUT_MS);
    timers.push(readinessTimeoutId);

    let cancelled = false;
    Promise.all([document.fonts.ready, engineReady()]).then(() => {
      if (cancelled || lifted) return;
      window.clearTimeout(readinessTimeoutId);

      const elapsed = performance.now() - startedAt;
      const budgetLeft = Math.max(0, LOADER_MAX_MS - elapsed);
      const tier = getEngineTier();

      /* CPU / no-WebGL / undetected-after-failsafe tier: "wordmark" is a
         visual no-op there (ParticleField only understands domain
         formations) — condensing into it would hold an empty stage for
         the full window. A short quiet veil reads as an intentional
         beat instead. Belt-and-braces: also bail if, for any reason,
         there's no canvas in the DOM at all. */
      if (tier !== "gpu" || !document.querySelector("canvas")) {
        later(lift, Math.min(QUIET_VEIL_MS, budgetLeft));
        return;
      }

      requestFormation("wordmark", { offsetX: 0, owner: FORMATION_OWNER });
      setPhase("field"); // veil dissolves — the actual canvas takes over
      /* Clamp the hold so a late (but real) readiness resolution can
         never push dispatch past LOADER_MAX_MS from mount. */
      const hold = Math.min(HOLD_MS, Math.max(0, budgetLeft - CONDENSE_MS));
      later(lift, CONDENSE_MS + hold);
    });

    return () => {
      /* Unmounted mid-arrival (route change, StrictMode re-run): restore
         the page but do NOT mark the visit seen or fire the event — the
         arrival simply plays the next time home mounts. Chrome
         inert/data-loader cleanup is handled by the phase-driven effect
         below regardless of how we got here. */
      cancelled = true;
      timers.forEach((id) => window.clearTimeout(id));
      if (!lifted) {
        requestFormation(null, { owner: FORMATION_OWNER });
      }
    };
  }, [engineReady, requestFormation]);

  /* A11y + chrome visibility — driven purely by `phase`, so the
     first-visit and reduced-motion paths (which reach "veil"/"field" via
     completely different code above) get IDENTICAL treatment: while
     covered, header/main/footer are marked `inert` + aria-hidden (so
     they drop out of the tab order and the accessibility tree, not just
     opacity:0) and focus moves onto the veil itself (labeled, focusable).
     On lift, both are reversed and focus returns to the top of the
     document without scrolling. */
  useEffect(() => {
    const veiled = phase === "veil" || phase === "field";
    if (!veiled) return;

    document.documentElement.setAttribute("data-loader", "");
    const chrome = Array.from(
      document.querySelectorAll<HTMLElement>("header, main, footer")
    );
    chrome.forEach((el) => {
      el.inert = true;
      el.setAttribute("aria-hidden", "true");
    });
    veilRef.current?.focus({ preventScroll: true });

    return () => {
      document.documentElement.removeAttribute("data-loader");
      chrome.forEach((el) => {
        el.inert = false;
        el.removeAttribute("aria-hidden");
      });
      focusDocumentStart();
    };
  }, [phase]);

  if (phase === "idle" || phase === "done") return null;

  return (
    <>
      {/* Scoped to the attribute this component alone stamps. The fade
          back rides the existing `header, main, footer` 0.5s opacity
          transition in globals.css (the warp's mechanism). */}
      <style>{`
        html[data-loader] header,
        html[data-loader] main,
        html[data-loader] footer {
          opacity: 0;
          pointer-events: none;
        }
      `}</style>
      <div
        ref={veilRef}
        role="status"
        tabIndex={-1}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--color-ground)",
          opacity: phase === "veil" ? 1 : 0,
          transition: `opacity ${
            phase === "field" ? VEIL_FADE_MS : CALM_FADE_MS
          }ms var(--ease)`,
          pointerEvents: "none",
          outline: "none",
        }}
      >
        {/* Tiny mono wordmark — the veil's real, contentful first paint
            (see the LCP tradeoff note above), decorative for AT purposes
            since the status role below carries the accessible name. The
            negative margin trims the trailing letter-space so tracked
            uppercase sits optically centered. */}
        <span
          aria-hidden="true"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: ".62rem",
            letterSpacing: ".34em",
            marginRight: "-.34em",
            textTransform: "uppercase",
            color: "var(--color-paper)",
            opacity: 0.55,
            whiteSpace: "nowrap",
          }}
        >
          {t("loader.wordmark")}
        </span>
        <span style={VISUALLY_HIDDEN}>{t("loader.loading")}</span>
      </div>
    </>
  );
}
