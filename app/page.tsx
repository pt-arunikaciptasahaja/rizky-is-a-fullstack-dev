import { AboutSection } from "@/components/AboutSection";
import { AutomotiveModernization } from "@/components/AutomotiveModernization";
import { ExperienceSection } from "@/components/ExperienceSection";
import { Footer } from "@/components/Footer";
import { GlobalPointerSpotlight } from "@/components/GlobalPointerSpotlight";
import { HeroSection } from "@/components/HeroSection";
import { ImpactMetrics } from "@/components/ImpactMetrics";
import { Navbar } from "@/components/Navbar";
import { ProjectsSection } from "@/components/ProjectsSection";
import { ResumePreviewModal } from "@/components/ResumePreviewModal";
import { SkillsCertifications } from "@/components/SkillsCertifications";

export default function Home() {
  return (
    <>
      <GlobalPointerSpotlight />
      <ResumePreviewModal />
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <ImpactMetrics />
        <AboutSection />
        <AutomotiveModernization />
        <ProjectsSection />
        <ExperienceSection />
        <SkillsCertifications />
      </main>
      <Footer />
    </>
  );
}
