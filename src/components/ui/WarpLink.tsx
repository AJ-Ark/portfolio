"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { useWarpNavigate } from "@/lib/particleContext";
import type { Domain } from "@/data/projects";

/** A project link that enters through the particle dive — the transition
 *  doubles as the loader while the route changes. Client wrapper so
 *  server-rendered listings (e.g. /work) can use the warp too. */
export default function WarpLink({
  href,
  domain,
  className,
  style,
  children,
}: {
  href: string;
  domain: Domain;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const warpNav = useWarpNavigate();
  return (
    <Link
      href={href}
      className={className}
      style={style}
      onClick={(e) => {
        e.preventDefault();
        warpNav(href, domain);
      }}
    >
      {children}
    </Link>
  );
}
