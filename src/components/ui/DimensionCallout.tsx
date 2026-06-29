"use client";

import { useEffect, useRef, useState } from "react";

interface DimensionCalloutProps {
  value: string;
  label: string;
  accent?: string;
  animate?: boolean;
}

export default function DimensionCallout({
  value,
  label,
  accent = "#FFA426",
  animate = true,
}: DimensionCalloutProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(!animate);

  useEffect(() => {
    if (!animate) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [animate]);

  return (
    <div
      ref={ref}
      className="inline-flex flex-col items-start gap-1"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
        transition: "opacity 0.6s var(--ease-plot), transform 0.6s var(--ease-plot)",
      }}
    >
      {/* Extension lines + tick top */}
      <div className="flex items-center gap-0" style={{ height: 12 }}>
        <div style={{ width: 1, height: 12, background: accent, opacity: 0.6 }} />
        <div style={{ width: 20, height: 1, background: accent, opacity: 0.4 }} />
      </div>

      {/* Value */}
      <span
        className="display-serif"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(2rem, 5vw, 3.5rem)",
          fontWeight: 300,
          lineHeight: 1,
          color: accent,
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </span>

      {/* Label in mono */}
      <div className="flex items-center gap-0">
        <div style={{ width: 20, height: 1, background: accent, opacity: 0.4 }} />
        <div style={{ width: 1, height: 8, background: accent, opacity: 0.6 }} />
        <span
          className="label-mono ml-2"
          style={{ color: "var(--color-graphite-light)" }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}
