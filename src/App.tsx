import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import WorkSection from "@/components/sections/WorkSection";
import FounderSection from "@/components/sections/FounderSection";
import FaqSection from "@/components/sections/FaqSection";
import ContactSection from "@/components/sections/ContactSection";

function App() {
  return (
    <div className="theone">
      <Navbar />
      <main id="top" className="wrap">
        <HeroSection />
        <WorkSection />
        <FounderSection />
        <FaqSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}

export default App;
