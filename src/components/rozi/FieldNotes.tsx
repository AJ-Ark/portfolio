import type { RoziPalette } from "@/components/rozi/palette";

/* ═══════════════════════════════════════════════════════════════════
   FIELD NOTES — authentic verbatim research notes from the field visit
   with an actual migrant worker (Mashidur) and the group he travels with.
   Two mono "field-note" cards flanking a roster of everyone met.
   ═══════════════════════════════════════════════════════════════════ */

const ROSTER = [
  { name: "Mashidur Shaik", age: 26 },
  { name: "Nitin", age: 22 },
  { name: "Babu", age: 20 },
  { name: "Arvind", age: 20 },
  { name: "Raju", age: 25 },
  { name: "Muksit", age: 22 },
];

function NoteCard({
  p,
  tag,
  children,
}: {
  p: RoziPalette;
  tag: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: p.GND2,
        border: `1px solid ${p.LINEW}`,
        borderLeft: `2px solid ${p.GOLD}`,
        borderRadius: "16px",
        padding: "1.8rem 1.9rem",
        boxShadow: p.SHADOW,
      }}
    >
      <span
        style={{
          fontFamily: p.MONO,
          fontSize: ".5rem",
          letterSpacing: ".22em",
          textTransform: "uppercase",
          color: p.GOLDT,
          display: "block",
          marginBottom: "1.1rem",
        }}
      >
        {tag}
      </span>
      <p
        style={{
          fontFamily: p.MONO,
          fontSize: ".82rem",
          lineHeight: 1.85,
          color: p.DIM,
          margin: 0,
        }}
      >
        {children}
      </p>
    </div>
  );
}

export default function FieldNotes({ p }: { p: RoziPalette }) {
  return (
    <div
      className="mobile-stack"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 0.9fr 1fr",
        gap: "1.5rem",
        alignItems: "start",
      }}
    >
      <NoteCard p={p} tag="Note · first contact">
        I met him at the roadside, smoking his beedi before the walk to the
        construction site. He&apos;s worked in Kerala on and off for
        2&frac12; years — originally from Murshidabad, Kolkata. A wife and two
        children wait on his income. The words he kept returning to:{" "}
        <em style={{ color: p.PAP, fontStyle: "italic" }}>
          &ldquo;Adjust karna padta hai.&rdquo;
        </em>{" "}
        He scratched at his skin as we spoke — which led him to accommodation
        and sanitation. He also spoke about how the Covid days hit him.
      </NoteCard>

      {/* Roster */}
      <div
        style={{
          background: p.GND3,
          border: `1px solid ${p.LINE}`,
          borderRadius: "16px",
          padding: "1.8rem 1.6rem",
          alignSelf: "stretch",
        }}
      >
        <span
          style={{
            fontFamily: p.MONO,
            fontSize: ".5rem",
            letterSpacing: ".22em",
            textTransform: "uppercase",
            color: p.ACCT,
            display: "block",
            marginBottom: "1.2rem",
          }}
        >
          Workers met
        </span>
        <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: ".7rem" }}>
          {ROSTER.map((r) => (
            <li
              key={r.name}
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                gap: "1rem",
                paddingBottom: ".7rem",
                borderBottom: `1px solid ${p.LINEW}`,
                fontFamily: p.MONO,
              }}
            >
              <span style={{ fontSize: ".82rem", color: p.PAP }}>{r.name}</span>
              <span style={{ fontSize: ".72rem", color: p.GOLDT }}>{r.age}</span>
            </li>
          ))}
        </ul>
      </div>

      <NoteCard p={p} tag="Note · the group">
        Nitin helped Babu and Arvind reach Kerala; now the three travel
        together. In their downtime, Babu and Arvind play a lot of Free Fire.
        All three are under a contractor from their own village — which is
        what earns them a higher wage,{" "}
        <span style={{ color: p.GOLDT }}>&#8377;900/day</span>. Their contractor
        has been in Kerala five years. They use Google Pay, but only to buy
        things — always getting some &ldquo;computer help&rdquo; to send money
        home to their families.
      </NoteCard>
    </div>
  );
}
