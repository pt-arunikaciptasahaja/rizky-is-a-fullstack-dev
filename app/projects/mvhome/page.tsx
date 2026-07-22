import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Mail } from "lucide-react";
import { GlobalPointerSpotlight } from "@/components/GlobalPointerSpotlight";
import { ThemeToggle } from "@/components/ThemeToggle";
import { siteMeta } from "@/data/portfolioData";
import "./case-study.css";

export const metadata: Metadata = {
  title: "MVHome (OFI.id) Case Study | Muhammad Rizky Syadrie",
  description:
    "A full-stack case study of MVHome, an enterprise broadband acquisition platform and role-based content management system.",
  openGraph: {
    title: "MVHome (OFI.id) — Full-Stack Engineering Case Study",
    description:
      "Coverage checking, customer acquisition journeys, secure services, and independent content operations in one enterprise platform.",
    type: "article",
    locale: "en_US",
  },
};

const systemLayers = [
  {
    number: "01",
    title: "Customer experience",
    description:
      "Coverage checks, product discovery, registration, lead capture, and online job applications.",
  },
  {
    number: "02",
    title: "Web application",
    description:
      "Responsive Next.js journeys and search-friendly content across public-facing pages.",
  },
  {
    number: "03",
    title: "Application services",
    description:
      "Node.js and Express APIs supporting secure workflows and JWT-protected operations.",
  },
  {
    number: "04",
    title: "Content and data",
    description:
      "Database-backed management for products, articles, leads, careers, FAQs, users, banners, and legal content.",
  },
] as const;

const responsibilities = [
  "Developed full-stack functionality across customer-facing journeys and content-management workflows.",
  "Built reusable API and data capabilities for dynamic products, articles, leads, careers, FAQs, users, banners, and legal content.",
  "Implemented secure, role-based administration using JWT-backed access controls.",
  "Delivered responsive interfaces for coverage checking, product discovery, registration, and independently managed content.",
] as const;

export default function MVHomeCaseStudyPage() {
  return (
    <>
      <GlobalPointerSpotlight />

      <a className="skip-link" href="#case-study-content">
        Skip to case study
      </a>

      <header className="case-study-nav" id="top">
        <Link className="wordmark" href="/">
          {siteMeta.initials}
        </Link>
        <div className="case-study-nav-actions">
          <ThemeToggle />
          <a href="https://ofi.id" target="_blank" rel="noreferrer">
            <span>Visit OFI.id</span>
            <ArrowUpRight aria-hidden="true" size={16} />
          </a>
        </div>
      </header>

      <main className="case-study-page" id="case-study-content">
        <article>
          <header className="case-study-hero">
            <Link className="case-study-back" href="/#projects">
              <ArrowLeft aria-hidden="true" size={16} /> All projects
            </Link>

            <p className="case-study-meta-line">
              Enterprise ISP platform · Client project
            </p>
            <h1>MVHome (OFI.id)</h1>
            <p className="case-study-lede">
              A full-stack broadband acquisition platform connecting address
              eligibility, product discovery, customer onboarding, and ongoing
              content operations.
            </p>

            <dl className="case-study-snapshot">
              <div>
                <dt>Contribution</dt>
                <dd>Full-stack engineering</dd>
              </div>
              <div>
                <dt>Platform</dt>
                <dd>Customer acquisition and CMS</dd>
              </div>
              <div>
                <dt>Core stack</dt>
                <dd>Next.js, Node.js, Express, PostgreSQL</dd>
              </div>
              <div>
                <dt>Delivery</dt>
                <dd>Docker, REST APIs, JWT</dd>
              </div>
            </dl>
          </header>

          <div className="case-study-prose">
            <p>
              <strong className="case-study-inline-heading">The context.</strong>{" "}
              Broadband acquisition is not a single form. A customer must first
              establish whether service is available at their address, understand
              the available products, complete registration, and receive clear
              information as campaigns and service content change.
            </p>

            <p>
              The internal publishing workflow carried equal importance. Product,
              campaign, support, career, and legal information needed to remain
              current without turning every content update into an engineering
              release.
            </p>

            <p>
              <strong className="case-study-inline-heading">The response.</strong>{" "}
              MVHome brought those customer and operational needs into one
              platform: responsive acquisition journeys on the public side and a
              role-based CMS for independent content operations behind it.
            </p>
          </div>

          <section className="case-study-system" aria-labelledby="system-title">
            <div className="case-study-section-intro">
              <h2 id="system-title">System shape</h2>
              <p>
                Four connected layers kept the experience understandable while
                separating interface, service, security, and content concerns.
              </p>
            </div>

            <ol
              className="case-study-system-map"
              aria-label="MVHome system architecture from customer experience to content and data"
            >
              {systemLayers.map((layer) => (
                <li key={layer.number}>
                  <span>{layer.number}</span>
                  <strong>{layer.title}</strong>
                  <p>{layer.description}</p>
                </li>
              ))}
            </ol>

            <p className="case-study-system-note">
              Docker supported consistent delivery across the application stack,
              while JWT and role-based access separated public journeys from
              administrative operations.
            </p>
          </section>

          <section className="case-study-contribution" aria-labelledby="contribution-title">
            <div className="case-study-section-intro">
              <h2 id="contribution-title">My contribution</h2>
              <p>
                Work spanned the public product experience, backend services, and
                the operational CMS rather than a single isolated feature.
              </p>
            </div>

            <ul>
              {responsibilities.map((responsibility) => (
                <li key={responsibility}>{responsibility}</li>
              ))}
            </ul>
          </section>

          <section className="case-study-outcome" aria-labelledby="outcome-title">
            <div className="case-study-section-intro">
              <h2 id="outcome-title">Outcome</h2>
            </div>
            <p>
              The resulting platform unified coverage discovery, customer
              acquisition, and content operations in a scalable foundation built
              for continued campaign and service iteration. Content teams could
              manage frequently changing information independently, while
              customers received one coherent path from eligibility checking to
              registration.
            </p>
          </section>

          <section className="case-study-media" aria-labelledby="media-title">
            <div className="case-study-media-placeholder">
              <h2 id="media-title">Product screens</h2>
              <p>Reserved for interface screenshots and annotated walkthroughs.</p>
            </div>
          </section>

          <p className="case-study-next-step">
            Explore the live platform at{" "}
            <a href="https://ofi.id" target="_blank" rel="noreferrer">
              ofi.id <ArrowUpRight aria-hidden="true" size={15} />
            </a>
            , or{" "}
            <a href="mailto:muhammad.syadrie11@gmail.com?subject=MVHome%20Case%20Study">
              ask about the implementation <Mail aria-hidden="true" size={15} />
            </a>
            .
          </p>
        </article>
      </main>

      <footer className="case-study-footer">
        <p>One platform, from address eligibility to managed content.</p>
        <div>
          <Link href="/#projects">Back to all projects</Link>
          <span>© 2026 Muhammad Rizky Syadrie</span>
        </div>
      </footer>
    </>
  );
}
