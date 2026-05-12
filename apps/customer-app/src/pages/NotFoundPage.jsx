export function NotFoundPage() {
  return (
    <div className="screen-state">
      <div className="screen-orb" />
      <p className="kicker">QR route needed</p>
      <h1>Open a valid table route</h1>
      <p>
        This experience is designed to open from a restaurant QR code such as
        `/table/:restaurantId/:tableId`.
      </p>
    </div>
  );
}
