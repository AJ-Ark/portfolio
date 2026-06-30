import Image from "next/image";

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
        <div style={{ position: "relative", width: 32, height: 32, flexShrink: 0 }}>
          {/* Light logo (dark backgrounds — home, realm, rippl) */}
          <Image
            src="/images/aj_LOGO_light.png"
            alt=""
            width={32}
            height={32}
            aria-hidden="true"
            style={{
              width: 32,
              height: 32,
              objectFit: "contain",
              position: "absolute",
              inset: 0,
              opacity: "var(--logo-light-opacity, 1)",
              transition: "opacity 0.6s ease",
            }}
          />
          {/* Dark logo (light backgrounds — trmeric) */}
          <Image
            src="/images/aj_LOGO_dark.png"
            alt="Aravind J"
            width={32}
            height={32}
            style={{
              width: 32,
              height: 32,
              objectFit: "contain",
              position: "absolute",
              inset: 0,
              opacity: "var(--logo-dark-opacity, 0)",
              transition: "opacity 0.6s ease",
            }}
          />
        </div>

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
