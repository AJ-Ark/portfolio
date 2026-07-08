"use client";

/* ══════════════════════════════════════════════════════════════════
   ERROR BOUNDARY — the branded runtime-error state.

   Route error boundaries MUST be client components (they receive the
   thrown error + a reset() callback). Same quiet dust language as the
   404: no background of its own (the persistent field shows through),
   a breathing hairline, calm copy, and the shared Footer so the
   Settling sign-off still closes the page.

   The root layout (and its ParticleProvider / TranslationProvider)
   survives a segment error, so useTranslation, WarpLink's particle
   hooks, and Footer all still resolve here. Degrades to a plain link
   without JS; reset() re-renders the failed segment in place.
   ══════════════════════════════════════════════════════════════════ */

import { useEffect } from "react";
import Link from "next/link";
import Footer from "@/components/layout/Footer";
import { useTranslation } from "@/lib/TranslationContext";

const CTA_STYLE = {
  fontFamily: "var(--font-mono)",
  fontSize: ".7rem",
  letterSpacing: ".14em",
  textTransform: "uppercase" as const,
  padding: ".6rem 1.2rem",
  display: "inline-flex",
  alignItems: "center",
  gap: ".5em",
};

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useTranslation();

  useEffect(() => {
    // Surface for diagnostics; never leak the raw message into the UI.
    console.error(error);
  }, [error]);

  return (
    <>
      <style>{`
        @keyframes aj-err-hairline {
          0%, 100% { opacity: .3; transform: scaleX(.72); }
          50%      { opacity: .8; transform: scaleX(1); }
        }
        .aj-err-hairline {
          width: clamp(96px, 18vw, 220px);
          height: 1px;
          background: var(--line);
          transform-origin: center;
          animation: aj-err-hairline 2.4s var(--ease) infinite;
        }
        .aj-err-btn {
          background: transparent;
          cursor: pointer;
          appearance: none;
        }
        @media (prefers-reduced-motion: reduce) {
          .aj-err-hairline { animation: none; }
        }
      `}</style>

      <main
        id="main-content"
        style={{
          minHeight: "78vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "8rem var(--pad) 4rem",
          gap: "1.75rem",
        }}
      >
        <span
          className="label-mono"
          style={{ color: "var(--color-graphite-light)" }}
        >
          500
        </span>

        <h1
          className="display-serif"
          style={{
            fontSize: "clamp(1.9rem, 5.5vw, 3.2rem)",
            lineHeight: 1.08,
            margin: 0,
            maxWidth: "18ch",
          }}
        >
          {t("route.error.title")}
        </h1>

        <p className="lede" style={{ margin: "0 auto" }}>
          {t("route.error.body")}
        </p>

        <div className="aj-err-hairline" aria-hidden="true" />

        <div
          style={{
            display: "flex",
            gap: "1rem",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <button
            type="button"
            onClick={() => reset()}
            className="cta-link aj-err-btn"
            style={CTA_STYLE}
          >
            <span>{t("route.error.reset")}</span>
          </button>
          <Link href="/" className="cta-link" style={CTA_STYLE}>
            <span>{t("route.error.home")}</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}
