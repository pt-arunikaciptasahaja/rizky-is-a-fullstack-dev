import { ArrowUpRight, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { contact, siteMeta, socialLinks } from "@/data/portfolioData";

const linkIcons = {
  LinkedIn: Linkedin,
  GitHub: Github,
  Email: Mail,
};

export function Footer() {
  return (
    <footer className="contact-footer" id="contact">
      <div className="footer-main">
        <p className="footer-statement">{contact.heading}</p>
        <div className="footer-details">
          <p>{contact.subheading}</p>
          <p className="footer-location">
            <MapPin aria-hidden="true" size={17} /> {siteMeta.location}
          </p>
          <div className="footer-actions">
            {socialLinks.map((link) => {
              const Icon = linkIcons[link.label];
              const label = link.label === "Email" ? "Email Me" : link.label;
              const external = link.href.startsWith("http");
              return (
                <a
                  key={link.label}
                  href={link.href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noreferrer" : undefined}
                >
                  <Icon aria-hidden="true" size={17} />
                  {label}
                  <ArrowUpRight aria-hidden="true" size={15} />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <a className="wordmark" href="#top">
          {siteMeta.initials}
        </a>
        <p>{contact.copyright}</p>
      </div>
    </footer>
  );
}
