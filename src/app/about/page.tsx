import Image from "next/image";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Aravind Jegajeeva Rajasekar, architect by training, designer by practice. B.Arch SPA Vijayawada, M.Des NID Gandhinagar. Senior Product Designer at Trmeric.",
};

const TIMELINE = [
  { year: "2024 – now",  event: "Senior Product Designer, Trmeric",         detail: "Founding team. Sole designer." },
  { year: "2024 – 2026", event: "M.Des New Media Design, NID Gandhinagar",   detail: "Research-led practice. Thesis: Realm of Elementals." },
  { year: "2018 – 2024", event: "B.Arch, SPA Vijayawada",                   detail: "Six years. Council of Architecture licensed." },
];

export default function AboutPage() {
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
          <div style={{ position: "relative", zIndex: 1 }}>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: ".6rem",
              letterSpacing: ".26em", textTransform: "uppercase",
              color: "var(--color-accent)", opacity: 0.8,
              display: "block", marginBottom: "2rem",
            }}>
              Aravind J · About
            </span>
            <h1 style={{
              fontFamily: "var(--font-display)", fontWeight: 300,
              fontSize: "clamp(2.6rem, 7vw, 5.5rem)", lineHeight: 1.0,
              letterSpacing: "-.025em", color: "var(--color-paper)",
              marginBottom: "2rem",
            }}>
              Architect by training.
              <br />
              <em style={{ fontStyle: "italic", color: "var(--color-accent-bright)" }}>
                Designer by practice.
              </em>
            </h1>
            <div style={{
              display: "flex", gap: "2.5rem", flexWrap: "wrap",
              paddingTop: "1.5rem", borderTop: "1px solid var(--line)",
            }}>
              {[
                "Senior Product Designer · Trmeric",
                "M.Des New Media Design · NID Gandhinagar",
              ].map((t) => (
                <span key={t} style={{
                  fontFamily: "var(--font-mono)", fontSize: ".55rem",
                  letterSpacing: ".18em", textTransform: "uppercase",
                  color: "var(--color-graphite-light)", opacity: 0.55,
                }}>{t}</span>
              ))}
            </div>
          </div>
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
            <div style={{ display: "flex", flexDirection: "column", gap: "1.6rem" }}>
              <p style={{ fontSize: "1rem", color: "var(--color-graphite-light)", lineHeight: 1.8 }}>
                I came to design through architecture. Six years at SPA Vijayawada, licensed by the
                Council of Architecture, taught me to hold a system in my head at full scale while
                still caring about the door handle. Buildings are systems. So are interfaces. The
                patience is the same; the medium is faster.
              </p>
              <p style={{ fontSize: "1rem", color: "var(--color-graphite-light)", lineHeight: 1.8 }}>
                I taught myself web development between architecture school and NID because I wanted
                a medium where I could test an idea the same afternoon I had it. My prototypes are
                not wireframes. They are functional, interactive, data-driven artifacts. When
                engineering builds from my prototypes directly, that's the intended workflow.
              </p>
              <p style={{ fontSize: "1rem", color: "var(--color-graphite-light)", lineHeight: 1.8 }}>
                NID Gandhinagar gave me research rigour. The M.Des in New Media Design taught me to
                know when an instinct is actually an insight, and when it isn't. My graduation
                project, Realm of Elementals, was that discipline in full: nine months of research
                on care, decentering, and ecological identity, built into a WebAR experience.
              </p>
              <p style={{ fontSize: "1rem", color: "var(--color-graphite-light)", lineHeight: 1.8 }}>
                Currently: Senior Product Designer at Trmeric, sole designer on the founding team.
                I own the full design surface of an AI-native enterprise SaaS platform, from
                information architecture to production-grade prototypes. I sit in product strategy
                as an equal, not as a service provider.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div style={{
                position: "relative", width: "100%", aspectRatio: "3/4",
                borderRadius: "2px", overflow: "hidden",
                border: "1px solid var(--line)",
              }}>
                <Image
                  src="/images/headshot.jpg"
                  alt="Portrait of Aravind J"
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
                <span>Download résumé</span>
                <span aria-hidden="true">↓</span>
              </a>
            </div>
          </div>
        </section>

        {/* ── TIMELINE ── */}
        <section style={{
          background: "var(--color-ground-2)",
          borderTop: "1px solid var(--line)",
          padding: "8rem var(--pad)",
          position: "relative", zIndex: 1,
        }}>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: ".6rem",
            letterSpacing: ".26em", textTransform: "uppercase",
            color: "var(--color-accent)", opacity: 0.8,
            display: "block", marginBottom: "3rem",
          }}>
            Timeline
          </span>
          <div style={{ maxWidth: "800px" }}>
            {TIMELINE.map((item) => (
              <div key={item.year} style={{
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
                  {item.year}
                </span>
                <div>
                  <div style={{ color: "var(--color-paper)", fontSize: ".9375rem", marginBottom: ".3rem" }}>
                    {item.event}
                  </div>
                  <div style={{ color: "var(--color-graphite-light)", fontSize: ".8125rem", lineHeight: 1.5 }}>
                    {item.detail}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── ON THIS SITE ── */}
        <section style={{
          background: "var(--color-ground)",
          borderTop: "1px solid var(--line)",
          padding: "8rem var(--pad)",
          position: "relative", zIndex: 1,
        }}>
          <div style={{ maxWidth: "760px" }}>
            <span style={{
              fontFamily: "var(--font-mono)", fontSize: ".6rem",
              letterSpacing: ".26em", textTransform: "uppercase",
              color: "var(--color-accent)", opacity: 0.8,
              display: "block", marginBottom: "1.2rem",
            }}>
              On this site
            </span>
            <p style={{
              fontFamily: "var(--font-display)", fontWeight: 400,
              fontSize: "clamp(1.5rem, 3vw, 2.6rem)", lineHeight: 1.1,
              letterSpacing: "-.02em", color: "var(--color-paper)",
              marginBottom: "2rem",
            }}>
              The form is the argument.
            </p>
            <p style={{ fontSize: "1rem", color: "var(--color-graphite-light)", lineHeight: 1.8, maxWidth: "52ch" }}>
              The architectural section metaphor, moving inward along a Z-axis, is the SPA
              Vijayawada self: structure, depth, intentional space. The particle ecosystem,
              organic and living with distinct behaviours per domain, is the NID self:
              research, ecology, care. The WebGL binding built in real time is the developer
              self that learned to build ideas the same day he had them.
            </p>
          </div>
        </section>

        {/* ── CONTACT ── */}
        <section style={{
          background: "var(--color-ground-2)",
          borderTop: "1px solid var(--line)",
          padding: "8rem var(--pad) 6rem",
          position: "relative", zIndex: 1,
        }}>
          <span style={{
            fontFamily: "var(--font-mono)", fontSize: ".6rem",
            letterSpacing: ".26em", textTransform: "uppercase",
            color: "var(--color-accent)", opacity: 0.8,
            display: "block", marginBottom: "2rem",
          }}>
            Reach
          </span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
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
              LinkedIn ↗
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
              View work →
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
