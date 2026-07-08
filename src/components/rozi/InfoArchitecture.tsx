"use client";

import { useInView } from "@/hooks/useInView";
import type { RoziPalette } from "@/components/rozi/palette";

/* ═══════════════════════════════════════════════════════════════════
   Rozi — Information Architecture
   The two-sided platform structure, cleaned up from a dense Figma board
   into a scannable IA: a compact spine (Employer → Database → Platform →
   Employee) over two grouped panels of sub-flow clusters.
   ═══════════════════════════════════════════════════════════════════ */

type Chip = {
  label: string;
  /* trailing consequence rendered as a soft "→ x" tail on the chip */
  tail?: string;
  /* nested options revealed as sub-chips under this chip */
  sub?: string[];
};

type Cluster = {
  heading: string;
  chips: Chip[];
  /* gold-highlighted value-add cluster */
  highlight?: boolean;
};

type Panel = {
  side: "Employer" | "Employee";
  clusters: Cluster[];
};

const EMPLOYER: Cluster[] = [
  {
    heading: "Onboarding",
    chips: [{ label: "Verification / ID proof" }, { label: "Scan Aadhaar QR" }],
  },
  {
    heading: "Posts a requirement",
    chips: [
      { label: "Type of labour" },
      { label: "Number of people" },
      { label: "Phone number" },
      { label: "Language flexibility" },
      { label: "Duration of work" },
    ],
  },
  {
    heading: "Listed-jobs portal",
    chips: [
      { label: "People signed up" },
      { label: "Remaining vacancy" },
      { label: "Language options" },
      { label: "Contact worker" },
    ],
  },
  {
    heading: "Job list full / Recurring list",
    chips: [{ label: "Person name" }, { label: "Contact" }, { label: "Opt out" }],
  },
];

const EMPLOYEE: Cluster[] = [
  {
    heading: "Registration",
    chips: [
      { label: "Name" },
      { label: "Phone number" },
      { label: "Number on ID" },
      { label: "Languages" },
    ],
  },
  {
    heading: "Access to job listing",
    chips: [
      { label: "Employer name" },
      { label: "Type of work" },
      { label: "Duration" },
      { label: "Location" },
      { label: "Pay scale" },
    ],
  },
  {
    heading: "Apply for a job",
    chips: [{ label: "Employer name" }, { label: "Location of work" }],
  },
  {
    heading: "On the job",
    chips: [
      { label: "Starts working" },
      { label: "Duration of work" },
      { label: "Option to report" },
      { label: "Gets paid", tail: "Notification" },
    ],
  },
  {
    heading: "Value-add services",
    highlight: true,
    chips: [
      { label: "Financial literacy", sub: ["Schemes", "How to save", "Saving options"] },
      {
        label: "PHC / primary healthcare",
        sub: ["Connect with a doctor", "Choose location & language", "Wellbeing"],
      },
    ],
  },
  {
    heading: "Recurring",
    chips: [
      { label: "Recruiting job list" },
      { label: "Person name" },
      { label: "Remaining days" },
      { label: "Contact" },
      { label: "Opt out", tail: "opens a new job slot" },
    ],
  },
];

const SPINE: { label: string; kind: "maroon" | "gold" | "neutral" }[] = [
  { label: "Employer", kind: "maroon" },
  { label: "Database", kind: "gold" },
  { label: "Platform", kind: "neutral" },
  { label: "Employee", kind: "maroon" },
];

export default function InfoArchitecture({ p }: { p: RoziPalette }) {
  /* threshold 0 + bottom rootMargin: fires as the block meaningfully
     enters, independent of its height (it can exceed one viewport). */
  const { ref, inView } = useInView({ threshold: 0, rootMargin: "0px 0px -10% 0px" });

  /* translucent tint helpers derived from brand hexes */
  const goldFill = "color-mix(in srgb, var(--color-gold) 12%, transparent)";
  const goldFillSoft = "color-mix(in srgb, var(--color-gold) 7%, transparent)";
  const maroonFill = `color-mix(in srgb, ${p.ACC} 12%, transparent)`;
  const maroonBorder = `color-mix(in srgb, ${p.ACC} 34%, transparent)`;
  const goldBorder = "color-mix(in srgb, var(--color-gold) 34%, transparent)";

  const spineNodeStyle = (kind: "maroon" | "gold" | "neutral") => {
    if (kind === "maroon")
      return { bg: maroonFill, border: maroonBorder, ink: p.ACCT };
    if (kind === "gold")
      return { bg: goldFill, border: goldBorder, ink: p.GOLDT };
    return { bg: p.GND3, border: p.LINEW, ink: p.DIM };
  };

  const label: React.CSSProperties = {
    fontFamily: p.MONO,
    textTransform: "uppercase",
    letterSpacing: ".2em",
    fontSize: ".52rem",
  };

  return (
    <div
      ref={ref}
      className={`ia-rozi${inView ? " is-inview" : ""}`}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "clamp(1.4rem, 3.5vw, 2.4rem)",
      }}
    >
      <style>{`
        @keyframes ia-rozi-rise {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        /* Entrance choreography is gated on .is-inview (useInView) so it
           plays when the IA scrolls into the viewport, not at mount.
           The resting (pre-JS / no-JS) state stays fully visible. */
        .ia-rozi.is-inview .ia-rozi-panel { animation: ia-rozi-rise .5s ease both; }
        .ia-rozi.is-inview .ia-rozi-panel:nth-child(2) { animation-delay: .08s; }
        .ia-rozi-chip {
          transition: border-color .18s ease, transform .18s ease;
        }
        .ia-rozi-chip:hover { transform: translateY(-1px); }
        /* Reduced motion: panels appear instantly, fully visible. */
        @media (prefers-reduced-motion: reduce) {
          .ia-rozi.is-inview .ia-rozi-panel { animation: none; }
          .ia-rozi-chip { transition: none; }
          .ia-rozi-chip:hover { transform: none; }
        }
      `}</style>

      {/* ── SPINE ─────────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "clamp(.35rem, 1.5vw, .7rem)",
          padding: "clamp(.9rem, 2.5vw, 1.3rem)",
          background: p.GND2,
          border: `1px solid ${p.LINE}`,
          borderRadius: 20,
          boxShadow: p.SHADOW,
        }}
      >
        {SPINE.map((node, i) => {
          const s = spineNodeStyle(node.kind);
          return (
            <div
              key={node.label}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "clamp(.35rem, 1.5vw, .7rem)",
              }}
            >
              <div
                style={{
                  ...label,
                  color: s.ink,
                  background: s.bg,
                  border: `1px solid ${s.border}`,
                  borderRadius: 14,
                  padding: ".5rem clamp(.7rem, 2vw, 1.1rem)",
                  whiteSpace: "nowrap",
                }}
              >
                {node.label}
              </div>
              {i < SPINE.length - 1 && (
                <svg
                  width="22"
                  height="12"
                  viewBox="0 0 22 12"
                  aria-hidden="true"
                  style={{ display: "block", flexShrink: 0 }}
                >
                  <line
                    x1="0"
                    y1="6"
                    x2="16"
                    y2="6"
                    stroke={p.FAINT}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M15 2.5 L21 6 L15 9.5"
                    fill="none"
                    stroke={p.GOLD}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          );
        })}
      </div>

      {/* ── PANELS ────────────────────────────────────────────── */}
      <div
        className="mobile-stack"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(1rem, 2.5vw, 1.6rem)",
        }}
      >
        {([
          { side: "Employer", clusters: EMPLOYER } as Panel,
          { side: "Employee", clusters: EMPLOYEE } as Panel,
        ]).map((panel) => (
          <section
            key={panel.side}
            className="ia-rozi-panel"
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "clamp(.9rem, 2vw, 1.25rem)",
              padding: "clamp(1.1rem, 2.5vw, 1.6rem)",
              background: p.GND2,
              border: `1px solid ${p.LINE}`,
              borderRadius: 20,
              boxShadow: p.SHADOW,
            }}
          >
            {/* panel header */}
            <header
              style={{
                display: "flex",
                alignItems: "center",
                gap: ".7rem",
                paddingBottom: "clamp(.7rem, 2vw, 1rem)",
                borderBottom: `1px solid ${p.LINEW}`,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 9,
                  height: 9,
                  borderRadius: "50%",
                  background: p.ACC,
                  boxShadow: `0 0 0 4px ${maroonFill}`,
                  flexShrink: 0,
                }}
              />
              <h3
                style={{
                  margin: 0,
                  fontFamily: p.SERIF,
                  fontWeight: 400,
                  letterSpacing: "-.02em",
                  fontSize: "clamp(1.15rem, 3vw, 1.5rem)",
                  color: p.PAP,
                }}
              >
                {panel.side}
              </h3>
              <span
                style={{
                  ...label,
                  color: p.FAINT,
                  marginLeft: "auto",
                }}
              >
                {panel.clusters.length} flows
              </span>
            </header>

            {/* clusters */}
            {panel.clusters.map((cluster) => (
              <div
                key={cluster.heading}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: ".55rem",
                  ...(cluster.highlight
                    ? {
                        padding: "clamp(.7rem, 2vw, .95rem)",
                        margin: "0 clamp(-.35rem, -1vw, -.55rem)",
                        background: goldFillSoft,
                        border: `1px solid ${goldBorder}`,
                        borderRadius: 16,
                      }
                    : null),
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: ".55rem",
                  }}
                >
                  <span
                    style={{
                      ...label,
                      color: p.GOLDT,
                      fontSize: ".55rem",
                      letterSpacing: ".18em",
                    }}
                  >
                    {cluster.heading}
                  </span>
                  {cluster.highlight && (
                    <span
                      style={{
                        ...label,
                        fontSize: ".46rem",
                        letterSpacing: ".16em",
                        color: p.GND,
                        background: p.GOLD,
                        borderRadius: 8,
                        padding: ".16rem .45rem",
                      }}
                    >
                      Value-add
                    </span>
                  )}
                  <span
                    aria-hidden="true"
                    style={{
                      flex: 1,
                      height: 1,
                      background: cluster.highlight ? goldBorder : p.LINEW,
                    }}
                  />
                </div>

                {/* chips */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: ".4rem",
                  }}
                >
                  {cluster.chips.map((chip) =>
                    chip.sub ? (
                      /* chip with nested sub-flow options */
                      <div
                        key={chip.label}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: ".35rem",
                          width: "100%",
                        }}
                      >
                        <span
                          className="ia-rozi-chip"
                          style={{
                            alignSelf: "flex-start",
                            fontSize: ".72rem",
                            fontWeight: 500,
                            color: p.GOLDT,
                            background: goldFill,
                            border: `1px solid ${goldBorder}`,
                            borderRadius: 14,
                            padding: ".32rem .7rem",
                          }}
                        >
                          {chip.label}
                        </span>
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: ".35rem",
                            paddingLeft: "clamp(.5rem, 2vw, .9rem)",
                            borderLeft: `1px solid ${goldBorder}`,
                            marginLeft: ".35rem",
                          }}
                        >
                          {chip.sub.map((s) => (
                            <span
                              key={s}
                              className="ia-rozi-chip"
                              style={{
                                fontSize: ".7rem",
                                color: p.DIM,
                                background: p.GND3,
                                border: `1px solid ${p.LINEW}`,
                                borderRadius: 12,
                                padding: ".28rem .62rem",
                              }}
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </div>
                    ) : (
                      /* standard field chip */
                      <span
                        key={chip.label}
                        className="ia-rozi-chip"
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: ".4rem",
                          fontSize: ".72rem",
                          color: p.DIM,
                          background: p.GND3,
                          border: `1px solid ${p.LINEW}`,
                          borderRadius: 14,
                          padding: ".3rem .7rem",
                        }}
                      >
                        {chip.label}
                        {chip.tail && (
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: ".28rem",
                              color: p.GOLDT,
                              fontFamily: p.MONO,
                              fontSize: ".58rem",
                              letterSpacing: ".04em",
                            }}
                          >
                            <svg
                              width="14"
                              height="9"
                              viewBox="0 0 14 9"
                              aria-hidden="true"
                              style={{ display: "block" }}
                            >
                              <line
                                x1="0"
                                y1="4.5"
                                x2="9"
                                y2="4.5"
                                stroke={p.FAINT}
                                strokeWidth="1"
                                strokeLinecap="round"
                              />
                              <path
                                d="M8 1.8 L13 4.5 L8 7.2"
                                fill="none"
                                stroke={p.GOLD}
                                strokeWidth="1"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                            {chip.tail}
                          </span>
                        )}
                      </span>
                    )
                  )}
                </div>
              </div>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
