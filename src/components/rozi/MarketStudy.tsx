"use client";

import { useInView } from "@/hooks/useInView";
import type { RoziPalette } from "@/components/rozi/palette";

/* ═══════════════════════════════════════════════════════════════════
   MarketStudy — "What are our competitors doing?"
   LEFT : soft-rounded PAIN POINTS panel, each pain flagged with a
          small gold "!" speech-bubble marker.
   RIGHT: compact competitor rows — monogram tile + name + one-liner.
   Two columns; collapses to one on mobile via `mobile-stack`.
   ═══════════════════════════════════════════════════════════════════ */

const PAINS = [
  "Middle man",
  "Language barrier",
  "Work-only spaces",
  "Lack of sustainable income",
  "Most apps assume touch-screen devices",
] as const;

type Competitor = { name: string; note: string; tone: "gold" | "maroon" };

const COMPETITORS: readonly Competitor[] = [
  { name: "apna", note: "50,000+ openings; connects workers to companies in metros", tone: "gold" },
  { name: "Rojgaar (My Rojgaar)", note: "finds unskilled & semi-skilled labour near you", tone: "maroon" },
  { name: "Labouradda", note: "“Karlo Labour, Phone Pe” — connect to the nearest mandi", tone: "gold" },
  { name: "Jobsgaar", note: "location-first job search for blue-collar roles", tone: "maroon" },
  { name: "Vahan", note: "AI matching of job-seekers & employers inside messaging apps", tone: "gold" },
];

export default function MarketStudy({ p }: { p: RoziPalette }) {
  /* threshold 0 + bottom rootMargin: fires as the block meaningfully
     enters, independent of its height (it can exceed one viewport). */
  const { ref, inView } = useInView({ threshold: 0, rootMargin: "0px 0px -10% 0px" });
  const goldTint = "color-mix(in srgb, var(--color-gold, #E0920A) 14%, transparent)";
  const maroonTint = "color-mix(in srgb, var(--color-maroon, #C94030) 13%, transparent)";

  const kicker = {
    fontFamily: p.MONO,
    textTransform: "uppercase" as const,
    letterSpacing: ".2em",
    fontSize: ".52rem",
    color: p.DIM,
  };

  return (
    <div ref={ref} className={`marketstudy${inView ? " is-inview" : ""}`}>
      <style>{`
        @keyframes marketstudy-rise {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        /* Entrance choreography is gated on .is-inview (useInView) so it
           plays when the rows scroll into the viewport, not at mount.
           The resting (pre-JS / no-JS) state stays fully visible. */
        .marketstudy.is-inview .marketstudy-row {
          animation: marketstudy-rise .5s cubic-bezier(.22,.61,.36,1) both;
        }
        .marketstudy.is-inview .marketstudy-row:nth-child(1) { animation-delay: .04s; }
        .marketstudy.is-inview .marketstudy-row:nth-child(2) { animation-delay: .10s; }
        .marketstudy.is-inview .marketstudy-row:nth-child(3) { animation-delay: .16s; }
        .marketstudy.is-inview .marketstudy-row:nth-child(4) { animation-delay: .22s; }
        .marketstudy.is-inview .marketstudy-row:nth-child(5) { animation-delay: .28s; }
        /* Reduced motion: rows appear instantly, fully visible. */
        @media (prefers-reduced-motion: reduce) {
          .marketstudy.is-inview .marketstudy-row { animation: none; }
        }
      `}</style>

      <div
        className="mobile-stack"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 5fr) minmax(0, 7fr)",
          gap: "clamp(1rem, 3vw, 1.75rem)",
          alignItems: "start",
        }}
      >
        {/* ── LEFT · PAIN POINTS ─────────────────────────────────── */}
        <div
          style={{
            background: p.GND2,
            border: `1px solid ${p.LINE}`,
            borderRadius: 20,
            padding: "clamp(1.15rem, 3vw, 1.6rem)",
            boxShadow: p.SHADOW,
          }}
        >
          <div style={{ ...kicker, marginBottom: ".4rem" }}>The gaps we found</div>
          <h3
            style={{
              margin: "0 0 clamp(.9rem, 2.4vw, 1.25rem)",
              fontFamily: p.SERIF,
              fontWeight: 400,
              letterSpacing: "-.02em",
              lineHeight: 1.02,
              fontSize: "clamp(1.5rem, 5.5vw, 2.1rem)",
              color: p.PAP,
            }}
          >
            Pain points
          </h3>

          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: ".7rem" }}>
            {PAINS.map((pain) => (
              <li
                key={pain}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: ".7rem",
                  background: p.GND,
                  border: `1px solid ${p.LINEW}`,
                  borderRadius: 14,
                  padding: ".62rem .8rem",
                }}
              >
                {/* gold "!" speech-bubble marker */}
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                  style={{ flex: "0 0 auto", marginTop: ".05rem" }}
                >
                  <path
                    d="M4 4h16a1.5 1.5 0 0 1 1.5 1.5v10A1.5 1.5 0 0 1 20 17h-8.2L7.4 20.6A.6.6 0 0 1 6.4 20.1V17H4a1.5 1.5 0 0 1-1.5-1.5v-10A1.5 1.5 0 0 1 4 4Z"
                    fill={p.GOLD}
                  />
                  <path
                    d="M12 6.6v5.1"
                    stroke={p.GND2}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <circle cx="12" cy="14.1" r="1.15" fill={p.GND2} />
                </svg>
                <span style={{ color: p.PAP, lineHeight: 1.4, fontSize: ".92rem" }}>{pain}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* ── RIGHT · COMPETITORS ────────────────────────────────── */}
        <div>
          <div style={{ ...kicker, marginBottom: "clamp(.7rem, 2vw, 1rem)" }}>
            Competitors reviewed
          </div>

          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: ".55rem" }}>
            {COMPETITORS.map((c) => {
              const isGold = c.tone === "gold";
              return (
                <li
                  key={c.name}
                  className="marketstudy-row"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "clamp(.7rem, 2vw, 1rem)",
                    background: p.GND2,
                    border: `1px solid ${p.LINEW}`,
                    borderRadius: 16,
                    padding: ".7rem .85rem",
                  }}
                >
                  {/* monogram tile */}
                  <div
                    aria-hidden="true"
                    style={{
                      flex: "0 0 auto",
                      width: 40,
                      height: 40,
                      display: "grid",
                      placeItems: "center",
                      borderRadius: 12,
                      background: isGold ? goldTint : maroonTint,
                      border: `1px solid ${isGold ? p.LINEW : p.LINE}`,
                      fontFamily: p.SERIF,
                      fontWeight: 400,
                      fontSize: "1.25rem",
                      lineHeight: 1,
                      color: isGold ? p.GOLDT : p.ACCT,
                    }}
                  >
                    {c.name.charAt(0).toUpperCase()}
                  </div>

                  {/* name + one-liner */}
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        fontFamily: p.SERIF,
                        fontWeight: 400,
                        letterSpacing: "-.01em",
                        fontSize: "1.02rem",
                        color: p.PAP,
                        lineHeight: 1.2,
                      }}
                    >
                      {c.name}
                    </div>
                    <div
                      style={{
                        color: p.DIM,
                        fontSize: ".82rem",
                        lineHeight: 1.45,
                        marginTop: ".12rem",
                      }}
                    >
                      {c.note}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
