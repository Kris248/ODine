export function StatusBanner({ tone = "notice", children }) {
  return <div className={`status-banner ${tone}`}>{children}</div>;
}
