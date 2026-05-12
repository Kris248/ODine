export function LoadingState({ message }) {
  return (
    <div className="state-screen">
      <div className="state-orb" />
      <h1>Loading workspace</h1>
      <p>{message}</p>
    </div>
  );
}
