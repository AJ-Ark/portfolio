"use client";

import { useEffect, useState } from "react";
import type { TrmColors } from "./PrototypeFrame";

/* Fixed lifecycle rail, visible only while the deep-dive section is on
   screen (≥1280px viewports). The lifecycle is the spine of the page —
   this makes it literal: A→D phases with the five features nested,
   active one highlighted as you scroll, all clickable. */

export interface RailFeature {
  id: string;
  num: string;
  title: string;
  phase: string; // letter A–D
}

interface PhaseRailProps {
  features: RailFeature[];
  phases: { letter: string; label: string }[];
  watchId: string;
  colors: TrmColors;
}

export default function PhaseRail({ features, phases, watchId, colors: c }: PhaseRailProps) {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const section = document.getElementById(watchId);
    if (!section) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: "-25% 0px -25% 0px", threshold: 0 }
    );
    io.observe(section);
    return () => io.disconnect();
  }, [watchId]);

  useEffect(() => {
    const els = features
      .map((f) => document.getElementById(f.id))
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
  }, [features]);

  const activePhase = features.find((f) => f.id === active)?.phase;

  const jump = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <style>{`
        .trm-rail { display: none; }
        @media (min-width: 1280px) { .trm-rail { display: block; } }
      `}</style>
      <nav
        className="trm-rail"
        aria-label="Deep-dive navigation by lifecycle phase"
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
            padding: "1rem .9rem",
            borderRadius: 12,
            border: `1px solid ${c.line}`,
            background: `color-mix(in srgb, ${c.base} 88%, transparent)`,
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: ".45rem",
              letterSpacing: ".2em",
              textTransform: "uppercase",
              color: c.faint,
              marginBottom: ".7rem",
            }}
          >
            Lifecycle
          </div>
          {phases.map(({ letter, label }) => {
            const kids = features.filter((f) => f.phase === letter);
            const phaseOn = activePhase === letter;
            return (
              <div key={letter} style={{ marginBottom: ".55rem" }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: ".45rem",
                    fontFamily: "var(--font-mono)",
                    fontSize: ".52rem",
                    letterSpacing: ".14em",
                    textTransform: "uppercase",
                    color: phaseOn ? c.accd : c.faint,
                    transition: "color .3s ease",
                  }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: "50%",
                      background: phaseOn ? c.acc : c.line,
                      transition: "background .3s ease",
                      flexShrink: 0,
                    }}
                  />
                  {letter} · {label}
                </div>
                {kids.map((f) => {
                  const on = active === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => jump(f.id)}
                      style={{
                        display: "block",
                        background: "transparent",
                        border: "none",
                        padding: ".22rem 0 .22rem 1.05rem",
                        cursor: "pointer",
                        fontFamily: "var(--font-mono)",
                        fontSize: ".55rem",
                        letterSpacing: ".08em",
                        color: on ? c.ink : c.dim,
                        opacity: on ? 1 : 0.65,
                        transition: "color .3s ease, opacity .3s ease",
                        textAlign: "left",
                        whiteSpace: "nowrap",
                      }}
                    >
                      <span style={{ color: on ? c.accd : c.faint }}>{f.num}</span>{" "}
                      {f.title}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </nav>
    </>
  );
}
