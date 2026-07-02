import type { RoziPalette } from "@/components/rozi/palette";

/* ═══════════════════════════════════════════════════════════════════
   OpportunityMindMap — the IDEATE-phase hero.

   A responsive hub: a central "Migrant workers" node with SEVEN
   category branches. Each branch is a card listing its opportunities.

   Desktop (>760px): a 3-column CSS-grid built from named template areas.
   The hub sits in the centre of the middle row; the seven cards flow
   around it. Faint gold connector spokes radiate from the hub behind the
   cards via an absolutely-positioned SVG underlay — purely decorative, so
   they can never influence layout or break responsiveness.

   Mobile (≤760px): the grid template collapses to a single column (own
   media query, uniquely prefixed). Source order puts the hub first, so it
   appears on top followed by the seven cards, one per row. The SVG spokes
   fade out on mobile.
   ═══════════════════════════════════════════════════════════════════ */

type Category = { area: string; header: string; items: string[] };

/* `area` = the grid-template-areas name each card claims on desktop. */
const CATEGORIES: Category[] = [
  {
    area: "bank",
    header: "Banking",
    items: [
      "Follow-ups on bank documents (cheque, bank slip)",
      "Customer support",
      "Digital payments on small devices (Nokia, Jio phone)",
      "Minimal-interaction interfaces",
      "Post-office banking services",
      "Recovering forgotten credentials",
    ],
  },
  {
    area: "heal",
    header: "Healthcare",
    items: [
      "Primary healthcare services",
      "Basic vaccination",
      "Addressing language barriers",
      "Affordable treatment",
      "Hassle-free hospital experience",
      "Integrating with hospital-network CSR & online services",
    ],
  },
  {
    area: "comm",
    header: "Community",
    items: [
      "Housing options",
      "Journey / ticket queries",
      "Accessing resources for daily use",
      "Gathering people",
      "Awareness programmes",
      "Tool rental",
    ],
  },
  {
    area: "jobs",
    header: "Job platform",
    items: [
      "Job-vacancy / work-availability dashboards",
      "Upskilling",
      "Feedback & recommendations from past employers",
      "A platform for employers",
      "User verification",
      "Job-vacancy adverts",
    ],
  },
  {
    area: "pays",
    header: "Payments",
    items: [
      "Building a money-saving mentality",
      "UPI-based salary slips",
      "A fixed pay scale to refer to",
      "Reward-based payment",
      "A database of daily payouts",
    ],
  },
  {
    area: "skil",
    header: "Up-skilling",
    items: [
      "New skills to expand where they can work",
      "Learning a new language to adapt",
      "Technical education",
      "Financial literacy",
    ],
  },
  {
    area: "vote",
    header: "Voting",
    items: ["Participation in local elections"],
  },
];

/* Spoke endpoints in the 0–100 viewBox, one per perimeter card. */
const SPOKES: [number, number][] = [
  [16, 18], // Banking      top-left
  [50, 14], // Healthcare   top-centre
  [84, 18], // Community    top-right
  [14, 50], // Job platform mid-left
  [86, 50], // Payments     mid-right
  [16, 82], // Up-skilling  bottom-left
  [84, 82], // Voting       bottom-right
];

export default function OpportunityMindMap({ p }: { p: RoziPalette }) {
  /* translucent fills via color-mix so they stay theme-appropriate
     without hardcoding any theme-dependent value */
  const goldWash = "color-mix(in srgb, var(--color-gold) 8%, transparent)";
  const goldDot = "color-mix(in srgb, var(--color-gold) 55%, transparent)";

  return (
    <div style={{ position: "relative" }}>
      <style>{`
        .omm-grid {
          display: grid;
          gap: clamp(0.9rem, 2vw, 1.5rem);
          grid-template-columns: 1fr 1fr 1fr;
          grid-template-areas:
            "bank heal comm"
            "jobs hub  pays"
            "skil vote vote";
        }
        .omm-hub-cell { grid-area: hub; }
        .omm-card { transition: transform .25s ease, border-color .25s ease; }
        .omm-card:hover { transform: translateY(-3px); border-color: ${p.GOLDT}; }
        .omm-hub { animation: omm-pulse 5.5s ease-in-out infinite; }
        @keyframes omm-pulse {
          0%, 100% { transform: scale(1); }
          50%      { transform: scale(1.02); }
        }
        @media (max-width: 760px) {
          .omm-grid {
            grid-template-columns: 1fr;
            grid-template-areas: none;
          }
          .omm-grid > * { grid-area: auto !important; }
          .omm-spokes { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .omm-card, .omm-hub { transition: none; animation: none; }
          .omm-card:hover { transform: none; }
        }
      `}</style>

      {/* Decorative connector underlay — absolutely positioned so it can
          never influence the flow. preserveAspectRatio="none" lets it
          stretch to the grid box; non-scaling strokes keep hairlines crisp. */}
      <svg
        className="omm-spokes"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 1,
          pointerEvents: "none",
        }}
      >
        {SPOKES.map(([x, y]) => (
          <line
            key={`${x}-${y}`}
            x1="50"
            y1="50"
            x2={x}
            y2={y}
            stroke={p.GOLD}
            strokeWidth="0.5"
            strokeOpacity="0.4"
            strokeDasharray="1.4 1.6"
            vectorEffect="non-scaling-stroke"
          />
        ))}
        <circle cx="50" cy="50" r="0.9" fill={p.GOLD} fillOpacity="0.5" />
      </svg>

      <div
        className="omm-grid"
        style={{
          position: "relative",
          zIndex: 2,
          background: goldWash,
          borderRadius: "20px",
          padding: "clamp(1rem, 2.5vw, 1.8rem)",
        }}
      >
        {/* Hub — emitted FIRST so the collapsed mobile column stacks it on
            top; on desktop grid-area "hub" pins it to the centre cell. */}
        <div
          className="omm-hub-cell"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 3,
            minHeight: "clamp(9rem, 18vw, 12rem)",
          }}
        >
          <div
            className="omm-hub"
            style={{
              position: "relative",
              width: "clamp(9rem, 15vw, 11rem)",
              aspectRatio: "1 / 1",
              borderRadius: "50%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              padding: "1rem",
              background: `radial-gradient(circle at 32% 28%, ${p.ACCB}, ${p.ACC} 60%, ${p.GOLD} 160%)`,
              border: `1.5px solid ${p.GOLD}`,
              boxShadow: p.SHADOW,
            }}
          >
            <span
              style={{
                fontFamily: p.MONO,
                textTransform: "uppercase",
                letterSpacing: ".22em",
                fontSize: ".46rem",
                color: "rgba(255,255,255,.72)",
                marginBottom: ".45rem",
              }}
            >
              Hub
            </span>
            <span
              style={{
                fontFamily: p.SERIF,
                fontWeight: 400,
                letterSpacing: "-.02em",
                fontSize: "clamp(1.15rem, 2.2vw, 1.55rem)",
                lineHeight: 1.05,
                color: "#FBF8F5",
              }}
            >
              Migrant
              <br />
              workers
            </span>
          </div>
        </div>

        {/* Seven category cards. */}
        {CATEGORIES.map((c) => (
          <div
            key={c.area}
            className="omm-card"
            style={{
              gridArea: c.area,
              position: "relative",
              zIndex: 2,
              background: p.GND2,
              border: `1px solid ${p.LINE}`,
              borderRadius: "18px",
              padding: "1.3rem 1.4rem",
              boxShadow: p.SHADOW,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: ".55rem",
                marginBottom: ".9rem",
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: ".42rem",
                  height: ".42rem",
                  borderRadius: "50%",
                  background: p.GOLD,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: p.MONO,
                  textTransform: "uppercase",
                  letterSpacing: ".2em",
                  fontSize: ".54rem",
                  color: p.GOLDT,
                }}
              >
                {c.header}
              </span>
            </div>
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {c.items.map((item) => (
                <li
                  key={item}
                  style={{
                    position: "relative",
                    paddingLeft: "1rem",
                    fontSize: ".82rem",
                    color: p.DIM,
                    lineHeight: 1.5,
                    marginBottom: ".5rem",
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      left: 0,
                      top: ".62em",
                      width: ".3rem",
                      height: ".3rem",
                      borderRadius: "50%",
                      background: goldDot,
                    }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
