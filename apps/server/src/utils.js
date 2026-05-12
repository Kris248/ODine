import QRCode from "qrcode";
import { USER_ROLES } from "@odine/shared";

export async function createQrCode(restaurantId, tableId) {
  const url = `http://localhost:5174/table/${restaurantId}/${tableId}`;
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
