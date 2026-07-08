"use client";

/* ═══════════════════════════════════════════════════════════════════
   THE SETTLING — every page ends with the material at rest.

   The closing band rendered by <Footer>: the AJ logo as a playful
   physics object (PlayfulLogo — leans toward the cursor and stirs the
   dust field on approach), an oversized Fraunces "Say hello" mailto,
   a quiet mono line with the visitor's LOCAL time, and the old 0.5rem
   "PORTFOLIO · 2026 / REV 01 · NTS" drawing-annotation whisper scaled
   up into a legible title-block signature.

   (The dust field no longer forms an "AJ" monogram here — the real
   logo carries the sign-off instead, and the field stays its ambient
   route self behind it.)

   SSR: the full band ships visible (Reveal never bakes opacity:0);
   only the clock is client-filled — the server renders a placeholder
   and the first client render matches it, so there is no hydration
   mismatch and the band still reads with JS disabled.

   Reduced motion: static band — the logo is a plain masked glyph with
   no listeners, no per-second tick (the clock calms to minute
   precision), Reveal no-ops.
   ═══════════════════════════════════════════════════════════════════ */

import { useEffect, useState } from "react";
import Reveal from "@/components/ui/Reveal";
import PlayfulLogo from "@/components/ui/PlayfulLogo";
import { useInView } from "@/hooks/useInView";
import { prefersReducedMotionNow } from "@/hooks/usePrefersReducedMotion";
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
  /* once:false — the clock ticks (and the logo reacts) only while the
     band is actually on screen. */
  const { ref, inView } = useInView<HTMLDivElement>({
    once: false,
    threshold: 0.25,
  });
  const [clock, setClock] = useState<Clock | null>(null);

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
  }, [inView, language]);

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

      {/* The logo is the playful focal sign-off: it leans toward the cursor
          and stirs the dust field on approach (PlayfulLogo). Active only
          while the band is in view. */}
      <Reveal className="settling-logo-row">
        <PlayfulLogo size={88} active={inView} />
      </Reveal>

      <Reveal delay={0.06}>
        <a
          href={`mailto:${EMAIL}`}
          className="display-serif settling-hello"
          data-cursor="enter"
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
.settling-logo-row {
  margin-bottom: clamp(1.4rem, 4vh, 2.6rem);
}
.settling-hello {
  position: relative;
  display: inline-block;
  font-style: normal;
  font-weight: 520;
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
