/* ══════════════════════════════════════════════════════════════════
   DUST ENGINE SHADERS — GLSL ES 1.00, used with THREE.RawShaderMaterial.

   RawShaderMaterial (not ShaderMaterial) so the exact same source can
   be pre-flight compiled against a probe WebGL2 context at tier-detect
   time: if compilation/link fails there, the engine falls back to the
   CPU PointsMaterial field before three.js ever sees the shader.

   The vertex shader owns everything that used to be per-frame JS:
   • three formation slots (A→B frozen pair + animated C target) so
     interrupted morphs collapse without popping,
   • per-domain formation animation (breath/orbit/flutter/flow) ported
     from ParticleField.tsx's target functions,
   • curl-noise idle drift scaled by climate turbulence/excitement,
   • wind lean, gravity settle, scroll-velocity smear, scatter impulse,
   • cursor repulsion in the points object's local space,
   • density culling and size/brightness-by-depth.
   No per-frame array allocation anywhere — uniforms only.
   ══════════════════════════════════════════════════════════════════ */

export const DUST_VERTEX = /* glsl */ `
precision highp float;

/* Baked formation attributes — one slot per formation.
   position       idle fibonacci-sphere point (t = 0)
   aOrbital       (angle0, baseRadius, scatter, orbitIndex)          — rippl
   aRipple        (angle0, ringIndex, y0, scatter)                   — rozi
   aOrganic       (x0, y0, z0static, side*(1|2) | 0 = body)          — realm
   aLattice       (x, y, z, 0)                                       — trmeric
   aWord          (x, y, z, phase)                                   — "ARAVIND J"
   aMono          (x, y, z, phase)                                   — "AJ"
   aSeed          (s0, s1, s2, cullKey)
   aSeed.w is an INDEPENDENT random reserved for density culling only —
   it must never feed formation math (s0/s1/s2 shape rozi scatter, the
   realm body/wing split, etc., so culling on them thins a spatially
   biased subset). */
attribute vec3 position;
attribute vec4 aOrbital;
attribute vec4 aRipple;
attribute vec4 aOrganic;
attribute vec4 aLattice;
attribute vec4 aWord;
attribute vec4 aMono;
attribute vec4 aSeed;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

uniform float uTime;
uniform float uTypeA;
uniform float uTypeB;
uniform float uTypeC;
uniform float uMixAB;   /* frozen blend of the previous pair */
uniform float uMix;     /* eased, animated blend toward slot C */

uniform vec3  uCursor;        /* rotation-corrected, local space */
uniform float uRepelRadius;
uniform float uRepelStrength;

uniform float uDive;          /* 0 rest → 1 fully immersed */
uniform float uTurbulence;
uniform float uWind;
uniform float uGravity;
uniform float uExcitement;
uniform float uDensity;       /* 0..1 — cull fraction */
uniform float uScrollVel;
uniform float uScatter;

uniform float uSize;          /* world-space base size */
uniform float uPixelScale;    /* bufferHeightPx / (2·tan(fov/2)) */
uniform float uAlpha;

uniform vec3 uColorA;
uniform vec3 uColorB;

varying vec3  vColor;
varying float vAlpha;

/* Formation type ids — keep in sync with FORMATION_TYPE in formations.ts:
   0 idle · 1 rippl orbitals · 2 rozi ripple rings · 3 realm butterfly ·
   4 trmeric lattice · 5 wordmark · 6 monogram */
vec3 evalFormation(float ft, float t) {
  vec3 p;
  if (ft < 0.5) {
    /* IDLE — rotate the baked sphere point around Y, radial breathing. */
    float c = cos(t * 0.04);
    float s = sin(t * 0.04);
    p = vec3(position.x * c - position.z * s, position.y, position.x * s + position.z * c);
    float br = sin(t * 0.15 + aSeed.x * 4.0) * 0.6; /* CPU parity: phase = s0 */
    vec3 dir = normalize(vec3(p.x, p.y / 0.62, p.z) + vec3(1e-5));
    p += vec3(dir.x, dir.y * 0.62, dir.z) * br;
  } else if (ft < 1.5) {
    /* ORBITAL — 7 inclined rings, Kepler-like speeds, breath + vibration. */
    float orbit = aOrbital.w;
    float ang = aOrbital.x + t * 0.06 / (orbit + 1.0);
    float r = aOrbital.y
      + sin(t * 0.25 + orbit * 1.1) * 0.2
      + sin(t * 1.5 + orbit * 0.8 + aSeed.x * 6.28) * 0.025;
    float inc = orbit * 0.13;
    float x = cos(ang) * r;
    float yf = sin(ang) * r;
    float sc = aOrbital.z;
    p = vec3(x + sc * 0.3, yf * cos(inc) + sc, yf * sin(inc) + sc * 0.5);
  } else if (ft < 2.5) {
    /* RIPPLE — 14 concentric rings, pulsing radius, slow swim. */
    float ring = aRipple.y;
    float ang = aRipple.x + t * 0.08;
    float r = (ring + 1.0) * 0.55 + sin(t * 0.4 + ring * 0.5) * 0.25;
    float sc = aRipple.w;
    p = vec3(
      cos(ang) * r + sc,
      aRipple.z + sin(t * 0.3 + aSeed.z * 5.0) * 0.1,
      sin(ang) * r + sc * 0.5
    );
  } else if (ft < 3.5) {
    /* ORGANIC — butterfly: body spine wiggle, wing flutter, depth bob. */
    float w = aOrganic.w;
    if (abs(w) < 0.5) {
      p = vec3(sin(t * 0.6 + aSeed.z * 3.0) * 0.051, aOrganic.y, aOrganic.z);
    } else {
      float side = sign(w);
      float phase = (abs(w) < 1.5) ? 0.0 : 1.4;
      float flutter = 1.0 + sin(t + phase) * 0.06;
      float drift = sin(t * 0.3 + aSeed.x * 6.0) * 0.05;
      p = vec3(
        aOrganic.x * flutter + side * drift * 1.7,
        aOrganic.y,
        aOrganic.z + sin(t * 0.2 + aSeed.y * 6.0) * 0.15
      );
    }
  } else if (ft < 4.5) {
    /* LATTICE — cube grid with a slow sine flow through it. */
    float flow = sin(t * 0.7 + aLattice.x * 0.727 + aLattice.y * 0.364) * 0.12;
    p = aLattice.xyz + vec3(flow, flow * 0.5, 0.0);
  } else if (ft < 5.5) {
    /* WORDMARK — near-still, micro shimmer keeps it alive but legible. */
    p = aWord.xyz;
    p.x += sin(t * 0.7 + aWord.w * 6.283) * 0.015;
    p.y += cos(t * 0.9 + aWord.w * 6.283) * 0.012;
  } else {
    /* MONOGRAM */
    p = aMono.xyz;
    p.x += sin(t * 0.7 + aMono.w * 6.283) * 0.02;
    p.y += cos(t * 0.9 + aMono.w * 6.283) * 0.016;
  }
  return p;
}

void main() {
  float t = uTime;

  /* Density culling — cheap climate-driven thinning. Keys on aSeed.w,
     a random channel no formation math touches, so the culled subset
     is spatially unbiased in every formation (aSeed.x also drives the
     rozi ring scatter and the realm body selector — culling on it
     removed a coherent spatial slice). */
  if (aSeed.w > uDensity) {
    vColor = uColorA;
    vAlpha = 0.0;
    gl_PointSize = 0.0;
    gl_Position = vec4(0.0, 0.0, 2.0, 1.0); /* outside clip volume */
    return;
  }

  vec3 pA = evalFormation(uTypeA, t);
  vec3 pB = evalFormation(uTypeB, t);
  vec3 pC = evalFormation(uTypeC, t);
  vec3 p = mix(mix(pA, pB, uMixAB), pC, uMix);

  /* Curl-ish drift — cheap divergence-poor sine field. */
  float amp = 0.06 + uTurbulence * 0.5 + uExcitement * 0.55 + min(abs(uScrollVel) * 0.6, 0.5);
  vec3 q = p * 0.55 + aSeed.xyz * 2.0;
  vec3 curl = vec3(
    sin(q.y * 1.7 + t * 0.36) + sin(q.z * 1.3 + t * 0.22),
    sin(q.z * 1.9 + t * 0.30) + sin(q.x * 1.1 + t * 0.41),
    sin(q.x * 1.5 + t * 0.27) + sin(q.y * 1.2 + t * 0.24)
  );
  p += curl * amp * 0.28;

  /* Wind lean + gravity settle. */
  p.x += uWind * (p.y * 0.12 + sin(t * 0.5 + aSeed.x * 6.283) * 0.5);
  p.y -= uGravity * (0.6 + aSeed.y) * 1.4;

  /* Scroll smear — particles lag/lead vertically under fast scroll. */
  p.y += uScrollVel * (aSeed.y - 0.5) * 1.6;

  /* Scatter impulse (scatterSettle) — burst outward, resettle. */
  vec3 dir = normalize(aSeed.xyz - 0.5 + vec3(1e-4));
  p += dir * uScatter * (1.2 + aSeed.z * 2.2);

  /* Cursor repulsion in local space. */
  vec3 dc = p - uCursor;
  float dist = length(dc);
  if (dist < uRepelRadius && dist > 0.0001) {
    p += (dc / dist) * ((uRepelRadius - dist) / uRepelRadius) * uRepelStrength;
  }

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  float depth = -mv.z;
  gl_Position = projectionMatrix * mv;

  float sizeJitter = 0.7 + aSeed.z * 0.6;
  gl_PointSize = uSize * sizeJitter
    * (1.0 + uExcitement * 0.35 + uDive * 0.6)
    * uPixelScale / max(depth, 0.1);
  /* Cap the on-screen size: a close dive (camera z -> ~1.25) otherwise scales
     near dust into huge fuzzy blobs that blur out completely. Capping keeps
     the field reading as crisp discrete points at any depth. */
  gl_PointSize = min(gl_PointSize, 18.0);

  /* Brightness by depth — near dust is brighter and warmer, but even the
     far field keeps a strong floor so the whole cloud reads as present
     (0.6 floor, was 0.35 — the field looked too faint on review). */
  float near = clamp(1.0 - (depth - 2.0) / 16.0, 0.0, 1.0);
  vAlpha = min(uAlpha * (0.6 + near * 0.55) * (1.0 + uDive * 0.35), 1.0);
  vColor = mix(uColorA, uColorB, clamp(aSeed.y * 0.6 + near * 0.5, 0.0, 1.0));
}
`;

export const DUST_FRAGMENT = /* glsl */ `
precision mediump float;

varying vec3  vColor;
varying float vAlpha;

void main() {
  vec2 c = gl_PointCoord * 2.0 - 1.0;
  float d2 = dot(c, c);
  if (d2 > 1.0) discard;
  /* A crisp dot with a tight anti-aliased rim — a defined point, not a soft
     glow. The old wide radial falloff read as tacky and blurred out entirely
     when the dive scaled points up; a solid core keeps it high-definition. */
  float a = 1.0 - smoothstep(0.18, 0.92, d2);
  gl_FragColor = vec4(vColor, a * vAlpha);
}
`;

/** Compile + link the exact engine shaders against a probe context.
 *  Returns false on any failure → the caller falls back to the CPU
 *  field. Deterministic and independent of three.js internals. */
export function preflightCompile(gl: WebGL2RenderingContext): boolean {
  let vs: WebGLShader | null = null;
  let fs: WebGLShader | null = null;
  let prog: WebGLProgram | null = null;
  try {
    const make = (type: number, src: string): WebGLShader | null => {
      const sh = gl.createShader(type);
      if (!sh) return null;
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) return null;
      return sh;
    };
    vs = make(gl.VERTEX_SHADER, DUST_VERTEX);
    fs = make(gl.FRAGMENT_SHADER, DUST_FRAGMENT);
    if (!vs || !fs) return false;
    prog = gl.createProgram();
    if (!prog) return false;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    return !!gl.getProgramParameter(prog, gl.LINK_STATUS);
  } catch {
    return false;
  } finally {
    try {
      if (prog) gl.deleteProgram(prog);
      if (vs) gl.deleteShader(vs);
      if (fs) gl.deleteShader(fs);
    } catch {
      /* probe context is disposed by the caller anyway */
    }
  }
}
