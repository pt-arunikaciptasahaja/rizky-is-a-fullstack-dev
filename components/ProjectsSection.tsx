import { MotionReveal } from "@/components/MotionReveal";
import { ProjectCard } from "@/components/ProjectCard";
import { SectionHeading } from "@/components/SectionHeading";
import { projects, sectionCopy } from "@/data/portfolioData";

export function ProjectsSection() {
  return (
    <section className="content-section projects-section" id="projects" aria-labelledby="projects-title">
      <MotionReveal>
        <SectionHeading
          id="projects-title"
          title={sectionCopy.projects.title}
          description={sectionCopy.projects.description}
        />
      </MotionReveal>

      <div className="projects-list">
        {projects.map((project, index) => (
          <MotionReveal key={project.title}>
            <ProjectCard project={project} reversed={index % 2 === 1} />
          </MotionReveal>
        ))}
      </div>
    </section>
  );
}
