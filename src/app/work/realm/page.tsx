import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import SectionIndicator from "@/components/ui/SectionIndicator";
import DimensionCallout from "@/components/ui/DimensionCallout";
import DecisionBlock from "@/components/ui/DecisionBlock";
import PlotInLines from "@/components/ui/PlotInLines";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Realm of Elementals",
  description:
    "A WebAR butterfly-raising experience — M.Des graduation project, NID Gandhinagar. Care, decentering, and ecological identity.",
};

const ACCENT = "#4A9E8E";

export default function RealmPage() {
  return (
    <>
      <Navigation />
      <SectionIndicator />

      <main id="main-content">
        {/* Hero */}
        <section
          className="relative min-h-[80vh] flex flex-col justify-end overflow-hidden"
          style={{ padding: "10rem var(--spacing-page) 4rem" }}
        >
          <div className="relative z-10 max-w-4xl">
            <PlotInLines>
              <span className="label-mono block mb-4" style={{ color: ACCENT, opacity: 0.7 }}>
                PLANE 02 · REALM OF ELEMENTALS · M.DES GRADUATION
              </span>
            </PlotInLines>
            <PlotInLines delay={80}>
              <h1
                className="display-serif mb-4"
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(2.5rem, 8vw, 6rem)",
                  fontWeight: 300,
                  letterSpacing: "-0.025em",
                  lineHeight: 0.95,
                  color: "var(--color-paper)",
                }}
              >
                Realm of Elementals
              </h1>
            </PlotInLines>
            <PlotInLines delay={160}>
              <p style={{ fontSize: "clamp(1rem, 2vw, 1.25rem)", color: "var(--color-graphite-light)", maxWidth: "38rem", lineHeight: 1.55 }}>
                A WebAR butterfly-raising experience that extends the reach of the
                Tata Motors Lakehouse to people who will never visit it in person.
              </p>
            </PlotInLines>
          </div>
        </section>

        {/* Metadata strip */}
        <section
          style={{
            padding: "2.5rem var(--spacing-page)",
            borderTop: `1px solid color-mix(in srgb, ${ACCENT} 15%, #3A352E)`,
            borderBottom: "1px solid #2E2A25",
          }}
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Programme", value: "M.Des New Media Design, NID Gandhinagar" },
              { label: "Guide", value: "Dr. Jignesh Khakhar" },
              { label: "Partner", value: "Tata Motors Lakehouse (Mr. S.J.R. Kutty)" },
              { label: "Year", value: "2024 – 2026" },
            ].map((item) => (
              <div key={item.label}>
                <span className="label-mono block mb-1" style={{ color: "#4A453E" }}>{item.label}</span>
                <span style={{ fontSize: "0.875rem", color: "var(--color-paper)" }}>{item.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Narrative */}
        <section style={{ padding: "5rem var(--spacing-page)", maxWidth: "72rem", margin: "0 auto" }}>

          <div className="mb-16 max-w-[42rem]">
            <span className="label-mono block mb-4" style={{ color: "#4A453E" }}>The brief</span>
            <p className="mb-4" style={{ color: "var(--color-graphite-light)", lineHeight: 1.75, fontSize: "0.9375rem" }}>
              The project started with a brief on the NID portal in 2023 — ecology, architecture,
              experience design, technology. The exact intersection of everything I had spent six years
              building. I was selected alongside Nivedita and Sarvesh.
            </p>
            <p style={{ color: "var(--color-graphite-light)", lineHeight: 1.75, fontSize: "0.9375rem" }}>
              Early concepts took a confrontation approach: an Extinction Mirror, a Museum of Loss.
              Show people what they are destroying and hope it changes behaviour. It is a defensible
              strategy with a poor track record.
            </p>
          </div>

          <div className="mb-16 max-w-[42rem]">
            <span className="label-mono block mb-4" style={{ color: "#4A453E" }}>The caterpillar</span>
            <p className="mb-4" style={{ color: "var(--color-graphite-light)", lineHeight: 1.75, fontSize: "0.9375rem" }}>
              In 2024–25 I stepped back from the project entirely. I observed as a consumer, as a
              nature-lover, not as a designer. Then, near my home in Tiruchirappalli, I found a{" "}
              <em>Daphnis nerii</em> — an Oleander Hawk Moth caterpillar —
              that my mother had initially mistaken for a snake. I identified it. I watched it. I raised
              it through its full lifecycle.
            </p>
            <p style={{ color: "var(--color-graphite-light)", lineHeight: 1.75, fontSize: "0.9375rem" }}>
              That experience — fear becoming curiosity becoming care — became the project's emotional
              spine. The research then found its frame: Milton Mayeroff's <em>On Caring</em>,
              Bernstein's decentering framework, the neuroscience of behavioural change. The
              confrontation approach was wrong. Care is the mechanism. Decentering is the method.
            </p>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 py-10 mb-16"
            style={{ borderTop: "1px solid #2E2A25", borderBottom: "1px solid #2E2A25" }}>
            {[
              { value: "WebAR", label: "Core technology" },
              { value: "Care", label: "Design thesis" },
              { value: "2026", label: "Graduated" },
            ].map((m) => (
              <DimensionCallout key={m.label} value={m.value} label={m.label} accent={ACCENT} />
            ))}
          </div>

          <div className="mb-12 max-w-[42rem]">
            <span className="label-mono block mb-4" style={{ color: "#4A453E" }}>The experience</span>
            <p className="mb-4" style={{ color: "var(--color-graphite-light)", lineHeight: 1.75, fontSize: "0.9375rem" }}>
              Realm of Elementals is a WebAR butterfly-raising app. You scan a physical marker —
              a card, a badge — and a butterfly appears in your space. It is alive. It needs care.
              Over seven days, you return. You water its host plant, observe its development, and
              eventually release it.
            </p>
            <p style={{ color: "var(--color-graphite-light)", lineHeight: 1.75, fontSize: "0.9375rem" }}>
              The design is built on one insight: people do not care for abstract concepts. They care
              for specific things they have names for. By raising a specific butterfly — this one,
              named by you — the ecological identity shifts. You are no longer someone who cares about
              butterflies in general. You are someone who raised a <em>Daphnis nerii</em>.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {["WebAR butterfly lifecycle screens", "Care mechanic — daily check-in flow"].map((label) => (
              <div
                key={label}
                className="rounded flex items-center justify-center"
                style={{ height: 240, background: "#0C0A08", border: `1px solid color-mix(in srgb, ${ACCENT} 15%, transparent)` }}
              >
                <span className="label-mono text-center" style={{ color: "#3A352E" }}>[Image: {label}]</span>
              </div>
            ))}
          </div>

          <DecisionBlock
            decision="The seven-day care arc: each return reveals something new — and something at risk if you do not return."
            reasoning="Care requires consequence. If the butterfly thrives whether or not you show up, there is no relationship — just an animation. Introducing a visible state change without punishing the user required careful calibration between stakes and gentleness."
            accent={ACCENT}
          />

          <div className="mt-16 max-w-[42rem]">
            <span className="label-mono block mb-4" style={{ color: "#4A453E" }}>The build</span>
            <p className="mb-4" style={{ color: "var(--color-graphite-light)", lineHeight: 1.75, fontSize: "0.9375rem" }}>
              Built March–May 2026 with Ashish (AR development) and collaborators from the GP cohort.
              Stack: WebAR via image-marker recognition, Three.js for the butterfly animation and
              environment, a seven-day state machine managing the care lifecycle.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              {["WebAR", "Three.js", "Image marker tracking", "State machine", "Progressive Web App"].map((tech) => (
                <span
                  key={tech}
                  className="label-mono px-2 py-1 rounded"
                  style={{ fontSize: "0.55rem", background: "#0C0A08", border: "1px solid #2E2A25", color: "#4A453E" }}
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-16 max-w-[38rem]">
            <span className="label-mono block mb-4" style={{ color: ACCENT, opacity: 0.7 }}>Reflection</span>
            <p
              className="display-serif"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.125rem, 2.5vw, 1.5rem)",
                fontWeight: 300,
                fontStyle: "italic",
                color: "var(--color-paper)",
                lineHeight: 1.4,
              }}
            >
              "This project started with a butterfly and became a study of care.
              I did not plan that."
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
