import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { io } from "socket.io-client";
import { KDS_STATUSES } from "@odine/shared";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

function getSession() {
  const raw = window.localStorage.getItem("odine-kds-session");
  return raw ? JSON.parse(raw) : null;
}

function setSession(data) {
  window.localStorage.setItem("odine-kds-session", JSON.stringify(data));
}

function clearSession() {
  window.localStorage.removeItem("odine-kds-session");
}

async function authRequest(path, options = {}) {
  const session = getSession();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {})
    }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }
  return data;
}

function Login({ onLogin }) {
  const [form, setForm] = useState({ email: "chef@odine.test", password: "password123" });
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    try {
      const data = await authRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(form)
      });
      setSession(data);
      onLogin(data);
    } catch (submitError) {
      setError(submitError.message);
    }
  }

  return (
    <div className="shell login-shell">
      <form className="panel login-panel" onSubmit={submit}>
        <p className="eyebrow">ODine KDS</p>
        <h1>Kitchen login</h1>
        <input
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          placeholder="Email"
        />
        <input
          type="password"
          value={form.password}
          onChange={(event) => setForm({ ...form, password: event.target.value })}
          placeholder="Password"
        />
        {error ? <p className="error">{error}</p> : null}
        <button type="submit">Enter kitchen board</button>
      </form>
    </div>
  );
}

function Dashboard({ session, onLogout }) {
  const [orders, setOrders] = useState([]);

  async function loadOrders() {
    const data = await authRequest("/orders");
    setOrders(data.orders);
  }

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socket.emit("join", { restaurantId: session.user.restaurantId, kind: "kitchen" });
    socket.on("order:new", (order) => {
      setOrders((current) => [order, ...current]);
    });
    socket.on("order:status-updated", (updatedOrder) => {
      setOrders((current) =>
        current.map((order) => (order._id === updatedOrder._id ? updatedOrder : order))
      );
    });
    return () => socket.disconnect();
  }, [session]);

  async function setStatus(orderId, status) {
    await authRequest(`/orders/${orderId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status })
    });
  }

  const grouped = useMemo(
    () =>
      KDS_STATUSES.map((status) => ({
        status,
        orders: orders.filter((order) => order.status === status)
      })),
    [orders]
  );

  return (
    <div className="shell kds-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">Kitchen board</p>
          <h1>{session.user.name}</h1>
        </div>
        <button className="ghost" onClick={() => {
          clearSession();
          onLogout();
        }}>
          Logout
        </button>
      </header>
      <section className="board">
        {grouped.map((column) => (
          <div className="column" key={column.status}>
            <h2>{column.status}</h2>
            {column.orders.map((order) => (
              <div className="panel order-card" key={order._id}>
                <strong>Table {order.tableId?.tableNumber}</strong>
                <p>{order.guestName}</p>
                <p>{order.items.map((item) => `${item.quantity}x ${item.name}`).join(", ")}</p>
                <div className="actions">
                  {KDS_STATUSES.map((status) => (
                    <button
                      key={status}
                      className="ghost"
                      disabled={status === order.status}
                      onClick={() => setStatus(order._id, status)}
                    >
                      {status}
                    </button>
                  ))}
                  <button onClick={() => setStatus(order._id, "served")}>Serve</button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </section>
    </div>
  );
}

export default function App() {
  const [session, setSessionState] = useState(() => getSession());

  return (
    <Routes>
      <Route
        path="/login"
        element={session ? <Navigate to="/" replace /> : <Login onLogin={setSessionState} />}
      />
      <Route
        path="/"
        element={session ? <Dashboard session={session} onLogout={() => setSessionState(null)} /> : <Navigate to="/login" replace />}
      />
    </Routes>
  );
}
