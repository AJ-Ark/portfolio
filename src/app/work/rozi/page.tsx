"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useEffect, useRef } from "react";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import InlineVideo from "@/components/ui/InlineVideo";
import Reveal from "@/components/ui/Reveal";
import NextProject from "@/components/ui/NextProject";
import RoziThemeSync from "@/components/rozi/RoziThemeSync";
import { makeRoziPalette, type RoziPalette } from "@/components/rozi/palette";
import FieldNotes from "@/components/rozi/FieldNotes";
import EmpathyMap from "@/components/rozi/EmpathyMap";
import PersonaCard from "@/components/rozi/PersonaCard";
import LifecycleMap from "@/components/rozi/LifecycleMap";
import OpportunityMindMap from "@/components/rozi/OpportunityMindMap";
import Methodology from "@/components/rozi/Methodology";
import UserFlow from "@/components/rozi/UserFlow";
import MarketStudy from "@/components/rozi/MarketStudy";
import InfoArchitecture from "@/components/rozi/InfoArchitecture";
import { useInView } from "@/hooks/useInView";
import { prefersReducedMotionNow } from "@/hooks/usePrefersReducedMotion";
import { useParticle, subscribeClimate } from "@/lib/particleContext";

/* ── Content ──────────────────────────────────────────────────────── */

const FLOWS = [
  { src: "/videos/rozi/flow-01-language.mp4", poster: "/videos/rozi/flow-01-language-poster.webp", label: "Language selection",     desc: "Hindi, regional, English" },
  { src: "/videos/rozi/flow-05-employee.mp4", poster: "/videos/rozi/flow-05-employee-poster.webp", label: "Worker registration",    desc: "OTP-based, no literacy barrier" },
  { src: "/videos/rozi/flow-02-jobs.mp4",     poster: "/videos/rozi/flow-02-jobs-poster.webp",     label: "Browse jobs by PINCODE", desc: "Location-first discovery" },
  { src: "/videos/rozi/flow-03-contact.mp4",  poster: "/videos/rozi/flow-03-contact-poster.webp",  label: "Contact employer",       desc: "Direct, no intermediary" },
  { src: "/videos/rozi/flow-07-confirm.mp4",  poster: "/videos/rozi/flow-07-confirm-poster.webp",  label: "Confirm assignment",     desc: "Pay and hours upfront" },
];

const SCREENS = [
  "/images/rozi/screen-01.png",
  "/images/rozi/screen-02.png",
  "/images/rozi/screen-03.png",
  "/images/rozi/screen-04.png",
];

const CITATIONS = [
  {
    quote: "Labour migration within India is crucial for economic growth and improving people's socio-economic condition — it can raise income, build skills, and widen access to healthcare and education.",
    source: "weforum.org",
  },
  {
    quote: "The contribution of migrant workers is enormous, yet little is offered in return for their security and well-being. Without making migration dignified, inclusive growth stays a distant dream.",
    source: "aajeevika.org",
  },
  {
    quote: "Post-1980s growth triggered inter-state migration as opportunity outweighed the cost of moving — making portable food security, healthcare and a basic social-security framework crucial to migrant welfare.",
    source: "eastasiaforum.org",
  },
];

const HMW = [
  { q: "How might we create an application that helps them find work without having to ask for it?", filled: true },
  { q: "How might we let people work with the technology they are already familiar with?",            filled: false },
  { q: "How might we protect this community from the exploitation of their documents?",               filled: true },
];

const PRINCIPLES = [
  { label: "No email required",       text: "OTP over SMS is the only credential. A phone number is the baseline — nothing more." },
  { label: "Multilingual by default", text: "Hindi and regional languages are first-class, not translations. English is optional." },
  { label: "Offline-first fallback",  text: "Railway-station kiosks and post-office access points for workers without a smartphone." },
  { label: "Voice-compatible",        text: "Every critical flow supports voice navigation for users with limited literacy." },
];

/* ── Small shared bits (take the palette so the page stays coherent) ── */

const kick = (font: string, color: string): CSSProperties => ({
  fontFamily: font, fontSize: ".56rem", letterSpacing: ".24em",
  textTransform: "uppercase", color, display: "block",
});

function PhaseHeader({ p, num, label }: { p: RoziPalette; num: string; label: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1.4rem", marginBottom: "3.4rem" }}>
      <span style={{ fontFamily: p.MONO, fontSize: ".6rem", letterSpacing: ".26em", textTransform: "uppercase", color: p.GOLDT }}>
        <span style={{ color: p.ACCT }}>{num}</span>&nbsp;·&nbsp;{label}
      </span>
      <div style={{ flex: 1, height: "1px", background: p.LINE, maxWidth: "14rem" }} />
    </div>
  );
}

function SectionTitle({ p, children, max }: { p: RoziPalette; children: React.ReactNode; max?: string }) {
  return (
    <h2 style={{
      fontFamily: p.SERIF, fontWeight: 400,
      fontSize: "clamp(1.8rem, 4vw, 3.2rem)", lineHeight: 1.08,
      letterSpacing: "-.025em", color: p.PAP, maxWidth: max ?? "20ch",
    }}>
      {children}
    </h2>
  );
}

/* ── Count-up stat (scroll-triggered) ────────────────────────────────
   SSR/no-JS-safe: ships the authored final string ("40 cr", "93%",
   "₹0", "4+"…) so crawlers and no-JS readers always get the real
   number. Mirrors Reveal.tsx's fold-check: only resets to zero and
   counts back up if the stat is actually below the fold when it
   mounts — content already on screen never flashes empty-then-full.
   Reduced motion never resets it, so the authored value is on screen
   the entire time. Direct textContent mutation, no React state, so
   the 60fps tween never touches the render path. */
function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotionNow()) return;

    const match = value.match(/[\d.]+/);
    if (!match || match.index === undefined) return;
    const target = parseFloat(match[0]);
    if (Number.isNaN(target)) return;
    const decimals = match[0].includes(".") ? match[0].split(".")[1].length : 0;
    const prefix = value.slice(0, match.index);
    const suffix = value.slice(match.index + match[0].length);
    const format = (t: number) => `${prefix}${(target * t).toFixed(decimals)}${suffix}`;

    const fold = window.innerHeight * 0.9;
    if (el.getBoundingClientRect().top < fold) return; // already visible — keep the final value

    el.textContent = format(0);

    if (typeof IntersectionObserver === "undefined") {
      el.textContent = value;
      return;
    }

    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const duration = 1100;
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = t < 1 ? format(eased) : value;
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.3, rootMargin: "0px 0px -10% 0px" }
    );
    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return <span ref={ref}>{value}</span>;
}

/* ── Chapter seam ─────────────────────────────────────────────────────
   A gradient-faded gap between phases. The site's dust field renders
   behind every route already (WebGLLayer is a fixed, persistent
   canvas — see src/components/3d/ENGINE-API.md); this page just
   happens to be fully opaque top to bottom, so the field is never
   actually seen while reading it. A seam is a deliberate hole in that
   opacity: background fades from the previous section's ground color
   to fully transparent and back into the next section's — while it's
   in view it also pins the "rozi" ripple formation (owner "rozi", the
   engine's owner-keyed formation stack) so what shows through is
   unmistakably this case study's own field, not a stray hover preview
   from elsewhere. Releases the owner on leave/unmount; no-op under
   reduced motion. Purely atmospheric — no copy — so the hairline
   border the adjacent sections used to carry is dropped in favor of
   this softer transition. */
function ChapterSeam({ p, from, to }: { p: RoziPalette; from: string; to: string }) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0, rootMargin: "0px 0px -20% 0px" });
  const { requestFormation } = useParticle();

  useEffect(() => {
    if (!inView || prefersReducedMotionNow()) return;
    requestFormation("rozi", { owner: "rozi" });
    return () => requestFormation(null, { owner: "rozi" });
  }, [inView, requestFormation]);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      style={{
        position: "relative",
        height: "clamp(200px, 26vw, 340px)",
        background: `linear-gradient(to bottom, ${from} 0%, transparent 40%, transparent 60%, ${to} 100%)`,
      }}
    >
      <span
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          width: "1px",
          height: "56px",
          background: `linear-gradient(to bottom, transparent, ${p.GOLD}, transparent)`,
          opacity: 0.5,
        }}
      />
    </div>
  );
}

/* ── The Mashidur interstitial ────────────────────────────────────────
   A dramatized chapter seam pinned between Empathize and Define: the
   verbatim line from the field visit (see FieldNotes.tsx — "the words
   he kept returning to") gets the full viewport to itself. Same
   transparent-window + owner-keyed "rozi" formation mechanism as
   ChapterSeam above, plus a CSS-only monsoon treatment layered on top:
   a diagonal "rain" texture and a gold→maroon wash both intensify as
   the section crosses into view (a `subscribeClimate` reader also
   feeds the field's own live turbulence/excitement into the rain
   opacity — the exact "DOM gradient reacting to the field's
   temperament" pattern in ENGINE-API.md §3). `excite()` fires once on
   entry as the "gust" that opens the downpour. Everything is gated by
   `.is-inview` (CSS transitions/keyframes only) so it degrades to a
   static, already-settled, maroon-leaning scene under reduced motion —
   no motion, no scroll dependency, verbatim quote unchanged either way. */
function MashidurInterstitial({ p }: { p: RoziPalette }) {
  const { ref, inView } = useInView<HTMLElement>({ threshold: 0.4, rootMargin: "0px 0px -15% 0px" });
  const { requestFormation, excite } = useParticle();
  const excitedRef = useRef(false);

  useEffect(() => {
    if (!inView || prefersReducedMotionNow()) return;
    requestFormation("rozi", { owner: "rozi" });
    if (!excitedRef.current) {
      excite(0.5);
      excitedRef.current = true;
    }
    return () => requestFormation(null, { owner: "rozi" });
  }, [inView, requestFormation, excite]);

  useEffect(() => {
    if (!inView || prefersReducedMotionNow()) return;
    return subscribeClimate((c) => {
      ref.current?.style.setProperty(
        "--rz-rain-heat",
        String(Math.min(1, c.excitement + c.turbulence))
      );
    });
  }, [inView, ref]);

  return (
    <section
      ref={ref}
      aria-label="Field note"
      className={`rz-interstitial${inView ? " is-inview" : ""}`}
      style={{
        position: "relative",
        minHeight: "100dvh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        padding: "6rem var(--pad)",
        ["--rz-rain-heat" as string]: "0",
      }}
    >
      <style>{`
        .rz-interstitial {
          background: linear-gradient(to bottom, ${p.GND2} 0%, transparent 16%, transparent 84%, ${p.GND} 100%);
        }
        .rz-interstitial::before,
        .rz-interstitial::after {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .rz-interstitial::before {
          background: radial-gradient(120% 90% at 50% 34%, color-mix(in srgb, ${p.GOLD} 26%, transparent), transparent 68%);
          opacity: .55;
          transition: opacity 1.3s var(--ease-plot, ease);
        }
        .rz-interstitial::after {
          background: radial-gradient(130% 100% at 50% 72%, color-mix(in srgb, ${p.ACC} 40%, transparent), transparent 70%);
          opacity: .1;
          transition: opacity 1.3s var(--ease-plot, ease);
        }
        .rz-interstitial.is-inview::before { opacity: .1; }
        .rz-interstitial.is-inview::after  { opacity: .6; }

        .rz-interstitial .rz-rain {
          position: absolute;
          inset: -12% -6%;
          pointer-events: none;
          background-image: repeating-linear-gradient(112deg, ${p.FAINT} 0 1px, transparent 1px 34px);
          opacity: calc(.14 + var(--rz-rain-heat, 0) * .22);
          transition: opacity .8s var(--ease-plot, ease);
        }
        @media (prefers-reduced-motion: no-preference) {
          .rz-interstitial .rz-rain { animation: rz-rain-fall 2.8s linear infinite; }
          .rz-interstitial.is-inview .rz-rain { animation-duration: 1.15s; }
        }
        @keyframes rz-rain-fall {
          from { background-position: 0 0; }
          to   { background-position: -48px 240px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .rz-interstitial::before { opacity: .1 !important; transition: none; }
          .rz-interstitial::after  { opacity: .6 !important; transition: none; }
          .rz-interstitial .rz-rain { opacity: .3 !important; animation: none !important; transition: none; }
        }

        .rz-interstitial-mark {
          color: ${p.GOLDT};
          transition: color 1.1s var(--ease-plot, ease);
        }
        .rz-interstitial.is-inview .rz-interstitial-mark { color: ${p.ACCT}; }
        @media (prefers-reduced-motion: reduce) {
          .rz-interstitial-mark { color: ${p.ACCT} !important; transition: none; }
        }
      `}</style>

      <span className="rz-rain" aria-hidden="true" />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "56ch", textAlign: "center" }}>
        <span
          style={{
            fontFamily: p.MONO, fontSize: ".56rem", letterSpacing: ".28em",
            textTransform: "uppercase", color: p.FAINT, display: "block", marginBottom: "2rem",
          }}
        >
          Field note · verbatim
        </span>
        <span
          aria-hidden="true"
          className="rz-interstitial-mark"
          style={{ fontFamily: p.SERIF, fontSize: "clamp(3rem, 7vw, 5.5rem)", lineHeight: 0.6, display: "block", marginBottom: "1rem" }}
        >
          &ldquo;
        </span>
        <p
          style={{
            fontFamily: p.SERIF, fontStyle: "italic", fontWeight: 400,
            fontSize: "clamp(1.8rem, 4.6vw, 3.4rem)", lineHeight: 1.2,
            letterSpacing: "-.01em", color: p.PAP, marginBottom: "1.6rem",
          }}
        >
          Adjust karna padta hai.
        </p>
        <p style={{ fontSize: ".95rem", color: p.DIM, marginBottom: "2.2rem" }}>
          — roughly, &ldquo;we just have to adjust.&rdquo;
        </p>
        <span
          style={{
            fontFamily: p.MONO, fontSize: ".56rem", letterSpacing: ".2em",
            textTransform: "uppercase", color: p.FAINT,
          }}
        >
          Mashidur Shaik, 26 · migrant construction worker, Kerala
        </span>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════ */

export default function RoziPage() {
  const p = makeRoziPalette();
  const GND88 = "color-mix(in srgb, var(--rz-gnd) 90%, transparent)";
  const GND50 = "color-mix(in srgb, var(--rz-gnd) 55%, transparent)";
  const goldInk = "color-mix(in srgb, var(--rz-gold) 24%, #000)";

  return (
    <>
      {/* Client island: keeps data-theme in sync on live OS-theme changes.
          Renders nothing. (The page itself is now a client component —
          see the chapter seams/interstitial below — but RoziThemeSync
          still isolates the theme-sync effect on its own, same as every
          other case study.) */}
      <RoziThemeSync />
      <Navigation />
      {/* No background here on purpose: every section below already paints
          its own opaque ground (p.GND / p.GND2), so main staying transparent
          costs nothing normally — except at the chapter seams and the
          Mashidur interstitial, which are DELIBERATELY left without one so
          the sitewide dust field (always rendering behind every route —
          see WebGLLayer) shows through for that one beat. The epilogue
          below is wrapped with its own explicit background to keep its
          look unchanged. */}
      <main id="main-content" style={{ color: p.PAP }}>

        {/* ═══ 01 · HERO ═══ */}
        <section style={{
          minHeight: "100dvh", display: "flex", flexDirection: "column",
          justifyContent: "flex-end", position: "relative", overflow: "hidden",
          padding: "0 var(--pad) 4rem",
        }}>
          <div style={{ position: "absolute", inset: 0 }}>
            <Image
              src="/images/rozi/hero-phones.png"
              alt="Rozi running on two Android phones — the job listing and the worker onboarding screens"
              fill
              style={{ objectFit: "cover", objectPosition: "center 35%" }}
              priority
            />
          </div>
          <div aria-hidden="true" style={{
            position: "absolute", inset: 0,
            background: `linear-gradient(to top, ${p.GND} 0%, ${GND88} 35%, ${GND50} 65%, transparent 100%)`,
          }} />
          <div aria-hidden="true" style={{
            position: "absolute", top: "10vh", left: "var(--pad)", zIndex: 2,
            fontFamily: p.SERIF, fontWeight: 400,
            fontSize: "clamp(6rem, 22vw, 20rem)", lineHeight: 0.85,
            letterSpacing: "-.06em", color: p.PAP, opacity: 0.06,
            userSelect: "none", pointerEvents: "none",
          }}>Rozi</div>

          {/* Staged entrance: kicker → headline → lede → stat row. Reveal.tsx
              deliberately skips above-the-fold content (hiding it after
              paint would flash it out and back in), so the hero — always
              above the fold — has never animated in. This is a pure-CSS
              stand-in that's safe from that exact flash: the keyframes are
              declared in the stylesheet from the very first paint (no JS
              timing race), scoped to `no-preference` so reduced motion
              renders every line at its final position immediately. */}
          <div style={{ position: "relative", zIndex: 3 }}>
            <style>{`
              @media (prefers-reduced-motion: no-preference) {
                .rz-hero-kicker, .rz-hero-head, .rz-hero-lede, .rz-hero-stats {
                  animation: rz-hero-in .8s var(--ease-plot, ease) both;
                }
                .rz-hero-kicker { animation-delay: .05s; }
                .rz-hero-head   { animation-delay: .22s; }
                .rz-hero-lede   { animation-delay: .46s; }
                .rz-hero-stats  { animation-delay: .66s; }
              }
              @keyframes rz-hero-in {
                from { opacity: 0; transform: translateY(18px); }
                to   { opacity: 1; transform: translateY(0); }
              }
            `}</style>
            <span className="rz-hero-kicker" style={{ ...kick(p.MONO, p.GOLDT), marginBottom: "1.4rem" }}>
              UX Research · Service Design · SARVA Designathon 2021
            </span>
            <h1 className="rz-hero-head" style={{
              fontFamily: p.SERIF, fontWeight: 400,
              fontSize: "clamp(2.8rem, 7vw, 6rem)", lineHeight: 1.0,
              letterSpacing: "-.02em", color: p.PAP, marginBottom: "1.4rem",
            }}>
              No middlemen.<br />
              <em style={{ fontStyle: "italic", color: p.GOLDB }}>Just work.</em>
            </h1>
            <p className="rz-hero-lede" style={{ fontSize: "clamp(.9rem, 1.5vw, 1.1rem)", color: p.DIM, maxWidth: "50ch", lineHeight: 1.7, marginBottom: "2.5rem" }}>
              A marketplace connecting India&apos;s 40 crore informal workers to employers
              directly. Register, find work, get paid — the contractor takes nothing.
            </p>
            <div className="rz-hero-stats" style={{ display: "flex", flexWrap: "wrap", gap: "2.5rem", paddingTop: "1.8rem", borderTop: `1px solid ${p.LINEW}` }}>
              {[
                ["Outcome",  "Top 5 nationally"],
                ["Sprint",   "24 hours"],
                ["Platform", "Two-sided marketplace"],
                ["Role",     "UX Research + Service Design"],
              ].map(([l, v]) => (
                <div key={l}>
                  <span style={{ fontFamily: p.MONO, fontSize: ".5rem", letterSpacing: ".2em", textTransform: "uppercase", color: p.FAINT, display: "block", marginBottom: ".3rem" }}>{l}</span>
                  <span style={{ fontSize: ".8rem", color: p.DIM }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══ 02 · OVERVIEW ═══ */}
        <section style={{ borderTop: `1px solid ${p.LINEW}`, background: p.GND, padding: "7rem var(--pad)" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <Reveal>
              <span style={{ ...kick(p.MONO, p.ACCT), marginBottom: "3.5rem" }}>Overview</span>
            </Reveal>
            <Reveal className="mobile-stack" stagger style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "3rem" }}>
              {[
                { l: "The goal", t: <>Use technology to help a socio-economically backward community meet their everyday needs — and hand them a reliable alternative to the middleman.</> },
                { l: "Who it's for", t: <>Rozi gives migrant workers control over <em style={{ fontStyle: "italic", color: p.GOLDT }}>what, when and how</em> they work by cutting out the contractor. Anyone seeking work near them can use it.</> },
                { l: "Target audience", t: <>Designed first for unskilled workers on the employee side — the people the current system serves the least.</> },
              ].map((c, i) => (
                <div key={c.l} style={{ borderTop: `2px solid ${i === 1 ? p.GOLD : p.ACC}`, paddingTop: "1.6rem" }}>
                  <span style={{ ...kick(p.MONO, i === 1 ? p.GOLDT : p.ACCT), marginBottom: "1.2rem" }}>
                    {c.l}
                  </span>
                  <p style={{ fontFamily: p.SERIF, fontWeight: 400, fontSize: "clamp(1.15rem, 2vw, 1.55rem)", lineHeight: 1.35, letterSpacing: "-.01em", color: p.PAP }}>
                    {c.t}
                  </p>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ═══ 03 · PROBLEM ═══ */}
        <section style={{ borderTop: `1px solid ${p.LINEW}` }}>
          {/* Scale */}
          <div style={{ background: p.GND2, padding: "6rem var(--pad) 5rem", borderBottom: `1px solid ${p.LINEW}` }}>
            <Reveal className="mobile-stack" stagger style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", maxWidth: "1100px", margin: "0 auto" }}>
              {[
                { value: "40 cr", label: "Informal workers in India" },
                { value: "93%",   label: "Of the workforce is informal" },
                { value: "₹0",    label: "Legal recourse when wages are skimmed" },
              ].map(({ value, label }, i) => (
                <div key={label} style={{ height: "100%", padding: "1rem 3rem", borderLeft: i === 0 ? "none" : `1px solid ${p.LINEW}` }}>
                  <div style={{ fontFamily: p.SERIF, fontWeight: 300, fontSize: "clamp(2.6rem, 5.5vw, 4.5rem)", lineHeight: 1, letterSpacing: "-.03em", color: p.ACC, marginBottom: ".6rem" }}><CountUp value={value} /></div>
                  <div style={{ fontFamily: p.MONO, fontSize: ".52rem", letterSpacing: ".18em", textTransform: "uppercase", color: p.DIM }}>{label}</div>
                </div>
              ))}
            </Reveal>
          </div>

          {/* Statement + citations */}
          <div style={{ padding: "8rem var(--pad)", background: p.GND }}>
            <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
              <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: "5rem", alignItems: "start" }}>
                <Reveal stagger>
                  <span style={{ ...kick(p.MONO, p.ACCT), marginBottom: "2.5rem" }}>The problem</span>
                  <p style={{ fontFamily: p.SERIF, fontWeight: 400, fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)", lineHeight: 1.15, letterSpacing: "-.02em", color: p.PAP, marginBottom: "2rem" }}>
                    Mashidur needs steady income and healthcare — and a way to find work
                    without walking door to door, because the middlemen he depends on are
                    unreliable.
                  </p>
                  <p style={{ fontSize: "1rem", color: p.DIM, lineHeight: 1.7 }}>
                    A contractor in the middle means wages skimmed, hours hidden, and no
                    recourse when either side breaks trust. The contractor negotiates on
                    both sides and pockets a margin from each — with no paperwork, no
                    accountability, and no shared record of what was actually agreed.
                  </p>
                </Reveal>
                <Reveal stagger style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                  <span style={{ ...kick(p.MONO, p.GOLDT), marginBottom: ".4rem" }}>Secondary study</span>
                  {CITATIONS.map((c) => (
                    <figure key={c.source} style={{ margin: 0, padding: "1.4rem 1.6rem", background: p.GND2, border: `1px solid ${p.LINEW}`, borderRadius: "14px" }}>
                      <blockquote style={{ margin: 0, fontSize: ".9rem", color: p.DIM, lineHeight: 1.6 }}>
                        {/* Hanging gold serif quote mark — same editorial device as the persona verbatim */}
                        <span aria-hidden="true" style={{ fontFamily: p.SERIF, fontStyle: "italic", fontSize: "1.45rem", lineHeight: 0, verticalAlign: "-.3em", color: p.GOLDT, marginRight: ".28rem" }}>&ldquo;</span>
                        {c.quote}
                      </blockquote>
                      <figcaption style={{ fontFamily: p.MONO, fontSize: ".5rem", letterSpacing: ".14em", textTransform: "uppercase", color: p.FAINT, marginTop: ".9rem" }}>{c.source}</figcaption>
                    </figure>
                  ))}
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        {/* ═══ 04 · MARKET STUDY ═══ */}
        <section style={{ borderTop: `1px solid ${p.LINEW}`, background: p.GND2, padding: "8rem var(--pad)" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <Reveal>
              <span style={{ ...kick(p.MONO, p.ACCT), marginBottom: "1.4rem" }}>Market study</span>
              <SectionTitle p={p}>What are the competitors doing?</SectionTitle>
            </Reveal>
            <div style={{ marginTop: "4rem" }}>
              <MarketStudy p={p} />
            </div>
          </div>
        </section>

        {/* ═══ 05 · METHODOLOGY ═══ */}
        <section style={{ borderTop: `1px solid ${p.LINEW}`, background: p.GND, padding: "8rem var(--pad) 6rem" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <Reveal className="mobile-stack" stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "end", marginBottom: "4.5rem" }}>
              <div>
                <span style={{ ...kick(p.MONO, p.GOLDT), marginBottom: "2rem" }}>Research grounding · 24-hour sprint</span>
                <SectionTitle p={p}>We started in the field, not in the brief.</SectionTitle>
              </div>
              <p style={{ fontSize: "1rem", color: p.DIM, lineHeight: 1.7 }}>
                Within the first two hours we were at railway stations and bus stands —
                talking to workers, not about them. Research ran as a design-thinking
                process: empathize, define, ideate, then prototype, each phase feeding a
                concrete output into the next.
              </p>
            </Reveal>
            <Methodology p={p} intro="" />
          </div>
          {/* research stats */}
          <div style={{ maxWidth: "1200px", margin: "5rem auto 0", borderTop: `1px solid ${p.LINEW}`, paddingTop: "3rem" }}>
            <Reveal className="mobile-stack" stagger style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
              {[
                { value: "4+",  label: "Field locations" },
                { value: "6",   label: "Workers interviewed" },
                { value: "4",   label: "Design phases in 24h" },
                { value: "7",   label: "Systemic gaps mapped" },
              ].map(({ value, label }, i) => (
                <div key={label} style={{ height: "100%", padding: "0 2.5rem", borderLeft: i === 0 ? "none" : `1px solid ${p.LINEW}` }}>
                  <div style={{ fontFamily: p.SERIF, fontWeight: 300, fontSize: "clamp(2rem, 4vw, 3.2rem)", lineHeight: 1, letterSpacing: "-.03em", color: p.GOLDT, marginBottom: ".5rem" }}><CountUp value={value} /></div>
                  <div style={{ fontFamily: p.MONO, fontSize: ".5rem", letterSpacing: ".18em", textTransform: "uppercase", color: p.DIM }}>{label}</div>
                </div>
              ))}
            </Reveal>
          </div>
        </section>

        <ChapterSeam p={p} from={p.GND} to={p.GND2} />

        {/* ═══ 06 · EMPATHIZE ═══ */}
        <section style={{ background: p.GND2, padding: "8rem var(--pad)" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <Reveal>
              <PhaseHeader p={p} num="01" label="Empathize" />
            </Reveal>
            <Reveal className="mobile-stack" stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start", marginBottom: "4rem" }}>
              <SectionTitle p={p}>We talked to workers, not about them.</SectionTitle>
              <p style={{ fontSize: "1rem", color: p.DIM, lineHeight: 1.7 }}>
                Life-mapping sessions at railway stations, bus stands and construction
                sites. The pattern held across every conversation: workers don&apos;t know
                their wage until payday, because the contractor negotiates on both sides
                and keeps the difference. There is no shared ground truth.
              </p>
            </Reveal>

            <FieldNotes p={p} />

            <div style={{ marginTop: "5.5rem" }}>
              <Reveal>
                <span style={{ ...kick(p.MONO, p.GOLDT), marginBottom: "2rem" }}>Empathy map</span>
              </Reveal>
              <EmpathyMap p={p} />
            </div>

            <div style={{ marginTop: "5.5rem" }}>
              <Reveal>
                <span style={{ ...kick(p.MONO, p.GOLDT), marginBottom: "2rem" }}>Who we designed for</span>
              </Reveal>
              <div style={{ maxWidth: "920px" }}>
                <PersonaCard p={p} />
              </div>
            </div>
          </div>
        </section>

        <MashidurInterstitial p={p} />

        {/* ═══ 07 · DEFINE ═══ */}
        <section style={{ background: p.GND, padding: "8rem var(--pad)" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <Reveal>
              <PhaseHeader p={p} num="02" label="Define" />
            </Reveal>
            <Reveal className="mobile-stack" stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start", marginBottom: "4.5rem" }}>
              <SectionTitle p={p}>Four stages, from first job to forced return.</SectionTitle>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                <p style={{ fontSize: "1rem", color: p.DIM, lineHeight: 1.7 }}>
                  We mapped the full arc of a migrant worker&apos;s economic life to find
                  where the contractor system extracts value — and where a direct platform
                  could create it instead.
                </p>
                <p style={{ fontSize: "1rem", color: p.DIM, lineHeight: 1.7 }}>
                  Peak earning carries the highest exploitation risk; the beginning of exit
                  is where the absence of any safety net costs the most — illness with no
                  recourse, and children pulled into the same cycle.
                </p>
              </div>
            </Reveal>
            <LifecycleMap p={p} />
          </div>
        </section>

        <ChapterSeam p={p} from={p.GND} to={p.GND2} />

        {/* ═══ 08 · IDEATE ═══ */}
        <section style={{ background: p.GND2, padding: "8rem var(--pad)" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <Reveal>
              <PhaseHeader p={p} num="03" label="Ideate" />
            </Reveal>
            <Reveal className="mobile-stack" stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start", marginBottom: "4.5rem" }}>
              <SectionTitle p={p}>Seven systemic gaps — one rule: don&apos;t become the new middleman.</SectionTitle>
              <p style={{ fontSize: "1rem", color: p.DIM, lineHeight: 1.7 }}>
                If the contractor extracts value at every node a worker touches, what direct
                infrastructure could create value at those same nodes? Every idea carried a
                single constraint — the platform must never become a new intermediary
                controlling a different part of the chain.
              </p>
            </Reveal>

            <OpportunityMindMap p={p} />

            {/* HMW */}
            <div style={{ marginTop: "5.5rem" }}>
              <Reveal>
                <span style={{ ...kick(p.MONO, p.GOLDT), marginBottom: "2.5rem" }}>How might we…</span>
              </Reveal>
              <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", alignItems: "center" }}>
                <Reveal>
                  <p style={{ fontFamily: p.SERIF, fontWeight: 400, fontStyle: "italic", fontSize: "clamp(1.5rem, 3vw, 2.4rem)", lineHeight: 1.25, letterSpacing: "-.01em", color: p.PAP }}>
                    What, and how, can we design for these socio-economic groups?
                  </p>
                </Reveal>
                <Reveal stagger style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
                  {HMW.map(({ q, filled }, i) => (
                    <div key={i} style={{
                      padding: "1.7rem 2rem", borderRadius: "20px",
                      background: filled ? p.GOLD : p.GND,
                      border: filled ? "1.5px solid transparent" : `1.5px solid ${p.GOLD}`,
                      color: filled ? goldInk : p.GOLDT,
                      fontSize: ".98rem", fontWeight: 700, lineHeight: 1.4,
                      marginLeft: i % 2 === 1 ? "1.6rem" : "0",
                      boxShadow: filled ? p.SHADOW : "none",
                    }}>
                      {q}
                    </div>
                  ))}
                </Reveal>
              </div>
            </div>
          </div>
        </section>

        <ChapterSeam p={p} from={p.GND2} to={p.GND} />

        {/* ═══ 09 · PROTOTYPE / ARCHITECTURE ═══ */}
        <section style={{ background: p.GND, padding: "8rem var(--pad)" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <Reveal>
              <PhaseHeader p={p} num="04" label="Prototype" />
            </Reveal>
            <Reveal className="mobile-stack" stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start", marginBottom: "4.5rem" }}>
              <SectionTitle p={p}>A two-sided system with a shared record.</SectionTitle>
              <p style={{ fontSize: "1rem", color: p.DIM, lineHeight: 1.7 }}>
                Employers post verified requirements; workers browse, apply and get a
                digital record of the agreed wage. Both sides can withdraw, report and rate.
                The platform earns by being useful — not by controlling information.
              </p>
            </Reveal>

            <InfoArchitecture p={p} />

            <div style={{ marginTop: "5.5rem" }}>
              <Reveal>
                <span style={{ ...kick(p.MONO, p.GOLDT), marginBottom: "2rem" }}>The worker&apos;s path</span>
              </Reveal>
              <UserFlow p={p} />
            </div>
          </div>
        </section>

        {/* ═══ 10 · PRODUCT IN MOTION ═══ */}
        <section style={{ borderTop: `1px solid ${p.LINEW}`, background: p.GND2, padding: "8rem var(--pad)" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <Reveal stagger style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "2rem", marginBottom: "4rem" }}>
              <div>
                <span style={{ ...kick(p.MONO, p.GOLDT), marginBottom: "1rem" }}>The product in motion</span>
                <SectionTitle p={p} max="18ch">Five key journeys, recorded from the prototype.</SectionTitle>
              </div>
              <p style={{ fontSize: ".875rem", color: p.DIM, lineHeight: 1.7, maxWidth: "32ch" }}>
                Every flow was designed for low-end Android phones, 2G networks, and users
                with limited literacy or English.
              </p>
            </Reveal>

            <Reveal className="mobile-stack" stagger style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "1.5rem", marginBottom: "5rem" }}>
              {FLOWS.map(({ src, poster, label, desc }) => (
                <div key={src} style={{ display: "flex", flexDirection: "column", gap: ".8rem" }}>
                  <div style={{ borderRadius: "12px", overflow: "hidden", background: p.GND, border: `1px solid ${p.LINE}` }}>
                    <InlineVideo src={src} poster={poster} aria-label={label} style={{ width: "100%", aspectRatio: "668 / 1652" }} />
                  </div>
                  <span style={{ fontFamily: p.MONO, fontSize: ".52rem", letterSpacing: ".16em", textTransform: "uppercase", color: p.GOLDT }}>{label}</span>
                  <span style={{ fontSize: ".75rem", color: p.DIM }}>{desc}</span>
                </div>
              ))}
            </Reveal>

            {/* Inclusive design */}
            <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "start", borderTop: `1px solid ${p.LINEW}`, paddingTop: "5rem" }}>
              <div>
                <Reveal>
                  <span style={{ ...kick(p.MONO, p.ACCT), marginBottom: "1.8rem" }}>Designed for who actually needs it</span>
                  <SectionTitle p={p} max="16ch">Hindi-first. Android-first. Works at a railway kiosk.</SectionTitle>
                </Reveal>
                <Reveal stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem", marginTop: "2.5rem" }}>
                  {PRINCIPLES.map(({ label, text }) => (
                    <div key={label} style={{ padding: "1.5rem", background: p.GND, border: `1px solid ${p.LINE}`, borderRadius: "14px" }}>
                      <span style={{ fontFamily: p.MONO, fontSize: ".5rem", letterSpacing: ".16em", textTransform: "uppercase", color: p.ACCT, display: "block", marginBottom: ".7rem" }}>{label}</span>
                      <p style={{ fontSize: ".8rem", color: p.DIM, lineHeight: 1.6 }}>{text}</p>
                    </div>
                  ))}
                </Reveal>
              </div>
              <Reveal stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                {SCREENS.map((src, i) => (
                  <div key={i} style={{ borderRadius: "12px", overflow: "hidden", background: p.GND, border: `1px solid ${p.LINE}` }}>
                    <Image src={src} alt={`Rozi app screen ${i + 1}`} width={300} height={600} style={{ width: "100%", height: "auto", display: "block" }} />
                  </div>
                ))}
              </Reveal>
            </div>
          </div>
        </section>

        {/* ═══ 11 · OUTCOME + CLOSE ═══ */}
        <section style={{ borderTop: `1px solid ${p.LINEW}`, background: p.GND }}>
          <div style={{ padding: "8rem var(--pad)", borderBottom: `1px solid ${p.LINEW}` }}>
            <Reveal className="mobile-stack" stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center", maxWidth: "1100px", margin: "0 auto" }}>
              <div>
                <span style={{ ...kick(p.MONO, p.GOLDT), marginBottom: "2rem" }}>Outcome</span>
                <p style={{ fontFamily: p.SERIF, fontWeight: 300, fontSize: "clamp(4rem, 10vw, 8rem)", lineHeight: 0.95, letterSpacing: "-.04em", color: p.GOLDB }}>Top 5</p>
                <p style={{ fontFamily: p.SERIF, fontWeight: 400, fontSize: "clamp(1.2rem, 2.5vw, 2rem)", lineHeight: 1.2, letterSpacing: "-.02em", color: p.PAP, marginTop: "1rem" }}>
                  SARVA Designathon 2021<br />
                  <span style={{ color: p.DIM, fontWeight: 300 }}>National finalist, out of teams across India</span>
                </p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1.2rem" }}>
                <p style={{ fontSize: "1rem", color: p.DIM, lineHeight: 1.7 }}>
                  Twenty-four hours. One team. A live brief on informal labour, wage
                  exploitation and digital exclusion. The research grounding, the two-sided
                  model and the inclusive constraints were all derived in the field — not in
                  a conference room.
                </p>
                <p style={{ fontSize: "1rem", color: p.DIM, lineHeight: 1.7 }}>
                  What reached the judging panel: a service where the platform&apos;s
                  incentives align with the worker&apos;s, not the intermediary&apos;s. No
                  skimming, no gatekeeping — just a verified record of an agreed transaction.
                </p>
              </div>
            </Reveal>
          </div>

          <div style={{ padding: "6rem var(--pad)", background: p.GND2 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem", maxWidth: "1100px", margin: "0 auto" }}>
              <Reveal style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
                {["UX Research", "Service Design", "Inclusive Design", "Two-sided Platform", "Information Architecture"].map((tag) => (
                  <span key={tag} style={{ fontFamily: p.MONO, fontSize: ".52rem", letterSpacing: ".16em", textTransform: "uppercase", color: p.DIM, border: `1px solid ${p.LINE}`, padding: ".4rem .8rem", borderRadius: "100px" }}>{tag}</span>
                ))}
              </Reveal>
            </div>
          </div>
        </section>

        {/* ═══ 12 · EPILOGUE — match-cut into Realm of Elementals ═══ */}
        {/* NextProject paints no background of its own (by design elsewhere
            in the codebase); it used to inherit main's flat p.GND. Now that
            main is transparent (see the seams above), wrap it explicitly so
            its look is unchanged from before this pass. */}
        <div style={{ background: p.GND }}>
          <NextProject current="rozi" />
        </div>

      </main>
      <Footer />
    </>
  );
}
