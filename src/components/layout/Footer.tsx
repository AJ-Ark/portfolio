export default function Footer() {
  return (
    <footer
      className="datum-line"
      style={{
        padding: "3rem var(--spacing-page)",
        borderTop: "1px solid color-mix(in srgb, #3A352E 50%, transparent)",
      }}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left: name + location */}
        <div>
          <span
            className="display-serif block mb-1"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1rem",
              color: "var(--color-paper)",
            }}
          >
            Aravind Jegajeeva Rajasekar
          </span>
          <span className="label-mono" style={{ color: "var(--color-graphite-light)" }}>
            Tiruchirappalli, Tamil Nadu · India
          </span>
        </div>

        {/* Center: drawing info block */}
        <div
          className="label-mono text-center hidden md:block"
          style={{ color: "#3A352E", fontSize: "0.5rem" }}
        >
          <div>DRAWING REF: PORTFOLIO–2026</div>
          <div>REV: 01 · SCALE: NTS</div>
        </div>

        {/* Right: links */}
        <div className="flex items-center gap-6">
          <a
            href="mailto:aravind@trmeric.com"
            className="label-mono transition-colors duration-200 hover:text-[--color-paper]"
            style={{ color: "var(--color-graphite-light)" }}
          >
            Email
          </a>
          <a
            href="https://linkedin.com/in/aravindj"
            target="_blank"
            rel="noopener noreferrer"
            className="label-mono transition-colors duration-200 hover:text-[--color-paper]"
            style={{ color: "var(--color-graphite-light)" }}
          >
            LinkedIn
          </a>
          <span className="label-mono" style={{ color: "#3A352E" }}>
            © 2026
          </span>
        </div>
      </div>
    </footer>
  );
}
