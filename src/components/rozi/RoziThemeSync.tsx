"use client";

import { useColorScheme } from "@/hooks/useColorScheme";

/* ═══════════════════════════════════════════════════════════════════
   RoziThemeSync — the page's only client island for theme handling.

   Keeps `data-theme` in sync on live OS-theme changes. Renders nothing:
   every color on the Rozi page resolves from CSS vars (per data-theme),
   so nothing branches on a JS boolean — server and client render
   identical markup (no hydration mismatch, no flash). Isolating the
   hook call here lets the page itself stay a server component.
   ═══════════════════════════════════════════════════════════════════ */
export default function RoziThemeSync() {
  useColorScheme();
  return null;
}
