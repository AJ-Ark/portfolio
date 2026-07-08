/* ═══════════════════════════════════════════════════════════════════
   Motion tokens — the single source of motion truth for JS-driven motion
   (framer-motion springs/eases). CSS-driven motion (the Reveal primitive,
   hovers) consumes the CSS twins in globals.css:
     EASE_OUT ↔ --ease   ·   DURATION.base ↔ --dur-base
   Change one? Change its twin.
   ═══════════════════════════════════════════════════════════════════ */

/* Site-wide transition curve — mirrors --ease in globals.css.
   (The reveal/transform curve cubic-bezier(.16,1,.3,1) lives in CSS only,
   as --ease-plot, consumed by the Reveal rules and PlotInLines.) */
/* Mutable tuple type (not `as const`): framer-motion's `ease` prop requires
   a mutable [n, n, n, n] — a readonly tuple fails assignability. */
export const EASE_OUT: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* Duration scale in seconds — base mirrors --dur-base in globals.css. */
export const DURATION = {
  fast: 0.3, // micro-interactions: hovers, toggles, small fades
  base: 0.6, // the standard reveal — most UI motion lives here
  slow: 1.0, // hero moments, large surfaces, page-level shifts
} as const;

/* Interval between staggered children, in seconds. */
export const STAGGER = 0.1;

/* The one spring — HomeReel's slide/progress spring and any future
   spring-driven surface share this feel. */
export const SPRING = { type: "spring", stiffness: 300, damping: 34 } as const;

/* Default travel distance for the standard reveal, in px. */
export const REVEAL_DISTANCE = 24;
