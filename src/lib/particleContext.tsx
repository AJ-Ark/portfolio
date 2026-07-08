"use client";

import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import type { Domain } from "@/data/projects";
import {
  engineReadyPromise,
  excite as exciteClimate,
  triggerScatter,
  type FormationName,
} from "@/lib/climate";
import { prefersReducedMotionNow } from "@/hooks/usePrefersReducedMotion";

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

  /* ── Engine v2 additions (additive — everything above is unchanged) ── */

  /** 'in' = dive into the cluster (startWarp), 'out' = the same shot
   *  played backward (reverseWarp), null = not warping. */
  warpMode: "in" | "out" | null;
  /** What shape the field currently holds:
   *  warp domain > top of the owner-keyed override stack > preview > route domain. */
  activeFormation: FormationName | null;
  /** Resolved horizontal offset for the active formation (0 while warping). */
  formationOffsetX: number;
  /** The dive played backward — use around back-navigation. Sets the same
   *  data-warp chrome fade; releases automatically when the pathname
   *  changes (plus the same failsafe). No-op under reduced motion. */
  reverseWarp: () => void;
  /** ~400ms scatter-and-resettle impulse for ordinary route changes.
   *  No-op under reduced motion. */
  scatterSettle: (durationMs?: number) => void;
  /** Morph the field into any formation. Overrides are OWNER-KEYED: each
   *  owner holds at most one entry in a stack, a (re-)request moves that
   *  owner's entry to the top, and the TOP entry is what the field shows.
   *  `requestFormation(null, { owner })` removes ONLY that owner's entry —
   *  whatever is underneath (another owner, or the preview/route flow)
   *  resumes. Omitting `owner` uses a shared legacy slot; independent
   *  features MUST pass a stable owner so they can never clobber each
   *  other's releases. */
  requestFormation: (
    name: FormationName | null,
    opts?: { offsetX?: number; owner?: string }
  ) => void;
  /** Kick the field's energy (0..1). Decays back to calm over decayMs.
   *  No-op under reduced motion. */
  excite: (intensity: number, decayMs?: number) => void;
  /** Resolves once the engine (GPU path or CPU fallback) is compiled,
   *  has rendered its first frame, and text formations are baked. */
  engineReady: () => Promise<void>;
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
  warpMode: null,
  activeFormation: null,
  formationOffsetX: 0,
  reverseWarp: () => {},
  scatterSettle: () => {},
  requestFormation: () => {},
  excite: () => {},
  engineReady: () => Promise.resolve(),
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

/** Owner used when a caller doesn't pass one — keeps old/ad-hoc call sites
 *  working exactly like the pre-stack single-slot override. */
const DEFAULT_FORMATION_OWNER = "__legacy__";

interface FormationEntry {
  owner: string;
  name: FormationName;
  offsetX: number;
}

export function ParticleProvider({ children, initialDomain = null }: { children: ReactNode; initialDomain?: Domain | null }) {
  const [domain, setDomain] = useState<Domain | null>(initialDomain);
  const [previewDomain, _setPreviewDomain] = useState<Domain | null>(null);
  const [previewOffsetX, setPreviewOffsetX] = useState(0);
  const [warpDomain, setWarpDomain] = useState<Domain | null>(null);
  const [warpMode, setWarpMode] = useState<"in" | "out" | null>(null);
  /* OWNER-KEYED STACK — replaces the old single last-writer-wins slot.
     Each owner holds at most one entry; a (re-)request moves that owner's
     entry to the end (= top); the active override is the top entry, so
     independent writers (loader / settling / work-page hover / …) can
     never clobber each other's release. See ENGINE-API.md §2. */
  const [formationStack, setFormationStack] = useState<FormationEntry[]>([]);
  const pathname = usePathname();
  const warpStartPath = useRef<string | null>(null);

  const setPreviewDomain = useCallback((d: Domain | null, offsetX = 0) => {
    _setPreviewDomain(d);
    setPreviewOffsetX(offsetX);
  }, []);

  const startWarp = useCallback((d: Domain) => {
    warpStartPath.current = window.location.pathname;
    setWarpDomain(d);
    setWarpMode("in");
    // Page chrome (header/main/footer) fades out via globals.css
    document.documentElement.setAttribute("data-warp", "1");
  }, []);

  /** The dive played backward: the camera pulls back out through the dust
   *  while the chrome fades — for back-navigation. Same release/failsafe
   *  path as startWarp. */
  const reverseWarp = useCallback(() => {
    if (prefersReducedMotionNow()) return; // calm path: plain navigation
    warpStartPath.current = window.location.pathname;
    setWarpMode("out");
    document.documentElement.setAttribute("data-warp", "1");
  }, []);

  const endWarp = useCallback(() => {
    document.documentElement.removeAttribute("data-warp");
    setWarpDomain(null);
    setWarpMode(null);
    warpStartPath.current = null;
  }, []);

  const warping = warpDomain !== null || warpMode !== null;

  const scatterSettle = useCallback((durationMs = 400) => {
    if (prefersReducedMotionNow()) return;
    triggerScatter(durationMs);
  }, []);

  const requestFormation = useCallback(
    (name: FormationName | null, opts?: { offsetX?: number; owner?: string }) => {
      const owner = opts?.owner ?? DEFAULT_FORMATION_OWNER;
      setFormationStack((prev) => {
        const withoutOwner = prev.filter((e) => e.owner !== owner);
        if (name === null) return withoutOwner;
        return [...withoutOwner, { owner, name, offsetX: opts?.offsetX ?? 0 }];
      });
    },
    []
  );

  const excite = useCallback((intensity: number, decayMs = 1200) => {
    if (prefersReducedMotionNow()) return;
    exciteClimate(intensity, decayMs);
  }, []);

  const engineReady = useCallback(() => engineReadyPromise(), []);

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

  /* The active override is the top of the stack (last entry = most
     recently pushed/re-requested owner). */
  const topFormation =
    formationStack.length > 0 ? formationStack[formationStack.length - 1] : null;

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
        warpMode,
        activeFormation: warpDomain ?? topFormation?.name ?? previewDomain ?? domain,
        formationOffsetX: warping ? 0 : topFormation !== null ? topFormation.offsetX : previewOffsetX,
        reverseWarp,
        scatterSettle,
        requestFormation,
        excite,
        engineReady,
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

/* Store re-exports so features can read the climate without threading
   the React context (frame-loop friendly, allocation-free). */
export { getClimate, subscribeClimate } from "@/lib/climate";
export type { FormationName, ClimateState } from "@/lib/climate";
