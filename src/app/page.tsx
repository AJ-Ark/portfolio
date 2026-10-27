"use client";

import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import Preloader from "@/components/ui/Preloader";
import HomeSurvey from "@/components/home/HomeSurvey";
import Reveal from "@/components/ui/Reveal";
import { useTranslation } from "@/lib/TranslationContext";

export default function Home() {
  const { t } = useTranslation();
  return (
    <>
      <Preloader />
      <Navigation />

      {/* Native-cursor suppression now lives in globals.css, gated on the
          global CursorGlow (layout.tsx) being active — no inline override. */}
      <main id="main-content">

        {/* ═══════════════════════════════════════════════
            HERO + WORK — The Survey (see src/components/home)
        ═══════════════════════════════════════════════ */}
        <HomeSurvey />

        {/* ═══════════════════════════════════════════════
            ABOUT — three-column editorial strip
        ═══════════════════════════════════════════════ */}
        <section
          style={{
            padding: "5rem var(--pad)",
            borderTop: "1px solid var(--line)",
          }}
        >
          <Reveal
            className="mobile-stack"
            stagger
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "3rem",
              maxWidth: "960px",
            }}
          >
            <div>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: ".56rem",
                  letterSpacing: ".22em",
                  textTransform: "uppercase",
                  color: "var(--color-accent)",
                  display: "block",
                  marginBottom: ".8rem",
                  opacity: 0.7,
                }}
              >
                {t("home.currently")}
              </span>
              <p
                style={{
                  fontSize: ".9rem",
                  color: "var(--color-graphite-light)",
                  lineHeight: 1.7,
                }}
              >
                {t("home.currentlyBody")}
              </p>
            </div>

            <div>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: ".56rem",
                  letterSpacing: ".22em",
                  textTransform: "uppercase",
                  color: "var(--color-accent)",
                  display: "block",
                  marginBottom: ".8rem",
                  opacity: 0.7,
                }}
              >
                {t("home.background")}
              </span>
              <p
                style={{
                  fontSize: ".9rem",
                  color: "var(--color-graphite-light)",
                  lineHeight: 1.7,
                }}
              >
                {t("home.backgroundBody")}
              </p>
            </div>

            <div>
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: ".56rem",
                  letterSpacing: ".22em",
                  textTransform: "uppercase",
                  color: "var(--color-accent)",
                  display: "block",
                  marginBottom: ".8rem",
                  opacity: 0.7,
                }}
              >
                {t("home.reach")}
              </span>
              <div style={{ display: "flex", flexDirection: "column", gap: ".6rem" }}>
                {[
                  { label: "aravindspav@gmail.com →", href: "mailto:aravindspav@gmail.com" },
                  { label: `${t("footer.linkedin")} →`, href: "https://www.linkedin.com/in/aravind-j-5a6b8b136/" },
                ].map(({ label, href }) => (
                  <a
                    key={href}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: ".6rem",
                      letterSpacing: ".14em",
                      textTransform: "uppercase",
                      color: "var(--color-graphite-light)",
                    }}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </Reveal>
        </section>

      </main>

      <Footer />
    </>
  );
}
