"use client";

import Link from "next/link";
import { useRef, type ComponentPropsWithoutRef, type MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { useParticle, useWarpNavigate } from "@/lib/particleContext";
import { prefersReducedMotionNow } from "@/hooks/usePrefersReducedMotion";
import type { Domain } from "@/data/projects";

/* How long the scatter-settle impulse owns the field before the route
   swaps underneath it — matches the engine's default scatterSettle(400). */
const SETTLE_NAV_MS = 400;

type WarpLinkProps = Omit<ComponentPropsWithoutRef<typeof Link>, "href"> & {
  href: string;
  /** The transition grammar for this link:
   *  - `"warp"`   — the particle dive that doubles as the loader. For
   *    project entries; requires `domain`.
   *  - `"settle"` — a ~400ms scatter-and-resettle impulse, then navigate.
   *    For ordinary internal routes (nav / footer / about / index links).
   *  Unspecified: links WITH a `domain` warp (backward compatible with all
   *  existing call sites), links without one settle — the sane default for
   *  non-project internal navigation. */
  variant?: "warp" | "settle";
  domain?: Domain;
  /** Contextual-cursor + magnetism hooks (consumed by the global cursor). */
  "data-cursor"?: string;
  "data-magnetic"?: string | boolean;
};

/** A link that never hard-cuts: it enters projects through the particle
 *  dive (the transition doubles as the loader while the route changes) or
 *  rides a scatter-settle impulse for ordinary routes. Client wrapper so
 *  server-rendered listings (e.g. /work) can use the grammar too.
 *
 *  Degrades honestly: modified clicks (new tab, download) are left to the
 *  browser, reduced motion navigates instantly (the engine's transition
 *  calls are no-ops there anyway), and without JS it is a plain <a>. */
export default function WarpLink({
  href,
  domain,
  variant,
  onClick,
  children,
  ...rest
}: WarpLinkProps) {
  const warpNav = useWarpNavigate();
  const { scatterSettle } = useParticle();
  const router = useRouter();
  /* Re-entrancy guard: a double-click during the transition window must not
     queue a second navigation. Cleared after the window in case navigation
     fails (the engine has its own warp failsafe). */
  const pending = useRef(false);

  const resolved: "warp" | "settle" = variant ?? (domain ? "warp" : "settle");

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e);
    if (e.defaultPrevented) return;
    /* New-tab / new-window / download intents belong to the browser. */
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    if (pending.current) return;

    if (resolved === "warp" && domain) {
      pending.current = true;
      warpNav(href, domain); // handles prefetch, reduced motion, Realm hard-nav
      window.setTimeout(() => { pending.current = false; }, 1200);
      return;
    }

    /* settle — instant under reduced motion (scatterSettle is a no-op there,
       so waiting 400ms would just be dead air). */
    if (prefersReducedMotionNow()) {
      router.push(href);
      return;
    }
    pending.current = true;
    router.prefetch(href);
    scatterSettle();
    window.setTimeout(() => {
      router.push(href);
      pending.current = false;
    }, SETTLE_NAV_MS);
  };

  return (
    <Link href={href} {...rest} onClick={handleClick}>
      {children}
    </Link>
  );
}
