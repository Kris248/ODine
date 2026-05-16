import { CheckoutSession, Order, Table } from "../models.js";
import { createHumanReference, createStatusEvent, roundMoney } from "../utils.js";

export async function seedDemoOrder({ restaurant, tables, menuItems }) {
  const demoItems = [
    {
      itemId: menuItems[0]._id,
      categoryId: menuItems[0].categoryId,
      name: menuItems[0].name,
      quantity: 2,
      unitPrice: menuItems[0].price,
      modifiers: [
        {
          groupId: "chaat-crunch",
          groupLabel: "Crunch level",
          optionId: "extra",
          name: "Extra papdi",
          priceDelta: 20
        }
      ],
      specialInstructions: "Extra tamarind glaze"
    },
    {
      itemId: menuItems[3]._id,
      categoryId: menuItems[3].categoryId,
      name: menuItems[3].name,
      quantity: 1,
      unitPrice: menuItems[3].price,
      modifiers: [
        {
          groupId: "protein",
          groupLabel: "Choose your protein",
          optionId: "prawns",
          name: "Coastal prawns",
          priceDelta: 80
        }
      ],
      specialInstructions: "Less spice"
    }
  ];

  const subtotal = demoItems.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity + item.modifiers.reduce((mSum, modifier) => mSum + modifier.priceDelta, 0),
    0
  );
  const tax = roundMoney((subtotal * restaurant.settings.taxRate) / 100);
  const serviceCharge = roundMoney((subtotal * restaurant.settings.serviceChargeRate) / 100);
  const pricing = {
    currency: restaurant.settings.currency,
    subtotal,
    taxRate: restaurant.settings.taxRate,
    tax,
    serviceChargeRate: restaurant.settings.serviceChargeRate,
    serviceCharge,
    total: subtotal + tax + serviceCharge
  };

  const checkoutSession = await CheckoutSession.create({
    sessionReference: createHumanReference("CKS"),
    lifecycleStatus: "PAYMENT_CONFIRMED",
    restaurantId: restaurant._id,
    tableId: tables[0]._id,
    outletId: "main",
    seatId: "seat-1",
    restaurantSnapshot: {
      id: String(restaurant._id),
      name: restaurant.name,
      slug: restaurant.slug
    },
    outletSnapshot: {
      outletId: "main",
      name: "Main Dining Room",
      code: "main"
    },
    tableSnapshot: {
      id: String(tables[0]._id),
      code: tables[0].code,
      tableNumber: tables[0].tableNumber,
      label: tables[0].label
    },
    seatSnapshot: {
      seatId: "seat-1",
      label: "Seat 1"
    },
    guestDetails: {
      name: "Demo Guest",
      phone: ""
    },
    notes: "Seeded demo order for live KDS and admin testing.",
    items: demoItems.map((item) => ({
      ...item,
      lineTotal: item.unitPrice * item.quantity + item.modifiers.reduce((sum, modifier) => sum + modifier.priceDelta, 0)
    })),
    pricing,
    estimatedPrepTimeMinutes: restaurant.settings.estimatedPrepTimeMinutes,
    paymentMode: "upi",
    paymentProof: {
      status: "confirmed",
      provider: "mockpay",
      paymentMode: "upi",
      gatewayOrderId: createHumanReference("GWO"),
      gatewayTransactionId: createHumanReference("TRX"),
      paymentReference: createHumanReference("PAY"),
      amount: pricing.total,
      currency: pricing.currency,
      paymentTimestamp: new Date(),
      receiptNumber: `RCPT-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      signature: "seeded",
      rawPayload: {}
    },
    orderId: null,
    statusTimeline: [createStatusEvent("PAYMENT_CONFIRMED", "Seed order confirmed for demo.")]
  });

  const order = await Order.create({
    orderNumber: createHumanReference("ORD"),
    checkoutSessionId: checkoutSession._id,
    restaurantId: restaurant._id,
    tableId: tables[0]._id,
    outletId: "main",
    seatId: "seat-1",
    restaurantSnapshot: checkoutSession.restaurantSnapshot,
    outletSnapshot: checkoutSession.outletSnapshot,
    tableSnapshot: checkoutSession.tableSnapshot,
    seatSnapshot: checkoutSession.seatSnapshot,
    guestDetails: checkoutSession.guestDetails,
    notes: checkoutSession.notes,
    items: checkoutSession.items,
    pricing: checkoutSession.pricing,
    paymentProof: checkoutSession.paymentProof,
    fulfillmentStatus: "new",
    prepPriority: "normal",
    estimatedPrepTimeMinutes: checkoutSession.estimatedPrepTimeMinutes,
    emittedToKdsAt: new Date(),
    statusTimeline: [createStatusEvent("ORDER_CREATED", "Seed order created for kitchen display.")]
  });

  await CheckoutSession.findByIdAndUpdate(checkoutSession._id, { orderId: order._id });
  await Table.findByIdAndUpdate(tables[0]._id, { status: "occupied" });

  return { checkoutSession, order };
}
