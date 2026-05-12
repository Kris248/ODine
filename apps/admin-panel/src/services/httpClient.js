import { API_URL } from "../config/env.js";
import { getStoredSession } from "./sessionStorage.js";

export async function httpRequest(path, options = {}) {
  const session = getStoredSession();
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
      ...(options.headers || {})
    }
  });

  const data = response.status === 204 ? null : await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || "Request failed.");
  }

  return data;
}
