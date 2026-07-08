"use client";

/* ══════════════════════════════════════════════════════════════════
   RealmPrefetch — idle-time prefetch of the standalone Realm site's
   critical path, so entering Realm (a hard navigation) swaps documents
   with its dependencies already in cache — no loader gap mid-transition.

   Previously these were static <link rel="prefetch"> tags in layout.tsx,
   which fired on EVERY route and competed with each page's own assets.
   Now they are injected only on routes where the Realm portal is one
   click away (home reel, /work index, the rippl cross-link) and only
   during browser idle time.
   three.module.js needs crossOrigin to match the module request.
   ══════════════════════════════════════════════════════════════════ */

import { useEffect } from "react";
import { usePathname } from "next/navigation";

type Prefetch = {
  href: string;
  as?: string;
  crossOrigin?: "anonymous";
};

const PREFETCHES: Prefetch[] = [
  { href: "/realm/index.html" },
  { href: "/realm/css/style.css", as: "style" },
  { href: "/realm/js/main.js" },
  {
    href: "https://unpkg.com/three@0.160.0/build/three.module.js",
    as: "script",
    crossOrigin: "anonymous",
  },
  { href: "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js", as: "script" },
  { href: "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js", as: "script" },
  { href: "https://cdn.jsdelivr.net/npm/lenis@1.0.42/dist/lenis.min.js", as: "script" },
];

/* Every route that links to the Realm hard navigation:
   "/" (home reel card), "/work" (project list row → /work/realm redirect),
   "/work/rippl" (explicit cross-link to /work/realm). */
const REALM_ADJACENT = ["/", "/work", "/work/rippl"];

export default function RealmPrefetch() {
  const pathname = usePathname();

  useEffect(() => {
    if (!REALM_ADJACENT.includes(pathname)) return;

    const inject = () => {
      for (const { href, as, crossOrigin } of PREFETCHES) {
        /* Once injected the links persist for the session — prefetched
           responses live in the HTTP cache, so never re-add. */
        if (document.head.querySelector(`link[rel="prefetch"][href="${href}"]`)) continue;
        const link = document.createElement("link");
        link.rel = "prefetch";
        link.href = href;
        if (as) link.as = as;
        if (crossOrigin) link.crossOrigin = crossOrigin;
        document.head.appendChild(link);
      }
    };

    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(inject, { timeout: 4000 });
      return () => window.cancelIdleCallback(id);
    }
    /* Safari has no requestIdleCallback — defer past first paint instead. */
    const id = window.setTimeout(inject, 2500);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
