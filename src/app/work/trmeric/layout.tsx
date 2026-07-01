import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trmeric · Product Design",
  description:
    "Senior Product Designer on the founding team of Trmeric. 23 surfaces, one AI-native enterprise platform, built from scratch as sole designer.",
};

export default function TrmericLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
