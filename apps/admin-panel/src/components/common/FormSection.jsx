export function FormSection({ title, description, children }) {
  return (
    <section className="workspace-card">
      <div className="card-head">
        <div>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}
