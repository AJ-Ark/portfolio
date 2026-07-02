"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { Domain } from "@/data/projects";

interface ParticleContextValue {
  domain: Domain | null;
  setDomain: (d: Domain | null) => void;
  previewDomain: Domain | null;
  setPreviewDomain: (d: Domain | null, offsetX?: number) => void;
  activeDomain: Domain | null; // warp > preview > route domain
  /** Normalized horizontal offset (-1 left edge .. 0 center .. 1 right edge) for
   *  where the active domain's particle cluster should render on screen, so it
   *  can sit inside whichever panel/card is actually triggering the preview
   *  instead of always converging on screen-center. */
  previewOffsetX: number;
  /** True while the "dive into the particles" project-entry transition runs.
   *  The camera plunges into the cluster and the page chrome fades out —
   *  the dive is the loader that covers the route change. */
  warping: boolean;
  startWarp: (d: Domain) => void;
}

const ParticleContext = createContext<ParticleContextValue>({
  domain: null,
  setDomain: () => {},
  previewDomain: null,
  setPreviewDomain: () => {},
  activeDomain: null,
  previewOffsetX: 0,
  warping: false,
  startWarp: () => {},
});

/* How long after arriving on the new route the warp holds before releasing
   (lets the new formation begin resolving before the page fades in). */
const WARP_ARRIVAL_HOLD_MS = 400;
/* If navigation never happens (error, dev hiccup), never leave the page
   invisible — force-release the warp. */
const WARP_FAILSAFE_MS = 4000;
/* How long the dive owns the screen before the route swaps underneath it.
   Long enough to feel like a slow immersion, not a cut. */
const WARP_NAV_MS = 900;
/* Realm is a standalone static site — entering it is a hard navigation,
   handled specially below so the dive stays alive until the very swap. */
const REALM_DOC = "/realm/index.html";

export function ParticleProvider({ children, initialDomain = null }: { children: ReactNode; initialDomain?: Domain | null }) {
  const [domain, setDomain] = useState<Domain | null>(initialDomain);
  const [previewDomain, _setPreviewDomain] = useState<Domain | null>(null);
  const [previewOffsetX, setPreviewOffsetX] = useState(0);
  const [warpDomain, setWarpDomain] = useState<Domain | null>(null);
  const pathname = usePathname();
  const warpStartPath = useRef<string | null>(null);

  const setPreviewDomain = useCallback((d: Domain | null, offsetX = 0) => {
    _setPreviewDomain(d);
    setPreviewOffsetX(offsetX);
  }, []);

  const startWarp = useCallback((d: Domain) => {
    warpStartPath.current = window.location.pathname;
    setWarpDomain(d);
    // Page chrome (header/main/footer) fades out via globals.css
    document.documentElement.setAttribute("data-warp", "1");
  }, []);

  const endWarp = useCallback(() => {
    document.documentElement.removeAttribute("data-warp");
    setWarpDomain(null);
    warpStartPath.current = null;
  }, []);

  const warping = warpDomain !== null;

  /* Release the warp shortly after the route actually changes — the new
     page mounts hidden (data-warp still set), the formation starts
     resolving, then the page fades in as the camera pulls back out. */
  useEffect(() => {
    if (!warping || pathname === warpStartPath.current) return;
    const t = window.setTimeout(endWarp, WARP_ARRIVAL_HOLD_MS);
    return () => window.clearTimeout(t);
  }, [pathname, warping, endWarp]);

  /* Failsafe: never leave the page faded out if navigation stalls. */
  useEffect(() => {
    if (!warping) return;
    const t = window.setTimeout(endWarp, WARP_FAILSAFE_MS);
    return () => window.clearTimeout(t);
  }, [warping, endWarp]);

  return (
    <ParticleContext.Provider
      value={{
        domain,
        setDomain,
        previewDomain,
        setPreviewDomain,
        activeDomain: warpDomain ?? previewDomain ?? domain,
        previewOffsetX,
        warping,
        startWarp,
      }}
    >
      {children}
    </ParticleContext.Provider>
  );
}

export function useParticle() {
  return useContext(ParticleContext);
}

/** Navigate to a project through the particle dive. Falls back to a plain
 *  navigation when the user prefers reduced motion. */
export function useWarpNavigate() {
  const router = useRouter();
  const { startWarp } = useParticle();

  return useCallback(
    (href: string, domain: Domain) => {
      /* Realm skips the /work/realm redirect hop and navigates straight to
         the static document. Crucially, a hard navigation keeps the CURRENT
         page rendering while the next document is fetched — the dive never
         stops moving until the swap — and the cross-document view
         transition (globals.css) crossfades the two instead of flashing. */
      const isRealm = domain === "realm";
      const dest = isRealm ? REALM_DOC : href;

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        if (isRealm) window.location.assign(dest);
        else router.push(dest);
        return;
      }

      if (isRealm) {
        // Warm the document in the HTTP cache while the dive plays.
        fetch(dest, { cache: "force-cache" }).catch(() => {});
      } else {
        router.prefetch(dest);
      }
      startWarp(domain);
      window.setTimeout(() => {
        if (isRealm) window.location.assign(dest);
        else router.push(dest);
      }, WARP_NAV_MS);
    },
    [router, startWarp]
  );
}
