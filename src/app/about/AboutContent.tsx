"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { useInView } from "@/hooks/useInView";
import {
  prefersReducedMotionNow,
  usePrefersReducedMotion,
} from "@/hooks/usePrefersReducedMotion";
import { useParticle, type FormationName } from "@/lib/particleContext";
import { useTranslation } from "@/lib/TranslationContext";

const TIMELINE_KEYS = [
  { yearKey: "about.timeline.2024", eventKey: "about.timeline.2024_event", detailKey: "about.timeline.2024_detail" },
  { yearKey: "about.timeline.2024_2026", eventKey: "about.timeline.2024_2026_event", detailKey: "about.timeline.2024_2026_detail" },
  { yearKey: "about.timeline.2018", eventKey: "about.timeline.2018_event", detailKey: "about.timeline.2018_detail" },
];

/* ═══════════════════════════════════════════════════════════════════
   THE THREE SELVES — the page used to TELL the visitor the dust morphs
   per-domain ("On this site" prose). It never showed it. This is the
   fix: each self's own paragraph requests its own formation for as
   long as it's actually the one being read, released the moment the
   visitor scrolls past it — same owner-keyed request/release contract
   as Settling.tsx's footer monogram. Each instance uses a DISTINCT
   owner ("about-<formation>"): the paragraphs enter and leave view in
   separate IntersectionObserver cycles (hundreds of px apart on a
   normal viewport), not one batched commit, so a shared owner would let
   a leaving paragraph release the entry a still-visible sibling holds —
   dropping the field to idle mid-read. Distinct owners keep each
   visible paragraph's formation on the stack until it alone leaves.

   The bio section itself had to stop painting an opaque background for
   any of this to be visible at all — it now lets the sitewide dust
   canvas (z-index 0, under every route's content) show through, the
   same way the hero and the epilogue band already do.
   ═══════════════════════════════════════════════════════════════════ */
function SelfMoment({
  formation,
  children,
}: {
  formation: FormationName;
  children: ReactNode;
}) {
  const { requestFormation } = useParticle();
  const reducedMotion = usePrefersReducedMotion();
  const { ref, inView } = useInView<HTMLParagraphElement>({
    once: false,
    threshold: 0.4,
  });

  useEffect(() => {
    if (!inView || reducedMotion || prefersReducedMotionNow()) return;
    // Distinct owner PER formation, not a shared "about" — otherwise a
    // paragraph leaving view releases the single shared stack entry that a
    // still-visible sibling installed, stranding the field to idle mid-read.
    const owner = `about-${formation}`;
    requestFormation(formation, { owner });
    return () => requestFormation(null, { owner });
  }, [inView, reducedMotion, requestFormation, formation]);

  return (
    <p ref={ref} style={{ fontSize: "1rem", color: "var(--color-graphite-light)", lineHeight: 1.8 }}>
      {children}
    </p>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   PORTRAIT — particle-dither dissolve, once, on scroll-into-view.
   An SVG feTurbulence→feDisplacementMap filter warps the photo through
   noise while it fades in; a SMIL <animate> (begin="indefinite") drives
   the displacement scale back to 0 because CSS cannot keyframe SVG
   filter-primitive attributes — only the opacity crossfade is CSS.

   SSR/no-JS-safe by the same anti-flash rule Reveal.tsx uses: the
   portrait ships at opacity 1 with no filter; only a client effect (and
   only when the box is actually below the fold at mount) hides it and
   arms the dissolve. Reduced motion skips the effect entirely — the
   portrait simply renders, immediately, forever.
   ═══════════════════════════════════════════════════════════════════ */
function DissolvePortrait({ src, alt }: { src: string; alt: string }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const animRef = useRef<SVGAnimateElement | null>(null);
  const filterId = `portrait-dissolve-${useId().replace(/[^a-zA-Z0-9]/g, "")}`;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || prefersReducedMotionNow()) return; // calm path: stays fully visible, no filter ever touches it

    const fold = window.innerHeight * 0.9;
    if (el.getBoundingClientRect().top < fold) return; // already on screen at mount — never hide-then-reveal

    el.style.opacity = "0";
    el.style.filter = `url(#${filterId})`;

    if (typeof IntersectionObserver === "undefined") {
      el.style.opacity = "1";
      el.style.filter = "none";
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        el.style.transition = "opacity 1.2s var(--ease)";
        el.style.opacity = "1";
        animRef.current?.beginElement();
        window.setTimeout(() => {
          el.style.filter = "none"; // settle — drop the filter once resolved
        }, 1300);
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [filterId]);

  return (
    <>
      <svg aria-hidden="true" focusable="false" style={{ position: "absolute", width: 0, height: 0 }}>
        <defs>
          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.08" numOctaves="2" seed="7" result="portrait-noise" />
            <feDisplacementMap in="SourceGraphic" in2="portrait-noise" xChannelSelector="R" yChannelSelector="G" scale="0">
              <animate
                ref={animRef}
                attributeName="scale"
                values="80;0"
                keyTimes="0;1"
                dur="1.1s"
                begin="indefinite"
                fill="freeze"
                calcMode="spline"
                keySplines="0.22 1 0.36 1"
              />
            </feDisplacementMap>
          </filter>
        </defs>
      </svg>
      <div
        ref={wrapRef}
        style={{
          position: "relative", width: "100%", aspectRatio: "3/4",
          borderRadius: "2px", overflow: "hidden",
          border: "1px solid var(--line)",
          background: "var(--color-ground)",
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill
          style={{ objectFit: "cover", objectPosition: "center top" }}
        />
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════════════════════════════
   TIMELINE SPINE — a rail that draws itself top-to-bottom once the
   list scrolls into view (a plain transform: scaleY transition, not a
   scroll-scrubbed one), entries staggered on top of it via the same
   <Reveal stagger> the list already used. Reduced motion renders the
   spine fully drawn from first paint via the CSS media query alone —
   no JS timing dependency.
   ═══════════════════════════════════════════════════════════════════ */
function TimelineSpine({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement | null>(null);
  // SSR-safe like DissolvePortrait/Reveal: the spine ships DRAWN (scaleY 1).
  // Only a client effect, and only when the rail is genuinely below the fold
  // at mount, arms it (instant hide) and then draws it on scroll-in. A no-JS
  // visitor, or one already past the rail, keeps a fully-drawn spine.
  const [phase, setPhase] = useState<"visible" | "armed" | "drawn">("visible");

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotionNow()) return; // calm path: stays drawn
    const fold = window.innerHeight * 0.9;
    if (el.getBoundingClientRect().top < fold) return; // already on screen — stay drawn
    if (typeof IntersectionObserver === "undefined") return; // no IO — stay drawn
    setPhase("armed"); // hide instantly (element is below the fold, no flash)
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        setPhase("drawn"); // animate the draw
      },
      { rootMargin: "0px 0px -10% 0px" }, // mirrors Reveal's own trigger point
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      data-spine={phase}
      className="about-timeline"
      style={{ position: "relative", maxWidth: "800px", paddingLeft: "1.75rem" }}
    >
      <style>{TIMELINE_SPINE_CSS}</style>
      <span className="about-timeline-spine" aria-hidden="true" />
      <Reveal stagger>{children}</Reveal>
    </div>
  );
}

const TIMELINE_SPINE_CSS = `
.about-timeline-spine {
  position: absolute;
  left: 0;
  top: .4rem;
  bottom: .4rem;
  width: 2px;
  background: linear-gradient(to bottom, var(--color-accent), color-mix(in srgb, var(--color-accent) 20%, transparent));
  transform: scaleY(1);
  transform-origin: top center;
}
.about-timeline[data-spine="armed"] .about-timeline-spine {
  transform: scaleY(0);
}
.about-timeline[data-spine="drawn"] .about-timeline-spine {
  transform: scaleY(1);
  transition: transform 1s var(--ease);
}
.about-timeline-node {
  position: absolute;
  left: -1.75rem;
  top: 50%;
  translate: 0 -50%;
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--color-accent);
  box-shadow: 0 0 0 3px var(--color-ground-2);
}
@media (prefers-reduced-motion: reduce) {
  .about-timeline-spine {
    transform: scaleY(1) !important;
    transition: none !important;
  }
}
`;

/**
 * Client island: all translated, interactive-context-dependent content for
 * the About page. Extracted so `page.tsx` can be a server component that
 * renders the static shell (Navigation/Footer) around this — `useTranslation`
 * requires a client boundary since it reads browser-detected language.
 */
export default function AboutContent() {
  const { t } = useTranslation();
  return (
    <>
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

      {/* ── BIO + PORTRAIT — no opaque backing: the three-selves paragraphs
          each pull the sitewide dust field into their own formation while
          they're the one being read, so the section has to let that field
          show through instead of covering it (see SelfMoment above). ── */}
      <section style={{
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
            {/* The architect — SPA Vijayawada. Structure, depth, system. */}
            <SelfMoment formation="trmeric">{t("about.bio1")}</SelfMoment>
            {/* The developer — self-taught, same-afternoon prototypes. */}
            <SelfMoment formation="rippl">{t("about.bio2")}</SelfMoment>
            {/* The NID designer — research rigour, ecological identity. */}
            <SelfMoment formation="realm">{t("about.bio3")}</SelfMoment>
            {/* Now — the three selves at once, not a formation of its own. */}
            <p style={{
              fontSize: "1rem", color: "var(--color-graphite-light)", lineHeight: 1.8,
              paddingTop: "1.6rem", borderTop: "1px solid var(--line)",
            }}>
              {t("about.bio4")}
            </p>
          </Reveal>

          <Reveal stagger delay={0.1} style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <DissolvePortrait src="/images/headshot.jpg" alt={t("about.portraitAlt")} />
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

      {/* ── TIMELINE — spine draws itself once, entries staggered ── */}
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
        <TimelineSpine>
          {TIMELINE_KEYS.map((item) => (
            <div key={item.yearKey} style={{
              position: "relative",
              display: "grid", gridTemplateColumns: "9rem 1fr",
              gap: "2rem", padding: "2rem 0",
              borderTop: "1px solid var(--line)",
              alignItems: "baseline",
            }}>
              <span className="about-timeline-node" aria-hidden="true" />
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
        </TimelineSpine>
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
    </>
  );
}
