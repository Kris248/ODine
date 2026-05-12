export function ErrorScreen({ title, message }) {
  return (
    <div className="screen-state">
      <div className="screen-orb danger" />
      <p className="kicker">{title}</p>
      <h1>We could not load this table</h1>
      <p>{message}</p>
    </div>
  );
}
