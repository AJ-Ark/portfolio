"use client";
import { useState, useEffect } from "react";

export function useColorScheme(): boolean {
  // Always start `true`, matching the server's default (no `document` access
  // in the initializer). Reading `data-theme` here would make the very first
  // client render diverge from the SSR output — and React's hydration commit
  // does not patch a mismatched `style` attribute, it just warns and keeps
  // the server value, leaving light-mode visitors stuck on dark colors.
  // Correcting the value in the effect below is a normal post-hydration
  // re-render instead, which patches styles correctly.
  const [dark, setDark] = useState<boolean>(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => {
      const isDark = mq.matches;
      document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
      setDark(isDark);
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return dark;
}
