/* ══════════════════════════════════════════════════════════════════
   SELF-HOSTED FONTS — next/font
   Replaces the render-blocking Google Fonts + Fontshare <link> tags.
   Each loader exposes a CSS variable; globals.css @theme consumes them
   in the --font-display / --font-body / --font-mono stacks.
   display: "swap" + next/font's default adjustFontFallback keep the
   hero face from visibly reflowing (metric-matched fallback).
   ══════════════════════════════════════════════════════════════════ */

import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";

/* Display serif — full variable font: wght 100..900 covers the 300–700
   in use; the opsz 9..144 axis is required by `font-optical-sizing:
   auto` on .display-serif; italic is the site's editorial voice. */
export const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
  variable: "--font-fraunces",
});

/* Body fallback sans — sits behind General Sans in the stack. */
export const inter = Inter({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-inter",
});

/* Mono — kickers, labels, nav. Only 400/500 are used. */
export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
  display: "swap",
  variable: "--font-jetbrains-mono",
});

/* Body sans — General Sans has no Google Fonts mirror (Fontshare only),
   so the woff2 instances live in src/fonts/. 400–600 match the weights
   the old Fontshare link served; 700 is added because the Trmeric pages
   set var(--font-body) at 700/800 (800 synthesizes from 700 — General
   Sans ships no 800; previously it synthesized from 600). */
export const generalSans = localFont({
  src: [
    { path: "../fonts/GeneralSans-Regular.woff2", weight: "400", style: "normal" },
    { path: "../fonts/GeneralSans-Medium.woff2", weight: "500", style: "normal" },
    { path: "../fonts/GeneralSans-Semibold.woff2", weight: "600", style: "normal" },
    { path: "../fonts/GeneralSans-Bold.woff2", weight: "700", style: "normal" },
  ],
  display: "swap",
  variable: "--font-general-sans",
});
