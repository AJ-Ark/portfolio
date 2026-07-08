"use client";

import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import CursorGlow from "@/components/ui/CursorGlow";
import Preloader from "@/components/ui/Preloader";
import HomeReel from "@/components/ui/HomeReel";
import Reveal from "@/components/ui/Reveal";
import { useTranslation } from "@/lib/TranslationContext";
import type { Domain } from "@/data/projects";

const DOMAINS: {
  slug: Domain;
  headline: string;
  body: string;
  label: string;
  accent: string;
  coverImage?: string;
}[] = [
  {
    slug: "realm",
    headline: "Realm of Elementals",
    body: "A WebAR butterfly-raising experience. Care, not confrontation, is what changes behaviour.",
    label: "WebAR · Tata Motors · Graduation thesis",
    accent: "#d9b46a",
    coverImage: "/images/realm/installation-cover.jpg",
  },
  {
    slug: "rippl",
    headline: "Rippl",
    body: "A projector-lamp that fights distracted reading and turns notetaking into a two-way interaction.",
    label: "Interaction Design · Physical Computing",
    accent: "#4FA8A0",
    coverImage: "/images/rippl/rippl-hero.jpg",
  },
  {
    slug: "trmeric",
    headline: "Trmeric",
    body: "23 surfaces. One AI-native enterprise platform. Designed and built as sole designer on the founding team.",
    label: "Enterprise SaaS · AI Design · Founding Team",
    accent: "#FFA426",
    coverImage: "/images/trmeric/allinone.png",
  },
  {
    slug: "rozi",
    headline: "Rozi",
    body: "A marketplace for India's 40 crore informal workers. Register, find a job, get paid. The contractor takes nothing.",
    label: "Service Design · UX Research · SARVA Designathon",
    accent: "#C94030",
    coverImage: "/images/rozi/hero-phones.png",
  },
];

export default function Home() {
  const { t } = useTranslation();
  return (
    <>
      <Preloader />
      <CursorGlow />
      <Navigation />

      <main id="main-content" style={{ cursor: "none" }}>

        {/* ═══════════════════════════════════════════════
            HERO + DOMAINS — reels-style paginated block
        ═══════════════════════════════════════════════ */}
        <HomeReel domains={DOMAINS} />

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
