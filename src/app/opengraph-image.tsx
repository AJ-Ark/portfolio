import { ImageResponse } from "next/og";

/* ══════════════════════════════════════════════════════════════════
   DEFAULT OPEN GRAPH IMAGE — 1200×630.

   Placed at the app root so Next.js wires it as the default og:image
   (and the twitter:image fallback) for EVERY route that doesn't ship
   its own opengraph-image. This closes the gap where layout.tsx
   declared openGraph/twitter cards with no image attached.

   On-brand: the dark ground, the gold wordmark, the mono kicker and a
   single hairline — the same visual grammar as the site chrome. Font
   is next/og's bundled default (no external fetch), so the build can
   never fail on a missing font file.
   ══════════════════════════════════════════════════════════════════ */

export const alt = "Aravind J · Product Designer & UX Researcher";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Brand tokens, mirrored from globals.css :root (home/gold preset).
const GROUND = "#0e0b09";
const GROUND2 = "#141109";
const GOLD = "#d9b46a";
const GOLD_BRIGHT = "#f1d8a3";
const PAPER = "#ece6d6";
const GRAPHITE = "#9a927f";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px 96px",
          background: `radial-gradient(120% 120% at 22% 18%, ${GROUND2} 0%, ${GROUND} 62%)`,
          color: PAPER,
        }}
      >
        {/* Top row — mono kicker + domain */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: 24,
            letterSpacing: 6,
            textTransform: "uppercase",
            color: GRAPHITE,
          }}
        >
          <div style={{ display: "flex" }}>Portfolio · 2026</div>
          <div style={{ display: "flex", color: GOLD }}>aravindj.xyz</div>
        </div>

        {/* Wordmark block */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 28,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 150,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: -3,
              color: GOLD_BRIGHT,
            }}
          >
            Aravind J
          </div>
          <div
            style={{
              display: "flex",
              width: 220,
              height: 3,
              background: GOLD,
              opacity: 0.7,
            }}
          />
          <div
            style={{
              display: "flex",
              fontSize: 42,
              fontWeight: 400,
              color: PAPER,
              opacity: 0.92,
            }}
          >
            Product Designer & UX Researcher
          </div>
        </div>

        {/* Bottom row — positioning line */}
        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: GRAPHITE,
          }}
        >
          Architect by training, designer by practice.
        </div>
      </div>
    ),
    { ...size }
  );
}
