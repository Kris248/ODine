import QRCode from "qrcode";
import mongoose from "mongoose";
import { USER_ROLES } from "@odine/shared";
import { config } from "./config.js";

export async function createQrCode(restaurantRef, tableRef, seatId = "") {
  const seatQuery = seatId ? `?seat=${encodeURIComponent(seatId)}` : "";
  const url = `${config.customerAppUrl}/table/${restaurantRef}/${tableRef}${seatQuery}`;
  return QRCode.toDataURL(url);
}

export function applyRestaurantScope(query, user) {
  if (!user || user.role === USER_ROLES.SUPERADMIN) {
    return query;
  }

  return { ...query, restaurantId: user.restaurantId };
}

export function normalizeNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function roundMoney(value) {
  return Math.round((Number(value) + Number.EPSILON) * 100) / 100;
}

export function slugify(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function asId(value) {
  return mongoose.Types.ObjectId.isValid(value) ? new mongoose.Types.ObjectId(value) : null;
}

export function createHumanReference(prefix) {
  const stamp = new Date().toISOString().replace(/\D/g, "").slice(2, 14);
  const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${stamp}-${suffix}`;
}

export function createStatusEvent(status, note = "") {
  return {
    status,
    at: new Date(),
    note
  };
}

export function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}
