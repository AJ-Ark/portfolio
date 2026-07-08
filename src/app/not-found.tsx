"use client";

/* ══════════════════════════════════════════════════════════════════
   404 — the branded not-found state.

   Speaks the site's quiet dust language (see loading.tsx): the
   persistent WebGL field shows through (this container paints no
   background), a single breathing hairline holds the centre, and the
   copy sits above it. Closes with the shared Footer so the Settling
   sign-off still lands on a dead-end route.

   Client component because it reads translated copy through the same
   TranslationProvider that Footer needs; SSR-safe (first render uses
   the bundled English, identical to the server output) and degrades
   to a plain <a> home link without JS.
   ══════════════════════════════════════════════════════════════════ */

import Footer from "@/components/layout/Footer";
import WarpLink from "@/components/ui/WarpLink";
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

export default function NotFound() {
  const { t } = useTranslation();
  return (
    <>
      <style>{`
        @keyframes aj-nf-hairline {
          0%, 100% { opacity: .3; transform: scaleX(.72); }
          50%      { opacity: .8; transform: scaleX(1); }
        }
        .aj-nf-hairline {
          width: clamp(96px, 18vw, 220px);
          height: 1px;
          background: var(--line);
          transform-origin: center;
          animation: aj-nf-hairline 2.4s var(--ease) infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .aj-nf-hairline { animation: none; }
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
          404
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
          {t("route.notFound.title")}
        </h1>

        <p className="lede" style={{ margin: "0 auto" }}>
          {t("route.notFound.body")}
        </p>

        <div className="aj-nf-hairline" aria-hidden="true" />

        <WarpLink href="/" variant="settle" className="cta-link" style={CTA_STYLE}>
          <span>{t("route.notFound.home")}</span>
          <span aria-hidden="true">→</span>
        </WarpLink>
      </main>

      <Footer />
    </>
  );
}
