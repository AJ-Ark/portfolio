"use client";

import { useEffect, useState } from "react";

/* ══════════════════════════════════════════════════════════════════
   REALM SECTION RAIL — the trmeric PhaseRail pattern (fixed left dock,
   scroll-spy, click-to-jump), flattened: Realm's five wayfinding
   sections don't nest under phases the way trmeric's deep-dive features
   do, so this is one level, not two.

   Replaces the standalone doc's always-on top nav (Problem · Pivot ·
   The app · Installation · Research). That bar duplicated the site's
   own header (logo, "Say hello") and read as a second, competing nav —
   the site's <Navigation/> now owns global chrome, and this rail owns
   only "where am I in this case study", exactly like trmeric's.
   ══════════════════════════════════════════════════════════════════ */

export interface RealmSection {
  id: string;
  label: string;
}

const ACC = "#d9b46a";
const ACC_BRIGHT = "#f1d8a3";
const INK = "#ece6d6";
const DIM = "rgba(236,230,214,.62)";
const FAINT = "rgba(236,230,214,.38)";
const LINE = "rgba(217,180,106,.22)";
const BASE = "#0a0f0a";

export default function RealmSectionRail({
  sections,
  watchId,
}: {
  sections: RealmSection[];
  watchId: string;
}) {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  /* The rail only makes sense while the story itself is on screen — not
     over the hero (nothing to track yet) and not once the footer takes
     over (the tour is over). */
  useEffect(() => {
    const region = document.getElementById(watchId);
    if (!region) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "-15% 0px -15% 0px", threshold: 0 }
    );
    io.observe(region);
    return () => io.disconnect();
  }, [watchId]);

  useEffect(() => {
    const els = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => el !== null);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [sections]);

  const activeIndex = sections.findIndex((s) => s.id === active);

  const jump = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <style>{`
        .rlm-rail { display: none; }
        @media (min-width: 1100px) { .rlm-rail { display: block; } }
        .rlm-mobile-dock { display: block; }
        @media (min-width: 1100px) { .rlm-mobile-dock { display: none; } }
      `}</style>

      <nav
        className="rlm-rail"
        aria-label="Realm of Elementals section navigation"
        style={{
          position: "fixed",
          left: "1.1rem",
          top: "50%",
          transform: `translateY(-50%) translateX(${visible ? 0 : -12}px)`,
          zIndex: 50,
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? "auto" : "none",
          transition: "opacity .45s ease, transform .45s ease",
        }}
      >
        <div
          style={{
            padding: ".9rem .95rem",
            borderRadius: 12,
            border: `1px solid ${LINE}`,
            background: `color-mix(in srgb, ${BASE} 86%, transparent)`,
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            style={{
              fontFamily: "'JetBrains Mono','Fira Code',monospace",
              fontSize: ".45rem",
              letterSpacing: ".2em",
              textTransform: "uppercase",
              color: FAINT,
              marginBottom: ".65rem",
            }}
          >
            The tour
          </div>
          {/* A single connecting hairline runs the full stack, like the
              trmeric rail's per-phase dot but continuous — Realm's five
              stops are one line, not four grouped clusters. */}
          <div style={{ position: "relative", paddingLeft: "1.05rem" }}>
            <div
              aria-hidden
              style={{
                position: "absolute",
                left: 3,
                top: 5,
                bottom: 5,
                width: 1,
                background: LINE,
              }}
            />
            {sections.map((s, i) => {
              const on = active === s.id;
              const passed = activeIndex >= 0 && i < activeIndex;
              return (
                <button
                  key={s.id}
                  onClick={() => jump(s.id)}
                  style={{
                    position: "relative",
                    display: "block",
                    width: "100%",
                    background: "transparent",
                    border: "none",
                    padding: ".38rem 0",
                    cursor: "pointer",
                    textAlign: "left",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      left: "-1.05rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: 7,
                      height: 7,
                      borderRadius: "50%",
                      background: on ? ACC_BRIGHT : passed ? ACC : LINE,
                      boxShadow: on ? `0 0 8px ${ACC_BRIGHT}` : "none",
                      transition: "background .3s ease, box-shadow .3s ease",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono','Fira Code',monospace",
                      fontSize: ".62rem",
                      letterSpacing: ".1em",
                      textTransform: "uppercase",
                      color: on ? INK : DIM,
                      opacity: on ? 1 : 0.75,
                      transition: "color .3s ease, opacity .3s ease",
                    }}
                  >
                    {s.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Mobile/tablet progress dock — same role as trmeric's: the rail is
          display:none below 1100px, so narrow viewports need a slim sticky
          bottom bar instead: current section, prev/next, a hairline fill. */}
      <div
        className="rlm-mobile-dock"
        aria-hidden={!visible}
        style={{
          position: "fixed",
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 49,
          transform: `translateY(${visible ? "0" : "100%"})`,
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? "auto" : "none",
          transition: "opacity .35s ease, transform .35s ease",
        }}
      >
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "stretch",
            borderTop: `1px solid ${LINE}`,
            background: `color-mix(in srgb, ${BASE} 92%, transparent)`,
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            aria-hidden
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              height: 2,
              width: `${Math.round(((activeIndex + 1) / sections.length) * 100)}%`,
              background: ACC,
              transition: "width .3s ease",
            }}
          />
          <button
            onClick={() => activeIndex > 0 && jump(sections[activeIndex - 1].id)}
            aria-label="Previous section"
            disabled={activeIndex <= 0}
            style={{
              flex: "0 0 auto",
              width: "2.6rem",
              background: "transparent",
              border: "none",
              borderRight: `1px solid ${LINE}`,
              color: activeIndex <= 0 ? FAINT : DIM,
              fontSize: "1rem",
              cursor: activeIndex <= 0 ? "default" : "pointer",
            }}
          >
            ‹
          </button>
          <div
            role="status"
            style={{
              flex: 1,
              minWidth: 0,
              padding: ".55rem .8rem",
              display: "flex",
              flexDirection: "column",
              gap: "1px",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: "'JetBrains Mono','Fira Code',monospace",
                fontSize: ".48rem",
                letterSpacing: ".14em",
                textTransform: "uppercase",
                color: ACC_BRIGHT,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {activeIndex >= 0 ? `${activeIndex + 1}/${sections.length}` : "The tour"}
            </span>
            <span
              style={{
                fontFamily: "'Fraunces',Georgia,serif",
                fontStyle: "italic",
                fontSize: ".8rem",
                color: INK,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {activeIndex >= 0 ? sections[activeIndex].label : "Scroll to begin"}
            </span>
          </div>
          <button
            onClick={() => activeIndex < sections.length - 1 && jump(sections[activeIndex + 1].id)}
            aria-label="Next section"
            disabled={activeIndex < 0 || activeIndex >= sections.length - 1}
            style={{
              flex: "0 0 auto",
              width: "2.6rem",
              background: "transparent",
              border: "none",
              borderLeft: `1px solid ${LINE}`,
              color: activeIndex >= sections.length - 1 ? FAINT : DIM,
              fontSize: "1rem",
              cursor: activeIndex >= sections.length - 1 ? "default" : "pointer",
            }}
          >
            ›
          </button>
        </div>
      </div>
    </>
  );
}
