"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";

/* True-aspect-ratio screenshot with a click-to-open lightbox.
   The overlay renders through a portal — PlotInLines leaves a transform
   on its wrapper, which would otherwise trap position:fixed children. */

interface ShotProps {
  src: string;
  alt: string;
  ratio?: string;
  radius?: number;
  border?: string;
  shadow?: string;
  caption?: string;
  actions?: React.ReactNode;
  priority?: boolean;
  sizes?: string;
  accent?: string;
}

export default function Shot({
  src,
  alt,
  ratio = "16/10",
  radius = 14,
  border,
  shadow,
  caption,
  actions,
  priority = false,
  sizes = "(max-width: 900px) 100vw, 1100px",
  accent = "#FFA426",
}: ShotProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hover, setHover] = useState(false);

  useEffect(() => setMounted(true), []);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  return (
    <>
      <figure style={{ margin: 0 }}>
        <button
          onClick={() => setOpen(true)}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          aria-label={`View full screenshot: ${alt}`}
          style={{
            position: "relative",
            display: "block",
            width: "100%",
            aspectRatio: ratio,
            borderRadius: radius,
            overflow: "hidden",
            border: border ?? "1px solid rgba(23,21,15,.12)",
            boxShadow: shadow,
            cursor: "zoom-in",
            padding: 0,
            background: "transparent",
          }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            style={{
              objectFit: "cover",
              transform: hover ? "scale(1.015)" : "scale(1)",
              transition: "transform .8s cubic-bezier(.16,1,.3,1)",
            }}
          />
          {/* zoom affordance */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              right: 12,
              bottom: 12,
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              padding: ".4rem .7rem",
              borderRadius: 999,
              background: "rgba(15,13,9,.72)",
              backdropFilter: "blur(6px)",
              color: "#F2E8D0",
              fontFamily: "var(--font-mono)",
              fontSize: ".55rem",
              letterSpacing: ".14em",
              textTransform: "uppercase",
              opacity: hover ? 1 : 0,
              transform: hover ? "translateY(0)" : "translateY(4px)",
              transition: "opacity .3s ease, transform .3s ease",
              pointerEvents: "none",
            }}
          >
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke={accent} strokeWidth="1.4" strokeLinecap="round">
              <path d="M1 5V1h4M11 7v4H7M1 1l4 4M11 11L7 7" />
            </svg>
            View full
          </span>
        </button>
        {caption && (
          <figcaption
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: ".55rem",
              letterSpacing: ".14em",
              textTransform: "uppercase",
              opacity: 0.55,
              marginTop: ".7rem",
            }}
          >
            {caption}
          </figcaption>
        )}
      </figure>

      {mounted && open &&
        createPortal(
          <div
            onClick={close}
            role="dialog"
            aria-modal="true"
            aria-label={alt}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "clamp(1rem, 4vw, 3rem)",
              background: "rgba(10,8,5,.92)",
              backdropFilter: "blur(12px)",
              animation: "trmShotFade .25s ease both",
              cursor: "zoom-out",
            }}
          >
            <style>{`@keyframes trmShotFade { from { opacity: 0 } to { opacity: 1 } }`}</style>
            <div
              style={{
                position: "relative",
                width: "min(1400px, 94vw)",
                flex: "0 1 auto",
                aspectRatio: ratio,
                maxHeight: "82vh",
              }}
            >
              <Image
                src={src}
                alt={alt}
                fill
                sizes="94vw"
                style={{ objectFit: "contain" }}
              />
            </div>
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "1.2rem",
                marginTop: "1.2rem",
                flexWrap: "wrap",
                justifyContent: "center",
                cursor: "default",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: ".6rem",
                  letterSpacing: ".16em",
                  textTransform: "uppercase",
                  color: "rgba(242,232,208,.6)",
                }}
              >
                {caption ?? alt}
              </span>
              {actions}
              <button
                onClick={close}
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: ".58rem",
                  letterSpacing: ".16em",
                  textTransform: "uppercase",
                  color: "#F2E8D0",
                  background: "transparent",
                  border: "1px solid rgba(242,232,208,.25)",
                  borderRadius: 999,
                  padding: ".45rem 1rem",
                  cursor: "pointer",
                }}
              >
                ✕ Close
              </button>
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
