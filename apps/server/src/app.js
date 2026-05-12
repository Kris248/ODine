import cors from "cors";
import express from "express";
import helmet from "helmet";
import { Server } from "socket.io";
import http from "http";
import mongoose from "mongoose";
import { ORDER_STATUSES, USER_ROLES } from "@odine/shared";
import { config } from "./config.js";
import { authorize, createToken, hashPassword, requireAuth, verifyPassword } from "./auth.js";
import { MenuCategory, MenuItem, Order, Restaurant, Table, User } from "./models.js";
import { applyRestaurantScope, createQrCode, normalizeNumber } from "./utils.js";

export function createApp() {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: config.allowedOrigins,
      credentials: true
    }
  });

  app.use(helmet());
  app.use(
    cors({
      origin: config.allowedOrigins,
      credentials: true
    })
  );
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true });
  });

  app.post("/api/auth/login", async (req, res) => {
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
  });

  app.post(
    "/api/auth/register",
    requireAuth,
    authorize(USER_ROLES.OWNER, USER_ROLES.MANAGER, USER_ROLES.SUPERADMIN),
    async (req, res) => {
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
    }
  );

  app.get("/api/auth/me", requireAuth, async (req, res) => {
    const restaurant = req.user.restaurantId
      ? await Restaurant.findById(req.user.restaurantId).lean()
      : null;

    res.json({ user: req.user, restaurant });
  });

  app.get(
    "/api/staff",
    requireAuth,
    authorize(USER_ROLES.OWNER, USER_ROLES.MANAGER, USER_ROLES.SUPERADMIN),
    async (req, res) => {
      const staff = await User.find(applyRestaurantScope({}, req.user))
        .select("-passwordHash")
        .sort({ createdAt: -1 })
        .lean();
      res.json({ staff });
    }
  );

  app.get("/api/restaurants/me", requireAuth, async (req, res) => {
    if (!req.user.restaurantId) {
      return res.json({ restaurant: null });
    }
    const restaurant = await Restaurant.findById(req.user.restaurantId).lean();
    res.json({ restaurant });
  });

  app.patch(
    "/api/restaurants/me",
    requireAuth,
    authorize(USER_ROLES.OWNER, USER_ROLES.MANAGER),
    async (req, res) => {
      const restaurant = await Restaurant.findByIdAndUpdate(
        req.user.restaurantId,
        { $set: req.body },
        { new: true }
      ).lean();
      res.json({ restaurant });
    }
  );

  app.get("/api/tables", requireAuth, async (req, res) => {
    const tables = await Table.find(applyRestaurantScope({}, req.user))
      .sort({ tableNumber: 1 })
      .lean();
    res.json({ tables });
  });

  app.post(
    "/api/tables",
    requireAuth,
    authorize(USER_ROLES.OWNER, USER_ROLES.MANAGER),
    async (req, res) => {
      const table = await Table.create({
        restaurantId: req.user.restaurantId,
        tableNumber: req.body.tableNumber,
        qrCodeUrl: "placeholder"
      });
      const qrCodeUrl = await createQrCode(req.user.restaurantId, table._id);
      table.qrCodeUrl = qrCodeUrl;
      await table.save();
      res.status(201).json({ table });
    }
  );

  app.patch(
    "/api/tables/:id",
    requireAuth,
    authorize(USER_ROLES.OWNER, USER_ROLES.MANAGER),
    async (req, res) => {
      const table = await Table.findOneAndUpdate(
        applyRestaurantScope({ _id: req.params.id }, req.user),
        { $set: req.body },
        { new: true }
      ).lean();
      res.json({ table });
    }
  );

  app.delete(
    "/api/tables/:id",
    requireAuth,
    authorize(USER_ROLES.OWNER, USER_ROLES.MANAGER),
    async (req, res) => {
      await Table.deleteOne(applyRestaurantScope({ _id: req.params.id }, req.user));
      res.status(204).end();
    }
  );

  app.get("/api/menu/categories", requireAuth, async (req, res) => {
    const categories = await MenuCategory.find(applyRestaurantScope({}, req.user))
      .sort({ displayOrder: 1, name: 1 })
      .lean();
    res.json({ categories });
  });

  app.post(
    "/api/menu/categories",
    requireAuth,
    authorize(USER_ROLES.OWNER, USER_ROLES.MANAGER),
    async (req, res) => {
      const category = await MenuCategory.create({
        restaurantId: req.user.restaurantId,
        name: req.body.name,
        displayOrder: normalizeNumber(req.body.displayOrder)
      });
      res.status(201).json({ category });
    }
  );

  app.get("/api/menu/items", requireAuth, async (req, res) => {
    const items = await MenuItem.find(applyRestaurantScope({}, req.user))
      .populate("categoryId", "name")
      .sort({ createdAt: -1 })
      .lean();
    res.json({ items });
  });

  app.post(
    "/api/menu/items",
    requireAuth,
    authorize(USER_ROLES.OWNER, USER_ROLES.MANAGER),
    async (req, res) => {
      const item = await MenuItem.create({
        restaurantId: req.user.restaurantId,
        categoryId: req.body.categoryId,
        name: req.body.name,
        description: req.body.description,
        price: normalizeNumber(req.body.price),
        isVeg: Boolean(req.body.isVeg),
        spiceLevel: normalizeNumber(req.body.spiceLevel),
        isAvailable: req.body.isAvailable !== false
      });
      res.status(201).json({ item });
    }
  );

  app.patch(
    "/api/menu/items/:id",
    requireAuth,
    authorize(USER_ROLES.OWNER, USER_ROLES.MANAGER),
    async (req, res) => {
      const item = await MenuItem.findOneAndUpdate(
        applyRestaurantScope({ _id: req.params.id }, req.user),
        { $set: req.body },
        { new: true }
      ).lean();
      res.json({ item });
    }
  );

  app.get("/api/orders", requireAuth, async (req, res) => {
    const orders = await Order.find(applyRestaurantScope({}, req.user))
      .populate("tableId", "tableNumber")
      .sort({ createdAt: -1 })
      .lean();
    res.json({ orders });
  });

  app.patch(
    "/api/orders/:id/status",
    requireAuth,
    authorize(USER_ROLES.OWNER, USER_ROLES.MANAGER, USER_ROLES.CHEF),
    async (req, res) => {
      const { status } = req.body;
      if (!ORDER_STATUSES.includes(status)) {
        return res.status(400).json({ message: "Invalid order status." });
      }

      const order = await Order.findOneAndUpdate(
        applyRestaurantScope({ _id: req.params.id }, req.user),
        { $set: { status } },
        { new: true }
      )
        .populate("tableId", "tableNumber")
        .lean();

      if (!order) {
        return res.status(404).json({ message: "Order not found." });
      }

      io.to(`restaurant:${order.restaurantId}:admin`).emit("order:status-updated", order);
      io.to(`restaurant:${order.restaurantId}:kitchen`).emit("order:status-updated", order);
      io.to(`order:${order._id}`).emit("order:status-updated", order);
      res.json({ order });
    }
  );

  app.get("/api/public/table/:restaurantId/:tableId", async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.restaurantId)) {
      return res.status(400).json({ message: "Invalid restaurant id." });
    }

    const tableQuery = {
      restaurantId: req.params.restaurantId,
      ...(mongoose.Types.ObjectId.isValid(req.params.tableId)
        ? { _id: req.params.tableId }
        : { tableNumber: req.params.tableId })
    };

    const [restaurant, table, categories, items] = await Promise.all([
      Restaurant.findById(req.params.restaurantId).lean(),
      Table.findOne(tableQuery).lean(),
      MenuCategory.find({
        restaurantId: req.params.restaurantId,
        isActive: true
      })
        .sort({ displayOrder: 1, name: 1 })
        .lean(),
      MenuItem.find({
        restaurantId: req.params.restaurantId,
        isAvailable: true
      }).lean()
    ]);

    if (!restaurant || !table) {
      return res.status(404).json({ message: "Table not found." });
    }

    res.json({ restaurant, table, categories, items });
  });

  app.post("/api/public/orders", async (req, res) => {
    const { tableId, restaurantId, guestName, guestPhone, notes, items } = req.body;
    const table = await Table.findOne({ _id: tableId, restaurantId }).lean();
    const restaurant = await Restaurant.findById(restaurantId).lean();
    if (!table || !restaurant) {
      return res.status(404).json({ message: "Invalid table." });
    }

    const menuItems = await MenuItem.find({
      _id: { $in: items.map((item) => item.itemId) },
      restaurantId
    }).lean();
    const menuMap = new Map(menuItems.map((item) => [String(item._id), item]));

    const normalizedItems = items.map((item) => {
      const menuItem = menuMap.get(String(item.itemId));
      return {
        itemId: menuItem._id,
        name: menuItem.name,
        quantity: normalizeNumber(item.quantity, 1),
        unitPrice: menuItem.price,
        modifiers: item.modifiers || [],
        specialInstructions: item.specialInstructions || ""
      };
    });

    const subtotal = normalizedItems.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0
    );
    const tax = subtotal * ((restaurant.settings?.taxRate || 0) / 100);
    const total = subtotal + tax;

    const order = await Order.create({
      restaurantId,
      tableId,
      guestName,
      guestPhone,
      notes,
      items: normalizedItems,
      subtotal,
      tax,
      total,
      status: "received"
    });

    const populatedOrder = await Order.findById(order._id)
      .populate("tableId", "tableNumber")
      .lean();

    io.to(`restaurant:${restaurantId}:admin`).emit("order:new", populatedOrder);
    io.to(`restaurant:${restaurantId}:kitchen`).emit("order:new", populatedOrder);
    res.status(201).json({ order: populatedOrder });
  });

  app.get("/api/public/orders/:id", async (req, res) => {
    const order = await Order.findById(req.params.id)
      .populate("tableId", "tableNumber")
      .lean();
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }
    res.json({ order });
  });

  io.on("connection", (socket) => {
    socket.on("join", (payload) => {
      if (payload.restaurantId && payload.kind) {
        socket.join(`restaurant:${payload.restaurantId}:${payload.kind}`);
      }
      if (payload.orderId) {
        socket.join(`order:${payload.orderId}`);
      }
    });
  });

  app.use((error, _req, res, _next) => {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  });

  return { app, server };
}
