import Image from "next/image";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import DimensionCallout from "@/components/ui/DimensionCallout";
import PlotInLines from "@/components/ui/PlotInLines";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Aravind Jegajeeva Rajasekar, architect by training, designer by practice. B.Arch SPA Vijayawada, M.Des NID Gandhinagar. Senior Product Designer at Trmeric.",
};

export default function AboutPage() {
  return (
    <>
      <Navigation />

      <main id="main-content" style={{ padding: "9rem var(--spacing-page) 6rem" }}>
        <div style={{ maxWidth: "56rem" }}>

          {/* Header */}
          <PlotInLines>
            <span className="label-mono block mb-4" style={{ color: "#4A453E" }}>
              ARAVIND JEGAJEEVA RAJASEKAR · ABOUT
            </span>
          </PlotInLines>
          <PlotInLines delay={60}>
            <h1
              className="display-serif mb-12"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 5vw, 3.75rem)",
                fontWeight: 300,
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
                color: "var(--color-paper)",
              }}
            >
              Architect by training.
              <br />
              Designer by practice.
            </h1>
          </PlotInLines>

          {/* The site's own form — the meta-argument */}
          <PlotInLines delay={120}>
            <div
              className="mb-12 p-6 rounded"
              style={{
                border: "1px solid #2E2A25",
                background: "#0C0A08",
              }}
            >
              <span className="label-mono block mb-3" style={{ color: "#FFA426", opacity: 0.7 }}>
                On this site
              </span>
              <p style={{ color: "var(--color-graphite-light)", lineHeight: 1.7, fontSize: "0.9375rem" }}>
                This portfolio is itself the argument. The architectural section metaphor,
                moving inward along a Z-axis, is my SPA Vijayawada self: structure,
                depth, intentional space. The particle ecosystem, organic, living, three
                behaviours, is my NID self: research, ecology, care. The WebGL binding
                both in real time is the web developer self that learned to build ideas
                the same day he had them. The form is the argument.
              </p>
            </div>
          </PlotInLines>

          {/* Bio */}
          <PlotInLines delay={180}>
            <div className="space-y-5 mb-12" style={{ maxWidth: "38rem" }}>
              <p style={{ color: "var(--color-graphite-light)", lineHeight: 1.8, fontSize: "0.9375rem" }}>
                I came to design through architecture. Six years at SPA Vijayawada, licensed
                by the Council of Architecture, taught me to hold a system in my head at
                full scale while still caring about the door handle. Buildings are systems.
                So are interfaces. The patience is the same; the medium is faster.
              </p>
              <p style={{ color: "var(--color-graphite-light)", lineHeight: 1.8, fontSize: "0.9375rem" }}>
                I taught myself web development between architecture school and NID because
                I wanted a medium where I could test an idea the same afternoon I had it.
                That instinct never left. My prototypes are not wireframes. They are
                functional, interactive, data-driven artifacts. When engineering builds
                from my prototypes directly, that's the intended workflow.
              </p>
              <p style={{ color: "var(--color-graphite-light)", lineHeight: 1.8, fontSize: "0.9375rem" }}>
                NID Gandhinagar gave me research rigour. The M.Des in New Media Design
                taught me to know when an instinct is actually an insight, and when it
                isn't. My graduation project, Realm of Elementals, was that discipline in
                full: nine months of research on care, decentering, and ecological identity,
                built into a WebAR experience.
              </p>
              <p style={{ color: "var(--color-graphite-light)", lineHeight: 1.8, fontSize: "0.9375rem" }}>
                Currently: Senior Product Designer at Trmeric, sole designer on the founding
                team. I own the full design surface of an AI-native enterprise SaaS platform,
                from information architecture to production-grade prototypes. I sit in product
                strategy as an equal, not as a service provider.
              </p>
            </div>
          </PlotInLines>

          {/* Timeline / education — dimension callout style */}
          <PlotInLines delay={240}>
            <div
              className="mb-12 py-8"
              style={{ borderTop: "1px solid #2E2A25", borderBottom: "1px solid #2E2A25" }}
            >
              <span className="label-mono block mb-8" style={{ color: "#4A453E" }}>Timeline</span>
              <div className="flex flex-col gap-6">
                {[
                  { year: "2025–now", event: "Senior Product Designer, Trmeric", detail: "Founding team. Sole designer." },
                  { year: "2024–2026", event: "M.Des New Media Design, NID Gandhinagar", detail: "Research-led practice. Thesis: Realm of Elementals." },
                  { year: "2018–2024", event: "B.Arch, SPA Vijayawada", detail: "Six years. Council of Architecture licensed." },
                ].map((item) => (
                  <div key={item.year} className="flex gap-8">
                    <span
                      className="label-mono shrink-0"
                      style={{ color: "#4A453E", width: 80, fontSize: "0.6rem" }}
                    >
                      {item.year}
                    </span>
                    <div>
                      <div style={{ color: "var(--color-paper)", fontSize: "0.9375rem", marginBottom: "0.25rem" }}>
                        {item.event}
                      </div>
                      <div style={{ color: "var(--color-graphite-light)", fontSize: "0.8125rem" }}>
                        {item.detail}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </PlotInLines>

          {/* Links */}
          <PlotInLines delay={300}>
            <div className="flex flex-wrap gap-4">
              <a
                href="mailto:aravind@trmeric.com"
                className="label-mono px-4 py-2 rounded transition-all duration-200"
                style={{
                  background: "var(--color-paper)",
                  color: "var(--color-ink)",
                }}
              >
                aravind@trmeric.com →
              </a>
              <a
                href="https://linkedin.com/in/aravindj"
                target="_blank"
                rel="noopener noreferrer"
                className="label-mono px-4 py-2 rounded transition-all duration-200"
                style={{
                  color: "var(--color-graphite-light)",
                  border: "1px solid #3A352E",
                }}
              >
                LinkedIn ↗
              </a>
              <Link
                href="/work"
                className="label-mono px-4 py-2 rounded transition-all duration-200"
                style={{
                  color: "var(--color-graphite-light)",
                  border: "1px solid #3A352E",
                }}
              >
                View work →
              </Link>
            </div>
          </PlotInLines>

          {/* Portrait */}
          <PlotInLines delay={360}>
            <div
              className="mt-16 rounded overflow-hidden"
              style={{
                position: "relative",
                height: 360,
                width: 280,
                border: "1px solid #2E2A25",
              }}
            >
              <Image
                src="/images/headshot.jpg"
                alt="Portrait of Aravind Jegajeeva Rajasekar"
                fill
                style={{ objectFit: "cover" }}
              />
            </div>
          </PlotInLines>
        </div>
      </main>

      <Footer />
    </>
  );
}
