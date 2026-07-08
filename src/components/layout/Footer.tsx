"use client";

import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import { useTranslation } from "@/lib/TranslationContext";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer
      style={{
        padding: "3rem var(--spacing-page) 2.5rem",
        borderTop: "1px solid var(--line)",
        background: "var(--color-ground-2, var(--color-ground))",
      }}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <span
          className="aj-logo"
          role="img"
          aria-label="Aravind J"
          style={{ display: "block", width: 32, height: 32, flexShrink: 0 }}
        />

        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: ".5rem",
            letterSpacing: ".1em",
            textTransform: "uppercase",
            color: "var(--color-graphite-light)",
            opacity: .35,
            textAlign: "center",
          }}
          className="hidden md:block"
        >
          <div>{t("footer.portfolio")}</div>
          <div>{t("footer.revision")}</div>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="mailto:aravindspav@gmail.com"
            className="footer-link"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: ".65rem",
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: "var(--color-graphite-light)",
            }}
          >
            {t("footer.email")}
          </a>
          <a
            href="https://www.linkedin.com/in/aravind-j-5a6b8b136/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: ".65rem",
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: "var(--color-graphite-light)",
            }}
          >
            {t("footer.linkedin")}
          </a>
          <a
            href="/Aravind-J-Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: ".65rem",
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: "var(--color-graphite-light)",
            }}
          >
            {t("footer.resume")}
          </a>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: ".6rem",
              letterSpacing: ".1em",
              color: "var(--color-graphite-light)",
              opacity: .35,
            }}
          >
            {t("footer.copyright")}
          </span>
          <LanguageSwitcher />
        </div>
      </div>
    </footer>
  );
}
