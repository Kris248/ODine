const BASE_URL = window.location.hostname === "localhost" 
  ? "http://localhost:5000" 
  : "http://192.168.1.6:5000";

const API_URL = import.meta.env.VITE_API_URL || `${BASE_URL}/api`;

export function getStoredSession() {
  const raw = window.localStorage.getItem("odine-kds-session");
  return raw ? JSON.parse(raw) : null;
}

export function setStoredSession(session) {
  window.localStorage.setItem("odine-kds-session", JSON.stringify(session));
}

export function clearStoredSession() {
  window.localStorage.removeItem("odine-kds-session");
}

async function parseJson(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }
  return data;
}

export async function authRequest(path, options = {}) {
  const session = getStoredSession();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
      ...(options.headers || {})
    }
  });

  return parseJson(response);
}

export async function loginKds(credentials) {
  return authRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials)
  });
}

export async function fetchOrders() {
  return authRequest("/orders");
}

export async function updateOrderStatus(orderId, status) {
  return authRequest(`/orders/${orderId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status })
  });
}
