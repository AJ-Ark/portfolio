"use client";

/* ══════════════════════════════════════════════════════════════════
   ROUTE LOADING — the quiet in-between state.

   Deliberately NOT a repeat of the first-visit entrance: no cover, no
   wordmark. Just the page's own ground (the persistent dust field
   shows through — this container paints no background) and a single
   breathing hairline in the current domain's --line color.

   SSR-safe by nature (static markup, no client state), theme- and
   domain-aware via CSS vars, and calm under prefers-reduced-motion:
   the hairline simply holds still.
   ══════════════════════════════════════════════════════════════════ */

import type { CSSProperties } from "react";
import { useTranslation } from "@/lib/TranslationContext";

/* globals.css has no .sr-only utility and is owned elsewhere — the
   clip pattern lives here inline (same as HomeReel). */
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

export default function Loading() {
  const { t } = useTranslation();
  return (
    <div
      role="status"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <style>{`
        @keyframes aj-route-hairline {
          0%, 100% { opacity: .35; transform: scaleX(.72); }
          50%      { opacity: 1;   transform: scaleX(1); }
        }
        .aj-route-hairline {
          width: clamp(96px, 18vw, 220px);
          height: 1px;
          background: var(--line);
          transform-origin: center;
          animation: aj-route-hairline 1.8s var(--ease) infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .aj-route-hairline { animation: none; }
        }
      `}</style>
      <div className="aj-route-hairline" aria-hidden="true" />
      <span style={VISUALLY_HIDDEN}>{t("loader.loading")}</span>
    </div>
  );
}
