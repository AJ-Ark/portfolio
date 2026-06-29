"use client";

import { useEffect, useRef, useState } from "react";

interface PlotInLinesProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export default function PlotInLines({
  children,
  delay = 0,
  className = "",
}: PlotInLinesProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(16px)",
        transition: `opacity 0.7s var(--ease-plot) ${delay}ms, transform 0.7s var(--ease-plot) ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}
