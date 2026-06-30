import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import ServiceSection from "@/components/sections/ServiceSection";
import InnovationSection from "@/components/sections/InnovationSection";
import InternationalSection from "@/components/sections/InternationalSection";
import AboutSection from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";
import { Toaster } from "@/components/ui/sonner";
import './App.css';

function App() {
  return (
    <div className="min-h-screen bg-cream text-charcoal font-sans scroll-smooth">
      <Navbar />
      {/* 섹션 간의 여유를 위해 space-y-12 (간격)와 pb-24 (하단 여백) 추가 */}
      <main className="space-y-12 pb-24">
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
