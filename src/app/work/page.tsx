"use client";

import { useCallback, useEffect, useRef, type CSSProperties } from "react";
import Link from "next/link";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/ui/Reveal";
import { projects, type Domain } from "@/data/projects";
import { useParticle, useWarpNavigate } from "@/lib/particleContext";
import { useTranslation } from "@/lib/TranslationContext";
import { prefersReducedMotionNow } from "@/hooks/usePrefersReducedMotion";

/* ═══════════════════════════════════════════════════════════════════
   THE OVERLOOK — /work
   Four quiet editorial rows over the persistent dust field. Hovering or
   focusing a row morphs the field into that project's formation beside
   the list (offsetX 0.55), crossfades the page palette to the project's
   domain, and fades in quiet mono annotations. Click / Enter = the warp
   dive (useWarpNavigate — the transition doubles as the loader).

   SSR / no-JS: everything below ships fully visible. The hover-fade
   grammar for annotations and the sibling-dimming are OPT-IN — enabled
   only after hydration via [data-live] on the list wrapper (same
   pattern as <Reveal>), so a JS-less render is a complete, readable
   index. Reduced motion: [data-live] is never set, hover handlers
   no-op, and a media query belt-and-braces everything back to plain.
   ═══════════════════════════════════════════════════════════════════ */

/* Where the formation cluster seats horizontally (-1 left … 1 right):
   beside the list, over the annotation column. */
const FORMATION_OFFSET_X = 0.55;

/* Scoped styles — this page owns no global CSS, so the underline-slide
   grammar (same wipe as .nav-link: scaleX hairline, exit right / enter
   left, .45s var(--ease)) is reproduced here at display scale. */
const OVERLOOK_CSS = `
  .ovl-head { max-width: 42rem; }
  .ovl-h1 {
    font-family: var(--font-display);
    font-optical-sizing: auto;
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 300;
    letter-spacing: -0.02em;
    color: var(--color-paper);
    margin-bottom: 1rem;
  }
  .ovl-lede {
    color: var(--color-graphite-light);
    font-size: .9375rem;
    line-height: 1.6;
  }
  .ovl-hint {
    display: inline-flex;
    align-items: center;
    gap: .65rem;
    margin-top: 2.25rem;
    font-family: var(--font-mono);
    font-size: .625rem;
    letter-spacing: .16em;
    text-transform: uppercase;
    color: var(--color-graphite-light);
  }
  .ovl-hint::before {
    content: "";
    width: 2rem;
    height: 1px;
    background: var(--line);
    flex-shrink: 0;
  }
  /* Tracking breaks Arabic letter joining — release it under RTL. */
  html[dir="rtl"] .ovl-hint { letter-spacing: normal; }

  .ovl-list {
    list-style: none;
    margin: 0;
    padding: 0;
    border-bottom: 1px solid var(--line);
  }
  .ovl-item {
    border-top: 1px solid var(--line);
    transition: border-color .9s var(--ease);
  }

  .ovl-row {
    position: relative;
    display: grid;
    grid-template-columns: 2.25rem minmax(0, 1fr);
    column-gap: 1.25rem;
    row-gap: 1.1rem;
    padding: 2rem 0;
    color: var(--color-paper);
    /* Per-row accent, pre-mixed toward ink in light mode so the hairline
       and year stay legible on cream. */
    --ovl-accent-ink: var(--ovl-accent);
    transition: opacity .45s var(--ease);
  }
  html[data-theme="light"] .ovl-row {
    --ovl-accent-ink: color-mix(in srgb, var(--ovl-accent) 62%, var(--color-ink));
  }

  .ovl-index {
    font-family: var(--font-mono);
    font-size: .6rem;
    letter-spacing: .14em;
    color: var(--color-graphite-light);
    padding-top: .55rem;
  }

  .ovl-title {
    font-family: var(--font-display);
    font-optical-sizing: auto;
    font-size: clamp(1.9rem, 5vw, 3.8rem);
    font-weight: 340;
    line-height: 1.05;
    letter-spacing: -0.02em;
    color: var(--color-paper);
    margin: 0;
  }
  .ovl-title-line {
    position: relative;
    display: inline-block;
  }
  .ovl-title-line::after {
    content: "";
    position: absolute;
    left: 0; right: 0;
    bottom: -0.14em;
    height: 1px;
    background: var(--ovl-accent-ink);
    transform: scaleX(0);
    transform-origin: 100% 50%;               /* exit stage right… */
    transition: transform .45s var(--ease);
  }
  .ovl-row:hover .ovl-title-line::after,
  .ovl-row:focus-visible .ovl-title-line::after {
    transform: scaleX(1);
    transform-origin: 0% 50%;                 /* …enter stage left */
  }

  .ovl-oneliner {
    margin-top: .7rem;
    max-width: 36rem;
    font-size: .9rem;
    line-height: 1.6;
    color: var(--color-graphite-light);
  }

  /* ── Quiet mono annotations (year · role · keywords) ── */
  .ovl-meta {
    grid-column: 2;
    display: flex;
    flex-flow: row wrap;
    gap: .45rem 1.4rem;
    font-family: var(--font-mono);
    color: var(--color-graphite-light);
    /* The annotations sit over the live particle field — a dark halo lifts
       them off the bright gold specks so they stay legible without a boxy
       card. Travels with the text, so it fades in/out with the annotations. */
    text-shadow: 0 1px 14px rgba(0, 0, 0, .7), 0 0 3px rgba(0, 0, 0, .6);
  }
  .ovl-meta-year {
    font-size: .68rem;
    letter-spacing: .14em;
    color: var(--ovl-accent-ink);
  }
  .ovl-meta-role {
    font-size: .74rem;
    line-height: 1.7;
    max-width: 24rem;
    /* Was graphite-light (dim) — the main body of the annotation needs to
       read clearly over the field, so lift it to the paper ink. */
    color: var(--color-paper);
  }
  .ovl-meta-keys {
    font-size: .64rem;
    letter-spacing: .12em;
    text-transform: uppercase;
    line-height: 1.9;
  }

  /* ── Desktop: annotations live in a third column beside the row, in
        the air where the formation gathers ── */
  @media (min-width: 900px) {
    .ovl-row {
      grid-template-columns: 3rem minmax(0, 1fr) clamp(13rem, 23vw, 18rem);
      column-gap: 2rem;
      padding: 2.75rem 0;
    }
    .ovl-index { padding-top: 1.05rem; }
    .ovl-meta {
      grid-column: auto;
      flex-flow: column nowrap;
      gap: .7rem;
      padding-top: .6rem;
    }
  }

  /* ══ Hydration-gated hover grammar — [data-live] is stamped by an
        effect (never under reduced motion), so server HTML and JS-less
        renders keep every annotation visible ══ */
  .ovl-wrap[data-live] .ovl-meta > * {
    opacity: 0;
    translate: 0 6px;
    transition: opacity .5s var(--ease), translate .5s var(--ease);
  }
  .ovl-wrap[data-live] .ovl-meta > :nth-child(2) { transition-delay: .07s; }
  .ovl-wrap[data-live] .ovl-meta > :nth-child(3) { transition-delay: .14s; }
  .ovl-wrap[data-live] .ovl-row:hover .ovl-meta > *,
  .ovl-wrap[data-live] .ovl-row:focus-visible .ovl-meta > * {
    opacity: 1;
    translate: 0 0;
  }

  /* The list quiets around the row being read. */
  .ovl-wrap[data-live] .ovl-list:hover .ovl-row:not(:hover),
  .ovl-wrap[data-live] .ovl-list:focus-within .ovl-row:not(:focus-visible):not(:hover) {
    opacity: .45;
  }

  /* Touch / no-hover devices: annotations are simply always present. */
  @media (hover: none) {
    .ovl-wrap[data-live] .ovl-meta > * { opacity: 1; translate: none; }
    .ovl-wrap[data-live] .ovl-list:hover .ovl-row:not(:hover) { opacity: 1; }
  }

  /* Reduced motion (belt-and-braces — handlers already no-op and
     data-live is never stamped): plain hover/focus styles only. */
  @media (prefers-reduced-motion: reduce) {
    .ovl-wrap[data-live] .ovl-meta > * { opacity: 1; translate: none; transition: none; }
    .ovl-wrap[data-live] .ovl-list:hover .ovl-row:not(:hover),
    .ovl-wrap[data-live] .ovl-list:focus-within .ovl-row:not(:focus-visible):not(:hover) {
      opacity: 1;
    }
  }
`;

export default function WorkIndex() {
  const { t } = useTranslation();
  const { requestFormation, setPreviewDomain } = useParticle();
  const warpNav = useWarpNavigate();
  const wrapRef = useRef<HTMLDivElement | null>(null);

  /* Seat the resting field to the right on mount (offsetX 0.55 — the same
     seat a hover uses), so the dust orb never sits centered over the header
     on first load. Without this the field only shifts right AFTER the first
     hover-out (which sets previewOffsetX), reading as a jump. Applied in all
     motion modes: it's a static seat, not an animation, and it keeps the
     header text clear regardless. */
  useEffect(() => {
    setPreviewDomain(null, FORMATION_OFFSET_X);
  }, [setPreviewDomain]);

  /* Enable the hover-fade/dimming grammar only after hydration and only
     when motion is allowed — the SSR document stays fully visible. */
  useEffect(() => {
    if (prefersReducedMotionNow()) return;
    wrapRef.current?.setAttribute("data-live", "");
  }, []);

  /* Hover/focus preview: the field morphs into the project's formation
     beside the list, the dust palette follows via the preview channel,
     and the page palette crossfades by stamping data-domain on <html>.
     DomainTheme only writes data-domain on pathname changes (and
     reconciles it on EVERY route change), so a hover-scoped override
     here never fights it — and we deliberately leave the attribute
     alone on unmount so a warp into the hovered project keeps its
     palette seamlessly while DomainTheme takes over. */
  const preview = useCallback(
    (d: Domain | null) => {
      /* Calm path: no formation preview / palette crossfade on hover.
         Releases (d === null) always run so a preference flip mid-hover
         can never strand a formation or a stale data-domain. */
      if (d !== null && prefersReducedMotionNow()) return;
      requestFormation(d, { offsetX: FORMATION_OFFSET_X, owner: "overlook" });
      setPreviewDomain(d, FORMATION_OFFSET_X);
      const html = document.documentElement;
      if (d) html.setAttribute("data-domain", d);
      else html.removeAttribute("data-domain");
    },
    [requestFormation, setPreviewDomain]
  );

  /* Always release the field when leaving the page mid-hover. */
  useEffect(
    () => () => {
      requestFormation(null, { owner: "overlook" });
      setPreviewDomain(null);
    },
    [requestFormation, setPreviewDomain]
  );

  return (
    <>
      <Navigation />
      <style>{OVERLOOK_CSS}</style>

      <main id="main-content" style={{ padding: "8rem var(--pad) 4rem" }}>
        {/* Header — label, title and intro rise in sequence */}
        <Reveal as="header" className="ovl-head mb-16" stagger>
          <span
            className="label-mono block mb-4"
            style={{ color: "var(--color-graphite-light)" }}
          >
            {t("work.label")}
          </span>
          <h1 className="ovl-h1">{t("work.header")}</h1>
          <p className="ovl-lede">{t("work.headerDescription")}</p>
          <p className="ovl-hint">{t("work.overlook.hint")}</p>
        </Reveal>

        {/* THE OVERLOOK — rows enter on the shared stagger beat */}
        <div ref={wrapRef} className="ovl-wrap">
          <Reveal as="ol" className="ovl-list" stagger delay={0.15}>
            {projects.map((project, i) => (
              <li key={project.slug} className="ovl-item">
                <Link
                  href={`/work/${project.slug}`}
                  className="ovl-row"
                  data-cursor="enter"
                  style={{ "--ovl-accent": project.accent } as CSSProperties}
                  onClick={(e) => {
                    /* Let the browser own modified clicks (new tab etc.). */
                    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                    e.preventDefault();
                    warpNav(`/work/${project.slug}`, project.domain);
                  }}
                  onMouseEnter={() => preview(project.domain)}
                  onMouseLeave={() => preview(null)}
                  onFocus={() => preview(project.domain)}
                  onBlur={() => preview(null)}
                >
                  <span className="ovl-index" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <div style={{ minWidth: 0 }}>
                    <h2 className="ovl-title">
                      <span className="ovl-title-line">{project.title}</span>
                    </h2>
                    <p className="ovl-oneliner">{project.oneLiner}</p>
                  </div>

                  {/* Quiet mono annotations — fade in beside the row */}
                  <span className="ovl-meta">
                    <span className="ovl-meta-year">{project.year}</span>
                    <span className="ovl-meta-role">{project.role}</span>
                    <span className="ovl-meta-keys" aria-hidden="true">
                      {(project.keywords ?? []).slice(0, 3).join(" · ")}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </Reveal>
        </div>
      </main>

      <Footer />
    </>
  );
}
