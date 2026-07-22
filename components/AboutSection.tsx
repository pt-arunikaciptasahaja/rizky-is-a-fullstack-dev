import { ArrowUpRight, BriefcaseBusiness, Cpu } from "lucide-react";
import { aboutCards, sectionCopy } from "@/data/portfolioData";
import { MotionReveal } from "@/components/MotionReveal";
import { SectionHeading } from "@/components/SectionHeading";

const aboutIcons = [Cpu, BriefcaseBusiness];

export function AboutSection() {
  return (
    <section className="content-section" id="about" aria-labelledby="about-title">
      <MotionReveal>
        <SectionHeading
          id="about-title"
          title={sectionCopy.about.title}
          description={sectionCopy.about.description}
        />
      </MotionReveal>

      <div className="about-grid">
        {aboutCards.map((card, index) => {
          const Icon = aboutIcons[index];
          return (
            <MotionReveal key={card.title} delay={index * 0.06}>
              <article className="about-card">
                <div className="about-card-icon" aria-hidden="true">
                  <Icon size={23} />
                </div>
                <h3>{card.title}</h3>
                <p>{card.description}</p>
                <ul>
                  {card.highlights.map((highlight) => (
                    <li key={highlight}>
                      <ArrowUpRight aria-hidden="true" size={15} />
                      {highlight}
                    </li>
                  ))}
                </ul>
              </article>
            </MotionReveal>
          );
        })}
      </div>
    </section>
  );
}
