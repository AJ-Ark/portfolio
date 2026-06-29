"use client";

import { useEffect, useState } from "react";

const CHARS = "ARAVIND J".split("");

export default function Preloader() {
  const [phase, setPhase] = useState<"plot" | "hold" | "fade" | "done">("plot");

  useEffect(() => {
    // Respect prefers-reduced-motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setPhase("done");
      return;
    }
    const t1 = setTimeout(() => setPhase("hold"), 900);
    const t2 = setTimeout(() => setPhase("fade"), 1200);
    const t3 = setTimeout(() => setPhase("done"), 1700);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  if (phase === "done") return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-ground)",
        opacity: phase === "fade" ? 0 : 1,
        transition: "opacity 0.5s ease",
        pointerEvents: "none",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.5rem, 6vw, 3.5rem)",
          fontWeight: 300,
          letterSpacing: "0.25em",
          color: "var(--color-paper)",
          display: "flex",
          gap: "0.05em",
        }}
      >
        {CHARS.map((ch, i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity: phase === "plot" ? 0 : 1,
              transform: phase === "plot" ? "translateY(0.3em)" : "translateY(0)",
              transition:
                phase === "plot"
                  ? "none"
                  : `opacity 0.4s ease ${i * 55}ms, transform 0.45s cubic-bezier(0.16,1,0.3,1) ${i * 55}ms`,
            }}
          >
            {ch === " " ? " " : ch}
          </span>
        ))}
      </span>
    </div>
  );
}
