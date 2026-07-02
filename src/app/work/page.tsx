import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import WarpLink from "@/components/ui/WarpLink";
import { projects } from "@/data/projects";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Work",
  description: "All projects: Trmeric, Realm of Elementals, Rippl, Rozi. Product design, UX research, interaction design, service design.",
};

export default function WorkIndex() {
  return (
    <>
      <Navigation />

      <main
        id="main-content"
        style={{ padding: "8rem var(--spacing-page) 4rem" }}
      >
        {/* Header */}
        <div className="mb-16 max-w-2xl">
          <span className="label-mono block mb-4" style={{ color: "#4A453E" }}>
            PLANE 02 · ALL WORK · INDEX
          </span>
          <h1
            className="display-serif"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              fontWeight: 300,
              color: "var(--color-paper)",
              letterSpacing: "-0.02em",
              marginBottom: "1rem",
            }}
          >
            Work
          </h1>
          <p style={{ color: "var(--color-graphite-light)", fontSize: "0.9375rem", lineHeight: 1.6 }}>
            Four projects. Professional, academic, and research-led.
            Each with its own texture, but the same underlying instinct:
            prototype to understand, not to present.
          </p>
        </div>

        {/* Project list — flat, no WebGL */}
        <div className="flex flex-col gap-0">
          {projects.map((project, i) => (
            <WarpLink
              key={project.slug}
              href={`/work/${project.slug}`}
              domain={project.domain}
              className="group flex flex-col md:flex-row md:items-center gap-4 py-7 transition-all duration-200"
              style={{
                borderTop: "1px solid #2E2A25",
                borderBottom: i === projects.length - 1 ? "1px solid #2E2A25" : "none",
              }}
            >
              {/* Index number */}
              <span
                className="label-mono shrink-0"
                style={{ color: "#3A352E", width: 32, fontSize: "0.55rem" }}
              >
                0{i + 1}
              </span>

              {/* Accent bar */}
              <div
                className="shrink-0"
                style={{
                  width: 3,
                  height: 40,
                  background: project.accent,
                  opacity: 0.4,
                  borderRadius: 2,
                  transition: "opacity 0.2s ease, height 0.2s ease",
                }}
              />

              {/* Title + descriptor */}
              <div className="flex-1 min-w-0">
                <h2
                  className="display-serif group-hover:text-[--color-paper] transition-colors duration-200"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.375rem",
                    fontWeight: 400,
                    color: "var(--color-paper)",
                    letterSpacing: "-0.01em",
                    marginBottom: "0.25rem",
                  }}
                >
                  {project.title}
                </h2>
                <p
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--color-graphite-light)",
                    lineHeight: 1.5,
                  }}
                >
                  {project.oneLiner}
                </p>
              </div>

              {/* Meta */}
              <div className="shrink-0 flex flex-col items-end gap-1 md:text-right">
                <span
                  className="label-mono"
                  style={{
                    color: project.accent,
                    fontSize: "0.55rem",
                  }}
                >
                  {project.type.toUpperCase()}
                </span>
                <span className="label-mono" style={{ color: "#4A453E", fontSize: "0.55rem" }}>
                  {project.year}
                </span>
              </div>

              {/* Arrow */}
              <span
                className="label-mono shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ color: project.accent, width: 24 }}
              >
                →
              </span>
            </WarpLink>
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}
