import type { MetadataRoute } from "next";
import { projectsBySlug } from "@/data/projects";

/* ══════════════════════════════════════════════════════════════════
   SITEMAP — every real, crawlable route.

   Absolute URLs resolve off the metadataBase declared in layout.tsx
   (https://aravindj.xyz). The Trmeric sub-piece routes are derived
   from the data so a new subPiece can never silently fall out of the
   sitemap. Priorities: home first, the four case studies next, the
   Trmeric deep-dives and brand page below them.
   ══════════════════════════════════════════════════════════════════ */

const BASE = "https://aravindj.xyz";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const trmericSlugs = projectsBySlug["trmeric"].subPieces ?? [];

  const staticRoutes: {
    path: string;
    priority: number;
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  }[] = [
    { path: "/", priority: 1.0, changeFrequency: "monthly" },
    { path: "/work", priority: 0.9, changeFrequency: "monthly" },
    { path: "/about", priority: 0.8, changeFrequency: "monthly" },
    { path: "/work/trmeric", priority: 0.8, changeFrequency: "monthly" },
    { path: "/work/realm", priority: 0.8, changeFrequency: "monthly" },
    { path: "/work/rippl", priority: 0.7, changeFrequency: "monthly" },
    { path: "/work/rozi", priority: 0.7, changeFrequency: "monthly" },
    { path: "/work/trmeric/brand", priority: 0.6, changeFrequency: "yearly" },
  ];

  const entries: MetadataRoute.Sitemap = staticRoutes.map((r) => ({
    url: `${BASE}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  for (const piece of trmericSlugs) {
    entries.push({
      url: `${BASE}/work/trmeric/${piece.slug}`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.6,
    });
  }

  return entries;
}
