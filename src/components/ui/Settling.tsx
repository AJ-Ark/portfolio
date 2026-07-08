"use client";

/* ═══════════════════════════════════════════════════════════════════
   THE SETTLING — every page ends with the material at rest.

   The closing band rendered by <Footer>: an oversized Fraunces-italic
   "Say hello" mailto, beneath it a quiet mono line with the visitor's
   LOCAL time, and the old 0.5rem "PORTFOLIO · 2026 / REV 01 · NTS"
   drawing-annotation whisper scaled up into a legible title-block
   signature.

   While the band is in view the dust field morphs into the AJ
   monogram behind the text (requestFormation("monogram", { owner:
   "settling" })) and control is ALWAYS handed back (release with the
   SAME owner) when it leaves view or unmounts — the owner keeps this
   release from ever clobbering a different feature's concurrently-held
   override (e.g. a hovered work row, or NextProject's own preview
   pushed above us). On the CPU fallback the engine degrades this to
   the idle/domain formation by itself — the band needs no special
   casing.

   SSR: the full band ships visible (Reveal never bakes opacity:0);
   only the clock is client-filled — the server renders a placeholder
   and the first client render matches it, so there is no hydration
   mismatch and the band still reads with JS disabled.

   Reduced motion: static band — no formation call, no per-second
   tick (the clock calms to minute precision), Reveal no-ops.
   ═══════════════════════════════════════════════════════════════════ */

import { useEffect, useState } from "react";
import Reveal from "@/components/ui/Reveal";
import { useInView } from "@/hooks/useInView";
import {
  prefersReducedMotionNow,
  usePrefersReducedMotion,
} from "@/hooks/usePrefersReducedMotion";
import { useParticle } from "@/lib/particleContext";
import { useTranslation } from "@/lib/TranslationContext";

/* The address every other call site uses (Navigation, About, Home). */
const EMAIL = "aravindspav@gmail.com";
const TIME_PLACEHOLDER = "--:--";

interface Clock {
  text: string;
  iso: string;
  zone: string;
}

export default function Settling() {
  const { t, language } = useTranslation();
  const { requestFormation } = useParticle();
  const reducedMotion = usePrefersReducedMotion();
  /* once:false — the field must settle when the band arrives AND be
     released when the visitor scrolls back up. */
  const { ref, inView } = useInView<HTMLDivElement>({
    once: false,
    threshold: 0.25,
  });
  const [clock, setClock] = useState<Clock | null>(null);

  /* THE SETTLING — morph the field into the AJ monogram while the
     band is on screen; hand control back on exit/unmount. Reduced
     motion never touches the engine (designed calm path = the static
     band below). */
  useEffect(() => {
    if (!inView || reducedMotion || prefersReducedMotionNow()) return;
    requestFormation("monogram", { offsetX: 0, owner: "settling" });
    return () => requestFormation(null, { owner: "settling" });
  }, [inView, reducedMotion, requestFormation]);

  /* Visitor's LOCAL time — client-only by design. The server renders
     the placeholder and the first client render matches it (clock
     starts null); the real time lands here, after hydration. Ticks
     only while the band is actually in view — the footer is mounted
     on every page, and a per-second setState() far offscreen (or on
     pages the visitor never scrolls to the bottom of) is pure waste. */
  useEffect(() => {
    if (!inView) return;
    const seconds = !prefersReducedMotionNow();
    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      ...(seconds ? { second: "2-digit" as const } : {}),
    };
    let fmt: Intl.DateTimeFormat;
    try {
      fmt = new Intl.DateTimeFormat(language, options);
    } catch {
      fmt = new Intl.DateTimeFormat(undefined, options);
    }
    let zone = "";
    try {
      zone = (Intl.DateTimeFormat().resolvedOptions().timeZone ?? "").replace(
        /_/g,
        " "
      );
    } catch {
      /* engines without timeZone support — omit the zone annotation */
    }
    const tick = () => {
      const d = new Date();
      setClock({ text: fmt.format(d), iso: d.toISOString(), zone });
    };
    tick();
    const id = window.setInterval(tick, seconds ? 1000 : 30_000);
    return () => window.clearInterval(id);
  }, [inView, language, reducedMotion]);

  return (
    <div
      ref={ref}
      className="settling"
      style={{
        position: "relative",
        padding:
          "clamp(5.5rem, 18vh, 10rem) var(--pad) clamp(2.75rem, 7vh, 4.5rem)",
        textAlign: "center",
      }}
    >
      <style>{SETTLING_CSS}</style>

      <Reveal>
        <a
          href={`mailto:${EMAIL}`}
          className="display-serif settling-hello"
          data-cursor="enter"
          data-magnetic
        >
          {t("settling.hello")}
        </a>
      </Reveal>

      <Reveal as="p" delay={0.08} className="settling-meta">
        <span className="settling-meta-email">{EMAIL}</span>
        <span className="settling-meta-cell">
          <span>{t("settling.localTime")}</span>{" "}
          <time dateTime={clock?.iso}>
            {clock ? clock.text : TIME_PLACEHOLDER}
          </time>
          {clock?.zone ? (
            <span aria-hidden="true"> · {clock.zone}</span>
          ) : null}
        </span>
      </Reveal>

      {/* The drawing-annotation motif, scaled up from the old footer
          whisper (0.5rem / 35% opacity) into a legible title-block
          signature — same i18n keys, now readable. */}
      <Reveal delay={0.16} className="settling-signature-row">
        <div className="settling-signature">
          <span>{t("footer.portfolio")}</span>
          <span className="settling-signature-rule" aria-hidden="true" />
          <span>{t("footer.revision")}</span>
        </div>
      </Reveal>
    </div>
  );
}

/* Scoped styles live here (not globals.css — outside this task's file
   set). Hover/press transitions inherit the site's reduced-motion
   kill-switch in globals.css. */
const SETTLING_CSS = `
.settling-hello {
  position: relative;
  display: inline-block;
  font-style: italic;
  font-weight: 430;
  font-size: clamp(2.9rem, 9vw, 7.25rem);
  line-height: 1.08;
  letter-spacing: -0.02em;
  color: var(--color-paper);
  transition: color .45s var(--ease);
}
.settling-hello::after {
  content: "";
  position: absolute;
  left: .05em;
  right: .05em;
  bottom: .02em;
  height: max(.03em, 2px);
  background: var(--color-accent);
  transform: scaleX(0);
  transform-origin: 100% 50%;
  transition: transform .6s var(--ease);
}
.settling-hello:hover,
.settling-hello:focus-visible {
  color: var(--color-accent-bright);
}
.settling-hello:hover::after,
.settling-hello:focus-visible::after {
  transform: scaleX(1);
  transform-origin: 0% 50%;
}
.settling-meta {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: baseline;
  column-gap: 1.6em;
  row-gap: .55em;
  margin-top: clamp(1.5rem, 3.5vh, 2.5rem);
  font-family: var(--font-mono);
  font-size: .65rem;
  letter-spacing: .18em;
  text-transform: uppercase;
  color: var(--color-graphite-light);
}
.settling-meta-email {
  text-transform: none;
  letter-spacing: .12em;
}
.settling-meta time {
  font-variant-numeric: tabular-nums;
  color: var(--color-paper);
  opacity: .75;
}
.settling-signature-row {
  display: flex;
  justify-content: center;
  margin-top: clamp(3rem, 8vh, 5.5rem);
}
.settling-signature {
  display: inline-flex;
  align-items: center;
  gap: 1rem;
  padding: .7rem 1.15rem;
  border: 1px solid var(--line);
  border-radius: 2px;
  font-family: var(--font-mono);
  font-size: .625rem;
  letter-spacing: .16em;
  text-transform: uppercase;
  color: var(--color-graphite-light);
}
.settling-signature-rule {
  align-self: stretch;
  width: 1px;
  background: var(--line);
}
`;
