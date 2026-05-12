export function LoadingScreen({ title, body }) {
  return (
    <div className="screen-state">
      <div className="screen-orb" />
      <p className="kicker">{title}</p>
      <h1>Preparing your dining experience</h1>
      <p>{body}</p>
    </div>
  );
}
