import type { RoziPalette } from "@/components/rozi/palette";
import { lifecycleStageColors } from "@/components/rozi/palette";

/* ═══════════════════════════════════════════════════════════════════
   LifecycleMap — "Life cycle of a migrant worker" (DEFINE-phase hero).

   Four stage cards. On desktop they cascade left→right and step DOWN,
   echoing the economic decline; elbow connectors with arrowheads join
   them. On mobile the whole thing reflows to a vertical timeline with
   a connector rail on the left. Card tints run gold → deep maroon
   (early opportunity fading into hardship) via lifecycleStageColors(p).
   ═══════════════════════════════════════════════════════════════════ */

type Stage = {
  idx: string;
  name: string;
  age: string;
  desc?: string;
  bullets?: string[];
};

const STAGES: Stage[] = [
  { idx: "01", name: "Early entry", age: "14–20 yrs", desc: "Secondary wage earners" },
  { idx: "02", name: "Peak work life", age: "21–30 yrs", desc: "Primary wage earners" },
  {
    idx: "03",
    name: "Beginning of exit",
    age: "31–35 yrs",
    desc: "Chronic illness begins to affect earning potential",
  },
  {
    idx: "04",
    name: "Return",
    age: ">35 yrs",
    bullets: [
      "Returns to the village",
      "Low earning potential",
      "Slides back to poverty",
      "Children start working",
    ],
  },
];

export default function LifecycleMap({ p }: { p: RoziPalette }) {
  const stageColors = lifecycleStageColors(p);

  /* Text-safe accent per stage (gold family → maroon), mirroring the
     gold→maroon marker sequence. `marker` colors are fill-tuned and too
     low-contrast for the small mono index, so small colored text uses the
     per-theme *T variants (consistent with sibling components). */
  const stageInkColors = [p.GOLDT, p.GOLDT, p.GOLDT, p.ACCT];

  /* Elbow connector: on desktop it lives on the right edge of a card and
     bends DOWN into the next (lower) card. Rendered as a tiny SVG so the
     arrowhead stays crisp. Uses p.FAINT for the line, p.GOLD for the head. */
  const connector = (key: string) => (
    <svg
      className="rzlc-elbow"
      aria-hidden="true"
      viewBox="0 0 44 60"
      preserveAspectRatio="none"
      key={key}
    >
      <path
        d="M2 14 H30 Q34 14 34 20 V44"
        fill="none"
        stroke={p.FAINT}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M34 52 L30 42 L38 42 Z"
        fill={p.GOLD}
        stroke="none"
      />
    </svg>
  );

  return (
    <div className="rzlc-root">
      <style>{`
        .rzlc-root {
          --rzlc-step: clamp(14px, 2.6vw, 34px);
          position: relative;
          width: 100%;
        }
        .rzlc-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: clamp(12px, 1.4vw, 22px);
          align-items: start;
        }
        .rzlc-cell {
          position: relative;
          min-width: 0;
        }
        /* Descending cascade on desktop: each cell sits lower than the last. */
        .rzlc-grid > .rzlc-cell:nth-child(1) { transform: translateY(0); }
        .rzlc-grid > .rzlc-cell:nth-child(2) { transform: translateY(var(--rzlc-step)); }
        .rzlc-grid > .rzlc-cell:nth-child(3) { transform: translateY(calc(var(--rzlc-step) * 2)); }
        .rzlc-grid > .rzlc-cell:nth-child(4) { transform: translateY(calc(var(--rzlc-step) * 3)); }

        .rzlc-card {
          position: relative;
          border-radius: 18px;
          padding: clamp(1.1rem, 1.6vw, 1.5rem);
          height: 100%;
          box-sizing: border-box;
          transition: transform .45s cubic-bezier(.2,.7,.2,1), opacity .45s ease;
        }
        .rzlc-marker {
          position: absolute;
          top: 0;
          left: clamp(1.1rem, 1.6vw, 1.5rem);
          width: 34px;
          height: 3px;
          border-radius: 0 0 3px 3px;
        }

        /* Desktop elbow connector: sits at the right edge, bending down. */
        .rzlc-elbow {
          position: absolute;
          top: 30%;
          right: calc(clamp(12px, 1.4vw, 22px) * -1);
          width: calc(clamp(12px, 1.4vw, 22px) + 6px);
          height: calc(var(--rzlc-step) + 34px);
          overflow: visible;
          pointer-events: none;
        }
        .rzlc-rail { display: none; }

        /* Entrance: subtle rise + fade, staggered. */
        @media (prefers-reduced-motion: no-preference) {
          .rzlc-card { animation: rzlc-rise .6s both; }
          .rzlc-cell:nth-child(1) .rzlc-card { animation-delay: .00s; }
          .rzlc-cell:nth-child(2) .rzlc-card { animation-delay: .09s; }
          .rzlc-cell:nth-child(3) .rzlc-card { animation-delay: .18s; }
          .rzlc-cell:nth-child(4) .rzlc-card { animation-delay: .27s; }
        }
        @keyframes rzlc-rise {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Mobile: vertical timeline. ── */
        @media (max-width: 760px) {
          .rzlc-grid {
            gap: 0;
            padding-left: 30px;
          }
          .rzlc-grid > .rzlc-cell { transform: none !important; }
          .rzlc-cell { padding-bottom: 1.1rem; }
          .rzlc-cell:last-child { padding-bottom: 0; }
          .rzlc-elbow { display: none; }
          /* connector rail: vertical line + node dot per card */
          .rzlc-rail {
            display: block;
            position: absolute;
            left: -30px;
            top: 0;
            bottom: 0;
            width: 30px;
          }
          .rzlc-rail::before {
            content: "";
            position: absolute;
            left: 5px;
            top: 12px;
            bottom: -2px;
            width: 1.5px;
            background: ${p.LINE};
          }
          .rzlc-cell:last-child .rzlc-rail::before { display: none; }
          .rzlc-node {
            position: absolute;
            left: 0;
            top: 8px;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: 1.5px solid ${p.GND2};
            box-sizing: border-box;
          }
        }
      `}</style>

      <div className="rzlc-grid mobile-stack">
        {STAGES.map((s, i) => {
          const c = stageColors[i];
          const ink = stageInkColors[i];
          const last = i === STAGES.length - 1;
          return (
            <div className="rzlc-cell" key={s.idx}>
              {/* mobile timeline node (colored per stage) */}
              <span
                className="rzlc-node"
                aria-hidden="true"
                style={{ background: c.marker }}
              />

              <div
                className="rzlc-card"
                style={{
                  background: `color-mix(in srgb, ${c.marker} 9%, ${p.GND2})`,
                  border: `1px solid ${p.LINE}`,
                  boxShadow: p.SHADOW,
                }}
              >
                {/* colored top tab keyed to the stage */}
                <span
                  className="rzlc-marker"
                  aria-hidden="true"
                  style={{ background: c.marker }}
                />

                <div
                  style={{
                    fontFamily: p.MONO,
                    fontSize: ".56rem",
                    letterSpacing: ".22em",
                    color: ink,
                    marginBottom: ".7rem",
                    marginTop: ".2rem",
                  }}
                >
                  {s.idx}
                </div>

                <div
                  style={{
                    fontFamily: p.SERIF,
                    fontWeight: 400,
                    fontSize: "clamp(1.1rem, 1.8vw, 1.45rem)",
                    letterSpacing: "-.02em",
                    lineHeight: 1.08,
                    color: p.PAP,
                    marginBottom: ".5rem",
                  }}
                >
                  {s.name}
                </div>

                <div
                  style={{
                    fontFamily: p.MONO,
                    fontSize: ".56rem",
                    letterSpacing: ".16em",
                    textTransform: "uppercase",
                    color: p.DIM,
                    marginBottom: ".9rem",
                  }}
                >
                  {s.age}
                </div>

                {s.desc ? (
                  <p
                    style={{
                      fontSize: ".8rem",
                      color: p.DIM,
                      lineHeight: 1.55,
                      margin: 0,
                    }}
                  >
                    {s.desc}
                  </p>
                ) : null}

                {s.bullets ? (
                  <ul
                    style={{
                      listStyle: "none",
                      margin: 0,
                      padding: 0,
                      display: "flex",
                      flexDirection: "column",
                      gap: ".4rem",
                    }}
                  >
                    {s.bullets.map((b) => (
                      <li
                        key={b}
                        style={{
                          display: "flex",
                          gap: ".5rem",
                          fontSize: ".8rem",
                          color: p.DIM,
                          lineHeight: 1.45,
                        }}
                      >
                        <span
                          aria-hidden="true"
                          style={{
                            flexShrink: 0,
                            marginTop: ".42em",
                            width: "4px",
                            height: "4px",
                            borderRadius: "50%",
                            background: c.marker,
                          }}
                        />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>

              {/* elbow connector to the next (lower) card — desktop only */}
              {!last ? connector(`elbow-${s.idx}`) : null}

              {/* vertical rail for the mobile timeline */}
              <span className="rzlc-rail" aria-hidden="true" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
