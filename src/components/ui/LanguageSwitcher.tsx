"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useTranslation } from "@/lib/TranslationContext";
import { SUPPORTED_LANGUAGES, type LanguageCode } from "@/lib/i18n";
import { EASE_OUT as EASE } from "@/lib/motion";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  /* While open: Escape closes (focus returns to the trigger),
     pointer-down outside dismisses. */
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [isOpen]);

  return (
    <div ref={rootRef} style={{ position: "relative" }}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: ".65rem",
          letterSpacing: ".14em",
          textTransform: "uppercase",
          color: "var(--color-graphite-light)",
          background: "none",
          border: "1px solid var(--line)",
          borderRadius: "4px",
          padding: ".4rem .9rem",
          cursor: "pointer",
          transition: "border-color .2s ease, color .2s ease",
        }}
        aria-label="Language selector"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {language.toUpperCase()}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: -6 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.97, y: -4 }}
            transition={{ duration: reduceMotion ? 0.01 : 0.3, ease: EASE }}
            style={{
              position: "absolute",
              top: "100%",
              right: 0,
              marginTop: ".5rem",
              transformOrigin: "top right",
              background: "var(--color-ground)",
              border: "1px solid var(--line)",
              borderRadius: "4px",
              minWidth: "160px",
              zIndex: 1000,
              boxShadow: "var(--shadow-sm)",
            }}
          >
            {Object.entries(SUPPORTED_LANGUAGES).map(([code, name]) => (
              <button
                key={code}
                onClick={() => {
                  setLanguage(code as LanguageCode);
                  setIsOpen(false);
                  buttonRef.current?.focus();
                }}
                style={{
                  display: "block",
                  width: "100%",
                  padding: ".6rem .9rem",
                  textAlign: "left",
                  fontFamily: "var(--font-mono)",
                  fontSize: ".6rem",
                  letterSpacing: ".1em",
                  color:
                    code === language
                      ? "var(--color-accent)"
                      : "var(--color-graphite-light)",
                  background: code === language ? "var(--color-ground-2)" : "none",
                  border: "none",
                  cursor: "pointer",
                  transition: "background .2s ease, color .2s ease",
                }}
                aria-current={code === language ? "true" : undefined}
              >
                {code.toUpperCase()} · {name}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
