import Link from "next/link";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import SectionIndicator from "@/components/ui/SectionIndicator";
import DimensionCallout from "@/components/ui/DimensionCallout";
import DecisionBlock from "@/components/ui/DecisionBlock";
import PlotInLines from "@/components/ui/PlotInLines";
import { projectsBySlug } from "@/data/projects";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trmeric",
  description:
    "Senior Product Designer on the founding team of Trmeric — an AI-native enterprise SaaS platform. Full design surface from IA to production prototypes.",
};

const project = projectsBySlug["trmeric"];
const ACCENT = "#FFA426";

export default function TrmericPage() {
  return (
    <>
      <Navigation />
      <SectionIndicator />

      <main id="main-content">
        {/* Hero */}
        <section
          className="relative min-h-[70vh] flex flex-col justify-end overflow-hidden"
          style={{ padding: "10rem var(--spacing-page) 4rem" }}
        >
          <div className="relative z-10 max-w-4xl">
            <PlotInLines>
              <span className="label-mono block mb-4" style={{ color: ACCENT, opacity: 0.7 }}>
                PLANE 02 · TRMERIC · PROFESSIONAL
              </span>
            </PlotInLines>
            <PlotInLines delay={80}>
              <h1
                className="display-serif mb-4"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2.5rem, 8vw, 6rem)",
                  fontWeight: 300,
                  letterSpacing: "-0.025em",
                  lineHeight: 0.95,
                  color: "var(--color-paper)",
                }}
              >
                Trmeric
              </h1>
            </PlotInLines>
            <PlotInLines delay={160}>
              <p
                style={{
                  fontSize: "clamp(1rem, 2vw, 1.25rem)",
                  color: "var(--color-graphite-light)",
                  maxWidth: "42rem",
                  lineHeight: 1.55,
                }}
              >
                Designing the full product experience for an AI-native enterprise
                platform — from demand intake to portfolio value realisation.
              </p>
            </PlotInLines>
          </div>
        </section>

        {/* Metadata strip */}
        <section
          style={{
            padding: "2.5rem var(--spacing-page)",
            borderTop: `1px solid color-mix(in srgb, ${ACCENT} 15%, #3A352E)`,
            borderBottom: "1px solid #2E2A25",
          }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Role", value: "Senior Product Designer" },
              { label: "Team", value: "Founding — Siddharth Bohra (CEO), Roshan PR (Eng)" },
              { label: "Clients", value: "BHP · Kaiser Permanente · EY · Seagate" },
              { label: "Timeline", value: "2025 – present" },
            ].map((item) => (
              <div key={item.label}>
                <span className="label-mono block mb-1" style={{ color: "#4A453E" }}>
                  {item.label}
                </span>
                <span style={{ fontSize: "0.875rem", color: "var(--color-paper)" }}>
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Context */}
        <section style={{ padding: "5rem var(--spacing-page)", maxWidth: "72rem", margin: "0 auto" }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div>
              <span className="label-mono block mb-4" style={{ color: "#4A453E" }}>
                What Trmeric is
              </span>
              <p style={{ color: "var(--color-graphite-light)", lineHeight: 1.7, fontSize: "0.9375rem" }}>
                An AI-native B2B SaaS platform for demand management, resource management,
                and portfolio management. It helps enterprises decide what to build,
                who builds it, and whether it delivered value.
              </p>
              <p className="mt-4" style={{ color: "var(--color-graphite-light)", lineHeight: 1.7, fontSize: "0.9375rem" }}>
                Enterprise demand management is broken — requests arrive as emails,
                get lost in spreadsheets, and have no lifecycle visibility. Trmeric
                introduces structured demand intake, AI-powered scoping via an agent
                called Tango, and portfolio-level value tracking.
              </p>
            </div>
            <div>
              <span className="label-mono block mb-4" style={{ color: "#4A453E" }}>
                My scope
              </span>
              <p style={{ color: "var(--color-graphite-light)", lineHeight: 1.7, fontSize: "0.9375rem" }}>
                I am the sole product designer on a founding team. I own the full
                design surface — from information architecture and interaction design
                to the design system, high-fidelity prototyping, and client-facing
                deliverables.
              </p>
              <p className="mt-4" style={{ color: "var(--color-graphite-light)", lineHeight: 1.7, fontSize: "0.9375rem" }}>
                My prototypes are the product spec. Engineering builds from them
                directly. That is the intended workflow — not an accident.
              </p>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12"
            style={{ borderTop: "1px solid #2E2A25", borderBottom: "1px solid #2E2A25" }}>
            {project.metrics?.map((m) => (
              <DimensionCallout key={m.label} value={m.value} label={m.label} accent={ACCENT} />
            ))}
          </div>

          {/* Design system */}
          <div className="mt-16">
            <span className="label-mono block mb-6" style={{ color: "#4A453E" }}>
              Design system
            </span>
            <p className="mb-6" style={{ color: "var(--color-graphite-light)", lineHeight: 1.7, maxWidth: "38rem", fontSize: "0.9375rem" }}>
              Trmeric DS v3 — a token system built from the turmeric plant:
              Rhizome oranges, Powder golds, Leaf greens, Root browns. One rule
              I coined governs the whole system: no Claudian design — no heavy
              left-border accents on every information panel. Let hierarchy do
              the work, not decoration.
            </p>
            <div
              className="rounded flex items-center justify-center"
              style={{
                height: 280,
                background: "#0C0A08",
                border: `1px solid color-mix(in srgb, ${ACCENT} 15%, transparent)`,
              }}
            >
              <span className="label-mono text-center" style={{ color: "#3A352E" }}>
                [Image: Trmeric Design System v3 — token grid]
                <br />
                Replace with: /public/images/trmeric/design-system.png
              </span>
            </div>
          </div>

          <DecisionBlock
            decision="Orange is brand, not AI. The AI gradient is reserved exclusively for Tango."
            reasoning="When every surface uses the same orange, it is brand. But if Tango uses the same colour as a button, users cannot tell what is intelligent and what is interactive. The purple-to-orange gradient became the only signal that says: this is Tango thinking."
            before="Tango used the brand orange, indistinguishable from regular interactive elements."
            after="AI contexts use a distinct gradient (#8b5cf6 to #FFA426). Orange alone remains brand. No ambiguity."
            accent={ACCENT}
          />
        </section>

        {/* PLANE 3: Feature deep-dives */}
        <section
          style={{
            padding: "5rem var(--spacing-page)",
            borderTop: "1px solid #2E2A25",
            background: "#0C0A08",
          }}
        >
          <div style={{ maxWidth: "72rem", margin: "0 auto" }}>
            <div className="mb-10">
              <span className="label-mono block mb-3" style={{ color: "#4A453E" }}>
                PLANE 03 · FEATURE DEEP-DIVES · SANDBOX
              </span>
              <h2
                className="display-serif"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                  fontWeight: 300,
                  color: "var(--color-paper)",
                  letterSpacing: "-0.015em",
                }}
              >
                Inside the platform
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {project.subPieces?.map((piece, i) => (
                <PlotInLines key={piece.slug} delay={i * 80}>
                  <Link
                    href={`/work/trmeric/${piece.slug}`}
                    className="group block p-5 rounded transition-all duration-300"
                    style={{
                      border: `1px solid color-mix(in srgb, ${ACCENT} 12%, #2E2A25)`,
                      background: "#14110E",
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <span className="label-mono" style={{ color: ACCENT, fontSize: "0.55rem" }}>
                        {piece.sandboxSrc ? "LIVE SANDBOX" : "SHOWCASE"}
                      </span>
                      <span
                        className="label-mono opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ color: ACCENT, fontSize: "0.55rem" }}
                      >
                        →
                      </span>
                    </div>
                    <h3
                      className="display-serif mb-2"
                      style={{
                        fontFamily: "var(--font-display)",
                        fontSize: "1.125rem",
                        fontWeight: 400,
                        color: "var(--color-paper)",
                      }}
                    >
                      {piece.title}
                    </h3>
                    <p style={{ fontSize: "0.8125rem", color: "var(--color-graphite-light)", lineHeight: 1.5 }}>
                      {piece.oneLiner}
                    </p>
                    {piece.tags && (
                      <div className="flex flex-wrap gap-1 mt-4">
                        {piece.tags.map((tag) => (
                          <span
                            key={tag}
                            className="label-mono px-2 py-0.5 rounded"
                            style={{
                              fontSize: "0.5rem",
                              color: "#4A453E",
                              background: "#1C1712",
                              border: "1px solid #2E2A25",
                            }}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </Link>
                </PlotInLines>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
