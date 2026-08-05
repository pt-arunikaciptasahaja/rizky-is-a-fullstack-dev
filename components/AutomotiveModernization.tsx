"use client";

import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useTransform,
} from "framer-motion";
import { ArrowDownRight, ArrowUpRight, ExternalLink } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { automotiveModernization, type ModernizationMetric } from "@/data/portfolioData";

const diagramNodes = [
  { x: 30, y: 220, width: 230, height: 100, lines: ["WordPress editorial", "workflow"], tone: "source" },
  { x: 320, y: 220, width: 240, height: 100, lines: ["Headless content API"], tone: "system" },
  { x: 630, y: 210, width: 250, height: 120, lines: ["Next.js on the", "primary domain"], tone: "platform" },
  { x: 970, y: 35, width: 270, height: 100, lines: ["Search metadata &", "discovery signals"], tone: "search" },
  { x: 970, y: 220, width: 270, height: 100, lines: ["Contextual vehicle", "recommendations"], tone: "outcome" },
  { x: 1315, y: 220, width: 250, height: 100, lines: ["Lead-generation journey"], tone: "outcome" },
  { x: 970, y: 400, width: 240, height: 90, lines: ["Journey interaction", "events"], tone: "measure" },
  { x: 1280, y: 400, width: 240, height: 90, lines: ["Measurement routing"], tone: "measure" },
  { x: 1590, y: 330, width: 190, height: 85, lines: ["Funnel analytics"], tone: "evidence" },
  { x: 1590, y: 465, width: 250, height: 85, lines: ["Behaviour heatmaps"], tone: "evidence" },
] as const;

const diagramConnections = [
  { path: "M260 270 L308 270", arrow: [320, 270] },
  { path: "M560 270 L618 270", arrow: [630, 270] },
  { path: "M880 270 C925 270 925 85 958 85", arrow: [970, 85] },
  { path: "M880 270 L958 270", arrow: [970, 270] },
  { path: "M1240 270 L1303 270", arrow: [1315, 270] },
  { path: "M880 270 C925 270 925 445 958 445", arrow: [970, 445] },
  { path: "M1210 445 L1268 445", arrow: [1280, 445] },
  { path: "M1520 445 C1555 445 1555 372.5 1578 372.5", arrow: [1590, 372.5] },
  { path: "M1520 445 C1555 445 1555 507.5 1578 507.5", arrow: [1590, 507.5] },
] as const;

function AnimatedMetricCounter({ metric }: { metric: ModernizationMetric }) {
  const reduceMotion = useReducedMotion();
  const value = useMotionValue(reduceMotion ? metric.after : metric.before);
  const display = useTransform(value, (latest) => {
    if (metric.label === "Active listings supported") return `${Math.round(latest)}K+`;
    if (metric.label === "Lighthouse SEO score") return `${Math.round(latest)}/100`;
    return `${latest.toFixed(metric.precision ?? 0)}${metric.suffix ?? ""}`;
  });

  useEffect(() => {
    if (reduceMotion) {
      value.set(metric.after);
      return;
    }

    const controls = animate(value, metric.after, {
      duration: 1.05,
      ease: [0.16, 1, 0.3, 1],
    });

    return () => controls.stop();
  }, [metric.after, reduceMotion, value]);

  return <motion.span>{display}</motion.span>;
}

function MetricComparison({ metric, index }: { metric: ModernizationMetric; index: number }) {
  const cardRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const isInView = useInView(cardRef, { once: true, amount: 0.55 });
  const [showAfter, setShowAfter] = useState(false);
  const displayAfter = Boolean(reduceMotion || showAfter);
  const DirectionIcon = metric.direction === "down" ? ArrowDownRight : ArrowUpRight;

  useEffect(() => {
    if (!isInView || reduceMotion) return;
    const timer = window.setTimeout(() => setShowAfter(true), 700 + index * 120);
    return () => window.clearTimeout(timer);
  }, [index, isInView, reduceMotion]);

  return (
    <motion.article
      ref={cardRef}
      className={`modernization-metric modernization-metric-${metric.direction}`}
      initial={false}
      animate={isInView || reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
      transition={{ duration: 0.42, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="modernization-metric-heading">
        <h3>{metric.label}</h3>
        <span className="modernization-result">
          <DirectionIcon aria-hidden="true" size={16} />
          {metric.result}
        </span>
      </div>

      <div
        className={`modernization-value-stage${displayAfter ? " is-current" : ""}`}
      >
        <span className="modernization-value-accessible">
          {metric.beforeLabel} before; {metric.afterLabel} current
        </span>
        <div className="modernization-value-single" aria-hidden="true">
          <div className="modernization-value-meta">
            <span>{displayAfter ? "Current" : "Before"}</span>
            <motion.span
              className="modernization-value-was"
              initial={false}
              animate={{ opacity: displayAfter ? 1 : 0 }}
              transition={{
                duration: reduceMotion ? 0 : 0.28,
                delay: reduceMotion || !displayAfter ? 0 : 1.05,
              }}
            >
              {metric.label === "Lighthouse SEO score"
                ? `Previous: ${metric.beforeLabel}`
                : `Was ${metric.beforeLabel}`}
            </motion.span>
          </div>
          <strong>{displayAfter ? <AnimatedMetricCounter metric={metric} /> : metric.beforeLabel}</strong>
        </div>
      </div>

      <div className="modernization-track" aria-hidden="true">
        <motion.span
          initial={false}
          animate={{ scaleX: displayAfter ? 1 : 0 }}
          transition={{
            duration: reduceMotion ? 0 : 1.05,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      </div>
      <p>{metric.note}</p>
    </motion.article>
  );
}

function ArchitectureSystemMap({ active }: { active: boolean }) {
  const reduceMotion = useReducedMotion();

  return (
    <div className="architecture-map-viewport" tabIndex={0} aria-label="Scrollable architecture diagram">
      <svg className="architecture-system-map" viewBox="0 0 1870 580" role="img" aria-labelledby="system-map-title system-map-description">
        <title id="system-map-title">Headless marketplace content architecture</title>
        <desc id="system-map-description">
          WordPress content moves through a headless API into the primary Next.js marketplace, then branches into search discovery, contextual vehicle recommendations and leads, plus measurement evidence.
        </desc>
        <text className="architecture-map-label" x="970" y="24">SEARCH FOUNDATION</text>
        <text className="architecture-map-label" x="970" y="205">CONTENT TO LEAD</text>
        <text className="architecture-map-label" x="970" y="385">MEASUREMENT</text>

        <g className="architecture-map-paths" aria-hidden="true">
          {diagramConnections.map(({ path, arrow }, index) => {
            const [arrowX, arrowY] = arrow;
            const arrowPath = `M${arrowX - 12} ${arrowY - 7} L${arrowX} ${arrowY} L${arrowX - 12} ${arrowY + 7} Z`;

            return (
              <g key={path}>
                <motion.path
                  className="architecture-map-line"
                  d={path}
                  initial={false}
                  animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.48, delay: reduceMotion ? 0 : index * 0.11, ease: [0.16, 1, 0.3, 1] }}
                />
                <motion.path
                  className="architecture-map-arrow"
                  d={arrowPath}
                  initial={false}
                  animate={{ opacity: active ? 1 : 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.12, delay: reduceMotion ? 0 : index * 0.11 + 0.36 }}
                />
              </g>
            );
          })}
        </g>

        {diagramNodes.map((node, index) => (
          <motion.g
            key={node.lines.join("-")}
            className={`architecture-map-node architecture-map-node-${node.tone}`}
            initial={false}
            animate={{ opacity: active ? 1 : 0, y: active ? 0 : 8 }}
            transition={{ duration: reduceMotion ? 0 : 0.32, delay: reduceMotion ? 0 : 0.08 + index * 0.1 }}
          >
            <rect x={node.x} y={node.y} width={node.width} height={node.height} rx="10" />
            <text x={node.x + node.width / 2} y={node.y + node.height / 2} textAnchor="middle">
              {node.lines.map((line, lineIndex) => (
                <tspan
                  key={line}
                  x={node.x + node.width / 2}
                  dy={lineIndex === 0 ? (node.lines.length === 1 ? 7 : -4) : 26}
                >
                  {line}
                </tspan>
              ))}
            </text>
          </motion.g>
        ))}
      </svg>
      <span className="architecture-scroll-hint" aria-hidden="true">Scroll to explore the full system →</span>
    </div>
  );
}

export function AutomotiveModernization() {
  const sectionRef = useRef<HTMLElement>(null);
  const diagramRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const isInView = useInView(sectionRef, { once: true, amount: 0.18 });
  const diagramInView = useInView(diagramRef, { once: true, amount: 0.28 });
  const active = Boolean(reduceMotion || isInView);
  const flowActive = Boolean(reduceMotion || diagramInView);

  return (
    <section ref={sectionRef} className="content-section automotive-modernization" id="projects" aria-labelledby="automotive-title">
      <div className="automotive-heading">
        <div>
          <p className="automotive-kicker">Featured enterprise impact</p>
          <h2 id="automotive-title">{automotiveModernization.title}</h2>
        </div>
        <div className="automotive-intro">
          <p>{automotiveModernization.description}</p>
          <div className="automotive-links" aria-label="Automotive marketplace websites">
            {automotiveModernization.platforms.map((platform) => (
              <a key={platform.label} href={platform.href} target="_blank" rel="noreferrer">
                {platform.label} <ExternalLink aria-hidden="true" size={14} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <dl className="automotive-context">
        <div><dt>Role</dt><dd>{automotiveModernization.role}</dd></div>
        <div><dt>Scope</dt><dd>{automotiveModernization.scope}</dd></div>
        <div><dt>Collaboration</dt><dd>{automotiveModernization.collaboration}</dd></div>
      </dl>

      <div className="migration-line" aria-label="Platform migration from Ember.js to Next.js">
        <span>Legacy platform</span>
        <strong>Ember.js</strong>
        <motion.i
          aria-hidden="true"
          initial={false}
          animate={{ scaleX: active ? 1 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
        />
        <strong>Next.js</strong>
        <span>Modern platform</span>
      </div>

      <div className="modernization-metrics">
        {automotiveModernization.metrics.map((metric, index) => (
          <MetricComparison key={metric.label} metric={metric} index={index} />
        ))}
      </div>

      <figure ref={diagramRef} className="architecture-diagram" aria-labelledby="architecture-title">
        <div className="architecture-diagram-head">
          <h3 id="architecture-title">Content became part of the marketplace—not a separate destination.</h3>
          <p>
            Headless WordPress preserves the editorial workflow while a connected experience turns article context into relevant inventory and a shorter route to lead generation.
          </p>
        </div>

        <ArchitectureSystemMap active={flowActive} />

        <figcaption>Content delivery, recommendation, lead generation, and measurement operate as one connected platform journey.</figcaption>
      </figure>

      <div className="seo-ai-story">
        <div>
          <h3>Built to be found and understood—across search and AI.</h3>
          <p>
            One technical foundation controls which pages can be reached, identifies the authoritative URL, surfaces new and updated inventory, and describes each page in a machine-readable form. Those same search fundamentals support AI-powered discovery; crawler access enables consideration, not guaranteed inclusion.
          </p>
        </div>
        <div className="seo-capabilities" aria-label="Search and AI discovery architecture">
          {[
            "Semantic heading structure",
            "Metadata templates",
            "Canonical URL control",
            "XML sitemap coverage",
            "Structured data (JSON-LD)",
            "Indexable inventory paths",
            "Crawl-budget controls",
            "Robots policy",
            "Internal linking",
            "Keyword-aligned pages",
            "Authority & backlink signals",
            "AI crawler access",
            "LLM discovery files",
          ].map((item) => <span key={item}>{item}</span>)}
        </div>
        <p className="ai-observation">
          <strong>Observed discovery signal</strong>
          ChatGPT has surfaced momobil.id among Indonesian used-car marketplaces. Results can vary by prompt and over time.
        </p>
      </div>
    </section>
  );
}
