"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

/* Inline live-prototype embed. Shows the poster screenshot until the
   visitor explicitly loads the iframe — five auto-loading prototypes
   would wreck page performance, a poster costs nothing. */

export interface TrmColors {
  base: string;
  base2: string;
  ink: string;
  dim: string;
  faint: string;
  line: string;
  acc: string;
  accd: string;
}

interface PrototypeFrameProps {
  src: string;
  poster: string;
  title: string;
  colors: TrmColors;
  ratio?: string;
}

export default function PrototypeFrame({
  src,
  poster,
  title,
  colors: c,
  ratio = "16/10",
}: PrototypeFrameProps) {
  const [active, setActive] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setFullscreen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [fullscreen]);

  const mono = (size: string): React.CSSProperties => ({
    fontFamily: "var(--font-mono)",
    fontSize: size,
    letterSpacing: ".16em",
    textTransform: "uppercase",
  });

  return (
    <>
      <div
        style={{
          borderRadius: 14,
          overflow: "hidden",
          border: `1px solid ${c.line}`,
          background: c.base2,
        }}
      >
        {/* toolbar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            padding: ".65rem 1rem",
            borderBottom: `1px solid ${c.line}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: ".6rem", minWidth: 0 }}>
            <span
              aria-hidden
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: loaded ? "#3FA46A" : c.faint,
                boxShadow: loaded ? "0 0 8px rgba(63,164,106,.8)" : "none",
                flexShrink: 0,
                transition: "background .4s ease",
              }}
            />
            <span style={{ ...mono(".58rem"), color: c.dim, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {title}
            </span>
            <span style={{ ...mono(".5rem"), color: loaded ? "#3FA46A" : c.faint, flexShrink: 0 }}>
              {loaded ? "Live" : "Standby"}
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: ".5rem", flexShrink: 0 }}>
            {active && (
              <button
                onClick={() => setFullscreen(true)}
                style={{
                  ...mono(".52rem"),
                  color: c.accd,
                  background: "transparent",
                  border: `1px solid ${c.line}`,
                  borderRadius: 999,
                  padding: ".35rem .8rem",
                  cursor: "pointer",
                }}
              >
                ⤢ Fullscreen
              </button>
            )}
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                ...mono(".52rem"),
                color: c.accd,
                border: `1px solid ${c.line}`,
                borderRadius: 999,
                padding: ".35rem .8rem",
                textDecoration: "none",
              }}
            >
              New tab ↗
            </a>
          </div>
        </div>

        {/* stage */}
        <div style={{ position: "relative", aspectRatio: ratio, background: c.base }}>
          {active ? (
            <iframe
              src={src}
              title={title}
              onLoad={() => setLoaded(true)}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              loading="lazy"
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none", display: "block" }}
            />
          ) : (
            <button
              onClick={() => setActive(true)}
              aria-label={`Load live prototype: ${title}`}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                padding: 0,
                border: "none",
                cursor: "pointer",
                background: "transparent",
              }}
            >
              <Image
                src={poster}
                alt={`${title} — preview`}
                fill
                sizes="(max-width: 900px) 100vw, 1100px"
                style={{ objectFit: "cover" }}
              />
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(180deg, rgba(15,13,9,.05) 30%, rgba(15,13,9,.55) 100%)",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%,-50%)",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: ".7rem",
                  padding: ".85rem 1.7rem",
                  borderRadius: 999,
                  background: c.acc,
                  color: "#17150F",
                  ...mono(".62rem"),
                  boxShadow: "0 12px 40px -8px rgba(0,0,0,.45)",
                  whiteSpace: "nowrap",
                }}
              >
                <svg width="11" height="11" viewBox="0 0 12 12" fill="#17150F" aria-hidden>
                  <path d="M2.5 1.5l8 4.5-8 4.5v-9z" />
                </svg>
                Load live prototype
              </span>
              <span
                style={{
                  position: "absolute",
                  bottom: 14,
                  left: "50%",
                  transform: "translateX(-50%)",
                  ...mono(".5rem"),
                  color: "rgba(242,232,208,.85)",
                  whiteSpace: "nowrap",
                }}
              >
                Real code · real interactions · runs in place
              </span>
            </button>
          )}
        </div>
      </div>

      {mounted && fullscreen &&
        createPortal(
          <div
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              display: "flex",
              flexDirection: "column",
              background: c.base,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: ".8rem 1.4rem",
                borderBottom: `1px solid ${c.line}`,
              }}
            >
              <span style={{ ...mono(".6rem"), color: c.accd }}>{title} · Live prototype</span>
              <button
                onClick={() => setFullscreen(false)}
                style={{
                  ...mono(".58rem"),
                  color: c.ink,
                  background: "transparent",
                  border: `1px solid ${c.line}`,
                  borderRadius: 999,
                  padding: ".45rem 1rem",
                  cursor: "pointer",
                }}
              >
                ✕ Close
              </button>
            </div>
            <iframe
              src={src}
              title={`${title} — fullscreen`}
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
              style={{ flex: 1, width: "100%", border: "none" }}
            />
          </div>,
          document.body
        )}
    </>
  );
}
