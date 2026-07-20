import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Realm of Elementals · Where vanishing wings are kept alive",
  description:
    "Realm of Elementals is a WebAR butterfly-guardianship experience and physical installation by Aravind J that turns conservation into care.",
  openGraph: {
    title: "Realm of Elementals",
    description: "Where vanishing wings are kept alive. A WebAR guardianship experience by Aravind J.",
    images: ["/realm/assets/poster.jpg"],
    type: "website",
  },
};

export default function RealmLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
