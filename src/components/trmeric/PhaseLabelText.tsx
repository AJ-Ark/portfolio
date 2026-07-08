"use client";

import { useTranslation } from "@/lib/TranslationContext";
import { phaseLabelKey } from "./trmericPhaseMeta";

/* Tiny leaf so the (static, server-rendered) feature deep-dive header can
   show "Phase B · Portfolio Monitor" without pulling translation into
   that server component just for one word. */
export default function PhaseLabelText({ letter }: { letter: string }) {
  const { t } = useTranslation();
  return <>{t(phaseLabelKey(letter))}</>;
}
