"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Domain } from "@/data/projects";

interface ParticleContextValue {
  domain: Domain | null;
  setDomain: (d: Domain | null) => void;
  previewDomain: Domain | null;
  setPreviewDomain: (d: Domain | null, offsetX?: number) => void;
  activeDomain: Domain | null; // preview takes priority over route domain
  /** Normalized horizontal offset (-1 left edge .. 0 center .. 1 right edge) for
   *  where the active domain's particle cluster should render on screen, so it
   *  can sit inside whichever panel/card is actually triggering the preview
   *  instead of always converging on screen-center. */
  previewOffsetX: number;
}

const ParticleContext = createContext<ParticleContextValue>({
  domain: null,
  setDomain: () => {},
  previewDomain: null,
  setPreviewDomain: () => {},
  activeDomain: null,
  previewOffsetX: 0,
});

export function ParticleProvider({ children, initialDomain = null }: { children: ReactNode; initialDomain?: Domain | null }) {
  const [domain, setDomain] = useState<Domain | null>(initialDomain);
  const [previewDomain, _setPreviewDomain] = useState<Domain | null>(null);
  const [previewOffsetX, setPreviewOffsetX] = useState(0);

  const setPreviewDomain = useCallback((d: Domain | null, offsetX = 0) => {
    _setPreviewDomain(d);
    setPreviewOffsetX(offsetX);
  }, []);

  return (
    <ParticleContext.Provider
      value={{
        domain,
        setDomain,
        previewDomain,
        setPreviewDomain,
        activeDomain: previewDomain ?? domain,
        previewOffsetX,
      }}
    >
      {children}
    </ParticleContext.Provider>
  );
}

export function useParticle() {
  return useContext(ParticleContext);
}
