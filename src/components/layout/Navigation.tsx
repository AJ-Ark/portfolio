"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion, type Variants } from "framer-motion";
import { useTranslation } from "@/lib/TranslationContext";
import { EASE_OUT as EASE } from "@/lib/motion";
import MotionToggle from "@/components/ui/MotionToggle";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const navLinkKeys = [
  { href: "/work", key: "nav.work" },
  { href: "/about", key: "nav.about" },
];

export default function Navigation() {
  const pathname = usePathname();
  const { t } = useTranslation();
  // Our hook (not framer's useReducedMotion) so the in-nav Motion toggle,
  // not just the OS setting, calms the menu/hamburger animations too.
  const reduceMotion = usePrefersReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Route change closes the menu */
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  /* While open: Escape closes (focus returns to the toggle), and Tab is
     trapped inside the toggle + menu links loop. */
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab") return;
      const panel = menuRef.current;
      if (!panel) return;
      const focusables = [
        toggleRef.current,
        ...Array.from(
          panel.querySelectorAll<HTMLElement>("a[href], button")
        ),
      ].filter((el): el is HTMLElement => el != null);
      if (focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  /* Move focus into the menu once it opens */
  useEffect(() => {
    if (!menuOpen) return;
    const raf = requestAnimationFrame(() => {
      menuRef.current
        ?.querySelector<HTMLElement>("a[href]")
        ?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(raf);
  }, [menuOpen]);

  const itemVariants: Variants = {
    closed: {
      opacity: 0,
      y: reduceMotion ? 0 : 14,
      transition: { duration: reduceMotion ? 0.01 : 0.2, ease: "easeIn" },
    },
    open: {
      opacity: 1,
      y: 0,
      transition: { duration: reduceMotion ? 0.01 : 0.5, ease: EASE },
    },
  };

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
              className="nav-link"
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: ".68rem",
                letterSpacing: ".16em",
                textTransform: "uppercase",
              }}
              aria-current={pathname.startsWith(link.href) ? "page" : undefined}
            >
              {t(link.key)}
            </Link>
          ))}
          {/* Visible reduced-motion switch — honored site-wide via
              usePrefersReducedMotion's data-motion override. Label hardcoded
              English; i18n key noted in pending (locale files owned by the
              route-shell agent this phase). */}
          <MotionToggle />
          <a
            href="mailto:aravindspav@gmail.com"
            className="cta-link"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: ".65rem",
              letterSpacing: ".14em",
              textTransform: "uppercase",
              padding: ".4rem .9rem",
            }}
          >
            <span>{t("nav.sayHello")}</span> <span aria-hidden="true">→</span>
          </a>
        </nav>

        <button
          ref={toggleRef}
          /* flex on mobile, hidden from md up. The flex/align live in classes,
             NOT inline style — an inline `display:flex` would beat md:hidden's
             `display:none` and leave this button visible (but inert, since the
             panel below is correctly md:hidden) on desktop. */
          className="md:hidden flex items-center"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: ".65rem",
            letterSpacing: ".12em",
            textTransform: "uppercase",
            color: "var(--color-graphite-light)",
            background: "none",
            border: "none",
            cursor: "pointer",
            gap: ".55rem",
          }}
        >
          {/* Glyph — two hairlines that morph ≡ → ✕ */}
          <span
            aria-hidden="true"
            style={{ display: "inline-flex", flexDirection: "column", gap: 5, width: 16 }}
          >
            <motion.span
              animate={menuOpen ? { rotate: 45, y: 3.25 } : { rotate: 0, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.35, ease: EASE }}
              style={{
                display: "block",
                height: 1.5,
                width: "100%",
                background: "currentColor",
                borderRadius: 1,
              }}
            />
            <motion.span
              animate={menuOpen ? { rotate: -45, y: -3.25 } : { rotate: 0, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.35, ease: EASE }}
              style={{
                display: "block",
                height: 1.5,
                width: "100%",
                background: "currentColor",
                borderRadius: 1,
              }}
            />
          </span>
          {menuOpen ? "Close" : "Menu"}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop — dims the page behind the panel; click closes.
                z:-1 keeps it under the header bar within its stacking
                context while still covering the page content. */}
            <motion.div
              key="backdrop"
              className="md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0.01 : 0.35, ease: "easeOut" }}
              onClick={() => setMenuOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                zIndex: -1,
                background: "color-mix(in srgb, var(--color-ground) 72%, transparent)",
                backdropFilter: "blur(6px)",
                WebkitBackdropFilter: "blur(6px)",
              }}
            />

            <motion.div
              key="menu"
              id="mobile-menu"
              ref={menuRef}
              className="md:hidden"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, height: "auto" }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
              transition={{ duration: reduceMotion ? 0.01 : 0.5, ease: EASE }}
              style={{
                overflow: "hidden",
                borderTop: "1px solid var(--line)",
                background: "var(--color-ground)",
              }}
            >
              <motion.div
                className="flex flex-col gap-6"
                style={{ padding: "2rem var(--spacing-page) 2.5rem" }}
                initial="closed"
                animate="open"
                exit="closed"
                variants={{
                  open: {
                    transition: {
                      staggerChildren: reduceMotion ? 0 : 0.06,
                      delayChildren: reduceMotion ? 0 : 0.08,
                    },
                  },
                  closed: {},
                }}
              >
                {navLinkKeys.map((link) => {
                  const isCurrent = pathname.startsWith(link.href);
                  return (
                    <motion.div key={link.href} variants={itemVariants}>
                      <Link
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        aria-current={isCurrent ? "page" : undefined}
                        style={{
                          fontFamily: "var(--font-display)",
                          fontStyle: "italic",
                          fontSize: "1.5rem",
                          fontWeight: 400,
                          /* Current page reads accent — mirrors the desktop
                             .nav-link aria-current underline state */
                          color: isCurrent
                            ? "var(--color-accent)"
                            : "var(--color-paper)",
                        }}
                      >
                        {t(link.key)}
                      </Link>
                    </motion.div>
                  );
                })}
                <motion.a
                  variants={itemVariants}
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
                </motion.a>
                {/* Motion switch inside the panel too — same override, sized
                    to the mono links here. Participates in the focus trap via
                    the "a[href], button" selector above. */}
                <motion.div variants={itemVariants}>
                  <MotionToggle style={{ padding: 0 }} />
                </motion.div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
