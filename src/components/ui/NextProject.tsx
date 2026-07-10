"use client";

import { useCallback, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Reveal from "@/components/ui/Reveal";
import WarpLink from "@/components/ui/WarpLink";
import { useParticle } from "@/lib/particleContext";
import { useTranslation } from "@/lib/TranslationContext";
import { projectsBySlug, type Domain } from "@/data/projects";

/* The tour order — every case study hands over to the next climate.
   realm→rippl closes the loop from inside the static Realm site
   (public/realm/index.html footer), not through this component. */
const CHAIN: Record<Domain, Domain> = {
  rippl: "trmeric",
  trmeric: "rozi",
  rozi: "realm",
  realm: "rippl",
};

/* The NEXT project's accent, per theme. These mirror the per-domain palette
   blocks in globals.css — we can't read those vars here because the page is
   still wearing the CURRENT domain's palette. */
const ACCENT: Record<Domain, { dark: string; light: string }> = {
  rippl:   { dark: "#4FA8A0", light: "#357A74" },
  realm:   { dark: "#d9b46a", light: "#8a6a2a" },
  trmeric: { dark: "#FFA426", light: "#E8730E" },
  rozi:    { dark: "#C94030", light: "#A02A1C" },
};

/**
 * NextProject — the match-cut epilogue band that ends every case study.
 * A quiet kicker, the next project's name in large Fraunces with its own
 * domain accent, and a warp dive straight into it. Hover/focus lets the
 * next project's weather arrive early through the engine's preview layer.
 *
 * SSR-safe by construction (Reveal ships visible HTML), keyboard reachable
 * (plain links, global :focus-visible), and honest under reduced motion
 * (the engine's preview/excite/warp calls all have calm paths).
 */
export default function NextProject({ current }: { current: Domain }) {
  const nextDomain = CHAIN[current];
  const next = projectsBySlug[nextDomain];
  const { t } = useTranslation();
  const { setPreviewDomain, requestFormation, scatterSettle } = useParticle();
  const pathname = usePathname();
  const previewing = useRef(false);

  /* Back-navigation is part of the grammar too: when the browser pops
     history away from this case study (→ home / work), the field plays the
     same scatter-settle impulse ordinary route changes use. Hash-only pops
     (in-page anchors) stay silent; reduced motion makes it a no-op. */
  useEffect(() => {
    const onPop = () => {
      if (window.location.pathname === pathname) return;
      scatterSettle();
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [pathname, scatterSettle]);

  /* Preview the destination's climate while the visitor aims at the link —
     the same `previewDomain` layer THE OVERLOOK uses (this also drives the
     CPU-fallback field, which only reads activeDomain). On TOP of that,
     push the same domain onto the owner-keyed formation stack (owner
     'next-project') so the preview also wins on the GPU path even when
     THE SETTLING band below is simultaneously in view holding the
     monogram override — otherwise the higher-priority override would
     keep showing "AJ" behind a link that's visibly pointing elsewhere.
     Both channels are always released on leave/unmount so the
     route-driven formation flow regains control. */
  const preview = useCallback(
    (on: boolean) => {
      previewing.current = on;
      setPreviewDomain(on ? nextDomain : null);
      requestFormation(on ? nextDomain : null, { owner: "next-project" });
    },
    [nextDomain, setPreviewDomain, requestFormation],
  );
  useEffect(
    () => () => {
      if (previewing.current) {
        setPreviewDomain(null);
        requestFormation(null, { owner: "next-project" });
      }
    },
    [setPreviewDomain, requestFormation],
  );

  const accent = ACCENT[nextDomain];

  return (
    <section className="np-epilogue" aria-label={`${t("next.label")}: ${next.title}`}>
      <style>{`
        .np-epilogue {
          --np-accent: ${accent.dark};
          padding: clamp(6rem, 16vh, 10rem) var(--pad) clamp(5rem, 12vh, 8rem);
          border-top: 1px solid var(--line-weak, var(--line));
        }
        html[data-theme="light"] .np-epilogue { --np-accent: ${accent.light}; }
        .np-kicker {
          display: block;
          font-family: var(--font-mono);
          font-size: .6rem;
          letter-spacing: .26em;
          text-transform: uppercase;
          color: var(--color-faint);
          margin-bottom: 1.6rem;
        }
        .np-link-wrap {
          display: block;
          max-width: 100%;
        }
        .np-link {
          display: inline-flex;
          align-items: baseline;
          gap: .35em;
          text-decoration: none;
          max-width: 100%;
        }
        .np-title {
          font-family: var(--font-display);
          font-style: italic;
          font-weight: 400;
          font-size: clamp(2.6rem, 8vw, 6rem);
          line-height: 1.05;
          letter-spacing: -.03em;
          color: var(--np-accent);
        }
        .np-arrow {
          font-family: var(--font-display);
          font-size: clamp(1.6rem, 5vw, 3.4rem);
          color: var(--np-accent);
          transition: transform .35s cubic-bezier(.22, 1, .36, 1);
        }
        .np-link:hover .np-arrow,
        .np-link:focus-visible .np-arrow { transform: translateX(.35em); }
        .np-oneliner {
          margin-top: 1.4rem;
          font-size: .9rem;
          line-height: 1.7;
          color: var(--color-dim);
          max-width: 52ch;
        }
        .np-allwork {
          display: inline-block;
          margin-top: 3.2rem;
          font-family: var(--font-mono);
          font-size: .62rem;
          letter-spacing: .2em;
          text-transform: uppercase;
          color: var(--color-faint);
          text-decoration: none;
          transition: color .2s ease;
        }
        .np-allwork:hover,
        .np-allwork:focus-visible { color: var(--color-paper); }
        @media (prefers-reduced-motion: reduce) {
          .np-arrow, .np-allwork { transition: none; }
        }
      `}</style>
      <Reveal stagger style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <span className="np-kicker">{t("next.label")}</span>
        {/* Plain wrapper absorbs Reveal's per-child [data-reveal] CSS
            transform (it's the direct stagger child); the WarpLink one
            level down is the element CursorGlow's magnetic lean grabs via
            [data-magnetic], so the two never fight over the same node's
            `transform` property (see CursorGlow.tsx magnetic caveat). */}
        <div className="np-link-wrap">
          <WarpLink
            href={`/work/${next.slug}`}
            domain={next.domain}
            className="np-link"
            data-cursor="enter"
            data-magnetic="true"
            onMouseEnter={() => preview(true)}
            onMouseLeave={() => preview(false)}
            onFocus={() => preview(true)}
            onBlur={() => preview(false)}
          >
            <em className="np-title">{next.title}</em>
            <span className="np-arrow" aria-hidden="true">→</span>
          </WarpLink>
        </div>
        <p className="np-oneliner">{next.oneLiner}</p>
        <WarpLink href="/work" variant="settle" className="np-allwork">
          ← {t("next.allWork")}
        </WarpLink>
      </Reveal>
    </section>
  );
}
