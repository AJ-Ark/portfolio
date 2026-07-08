/* Static (non-translated) data for the Trmeric lifecycle phases — letter,
   icon, the fixed English surface list, and the deep-dive anchor. Labels,
   questions, personas, and long-form descriptions ARE translated; the *Key
   helpers below build the message keys so both the phase grid and the
   deep-dive header can look them up without duplicating the "trmeric.phase.X.Y"
   string shape. Kept out of any "use client" file on purpose — this module
   is imported by both the server page and the small client islands that
   need the translated text. */

export interface PhaseMetaEntry {
  letter: "A" | "B" | "C" | "D";
  icon: "chat" | "grid" | "flag" | "eye";
  surfaces: string[];
  anchor: string;
}

export const PHASE_META: PhaseMetaEntry[] = [
  { letter: "A", icon: "chat", surfaces: ["Demand intake", "Canvas", "Tango AI scoping", "Ideation"], anchor: "#demand-owner-flow" },
  { letter: "B", icon: "grid", surfaces: ["Resource Manager", "Portfolio Monitor", "Budget", "Potential Hub"], anchor: "#portfolio-monitor" },
  { letter: "C", icon: "flag", surfaces: ["Project Manager", "RAID", "Signals", "Trucible", "Action Hub"], anchor: "#project-manager" },
  { letter: "D", icon: "eye", surfaces: ["Portfolio Monitor (CIO)", "Action Hub", "Kudos", "Cockpit"], anchor: "#surfaces" },
];

export function phaseLabelKey(letter: string): string {
  return `trmeric.phase.${letter.toLowerCase()}.label`;
}
export function phaseQuestionKey(letter: string): string {
  return `trmeric.phase.${letter.toLowerCase()}.question`;
}
export function phasePersonaKey(letter: string): string {
  return `trmeric.phase.${letter.toLowerCase()}.persona`;
}
export function phaseDescKey(letter: string): string {
  return `trmeric.phase.${letter.toLowerCase()}.desc`;
}
