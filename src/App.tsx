import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import ServiceSection from "@/components/sections/ServiceSection";
import InnovationSection from "@/components/sections/InnovationSection";
import InternationalSection from "@/components/sections/InternationalSection";
import AboutSection from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";
import { Toaster } from "@/components/ui/sonner";
import './App.css'; // ★ 기존 디자인을 불러오는 마법의 한 줄

function App() {
  return (
    <div className="min-h-screen bg-cream text-charcoal font-sans scroll-smooth">
      <Navbar />
      <main>
        <HeroSection />
        <ServiceSection />
        <InnovationSection />
        <InternationalSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
      <Toaster />
    </div>
  );
}

export default App;
