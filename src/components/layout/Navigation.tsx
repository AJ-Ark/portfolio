"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-400"
      style={{
        borderBottom: scrolled
          ? "1px solid color-mix(in srgb, #3A352E 60%, transparent)"
          : "1px solid transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        background: scrolled
          ? "color-mix(in srgb, #14110E 85%, transparent)"
          : "transparent",
      }}
    >
      <div
        className="flex items-center justify-between"
        style={{ padding: "1rem var(--spacing-page)" }}
      >
        {/* Title block mark */}
        <Link href="/" className="group flex items-baseline gap-2">
          <span
            className="display-serif"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.125rem",
              fontWeight: 400,
              color: "var(--color-paper)",
              letterSpacing: "-0.01em",
            }}
          >
            Aravind J
          </span>
          <span
            className="label-mono opacity-40 group-hover:opacity-70 transition-opacity"
            style={{ fontSize: "0.5rem" }}
          >
            PORTFOLIO
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="label-mono transition-colors duration-200"
              style={{
                color:
                  pathname === link.href
                    ? "var(--color-paper)"
                    : "var(--color-graphite-light)",
                fontSize: "0.6875rem",
              }}
              aria-current={pathname === link.href ? "page" : undefined}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="mailto:aravind@trmeric.com"
            className="label-mono px-3 py-1.5 rounded transition-all duration-200"
            style={{
              color: "var(--color-paper)",
              border: "1px solid color-mix(in srgb, #6B6157 50%, transparent)",
              fontSize: "0.6875rem",
            }}
          >
            Say hello →
          </a>
        </nav>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden label-mono"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          style={{ color: "var(--color-graphite-light)", fontSize: "0.6875rem" }}
        >
          {menuOpen ? "✕ CLOSE" : "≡ MENU"}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden flex flex-col gap-6 px-6 py-8"
          style={{
            borderTop: "1px solid #3A352E",
            background: "var(--color-ground)",
          }}
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="display-serif"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                color: "var(--color-paper)",
              }}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="mailto:aravind@trmeric.com"
            className="label-mono"
            style={{ color: "var(--color-graphite-light)" }}
          >
            aravind@trmeric.com
          </a>
        </div>
      )}
    </header>
  );
}
