"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useParticle } from "@/lib/particleContext";
import type { Domain } from "@/data/projects";

function getDomainFromPath(pathname: string): Domain | null {
  if (pathname.includes("/trmeric")) return "trmeric";
  if (pathname.includes("/realm")) return "realm";
  if (pathname.includes("/rippl")) return "rippl";
  return null;
}

export default function DomainSync() {
  const pathname = usePathname();
  const { setDomain } = useParticle();

  useEffect(() => {
    setDomain(getDomainFromPath(pathname));
  }, [pathname, setDomain]);

  return null;
}
