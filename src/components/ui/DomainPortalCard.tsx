"use client";

import Link from "next/link";
import PlotInLines from "./PlotInLines";
import { useParticle } from "@/lib/particleContext";
import type { Project } from "@/data/projects";

interface DomainPortalCardProps {
  project: Project;
  index: number;
}

export default function DomainPortalCard({ project, index }: DomainPortalCardProps) {
  const { setPreviewDomain } = useParticle();

  return (
    <PlotInLines delay={index * 120}>
      <Link
        href={`/work/${project.slug}`}
        className="group block relative overflow-hidden rounded"
        style={{
          border: `1px solid color-mix(in srgb, ${project.accent} 15%, #3A352E)`,
          background: "color-mix(in srgb, #14110E 80%, transparent)",
          backdropFilter: "blur(2px)",
          transition: "border-color 0.4s ease, background 0.4s ease",
        }}
        onMouseEnter={() => setPreviewDomain(project.domain)}
        onMouseLeave={() => setPreviewDomain(null)}
      >
        {/* Aperture — a framed window into the domain */}
        <div
          className="relative overflow-hidden"
          style={{ height: 180 }}
        >
          {/* Domain colour wash — shows the accent when hovered */}
          <div
            className="absolute inset-0 transition-opacity duration-500 opacity-0 group-hover:opacity-100"
            style={{
              background: `radial-gradient(ellipse at center, color-mix(in srgb, ${project.accent} 8%, transparent) 0%, transparent 70%)`,
            }}
          />

          {/* Corner ticks — architectural detail */}
          {(["top-3 left-3", "top-3 right-3", "bottom-3 left-3", "bottom-3 right-3"] as const).map((pos) => (
            <div
              key={pos}
              className={`absolute ${pos} w-4 h-4 pointer-events-none transition-opacity duration-300 opacity-30 group-hover:opacity-80`}
              style={{
                borderTop: pos.includes("top") ? `1px solid ${project.accent}` : "none",
                borderBottom: pos.includes("bottom") ? `1px solid ${project.accent}` : "none",
                borderLeft: pos.includes("left") ? `1px solid ${project.accent}` : "none",
                borderRight: pos.includes("right") ? `1px solid ${project.accent}` : "none",
              }}
            />
          ))}

          {/* Domain label — architectural annotation */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span
              className="label-mono transition-all duration-300 opacity-20 group-hover:opacity-60"
              style={{ color: project.accent, fontSize: "0.5rem", letterSpacing: "0.25em" }}
            >
              {project.domain.toUpperCase()} DOMAIN
            </span>
          </div>

          {/* Datum line — horizontal ground for this aperture */}
          <div
            className="absolute left-6 right-6 bottom-0 transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100"
            style={{ height: "1px", background: `color-mix(in srgb, ${project.accent} 40%, transparent)` }}
          />
        </div>

        {/* Card content */}
        <div
          className="p-5 transition-colors duration-300"
          style={{ borderTop: `1px solid color-mix(in srgb, ${project.accent} 10%, #2E2A25)` }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="label-mono" style={{ color: project.accent, fontSize: "0.6rem" }}>
              {project.type.toUpperCase()} · {project.year}
            </span>
          </div>

          <h2
            className="display-serif mb-2"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.5rem",
              fontWeight: 400,
              color: "var(--color-paper)",
              letterSpacing: "-0.01em",
            }}
          >
            {project.title}
          </h2>

          <p style={{ fontSize: "0.875rem", color: "var(--color-graphite-light)", lineHeight: 1.55 }}>
            {project.oneLiner}
          </p>

          {/* Headline metric as dimension callout */}
          {project.metrics?.[0] && (
            <div
              className="flex items-center gap-3 mt-4 pt-4"
              style={{ borderTop: "1px solid #2E2A25" }}
            >
              <div className="flex items-center gap-1.5">
                <div style={{ width: 1, height: 16, background: project.accent, opacity: 0.5 }} />
                <span
                  className="display-serif"
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "1.375rem",
                    fontWeight: 300,
                    color: project.accent,
                    lineHeight: 1,
                  }}
                >
                  {project.metrics[0].value}
                </span>
              </div>
              <span className="label-mono" style={{ color: "#4A453E", fontSize: "0.55rem" }}>
                {project.metrics[0].label}
              </span>
            </div>
          )}

          <div
            className="mt-4 label-mono flex items-center gap-2 transition-all duration-300 translate-x-0 group-hover:translate-x-1"
            style={{ color: project.accent, fontSize: "0.6rem", opacity: 0.6 }}
          >
            Enter domain →
          </div>
        </div>
      </Link>
    </PlotInLines>
  );
}
