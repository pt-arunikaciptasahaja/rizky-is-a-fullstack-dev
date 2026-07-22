import { MapPin } from "lucide-react";
import { experiences, sectionCopy } from "@/data/portfolioData";
import { MotionReveal } from "@/components/MotionReveal";
import { SectionHeading } from "@/components/SectionHeading";

export function ExperienceSection() {
  return (
    <section className="content-section" id="experience" aria-labelledby="experience-title">
      <MotionReveal>
        <SectionHeading
          id="experience-title"
          title={sectionCopy.experience.title}
          description={sectionCopy.experience.description}
        />
      </MotionReveal>

      <div className="timeline">
        {experiences.map((experience, index) => (
          <MotionReveal key={`${experience.role}-${experience.company}`}>
            <article className="timeline-item">
              <div className="timeline-marker" aria-hidden="true">
                <span>{String(index + 1).padStart(2, "0")}</span>
              </div>
              <div className="timeline-meta">
                <p>{experience.period}</p>
                <p>
                  <MapPin aria-hidden="true" size={15} />
                  {experience.location}
                </p>
              </div>
              <div className="timeline-content">
                {experience.contextLabel ? (
                  <p className="experience-context">{experience.contextLabel}</p>
                ) : null}
                <h3>{experience.role}</h3>
                <p className="company">{experience.company}</p>
                <ul>
                  {experience.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            </article>
          </MotionReveal>
        ))}
      </div>
    </section>
  );
}
