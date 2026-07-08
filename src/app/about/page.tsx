"use client";

import Image from "next/image";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { useTranslation } from "@/lib/TranslationContext";

const TIMELINE_KEYS = [
  { yearKey: "about.timeline.2024", eventKey: "about.timeline.2024_event", detailKey: "about.timeline.2024_detail" },
  { yearKey: "about.timeline.2024_2026", eventKey: "about.timeline.2024_2026_event", detailKey: "about.timeline.2024_2026_detail" },
  { yearKey: "about.timeline.2018", eventKey: "about.timeline.2018_event", detailKey: "about.timeline.2018_detail" },
];

export default function AboutPage() {
  const { t } = useTranslation();
  return (
    <>
      <Navigation />
      <main id="main-content">

        {/* ── HERO — particles visible, text anchored bottom ── */}
        <section style={{
          minHeight: "100dvh",
          display: "flex", flexDirection: "column", justifyContent: "flex-end",
          padding: "0 var(--pad) 4rem",
          position: "relative",
        }}>
          {/* Gradient so text stays legible over idle particle sphere */}
          <div aria-hidden="true" style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: "60%",
            background: "linear-gradient(to top, var(--color-ground) 30%, transparent 100%)",
            pointerEvents: "none",
          }} />
          <Reveal stagger style={{ position: "relative", zIndex: 1 }}>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: ".6rem",
              letterSpacing: ".26em", textTransform: "uppercase",
              color: "var(--color-accent)", opacity: 0.8,
              display: "block", marginBottom: "2rem",
            }}>
              {t("about.label")}
            </span>
            <h1 style={{
              fontFamily: "var(--font-display)", fontWeight: 300,
              fontSize: "clamp(2.6rem, 7vw, 5.5rem)", lineHeight: 1.0,
              letterSpacing: "-.025em", color: "var(--color-paper)",
              marginBottom: "2rem",
            }}>
              {t("about.subtitle")}
              <br />
              <em style={{ fontStyle: "italic", color: "var(--color-accent-bright)" }}>
                {t("about.subtitle2")}
              </em>
            </h1>
            <div style={{
              display: "flex", gap: "2.5rem", flexWrap: "wrap",
              paddingTop: "1.5rem", borderTop: "1px solid var(--line)",
            }}>
              {[
                t("about.role"),
                t("about.education"),
              ].map((role) => (
                <span key={role} style={{
                  fontFamily: "var(--font-mono)", fontSize: ".55rem",
                  letterSpacing: ".18em", textTransform: "uppercase",
                  color: "var(--color-graphite-light)", opacity: 0.55,
                }}>{role}</span>
              ))}
            </div>
          </Reveal>
        </section>

        {/* ── BIO + PORTRAIT — solid bg sits above particle canvas ── */}
        <section style={{
          background: "var(--color-ground)",
          borderTop: "1px solid var(--line)",
          padding: "8rem var(--pad)",
          position: "relative", zIndex: 1,
        }}>
          <div
            className="mobile-stack"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "5rem",
              alignItems: "start",
              maxWidth: "1200px",
            }}
          >
            <Reveal stagger style={{ display: "flex", flexDirection: "column", gap: "1.6rem" }}>
              <p style={{ fontSize: "1rem", color: "var(--color-graphite-light)", lineHeight: 1.8 }}>
                {t("about.bio1")}
              </p>
              <p style={{ fontSize: "1rem", color: "var(--color-graphite-light)", lineHeight: 1.8 }}>
                {t("about.bio2")}
              </p>
              <p style={{ fontSize: "1rem", color: "var(--color-graphite-light)", lineHeight: 1.8 }}>
                {t("about.bio3")}
              </p>
              <p style={{ fontSize: "1rem", color: "var(--color-graphite-light)", lineHeight: 1.8 }}>
                {t("about.bio4")}
              </p>
            </Reveal>

            <Reveal stagger delay={0.1} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{
                position: "relative", width: "100%", aspectRatio: "3/4",
                borderRadius: "2px", overflow: "hidden",
                border: "1px solid var(--line)",
              }}>
                <Image
                  src="/images/headshot.jpg"
                  alt={t("about.portraitAlt")}
                  fill
                  style={{ objectFit: "cover", objectPosition: "center top" }}
                />
              </div>
              <a
                href="/Aravind-J-Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="resume-link"
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  gap: "1rem",
                  fontFamily: "var(--font-mono)", fontSize: ".62rem",
                  letterSpacing: ".2em", textTransform: "uppercase",
                  color: "var(--color-accent)",
                  border: "1px solid var(--line)", borderRadius: "4px",
                  padding: ".95rem 1.2rem",
                  transition: "border-color .2s ease, color .2s ease",
                }}
              >
                <span>{t("about.downloadResume")}</span>
                <span aria-hidden="true">↓</span>
              </a>
            </Reveal>
          </div>
        </section>

        {/* ── TIMELINE ── */}
        <section style={{
          background: "var(--color-ground-2)",
          borderTop: "1px solid var(--line)",
          padding: "8rem var(--pad)",
          position: "relative", zIndex: 1,
        }}>
          <Reveal as="span" style={{
            fontFamily: "var(--font-mono)", fontSize: ".6rem",
            letterSpacing: ".26em", textTransform: "uppercase",
            color: "var(--color-accent)", opacity: 0.8,
            display: "block", marginBottom: "3rem",
          }}>
            {t("about.timeline.title")}
          </Reveal>
          <Reveal stagger style={{ maxWidth: "800px" }}>
            {TIMELINE_KEYS.map((item) => (
              <div key={item.yearKey} style={{
                display: "grid", gridTemplateColumns: "9rem 1fr",
                gap: "2rem", padding: "2rem 0",
                borderTop: "1px solid var(--line)",
                alignItems: "baseline",
              }}>
                <span style={{
                  fontFamily: "var(--font-mono)", fontSize: ".55rem",
                  letterSpacing: ".18em", textTransform: "uppercase",
                  color: "var(--color-graphite-light)", opacity: 0.55,
                }}>
                  {t(item.yearKey)}
                </span>
                <div>
                  <div style={{ color: "var(--color-paper)", fontSize: ".9375rem", marginBottom: ".3rem" }}>
                    {t(item.eventKey)}
                  </div>
                  <div style={{ color: "var(--color-graphite-light)", fontSize: ".8125rem", lineHeight: 1.5 }}>
                    {t(item.detailKey)}
                  </div>
                </div>
              </div>
            ))}
          </Reveal>
        </section>

        {/* ── ON THIS SITE ── */}
        <section style={{
          background: "var(--color-ground)",
          borderTop: "1px solid var(--line)",
          padding: "8rem var(--pad)",
          position: "relative", zIndex: 1,
        }}>
          <Reveal stagger style={{ maxWidth: "760px" }}>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: ".6rem",
              letterSpacing: ".26em", textTransform: "uppercase",
              color: "var(--color-accent)", opacity: 0.8,
              display: "block", marginBottom: "1.2rem",
            }}>
              {t("about.site.label")}
            </span>
            <p style={{
              fontFamily: "var(--font-display)", fontWeight: 400,
              fontSize: "clamp(1.5rem, 3vw, 2.6rem)", lineHeight: 1.1,
              letterSpacing: "-.02em", color: "var(--color-paper)",
              marginBottom: "2rem",
            }}>
              {t("about.site.title")}
            </p>
            <p style={{ fontSize: "1rem", color: "var(--color-graphite-light)", lineHeight: 1.8, maxWidth: "52ch" }}>
              {t("about.site.body")}
            </p>
          </Reveal>
        </section>

        {/* ── CONTACT ── */}
        <section style={{
          background: "var(--color-ground-2)",
          borderTop: "1px solid var(--line)",
          padding: "8rem var(--pad) 6rem",
          position: "relative", zIndex: 1,
        }}>
          <Reveal as="span" style={{
            fontFamily: "var(--font-mono)", fontSize: ".6rem",
            letterSpacing: ".26em", textTransform: "uppercase",
            color: "var(--color-accent)", opacity: 0.8,
            display: "block", marginBottom: "2rem",
          }}>
            {t("about.reach")}
          </Reveal>
          <Reveal delay={0.1} style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
            <a
              href="mailto:aravindspav@gmail.com"
              style={{
                fontFamily: "var(--font-mono)", fontSize: ".62rem",
                letterSpacing: ".16em", textTransform: "uppercase",
                background: "var(--color-paper)", color: "var(--color-ink)",
                padding: ".7rem 1.4rem", borderRadius: "2px",
              }}
            >
              aravindspav@gmail.com →
            </a>
            <a
              href="https://www.linkedin.com/in/aravind-j-5a6b8b136/"
              target="_blank" rel="noopener noreferrer"
              style={{
                fontFamily: "var(--font-mono)", fontSize: ".62rem",
                letterSpacing: ".16em", textTransform: "uppercase",
                border: "1px solid var(--line)", color: "var(--color-graphite-light)",
                padding: ".7rem 1.4rem", borderRadius: "2px",
              }}
            >
              {t("footer.linkedin")} ↗
            </a>
            <Link
              href="/work"
              style={{
                fontFamily: "var(--font-mono)", fontSize: ".62rem",
                letterSpacing: ".16em", textTransform: "uppercase",
                border: "1px solid var(--line)", color: "var(--color-graphite-light)",
                padding: ".7rem 1.4rem", borderRadius: "2px",
              }}
            >
              {t("about.viewWork")}
            </Link>
          </Reveal>
        </section>

      </main>
      <Footer />
    </>
  );
}
