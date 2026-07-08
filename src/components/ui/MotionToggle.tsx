"use client";

import type { CSSProperties } from "react";
import {
  usePrefersReducedMotion,
  prefersReducedMotionNow,
  MOTION_ATTR,
  MOTION_STORAGE_KEY,
  MOTION_EVENT,
} from "@/hooks/usePrefersReducedMotion";

/* Writes an explicit motion preference to the two mirrored sources the
   reduced-motion module reads (html[data-motion] + localStorage) and pokes
   every live subscriber via the custom event. The a11y CSS side
   (html[data-motion="reduce"] mirroring the reduced-motion block) lives in
   globals.css. */
function applyMotion(reduce: boolean) {
  const el = document.documentElement;
  el.setAttribute(MOTION_ATTR, reduce ? "reduce" : "full");
  try {
    localStorage.setItem(MOTION_STORAGE_KEY, reduce ? "reduce" : "full");
  } catch {
    /* storage unavailable — the attribute alone still drives this session */
  }
  window.dispatchEvent(new Event(MOTION_EVENT));
}

/* Accessible motion switch for the nav. A plain <button> with aria-pressed
   reflecting whether motion is ENABLED (pressed = on). No animation of its
   own, so it is reduced-motion-safe. SSR renders "Motion: On" (motion-allowed
   default) and the effective state lands right after hydration, matching the
   server render for hydration parity. */
export default function MotionToggle({ style }: { style?: CSSProperties }) {
  /* Effective preference, tracking OS + manual override reactively. */
  const reduced = usePrefersReducedMotion();
  const motionOn = !reduced;

  const onClick = () => {
    /* Flip relative to what's actually in effect right now (which may be the
       OS query if no override has been set yet), so the first click always
       visibly toggles. */
    applyMotion(!prefersReducedMotionNow());
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={motionOn}
      aria-label={`Motion ${motionOn ? "on" : "off"} — toggle animations`}
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: ".68rem",
        letterSpacing: ".14em",
        textTransform: "uppercase",
        color: motionOn
          ? "var(--color-graphite-light)"
          : "var(--color-accent)",
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        whiteSpace: "nowrap",
        transition: "color .25s var(--ease)",
        ...style,
      }}
    >
      Motion: {motionOn ? "On" : "Off"}
    </button>
  );
}
