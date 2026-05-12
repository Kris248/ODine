import { API_URL } from "../../config/env.js";

async function parseJson(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }
  return data;
}

export async function fetchTableExperience(restaurantId, tableId) {
  const response = await fetch(`${API_URL}/public/table/${restaurantId}/${tableId}`);
  return parseJson(response);
}

export async function createGuestOrder(payload) {
  const response = await fetch(`${API_URL}/public/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return parseJson(response);
}

export async function fetchPublicOrder(orderId) {
  const response = await fetch(`${API_URL}/public/orders/${orderId}`);
  return parseJson(response);
}
