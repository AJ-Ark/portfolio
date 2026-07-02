import type { RoziPalette } from "@/components/rozi/palette";

/* ═══════════════════════════════════════════════════════════════════
   Rozi — USER FLOW
   "How can they easily achieve the goal, given their limits?"

   Six primary steps, left→right, rendered as filled GOLD rounded nodes
   with mono labels. Branch nodes (neutral cards) hang beneath steps
   2, 4, 5 and 6. Desktop is a horizontal row; below 760px the whole
   diagram reflows into a vertical spine with indented branches so the
   page never scrolls sideways.
   ═══════════════════════════════════════════════════════════════════ */

type Branch = { label: string };
type Step = { n: string; label: string; branches: Branch[] };

const STEPS: Step[] = [
  { n: "01", label: "Worker looking for a job", branches: [] },
  {
    n: "02",
    label: "Accesses the information centre",
    branches: [
      { label: "Railway stations" },
      { label: "Bus stations" },
      { label: "Post office" },
    ],
  },
  { n: "03", label: "Looks for a job suitable for them", branches: [] },
  {
    n: "04",
    label: "Provides necessary documents",
    branches: [{ label: "An ID with their name on it" }],
  },
  {
    n: "05",
    label: "Signs up for the work",
    branches: [{ label: "Provided with the job details" }],
  },
  {
    n: "06",
    label: "Gets paid as per the agreed deal",
    branches: [{ label: "Reward-based payments" }],
  },
];

export default function UserFlow({ p }: { p: RoziPalette }) {
  // Dark warm ink for text on GOLD nodes. Gold is a mid/light fill in BOTH
  // themes, so the ink must stay dark regardless of theme — hence it is NOT
  // switched on p.dark. Derived from the brand gold (mixed toward black) so it
  // reads as intentional warm ink rather than a flat theme surface color.
  const goldInk = `color-mix(in srgb, ${p.GOLD} 20%, #000)`;

  /* shared node label typography */
  const nodeLabel = {
    fontFamily: p.MONO,
    fontSize: "clamp(.68rem, 1.1vw, .78rem)",
    lineHeight: 1.35,
    letterSpacing: ".01em",
    margin: 0,
  } as const;

  const stepIndex = {
    fontFamily: p.MONO,
    fontSize: ".5rem",
    letterSpacing: ".22em",
    textTransform: "uppercase" as const,
    marginBottom: ".55rem",
    display: "block",
  };

  const branchLabel = {
    ...nodeLabel,
    color: p.DIM,
    fontSize: "clamp(.62rem, 1vw, .72rem)",
  } as const;

  /* Down-chevron arrowhead, colored via p.FAINT / p.GOLD */
  const Chevron = ({ color }: { color: string }) => (
    <svg
      width="16"
      height="10"
      viewBox="0 0 16 10"
      style={{ display: "block" }}
      aria-hidden="true"
    >
      <path
        d="M2 2 L8 7.5 L14 2"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  /* Right-chevron arrowhead for the desktop horizontal connectors */
  const ChevronRight = ({ color }: { color: string }) => (
    <svg
      width="10"
      height="16"
      viewBox="0 0 10 16"
      style={{ display: "block" }}
      aria-hidden="true"
    >
      <path
        d="M2.5 2 L8 8 L2.5 14"
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  const primaryNode = (s: Step) => (
    <div
      className="rzuf-node"
      style={{
        background: p.GOLD,
        color: goldInk,
        borderRadius: "16px",
        padding: "1rem 1.1rem",
        boxShadow: p.SHADOW,
      }}
    >
      <span style={{ ...stepIndex, color: `color-mix(in srgb, ${goldInk} 62%, transparent)` }}>
        Step {s.n}
      </span>
      <p style={{ ...nodeLabel, fontWeight: 500 }}>{s.label}</p>
    </div>
  );

  const branchNode = (b: Branch) => (
    <div
      className="rzuf-branch"
      style={{
        background: p.GND2,
        border: "1px solid " + p.LINEW,
        borderRadius: "14px",
        padding: ".8rem .9rem",
      }}
    >
      <p style={branchLabel}>{b.label}</p>
    </div>
  );

  return (
    <div
      className="rzuf"
      style={{
        background: p.GND3,
        border: "1px solid " + p.LINE,
        borderRadius: "20px",
        padding: "clamp(1.6rem, 3.5vw, 3rem)",
      }}
    >
      <style>{`
        /* ── UserFlow (rzuf) scoped styles ── */
        .rzuf-row {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: clamp(.5rem, 1.4vw, 1rem);
          align-items: start;
        }
        .rzuf-col { display: flex; flex-direction: column; }
        /* connector track sits to the right of each primary node */
        .rzuf-hconn {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 2.75rem;
        }
        .rzuf-hline { flex: 1; height: 1.5px; }
        .rzuf-vconn {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: .55rem 0;
        }
        .rzuf-vline { width: 1.5px; height: 1.35rem; }
        .rzuf-node { animation: rzuf-rise .5s cubic-bezier(.2,.7,.3,1) both; }
        .rzuf-branch { animation: rzuf-rise .5s cubic-bezier(.2,.7,.3,1) both; }

        @keyframes rzuf-rise {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Mobile: reflow to a vertical spine ── */
        .rzuf-vwrap { display: none; }
        @media (max-width: 760px) {
          .rzuf-hwrap { display: none; }
          .rzuf-vwrap { display: block; }
        }

        .rzuf-vstep { display: flex; gap: .9rem; }
        .rzuf-spine {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 0 0 auto;
          width: 1.5rem;
          padding-top: .35rem;
        }
        .rzuf-dot {
          width: 9px; height: 9px; border-radius: 50%;
          flex: 0 0 auto;
        }
        .rzuf-spine-line { width: 1.5px; flex: 1; min-height: 1rem; margin-top: .3rem; }
        .rzuf-vbody { flex: 1; min-width: 0; padding-bottom: 1.1rem; }
        .rzuf-vbranches {
          display: flex; flex-direction: column; gap: .55rem;
          margin-top: .7rem; padding-left: 1rem;
          border-left: 1.5px solid ${p.LINEW};
        }

        @media (prefers-reduced-motion: reduce) {
          .rzuf-node, .rzuf-branch { animation: none; }
        }
      `}</style>

      {/* ══════════ DESKTOP · horizontal ══════════ */}
      <div className="rzuf-hwrap" role="list" aria-label="Rozi user flow, six steps">
        <div className="rzuf-row">
          {STEPS.map((s, i) => (
            <div className="rzuf-col" key={s.n} role="listitem">
              {/* primary node + horizontal connector to the next step */}
              <div style={{ display: "flex", alignItems: "stretch" }}>
                <div style={{ flex: 1, minWidth: 0 }}>{primaryNode(s)}</div>
                {i < STEPS.length - 1 && (
                  <div className="rzuf-hconn" style={{ width: "clamp(.5rem,1.4vw,1rem)" }}>
                    <span
                      className="rzuf-hline"
                      style={{ background: p.FAINT }}
                    />
                    <span style={{ marginLeft: "-1px" }}>
                      <ChevronRight color={p.FAINT} />
                    </span>
                  </div>
                )}
              </div>

              {/* down-branches beneath this step */}
              {s.branches.map((b, bi) => (
                <div key={b.label}>
                  <div className="rzuf-vconn">
                    <span className="rzuf-vline" style={{ background: p.FAINT }} />
                    <Chevron color={bi === 0 ? p.GOLD : p.FAINT} />
                  </div>
                  {branchNode(b)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ══════════ MOBILE · vertical spine ══════════ */}
      <div className="rzuf-vwrap" role="list" aria-label="Rozi user flow, six steps">
        {STEPS.map((s, i) => (
          <div className="rzuf-vstep" key={s.n} role="listitem">
            <div className="rzuf-spine" aria-hidden="true">
              <span className="rzuf-dot" style={{ background: p.GOLD }} />
              {i < STEPS.length - 1 && (
                <span className="rzuf-spine-line" style={{ background: p.FAINT }} />
              )}
            </div>
            <div className="rzuf-vbody">
              {primaryNode(s)}
              {s.branches.length > 0 && (
                <div className="rzuf-vbranches">
                  {s.branches.map((b) => (
                    <div key={b.label}>{branchNode(b)}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
