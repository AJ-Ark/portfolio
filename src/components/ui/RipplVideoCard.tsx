"use client";

import { useRef, useState } from "react";

interface Props {
  src: string;
  num: string;
  accent: string;
  freezeAt?: number;
}

export default function RipplVideoCard({ src, num, accent, freezeAt = 0.1 }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const seekedOnce = useRef(false);

  function handlePlay() {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.play();
    setStarted(true);
  }

  return (
    <div style={{ position: "relative", height: "220px", background: "#000" }}>
      <video
        ref={videoRef}
        src={src}
        controls={started}
        preload="auto"
        playsInline
        onLoadedData={(e) => {
          // "loadeddata" (not "loadedmetadata") guarantees the browser has
          // actually decoded a frame at the current position, so a seek
          // issued here reliably paints — seeking right after
          // "loadedmetadata" can silently fail to render on some videos,
          // especially when freezeAt is far from 0.
          if (!seekedOnce.current) {
            seekedOnce.current = true;
            e.currentTarget.currentTime = freezeAt;
          }
        }}
        onSeeked={(e) => {
          // Belt-and-braces: some browsers need an explicit pause after a
          // programmatic seek to keep rendering the seeked-to frame instead
          // of reverting to frame 0.
          e.currentTarget.pause();
        }}
        onEnded={() => setStarted(false)}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
      />

      {!started && (
        <button
          onClick={handlePlay}
          aria-label="Play video"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "rgba(0,0,0,.18)",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <span
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              border: `1.5px solid ${accent}`,
              background: "rgba(0,0,0,.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(2px)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M5 3.5l11 5.5-11 5.5V3.5z" fill={accent} />
            </svg>
          </span>
        </button>
      )}

      {/* Corner index */}
      <span
        style={{
          position: "absolute",
          top: ".8rem",
          left: ".8rem",
          fontFamily: "var(--font-display)",
          fontStyle: "italic",
          fontSize: "1.5rem",
          color: accent,
          lineHeight: 1,
          opacity: 0.85,
          textShadow: "0 1px 4px rgba(0,0,0,.6)",
          pointerEvents: "none",
        }}
      >
        {num}
      </span>
    </div>
  );
}
