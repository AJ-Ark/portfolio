"use client";

import type { CSSProperties, ReactNode } from "react";
import { useColorScheme } from "@/hooks/useColorScheme";

interface TrmericThemeProps {
  children: ReactNode;
  /** Extra style merged in after the palette vars — e.g. the brand page
      paints its background on this wrapper, while the main case-study
      page deliberately leaves it off (ground paint lives on <main> only,
      so html[data-warp] can fade header/main/footer without hiding the
      dust field — see the comment at that page's wrapper). */
  style?: CSSProperties;
}

/* Single source of the Trmeric dark/light palette, exposed as CSS custom
   properties so the rest of the Trmeric case-study pages can be plain
   server components that read `var(--trm-*)` instead of each re-running
   this ternary. Values are byte-identical to what the pages used to
   compute inline via useColorScheme() — this only relocates where the
   dark/light branch lives. */
export default function TrmericTheme({ children, style }: TrmericThemeProps) {
  const dark = useColorScheme();

  const vars = {
    "--trm-base": dark ? "#0E0C0A" : "#FAF7F1",
    "--trm-base2": dark ? "#1A1613" : "#F1EADC",
    "--trm-ink": dark ? "#F2E8D0" : "#17150F",
    "--trm-dim": dark ? "rgba(242,232,208,.62)" : "rgba(23,21,15,.62)",
    "--trm-faint": dark ? "rgba(242,232,208,.36)" : "rgba(23,21,15,.36)",
    "--trm-accd": dark ? "#FF9A35" : "#E8730E",
    "--trm-line": dark ? "rgba(255,164,38,.14)" : "rgba(23,21,15,.12)",
    "--trm-shadow": dark ? "0 4px 32px -8px rgba(0,0,0,.65)" : "0 4px 24px -8px rgba(23,21,15,.14)",
  } as CSSProperties;

  return (
    <div style={{ ...vars, color: "var(--trm-ink)", minHeight: "100vh", ...style }}>
      {children}
    </div>
  );
}
