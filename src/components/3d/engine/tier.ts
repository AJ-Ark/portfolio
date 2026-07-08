/* ══════════════════════════════════════════════════════════════════
   GPU TIER DETECTION — cheap, synchronous, dependency-free heuristic
   (no detect-gpu: no CDN benchmark fetch, no added latency, works
   offline). One probe WebGL2 context is created, the engine shaders
   are pre-flight compiled against it, the renderer string is sniffed,
   and the context is released.

   Tiers:
   • gpu / desktop-high  → 40 000 particles, dpr ≤ 1.5
   • gpu / desktop-low   → 20 000 particles, dpr ≤ 1.25
   • gpu / mobile        → 8–12 000 particles, dpr ≤ 1.25
   • cpu                 → the existing 5 000-dot PointsMaterial field
                           (WebGL2 present but shaders failed, software
                           rasterizer, or ?cpu-particles debug flag)
   • none                → no WebGL2 at all (three r177 is WebGL2-only;
                           the page simply runs without a field)
   ══════════════════════════════════════════════════════════════════ */

import { preflightCompile } from "./shaders";

export interface EngineTier {
  mode: "gpu" | "cpu" | "none";
  label: "desktop-high" | "desktop-low" | "mobile" | "mobile-low" | "cpu-fallback" | "no-webgl";
  count: number;
  maxDpr: number;
}

const CPU_TIER: EngineTier = { mode: "cpu", label: "cpu-fallback", count: 5000, maxDpr: 1.5 };
const NONE_TIER: EngineTier = { mode: "none", label: "no-webgl", count: 0, maxDpr: 1 };

let cached: EngineTier | null = null;

export function detectTier(): EngineTier {
  if (cached) return cached;
  if (typeof window === "undefined") return CPU_TIER; // never cached — client decides
  cached = compute();
  return cached;
}

/** Cross-module tier readout: null until detection has actually run on
 *  the client (detectTier() from GlobalCanvas' effect), then the cached
 *  mode forever after. Never triggers a probe itself. */
export function getEngineTier(): "gpu" | "cpu" | "none" | null {
  return cached ? cached.mode : null;
}

function compute(): EngineTier {
  /* Debug flag: ?cpu-particles forces the fallback branch. */
  try {
    if (window.location.search.includes("cpu-particles")) return CPU_TIER;
  } catch {
    /* ignore */
  }

  let rendererStr = "";
  let shadersOk = false;
  let gl: WebGL2RenderingContext | null = null;
  try {
    const c = document.createElement("canvas");
    gl = c.getContext("webgl2", { failIfMajorPerformanceCaveat: false });
    if (!gl) return NONE_TIER;
    const dbg = gl.getExtension("WEBGL_debug_renderer_info");
    if (dbg) {
      rendererStr = String(gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) ?? "");
    }
    shadersOk = preflightCompile(gl);
  } catch {
    return NONE_TIER;
  } finally {
    /* Always release the probe context, even on a throw mid-probe. */
    try {
      gl?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch {
      /* ignore — context is unreferenced either way */
    }
  }
  if (!shadersOk) return CPU_TIER;

  /* Software rasterizers: the 5k CPU-JS field is cheaper than 12k+
     software-shaded points. */
  if (/swiftshader|llvmpipe|softpipe|software|basic render/i.test(rendererStr)) {
    return CPU_TIER;
  }

  const nav = navigator as Navigator & { deviceMemory?: number };
  const mem = nav.deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency ?? 4;

  const coarse = typeof window.matchMedia === "function" && window.matchMedia("(pointer: coarse)").matches;
  const mobile = coarse || window.innerWidth < 768;

  const lowGpu =
    /intel(\(r\))? (hd|uhd) graphics [0-6]|mali-[gt]?[0-6]\d\b|adreno \(?tm\)? ?[1-5]\d\d\b|apple a[0-9]\b|powervr/i.test(
      rendererStr
    );
  const highGpu =
    /rtx|gtx 1[6-9]|radeon rx|apple (m\d|gpu)|adreno \(?tm\)? ?7\d\d|mali-g7[0-9]|immortalis/i.test(rendererStr);

  if (mobile) {
    const low = lowGpu || mem <= 3 || cores <= 4;
    return {
      mode: "gpu",
      label: low ? "mobile-low" : "mobile",
      count: low ? 8000 : 12000,
      maxDpr: 1.25,
    };
  }

  const high = !lowGpu && (highGpu || mem >= 8 || cores >= 8);
  return high
    ? { mode: "gpu", label: "desktop-high", count: 40000, maxDpr: 1.5 }
    : { mode: "gpu", label: "desktop-low", count: 20000, maxDpr: 1.25 };
}
