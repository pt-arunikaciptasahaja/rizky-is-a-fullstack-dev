"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, Github, Linkedin, Mail } from "lucide-react";
import { hero, socialLinks } from "@/data/portfolioData";
import { AnimatedWelcome } from "@/components/AnimatedWelcome";
import { LiveContextCard } from "@/components/LiveContextCard";
import { ResumePreviewTrigger } from "@/components/ResumePreviewModal";

const socialIcons = {
  LinkedIn: Linkedin,
  GitHub: Github,
  Email: Mail,
};

export function HeroSection() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="hero-section" id="top" aria-labelledby="hero-title">
      <motion.div
        className="hero-copy"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0.15 : 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="status-badge">
          <span className="status-dot" aria-hidden="true" />
          <span>{hero.status}</span>
        </div>

        <AnimatedWelcome />

        <h1 id="hero-title">{hero.name}</h1>
        <h2>{hero.title}</h2>
        <p className="hero-pitch">{hero.pitch}</p>

        <div className="hero-actions" aria-label="Primary actions">
          <a className="button button-primary" href="#projects">
            View Featured Projects <ArrowDownRight aria-hidden="true" size={18} />
          </a>
          <ResumePreviewTrigger className="button button-secondary">
            View Résumé
          </ResumePreviewTrigger>
        </div>

        <div className="social-links" aria-label="Social links">
          {socialLinks.map((link) => {
            const Icon = socialIcons[link.label];
            const external = link.href.startsWith("http");
            return (
              <a
                key={link.label}
                href={link.href}
                aria-label={link.label}
                target={external ? "_blank" : undefined}
                rel={external ? "noreferrer" : undefined}
              >
                <Icon aria-hidden="true" size={19} />
                <span>{link.label}</span>
              </a>
            );
          })}
        </div>
      </motion.div>

      <LiveContextCard />
    </section>
  );
}
