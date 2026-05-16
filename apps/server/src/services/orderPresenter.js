import { SOCKET_ROOMS } from "@odine/shared";

export function toPublicRestaurant(restaurant) {
  return {
    id: String(restaurant._id),
    name: restaurant.name,
    slug: restaurant.slug,
    tagline: restaurant.tagline || "Premium QR dining, built for calm service.",
    hook: restaurant.hook || "Scan, order, pay, and send only confirmed orders to the kitchen.",
    description: restaurant.description || "",
    heroImage: restaurant.heroImage || "",
    ambienceHighlights: restaurant.ambienceHighlights || [],
    estimatedPrepTime: `${restaurant.settings?.estimatedPrepTimeMinutes || 18}-${(restaurant.settings?.estimatedPrepTimeMinutes || 18) + 4} min`,
    address: restaurant.address || ""
  };
}

export function toPublicTable(table, seat = null) {
  const tableLabel = table.label || `Table ${table.tableNumber}`;
  const seatLabel = seat?.label || "";

  return {
    id: String(table._id),
    code: table.code,
    tableNumber: table.tableNumber,
    label: seatLabel ? `${tableLabel} / ${seatLabel}` : tableLabel,
    baseLabel: tableLabel,
    seat: seat
      ? {
          seatId: seat.seatId,
          label: seat.label
        }
      : null
  };
}

export function toPublicCategory(category) {
  return {
    id: String(category._id),
    name: category.name,
    description: category.description || "",
    image: category.imageUrl || "",
    featured: Boolean(category.featured)
  };
}

export function toPublicMenuItem(item) {
  return {
    id: String(item._id),
    categoryId: String(item.categoryId),
    name: item.name,
    description: item.description || "",
    price: item.price,
    image: item.imageUrl || "",
    ingredients: item.ingredients || [],
    spiceLevel: item.spiceLevel || "mild",
    dietaryType: item.isVeg ? "veg" : "non-veg",
    bestseller: Boolean(item.bestseller),
    customizationGroups: (item.customizationGroups || []).map((group) => ({
      id: group.id,
      name: group.name,
      selectionType: group.selectionType,
      required: Boolean(group.required),
      options: (group.options || []).map((option) => ({
        id: option.id,
        label: option.label,
        priceDelta: option.priceDelta || 0
      }))
    }))
  };
}

export function toSessionResponse({ restaurant, table, seat, categories, items }) {
  return {
    session: {
      restaurantId: String(restaurant._id),
      tableId: String(table._id),
      outletId: table.outletId,
      seatId: seat?.seatId || "",
      roomTargets: {
        restaurant: SOCKET_ROOMS.restaurant(String(restaurant._id)),
        kds: SOCKET_ROOMS.kds(String(restaurant._id)),
        table: SOCKET_ROOMS.table(String(restaurant._id), String(table._id))
      }
    },
    restaurant: toPublicRestaurant(restaurant),
    table: toPublicTable(table, seat),
    pricing: {
      currency: restaurant.settings?.currency || "INR",
      taxRate: (restaurant.settings?.taxRate || 0) / 100,
      serviceFee: 0
    },
    paymentMethods: restaurant.settings?.paymentMethods || [],
    categories: categories.map(toPublicCategory),
    menuItems: items.map(toPublicMenuItem)
  };
}

export function toCheckoutSessionResponse(session) {
  return {
    id: String(session._id),
    sessionReference: session.sessionReference,
    lifecycleStatus: session.lifecycleStatus,
    paymentMode: session.paymentMode,
    pricing: session.pricing,
    payment: {
      status: session.paymentProof.status,
      provider: session.paymentProof.provider,
      gatewayOrderId: session.paymentProof.gatewayOrderId,
      paymentReference: session.paymentProof.paymentReference,
      receiptNumber: session.paymentProof.receiptNumber,
      amount: session.paymentProof.amount,
      currency: session.paymentProof.currency
    },
    orderId: session.orderId ? String(session.orderId) : null
  };
}

export function toOrderResponse(order) {
  return {
    id: String(order._id),
    orderNumber: order.orderNumber,
    checkoutSessionId: String(order.checkoutSessionId),
    restaurant: order.restaurantSnapshot,
    outlet: order.outletSnapshot,
    table: order.tableSnapshot,
    seat: order.seatSnapshot?.seatId ? order.seatSnapshot : null,
    guestDetails: order.guestDetails,
    notes: order.notes,
    items: order.items.map((item, index) => ({
      key: `${order._id}-${index}`,
      itemId: String(item.itemId),
      categoryId: String(item.categoryId),
      name: item.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      lineTotal: item.lineTotal,
      modifiers: (item.modifiers || []).map((modifier) => ({
        groupId: modifier.groupId,
        groupLabel: modifier.groupLabel,
        optionId: modifier.optionId,
        name: modifier.name,
        priceDelta: modifier.priceDelta || 0
      })),
      specialInstructions: item.specialInstructions || ""
    })),
    pricing: order.pricing,
    paymentProof: {
      status: order.paymentProof.status,
      provider: order.paymentProof.provider,
      paymentMode: order.paymentProof.paymentMode,
      gatewayTransactionId: order.paymentProof.gatewayTransactionId,
      gatewayOrderId: order.paymentProof.gatewayOrderId,
      paymentReference: order.paymentProof.paymentReference,
      paymentTimestamp: order.paymentProof.paymentTimestamp,
      receiptNumber: order.paymentProof.receiptNumber,
      orderId: String(order._id)
    },
    fulfillmentStatus: order.fulfillmentStatus,
    prepPriority: order.prepPriority,
    estimatedPrepTimeMinutes: order.estimatedPrepTimeMinutes,
    emittedToKdsAt: order.emittedToKdsAt,
    createdAt: order.createdAt,
    updatedAt: order.updatedAt
  };
}
