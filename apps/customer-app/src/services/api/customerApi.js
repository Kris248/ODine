import { API_URL } from "../../config/env.js";

async function parseJson(response) {
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed.");
  }

  return data;
}

export async function resolveQrSessionApi(restaurantId, tableId, seatId = "") {
  const query = seatId ? `?seat=${encodeURIComponent(seatId)}` : "";
  const response = await fetch(`${API_URL}/public/session/${restaurantId}/${tableId}${query}`);
  return parseJson(response);
}

export async function createCheckoutSessionApi(payload) {
  const response = await fetch(`${API_URL}/public/checkout-sessions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(payload)
  });

  return parseJson(response);
}

export async function fetchCheckoutSessionApi(checkoutSessionId) {
  const response = await fetch(`${API_URL}/public/checkout-sessions/${checkoutSessionId}`);
  return parseJson(response);
}

export async function completeMockPaymentApi(checkoutSessionId) {
  const response = await fetch(`${API_URL}/public/payments/mock/complete`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ checkoutSessionId })
  });

  return parseJson(response);
}

export async function fetchPublicOrderApi(orderId) {
  const response = await fetch(`${API_URL}/public/orders/${orderId}`);
  return parseJson(response);
}
