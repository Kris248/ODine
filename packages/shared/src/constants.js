export const USER_ROLES = {
  SUPERADMIN: "superadmin",
  OWNER: "owner",
  MANAGER: "manager",
  CHEF: "chef"
};

export const ORDER_FULFILLMENT_STATUSES = [
  "new",
  "accepted",
  "preparing",
  "ready",
  "served",
  "cancelled"
];

export const ORDER_STATUSES = ORDER_FULFILLMENT_STATUSES;

export const KDS_STATUSES = ["new", "accepted", "preparing", "ready"];

export const CHECKOUT_SESSION_STATUSES = [
  "SESSION_RESOLVED",
  "CART_DRAFT",
  "PAYMENT_REQUEST_CREATED",
  "PAYMENT_PENDING",
  "PAYMENT_CONFIRMED",
  "ORDER_CREATED",
  "ORDER_EMITTED_TO_KDS",
  "PREPARING",
  "READY",
  "SERVED"
];

export const PAYMENT_STATUSES = [
  "draft",
  "pending",
  "confirmed",
  "failed",
  "refunded"
];

export const SOCKET_EVENTS = {
  ORDER_PAID_CONFIRMED: "order:paid_confirmed",
  ORDER_STATUS_UPDATED: "order:status_updated"
};

export const SOCKET_ROOMS = {
  restaurant: (restaurantId) => `restaurant:${restaurantId}`,
  kds: (restaurantId) => `kds:${restaurantId}`,
  kdsOutlet: (restaurantId, outletId) => `kds:${restaurantId}:${outletId}`,
  table: (restaurantId, tableId) => `table:${restaurantId}:${tableId}`,
  order: (orderId) => `order:${orderId}`
};

export const DEFAULT_PAYMENT_METHODS = [
  {
    id: "upi",
    label: "UPI",
    helperText: "Recommended for the fastest mobile checkout.",
    type: "instant"
  },
  {
    id: "card",
    label: "Card",
    helperText: "All major debit and credit cards.",
    type: "digital"
  },
  {
    id: "wallet",
    label: "Wallet",
    helperText: "PhonePe, Paytm, Amazon Pay and similar wallets.",
    type: "digital"
  },
  {
    id: "netbanking",
    label: "Net banking",
    helperText: "Secure bank transfer handoff.",
    type: "bank"
  }
];

export const DEFAULT_RESTAURANT_SETTINGS = {
  currency: "INR",
  taxRate: 5,
  serviceChargeRate: 0,
  brandColor: "#c5521e",
  estimatedPrepTimeMinutes: 18,
  paymentMethods: DEFAULT_PAYMENT_METHODS
};
