import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/layout/SmoothScroll";
import { ParticleProvider } from "@/lib/particleContext";
import WebGLLayer from "@/components/3d/WebGLLayer";

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
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Stamp data-theme before first paint — eliminates flash */}
        <script dangerouslySetInnerHTML={{ __html: `try{var d=window.matchMedia('(prefers-color-scheme:dark)').matches;document.documentElement.setAttribute('data-theme',d?'dark':'light')}catch(e){}` }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..900;1,9..144,300..900&family=JetBrains+Mono:wght@400;500&family=Inter:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600&display=swap"
          rel="stylesheet"
        />
        {/* Idle-time prefetch of the standalone Realm site's critical path,
            so entering Realm (a hard navigation) swaps documents with its
            dependencies already in cache — no loader gap mid-transition.
            three.module.js needs crossOrigin to match the module request. */}
        <link rel="prefetch" href="/realm/index.html" />
        <link rel="prefetch" href="/realm/css/style.css" as="style" />
        <link rel="prefetch" href="/realm/js/main.js" />
        <link rel="prefetch" href="https://unpkg.com/three@0.160.0/build/three.module.js" as="script" crossOrigin="anonymous" />
        <link rel="prefetch" href="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" as="script" />
        <link rel="prefetch" href="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js" as="script" />
        <link rel="prefetch" href="https://unpkg.com/lenis@1.0.42/dist/lenis.min.js" as="script" />
      </head>
      <body>
        {/* Skip to content — recruiter bypass, always first */}
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>

        <ParticleProvider>
          {/* Global WebGL canvas + route sync — lazy loaded, text paints first */}
          <WebGLLayer />
          <SmoothScroll>
            {/* Page content sits above the canvas */}
            <div style={{ position: "relative", zIndex: 1 }}>
              {children}
            </div>
          </SmoothScroll>
        </ParticleProvider>
      </body>
    </html>
  );
}
