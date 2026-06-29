import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import SectionIndicator from "@/components/ui/SectionIndicator";
import DimensionCallout from "@/components/ui/DimensionCallout";
import DecisionBlock from "@/components/ui/DecisionBlock";
import PlotInLines from "@/components/ui/PlotInLines";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rippl",
  description:
    "A projector-table-lamp that fights distracted reading and turns notetaking into two-way interaction. 12-week research-to-hardware-to-interface project.",
};

const ACCENT = "#78B9C5";

export default function RipplPage() {
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
                PLANE 02 · RIPPL · ACADEMIC / INDUSTRIAL DESIGN
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
                Rippl
              </h1>
            </PlotInLines>
            <PlotInLines delay={160}>
              <p style={{ fontSize: "clamp(1rem, 2vw, 1.25rem)", color: "var(--color-graphite-light)", maxWidth: "38rem", lineHeight: 1.55 }}>
                Notes that ripple back to you. A projector-lamp that fights
                distracted reading and turns notetaking into a two-way interaction.
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
              { label: "Type", value: "Academic — Industrial + Interaction Design" },
              { label: "Duration", value: "12 weeks" },
              { label: "Role", value: "Design Researcher & Interaction Designer" },
              { label: "Year", value: "2024" },
            ].map((item) => (
              <div key={item.label}>
                <span className="label-mono block mb-1" style={{ color: "#4A453E" }}>{item.label}</span>
                <span style={{ fontSize: "0.875rem", color: "var(--color-paper)" }}>{item.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Content */}
        <section style={{ padding: "5rem var(--spacing-page)", maxWidth: "72rem", margin: "0 auto" }}>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div>
              <span className="label-mono block mb-4" style={{ color: "#4A453E" }}>The problem</span>
              <p className="mb-4" style={{ color: "var(--color-graphite-light)", lineHeight: 1.75, fontSize: "0.9375rem" }}>
                Reading is under siege. The phone is beside the book. The notification
                wins. Even when focus holds, physical reading is a passive act — the
                notes you take are stranded in a notebook that never talks back.
              </p>
              <p style={{ color: "var(--color-graphite-light)", lineHeight: 1.75, fontSize: "0.9375rem" }}>
                Research with NID peers surfaced three pain points consistently:
                impaired focus, limited retention, and a complete absence of interactive
                feedback from the act of reading. The physical book is a one-way medium.
              </p>
            </div>
            <div>
              <span className="label-mono block mb-4" style={{ color: "#4A453E" }}>The approach</span>
              <p className="mb-4" style={{ color: "var(--color-graphite-light)", lineHeight: 1.75, fontSize: "0.9375rem" }}>
                The triad: a table lamp (familiar, unobtrusive) that houses a downward-facing
                camera (OCR) and a pico projector (output). The device sits beside your book.
                When you highlight or annotate, the camera reads your handwriting. The
                projector responds — beside the page you are reading, not on a screen.
              </p>
              <p style={{ color: "var(--color-graphite-light)", lineHeight: 1.75, fontSize: "0.9375rem" }}>
                Notes that ripple back to you.
              </p>
            </div>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 py-10 mb-16"
            style={{ borderTop: "1px solid #2E2A25", borderBottom: "1px solid #2E2A25" }}>
            {[
              { value: "12 wks", label: "Project duration" },
              { value: "3", label: "Working prototypes built" },
              { value: "1000+", label: "Public participants" },
            ].map((m) => (
              <DimensionCallout key={m.label} value={m.value} label={m.label} accent={ACCENT} />
            ))}
          </div>

          {/* The build */}
          <div className="mb-16 max-w-[42rem]">
            <span className="label-mono block mb-4" style={{ color: "#4A453E" }}>What I built</span>
            <p className="mb-4" style={{ color: "var(--color-graphite-light)", lineHeight: 1.75, fontSize: "0.9375rem" }}>
              Three working prototypes: an OCR text-recognition system (Python + OpenCV)
              that reads printed or handwritten text from the camera feed; a handwriting
              recognition model trained on NID peer samples; and a projector-camera swivel
              rig that calibrates the projection to land beside the page, not on it.
            </p>
            <p style={{ color: "var(--color-graphite-light)", lineHeight: 1.75, fontSize: "0.9375rem" }}>
              Alongside the hardware: a hi-fi UI for marking and saving passages, sorting
              and categorising captured notes, and navigating the annotation history —
              the software layer that makes the hardware useful.
            </p>

            <div className="flex flex-wrap gap-2 mt-6">
              {["Python", "OpenCV", "OCR", "Handwriting ML", "Projector-camera rig", "Hi-fi UI", "Physical prototyping"].map((tech) => (
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

          {/* Placeholder images */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
            {["Rippl industrial form — table lamp + projector", "Hi-fi UI — marking & annotation history"].map((label) => (
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
            decision="The projector outputs beside the page — never on it. The book remains the primary surface."
            reasoning="Projecting onto the page felt immediately wrong in early tests. It interrupted the reading surface the user trusted. Projecting to the right of the open book keeps the reading surface sacred and makes the projection feel like a response, not an interruption."
            before="Projection onto the page surface — immediate conflict with the reading experience."
            after="Projection to the right of the book. Reading surface untouched. System feels like a companion."
            accent={ACCENT}
          />

          <div className="mt-16 max-w-[38rem]">
            <span className="label-mono block mb-4" style={{ color: ACCENT, opacity: 0.7 }}>On range</span>
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
              "I trained an OCR model and built the projector-camera rig. Then I
              designed the UI that makes the hardware worth using. Research → hardware
              → interface: the full stack, in 12 weeks."
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
