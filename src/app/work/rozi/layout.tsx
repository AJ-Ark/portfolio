import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rozi · No middlemen, just work",
  description:
    "A two-sided labour marketplace connecting India's informal workers directly to employers. Top 5 at SARVA Designathon 2021.",
};

export default function RoziLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
