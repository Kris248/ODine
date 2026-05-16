export function formatCurrency(value, currency = "INR", locale = "en-IN") {
  const amount = Number.isFinite(Number(value)) ? Number(value) : 0;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatTime(value) {
  if (!value) return "--:--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--:--";
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

export function formatDateTime(value) {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    hour: "numeric",
    minute: "2-digit"
  }).format(date);
}

export function getOrderAgeMinutes(order) {
  const createdAt = new Date(order?.createdAt || Date.now()).getTime();
  if (Number.isNaN(createdAt)) return 0;
  return Math.max(0, Math.floor((Date.now() - createdAt) / 60000));
}

export function isDelayed(order) {
  const eta = Number(order?.estimatedPrepTimeMinutes || 18);
  return getOrderAgeMinutes(order) > eta;
}

export function getPriorityScore(order) {
  const priorityWeights = { urgent: 30, high: 20, medium: 10, low: 0 };
  const statusWeights = { new: 18, accepted: 12, preparing: 6, ready: -10, served: -18 };
  const urgency = isDelayed(order) ? 25 : 0;

  return (
    (priorityWeights[String(order?.prepPriority || "medium").toLowerCase()] ?? 10) +
    (statusWeights[String(order?.fulfillmentStatus || "new").toLowerCase()] ?? 0) +
    urgency +
    getOrderAgeMinutes(order) / 8
  );
}

export function sortOrdersForKitchen(orders = []) {
  return [...orders].sort((a, b) => getPriorityScore(b) - getPriorityScore(a));
}

export function getOrderStatusLabel(status) {
  const value = String(status || "new").toLowerCase();
  return {
    new: "Pending",
    accepted: "Accepted",
    preparing: "Preparing",
    ready: "Ready",
    served: "Served"
  }[value] || value;
}

export function getOrderStatusTone(order) {
  const status = String(order?.fulfillmentStatus || "new").toLowerCase();
  if (status === "ready" || status === "served") return "success";
  if (status === "preparing") return "warning";
  if (isDelayed(order)) return "error";
  return "default";
}

export function getTableLabel(order) {
  return order?.table?.label || order?.tableLabel || order?.table?.name || "Table ?";
}

export function getTableKey(order) {
  return String(order?.table?.id || order?.table?.label || order?.tableLabel || order?.table?.name || "unknown");
}

export function getSeatValues(order) {
  const directValues = [
    order?.seat,
    order?.seatLabel,
    order?.seatNumber,
    order?.seatId,
    order?.seat?.label,
    order?.seat?.number
  ].filter((value) => value !== undefined && value !== null && String(value).trim() !== "");

  const fromSeatsArray = Array.isArray(order?.seats)
    ? order.seats.flatMap((seat) => {
        if (seat === undefined || seat === null) return [];
        if (typeof seat === "object") {
          return [seat.label || seat.name || seat.number || seat.id].filter(Boolean);
        }
        return [seat];
      })
    : [];

  return [...new Set([...directValues, ...fromSeatsArray].map((value) => String(value).trim()).filter(Boolean))];
}

export function getSeatFrequencyFromOrders(orders = []) {
  const frequency = new Map();
  orders.forEach((order) => {
    getSeatValues(order).forEach((seat) => {
      frequency.set(seat, (frequency.get(seat) || 0) + 1);
    });
  });
  return [...frequency.entries()]
    .map(([seat, count]) => ({ seat, count }))
    .sort((a, b) => b.count - a.count || a.seat.localeCompare(b.seat));
}

export function getOrderDisplayNumber(order) {
  return order?.orderNumber || order?.number || order?.displayNumber || `#${order?.id || "—"}`;
}

export function getItemQuantity(item) {
  return Number(item?.quantity || 0);
}

function modifierSignature(modifiers = []) {
  return (modifiers || [])
    .map((modifier) => `${modifier.groupLabel || modifier.group || "Option"}:${modifier.name || modifier.label || ""}`)
    .sort()
    .join("|");
}

function itemKey(item) {
  return [
    String(item?.name || "Item").trim().toLowerCase(),
    modifierSignature(item?.modifiers || []),
    String(item?.station || item?.course || item?.category || "").trim().toLowerCase()
  ].join("::");
}

export function flattenOrderItems(orders = []) {
  return orders.flatMap((order) =>
    (order?.items || []).map((item) => ({
      ...item,
      __orderId: order.id,
      __orderNumber: getOrderDisplayNumber(order),
      __tableLabel: getTableLabel(order),
      __tableKey: getTableKey(order),
      __seatValues: getSeatValues(order),
      __status: order.fulfillmentStatus,
      __priority: order.prepPriority,
      __createdAt: order.createdAt,
      __estimatedPrepTimeMinutes: order.estimatedPrepTimeMinutes,
      __notes: order.notes,
      __order: order
    }))
  );
}

export function buildBatchGroups(orders = []) {
  const grouped = new Map();

  flattenOrderItems(orders).forEach((item) => {
    const key = itemKey(item);
    const existing =
      grouped.get(key) || {
        key,
        name: item.name || "Item",
        station: item.station || item.course || item.category || "Kitchen",
        totalQuantity: 0,
        itemCount: 0,
        orderCount: 0,
        delayedOrders: 0,
        urgentOrders: 0,
        orders: [],
        tableMap: new Map(),
        seatMap: new Map(),
        statusMap: new Map(),
        lineTotal: 0,
        earliestCreatedAt: item.__createdAt
      };

    const quantity = getItemQuantity(item) || 1;
    existing.totalQuantity += quantity;
    existing.itemCount += 1;
    existing.lineTotal += Number(item.lineTotal || 0);

    if (!existing.earliestCreatedAt || new Date(item.__createdAt) < new Date(existing.earliestCreatedAt)) {
      existing.earliestCreatedAt = item.__createdAt;
    }

    if (!existing.orders.some((entry) => entry.orderId === item.__orderId)) {
      existing.orders.push({
        orderId: item.__orderId,
        orderNumber: item.__orderNumber,
        tableLabel: item.__tableLabel,
        seatValues: item.__seatValues,
        status: item.__status,
        priority: item.__priority,
        createdAt: item.__createdAt,
        notes: item.__notes
      });
      existing.orderCount += 1;
    }

    if (isDelayed(item.__order)) existing.delayedOrders += 1;
    if (String(item.__priority || "").toLowerCase() === "high" || String(item.__priority || "").toLowerCase() === "urgent") {
      existing.urgentOrders += 1;
    }

    existing.tableMap.set(item.__tableLabel, (existing.tableMap.get(item.__tableLabel) || 0) + quantity);
    (item.__seatValues.length ? item.__seatValues : ["No seat"]).forEach((seat) => {
      existing.seatMap.set(seat, (existing.seatMap.get(seat) || 0) + quantity);
    });
    existing.statusMap.set(item.__status || "new", (existing.statusMap.get(item.__status || "new") || 0) + quantity);

    grouped.set(key, existing);
  });

  return [...grouped.values()]
    .map((group) => ({
      ...group,
      tables: [...group.tableMap.entries()]
        .map(([table, count]) => ({ table, count }))
        .sort((a, b) => b.count - a.count || a.table.localeCompare(b.table)),
      seats: [...group.seatMap.entries()]
        .map(([seat, count]) => ({ seat, count }))
        .sort((a, b) => b.count - a.count || a.seat.localeCompare(b.seat)),
      statuses: [...group.statusMap.entries()]
        .map(([status, count]) => ({ status, count }))
        .sort((a, b) => b.count - a.count || a.status.localeCompare(b.status))
    }))
    .sort((a, b) => b.totalQuantity - a.totalQuantity || b.orderCount - a.orderCount || a.name.localeCompare(b.name));
}

export function buildTableGroups(orders = []) {
  const grouped = new Map();

  orders.forEach((order) => {
    const key = getTableKey(order);
    const label = getTableLabel(order);
    const existing =
      grouped.get(key) || {
        key,
        label,
        orders: [],
        seatMap: new Map(),
        itemMap: new Map(),
        statusMap: new Map(),
        delayed: 0,
        totalItems: 0,
        totalOrders: 0,
        totalValue: 0,
        earliestCreatedAt: order.createdAt
      };

    existing.orders.push(order);
    existing.totalOrders += 1;
    existing.totalValue += Number(order?.pricing?.total || 0);
    existing.totalItems += (order?.items || []).reduce((sum, item) => sum + getItemQuantity(item), 0);
    if (!existing.earliestCreatedAt || new Date(order.createdAt) < new Date(existing.earliestCreatedAt)) {
      existing.earliestCreatedAt = order.createdAt;
    }
    if (isDelayed(order)) existing.delayed += 1;

    existing.statusMap.set(order.fulfillmentStatus || "new", (existing.statusMap.get(order.fulfillmentStatus || "new") || 0) + 1);

    getSeatValues(order).forEach((seat) => {
      existing.seatMap.set(seat, (existing.seatMap.get(seat) || 0) + 1);
    });

    (order.items || []).forEach((item) => {
      const itemName = `${item.name || "Item"}`;
      existing.itemMap.set(itemName, (existing.itemMap.get(itemName) || 0) + getItemQuantity(item));
    });

    grouped.set(key, existing);
  });

  return [...grouped.values()]
    .map((group) => ({
      ...group,
      seats: [...group.seatMap.entries()]
        .map(([seat, count]) => ({ seat, count }))
        .sort((a, b) => b.count - a.count || a.seat.localeCompare(b.seat)),
      items: [...group.itemMap.entries()]
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
      statuses: [...group.statusMap.entries()]
        .map(([status, count]) => ({ status, count }))
        .sort((a, b) => b.count - a.count || a.status.localeCompare(b.status))
    }))
    .sort((a, b) => b.totalOrders - a.totalOrders || b.totalItems - a.totalItems || a.label.localeCompare(b.label));
}

export function buildKitchenMetrics(orders = []) {
  const total = orders.length;
  const delayed = orders.filter(isDelayed).length;
  const waiting = orders.filter((order) => ["new", "accepted", "preparing"].includes(String(order.fulfillmentStatus || "").toLowerCase())).length;
  const ready = orders.filter((order) => String(order.fulfillmentStatus || "").toLowerCase() === "ready").length;
  const uniqueTables = new Set(orders.map(getTableKey)).size;

  const ageList = orders.map(getOrderAgeMinutes);
  const averageAge = ageList.length ? Math.round(ageList.reduce((sum, value) => sum + value, 0) / ageList.length) : 0;

  const items = flattenOrderItems(orders);
  const itemFrequency = new Map();
  items.forEach((item) => {
    itemFrequency.set(item.name || "Item", (itemFrequency.get(item.name || "Item") || 0) + Math.max(1, getItemQuantity(item) || 1));
  });

  const busiestItem =
    [...itemFrequency.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))[0] || { name: "—", count: 0 };

  const tableFrequency = new Map();
  orders.forEach((order) => {
    const label = getTableLabel(order);
    tableFrequency.set(label, (tableFrequency.get(label) || 0) + 1);
  });
  const busiestTable =
    [...tableFrequency.entries()]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))[0] || { name: "—", count: 0 };

  return {
    total,
    delayed,
    waiting,
    ready,
    uniqueTables,
    averageAge,
    busiestItem,
    busiestTable
  };
}

export function getStatusCounts(orders = []) {
  const counts = {
    all: orders.length,
    new: 0,
    accepted: 0,
    preparing: 0,
    ready: 0,
    served: 0,
    delayed: 0
  };

  orders.forEach((order) => {
    const status = String(order?.fulfillmentStatus || "new").toLowerCase();
    if (counts[status] !== undefined) counts[status] += 1;
    if (isDelayed(order)) counts.delayed += 1;
  });

  return counts;
}

export function getOrderPreviewItems(order, limit = 3) {
  return (order?.items || []).slice(0, limit).map((item) => ({
    name: item.name || "Item",
    quantity: getItemQuantity(item) || 1,
    modifiers: item.modifiers || [],
    specialInstructions: item.specialInstructions || "",
    lineTotal: item.lineTotal || 0
  }));
}

export function describeOrder(order) {
  const seatCount = getSeatValues(order).length;
  const itemsCount = (order?.items || []).reduce((sum, item) => sum + Math.max(1, getItemQuantity(item) || 1), 0);
  return `${getOrderDisplayNumber(order)} • ${getTableLabel(order)}${seatCount ? ` • ${seatCount} seat${seatCount > 1 ? "s" : ""}` : ""} • ${itemsCount} item${itemsCount === 1 ? "" : "s"}`;
}
