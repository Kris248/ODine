export const ORDER_STATUS_SEQUENCE = ["pending", "accepted", "preparing", "ready", "served"];

export const ORDER_STATUS_META = {
  pending: {
    label: "Pending",
    shortLabel: "Queued",
    color: "warning",
    tone: "amber",
    description: "The kitchen received your order and it is waiting for a chef to pick it up."
  },
  accepted: {
    label: "Accepted",
    shortLabel: "Picked up",
    color: "info",
    tone: "teal",
    description: "A chef has acknowledged the order and it is now in the active queue."
  },
  preparing: {
    label: "Preparing",
    shortLabel: "Cooking",
    color: "primary",
    tone: "jade",
    description: "The kitchen is actively preparing your dishes."
  },
  ready: {
    label: "Ready",
    shortLabel: "Ready to serve",
    color: "success",
    tone: "green",
    description: "The order is plated and ready to be served to your table."
  },
  served: {
    label: "Served",
    shortLabel: "Delivered",
    color: "secondary",
    tone: "gold",
    description: "Your order reached the table."
  }
};

export function normalizeOrderStatus(status) {
  const lower = String(status || "").toLowerCase();
  return ORDER_STATUS_SEQUENCE.includes(lower) ? lower : "pending";
}

export function getOrderStatusIndex(status) {
  return ORDER_STATUS_SEQUENCE.indexOf(normalizeOrderStatus(status));
}

export function getNextOrderStatus(status) {
  const idx = getOrderStatusIndex(status);
  return ORDER_STATUS_SEQUENCE[Math.min(idx + 1, ORDER_STATUS_SEQUENCE.length - 1)];
}

export function buildOrderStatusTimeline(order) {
  const status = normalizeOrderStatus(order?.fulfillmentStatus);
  const orderCreatedAt = order?.createdAt || new Date().toISOString();
  const history = Array.isArray(order?.statusHistory) ? order.statusHistory : [];
  const created = history.find((entry) => normalizeOrderStatus(entry.status) === "pending")?.at || orderCreatedAt;

  return ORDER_STATUS_SEQUENCE.map((step, index) => {
    const meta = ORDER_STATUS_META[step];
    const historyItem = history.find((entry) => normalizeOrderStatus(entry.status) === step);
    const activeIndex = getOrderStatusIndex(status);

    return {
      key: step,
      ...meta,
      active: index === activeIndex,
      completed: index < activeIndex,
      pending: index > activeIndex,
      reachedAt: historyItem?.at || (index === 0 ? created : null)
    };
  });
}

export function describeOrderStatus(status) {
  return ORDER_STATUS_META[normalizeOrderStatus(status)] || ORDER_STATUS_META.pending;
}
