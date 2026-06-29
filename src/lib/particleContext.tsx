"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import type { Domain } from "@/data/projects";

interface ParticleContextValue {
  domain: Domain | null;
  setDomain: (d: Domain | null) => void;
  previewDomain: Domain | null;
  setPreviewDomain: (d: Domain | null) => void;
  activeDomain: Domain | null; // preview takes priority over route domain
}

const ParticleContext = createContext<ParticleContextValue>({
  domain: null,
  setDomain: () => {},
  previewDomain: null,
  setPreviewDomain: () => {},
  activeDomain: null,
});

export function ParticleProvider({ children, initialDomain = null }: { children: ReactNode; initialDomain?: Domain | null }) {
  const [domain, setDomain] = useState<Domain | null>(initialDomain);
  const [previewDomain, setPreviewDomain] = useState<Domain | null>(null);

  return (
    <ParticleContext.Provider
      value={{
        domain,
        setDomain,
        previewDomain,
        setPreviewDomain,
        activeDomain: previewDomain ?? domain,
      }}
    >
      {children}
    </ParticleContext.Provider>
  );
}

export function useParticle() {
  return useContext(ParticleContext);
}
