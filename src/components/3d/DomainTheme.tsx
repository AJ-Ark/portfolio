"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function getDomain(pathname: string): string {
  if (pathname.includes("/realm")) return "realm";
  if (pathname.includes("/rippl")) return "rippl";
  if (pathname.includes("/trmeric")) return "trmeric";
  if (pathname.includes("/rozi")) return "rozi";
  return "";
}

export default function DomainTheme() {
  const pathname = usePathname();

  useEffect(() => {
    const domain = getDomain(pathname);
    const html = document.documentElement;
    // Remove any previous domain attribute then set the new one
    html.removeAttribute("data-domain");
    if (domain) {
      // Small delay so the CSS transition reads as a change, not an instant swap
      const id = setTimeout(() => html.setAttribute("data-domain", domain), 20);
      return () => clearTimeout(id);
    }
  }, [pathname]);

  return null;
}
