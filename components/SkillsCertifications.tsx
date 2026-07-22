import { BadgeCheck, ExternalLink } from "lucide-react";
import Image from "next/image";
import { certifications, sectionCopy, skillCategories } from "@/data/portfolioData";
import { MotionReveal } from "@/components/MotionReveal";
import { SectionHeading } from "@/components/SectionHeading";

export function SkillsCertifications() {
  return (
    <section className="content-section skills-section" id="skills" aria-labelledby="skills-title">
      <MotionReveal>
        <SectionHeading
          id="skills-title"
          title={sectionCopy.skills.title}
          description={sectionCopy.skills.description}
        />
      </MotionReveal>

      <div className="certifications-grid">
        {certifications.map((certification) => (
          <article key={certification.title} className="certification-card">
            <BadgeCheck aria-hidden="true" size={24} />
            <div className="certification-copy">
              <p>{certification.issuer}</p>
              <h3>{certification.title}</h3>
              <span>{certification.detail}</span>
              {certification.credentialUrl ? (
                <a
                  className="credential-link"
                  href={certification.credentialUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View verified credential
                  <ExternalLink aria-hidden="true" size={14} />
                </a>
              ) : null}
            </div>
            {certification.badgeImage && certification.credentialUrl ? (
              <a
                className="certification-badge-mark"
                href={certification.credentialUrl}
                target="_blank"
                rel="noreferrer"
                aria-label={`View ${certification.title} credential on Credly`}
              >
                <Image
                  src={certification.badgeImage}
                  alt={`${certification.title} certification badge`}
                  fill
                  sizes="104px"
                />
              </a>
            ) : null}
          </article>
        ))}
      </div>

      <div className="skills-table">
        {skillCategories.map((category) => (
          <article key={category.title} className="skill-row">
            <h3>{category.title}</h3>
            <ul>
              {category.skills.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
