"use client";

import dynamic from "next/dynamic";
import DomainTheme from "./DomainTheme";

const GlobalCanvas = dynamic(() => import("./GlobalCanvas"), { ssr: false });
const DomainSync = dynamic(() => import("./DomainSync"), { ssr: false });

export default function WebGLLayer() {
  return (
    <>
      <GlobalCanvas />
      <DomainSync />
      <DomainTheme />
    </>
  );
}
