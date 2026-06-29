"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";

const planes = [
  { depth: 0, label: "00", name: "surface", href: "/" },
  { depth: 1, label: "01", name: "portals", href: "/#portals" },
  { depth: 2, label: "02", name: "domain", href: "/work" },
  { depth: 3, label: "03", name: "detail", href: "/work" },
];

function getActiveDepth(pathname: string): number {
  if (pathname === "/") return 0;
  if (pathname === "/work") return 2;
  if (pathname === "/about") return 2;
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length >= 3) return 3;
  if (segments.length === 2) return 2;
  return 1;
}

function getDomainAccent(pathname: string): string {
  if (pathname.includes("rippl")) return "#78B9C5";
  if (pathname.includes("realm")) return "#4A9E8E";
  if (pathname.includes("trmeric")) return "#FFA426";
  return "#6B6157";
}

export default function SectionIndicator() {
  const pathname = usePathname();
  const activeDepth = getActiveDepth(pathname);
  const accent = getDomainAccent(pathname);

  return (
    <nav
      aria-label="Section depth indicator"
      className="fixed left-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-1 hidden lg:flex"
    >
      {/* SECTION A–A label */}
      <span
        className="label-mono mb-3 rotate-[-90deg] origin-center whitespace-nowrap"
        style={{ fontSize: "0.5625rem", letterSpacing: "0.18em" }}
      >
        SECTION A–A
      </span>

      {/* Vertical spine */}
      <div className="relative flex flex-col items-center gap-0">
        {planes.map((plane, i) => {
          const isActive = plane.depth === activeDepth;
          const isPast = plane.depth < activeDepth;

          return (
            <Link
              key={plane.depth}
              href={plane.href}
              className="group flex items-center gap-2 py-2"
              aria-label={`Go to plane ${plane.label}: ${plane.name}`}
              aria-current={isActive ? "page" : undefined}
            >
              {/* Tick mark */}
              <span
                className="label-mono text-right transition-colors duration-300"
                style={{
                  fontSize: "0.5rem",
                  color: isActive ? accent : isPast ? "#4A453E" : "#2E2A25",
                }}
              >
                {plane.label}
              </span>

              {/* Node dot */}
              <div
                className="relative flex items-center"
                style={{ width: 10, height: 10 }}
              >
                {/* Connector line above (not for first item) */}
                {i > 0 && (
                  <div
                    className="absolute bottom-full left-1/2 -translate-x-1/2 w-px"
                    style={{
                      height: 16,
                      background: isPast || isActive
                        ? color_mix(accent, 0.4)
                        : "#2E2A25",
                      transition: "background 0.4s ease",
                    }}
                  />
                )}
                <div
                  className="rounded-full transition-all duration-400"
                  style={{
                    width: isActive ? 8 : 4,
                    height: isActive ? 8 : 4,
                    background: isActive
                      ? accent
                      : isPast
                      ? color_mix(accent, 0.3)
                      : "#3A352E",
                    boxShadow: isActive ? `0 0 8px ${accent}80` : "none",
                    transition: "all 0.4s var(--ease-architectural)",
                  }}
                />
              </div>

              {/* Plane name — appears on hover / active */}
              <span
                className="label-mono whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                style={{
                  fontSize: "0.5rem",
                  color: isActive ? accent : "#4A453E",
                  opacity: isActive ? 1 : undefined,
                }}
              >
                {plane.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function color_mix(hex: string, alpha: number): string {
  return `color-mix(in srgb, ${hex} ${Math.round(alpha * 100)}%, transparent)`;
}
