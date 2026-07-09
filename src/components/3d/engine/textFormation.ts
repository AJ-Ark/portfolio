/* ══════════════════════════════════════════════════════════════════
   TEXT FORMATIONS — samples text drawn to an offscreen canvas into
   particle targets (vec4: x, y, zJitter, phase), used for the
   'wordmark' ("ARAVIND J") and 'monogram' ("AJ") formations.

   Gated on document.fonts.ready and an explicit fonts.load() of the
   display face (Fraunces, resolved from the --font-fraunces variable
   next/font stamps on <html>), so the sampled glyphs are the real
   typeface — never a fallback-serif ghost.
   ══════════════════════════════════════════════════════════════════ */

const CANVAS_MAX_W = 2048;
const FONT_PX = 180;

/* ── Deterministic per-particle sampling ──
   Re-bakes (resize, font swap-in) must move each particle SMOOTHLY with
   the new layout, not reshuffle it onto an uncorrelated glyph pixel. So
   every random draw is a pure function of (text, particle index, draw
   slot): the same particle always samples the same relative site in the
   raster's stable row-major scan order, and a re-bake only shifts it by
   however much the raster/world-scale actually changed. */

/** FNV-1a — stable 32-bit hash of the baked text (per-text seed base). */
function hashText(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/* Tiny mulberry32-style PRNG with explicit reseed — no per-particle
   closures/allocations at bake time. */
let prngState = 0;
function srand(seed: number) {
  prngState = seed >>> 0;
}
function frand(): number {
  prngState = (prngState + 0x6d2b79f5) | 0;
  let t = Math.imul(prngState ^ (prngState >>> 15), 1 | prngState);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

let cachedFamily: string | null = null;

function displayFontFamily(): string {
  if (cachedFamily) return cachedFamily;
  let family = "";
  try {
    family = getComputedStyle(document.documentElement)
      .getPropertyValue("--font-fraunces")
      .trim();
  } catch {
    /* jsdom / very old browsers */
  }
  cachedFamily = family || "Fraunces, Georgia, serif";
  return cachedFamily;
}

export interface TextBakeOptions {
  italic?: boolean;
  weight?: number;
  /** World-space z scatter half-depth (default 0.15). */
  depth?: number;
}

/** Rasterize `text` and sample `count` particle targets from its inked
 *  pixels. Returns a Float32Array of vec4 (x, y, z, phase) in world
 *  units, centered on origin, `worldWidth` wide. Never rejects — on
 *  any failure it resolves with a loose dust-line placeholder so the
 *  engine (and engineReady) can always proceed. */
export async function bakeTextFormation(
  text: string,
  count: number,
  worldWidth: number,
  opts: TextBakeOptions = {}
): Promise<Float32Array> {
  const out = new Float32Array(count * 4);
  try {
    const family = displayFontFamily();
    // Upright (roman), very thin weight (250) by default — italic only when
    // explicitly requested. Thin, near-uniform strokes (no bold) match the
    // site's refined display voice; italic glyphs sampled into dust smeared.
    const fontStyle = `${opts.italic ? "italic " : ""}${opts.weight ?? 250} ${FONT_PX}px ${family}`;

    /* Wait for the real face — fonts.load() also kicks lazy loads. */
    try {
      await document.fonts.load(fontStyle, text);
    } catch {
      /* non-fatal: fonts.ready below still gates on the stylesheet set */
    }
    await document.fonts.ready;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) throw new Error("no 2d context");

    ctx.font = fontStyle;
    const metrics = ctx.measureText(text);
    const pad = FONT_PX * 0.25;
    let w = Math.ceil(metrics.width + pad * 2);
    let scaleDown = 1;
    if (w > CANVAS_MAX_W) {
      scaleDown = CANVAS_MAX_W / w;
      w = CANVAS_MAX_W;
    }
    const h = Math.ceil(FONT_PX * 1.6 * scaleDown);

    canvas.width = w;
    canvas.height = h;
    /* Canvas size reset clears state — set the font again (scaled). */
    ctx.font = `${opts.italic ? "italic " : ""}${opts.weight ?? 250} ${Math.floor(FONT_PX * scaleDown)}px ${family}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillStyle = "#fff";
    ctx.fillText(text, w / 2, h / 2);

    /* Collect inked pixels (sample every 2nd px — plenty of sites). */
    const img = ctx.getImageData(0, 0, w, h).data;
    const step = 2;
    const filled: number[] = [];
    for (let y = 0; y < h; y += step) {
      for (let x = 0; x < w; x += step) {
        if (img[(y * w + x) * 4 + 3] > 96) filled.push(x, y);
      }
    }
    if (filled.length < 32) throw new Error("text raster empty");

    const sites = filled.length / 2;
    const worldScale = worldWidth / w;
    const depth = opts.depth ?? 0.15;

    /* Seeded on the text only (not count/worldWidth/w/h) — every re-bake
       of the SAME text draws the identical sequence of pseudo-random
       fractions, so particle i always samples the same relative site in
       the raster's stable row-major scan order. A resize only changes
       the raster's pixel positions gradually, so the same relative site
       moves smoothly instead of the whole field reshuffling. */
    srand(hashText(text));
    for (let i = 0; i < count; i++) {
      const pick = (frand() * sites) | 0;
      const px = filled[pick * 2] + (frand() - 0.5) * step;
      const py = filled[pick * 2 + 1] + (frand() - 0.5) * step;
      out[i * 4] = (px - w / 2) * worldScale;
      out[i * 4 + 1] = -(py - h / 2) * worldScale; /* canvas y ↓ → world y ↑ */
      out[i * 4 + 2] = (frand() - 0.5) * 2 * depth;
      out[i * 4 + 3] = frand();
    }
    return out;
  } catch {
    /* Placeholder: a soft horizontal dust band where the text would be.
       Deterministic for the same reason as the main path above. */
    srand(hashText(text) ^ 0x9e3779b9);
    for (let i = 0; i < count; i++) {
      out[i * 4] = (frand() - 0.5) * worldWidth;
      out[i * 4 + 1] = (frand() - 0.5) * 0.6;
      out[i * 4 + 2] = (frand() - 0.5) * 0.3;
      out[i * 4 + 3] = frand();
    }
    return out;
  }
}
