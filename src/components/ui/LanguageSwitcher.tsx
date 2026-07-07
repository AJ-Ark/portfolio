"use client";

import { useState } from "react";
import { useTranslation } from "@/lib/TranslationContext";
import { SUPPORTED_LANGUAGES, type LanguageCode } from "@/lib/i18n";

export default function LanguageSwitcher() {
  const { language, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <button
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
        aria-expanded={isOpen}
      >
        {language.toUpperCase()}
      </button>

      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            right: 0,
            marginTop: ".5rem",
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
        </div>
      )}
    </div>
  );
}
