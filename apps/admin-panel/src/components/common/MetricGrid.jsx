export function MetricGrid({ items }) {
  return (
    <section className="metric-grid">
      {items.map((item) => (
        <article className="metric-card" key={item.label}>
          <p>{item.label}</p>
          <strong>{item.value}</strong>
          <span>{item.caption}</span>
        </article>
      ))}
    </section>
  );
}
