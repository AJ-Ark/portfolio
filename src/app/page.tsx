"use client";

import Link from "next/link";
import { useRef } from "react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import CursorGlow from "@/components/ui/CursorGlow";
import Preloader from "@/components/ui/Preloader";
import { projects } from "@/data/projects";
import { useParticle } from "@/lib/particleContext";
import type { Domain } from "@/data/projects";

const DOMAINS: {
  slug: Domain;
  headline: string;
  body: string;
  label: string;
  accent: string;
}[] = [
  {
    slug: "realm",
    headline: "Realm of Elementals",
    body: "A WebAR butterfly-raising experience. Care, not confrontation, is what changes behaviour.",
    label: "WebAR · Tata Motors · Graduation thesis",
    accent: "#d9b46a",
  },
  {
    slug: "rippl",
    headline: "Rippl",
    body: "A projector-lamp that fixes distracted reading and turns notetaking into a two-way interaction.",
    label: "Interaction Design · Physical Computing",
    accent: "#4FA8A0",
  },
  {
    slug: "trmeric",
    headline: "Trmeric",
    body: "23 surfaces. One AI-native enterprise platform. Designed and built as sole designer on the founding team.",
    label: "Enterprise SaaS · AI Design · Founding Team",
    accent: "#FFA426",
  },
];

function DomainPanel({
  slug, headline, body, label, accent,
}: (typeof DOMAINS)[number]) {
  const { setPreviewDomain } = useParticle();
  const ref = useRef<HTMLAnchorElement>(null);

  return (
    <Link
      ref={ref}
      href={`/work/${slug}`}
      onMouseEnter={() => setPreviewDomain(slug)}
      onMouseLeave={() => setPreviewDomain(null)}
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "2.5rem 2rem 2.5rem",
        borderRight: "1px solid var(--line)",
        position: "relative",
        overflow: "hidden",
        minHeight: "100%",
        transition: "background 0.5s cubic-bezier(.22,1,.36,1), border-color 0.5s cubic-bezier(.22,1,.36,1)",
        cursor: "none",
        "--panel-accent": accent,
      } as React.CSSProperties}
      className="domain-panel group"
    >
      {/* Corner accent — top left */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: "1.5rem",
          left: "1.5rem",
          width: 18,
          height: 18,
          borderTop: `1px solid ${accent}`,
          borderLeft: `1px solid ${accent}`,
          opacity: 0.5,
          transition: "opacity 0.4s ease, width 0.4s ease, height 0.4s ease",
        }}
        className="panel-corner"
      />
      {/* Corner accent — bottom right */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "1.5rem",
          right: "1.5rem",
          width: 18,
          height: 18,
          borderBottom: `1px solid ${accent}`,
          borderRight: `1px solid ${accent}`,
          opacity: 0.5,
        }}
      />

      {/* Top: domain name */}
      <div>
        <div aria-hidden="true" style={{ height: "3rem" }} />

        {/* Domain name — oversized */}
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "clamp(2rem, 4.5vw, 4rem)",
            lineHeight: 1.0,
            letterSpacing: "-.02em",
            color: "var(--color-paper)",
            marginBottom: "1.4rem",
          }}
        >
          {headline}
        </h2>

        <p
          className="panel-body-text"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: ".875rem",
            color: "var(--color-graphite-light)",
            lineHeight: 1.65,
            maxWidth: "26ch",
            transition: "color 0.4s ease",
          }}
        >
          {body}
        </p>
      </div>

      {/* Bottom: label + CTA */}
      <div>
        <div
          className="panel-divider"
          style={{
            height: "1px",
            background: "var(--line)",
            marginBottom: "1.2rem",
            transition: "background 0.4s ease",
          }}
        />
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: ".52rem",
            letterSpacing: ".18em",
            textTransform: "uppercase",
            color: "var(--color-graphite-light)",
            display: "block",
            marginBottom: ".8rem",
            opacity: 0.6,
          }}
        >
          {label}
        </span>
        <span
          className="panel-enter"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: ".62rem",
            letterSpacing: ".16em",
            textTransform: "uppercase",
            color: accent,
            opacity: 0.8,
            transition: "opacity 0.3s ease, transform 0.3s cubic-bezier(.22,1,.36,1)",
            display: "inline-block",
          }}
        >
          Enter →
        </span>
      </div>

      {/* Hover fill — full-panel wash, not just a faint bottom glow */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: `linear-gradient(180deg, ${accent}1f 0%, ${accent}0c 40%, transparent 75%)`,
          opacity: 0,
          transition: "opacity 0.45s cubic-bezier(.22,1,.36,1)",
          pointerEvents: "none",
        }}
        className="panel-glow"
      />
    </Link>
  );
}

export default function Home() {
  return (
    <>
      <Preloader />
      <CursorGlow />
      <Navigation />

      <main id="main-content" style={{ cursor: "none" }}>

        {/* ═══════════════════════════════════════════════
            HERO — full viewport, massive type
        ═══════════════════════════════════════════════ */}
        <section
          style={{
            height: "100dvh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "0 var(--pad) 3.5rem",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Datum line — horizontal hairline across the mid-point */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              height: "1px",
              background: "var(--line)",
              opacity: 0.4,
            }}
          />

          {/* Vertical rule — right edge */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              right: "var(--pad)",
              width: "1px",
              background: "var(--line)",
              opacity: 0.25,
            }}
          />

          {/* The headline — oversized, architectural */}
          <div style={{ position: "relative", zIndex: 2 }}>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontWeight: 300,
                lineHeight: 0.94,
                letterSpacing: "-.025em",
                marginBottom: "2.5rem",
              }}
            >
              {/* Line 1 */}
              <span
                style={{
                  display: "block",
                  fontSize: "clamp(3.5rem, 10.5vw, 9.5rem)",
                  color: "var(--color-paper)",
                }}
              >
                Architect
              </span>
              {/* Line 2 — italic, shifted right for rhythm */}
              <span
                style={{
                  display: "block",
                  fontSize: "clamp(3.5rem, 10.5vw, 9.5rem)",
                  fontStyle: "italic",
                  color: "var(--color-accent)",
                  paddingLeft: "clamp(1.5rem, 6vw, 6rem)",
                }}
              >
                by practice.
              </span>
              {/* Line 3 — smaller, muted */}
              <span
                style={{
                  display: "block",
                  fontSize: "clamp(1.1rem, 2.8vw, 2.6rem)",
                  color: "var(--color-graphite-light)",
                  fontStyle: "normal",
                  marginTop: "1.5rem",
                  fontWeight: 300,
                  letterSpacing: "-.01em",
                }}
              >
                I build the thing to understand the thing.
              </span>
            </h1>

            {/* Meta strip */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "2rem",
                paddingTop: "1.5rem",
                borderTop: "1px solid var(--line)",
                flexWrap: "wrap",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: ".6rem",
                  letterSpacing: ".2em",
                  textTransform: "uppercase",
                  color: "var(--color-graphite-light)",
                  opacity: 0.6,
                }}
              >
                Product Designer & UX Researcher
              </span>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: ".6rem",
                  letterSpacing: ".2em",
                  textTransform: "uppercase",
                  color: "var(--color-graphite-light)",
                  opacity: 0.6,
                }}
              >
                M.Des New Media Design · NID Gandhinagar
              </span>
            </div>
          </div>

          {/* Scroll cue */}
          <div
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: "2rem",
              right: "var(--pad)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: ".5rem",
            }}
          >
            <div
              style={{
                width: "1px",
                height: "48px",
                background: "linear-gradient(to bottom, var(--color-accent), transparent)",
                opacity: 0.5,
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: ".45rem",
                letterSpacing: ".2em",
                textTransform: "uppercase",
                color: "var(--color-graphite-light)",
                writingMode: "vertical-rl",
                opacity: 0.4,
              }}
            >
              Scroll
            </span>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════
            DOMAINS — three full-height panels
        ═══════════════════════════════════════════════ */}
        <section
          className="mobile-stack domain-grid-section"
          style={{
            height: "100dvh",
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            borderTop: "1px solid var(--line)",
            position: "relative",
          }}
        >
          {DOMAINS.map((domain) => (
            <DomainPanel key={domain.slug} {...domain} />
          ))}
        </section>

        {/* ═══════════════════════════════════════════════
            ABOUT — three-column editorial strip
        ═══════════════════════════════════════════════ */}
        <section
          style={{
            padding: "5rem var(--pad)",
            borderTop: "1px solid var(--line)",
          }}
        >
          <div
            className="mobile-stack"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "3rem",
              maxWidth: "960px",
            }}
          >
            <div>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: ".56rem",
                  letterSpacing: ".22em",
                  textTransform: "uppercase",
                  color: "var(--color-accent)",
                  display: "block",
                  marginBottom: ".8rem",
                  opacity: 0.7,
                }}
              >
                Currently
              </span>
              <p
                style={{
                  fontSize: ".9rem",
                  color: "var(--color-graphite-light)",
                  lineHeight: 1.7,
                }}
              >
                Senior Product Designer at Trmeric.
                M.Des New Media Design, NID Gandhinagar (2026).
              </p>
            </div>

            <div>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: ".56rem",
                  letterSpacing: ".22em",
                  textTransform: "uppercase",
                  color: "var(--color-accent)",
                  display: "block",
                  marginBottom: ".8rem",
                  opacity: 0.7,
                }}
              >
                Background
              </span>
              <p
                style={{
                  fontSize: ".9rem",
                  color: "var(--color-graphite-light)",
                  lineHeight: 1.7,
                }}
              >
                B.Arch, SPA Vijayawada. Six years of
                architecture taught me to hold a system at full
                scale while still caring about the door handle.
              </p>
            </div>

            <div>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: ".56rem",
                  letterSpacing: ".22em",
                  textTransform: "uppercase",
                  color: "var(--color-accent)",
                  display: "block",
                  marginBottom: ".8rem",
                  opacity: 0.7,
                }}
              >
                Reach
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: ".6rem" }}>
                {[
                  { label: "aravindspav@gmail.com →", href: "mailto:aravindspav@gmail.com" },
                  { label: "LinkedIn →", href: "https://www.linkedin.com/in/aravind-j-5a6b8b136/" },
                ].map(({ label, href }) => (
                  <a
                    key={href}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: ".6rem",
                      letterSpacing: ".14em",
                      textTransform: "uppercase",
                      color: "var(--color-graphite-light)",
                    }}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />

      {/* Panel hover styles */}
      <style>{`
        .domain-panel { border-right-color: var(--line); }
        .domain-panel:hover { border-right-color: var(--panel-accent); }
        .domain-panel:hover .panel-glow { opacity: 1 !important; }
        .domain-panel:hover .panel-corner { opacity: 1 !important; width: 28px !important; height: 28px !important; }
        .domain-panel:hover .panel-divider { background: var(--panel-accent) !important; opacity: 0.6; }
        .domain-panel:hover .panel-body-text { color: var(--color-paper) !important; }
        .domain-panel:hover .panel-enter { opacity: 1 !important; transform: translateX(4px); }
        @media (max-width: 768px) {
          .domain-panel { border-right: none !important; border-bottom: 1px solid var(--line); }
          .domain-grid-section { height: auto !important; }
          .domain-panel { min-height: 60vh; }
        }
      `}</style>
    </>
  );
}
