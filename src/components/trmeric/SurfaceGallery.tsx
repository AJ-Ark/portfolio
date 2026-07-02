"use client";

import Shot from "./Shot";
import type { TrmColors } from "./PrototypeFrame";

/* The surface archive. Every tile does three things:
   click the shot → uncropped lightbox; "Live ↗" → the real prototype;
   "Deep dive ↓" → the matching feature section, where one exists. */

interface Surface {
  src: string;
  label: string;
  alt: string;
  proto?: string;   // /prototypes/trmeric/…
  dive?: string;    // #anchor on this page
}

const SURFACES: Surface[] = [
  { src: "/images/trmeric/cockpit.png", label: "Demand Cockpit", alt: "Demand Cockpit — the executive demand overview", proto: "/prototypes/trmeric/cockpit.html" },
  { src: "/images/trmeric/project-manager.png", label: "Project Manager", alt: "Project Manager — execution board and status health", proto: "/prototypes/trmeric/project-manager.html", dive: "#project-manager" },
  { src: "/images/trmeric/resource-manager.png", label: "Resource Manager", alt: "Resource Manager — capacity and allocation", proto: "/prototypes/trmeric/resource-manager.html" },
  { src: "/images/trmeric/raid.png", label: "RAID", alt: "RAID — risks, assumptions, issues, dependencies", proto: "/prototypes/trmeric/raid.html", dive: "#project-manager" },
  { src: "/images/trmeric/actionhub.png", label: "Action Hub", alt: "Action Hub — cross-portfolio action tracking", proto: "/prototypes/trmeric/action-hub.html" },
  { src: "/images/trmeric/potentialhub.png", label: "Potential Hub", alt: "Potential Hub — pipeline of demand potential", proto: "/prototypes/trmeric/potential-hub.html" },
  { src: "/images/trmeric/ideation.png", label: "Ideation", alt: "Ideation — structured idea capture feeding demand intake", proto: "/prototypes/trmeric/ideation.html", dive: "#demand-owner-flow" },
  { src: "/images/trmeric/budget.png", label: "Budget", alt: "Budget — portfolio budget planning and tracking", proto: "/prototypes/trmeric/budget.html" },
  { src: "/images/trmeric/readiness.png", label: "Readiness", alt: "Readiness — initiative readiness checklist", proto: "/prototypes/trmeric/readiness.html" },
  { src: "/images/trmeric/kudos.png", label: "Kudos", alt: "Kudos — recognition tied to delivered outcomes", proto: "/prototypes/trmeric/kudos.html" },
  { src: "/images/trmeric/admin-console.png", label: "Admin Console", alt: "Admin Console — platform administration", proto: "/prototypes/trmeric/admin-console.html" },
  { src: "/images/trmeric/designsystem.png", label: "Design System v3", alt: "Trmeric Design System v3 — tokens and component library", proto: "/prototypes/trmeric/design-system.html", dive: "#design-system" },
];

export default function SurfaceGallery({ colors: c }: { colors: TrmColors }) {
  const chip = (accent = false): React.CSSProperties => ({
    fontFamily: "var(--font-mono)",
    fontSize: ".48rem",
    letterSpacing: ".12em",
    textTransform: "uppercase",
    color: accent ? c.accd : c.dim,
    border: `1px solid ${accent ? "rgba(255,164,38,.35)" : c.line}`,
    borderRadius: 999,
    padding: ".28rem .6rem",
    textDecoration: "none",
    whiteSpace: "nowrap",
  });

  return (
    <div
      className="mobile-stack"
      style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: "1.4rem 1rem" }}
    >
      {SURFACES.map(({ src, label, alt, proto, dive }) => (
        <div key={src}>
          <Shot
            src={src}
            alt={alt}
            ratio="16/10"
            radius={10}
            border={`1px solid ${c.line}`}
            accent={c.acc}
            sizes="(max-width: 900px) 50vw, 260px"
            actions={
              proto ? (
                <a
                  href={proto}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: ".58rem",
                    letterSpacing: ".16em",
                    textTransform: "uppercase",
                    color: "#17150F",
                    background: c.acc,
                    borderRadius: 999,
                    padding: ".45rem 1rem",
                    textDecoration: "none",
                  }}
                >
                  Open live prototype ↗
                </a>
              ) : undefined
            }
          />
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: ".5rem", marginTop: ".6rem", flexWrap: "wrap" }}>
            <span style={{ fontFamily: "var(--font-mono)", fontSize: ".55rem", letterSpacing: ".12em", textTransform: "uppercase", color: c.dim }}>
              {label}
            </span>
            <span style={{ display: "flex", gap: ".35rem" }}>
              {proto && (
                <a href={proto} target="_blank" rel="noopener noreferrer" style={chip(true)}>
                  Live ↗
                </a>
              )}
              {dive && (
                <a href={dive} style={chip()}>
                  Deep dive ↓
                </a>
              )}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
