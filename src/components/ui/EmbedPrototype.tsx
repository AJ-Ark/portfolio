"use client";

import { useState } from "react";

interface EmbedPrototypeProps {
  src: string;
  title: string;
  height?: number;
  accent?: string;
}

export default function EmbedPrototype({
  src,
  title,
  height = 680,
  accent = "#FFA426",
}: EmbedPrototypeProps) {
  const [fullscreen, setFullscreen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const resolvedSrc = `/prototypes/${src}`;

  return (
    <>
      <div
        className="relative w-full rounded overflow-hidden"
        style={{
          border: `1px solid color-mix(in srgb, ${accent} 20%, transparent)`,
          background: "var(--color-ink)",
        }}
      >
        {/* Drafting toolbar */}
        <div
          className="flex items-center justify-between px-4 py-2"
          style={{
            borderBottom: `1px solid color-mix(in srgb, ${accent} 15%, transparent)`,
            background: "color-mix(in srgb, var(--color-ink) 80%, transparent)",
          }}
        >
          <div className="flex items-center gap-3">
            {/* Status dot */}
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: loaded ? accent : "#6B6157" }}
            />
            <span className="label-mono" style={{ color: "var(--color-graphite-light)" }}>
              {title}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="label-mono" style={{ color: "#3A352E", fontSize: "0.5rem" }}>
              LIVE PROTOTYPE
            </span>
            <button
              onClick={() => setFullscreen(true)}
              className="label-mono px-2 py-1 rounded transition-colors"
              style={{
                color: accent,
                border: `1px solid color-mix(in srgb, ${accent} 30%, transparent)`,
                fontSize: "0.55rem",
              }}
              aria-label="Open fullscreen"
            >
              ↗ EXPAND
            </button>
          </div>
        </div>

        {/* iframe */}
        <iframe
          src={resolvedSrc}
          title={title}
          width="100%"
          height={height}
          onLoad={() => setLoaded(true)}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          loading="lazy"
          style={{ display: "block", border: "none" }}
        />
      </div>

      {/* Fullscreen overlay */}
      {fullscreen && (
        <div
          className="fixed inset-0 z-[9999] flex flex-col"
          style={{ background: "var(--color-ground)" }}
        >
          <div
            className="flex items-center justify-between px-6 py-3"
            style={{ borderBottom: "1px solid #3A352E" }}
          >
            <span className="label-mono" style={{ color: accent }}>{title}</span>
            <button
              onClick={() => setFullscreen(false)}
              className="label-mono px-3 py-1 rounded"
              style={{ color: "var(--color-paper)", border: "1px solid #3A352E" }}
            >
              ✕ CLOSE
            </button>
          </div>
          <iframe
            src={resolvedSrc}
            title={title}
            className="flex-1 w-full"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
            style={{ border: "none" }}
          />
        </div>
      )}
    </>
  );
}
