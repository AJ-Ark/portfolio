/* ═══════════════════════════════════════════════════════════════════
   Rozi — shared design contract for all case-study infographics.

   The real Rozi brand is a DUAL accent: maroon/red as the primary
   (headings, structure) + gold/amber as the co-accent (data, marks,
   emphasis). Every infographic component receives one `RoziPalette`
   object so the whole page stays coherent.

   IMPORTANT: every value is a CSS custom property resolved per
   `data-theme` (stamped flash-free by the blocking script in layout).
   This mirrors the Rippl pattern — there is NO JS light/dark branching,
   so the server and the client render identical markup: no hydration
   mismatch, no theme flash. To retune colors, edit the
   `[data-domain="rozi"]` blocks in globals.css, NOT this file.
   ═══════════════════════════════════════════════════════════════════ */

export type RoziPalette = {
  /* Surfaces */
  GND: string;    // page ground
  GND2: string;   // raised surface / card
  GND3: string;   // deepest inset / chip
  PAP: string;    // primary ink
  DIM: string;    // secondary ink
  FAINT: string;  // tertiary ink / soft hairline
  /* Lines */
  LINE: string;   // hairline
  LINEW: string;  // weak hairline
  /* Maroon (primary accent) */
  ACC: string;    // fills / large display
  ACCB: string;   // bright maroon
  ACCT: string;   // maroon tuned for small-text contrast
  /* Gold (co-accent) */
  GOLD: string;   // gold fill
  GOLDB: string;  // bright gold
  GOLDT: string;  // gold tuned for small-text contrast
  AMBER: string;  // mid amber (lifecycle stage 3)
  /* Fonts */
  MONO: string;   // JetBrains Mono
  SERIF: string;  // Fraunces (display)
  /* Elevation */
  SHADOW: string;
};

export function makeRoziPalette(): RoziPalette {
  return {
    GND:    "var(--rz-gnd)",
    GND2:   "var(--rz-gnd2)",
    GND3:   "var(--rz-gnd3)",
    PAP:    "var(--rz-pap)",
    DIM:    "var(--rz-dim)",
    FAINT:  "var(--rz-faint)",
    LINE:   "var(--rz-line)",
    LINEW:  "var(--rz-linew)",
    ACC:    "var(--rz-acc)",
    ACCB:   "var(--rz-accb)",
    ACCT:   "var(--rz-acct)",
    GOLD:   "var(--rz-gold)",
    GOLDB:  "var(--rz-goldb)",
    GOLDT:  "var(--rz-goldt)",
    AMBER:  "var(--rz-amber)",
    MONO:   "var(--font-mono)",
    SERIF:  "var(--font-display)",
    SHADOW: "var(--rz-shadow)",
  };
}

/* Lifecycle stage tint sequence — a meaningful gradient from gold
   (opportunity / early life) to maroon (hardship / return). Each entry
   is a saturated marker color + a subtle translucent surface tint. */
export function lifecycleStageColors(p: RoziPalette) {
  return [
    { marker: p.GOLDB, tint: `color-mix(in srgb, ${p.GOLDB} 11%, transparent)` },
    { marker: p.GOLD,  tint: `color-mix(in srgb, ${p.GOLD} 13%, transparent)` },
    { marker: p.AMBER, tint: `color-mix(in srgb, ${p.AMBER} 13%, transparent)` },
    { marker: p.ACCB,  tint: `color-mix(in srgb, ${p.ACCB} 13%, transparent)` },
  ];
}
