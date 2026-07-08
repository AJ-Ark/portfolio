"use client";

import { useColorScheme } from "@/hooks/useColorScheme";

/**
 * Client island: the hero's top-fade gradient depends on the OS light/dark
 * preference (useColorScheme), so it's isolated here while the rest of the
 * Rippl page renders as a server component. Visual output is byte-identical
 * to the inline version previously computed inside the page component.
 */
export default function HeroGradientOverlay() {
  const dark = useColorScheme();
  const GRAD_BASE = dark ? "#0d0904" : "#F7F3EC";
  const GRAD_88 = dark ? "rgba(13,9,4,.88)" : "rgba(247,243,236,.88)";
  const GRAD_45 = dark ? "rgba(13,9,4,.45)" : "rgba(247,243,236,.45)";

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(to top, ${GRAD_BASE} 0%, ${GRAD_88} 35%, ${GRAD_45} 65%, transparent 100%)`,
      }}
    />
  );
}
