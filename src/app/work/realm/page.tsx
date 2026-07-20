import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import NextProject from "@/components/ui/NextProject";
import RealmSectionRail from "@/components/realm/RealmSectionRail";
import RealmDoc from "@/components/realm/RealmDoc";
import "./realm.css";

/* ══════════════════════════════════════════════════════════════════
   REALM OF ELEMENTALS — /work/realm

   Ported from the standalone public/realm/index.html (see RealmDoc's
   own header comment for the full account of what changed and why).
   This file just supplies what every other case study already has:
   the site's real <Navigation/>/<Footer/>, a left-rail wayfinding nav
   in place of the old page's own top nav, and the shared epilogue
   instead of a bespoke one.

   RealmSectionRail watches #realm-story (added around <RealmDoc/>'s
   sections below) rather than the whole document, so it only appears
   once the reader is actually inside the tour — exactly like trmeric's
   PhaseRail, which watches its own "deep-dives" region rather than
   staying on screen for the entire page.
   ══════════════════════════════════════════════════════════════════ */

const RAIL_SECTIONS = [
  { id: "problem", label: "Problem" },
  { id: "pivot", label: "Pivot" },
  { id: "app", label: "The app" },
  { id: "installation", label: "Installation" },
  { id: "research", label: "Research" },
];

export default function RealmPage() {
  return (
    <>
      <Navigation />
      <RealmSectionRail sections={RAIL_SECTIONS} watchId="realm-story" />

      <main id="main-content">
        <RealmDoc />
        <NextProject current="realm" />
      </main>

      <Footer />
    </>
  );
}
