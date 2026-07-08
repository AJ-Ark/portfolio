"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useInView } from "@/hooks/useInView";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

/* ═══════════════════════════════════════════════════════════════════
   InlineVideo — GIF replacement that respects bandwidth and motion.

   Renders a muted, looping, inline <video> with `preload="none"` so
   nothing downloads until needed. An IntersectionObserver plays the
   video only while it is in the viewport and pauses it the moment it
   leaves. Under prefers-reduced-motion it NEVER autoplays: the poster
   stays put with a subtle play affordance, and playback is strictly
   user-initiated (still pausing offscreen).
   ═══════════════════════════════════════════════════════════════════ */

interface Props {
  src: string;
  poster: string;
  "aria-label"?: string;
  className?: string;
  style?: CSSProperties;
}

export default function InlineVideo({
  src,
  poster,
  "aria-label": ariaLabel,
  className,
  style,
}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { ref: boxRef, inView } = useInView<HTMLDivElement>({
    once: false,
    threshold: 0.2,
  });

  /* Starts null (unknown) so the first client render neither autoplays
     nor flashes the play affordance before the preference is known. */
  const reduced = usePrefersReducedMotion(null);
  const [userStarted, setUserStarted] = useState(false);

  /* Single source of truth for playback: in view AND (motion allowed
     OR the user explicitly pressed play). */
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const shouldPlay = inView && (reduced === false || userStarted);
    if (shouldPlay) {
      v.play().catch(() => {
        /* Autoplay rejection (e.g. power saver) — poster remains. */
      });
    } else {
      v.pause();
    }
  }, [inView, reduced, userStarted]);

  const showAffordance = reduced === true && !userStarted;

  return (
    <div
      ref={boxRef}
      className={className}
      style={{ position: "relative", overflow: "hidden", ...style }}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        muted
        loop
        playsInline
        preload="none"
        aria-label={ariaLabel}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          display: "block",
        }}
      />

      {showAffordance && (
        <button
          type="button"
          onClick={() => setUserStarted(true)}
          aria-label={ariaLabel ? `Play: ${ariaLabel}` : "Play animation"}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,.12)",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <span
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              border: "1px solid rgba(255,255,255,.7)",
              background: "rgba(0,0,0,.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(2px)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M5 3.5l11 5.5-11 5.5V3.5z" fill="rgba(255,255,255,.9)" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
