"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "@/hooks/useInView";

interface Props {
  src: string;
  num: string;
  accent: string;
  freezeAt?: number;
  poster?: string;
}

export default function RipplVideoCard({ src, num, accent, freezeAt = 0.1, poster }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [started, setStarted] = useState(false);
  const startedRef = useRef(false);
  const seekedOnce = useRef(false);
  const freezeSeek = useRef(false);
  const { ref: boxRef, inView } = useInView<HTMLDivElement>({ once: false, threshold: 0 });

  /* Pause playback the moment the card scrolls out of view. Playback is
     user-initiated, so we never auto-resume — the controls stay available
     for the reader to pick the video back up. */
  useEffect(() => {
    if (!inView) videoRef.current?.pause();
  }, [inView]);

  function handlePlay() {
    const v = videoRef.current;
    if (!v) return;
    startedRef.current = true;
    freezeSeek.current = false; // cancel any pending freeze-frame pause
    v.currentTime = 0;
    v.play();
    setStarted(true);
  }

  return (
    <div ref={boxRef} style={{ position: "relative", height: "220px", background: "#000" }}>
      <video
        ref={videoRef}
        src={src}
        controls={started}
        preload="metadata"
        poster={poster}
        playsInline
        onLoadedData={(e) => {
          // Freeze on a representative frame only when no poster exists and
          // the reader hasn't started playback. With preload="metadata" this
          // event can fire as late as first play, so both guards matter —
          // otherwise the seek would yank an in-progress playback to freezeAt.
          if (poster || startedRef.current || seekedOnce.current) return;
          seekedOnce.current = true;
          freezeSeek.current = true;
          e.currentTarget.currentTime = freezeAt;
        }}
        onSeeked={(e) => {
          // Pause only the programmatic freeze-frame seek — never a user
          // scrub via the native controls, and never handlePlay's rewind.
          if (freezeSeek.current) {
            freezeSeek.current = false;
            e.currentTarget.pause();
          }
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
