import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { StatusBanner } from "../components/common/StatusBanner.jsx";
import { useSession } from "../store/SessionContext.jsx";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useSession();
  const [form, setForm] = useState({
    email: "owner@odine.test",
    password: "password123"
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(form);
      navigate("/", { replace: true });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-shell">
      <section className="auth-card">
        <div className="auth-copy">
          <p className="workspace-kicker">ODine management suite</p>
          <h1>Restaurant operating system for serious teams</h1>
          <p>
            Built for menu governance, live order orchestration, table operations, staff control,
            and the kind of management visibility clients expect from premium restaurant software.
          </p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            placeholder="Email"
          />
          <input
            type="password"
            value={form.password}
            onChange={(event) =>
              setForm((current) => ({ ...current, password: event.target.value }))
            }
            placeholder="Password"
          />
          {error ? <StatusBanner tone="error">{error}</StatusBanner> : null}
          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Enter workspace"}
          </button>
        </form>
      </section>
    </div>
  );
}
