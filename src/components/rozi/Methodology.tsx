"use client";

import { useInView } from "@/hooks/useInView";
import type { RoziPalette } from "@/components/rozi/palette";

/* ═══════════════════════════════════════════════════════════════════
   Methodology — the four design-thinking phases.

   A flex/grid row of four phase tiles joined by dashed connector arrows.
   Each tile: a rounded-square frame holding a GOLD inline-SVG line icon,
   with a mono uppercase phase label beneath. On mobile the row stacks to
   a single column and the horizontal connectors are hidden.
   ═══════════════════════════════════════════════════════════════════ */

const PHASES = [
  {
    key: "empathize",
    label: "Empathize",
    /* Heart with a small profile face inside. */
    icon: (stroke: string) => (
      <>
        <path
          d="M20 33 C 8 24, 8 12, 15 12 C 19.5 12, 20 16, 20 16 C 20 16, 20.5 12, 25 12 C 32 12, 32 24, 20 33 Z"
          fill="none"
          stroke={stroke}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        <circle cx="20" cy="18.5" r="2.6" fill="none" stroke={stroke} strokeWidth={1.5} />
        <path
          d="M15.4 26 C 16.4 22.8, 23.6 22.8, 24.6 26"
          fill="none"
          stroke={stroke}
          strokeWidth={1.5}
          strokeLinecap="round"
        />
      </>
    ),
  },
  {
    key: "define",
    label: "Define",
    /* Hand/finger tapping a target ring. */
    icon: (stroke: string) => (
      <>
        <circle cx="18" cy="15" r="7.5" fill="none" stroke={stroke} strokeWidth={1.5} />
        <circle cx="18" cy="15" r="3" fill="none" stroke={stroke} strokeWidth={1.5} />
        <path
          d="M24 24 L 27.5 20.5 C 28.6 19.4, 30.2 21, 29.1 22.1 L 24.5 26.7 C 23.3 27.9, 21.6 28.5, 19.9 28.5 L 16.5 28.5 C 15.3 28.5, 14.3 27.7, 14 26.6 L 12.6 21.4 C 12.3 20.2, 13.9 19.5, 14.5 20.6 L 16 23.3 L 16 21"
          fill="none"
          stroke={stroke}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </>
    ),
  },
  {
    key: "ideate",
    label: "Ideate",
    /* Head/profile with a lightbulb inside. */
    icon: (stroke: string) => (
      <>
        <path
          d="M9 30 C 9 20, 14 12, 22 12 C 29 12, 33 17, 33 23 C 33 26, 31 28, 28.5 28.5 L 28.5 30.5 C 28.5 31.6, 27.6 32.5, 26.5 32.5 L 22 32.5"
          fill="none"
          stroke={stroke}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20 15.5 C 16.7 15.5, 15 17.8, 15 20 C 15 21.8, 16 22.8, 16.8 23.6 L 16.8 25 L 23.2 25 L 23.2 23.6 C 24 22.8, 25 21.8, 25 20 C 25 17.8, 23.3 15.5, 20 15.5 Z"
          fill="none"
          stroke={stroke}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        <path d="M17.6 27 L 22.4 27" fill="none" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" />
      </>
    ),
  },
  {
    key: "prototype",
    label: "Prototype",
    /* Pen / vector tool with a node handle. */
    icon: (stroke: string) => (
      <>
        <path
          d="M12 12 L 28 20 L 21 22.5 L 18.5 29.5 Z"
          fill="none"
          stroke={stroke}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        <path d="M20.5 21.5 L 27.5 28.5" fill="none" stroke={stroke} strokeWidth={1.5} strokeLinecap="round" />
        <rect
          x="26.4"
          y="27.4"
          width="4.4"
          height="4.4"
          rx="1"
          fill="none"
          stroke={stroke}
          strokeWidth={1.5}
        />
      </>
    ),
  },
];

/* Dashed connector arrow drawn between two desktop tiles. */
function Connector({ p }: { p: RoziPalette }) {
  return (
    <div
      className="rozi-methodology__link"
      aria-hidden="true"
      style={{
        flex: "0 0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "start",
        /* vertically align to the icon frame center (frame ~= 4.6rem tall) */
        height: "clamp(3.6rem, 8vw, 4.6rem)",
      }}
    >
      <svg
        viewBox="0 0 40 12"
        style={{ width: "clamp(1.6rem, 4vw, 2.6rem)", height: "auto", display: "block", overflow: "visible" }}
        role="presentation"
      >
        <line
          x1="1"
          y1="6"
          x2="31"
          y2="6"
          stroke={p.FAINT}
          strokeWidth={1.5}
          strokeDasharray="3 3.5"
          strokeLinecap="round"
        />
        <path
          d="M30 2 L 37 6 L 30 10"
          fill="none"
          stroke={p.GOLD}
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export default function Methodology({
  p,
  intro = "Research ran as a design-thinking process — empathize, define, ideate, then prototype — each phase feeding concrete outputs into the next.",
}: {
  p: RoziPalette;
  intro?: string;
}) {
  /* threshold 0 + bottom rootMargin: fires as the block meaningfully
     enters, independent of its height (it can exceed one viewport). */
  const { ref, inView } = useInView({ threshold: 0, rootMargin: "0px 0px -10% 0px" });

  return (
    <div
      ref={ref}
      className={`rozi-methodology${inView ? " is-inview" : ""}`}
      style={{ width: "100%" }}
    >
      <style>{`
        .rozi-methodology__frame {
          transition: border-color .35s ease, transform .35s ease, box-shadow .35s ease;
        }
        .rozi-methodology__tile:hover .rozi-methodology__frame {
          transform: translateY(-3px);
        }
        /* Entrance choreography is gated on .is-inview (useInView) so it
           plays when the row scrolls into the viewport, not at mount.
           The resting (pre-JS / no-JS) state stays fully visible — the
           opacity:0 start only ever applies together with the animation. */
        @media (min-width: 761px) {
          .rozi-methodology.is-inview .rozi-methodology__tile {
            opacity: 0;
            animation: rozi-methodology-in .5s ease forwards;
          }
        }
        @keyframes rozi-methodology-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: none; }
        }
        /* Collapse to a single column on mobile: hide horizontal
           connectors, restore full opacity, no entrance transform. */
        @media (max-width: 760px) {
          .rozi-methodology__row { flex-direction: column; }
          .rozi-methodology__link { display: none !important; }
          .rozi-methodology__tile { opacity: 1 !important; animation: none !important; width: 100%; }
        }
        @media (prefers-reduced-motion: reduce) {
          .rozi-methodology__tile { opacity: 1 !important; animation: none !important; }
          .rozi-methodology__frame,
          .rozi-methodology__tile:hover .rozi-methodology__frame { transition: none; transform: none; }
        }
      `}</style>

      {intro ? (
        <p
          style={{
            margin: "0 auto clamp(1.6rem, 4vw, 2.4rem)",
            maxWidth: "48ch",
            textAlign: "center",
            color: p.DIM,
            fontSize: "clamp(.82rem, 1.6vw, .92rem)",
            lineHeight: 1.6,
          }}
        >
          {intro}
        </p>
      ) : null}

      <div
        className="rozi-methodology__row"
        style={{
          display: "flex",
          flexWrap: "nowrap",
          alignItems: "flex-start",
          justifyContent: "center",
          gap: "clamp(.4rem, 1vw, .9rem)",
        }}
      >
        {PHASES.map((phase, i) => {
          const first = i === 0;
          return (
            <div key={phase.key} style={{ display: "contents" }}>
              <div
                className="rozi-methodology__tile"
                style={{
                  flex: "1 1 0",
                  minWidth: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  gap: "clamp(.7rem, 1.6vw, 1rem)",
                  animationDelay: `${i * 0.09}s`,
                }}
              >
                {/* Frame + icon */}
                <div
                  className="rozi-methodology__frame"
                  style={{
                    width: "clamp(3.6rem, 8vw, 4.6rem)",
                    height: "clamp(3.6rem, 8vw, 4.6rem)",
                    borderRadius: "18px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: first
                      ? `color-mix(in srgb, ${p.GOLD} 8%, ${p.GND2})`
                      : p.GND2,
                    border: `1px solid ${first ? `color-mix(in srgb, ${p.GOLD} 34%, ${p.LINEW})` : p.LINEW}`,
                    boxShadow: first ? p.SHADOW : "none",
                  }}
                >
                  <svg
                    viewBox="0 0 40 40"
                    style={{
                      width: "62%",
                      height: "auto",
                      display: "block",
                    }}
                    role="img"
                    aria-label={phase.label}
                  >
                    {phase.icon(p.GOLD)}
                  </svg>
                </div>

                {/* Label + step index */}
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: ".28rem" }}>
                  <span
                    style={{
                      fontFamily: p.MONO,
                      fontSize: ".5rem",
                      letterSpacing: ".22em",
                      textTransform: "uppercase",
                      color: first ? p.GOLDT : p.FAINT,
                    }}
                  >
                    {`0${i + 1}`}
                  </span>
                  <span
                    style={{
                      fontFamily: p.MONO,
                      fontSize: "clamp(.56rem, 1.3vw, .62rem)",
                      letterSpacing: ".18em",
                      textTransform: "uppercase",
                      fontWeight: first ? 600 : 400,
                      color: first ? p.PAP : p.DIM,
                    }}
                  >
                    {phase.label}
                  </span>
                </div>
              </div>

              {/* Connector arrow after every tile except the last */}
              {i < PHASES.length - 1 ? <Connector p={p} /> : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
