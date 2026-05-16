import { USE_MOCK_DATA } from "../config/env.js";
import { buildOrderStatusTimeline, normalizeOrderStatus } from "../constants/orderStatuses.js";
import {
  completeMockPaymentApi,
  createCheckoutSessionApi,
  fetchCheckoutSessionApi,
  fetchPublicOrderApi
} from "./api/customerApi.js";

const mockCheckoutStore = new Map();
const mockConfirmedOrders = new Map();
const MOCK_ORDER_STORE_KEY = "odine.mock.confirmedOrders";

function sleep(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function createReference(prefix) {
  return `${prefix}-${Math.floor(Date.now() / 1000)}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

function readStoredConfirmedOrders() {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(MOCK_ORDER_STORE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persistConfirmedOrder(order) {
  if (typeof window === "undefined" || !order) return order;
  const history = readStoredConfirmedOrders().filter((entry) => entry.id !== order.id);
  history.unshift(order);
  window.localStorage.setItem(MOCK_ORDER_STORE_KEY, JSON.stringify(history.slice(0, 20)));
  window.localStorage.setItem(`odine.order.${order.id}`, JSON.stringify(order));
  try {
    if ("BroadcastChannel" in window) {
      const channel = new BroadcastChannel("odine.orders");
      channel.postMessage({ order });
      channel.close();
    }
  } catch {
    // ignore broadcast failures
  }
  window.dispatchEvent(new CustomEvent("odine:order-update", { detail: { order } }));
  return order;
}

function createStatusHistory(createdAt) {
  return [
    { status: "pending", at: createdAt, by: "system" }
  ];
}

function buildMockOrder({ restaurant, table, session, items, summary, guestDetails, orderNote, seat }) {
  const id = createReference("ord");
  const createdAt = new Date().toISOString();

  return persistConfirmedOrder({
    id,
    orderNumber: createReference("ORD"),
    checkoutSessionId: session.id,
    restaurant: {
      id: restaurant.id,
      name: restaurant.name,
      slug: restaurant.slug || restaurant.id
    },
    outlet: {
      outletId: "main",
      name: "Main Dining Room",
      code: "main"
    },
    table: {
      id: table.id,
      code: table.id,
      tableNumber: table.baseLabel || table.label,
      label: table.label
    },
    seat: seat || null,
    guestDetails,
    notes: orderNote,
    items: items.map((item) => ({
      key: item.key,
      itemId: item.itemId,
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      lineTotal: item.unitPrice * item.quantity,
      modifiers: (item.selectedCustomizations || []).flatMap((group) =>
        group.options.map((option) => ({
          groupId: group.groupId,
          groupLabel: group.groupLabel,
          optionId: option.id,
          name: option.label,
          priceDelta: option.priceDelta || 0
        }))
      ),
      specialInstructions: item.specialInstructions || ""
    })),
    pricing: {
      currency: summary.currency || "INR",
      subtotal: summary.subtotal,
      taxRate: summary.taxRate,
      tax: summary.taxes,
      serviceChargeRate: 0,
      serviceCharge: summary.serviceFee,
      total: summary.total
    },
    paymentProof: {
      status: "confirmed",
      provider: "mockpay",
      paymentMode: session.paymentMode,
      gatewayTransactionId: createReference("GTX"),
      gatewayOrderId: session.payment.gatewayOrderId,
      paymentReference: session.payment.paymentReference,
      paymentTimestamp: new Date().toISOString(),
      receiptNumber: session.payment.receiptNumber,
      orderId: id
    },
    fulfillmentStatus: "pending",
    prepPriority: "normal",
    estimatedPrepTimeMinutes: 18,
    createdAt,
    updatedAt: createdAt,
    liveStatusUpdatedAt: createdAt,
    statusHistory: createStatusHistory(createdAt),
    statusTimeline: buildOrderStatusTimeline({
      fulfillmentStatus: "pending",
      createdAt,
      statusHistory: createStatusHistory(createdAt)
    })
  });
}


function reconcileMockOrderProgress(order) {
  if (!order?.createdAt) return order;

  const createdAtMs = new Date(order.createdAt).getTime();
  if (Number.isNaN(createdAtMs)) return order;

  const ageMs = Date.now() - createdAtMs;
  const stages = [
    ["pending", 0],
    ["accepted", 20000],
    ["preparing", 50000],
    ["ready", 90000],
    ["served", 135000]
  ];

  let target = "pending";
  for (const [status, threshold] of stages) {
    if (ageMs >= threshold) {
      target = status;
    }
  }

  if (normalizeOrderStatus(order.fulfillmentStatus) === normalizeOrderStatus(target)) {
    return order;
  }

  const updated = {
    ...order,
    fulfillmentStatus: normalizeOrderStatus(target),
    updatedAt: new Date().toISOString(),
    liveStatusUpdatedAt: new Date().toISOString(),
    statusHistory: [
      ...(Array.isArray(order.statusHistory) ? order.statusHistory : []).filter(
        (entry) => normalizeOrderStatus(entry.status) === "pending" || normalizeOrderStatus(entry.status) === target
      ),
      ...(target !== "pending"
        ? [{ status: target, at: new Date().toISOString(), by: "system" }]
        : [])
    ]
  };

  mockConfirmedOrders.set(updated.id, updated);
  persistConfirmedOrder(updated);
  return updated;
}

function updateMockOrderStatus(orderId, nextStatus, by = "kitchen") {
  const current = mockConfirmedOrders.get(orderId);
  if (!current) return null;

  const at = new Date().toISOString();
  const existingHistory = Array.isArray(current.statusHistory) ? current.statusHistory : [];
  const nextOrder = {
    ...current,
    fulfillmentStatus: normalizeOrderStatus(nextStatus),
    liveStatusUpdatedAt: at,
    updatedAt: at,
    statusHistory: [
      ...existingHistory.filter((entry) => normalizeOrderStatus(entry.status) !== normalizeOrderStatus(nextStatus)),
      { status: normalizeOrderStatus(nextStatus), at, by }
    ],
    statusTimeline: buildOrderStatusTimeline({
      ...current,
      fulfillmentStatus: normalizeOrderStatus(nextStatus),
      statusHistory: [
        ...existingHistory.filter((entry) => normalizeOrderStatus(entry.status) !== normalizeOrderStatus(nextStatus)),
        { status: normalizeOrderStatus(nextStatus), at, by }
      ]
    })
  };

  mockConfirmedOrders.set(orderId, nextOrder);
  persistConfirmedOrder(nextOrder);
  return nextOrder;
}

function scheduleMockOrderProgress(orderId) {
  const stages = [
    ["accepted", 20000],
    ["preparing", 50000],
    ["ready", 90000],
    ["served", 135000]
  ];

  stages.forEach(([status, delay]) => {
    window.setTimeout(() => {
      updateMockOrderStatus(orderId, status, "kitchen");
    }, delay);
  });
}

export async function createCheckoutSession(payload) {
  if (USE_MOCK_DATA) {
    await sleep(600);
    const checkoutSession = {
      id: createReference("cks"),
      sessionReference: createReference("CKS"),
      lifecycleStatus: "PAYMENT_PENDING",
      paymentMode: payload.paymentMode.id,
      pricing: {
        currency: payload.summary.currency || payload.pricing?.currency || "INR",
        subtotal: payload.summary.subtotal,
        taxRate: payload.summary.taxRate,
        tax: payload.summary.taxes,
        serviceChargeRate: 0,
        serviceCharge: payload.summary.serviceFee,
        total: payload.summary.total
      },
      payment: {
        status: "pending",
        provider: "mockpay",
        gatewayOrderId: createReference("GWO"),
        paymentReference: createReference("PAY"),
        receiptNumber: createReference("RCT"),
        amount: payload.summary.total,
        currency: payload.pricing.currency
      },
      paymentAction: {
        type: "mock_redirect",
        label: "Complete secure test payment"
      },
      orderId: null
    };

    mockCheckoutStore.set(checkoutSession.id, {
      checkoutSession,
      payload
    });

    return checkoutSession;
  }

  const response = await createCheckoutSessionApi({
    restaurantId: payload.restaurant.id,
    tableId: payload.table.id,
    seatId: payload.table.seat?.seatId || payload.seatId || "",
    guestDetails: payload.guestDetails,
    notes: payload.orderNote,
    items: payload.items.map((item) => ({
      itemId: item.itemId,
      quantity: item.quantity,
      selectedCustomizations: item.selectedCustomizations || [],
      specialInstructions: item.specialInstructions || ""
    })),
    paymentMode: payload.paymentMode.id
  });

  return response.checkoutSession;
}

export async function completeCheckoutPayment(checkoutSessionId) {
  if (USE_MOCK_DATA) {
    await sleep(900);
    const stored = mockCheckoutStore.get(checkoutSessionId);
    if (!stored) {
      throw new Error("Mock checkout session expired.");
    }

    const order = buildMockOrder({
      restaurant: stored.payload.restaurant,
      table: stored.payload.table,
      session: stored.checkoutSession,
      items: stored.payload.items,
      summary: {
        ...stored.payload.summary,
        currency: stored.payload.pricing.currency
      },
      guestDetails: stored.payload.guestDetails,
      orderNote: stored.payload.orderNote,
      seat: stored.payload.table.seat
    });

    mockConfirmedOrders.set(order.id, order);
    persistConfirmedOrder(order);
    scheduleMockOrderProgress(order.id);

    return {
      checkoutSession: {
        ...stored.checkoutSession,
        lifecycleStatus: "ORDER_EMITTED_TO_KDS",
        orderId: order.id,
        payment: {
          ...stored.checkoutSession.payment,
          status: "confirmed"
        }
      },
      order
    };
  }

  return completeMockPaymentApi(checkoutSessionId);
}

export async function fetchCheckoutSession(checkoutSessionId) {
  if (USE_MOCK_DATA) {
    const stored = mockCheckoutStore.get(checkoutSessionId);
    return {
      checkoutSession: stored?.checkoutSession || null,
      order: null
    };
  }

  return fetchCheckoutSessionApi(checkoutSessionId);
}

export async function fetchConfirmedOrder(orderId) {
  if (USE_MOCK_DATA) {
    if (mockConfirmedOrders.has(orderId)) {
      return { order: reconcileMockOrderProgress(mockConfirmedOrders.get(orderId)) };
    }

    const stored = readStoredConfirmedOrders().find((entry) => String(entry.id) === String(orderId));
    return { order: reconcileMockOrderProgress(stored || null) };
  }

  return fetchPublicOrderApi(orderId);
}
