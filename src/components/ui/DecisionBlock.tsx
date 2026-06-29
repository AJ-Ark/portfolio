interface DecisionBlockProps {
  decision: string;
  reasoning: string;
  before?: string;
  after?: string;
  accent?: string;
}

export default function DecisionBlock({
  decision,
  reasoning,
  before,
  after,
  accent = "#FFA426",
}: DecisionBlockProps) {
  return (
    <div
      className="relative pl-6 py-5 my-8"
      style={{
        borderLeft: `2px solid ${accent}`,
        background: `color-mix(in srgb, ${accent} 4%, transparent)`,
      }}
    >
      {/* Decision label */}
      <span
        className="label-mono mb-2 block"
        style={{ color: accent }}
      >
        Design decision
      </span>

      {/* The call */}
      <p
        className="display-serif mb-3"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.125rem",
          fontWeight: 400,
          color: "var(--color-paper)",
          lineHeight: 1.4,
        }}
      >
        {decision}
      </p>

      {/* Reasoning */}
      <p
        style={{
          fontSize: "0.9375rem",
          color: "var(--color-graphite-light)",
          lineHeight: 1.65,
        }}
      >
        {reasoning}
      </p>

      {/* Before / After */}
      {(before || after) && (
        <div className="mt-4 grid grid-cols-2 gap-3">
          {before && (
            <div>
              <span className="label-mono block mb-1" style={{ color: "#6B6157" }}>Before</span>
              <p style={{ fontSize: "0.875rem", color: "var(--color-graphite-light)" }}>{before}</p>
            </div>
          )}
          {after && (
            <div>
              <span className="label-mono block mb-1" style={{ color: accent }}>After</span>
              <p style={{ fontSize: "0.875rem", color: "var(--color-paper)" }}>{after}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
