import Link from "next/link";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import SectionIndicator from "@/components/ui/SectionIndicator";
import PlotInLines from "@/components/ui/PlotInLines";
import WordReveal from "@/components/ui/WordReveal";
import Preloader from "@/components/ui/Preloader";
import { projects } from "@/data/projects";
import DomainPortalCard from "@/components/ui/DomainPortalCard";

export default function Home() {
  return (
    <>
      <Preloader />
      <Navigation />
      <SectionIndicator />

      <main id="main-content">
        {/* PLANE 0: Hero */}
        <section
          className="relative min-h-screen flex flex-col justify-center overflow-hidden"
          style={{ padding: "8rem var(--spacing-page) 6rem" }}
        >
          {/* Datum line */}
          <div
            className="absolute left-0 right-0"
            aria-hidden="true"
            style={{
              top: "50%",
              height: "1px",
              background:
                "linear-gradient(90deg, transparent, color-mix(in srgb, #3A352E 40%, transparent) 20%, color-mix(in srgb, #3A352E 40%, transparent) 80%, transparent)",
            }}
          />

          <div className="relative z-10 max-w-4xl">
            <PlotInLines delay={0}>
              <span className="label-mono mb-8 block" style={{ color: "#4A453E" }}>
                PLANE 00 · FACADE · THRESHOLD
              </span>
            </PlotInLines>

            {/* Word-by-word hero headline — three visual lines */}
            <div
              className="display-serif mb-6"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
                fontWeight: 300,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
              }}
            >
              <WordReveal
                as="span"
                delay={300}
                stagger={65}
                style={{ display: "block", color: "var(--color-paper)" }}
              >
                Architect by training.
              </WordReveal>
              <WordReveal
                as="em"
                delay={600}
                stagger={65}
                style={{ display: "block", fontStyle: "italic", color: "var(--color-paper)" }}
              >
                Designer by practice.
              </WordReveal>
              <WordReveal
                as="span"
                delay={850}
                stagger={55}
                style={{ display: "block", color: "var(--color-graphite-light)", fontWeight: 300 }}
              >
                I build the thing to understand the thing.
              </WordReveal>
            </div>

            <PlotInLines delay={1200}>
              <p
                className="mb-10"
                style={{
                  fontSize: "1.0625rem",
                  color: "var(--color-graphite-light)",
                  maxWidth: "36rem",
                  lineHeight: 1.6,
                }}
              >
                Senior Product Designer & UX Researcher{" "}
                <span style={{ color: "#4A453E" }}>·</span>{" "}
                <span style={{ color: "var(--color-paper)" }}>
                  M.Des New Media Design, NID Gandhinagar
                </span>
              </p>
            </PlotInLines>

            <PlotInLines delay={1400}>
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/work"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded transition-all duration-300"
                  style={{
                    background: "var(--color-paper)",
                    color: "var(--color-ink)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.75rem",
                    letterSpacing: "0.06em",
                    fontWeight: 500,
                  }}
                >
                  View work →
                </Link>
                <a
                  href="#portals"
                  className="label-mono px-5 py-3 rounded transition-all duration-300"
                  style={{
                    color: "var(--color-graphite-light)",
                    border: "1px solid #3A352E",
                  }}
                >
                  Explore domains ↓
                </a>
              </div>
            </PlotInLines>
          </div>

          {/* Scroll indicator */}
          <div
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
            aria-hidden="true"
          >
            <div
              className="w-px animate-pulse"
              style={{
                height: 40,
                background:
                  "linear-gradient(to bottom, color-mix(in srgb, #6B6157 60%, transparent), transparent)",
              }}
            />
            <span className="label-mono" style={{ fontSize: "0.5rem", color: "#3A352E" }}>
              MOVE INWARD
            </span>
          </div>
        </section>

        {/* PLANE 1: Domain portals */}
        <section
          id="portals"
          style={{ padding: "6rem var(--spacing-page)", position: "relative" }}
        >
          <div className="mb-12 flex items-center gap-6">
            <span className="label-mono" style={{ color: "#3A352E" }}>
              PLANE 01 · DOMAINS · PORTALS
            </span>
            <div
              style={{
                flex: 1,
                height: "1px",
                background:
                  "linear-gradient(90deg, color-mix(in srgb, #3A352E 40%, transparent), transparent)",
              }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {projects.map((project, i) => (
              <DomainPortalCard key={project.slug} project={project} index={i} />
            ))}
          </div>
        </section>

        {/* Currently section */}
        <section
          style={{
            padding: "6rem var(--spacing-page)",
            borderTop: "1px solid color-mix(in srgb, #3A352E 30%, transparent)",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl">
            <div>
              <span className="label-mono block mb-3" style={{ color: "#4A453E" }}>
                Currently
              </span>
              <p style={{ color: "var(--color-graphite-light)", fontSize: "0.9375rem", lineHeight: 1.6 }}>
                Senior Product Designer at{" "}
                <span style={{ color: "var(--color-trmeric)" }}>Trmeric</span>.
                <br />
                M.Des New Media Design, NID Gandhinagar (2026).
              </p>
            </div>
            <div>
              <span className="label-mono block mb-3" style={{ color: "#4A453E" }}>
                Background
              </span>
              <p style={{ color: "var(--color-graphite-light)", fontSize: "0.9375rem", lineHeight: 1.6 }}>
                B.Arch from SPA Vijayawada. Six years of architecture taught me to
                hold a system in my head at full scale while still caring about the
                door handle.
              </p>
            </div>
            <div>
              <span className="label-mono block mb-3" style={{ color: "#4A453E" }}>
                Reach
              </span>
              <div className="flex flex-col gap-2">
                <a
                  href="mailto:aravind@trmeric.com"
                  className="label-mono transition-colors hover:text-[--color-paper]"
                  style={{ color: "var(--color-graphite-light)" }}
                >
                  aravind@trmeric.com →
                </a>
                <a
                  href="https://linkedin.com/in/aravindj"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="label-mono transition-colors hover:text-[--color-paper]"
                  style={{ color: "var(--color-graphite-light)" }}
                >
                  LinkedIn →
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
