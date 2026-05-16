export const DEFAULT_RESTAURANT_ID = "saffron-cove";
export const DEFAULT_TABLE_ID = "table-12";

export function buildSeatQuery(seatId = "") {
  return seatId ? `?seat=${encodeURIComponent(seatId)}` : "";
}

export const APP_ROUTES = {
  home: (restaurantId = DEFAULT_RESTAURANT_ID, tableId = DEFAULT_TABLE_ID, seatId = "") =>
    `/table/${restaurantId}/${tableId}${buildSeatQuery(seatId)}`,
  cart: (restaurantId, tableId, seatId = "") =>
    `/table/${restaurantId}/${tableId}/cart${buildSeatQuery(seatId)}`,
  checkout: (restaurantId, tableId, seatId = "") =>
    `/table/${restaurantId}/${tableId}/checkout${buildSeatQuery(seatId)}`,
  payment: (restaurantId, tableId, seatId = "") =>
    `/table/${restaurantId}/${tableId}/payment${buildSeatQuery(seatId)}`,
  tracking: (restaurantId, tableId, orderId, seatId = "") =>
    `/table/${restaurantId}/${tableId}/orders/${orderId}${buildSeatQuery(seatId)}`,
  confirmation: (restaurantId, tableId, orderId, seatId = "") =>
    `/table/${restaurantId}/${tableId}/confirmation/${orderId}${buildSeatQuery(seatId)}`
};
