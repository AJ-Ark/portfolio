import type { RoziPalette } from "@/components/rozi/palette";

/* ═══════════════════════════════════════════════════════════════════
   EmpathyMap — classic Says / Thinks / Does / Feels quadrant.

   A CSS-grid 2×2 with dashed cross-hair axes and a central gold user
   badge sitting where the axes cross. Each quadrant carries a small
   "What the user…" header, a maroon pill naming the quadrant, then its
   content. On mobile the grid collapses (via `mobile-stack`) to a
   single column and the badge floats to the top as a divider marker.
   ═══════════════════════════════════════════════════════════════════ */

type Quadrant = {
  key: string;
  pill: string;
  verbatim?: string;
  items?: string[];
};

const QUADRANTS: Quadrant[] = [
  {
    key: "says",
    pill: "Says",
    verbatim: "Hame toh adjust karna padta hai.",
  },
  {
    key: "thinks",
    pill: "Thinks",
    items: [
      "Concern about the next day's living",
      "Need for hygienic stay & living",
      "Need for proper medical facilities",
    ],
  },
  {
    key: "does",
    pill: "Does",
    items: [
      "Whatever it takes to get a roof over his family and other members",
    ],
  },
  {
    key: "feels",
    pill: "Feels",
    items: [
      "Fear of losing out on a job",
      "Concern about future plans & savings",
      "Doesn't want his family to starve",
    ],
  },
];

export default function EmpathyMap({ p }: { p: RoziPalette }) {
  const dashed = `1px dashed ${p.FAINT}`;

  return (
    <div
      className="rozi-empathy"
      style={{
        position: "relative",
        borderRadius: 20,
        background: p.GND2,
        border: `1px solid ${p.LINE}`,
        boxShadow: p.SHADOW,
        padding: "clamp(1rem, 3vw, 1.9rem)",
      }}
    >
      <style>{`
        .rozi-empathy .rozi-empathy-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(.85rem, 2.4vw, 1.35rem);
          position: relative;
        }
        .rozi-empathy .rozi-empathy-quad {
          animation: roziEmpathyRise .5s cubic-bezier(.22,.61,.36,1) both;
        }
        .rozi-empathy .rozi-empathy-quad:nth-child(2) { animation-delay: .06s; }
        .rozi-empathy .rozi-empathy-quad:nth-child(3) { animation-delay: .12s; }
        .rozi-empathy .rozi-empathy-quad:nth-child(4) { animation-delay: .18s; }
        .rozi-empathy .rozi-empathy-badge { animation: roziEmpathyPop .55s cubic-bezier(.34,1.56,.64,1) both; }
        @keyframes roziEmpathyRise {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes roziEmpathyPop {
          from { opacity: 0; transform: translate(-50%, -50%) scale(.7); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        /* Cross-hair axes: shown only on the 2×2 layout. */
        .rozi-empathy .rozi-empathy-axis-v,
        .rozi-empathy .rozi-empathy-axis-h { display: block; }
        .rozi-empathy .rozi-empathy-badge-wrap { display: block; }
        .rozi-empathy .rozi-empathy-badge-top { display: none; }

        @media (max-width: 760px) {
          .rozi-empathy .rozi-empathy-axis-v,
          .rozi-empathy .rozi-empathy-axis-h,
          .rozi-empathy .rozi-empathy-badge-wrap { display: none; }
          .rozi-empathy .rozi-empathy-badge-top { display: flex; }
        }
        @media (prefers-reduced-motion: reduce) {
          .rozi-empathy .rozi-empathy-quad,
          .rozi-empathy .rozi-empathy-badge { animation: none; }
        }
      `}</style>

      {/* Mobile-only badge, sits above the stacked quadrants as a divider. */}
      <div
        className="rozi-empathy-badge-top"
        style={{
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1.6rem",
        }}
      >
        <UserBadge p={p} size={52} />
      </div>

      <div className="rozi-empathy-grid mobile-stack">
        {/* Dashed cross-hair — vertical */}
        <span
          aria-hidden="true"
          className="rozi-empathy-axis-v"
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: "50%",
            width: 0,
            borderLeft: dashed,
            transform: "translateX(-50%)",
            pointerEvents: "none",
          }}
        />
        {/* Dashed cross-hair — horizontal */}
        <span
          aria-hidden="true"
          className="rozi-empathy-axis-h"
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: "50%",
            height: 0,
            borderTop: dashed,
            transform: "translateY(-50%)",
            pointerEvents: "none",
          }}
        />

        {QUADRANTS.map((q) => (
          <QuadrantCard key={q.key} q={q} p={p} />
        ))}

        {/* Central user badge where the axes cross. */}
        <div
          aria-hidden="true"
          className="rozi-empathy-badge-wrap"
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            zIndex: 2,
          }}
        >
          <div
            className="rozi-empathy-badge"
            style={{
              display: "grid",
              placeItems: "center",
              padding: ".4rem",
              borderRadius: "999px",
              background: p.GND2,
            }}
          >
            <UserBadge p={p} size="clamp(58px, 9vw, 78px)" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Central circular gold badge with user glyph + "User" label ─── */
function UserBadge({
  p,
  size,
}: {
  p: RoziPalette;
  size: number | string;
}) {
  const dim = typeof size === "number" ? `${size}px` : size;
  return (
    <span
      style={{
        position: "relative",
        display: "grid",
        placeItems: "center",
        width: dim,
        height: dim,
        borderRadius: "999px",
        background: p.GOLD,
        border: `1px solid ${p.GOLDB}`,
        boxShadow: `0 0 0 5px color-mix(in srgb, ${p.GOLD} 16%, transparent)`,
        color: "#fff",
      }}
    >
      <svg
        viewBox="0 0 24 24"
        width="46%"
        height="46%"
        fill="none"
        stroke="#ffffff"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{ display: "block", marginTop: "-6%" }}
      >
        <circle cx="12" cy="8" r="3.6" fill="#ffffff" stroke="none" />
        <path d="M4.8 20c0-3.9 3.2-6.6 7.2-6.6s7.2 2.7 7.2 6.6" fill="#ffffff" stroke="none" />
      </svg>
      <span
        style={{
          position: "absolute",
          fontFamily: p.MONO,
          textTransform: "uppercase",
          letterSpacing: ".14em",
          fontSize: "clamp(.42rem, 1.2vw, .52rem)",
          fontWeight: 600,
          color: "#fff",
          transform: "translateY(155%)",
        }}
      >
        User
      </span>
    </span>
  );
}

/* ─── One quadrant: header + maroon pill + content ─── */
function QuadrantCard({ q, p }: { q: Quadrant; p: RoziPalette }) {
  return (
    <div
      className="rozi-empathy-quad"
      style={{
        background: p.GND,
        border: `1px solid ${p.LINEW}`,
        borderRadius: 16,
        padding: "clamp(.95rem, 2.4vw, 1.4rem)",
        display: "flex",
        flexDirection: "column",
        gap: ".7rem",
        minWidth: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: ".55rem", flexWrap: "wrap" }}>
        <span
          style={{
            fontFamily: p.MONO,
            textTransform: "uppercase",
            letterSpacing: ".2em",
            fontSize: ".5rem",
            color: p.DIM,
          }}
        >
          What the user…
        </span>
        <span
          style={{
            fontFamily: p.MONO,
            textTransform: "uppercase",
            letterSpacing: ".16em",
            fontSize: ".54rem",
            fontWeight: 600,
            color: "#fff",
            background: p.ACC,
            borderRadius: "999px",
            padding: ".24rem .6rem",
            lineHeight: 1,
          }}
        >
          {q.pill}
        </span>
      </div>

      {q.verbatim ? (
        <blockquote
          style={{
            margin: 0,
            fontFamily: p.SERIF,
            fontStyle: "italic",
            fontWeight: 400,
            letterSpacing: "-.02em",
            fontSize: "clamp(1.15rem, 3.2vw, 1.6rem)",
            lineHeight: 1.32,
            color: p.PAP,
            position: "relative",
            paddingLeft: "1.1rem",
            borderLeft: `2px solid ${p.GOLD}`,
          }}
        >
          <span aria-hidden="true" style={{ color: p.GOLDT, marginRight: ".08em" }}>
            &ldquo;
          </span>
          {q.verbatim}
          <span aria-hidden="true" style={{ color: p.GOLDT, marginLeft: ".04em" }}>
            &rdquo;
          </span>
        </blockquote>
      ) : (
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "flex",
            flexDirection: "column",
            gap: ".5rem",
          }}
        >
          {q.items?.map((item, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                gap: ".55rem",
                alignItems: "flex-start",
                color: p.DIM,
                fontSize: "clamp(.82rem, 2vw, .9rem)",
                lineHeight: 1.55,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  flex: "none",
                  width: 5,
                  height: 5,
                  marginTop: ".5em",
                  borderRadius: "999px",
                  background: p.ACCT,
                }}
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
