import type { MetadataRoute } from "next";

/* ══════════════════════════════════════════════════════════════════
   ROBOTS — open to all crawlers, sitemap advertised.

   The whole portfolio is public and meant to be indexed; there are no
   private paths to disallow. The host + sitemap point at the canonical
   apex domain so aggregators resolve absolute URLs correctly.
   ══════════════════════════════════════════════════════════════════ */

const BASE = "https://aravindj.xyz";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
    host: BASE,
  };
}
