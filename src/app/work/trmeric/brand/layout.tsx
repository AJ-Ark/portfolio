import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trmeric · Logo, Loaded — Brand Identity",
  description:
    "The Trmeric mark is not designed, it is grown: 18 turmeric cross-sections, the golden ratio, five rings, five brand promises. The full brand identity story.",
};

export default function TrmericBrandLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
