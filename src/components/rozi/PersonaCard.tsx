"use client";

import { useEffect, useRef } from "react";
import type { RoziPalette } from "@/components/rozi/palette";
import { prefersReducedMotionNow } from "@/hooks/usePrefersReducedMotion";

/* ═══════════════════════════════════════════════════════════════════
   Rozi — User persona card for "Mashidur Shaik".
   Mostly presentational — HTML/flex medium with an inline-SVG avatar
   glyph. The one piece of behavior is TechBarItem below: the "Comfort with
   technology" bars grow from 0 on scroll-into-view instead of already
   sitting at their final width.
   ═══════════════════════════════════════════════════════════════════ */

type MetaRow = { k: string; v: string };
type TechBar = { label: string; pct: number };
type Trait = { label: string; tone: "acc" | "gold"; items: string[] };

const META: MetaRow[] = [
  { k: "Age", v: "26" },
  { k: "Residence", v: "Murshidabad, Kolkata" },
  { k: "Education", v: "Primary School" },
  { k: "Occupation", v: "Construction Worker" },
  { k: "Marital status", v: "Married, with 2 children" },
];

const TECH: TechBar[] = [
  { label: "Internet", pct: 24 },
  { label: "Software", pct: 22 },
  { label: "Mobile Apps", pct: 46 },
  { label: "Social Network", pct: 28 },
];

const TRAITS: Trait[] = [
  {
    label: "Criteria for success",
    tone: "acc",
    items: ["Finding a job without having to go around asking for work."],
  },
  {
    label: "Needs",
    tone: "gold",
    items: ["A consistent source of income", "Reliability in work", "Healthcare"],
  },
  {
    label: "Wants",
    tone: "acc",
    items: ["Saving for the future", "Private living space"],
  },
  {
    label: "Values",
    tone: "gold",
    items: ["Providing for family"],
  },
  {
    label: "Fears",
    tone: "acc",
    items: ["Losing a job overnight"],
  },
];

/* ── Tech-adoption bar — grows from 0 on scroll-into-view ────────────
   SSR/no-JS-safe: the server (and the very first client render) ships
   the bar at its real final width, so no-JS readers and crawlers get
   the correct value. Mirrors Reveal.tsx's own fold-check: only a bar
   that's actually BELOW the fold when it mounts gets reset to 0% and
   animated back up — content already on screen never flashes empty.
   Direct DOM style mutation (no React state) keeps the animation off
   the render path entirely; reduced motion skips the reset outright,
   so the final width is what's on screen the whole time. */
function TechBarItem({ p, label, pct }: { p: RoziPalette; label: string; pct: number }) {
  const fillRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = fillRef.current;
    if (!el || prefersReducedMotionNow()) return;

    const fold = window.innerHeight * 0.9;
    if (el.getBoundingClientRect().top < fold) return; // already visible — keep final width

    el.style.width = "0%";

    if (typeof IntersectionObserver === "undefined") {
      el.style.width = `${pct}%`;
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        requestAnimationFrame(() => {
          el.style.width = `${pct}%`;
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [pct]);

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: 6,
        }}
      >
        <span style={{ fontSize: ".8rem", color: p.PAP }}>{label}</span>
        <span
          style={{
            fontFamily: p.MONO,
            fontSize: ".72rem",
            color: p.GOLDT,
            letterSpacing: ".04em",
          }}
        >
          {pct}%
        </span>
      </div>
      <div
        role="presentation"
        style={{
          height: 7,
          borderRadius: 999,
          background: p.LINEW,
          overflow: "hidden",
        }}
      >
        <div
          ref={fillRef}
          style={{
            height: "100%",
            width: `${pct}%`,
            borderRadius: 999,
            background: p.GOLD,
            transition: "width 1000ms cubic-bezier(.16,1,.3,1)",
          }}
        />
      </div>
    </div>
  );
}

export default function PersonaCard({ p }: { p: RoziPalette }) {
  const kicker: React.CSSProperties = {
    fontFamily: p.MONO,
    textTransform: "uppercase",
    letterSpacing: ".2em",
    fontSize: ".52rem",
    lineHeight: 1,
  };

  const maroonTint = "color-mix(in srgb, var(--color-maroon, #C94030) 12%, transparent)";

  return (
    <div
      style={{
        background: p.GND2,
        border: `1px solid ${p.LINE}`,
        borderRadius: 20,
        boxShadow: p.SHADOW,
        overflow: "hidden",
        color: p.PAP,
        // expose brand hexes for color-mix fills (no theme dependence)
        ["--color-maroon" as string]: p.ACC,
        ["--color-gold" as string]: p.GOLD,
      }}
    >
      {/* ── (a) HEADER BAND ─────────────────────────────────────────── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "clamp(14px, 3vw, 22px)",
          padding: "clamp(18px, 3.5vw, 26px)",
          background: `linear-gradient(180deg, ${maroonTint}, transparent)`,
          borderBottom: `1px solid ${p.LINE}`,
        }}
      >
        {/* abstract avatar */}
        <div
          aria-hidden="true"
          style={{
            flex: "0 0 auto",
            width: "clamp(56px, 12vw, 76px)",
            height: "clamp(56px, 12vw, 76px)",
            borderRadius: 18,
            background: p.GND3,
            border: `1px solid ${p.LINEW}`,
            display: "grid",
            placeItems: "center",
          }}
        >
          <svg
            viewBox="0 0 24 24"
            style={{ width: "58%", height: "58%", display: "block" }}
            fill="none"
            role="presentation"
          >
            <circle cx="12" cy="8" r="4" fill={p.GOLD} />
            <path
              d="M4 20.5c0-4.4 3.6-7 8-7s8 2.6 8 7"
              fill={p.GOLD}
              opacity="0.92"
            />
          </svg>
        </div>

        <div style={{ minWidth: 0 }}>
          <div style={{ ...kicker, color: p.ACCT, marginBottom: 8 }}>Persona</div>
          <h3
            style={{
              margin: 0,
              fontFamily: p.SERIF,
              fontWeight: 400,
              letterSpacing: "-.02em",
              fontSize: "clamp(1.35rem, 4vw, 1.9rem)",
              lineHeight: 1.05,
            }}
          >
            Mashidur Shaik
          </h3>

          {/* meta rows */}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px 14px",
              marginTop: 12,
            }}
          >
            {META.map((m) => (
              <span
                key={m.k}
                style={{
                  display: "inline-flex",
                  alignItems: "baseline",
                  gap: 6,
                  fontSize: ".78rem",
                }}
              >
                <span
                  style={{
                    fontFamily: p.MONO,
                    textTransform: "uppercase",
                    letterSpacing: ".12em",
                    fontSize: ".5rem",
                    color: p.FAINT,
                  }}
                >
                  {m.k}
                </span>
                <span style={{ color: p.DIM }}>{m.v}</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ── (b) VERBATIM QUOTE BAND ─────────────────────────────────── */}
      <div
        style={{
          padding: "clamp(18px, 3.5vw, 26px)",
          background: p.GND3,
          borderBottom: `1px solid ${p.LINEW}`,
          display: "flex",
          gap: "clamp(10px, 2.5vw, 16px)",
          alignItems: "flex-start",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            fontFamily: p.SERIF,
            fontSize: "2.6rem",
            lineHeight: 0.7,
            color: p.GOLD,
            flex: "0 0 auto",
          }}
        >
          &ldquo;
        </span>
        <p
          style={{
            margin: 0,
            fontFamily: p.SERIF,
            fontStyle: "italic",
            fontWeight: 400,
            letterSpacing: "-.01em",
            fontSize: "clamp(1.1rem, 3.4vw, 1.5rem)",
            lineHeight: 1.25,
            color: p.PAP,
          }}
        >
          Hame toh adjust karna padta hai&hellip;
        </p>
      </div>

      {/* ── BODY: bio + tech ─────────────────────────────────────────── */}
      <div style={{ padding: "clamp(18px, 3.5vw, 28px)" }}>
        <div
          className="mobile-stack"
          style={{
            display: "grid",
            gridTemplateColumns: "1.35fr 1fr",
            gap: "clamp(20px, 4vw, 34px)",
            alignItems: "start",
          }}
        >
          {/* (c) BIO */}
          <div>
            <div style={{ ...kicker, color: p.GOLDT, marginBottom: 12 }}>Background</div>
            <p style={{ margin: 0, color: p.DIM, lineHeight: 1.65, fontSize: ".92rem" }}>
              Mashidur is a migrant worker from Kolkata working daily-wage jobs
              in Kerala. He doesn&rsquo;t know the local language well and often
              finds the barrier used to fool him. He gets work through a
              middle-man or unofficial migrant networks &mdash; neither a
              reliable income source. He earns around{" "}
              <strong style={{ color: p.PAP, fontWeight: 600 }}>&#8377;800 a day</strong>{" "}
              and occasionally saves{" "}
              <strong style={{ color: p.PAP, fontWeight: 600 }}>
                &#8377;4,000&ndash;5,000 a month
              </strong>{" "}
              to send home.
            </p>
            <p
              style={{
                margin: "0.9em 0 0",
                color: p.DIM,
                lineHeight: 1.65,
                fontSize: ".92rem",
              }}
            >
              He worries about the lack of healthcare for migrants (skin
              diseases from unhygienic housing are common) and about depending
              entirely on local contractors who make him easily replaceable.
              Notably, he and his peers are quite comfortable with technology
              &mdash; Bluetooth, mobile features, even online games &mdash; most
              of it self-taught through experience.
            </p>
          </div>

          {/* (d) COMFORT WITH TECHNOLOGY */}
          <div>
            <div style={{ ...kicker, color: p.GOLDT, marginBottom: 16 }}>
              Comfort with technology
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {TECH.map((t) => (
                <TechBarItem key={t.label} p={p} label={t.label} pct={t.pct} />
              ))}
            </div>
          </div>
        </div>

        {/* ── (e) TRAIT BLOCKS ───────────────────────────────────────── */}
        <div
          className="mobile-stack"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "clamp(10px, 2vw, 14px)",
            marginTop: "clamp(22px, 4vw, 32px)",
          }}
        >
          {TRAITS.map((tr) => {
            const toneT = tr.tone === "acc" ? p.ACCT : p.GOLDT;
            const toneBar = tr.tone === "acc" ? p.ACC : p.GOLD;
            const chipBg =
              tr.tone === "acc"
                ? "color-mix(in srgb, var(--color-maroon) 9%, transparent)"
                : "color-mix(in srgb, var(--color-gold) 12%, transparent)";
            return (
              <div
                key={tr.label}
                style={{
                  background: p.GND2,
                  border: `1px solid ${p.LINEW}`,
                  borderRadius: 16,
                  padding: "14px 15px 15px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 11,
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: 3,
                      height: 12,
                      borderRadius: 2,
                      background: toneBar,
                      flex: "0 0 auto",
                    }}
                  />
                  <span
                    style={{
                      fontFamily: p.MONO,
                      textTransform: "uppercase",
                      letterSpacing: ".18em",
                      fontSize: ".5rem",
                      color: toneT,
                    }}
                  >
                    {tr.label}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 6,
                  }}
                >
                  {tr.items.map((it, i) => (
                    <span
                      key={i}
                      style={{
                        display: "inline-block",
                        background: chipBg,
                        border: `1px solid ${p.LINEW}`,
                        borderRadius: 10,
                        padding: "5px 10px",
                        fontSize: ".78rem",
                        lineHeight: 1.4,
                        color: p.DIM,
                      }}
                    >
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
