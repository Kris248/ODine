import { httpRequest } from "../httpClient.js";

export async function fetchWorkspaceBundle() {
  const [restaurantData, tablesData, categoriesData, itemsData, ordersData, staffData] =
    await Promise.all([
      httpRequest("/restaurants/me"),
      httpRequest("/tables"),
      httpRequest("/menu/categories"),
      httpRequest("/menu/items"),
      httpRequest("/orders"),
      httpRequest("/staff")
    ]);

  return {
    restaurant: restaurantData.restaurant,
    tables: tablesData.tables,
    categories: categoriesData.categories,
    items: itemsData.items,
    orders: ordersData.orders,
    staff: staffData.staff
  };
}

export function createTable(payload) {
  return httpRequest("/tables", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function updateTable(id, payload) {
  return httpRequest(`/tables/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

export function createCategory(payload) {
  return httpRequest("/menu/categories", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function createMenuItem(payload) {
  return httpRequest("/menu/items", {
    method: "POST",
    body: JSON.stringify(payload)
  });
}

export function updateMenuItem(id, payload) {
  return httpRequest(`/menu/items/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

export function updateOrderStatus(id, payload) {
  return httpRequest(`/orders/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}

export function updateRestaurant(payload) {
  return httpRequest("/restaurants/me", {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
}
