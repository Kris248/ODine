export function formatCurrency(value, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

export function buildOverviewMetrics({ orders, tables, items, staff }) {
  const revenue = orders.reduce((sum, order) => sum + Number(order.total || 0), 0);
  const activeOrders = orders.filter((order) =>
    ["received", "accepted", "preparing", "ready"].includes(order.status)
  ).length;
  const occupiedTables = tables.filter((table) => table.status === "occupied").length;
  const availableMenuItems = items.filter((item) => item.isAvailable).length;

  return {
    revenue,
    activeOrders,
    occupiedTables,
    availableMenuItems,
    totalStaff: staff.length
  };
}

export function buildOrderInsights(orders) {
  const statusCounts = orders.reduce((accumulator, order) => {
    accumulator[order.status] = (accumulator[order.status] || 0) + 1;
    return accumulator;
  }, {});

  const topGuests = [...orders]
    .reduce((map, order) => {
      map.set(order.guestName, (map.get(order.guestName) || 0) + Number(order.total || 0));
      return map;
    }, new Map())
    .entries();

  return {
    statusCounts,
    topGuests: [...topGuests]
      .map(([guestName, spend]) => ({ guestName, spend }))
      .sort((left, right) => right.spend - left.spend)
      .slice(0, 4)
  };
}
