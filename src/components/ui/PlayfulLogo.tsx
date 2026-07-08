"use client";

import { useEffect, useRef } from "react";
import { useParticle } from "@/lib/particleContext";
import { prefersReducedMotionNow } from "@/hooks/usePrefersReducedMotion";

/* ══════════════════════════════════════════════════════════════════
   PLAYFUL LOGO — the AJ mark as a physics object.

   The mark leans and tilts toward the pointer with a springy 3D
   parallax, and while the pointer is near it kicks excitement into the
   shared dust field (particleContext.excite) so the material stirs
   around it — the logo becoming part of the site's "one material"
   physics rather than a static footer glyph.

   Runs a single rAF only while the pointer is actually near (it stops
   when the mark has sprung back to rest), and only when `active` (the
   host band is in view). Reduced-motion users, coarse/touch pointers,
   and no-JS visitors get the plain masked logo with no listeners — a
   pointerdown still pokes the dust once, which is harmless everywhere.
   ══════════════════════════════════════════════════════════════════ */

const RADIUS = 260; // px proximity within which the mark reacts
const MAX_SHIFT = 16; // px magnetic translate cap
const MAX_TILT = 16; // deg 3D tilt cap
const SPRING = 0.14; // lerp factor toward target each frame

export default function PlayfulLogo({
  size = 84,
  active = true,
}: {
  size?: number;
  active?: boolean;
}) {
  const { excite } = useParticle();
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const logo = logoRef.current;
    if (!wrap || !logo || !active) return;
    if (prefersReducedMotionNow()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    // current (sprung) and target transform values
    let tx = 0, ty = 0, rx = 0, ry = 0;
    let gx = 0, gy = 0, grx = 0, gry = 0;
    let near = false;
    let lastStir = 0;
    let raf = 0;
    let running = false;

    const tick = () => {
      tx += (gx - tx) * SPRING;
      ty += (gy - ty) * SPRING;
      rx += (grx - rx) * SPRING;
      ry += (gry - ry) * SPRING;
      logo.style.transform =
        `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(2)}px, 0) ` +
        `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      const atRest =
        Math.abs(gx - tx) < 0.05 && Math.abs(gy - ty) < 0.05 &&
        Math.abs(grx - rx) < 0.05 && Math.abs(gry - ry) < 0.05;
      if (atRest && !near) {
        running = false;
        return; // idle: no rAF until the pointer comes back
      }
      raf = requestAnimationFrame(tick);
    };
    const wake = () => {
      if (!running) {
        running = true;
        raf = requestAnimationFrame(tick);
      }
    };

    const onMove = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const dist = Math.hypot(dx, dy);
      if (dist < RADIUS) {
        const f = 1 - dist / RADIUS; // 0..1, stronger near the center
        gx = Math.max(-MAX_SHIFT, Math.min(MAX_SHIFT, dx * 0.1 * f));
        gy = Math.max(-MAX_SHIFT, Math.min(MAX_SHIFT, dy * 0.1 * f));
        gry = Math.max(-MAX_TILT, Math.min(MAX_TILT, (dx / RADIUS) * 20));
        grx = Math.max(-MAX_TILT, Math.min(MAX_TILT, (-dy / RADIUS) * 20));
        if (!near) {
          near = true;
          excite(0.6); // a burst as the pointer arrives
        } else if (f > 0.45 && e.timeStamp - lastStir > 240) {
          lastStir = e.timeStamp;
          excite(0.3 + f * 0.4); // keep the material stirring while close
        }
        wake();
      } else if (near) {
        near = false;
        gx = gy = grx = gry = 0; // spring back to rest
        wake();
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      logo.style.transform = "";
    };
  }, [active, excite]);

  return (
    <div
      ref={wrapRef}
      style={{ perspective: "600px", display: "inline-block", lineHeight: 0 }}
    >
      <span
        ref={logoRef}
        className="aj-logo"
        role="img"
        aria-label="Aravind J"
        data-magnetic-skip="" /* PlayfulLogo owns its own transform — keep CursorGlow's data-magnetic off it */
        onPointerDown={() => {
          // A poke works for everyone, including touch (no magnetic there).
          if (!prefersReducedMotionNow()) excite(0.7);
        }}
        style={{
          display: "block",
          width: size,
          height: size,
          willChange: "transform",
          cursor: "pointer",
        }}
      />
    </div>
  );
}
