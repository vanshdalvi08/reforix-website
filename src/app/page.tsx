import Navbar from "@/components/navbar/Navbar";
import Hero from "@/components/hero/Hero";
import StatsBar from "@/components/stats/StatsBar";
import IdentitySection from "@/components/identity/IdentitySection";
import Experience from "@/components/experience/Experience";
import Projects from "@/components/projects/Projects";
import Contact from "@/components/contact/Contact";
import Footer from "@/components/footer/Footer";

export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <StatsBar />
      <IdentitySection />
      <Experience />
      <Projects />
      <Contact />
      <Footer />
    </main>
  );
}
