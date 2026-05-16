export function formatCurrency(value, currency = "INR", locale = "en-IN") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(value || 0);
}

export function formatTime(value) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

export function getOrderAgeMinutes(order) {
  const createdAt = new Date(order.createdAt).getTime();
  return Math.max(0, Math.floor((Date.now() - createdAt) / 60000));
}

export function isDelayed(order) {
  return getOrderAgeMinutes(order) > (order.estimatedPrepTimeMinutes || 18);
}

export function buildBoardColumns(orders) {
  return [
    {
      key: "new",
      label: "New",
      orders: orders.filter((order) => order.fulfillmentStatus === "new")
    },
    {
      key: "accepted",
      label: "Accepted",
      orders: orders.filter((order) => order.fulfillmentStatus === "accepted")
    },
    {
      key: "preparing",
      label: "Preparing",
      orders: orders.filter((order) => order.fulfillmentStatus === "preparing")
    },
    {
      key: "ready",
      label: "Ready",
      orders: orders.filter((order) => order.fulfillmentStatus === "ready")
    }
  ];
}

export function filterOrders(orders, filterKey) {
  if (filterKey === "all") {
    return orders;
  }
  if (filterKey === "delayed") {
    return orders.filter(isDelayed);
  }
  return orders.filter((order) => order.fulfillmentStatus === filterKey);
}
