"use client";

import { useTranslation } from "@/lib/TranslationContext";
import PhaseRail, { type RailFeature } from "./PhaseRail";
import type { TrmColors } from "./PrototypeFrame";
import { PHASE_META, phaseLabelKey } from "./trmericPhaseMeta";

/* PhaseRail (owned by another surface) takes `phases` as a plain,
   already-resolved prop rather than a render function, so the
   translation lookup has to happen in this small client wrapper instead
   of in the server page. */
export default function TrmericPhaseRailNav({
  features,
  watchId,
  colors,
}: {
  features: RailFeature[];
  watchId: string;
  colors: TrmColors;
}) {
  const { t } = useTranslation();
  const phases = PHASE_META.map(({ letter }) => ({ letter, label: t(phaseLabelKey(letter)) }));
  return <PhaseRail features={features} phases={phases} watchId={watchId} colors={colors} />;
}
