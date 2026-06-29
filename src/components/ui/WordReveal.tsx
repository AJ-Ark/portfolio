"use client";

import { useEffect, useRef, useState } from "react";

interface WordRevealProps {
  children: string;
  as?: "h1" | "h2" | "h3" | "p" | "span" | "em";
  delay?: number;        // ms before first word appears
  stagger?: number;      // ms between each word
  className?: string;
  style?: React.CSSProperties;
}

export default function WordReveal({
  children,
  as: Tag = "h1",
  delay = 0,
  stagger = 60,
  className,
  style,
}: WordRevealProps) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect prefers-reduced-motion — show all at once
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) { setVisible(true); return; }

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Split on whitespace but preserve line-break markers encoded as \n
  const lines = children.split("\n");

  return (
    <Tag ref={ref as React.Ref<any>} className={className} style={style} aria-label={children}>
      {lines.map((line, li) => {
        const words = line.split(/(\s+)/);
        let wordIndex = lines
          .slice(0, li)
          .reduce((acc, l) => acc + l.split(/\s+/).filter(Boolean).length, 0);

        return (
          <span key={li} style={{ display: "block" }}>
            {words.map((chunk, ci) => {
              if (/^\s+$/.test(chunk)) return <span key={ci}> </span>;
              const idx = wordIndex++;
              return (
                <span
                  key={ci}
                  aria-hidden="true"
                  style={{
                    display: "inline-block",
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(0.4em)",
                    transition: visible
                      ? `opacity 0.55s ease ${delay + idx * stagger}ms, transform 0.55s cubic-bezier(0.16,1,0.3,1) ${delay + idx * stagger}ms`
                      : "none",
                    willChange: "opacity, transform",
                  }}
                >
                  {chunk}
                  {ci < words.length - 1 ? " " : ""}
                </span>
              );
            })}
          </span>
        );
      })}
    </Tag>
  );
}
