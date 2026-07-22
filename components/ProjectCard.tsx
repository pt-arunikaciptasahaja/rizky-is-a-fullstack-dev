import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/data/portfolioData";

interface ProjectCardProps {
  project: Project;
  reversed?: boolean;
}

export function ProjectCard({ project, reversed = false }: ProjectCardProps) {
  return (
    <article className={`project-card${reversed ? " project-card-reversed" : ""}`}>
      <div className="project-summary">
        <div className="project-index" aria-hidden="true">
          {project.number}
        </div>
        <div className="project-badges">
          <span>{project.category}</span>
          <span>{project.subtitle}</span>
        </div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>

        <div className="project-links">
          {project.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer" : undefined}
            >
              {link.label} <ArrowUpRight aria-hidden="true" size={16} />
            </a>
          ))}
        </div>
      </div>

      <div className="project-proof">
        <dl>
          <div>
            <dt>Problem</dt>
            <dd>{project.problem}</dd>
          </div>
          <div>
            <dt>Solution</dt>
            <dd>{project.solution}</dd>
          </div>
          <div>
            <dt>Impact</dt>
            <dd>{project.impact}</dd>
          </div>
        </dl>

        <div className="tech-stack" aria-label={`${project.title} technologies`}>
          {project.techStack.map((technology) => (
            <span key={technology}>{technology}</span>
          ))}
        </div>
      </div>
    </article>
  );
}
