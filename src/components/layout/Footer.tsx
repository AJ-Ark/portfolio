export default function Footer() {
  return (
    <footer
      style={{
        padding: "3rem var(--spacing-page) 2.5rem",
        borderTop: "1px solid var(--line)",
        background: "var(--color-ground-2, var(--color-ground))",
      }}
    >
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <span
          className="aj-logo"
          role="img"
          aria-label="Aravind J"
          style={{ display: "block", width: 32, height: 32, flexShrink: 0 }}
        />

        <div
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: ".5rem",
            letterSpacing: ".1em",
            textTransform: "uppercase",
            color: "var(--color-graphite-light)",
            opacity: .35,
            textAlign: "center",
          }}
          className="hidden md:block"
        >
          <div>PORTFOLIO · 2026</div>
          <div>REV 01 · NTS</div>
        </div>

        <div className="flex items-center gap-6">
          <a
            href="mailto:aravindspav@gmail.com"
            className="footer-link"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: ".65rem",
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: "var(--color-graphite-light)",
            }}
          >
            Email
          </a>
          <a
            href="https://www.linkedin.com/in/aravind-j-5a6b8b136/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: ".65rem",
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: "var(--color-graphite-light)",
            }}
          >
            LinkedIn
          </a>
          <a
            href="/Aravind-J-Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: ".65rem",
              letterSpacing: ".14em",
              textTransform: "uppercase",
              color: "var(--color-graphite-light)",
            }}
          >
            Résumé
          </a>
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: ".6rem",
              letterSpacing: ".1em",
              color: "var(--color-graphite-light)",
              opacity: .35,
            }}
          >
            © 2026
          </span>
        </div>
      </div>
    </footer>
  );
}
