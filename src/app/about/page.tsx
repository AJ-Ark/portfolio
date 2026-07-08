import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import AboutContent from "./AboutContent";

export default function AboutPage() {
  return (
    <>
      <Navigation />
      <main id="main-content">
        <AboutContent />
      </main>
      <Footer />
    </>
  );
}
