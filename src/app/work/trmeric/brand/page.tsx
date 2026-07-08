"use client";

import Link from "next/link";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import PlotInLines from "@/components/ui/PlotInLines";
import Reveal from "@/components/ui/Reveal";
import Shot from "@/components/trmeric/Shot";
import { useColorScheme } from "@/hooks/useColorScheme";

/* ── Accent is the same in dark + light ── */
const ACC = "#FFA426";

export default function TrmericBrandPage() {
  const dark = useColorScheme();
  const BASE  = dark ? "#0E0C0A" : "#FAF7F1";
  const BASE2 = dark ? "#1A1613" : "#F1EADC";
  const INK   = dark ? "#F2E8D0" : "#17150F";
  const DIM   = dark ? "rgba(242,232,208,.62)" : "rgba(23,21,15,.62)";
  const FAINT = dark ? "rgba(242,232,208,.36)" : "rgba(23,21,15,.36)";
  const ACCD  = dark ? "#FF9A35" : "#E8730E";
  const LINE  = dark ? "rgba(255,164,38,.14)" : "rgba(23,21,15,.12)";
  const SHADOW = dark ? "0 4px 32px -8px rgba(0,0,0,.65)" : "0 4px 24px -8px rgba(23,21,15,.14)";

  const s = {
    kicker: {
      fontFamily: "var(--font-mono)",
      fontSize: ".65rem",
      letterSpacing: ".22em",
      textTransform: "uppercase" as const,
      color: ACCD,
      display: "block",
      marginBottom: "1.1rem",
    },
    body: {
      fontSize: ".9375rem",
      color: DIM,
      lineHeight: 1.78,
      maxWidth: "56ch",
    },
    stageKicker: {
      fontFamily: "var(--font-mono)",
      fontSize: ".58rem",
      letterSpacing: ".2em",
      textTransform: "uppercase" as const,
      color: ACC,
      marginBottom: "1.2rem",
      opacity: 0.8,
    },
    h3: {
      fontFamily: "var(--font-body)",
      fontWeight: 700,
      fontSize: "clamp(1.4rem, 2.5vw, 2rem)",
      letterSpacing: "-.02em",
      color: INK,
      lineHeight: 1.2,
      marginBottom: "1.2rem",
    },
  };

  return (
    <div style={{ background: BASE, color: INK, minHeight: "100vh" }}>
      <Navigation />

      <main id="main-content">

        {/* ── Opening statement ── */}
        <section style={{ padding: "9rem var(--pad) 5rem", maxWidth: "1100px", margin: "0 auto" }}>
          <PlotInLines>
            <Link
              href="/work/trmeric"
              style={{ fontFamily: "var(--font-mono)", fontSize: ".58rem", letterSpacing: ".16em", textTransform: "uppercase", color: FAINT, textDecoration: "none", display: "inline-block", marginBottom: "2.5rem" }}
            >
              ← Trmeric case study
            </Link>
            <span style={s.kicker}>Brand identity · Logo, Loaded.</span>
            <h1 style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "clamp(2rem, 4.5vw, 3.8rem)", letterSpacing: "-.025em", color: INK, lineHeight: 1.08, maxWidth: "20ch", marginBottom: "2rem" }}>
              The mark is not designed.{" "}
              <em style={{ fontStyle: "italic", color: ACC }}>It is grown.</em>
            </h1>
            <p style={{ ...s.body, fontSize: "1.0625rem", maxWidth: "52ch", lineHeight: 1.75 }}>
              Every logo tells you about the thing it names. Ours starts with a question: what does a turmeric rhizome look like on the inside? Not metaphorically. Literally. The mark is built from real cross-section data. What follows is how it got there.
            </p>
          </PlotInLines>
        </section>

        {/* ── 01: The completed mark ── */}
        <div style={{ background: BASE2, borderTop: `1px solid ${LINE}`, borderBottom: `1px solid ${LINE}` }}>
          <Reveal style={{ maxWidth: "1100px", margin: "0 auto", padding: "5rem var(--pad)" }}>
            <Shot
              src="/images/trmeric/logo-story/01.png"
              alt="Trmeric brand vision v1.0, the concentric ring mark paired with the trmeric wordmark, first presentation"
              ratio="16/9"
              border={`1px solid ${LINE}`}
              shadow={SHADOW}
              accent={ACC}
              caption="Version 1.0 · Brand vision · First complete presentation of mark + wordmark"
              priority
            />
          </Reveal>
        </div>

        {/* ── 02: The positioning ── */}
        <div style={{ borderBottom: `1px solid ${LINE}`, background: BASE2 }}>
          <div className="mobile-stack" style={{ maxWidth: "1100px", margin: "0 auto", padding: "5rem var(--pad)", display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: "5rem", alignItems: "center" }}>
            <Reveal>
              <div style={s.stageKicker}>Where it begins</div>
              <h3 style={s.h3}>trmeric, for those who want to ascend.</h3>
              <p style={{ ...s.body, marginBottom: "1rem" }}>
                Before the mark could take form, the brand needed a position. Four values anchored it: Simply essential. Superpower approach. Do it with style. Uplifting experience. These four quadrants became the brief for everything that followed, including the geometry of the logo itself.
              </p>
              <p style={s.body}>
                The five rings in the final mark are not decorative. Each one carries one of these values, plus a fifth: Unleash potential, the culmination of the other four.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <Shot
                src="/images/trmeric/logo-story/02.png"
                alt="Trmeric brand positioning diagram, four quadrants: Simply essential, Superpower approach, Do it with style, Uplifting experience, with trmeric at centre"
                ratio="16/9"
                radius={12}
                border={`1px solid ${LINE}`}
                shadow={SHADOW}
                accent={ACC}
                sizes="(max-width: 900px) 100vw, 640px"
              />
            </Reveal>
          </div>
        </div>

        {/* ── 03: The plant ── */}
        <div style={{ borderBottom: `1px solid ${LINE}` }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "5rem var(--pad)" }}>
            <div className="mobile-stack" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "5rem", alignItems: "center" }}>
              <Reveal>
                <Shot
                  src="/images/trmeric/logo-story/04.png"
                  alt="Actual turmeric rhizomes photographed, compounding effect and organic shape as core brand concepts"
                  ratio="16/9"
                  radius={12}
                  border={`1px solid ${LINE}`}
                  shadow={SHADOW}
                  accent={ACC}
                  sizes="(max-width: 900px) 100vw, 640px"
                />
              </Reveal>
              <Reveal delay={0.1}>
                <div style={s.stageKicker}>The source material</div>
                <h3 style={s.h3}>It started with an actual turmeric plant.</h3>
                <p style={{ ...s.body, marginBottom: "1rem" }}>
                  Two core concepts emerged from studying the plant directly. The first: the <strong style={{ color: INK, fontWeight: 600 }}>compounding effect</strong>, turmeric grows rhizome by rhizome, each new bulb branching from the last, representing growth and the spreading of influence. The second: <strong style={{ color: INK, fontWeight: 600 }}>organic shape</strong>, no two bulbs are the same. The form is natural, unpredictable, and alive.
                </p>
                <p style={s.body}>
                  These are not metaphors bolted onto a geometric logo after the fact. They are the literal source of the mark.
                </p>
              </Reveal>
            </div>
          </div>
        </div>

        {/* ── 04: The derivation process ── */}
        <div style={{ borderBottom: `1px solid ${LINE}`, background: BASE2 }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "5rem var(--pad)" }}>
            <Reveal>
              <div style={s.stageKicker}>The derivation</div>
              <h3 style={{ ...s.h3, marginBottom: ".8rem", maxWidth: "28ch" }}>18 cross-sections. 3 groups. 1 mark.</h3>
              <p style={{ ...s.body, marginBottom: "2.5rem", maxWidth: "60ch" }}>
                Three primary rhizomes were selected. Each was sliced into six cross-sections and photographed at scale. Each group of six was traced and averaged into a single ring form (a, b, c, d, e, f), then paired and superimposed (a+b = X, c+d = Y, e+f = Z) to find the best organic shape. The final outline emerged from X+Y+Z: not a circle, but something that came from real plant geometry.
              </p>
            </Reveal>
            <Reveal>
              <Shot
                src="/images/trmeric/logo-story/03.png"
                alt="Logo derivation process, 18 turmeric cross-sections photographed, traced, grouped, averaged into ring forms X Y Z, then combined into the final mark"
                ratio="16/9"
                radius={12}
                border={`1px solid ${LINE}`}
                shadow={SHADOW}
                accent={ACC}
                caption="Primary rhizome · Cross sections 1–18 · Abstracted forms a–f · Combined to X, Y, Z · Final mark"
              />
            </Reveal>
          </div>
        </div>

        {/* ── 05: Golden ratio ── */}
        <div style={{ borderBottom: `1px solid ${LINE}` }}>
          <div className="mobile-stack" style={{ maxWidth: "1100px", margin: "0 auto", padding: "5rem var(--pad)", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", alignItems: "center" }}>
            <div>
              <Reveal>
                <div style={s.stageKicker}>The mathematics</div>
                <h3 style={s.h3}>Every ring is governed by the golden ratio.</h3>
                <p style={{ ...s.body, marginBottom: "1rem" }}>
                  The outermost stroke of the mark is 12px. Each successive inner ring is sized by multiplying ×0.809, the reciprocal of the golden ratio (1/φ, expressed as sin 54°). Five rings, five strokes, each one mathematically smaller than the last.
                </p>
                <p style={s.body}>
                  This is not aesthetic decoration. It means the mark has the same proportional logic as a nautilus shell, a sunflower spiral, or the branching pattern of the very rhizome it depicts. The plant and the ratio share the same geometry.
                </p>
              </Reveal>
              {/* Color swatches */}
              <Reveal stagger delay={0.2} style={{ display: "flex", gap: ".5rem", marginTop: "1.8rem", alignItems: "center" }}>
                {["#FFA426", "#FF981C", "#FF8C13", "#FF7F0A", "#FF7300"].map((c) => (
                  <div key={c} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: ".4rem" }}>
                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: c }} />
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: ".4rem", letterSpacing: ".08em", color: FAINT }}>{c.slice(1)}</span>
                  </div>
                ))}
              </Reveal>
            </div>
            <Reveal delay={0.1}>
              <Shot
                src="/images/trmeric/logo-story/05.png"
                alt="Golden ratio applied to the Trmeric mark, construction diagram showing how a = 1.618, b = 1, and the spiral derived from them governs each ring stroke"
                ratio="16/9"
                radius={12}
                border={`1px solid ${LINE}`}
                shadow={SHADOW}
                accent={ACC}
                sizes="(max-width: 900px) 100vw, 550px"
              />
            </Reveal>
          </div>
        </div>

        {/* ── 06: Five rings meaning ── */}
        <div style={{ borderBottom: `1px solid ${LINE}`, background: BASE2 }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "5rem var(--pad)" }}>
            <Reveal>
              <div style={s.stageKicker}>The meaning</div>
              <h3 style={{ ...s.h3, marginBottom: ".8rem", maxWidth: "24ch" }}>Five rings. Five brand promises.</h3>
              <p style={{ ...s.body, marginBottom: "2.5rem", maxWidth: "56ch" }}>
                The five rings within the mark are not concentric for aesthetic reasons. Each ring represents a pillar of what trmeric delivers, and they grow outward the same way trmeric's value compounds in an enterprise: starting small and essential, expanding to something that truly unleashes potential.
              </p>
            </Reveal>
            <Reveal>
              <Shot
                src="/images/trmeric/logo-story/06.png"
                alt="The Five Rings: A Roadmap to Success, five circles of increasing size, each labelled: Simple & Essential, Superpower approach, Do it with style, Uplifting experience, Unleash Potential"
                ratio="16/9"
                radius={12}
                border={`1px solid ${LINE}`}
                shadow={SHADOW}
                accent={ACC}
              />
            </Reveal>
          </div>
        </div>

        {/* ── 07: Color system ── */}
        <div style={{ borderBottom: `1px solid ${LINE}` }}>
          <div className="mobile-stack" style={{ maxWidth: "1100px", margin: "0 auto", padding: "5rem var(--pad)", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "5rem", alignItems: "center" }}>
            <Reveal>
              <Shot
                src="/images/trmeric/logo-story/07.png"
                alt="Trmeric mark with color system, five rings in five amber-to-orange hues (FFA426, FF981C, FF8C13, FF7F0A, FF7300), each stroke width governed by the golden ratio"
                ratio="16/9"
                radius={12}
                border={`1px solid ${LINE}`}
                shadow={SHADOW}
                accent={ACC}
                sizes="(max-width: 900px) 100vw, 640px"
              />
            </Reveal>
            <Reveal delay={0.1}>
              <div style={s.stageKicker}>Colour and proportion, one ratio</div>
              <h3 style={s.h3}>The turmeric gradient. Five steps, one journey.</h3>
              <p style={{ ...s.body, marginBottom: "1rem" }}>
                The five ring colors step from warm amber (#FFA426) to deep burnt orange (#FF7300), the exact gradient inside a freshly cut turmeric rhizome. Outer ring lightest, innermost most saturated, the deeper you go, the more concentrated the colour.
              </p>
              <p style={s.body}>
                The right-hand diagram is the calculation behind it: the stroke thickness steps inward by the same ratio as the colour. 12px outer, divided by 0.809 (half the golden ratio, a = 1.618) at each ring, down to 4.99px innermost. One number, expressed twice, once in hue and once in thickness, not eyeballed to "look about right."
              </p>
            </Reveal>
          </div>
        </div>

        {/* ── 08 + 09: Final lockup and colorways ── */}
        <div style={{ borderBottom: `1px solid ${LINE}`, background: BASE2 }}>
          <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "5rem var(--pad)" }}>
            <Reveal>
              <div style={s.stageKicker}>The final form</div>
              <h3 style={{ ...s.h3, marginBottom: ".8rem", maxWidth: "24ch" }}>Simple shapes. All contexts.</h3>
              <p style={{ ...s.body, marginBottom: "2.5rem", maxWidth: "56ch" }}>
                The logo is constructed from simple shapes so it maintains legibility at every size. Minimum height: 32px. The horizontal lockup is the default. On dark backgrounds the mark renders in amber. On amber backgrounds it reverses to white. The mark was designed to work in all three without modification, because a brand that only works on white backgrounds has not been properly finished.
              </p>
            </Reveal>
            <Reveal className="mobile-stack" stagger style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <Shot
                src="/images/trmeric/logo-story/08.png"
                alt="Logo horizontal lockup with clearspace rules, minimum size 32px height, construction based on simple geometric shapes"
                ratio="16/9"
                radius={12}
                border={`1px solid ${LINE}`}
                shadow={SHADOW}
                accent={ACC}
                caption="Horizontal lockup · Clearspace rules · Minimum 32px"
                sizes="(max-width: 900px) 100vw, 550px"
              />
              <Shot
                src="/images/trmeric/logo-story/09.png"
                alt="Logo colorways, primary on white, reversed on dark background, reversed on amber background"
                ratio="16/9"
                radius={12}
                border={`1px solid ${LINE}`}
                shadow={SHADOW}
                accent={ACC}
                caption="Three colorways · Primary / Reversed dark / Reversed amber"
                sizes="(max-width: 900px) 100vw, 550px"
              />
            </Reveal>
          </div>
        </div>

        {/* ── Back to the case study ── */}
        <section style={{ padding: "5rem var(--pad) 6rem", textAlign: "center" }}>
          <Reveal>
            <span style={{ ...s.kicker }}>Keep exploring</span>
            <p style={{ fontSize: ".9375rem", color: DIM, maxWidth: "38ch", margin: ".6rem auto 2rem", lineHeight: 1.65 }}>
              The mark is one artefact. The product it names has 23 surfaces.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/work/trmeric" style={{ fontFamily: "var(--font-mono)", fontSize: ".68rem", letterSpacing: ".18em", textTransform: "uppercase", color: BASE, background: ACC, borderRadius: "4px", padding: ".8rem 1.8rem", display: "inline-block", textDecoration: "none" }}>
                ← Back to the case study
              </Link>
            </div>
          </Reveal>
        </section>

      </main>
      <Footer />
    </div>
  );
}
