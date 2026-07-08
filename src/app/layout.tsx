import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/layout/SmoothScroll";
import RealmPrefetch from "@/components/layout/RealmPrefetch";
import { ParticleProvider } from "@/lib/particleContext";
import WebGLLayer from "@/components/3d/WebGLLayer";
import { TranslationProvider } from "@/lib/TranslationContext";
import { fraunces, generalSans, inter, jetbrainsMono } from "@/lib/fonts";

export const metadata: Metadata = {
  title: {
    default: "Aravind J · Product Designer & UX Researcher",
    template: "%s · Aravind J",
  },
  description:
    "Senior Product Designer & UX Researcher. Architect by training, designer by practice. Building things to understand things.",
  keywords: ["product design", "UX research", "interaction design", "portfolio"],
  authors: [{ name: "Aravind Jegajeeva Rajasekar" }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "Aravind J",
    title: "Aravind J · Product Designer & UX Researcher",
    description:
      "Senior Product Designer & UX Researcher. Architect by training, designer by practice.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Aravind J · Product Designer & UX Researcher",
    description:
      "Senior Product Designer & UX Researcher. Architect by training, designer by practice.",
  },
  metadataBase: new URL("https://aravindj.xyz"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${fraunces.variable} ${generalSans.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* Stamp data-theme before first paint — eliminates flash */}
        <script dangerouslySetInnerHTML={{ __html: `try{var d=window.matchMedia('(prefers-color-scheme:dark)').matches;document.documentElement.setAttribute('data-theme',d?'dark':'light')}catch(e){}` }} />
      </head>
      <body>
        {/* Skip to content — recruiter bypass, always first */}
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>

        {/* Idle-time Realm prefetch — home route only, renders nothing */}
        <RealmPrefetch />

        <ParticleProvider>
          <TranslationProvider>
            {/* Global WebGL canvas + route sync — lazy loaded, text paints first */}
            <WebGLLayer />
            <SmoothScroll>
              {/* Page content sits above the canvas */}
              <div style={{ position: "relative", zIndex: 1 }}>
                {children}
              </div>
            </SmoothScroll>
          </TranslationProvider>
        </ParticleProvider>
      </body>
    </html>
  );
}
