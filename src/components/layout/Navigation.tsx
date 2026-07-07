"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { useTranslation } from "@/lib/TranslationContext";

const navLinkKeys = [
  { href: "/work", key: "nav.work" },
  { href: "/about", key: "nav.about" },
];

export default function Navigation() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50"
      style={{
        borderBottom: scrolled ? "1px solid var(--line)" : "1px solid transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        background: scrolled
          ? "color-mix(in srgb, var(--color-ground) 88%, transparent)"
          : "transparent",
        transition: "border-color .3s ease, background .3s ease, backdrop-filter .3s ease",
      }}
    >
      <div
        className="flex items-center justify-between"
        style={{ padding: "1.1rem var(--spacing-page)" }}
      >
        <Link href="/" className="group flex items-center gap-2.5">
          {/* AJ logo mark — one vector shape, recolored per theme (gold on
              dark, ink on light) via CSS mask. Adjacent wordmark names it. */}
          <span
            className="aj-logo"
            aria-hidden="true"
            style={{ width: 28, height: 28, flexShrink: 0 }}
          />
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: "1rem",
              fontWeight: 400,
              color: "var(--color-paper)",
              letterSpacing: "-.01em",
            }}
          >
            Aravind J
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8" aria-label="Primary">
          {navLinkKeys.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: ".68rem",
                letterSpacing: ".16em",
                textTransform: "uppercase",
                color: pathname.startsWith(link.href)
                  ? "var(--color-paper)"
                  : "var(--color-graphite-light)",
                transition: "color .2s ease",
              }}
              aria-current={pathname.startsWith(link.href) ? "page" : undefined}
            >
              {t(link.key)}
            </Link>
          ))}
          <a
            href="mailto:aravindspav@gmail.com"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: ".65rem",
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: "var(--color-accent)",
              border: "1px solid var(--line)",
              borderRadius: "4px",
              padding: ".4rem .9rem",
              transition: "border-color .2s ease, color .2s ease",
            }}
          >
            {t("nav.sayHello")} →
          </a>
        </nav>

        <button
          className="md:hidden"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: ".65rem",
            letterSpacing: ".12em",
            textTransform: "uppercase",
            color: "var(--color-graphite-light)",
            background: "none",
            border: "none",
            cursor: "pointer",
          }}
        >
          {menuOpen ? "✕ CLOSE" : "≡ MENU"}
        </button>
      </div>

      {menuOpen && (
        <div
          className="md:hidden flex flex-col gap-6"
          style={{
            padding: "2rem var(--spacing-page) 2.5rem",
            borderTop: "1px solid var(--line)",
            background: "var(--color-ground)",
          }}
        >
          {navLinkKeys.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: "1.5rem",
                fontWeight: 400,
                color: "var(--color-paper)",
              }}
            >
              {t(link.key)}
            </Link>
          ))}
          <a
            href="mailto:aravindspav@gmail.com"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: ".68rem",
              letterSpacing: ".16em",
              textTransform: "uppercase",
              color: "var(--color-accent)",
            }}
          >
            aravindspav@gmail.com →
          </a>
        </div>
      )}
    </header>
  );
}
