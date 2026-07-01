import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rippl · Notes beyond the page",
  description:
    "A projector-table lamp that fights distracted reading and turns notetaking into a two-way interaction. 12-week research-to-hardware-to-interface project at NID.",
};

export default function RipplLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
