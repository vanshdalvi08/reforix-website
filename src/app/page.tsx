import "./landing.css";
import Preloader from "@/components/landing/Preloader";
import CursorFx from "@/components/landing/CursorFx";
import LandingNav from "@/components/landing/LandingNav";
import PlantHero from "@/components/landing/PlantHero";
import StatsStrip from "@/components/landing/StatsStrip";
import AboutSection from "@/components/landing/AboutSection";
import ServicesSection from "@/components/landing/ServicesSection";
import ProcessSection from "@/components/landing/ProcessSection";
import ProjectsGallery from "@/components/landing/ProjectsGallery";
import CareersSection from "@/components/landing/CareersSection";
import ContactSection from "@/components/landing/ContactSection";
import LandingFooter from "@/components/landing/LandingFooter";

export default function Home() {
  return (
    <main className="rx">
      <Preloader />
      <CursorFx />
      <LandingNav />
      <PlantHero />
      <StatsStrip />
      <AboutSection />
      <ServicesSection />
      <ProcessSection />
      <ProjectsGallery />
      <CareersSection />
      <ContactSection />
      <LandingFooter />
    </main>
  );
}
