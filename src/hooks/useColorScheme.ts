"use client";
import { useState, useEffect } from "react";

export function useColorScheme(): boolean {
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof document !== "undefined") {
      return document.documentElement.getAttribute("data-theme") !== "light";
    }
    return true;
  });

  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => {
      const isDark = mq.matches;
      document.documentElement.setAttribute("data-theme", isDark ? "dark" : "light");
      setDark(isDark);
    };
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return dark;
}
