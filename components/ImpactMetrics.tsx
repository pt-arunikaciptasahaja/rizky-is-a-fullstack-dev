import { metrics } from "@/data/portfolioData";

export function ImpactMetrics() {
  return (
    <section className="metrics-strip" aria-label="Career impact metrics">
      {metrics.map((metric) => (
        <article key={metric.label} className="metric">
          <strong>{metric.value}</strong>
          <h2>{metric.label}</h2>
          <p>{metric.detail}</p>
        </article>
      ))}
    </section>
  );
}
