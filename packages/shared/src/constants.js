export const USER_ROLES = {
  SUPERADMIN: "superadmin",
  OWNER: "owner",
  MANAGER: "manager",
  CHEF: "chef"
};

export const ORDER_STATUSES = [
  "received",
  "accepted",
  "preparing",
  "ready",
  "served",
  "cancelled"
];

export const KDS_STATUSES = ["received", "accepted", "preparing", "ready"];

export const DEFAULT_RESTAURANT_SETTINGS = {
  currency: "INR",
  taxRate: 5,
  serviceChargeRate: 0,
  brandColor: "#c5521e"
};
