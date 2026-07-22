"use client";

import { Download, Menu, X } from "lucide-react";
import { useState } from "react";
import { navigation, siteMeta } from "@/data/portfolioData";
import { ThemeToggle } from "@/components/ThemeToggle";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="site-header">
      <nav className="nav-pill" aria-label="Primary navigation">
        <a className="wordmark" href="#top" onClick={closeMenu}>
          {siteMeta.initials}
        </a>

        <ul className="nav-links">
          {navigation.map((item) => (
            <li key={item.href}>
              <a href={item.href}>{item.label}</a>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <ThemeToggle />

          <a className="nav-resume" href={siteMeta.resumeUrl} download>
            Resume <Download aria-hidden="true" size={15} />
          </a>

          <button
            className="menu-button"
            type="button"
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            aria-label={isOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setIsOpen((current) => !current)}
          >
            {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </button>
        </div>
      </nav>

      {isOpen ? (
        <div className="mobile-nav" id="mobile-navigation">
          <ul>
            {navigation.map((item) => (
              <li key={item.href}>
                <a href={item.href} onClick={closeMenu}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a href={siteMeta.resumeUrl} download onClick={closeMenu}>
            Download Resume <Download aria-hidden="true" size={16} />
          </a>
        </div>
      ) : null}
    </header>
  );
}
