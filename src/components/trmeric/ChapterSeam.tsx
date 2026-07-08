"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import useInView from "@/hooks/useInView";
import { useParticle, subscribeClimate } from "@/lib/particleContext";
import { prefersReducedMotionNow } from "@/hooks/usePrefersReducedMotion";

/* CHAPTER SEAM — a band where <main>'s ground paint deliberately drops out
   so the persistent amber dust field shows through for a viewport, then
   fades back to the neighbouring section's colour. See ENGINE-API.md §2
   (owner-keyed formation stack) and §3 (climate store / chapter-seam
   example) — this is that pattern, applied.

   Owner-keyed formation: every seam on the page pins the SAME formation
   under the SAME owner ("trmeric-flagship") while it's on screen, and
   releases that owner's entry the moment it isn't — never a different
   owner's entry (ENGINE-API.md's core guarantee). Because every seam here
   requests the identical formation, the ordering of two seams' effects
   racing during a fast scroll can never produce a visibly wrong shape —
   worst case is a same-frame no-op, not a wrong lattice.

   Climate readout: a live `--seam-heat` custom property (excitement +
   turbulence, exactly the example in ENGINE-API.md §3) lets the tint
   breathe with the field's actual temperament instead of sitting static —
   skipped entirely under reduced motion. */

const OWNER = "trmeric-flagship";

interface ChapterSeamProps {
  id?: string;
  /** Narrative register: "cool" = sparse/grey (problem framing), "warm" =
      denser/amber (outcomes, metrics, resolution). Pure DOM-gradient
      authorship — the dust itself is pinned to the one lattice formation
      available on this page; the temperature swing lives in the tint. */
  tone: "cool" | "warm";
  /** Opaque colour (or "transparent") the band fades FROM at its top edge —
      typically the section above's background. */
  fadeTop: string;
  /** Opaque colour (or "transparent") the band fades TO at its bottom edge. */
  fadeBottom: string;
  minHeight?: string;
  children: ReactNode;
  style?: CSSProperties;
}

export default function ChapterSeam({
  id,
  tone,
  fadeTop,
  fadeBottom,
  minHeight = "62vh",
  children,
  style,
}: ChapterSeamProps) {
  const { ref, inView } = useInView<HTMLDivElement>({
    once: false,
    threshold: 0.2,
    rootMargin: "-8% 0px -8% 0px",
  });
  const { requestFormation } = useParticle();
  const heatRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    requestFormation(inView ? "trmeric" : null, { owner: OWNER });
  }, [inView, requestFormation]);

  /* Belt-and-braces release: if this seam unmounts entirely (route change)
     while it happened to be the one holding the slot, don't strand it. */
  useEffect(() => () => requestFormation(null, { owner: OWNER }), [requestFormation]);

  useEffect(() => {
    if (prefersReducedMotionNow()) return;
    return subscribeClimate((c) => {
      heatRef.current?.style.setProperty("--seam-heat", String(c.excitement + c.turbulence));
    });
  }, []);

  const tint = tone === "cool" ? "rgba(150,148,132,.20)" : "rgba(255,164,38,.16)";

  return (
    <div
      ref={(node) => {
        ref.current = node;
        heatRef.current = node;
      }}
      id={id}
      style={{
        position: "relative",
        minHeight,
        display: "flex",
        alignItems: "center",
        background: `linear-gradient(to bottom, ${fadeTop} 0%, transparent 22%, transparent 78%, ${fadeBottom} 100%)`,
        ...style,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(60% 55% at 50% 50%, ${tint}, transparent 72%)`,
          opacity: "calc(.55 + var(--seam-heat, .3) * .35)",
          pointerEvents: "none",
        }}
      />
      <div style={{ position: "relative", width: "100%" }}>{children}</div>
    </div>
  );
}
