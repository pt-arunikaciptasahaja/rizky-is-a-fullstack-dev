import { AboutSection } from "@/components/AboutSection";
import { ExperienceSection } from "@/components/ExperienceSection";
import { Footer } from "@/components/Footer";
import { GlobalPointerSpotlight } from "@/components/GlobalPointerSpotlight";
import { HeroSection } from "@/components/HeroSection";
import { ImpactMetrics } from "@/components/ImpactMetrics";
import { Navbar } from "@/components/Navbar";
import { ProjectsSection } from "@/components/ProjectsSection";
import { SkillsCertifications } from "@/components/SkillsCertifications";

export default function Home() {
  return (
    <>
      <GlobalPointerSpotlight />
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <ImpactMetrics />
        <AboutSection />
        <ProjectsSection />
        <ExperienceSection />
        <SkillsCertifications />
      </main>
      <Footer />
    </>
  );
}
