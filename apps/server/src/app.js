import cors from "cors";
import express from "express";
import helmet from "helmet";
import http from "http";
import { Server } from "socket.io";
import {
  CHECKOUT_SESSION_STATUSES,
  ORDER_STATUSES,
  SOCKET_EVENTS,
  SOCKET_ROOMS,
  USER_ROLES
} from "@odine/shared";
import { authorize, createToken, hashPassword, requireAuth, verifyPassword } from "./auth.js";
import { config } from "./config.js";
import {
  CheckoutSession,
  MenuCategory,
  MenuItem,
  Order,
  PaymentEvent,
  Restaurant,
  Table,
  User
} from "./models.js";
import { toCheckoutSessionResponse, toOrderResponse, toSessionResponse } from "./services/orderPresenter.js";
import {
  buildMockWebhookEvent,
  createMockPaymentRequest,
  signWebhookPayload,
  verifyWebhookSignature
} from "./services/paymentGateway.js";
import {
  applyRestaurantScope,
  asId,
  createHumanReference,
  createQrCode,
  createStatusEvent,
  ensureArray,
  normalizeNumber,
  roundMoney,
  slugify
} from "./utils.js";

function asyncHandler(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

async function resolveRestaurantByRef(restaurantRef) {
  const objectId = asId(restaurantRef);
  if (objectId) {
    return Restaurant.findById(objectId);
  }

  return Restaurant.findOne({ slug: restaurantRef });
}

async function resolveTableByRef(restaurantId, tableRef) {
  const objectId = asId(tableRef);
  const query = objectId
    ? { restaurantId, _id: objectId }
    : {
        restaurantId,
        $or: [{ code: tableRef }, { tableNumber: tableRef }]
      };

  return Table.findOne(query);
}

function resolveSeat(table, seatId) {
  if (!seatId) {
    return null;
  }

  return (table.seats || []).find((seat) => seat.seatId === seatId) || null;
}

function getOutletSnapshot(restaurant, table) {
  const outlet =
    (restaurant.outlets || []).find((entry) => entry.outletId === table.outletId) ||
    restaurant.outlets?.[0] || {
      outletId: table.outletId || "main",
      name: table.outletName || "Main Dining Room",
      code: table.outletId || "main"
    };

  return {
    outletId: outlet.outletId,
    name: outlet.name,
    code: outlet.code
  };
}

function getTableSnapshot(table, seat = null) {
  const tableLabel = table.label || `Table ${table.tableNumber}`;

  return {
    id: String(table._id),
    code: table.code,
    tableNumber: table.tableNumber,
    label: seat?.label ? `${tableLabel} / ${seat.label}` : tableLabel
  };
}

function getSeatSnapshot(seat = null) {
  return {
    seatId: seat?.seatId || "",
    label: seat?.label || ""
  };
}

function validateAndHydrateLineItems(requestItems, menuItems) {
  const menuMap = new Map(menuItems.map((item) => [String(item._id), item]));

  return ensureArray(requestItems).map((entry) => {
    const menuItem = menuMap.get(String(entry.itemId));
    if (!menuItem) {
      throw new Error("One or more cart items are no longer available.");
    }

    const quantity = Math.max(1, normalizeNumber(entry.quantity, 1));
    const selectedCustomizations = ensureArray(entry.selectedCustomizations);
    const modifiers = [];

    for (const group of ensureArray(menuItem.customizationGroups)) {
      const selectedGroup = selectedCustomizations.find((candidate) => candidate.groupId === group.id);
      const selectedOptions = ensureArray(selectedGroup?.options);

      if (group.required && selectedOptions.length === 0) {
        throw new Error(`Missing required customization for ${menuItem.name}.`);
      }

      if (group.selectionType === "single" && selectedOptions.length > 1) {
        throw new Error(`Too many selections for ${menuItem.name}.`);
      }

      for (const option of selectedOptions) {
        const matchedOption = ensureArray(group.options).find((candidate) => candidate.id === option.id);
        if (!matchedOption) {
          throw new Error(`Invalid customization selected for ${menuItem.name}.`);
        }

        modifiers.push({
          groupId: group.id,
          groupLabel: group.name,
          optionId: matchedOption.id,
          name: matchedOption.label,
          priceDelta: normalizeNumber(matchedOption.priceDelta)
        });
      }
    }

    const unitPrice = roundMoney(
      menuItem.price + modifiers.reduce((sum, modifier) => sum + modifier.priceDelta, 0)
    );

    return {
      itemId: menuItem._id,
      categoryId: menuItem.categoryId,
      name: menuItem.name,
      quantity,
      unitPrice,
      lineTotal: roundMoney(unitPrice * quantity),
      modifiers,
      specialInstructions: String(entry.specialInstructions || "").trim()
    };
  });
}

function calculatePricing(restaurant, items) {
  const subtotal = roundMoney(items.reduce((sum, item) => sum + item.lineTotal, 0));
  const taxRatePercent = normalizeNumber(restaurant.settings?.taxRate);
  const serviceChargeRatePercent = normalizeNumber(restaurant.settings?.serviceChargeRate);
  const tax = roundMoney(subtotal * (taxRatePercent / 100));
  const serviceCharge = roundMoney(subtotal * (serviceChargeRatePercent / 100));

  return {
    currency: restaurant.settings?.currency || "INR",
    subtotal,
    taxRate: taxRatePercent / 100,
    tax,
    serviceChargeRate: serviceChargeRatePercent / 100,
    serviceCharge,
    total: roundMoney(subtotal + tax + serviceCharge)
  };
}

function determinePrepPriority(items, notes) {
  const quantity = items.reduce((sum, item) => sum + item.quantity, 0);
  if (quantity >= 6 || String(notes || "").toLowerCase().includes("rush")) {
    return "high";
  }
  if (quantity >= 3) {
    return "medium";
  }
  return "normal";
}

function mapOrderStatusToLifecycle(status) {
  if (status === "preparing") {
    return "PREPARING";
  }
  if (status === "ready") {
    return "READY";
  }
  if (status === "served") {
    return "SERVED";
  }
  return null;
}

async function emitPaidOrder(io, orderDocument) {
  const payload = toOrderResponse(orderDocument);
  const restaurantId = payload.restaurant.id;
  const tableId = payload.table.id;
  const outletId = payload.outlet.outletId;

  io.to(SOCKET_ROOMS.restaurant(restaurantId)).emit(SOCKET_EVENTS.ORDER_PAID_CONFIRMED, payload);
  io.to(SOCKET_ROOMS.kds(restaurantId)).emit(SOCKET_EVENTS.ORDER_PAID_CONFIRMED, payload);
  io.to(SOCKET_ROOMS.kdsOutlet(restaurantId, outletId)).emit(
    SOCKET_EVENTS.ORDER_PAID_CONFIRMED,
    payload
  );
  io.to(SOCKET_ROOMS.table(restaurantId, tableId)).emit(SOCKET_EVENTS.ORDER_PAID_CONFIRMED, payload);
  io.to(SOCKET_ROOMS.order(payload.id)).emit(SOCKET_EVENTS.ORDER_PAID_CONFIRMED, payload);
}

export function createApp() {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: config.allowedOrigins,
      credentials: true
    }
  });

  async function processPaymentConfirmation(rawBody, signature) {
    const signatureVerified = verifyWebhookSignature(rawBody, signature);
    const payload = JSON.parse(rawBody.toString("utf8"));

    const paymentEvent = await PaymentEvent.create({
      checkoutSessionId: payload.checkoutSessionId,
      provider: payload.provider,
      eventType: payload.eventType,
      signatureVerified,
      payload
    });

    if (!signatureVerified) {
      const error = new Error("Invalid payment webhook signature.");
      error.statusCode = 401;
      throw error;
    }

    const checkoutSession = await CheckoutSession.findById(payload.checkoutSessionId);
    if (!checkoutSession) {
      const error = new Error("Checkout session not found.");
      error.statusCode = 404;
      throw error;
    }

    if (
      checkoutSession.paymentProof.gatewayOrderId !== payload.gatewayOrderId ||
      checkoutSession.paymentProof.paymentReference !== payload.paymentReference ||
      roundMoney(checkoutSession.pricing.total) !== roundMoney(payload.amount)
    ) {
      const error = new Error("Payment verification failed.");
      error.statusCode = 400;
      throw error;
    }

    if (checkoutSession.orderId) {
      const existingOrder = await Order.findById(checkoutSession.orderId).lean();
      if (existingOrder) {
        return {
          paymentEvent,
          checkoutSession: await CheckoutSession.findById(checkoutSession._id).lean(),
          order: existingOrder
        };
      }
    }

    const existingOrder = await Order.findOne({ checkoutSessionId: checkoutSession._id }).lean();
    if (existingOrder) {
      await CheckoutSession.updateOne(
        { _id: checkoutSession._id },
        {
          $set: {
            orderId: existingOrder._id,
            lifecycleStatus: "ORDER_EMITTED_TO_KDS",
            "paymentProof.status": "confirmed",
            "paymentProof.gatewayTransactionId": payload.gatewayTransactionId,
            "paymentProof.paymentTimestamp": new Date(payload.paymentTimestamp),
            "paymentProof.signature": signature,
            "paymentProof.rawPayload": payload
          }
        }
      );

      return {
        paymentEvent,
        checkoutSession: await CheckoutSession.findById(checkoutSession._id).lean(),
        order: existingOrder
      };
    }

    const paymentProof = {
      ...checkoutSession.paymentProof.toObject(),
      status: "confirmed",
      gatewayTransactionId: payload.gatewayTransactionId,
      paymentTimestamp: new Date(payload.paymentTimestamp),
      receiptNumber: payload.receiptNumber,
      signature,
      rawPayload: payload
    };

    const order = await Order.create({
      orderNumber: createHumanReference("ORD"),
      checkoutSessionId: checkoutSession._id,
      restaurantId: checkoutSession.restaurantId,
      tableId: checkoutSession.tableId,
      outletId: checkoutSession.outletId,
      seatId: checkoutSession.seatId,
      restaurantSnapshot: checkoutSession.restaurantSnapshot,
      outletSnapshot: checkoutSession.outletSnapshot,
      tableSnapshot: checkoutSession.tableSnapshot,
      seatSnapshot: checkoutSession.seatSnapshot,
      guestDetails: checkoutSession.guestDetails,
      notes: checkoutSession.notes,
      items: checkoutSession.items,
      pricing: checkoutSession.pricing,
      paymentProof,
      fulfillmentStatus: "new",
      prepPriority: determinePrepPriority(checkoutSession.items, checkoutSession.notes),
      estimatedPrepTimeMinutes: checkoutSession.estimatedPrepTimeMinutes || 18,
      statusTimeline: [createStatusEvent("new", "Order created after payment confirmation")]
    });

    await CheckoutSession.updateOne(
      { _id: checkoutSession._id },
      {
        $set: {
          lifecycleStatus: "ORDER_CREATED",
          orderId: order._id,
          paymentProof
        },
        $push: {
          statusTimeline: {
            $each: [
              createStatusEvent("PAYMENT_CONFIRMED", "Webhook signature verified"),
              createStatusEvent("ORDER_CREATED", "Paid order persisted")
            ]
          }
        }
      }
    );

    const emittedAt = new Date();
    const emittedOrder = await Order.findByIdAndUpdate(
      order._id,
      { $set: { emittedToKdsAt: emittedAt } },
      { new: true }
    ).lean();

    await CheckoutSession.updateOne(
      { _id: checkoutSession._id },
      {
        $set: {
          lifecycleStatus: "ORDER_EMITTED_TO_KDS"
        },
        $push: {
          statusTimeline: createStatusEvent("ORDER_EMITTED_TO_KDS", "Realtime event sent to KDS")
        }
      }
    );

    await emitPaidOrder(io, emittedOrder);

    return {
      paymentEvent,
      checkoutSession: await CheckoutSession.findById(checkoutSession._id).lean(),
      order: emittedOrder
    };
  }

  app.use(helmet());
  app.use(
    cors({
      origin: config.allowedOrigins,
      credentials: true
    })
  );

  app.post(
    "/api/payments/webhooks/mock",
    express.raw({ type: "application/json" }),
    asyncHandler(async (req, res) => {
      const signature = req.headers["x-odine-signature"];
      const result = await processPaymentConfirmation(req.body, String(signature || ""));
      res.json({
        ok: true,
        eventId: String(result.paymentEvent._id),
        orderId: String(result.order._id)
      });
    })
  );

  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.post(
    "/api/auth/login",
    asyncHandler(async (req, res) => {
      const { email, password } = req.body;
      const user = await User.findOne({ email }).lean();
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials." });
      }

      const isValid = await verifyPassword(password, user.passwordHash);
      if (!isValid) {
        return res.status(401).json({ message: "Invalid credentials." });
      }

      const token = createToken(user);
      res.json({
        token,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          restaurantId: user.restaurantId
        }
      });
    })
  );

  app.post(
    "/api/auth/register",
    requireAuth,
    authorize(USER_ROLES.OWNER, USER_ROLES.MANAGER, USER_ROLES.SUPERADMIN),
    asyncHandler(async (req, res) => {
      const { name, email, password, role } = req.body;
      const restaurantId =
        req.user.role === USER_ROLES.SUPERADMIN
          ? req.body.restaurantId || null
          : req.user.restaurantId;

      const passwordHash = await hashPassword(password);
      const user = await User.create({
        name,
        email,
        passwordHash,
        role,
        restaurantId
      });

      res.status(201).json(user);
    })
  );

  app.get(
    "/api/auth/me",
    requireAuth,
    asyncHandler(async (req, res) => {
      const restaurant = req.user.restaurantId
        ? await Restaurant.findById(req.user.restaurantId).lean()
        : null;

      res.json({ user: req.user, restaurant });
    })
  );

  app.get(
    "/api/staff",
    requireAuth,
    authorize(USER_ROLES.OWNER, USER_ROLES.MANAGER, USER_ROLES.SUPERADMIN),
    asyncHandler(async (req, res) => {
      const staff = await User.find(applyRestaurantScope({}, req.user))
        .select("-passwordHash")
        .sort({ createdAt: -1 })
        .lean();
      res.json({ staff });
    })
  );

  app.get(
    "/api/restaurants/me",
    requireAuth,
    asyncHandler(async (req, res) => {
      if (!req.user.restaurantId) {
        return res.json({ restaurant: null });
      }
      const restaurant = await Restaurant.findById(req.user.restaurantId).lean();
      res.json({ restaurant });
    })
  );

  app.patch(
    "/api/restaurants/me",
    requireAuth,
    authorize(USER_ROLES.OWNER, USER_ROLES.MANAGER),
    asyncHandler(async (req, res) => {
      const restaurant = await Restaurant.findByIdAndUpdate(
        req.user.restaurantId,
        { $set: req.body },
        { new: true }
      ).lean();
      res.json({ restaurant });
    })
  );

  app.get(
    "/api/tables",
    requireAuth,
    asyncHandler(async (req, res) => {
      const tables = await Table.find(applyRestaurantScope({}, req.user))
        .sort({ tableNumber: 1 })
        .lean();
      res.json({ tables });
    })
  );

  app.post(
    "/api/tables",
    requireAuth,
    authorize(USER_ROLES.OWNER, USER_ROLES.MANAGER),
    asyncHandler(async (req, res) => {
      const restaurant = await Restaurant.findById(req.user.restaurantId).lean();
      const outlet = getOutletSnapshot(restaurant, {
        outletId: req.body.outletId || restaurant.outlets?.[0]?.outletId || "main",
        outletName: restaurant.outlets?.[0]?.name || "Main Dining Room"
      });
      const tableCode = slugify(req.body.code || `table-${req.body.tableNumber}`);
      const table = await Table.create({
        restaurantId: req.user.restaurantId,
        outletId: outlet.outletId,
        outletName: outlet.name,
        code: tableCode,
        tableNumber: String(req.body.tableNumber),
        label: req.body.label || `Table ${req.body.tableNumber}`,
        qrCodeUrl: "pending",
        seats: ensureArray(req.body.seats).map((seat, index) => ({
          seatId: seat.seatId || `seat-${index + 1}`,
          label: seat.label || `Seat ${index + 1}`
        }))
      });
      table.qrCodeUrl = await createQrCode(restaurant.slug, table.code);
      await table.save();
      res.status(201).json({ table });
    })
  );

  app.patch(
    "/api/tables/:id",
    requireAuth,
    authorize(USER_ROLES.OWNER, USER_ROLES.MANAGER),
    asyncHandler(async (req, res) => {
      const table = await Table.findOneAndUpdate(
        applyRestaurantScope({ _id: req.params.id }, req.user),
        { $set: req.body },
        { new: true }
      ).lean();
      res.json({ table });
    })
  );

  app.delete(
    "/api/tables/:id",
    requireAuth,
    authorize(USER_ROLES.OWNER, USER_ROLES.MANAGER),
    asyncHandler(async (req, res) => {
      await Table.deleteOne(applyRestaurantScope({ _id: req.params.id }, req.user));
      res.status(204).end();
    })
  );

  app.get(
    "/api/menu/categories",
    requireAuth,
    asyncHandler(async (req, res) => {
      const categories = await MenuCategory.find(applyRestaurantScope({}, req.user))
        .sort({ displayOrder: 1, name: 1 })
        .lean();
      res.json({ categories });
    })
  );

  app.post(
    "/api/menu/categories",
    requireAuth,
    authorize(USER_ROLES.OWNER, USER_ROLES.MANAGER),
    asyncHandler(async (req, res) => {
      const category = await MenuCategory.create({
        restaurantId: req.user.restaurantId,
        name: req.body.name,
        description: req.body.description || "",
        imageUrl: req.body.imageUrl || "",
        displayOrder: normalizeNumber(req.body.displayOrder),
        featured: Boolean(req.body.featured)
      });
      res.status(201).json({ category });
    })
  );

  app.get(
    "/api/menu/items",
    requireAuth,
    asyncHandler(async (req, res) => {
      const items = await MenuItem.find(applyRestaurantScope({}, req.user))
        .populate("categoryId", "name")
        .sort({ createdAt: -1 })
        .lean();
      res.json({ items });
    })
  );

  app.post(
    "/api/menu/items",
    requireAuth,
    authorize(USER_ROLES.OWNER, USER_ROLES.MANAGER),
    asyncHandler(async (req, res) => {
      const item = await MenuItem.create({
        restaurantId: req.user.restaurantId,
        categoryId: req.body.categoryId,
        name: req.body.name,
        description: req.body.description,
        price: normalizeNumber(req.body.price),
        isVeg: Boolean(req.body.isVeg),
        spiceLevel: req.body.spiceLevel || "mild",
        isAvailable: req.body.isAvailable !== false,
        imageUrl: req.body.imageUrl || "",
        ingredients: ensureArray(req.body.ingredients),
        bestseller: Boolean(req.body.bestseller),
        customizationGroups: ensureArray(req.body.customizationGroups)
      });
      res.status(201).json({ item });
    })
  );

  app.patch(
    "/api/menu/items/:id",
    requireAuth,
    authorize(USER_ROLES.OWNER, USER_ROLES.MANAGER),
    asyncHandler(async (req, res) => {
      const item = await MenuItem.findOneAndUpdate(
        applyRestaurantScope({ _id: req.params.id }, req.user),
        { $set: req.body },
        { new: true }
      ).lean();
      res.json({ item });
    })
  );

  app.get(
    "/api/orders",
    requireAuth,
    asyncHandler(async (req, res) => {
      const orders = await Order.find(applyRestaurantScope({}, req.user))
        .sort({ createdAt: -1 })
        .lean();
      res.json({ orders: orders.map(toOrderResponse) });
    })
  );

  app.patch(
    "/api/orders/:id/status",
    requireAuth,
    authorize(USER_ROLES.OWNER, USER_ROLES.MANAGER, USER_ROLES.CHEF),
    asyncHandler(async (req, res) => {
      const { status } = req.body;
      if (!ORDER_STATUSES.includes(status)) {
        return res.status(400).json({ message: "Invalid order status." });
      }

      const order = await Order.findOneAndUpdate(
        applyRestaurantScope({ _id: req.params.id }, req.user),
        {
          $set: { fulfillmentStatus: status },
          $push: {
            statusTimeline: createStatusEvent(status, `Status updated to ${status}`)
          }
        },
        { new: true }
      ).lean();

      if (!order) {
        return res.status(404).json({ message: "Order not found." });
      }

      const lifecycleStatus = mapOrderStatusToLifecycle(status);
      if (lifecycleStatus && CHECKOUT_SESSION_STATUSES.includes(lifecycleStatus)) {
        await CheckoutSession.updateOne(
          { _id: order.checkoutSessionId },
          {
            $set: { lifecycleStatus },
            $push: { statusTimeline: createStatusEvent(lifecycleStatus, `KDS moved order to ${status}`) }
          }
        );
      }

      const payload = toOrderResponse(order);
      io.to(SOCKET_ROOMS.restaurant(payload.restaurant.id)).emit(
        SOCKET_EVENTS.ORDER_STATUS_UPDATED,
        payload
      );
      io.to(SOCKET_ROOMS.kds(payload.restaurant.id)).emit(
        SOCKET_EVENTS.ORDER_STATUS_UPDATED,
        payload
      );
      io.to(SOCKET_ROOMS.kdsOutlet(payload.restaurant.id, payload.outlet.outletId)).emit(
        SOCKET_EVENTS.ORDER_STATUS_UPDATED,
        payload
      );
      io.to(SOCKET_ROOMS.order(payload.id)).emit(SOCKET_EVENTS.ORDER_STATUS_UPDATED, payload);
      res.json({ order: payload });
    })
  );

  const resolveSessionHandler = asyncHandler(async (req, res) => {
    const seatId = String(req.query.seat || "");
    const restaurant = await resolveRestaurantByRef(req.params.restaurantRef);
    if (!restaurant) {
      return res.status(404).json({ message: "Restaurant not found." });
    }

    const table = await resolveTableByRef(restaurant._id, req.params.tableRef);
    if (!table) {
      return res.status(404).json({ message: "Table not found." });
    }

    const seat = resolveSeat(table, seatId);
    if (seatId && !seat) {
      return res.status(404).json({ message: "Seat not found for this table." });
    }

    const [categories, items] = await Promise.all([
      MenuCategory.find({
        restaurantId: restaurant._id,
        isActive: true
      })
        .sort({ displayOrder: 1, name: 1 })
        .lean(),
      MenuItem.find({
        restaurantId: restaurant._id,
        isAvailable: true
      }).lean()
    ]);

    res.json(toSessionResponse({ restaurant, table, seat, categories, items }));
  });

  app.get("/api/public/session/:restaurantRef/:tableRef", resolveSessionHandler);
  app.get("/api/public/table/:restaurantRef/:tableRef", resolveSessionHandler);

  app.post(
    "/api/public/checkout-sessions",
    asyncHandler(async (req, res) => {
      const restaurantId = asId(req.body.restaurantId);
      const tableId = asId(req.body.tableId);
      const seatId = String(req.body.seatId || "");

      if (!restaurantId || !tableId) {
        return res.status(400).json({ message: "Invalid restaurant or table session." });
      }

      const [restaurant, table] = await Promise.all([
        Restaurant.findById(restaurantId).lean(),
        Table.findOne({ _id: tableId, restaurantId }).lean()
      ]);

      if (!restaurant || !table) {
        return res.status(404).json({ message: "Restaurant session could not be validated." });
      }

      const seat = resolveSeat(table, seatId);
      if (seatId && !seat) {
        return res.status(404).json({ message: "Seat validation failed." });
      }

      const paymentMode = String(req.body.paymentMode || "");
      const paymentMethods = restaurant.settings?.paymentMethods || [];
      if (!paymentMethods.some((method) => method.id === paymentMode)) {
        return res.status(400).json({ message: "Payment method is not supported." });
      }

      const requestedItems = ensureArray(req.body.items);
      if (requestedItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty." });
      }

      const menuIds = requestedItems.map((item) => asId(item.itemId)).filter(Boolean);
      const menuItems = await MenuItem.find({
        _id: { $in: menuIds },
        restaurantId
      }).lean();

      const lineItems = validateAndHydrateLineItems(requestedItems, menuItems);
      const pricing = calculatePricing(restaurant, lineItems);
      const guestDetails = {
        name: String(req.body.guestDetails?.name || "").trim() || "Guest",
        phone: String(req.body.guestDetails?.phone || "").trim()
      };
      const notes = String(req.body.notes || "").trim();
      const sessionReference = createHumanReference("CKS");
      const paymentRequest = createMockPaymentRequest({
        checkoutSessionId: sessionReference,
        amount: pricing.total,
        currency: pricing.currency,
        paymentMode,
        customer: guestDetails
      });
      const outlet = getOutletSnapshot(restaurant, table);

      const checkoutSession = await CheckoutSession.create({
        sessionReference,
        lifecycleStatus: "PAYMENT_PENDING",
        restaurantId,
        tableId,
        outletId: outlet.outletId,
        seatId,
        restaurantSnapshot: {
          id: String(restaurant._id),
          name: restaurant.name,
          slug: restaurant.slug
        },
        outletSnapshot: outlet,
        tableSnapshot: getTableSnapshot(table, seat),
        seatSnapshot: getSeatSnapshot(seat),
        guestDetails,
        notes,
        items: lineItems,
        pricing,
        estimatedPrepTimeMinutes: restaurant.settings?.estimatedPrepTimeMinutes || 18,
        paymentMode,
        paymentProof: {
          status: "pending",
          provider: paymentRequest.provider,
          paymentMode,
          gatewayOrderId: paymentRequest.gatewayOrderId,
          gatewayTransactionId: "",
          paymentReference: paymentRequest.paymentReference,
          amount: paymentRequest.amount,
          currency: paymentRequest.currency,
          paymentTimestamp: null,
          receiptNumber: paymentRequest.receiptNumber,
          signature: "",
          rawPayload: {}
        },
        statusTimeline: [
          createStatusEvent("SESSION_RESOLVED", "QR session validated"),
          createStatusEvent("CART_DRAFT", "Draft cart accepted"),
          createStatusEvent("PAYMENT_REQUEST_CREATED", "Payment request created"),
          createStatusEvent("PAYMENT_PENDING", "Awaiting webhook confirmation")
        ]
      });

      res.status(201).json({
        checkoutSession: {
          ...toCheckoutSessionResponse(checkoutSession),
          paymentAction: paymentRequest.action
        }
      });
    })
  );

  app.get(
    "/api/public/checkout-sessions/:id",
    asyncHandler(async (req, res) => {
      const checkoutSession = await CheckoutSession.findById(req.params.id).lean();
      if (!checkoutSession) {
        return res.status(404).json({ message: "Checkout session not found." });
      }

      const order = checkoutSession.orderId ? await Order.findById(checkoutSession.orderId).lean() : null;
      res.json({
        checkoutSession: toCheckoutSessionResponse(checkoutSession),
        order: order ? toOrderResponse(order) : null
      });
    })
  );

  app.post(
    "/api/public/payments/mock/complete",
    asyncHandler(async (req, res) => {
      const checkoutSession = await CheckoutSession.findById(req.body.checkoutSessionId);
      if (!checkoutSession) {
        return res.status(404).json({ message: "Checkout session not found." });
      }

      const eventPayload = buildMockWebhookEvent(checkoutSession);
      const rawBody = Buffer.from(JSON.stringify(eventPayload));
      const signature = signWebhookPayload(eventPayload);
      const result = await processPaymentConfirmation(rawBody, signature);

      res.json({
        checkoutSession: toCheckoutSessionResponse(result.checkoutSession),
        order: toOrderResponse(result.order)
      });
    })
  );

  app.get(
    "/api/public/orders/:id",
    asyncHandler(async (req, res) => {
      const order = await Order.findById(req.params.id).lean();
      if (!order) {
        return res.status(404).json({ message: "Order not found." });
      }
      res.json({ order: toOrderResponse(order) });
    })
  );

  app.post("/api/public/orders", (_req, res) => {
    res.status(410).json({
      message:
        "Direct public order creation is disabled. Create a checkout session and wait for payment confirmation."
    });
  });

  io.on("connection", (socket) => {
    socket.on("join", (payload = {}) => {
      if (payload.restaurantId) {
        socket.join(SOCKET_ROOMS.restaurant(payload.restaurantId));
      }
      if (payload.kind === "kds" && payload.restaurantId) {
        socket.join(SOCKET_ROOMS.kds(payload.restaurantId));
        if (payload.outletId) {
          socket.join(SOCKET_ROOMS.kdsOutlet(payload.restaurantId, payload.outletId));
        }
      }
      if (payload.tableId && payload.restaurantId) {
        socket.join(SOCKET_ROOMS.table(payload.restaurantId, payload.tableId));
      }
      if (payload.orderId) {
        socket.join(SOCKET_ROOMS.order(payload.orderId));
      }
    });
  });

  app.use((error, _req, res, _next) => {
    console.error(error);
    res.status(error.statusCode || 500).json({ message: error.message || "Server error." });
  });

  return { app, server };
}
