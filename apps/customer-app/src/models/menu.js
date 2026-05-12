export function mapExperiencePayload(payload) {
  const restaurant = payload?.restaurant || null;
  const table = payload?.table || null;
  const categories = payload?.categories || [];
  const items = payload?.items || [];

  const groupedCategories = categories
    .map((category) => ({
      ...category,
      items: items.filter((item) => String(item.categoryId) === String(category._id))
    }))
    .filter((category) => category.items.length > 0);

  const featuredItems = [...items]
    .sort((left, right) => Number(right.price) - Number(left.price))
    .slice(0, 3);

  return {
    restaurant,
    table,
    categories: groupedCategories,
    featuredItems,
    items
  };
}

export function buildOrderPayload({ restaurantId, tableId, guest, cartItems }) {
  return {
    restaurantId,
    tableId,
    guestName: guest.guestName.trim(),
    guestPhone: guest.guestPhone.trim(),
    notes: guest.notes.trim(),
    items: cartItems.map((item) => ({
      itemId: item.itemId,
      quantity: item.quantity,
      modifiers: [],
      specialInstructions: item.specialInstructions || ""
    }))
  };
}

export function formatCurrency(value, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(Number(value || 0));
}

export function normalizeStatusLabel(status) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}
