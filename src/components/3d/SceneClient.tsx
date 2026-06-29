"use client";

import dynamic from "next/dynamic";
import type { Domain } from "@/data/projects";

const Scene = dynamic(() => import("./Scene"), {
  ssr: false,
  loading: () => null,
});

interface SceneClientProps {
  domain?: Domain | null;
  className?: string;
  style?: React.CSSProperties;
}

export default function SceneClient({ domain = null, className = "", style }: SceneClientProps) {
  return <Scene domain={domain} className={className} style={style} />;
}
