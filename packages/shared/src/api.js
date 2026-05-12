export const API_URL =
  import.meta?.env?.VITE_API_URL || "http://localhost:5000/api";

export const buildTableUrl = (restaurantId, tableId) =>
  `/table/${restaurantId}/${tableId}`;
