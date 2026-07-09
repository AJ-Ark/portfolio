"use client";

import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
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
  /* The clip that plays between the name and description on the reel slide.
     Rippl/Rozi have real footage; Trmeric/Realm use an animated still until
     dedicated clips exist. */
  clip: { kind: "video" | "image"; src: string; poster?: string; alt: string };
}[] = [
  {
    slug: "realm",
    headline: "Realm of Elementals",
    body: "A WebAR butterfly-raising experience. Care, not confrontation, is what changes behaviour.",
    label: "WebAR · Tata Motors · Graduation thesis",
    accent: "#d9b46a",
    coverImage: "/images/realm/installation-cover.jpg",
    clip: { kind: "image", src: "/images/realm/installation-cover.jpg", alt: "Realm of Elementals installation" },
  },
  {
    slug: "rippl",
    headline: "Rippl",
    body: "A projector-lamp that fights distracted reading and turns notetaking into a two-way interaction.",
    label: "Interaction Design · Physical Computing",
    accent: "#4FA8A0",
    coverImage: "/images/rippl/rippl-hero.jpg",
    clip: { kind: "video", src: "/videos/rippl/flows/marking.mp4", poster: "/videos/rippl/flows/marking-poster.webp", alt: "Rippl marking interaction" },
  },
  {
    slug: "trmeric",
    headline: "Trmeric",
    body: "23 surfaces. One AI-native enterprise platform. Designed and built as sole designer on the founding team.",
    label: "Enterprise SaaS · AI Design · Founding Team",
    accent: "#FFA426",
    coverImage: "/images/trmeric/allinone.png",
    clip: { kind: "image", src: "/images/trmeric/allinone.png", alt: "Trmeric platform surfaces" },
  },
  {
    slug: "rozi",
    headline: "Rozi",
    body: "A marketplace for India's 40 crore informal workers. Register, find a job, get paid. The contractor takes nothing.",
    label: "Service Design · UX Research · SARVA Designathon",
    accent: "#C94030",
    coverImage: "/images/rozi/hero-phones.png",
    clip: { kind: "video", src: "/videos/rozi/flow-02-jobs.mp4", poster: "/videos/rozi/flow-02-jobs-poster.webp", alt: "Rozi job-finding flow" },
  },
];

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
