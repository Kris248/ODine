import mongoose from "mongoose";
import { DEFAULT_RESTAURANT_SETTINGS, ORDER_STATUSES, USER_ROLES } from "@odine/shared";

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    logoUrl: String,
    active: { type: Boolean, default: true },
    settings: {
      currency: { type: String, default: DEFAULT_RESTAURANT_SETTINGS.currency },
      taxRate: { type: Number, default: DEFAULT_RESTAURANT_SETTINGS.taxRate },
      serviceChargeRate: {
        type: Number,
        default: DEFAULT_RESTAURANT_SETTINGS.serviceChargeRate
      },
      brandColor: {
        type: String,
        default: DEFAULT_RESTAURANT_SETTINGS.brandColor
      }
    }
  },
  { timestamps: true }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      required: true
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      default: null
    }
  },
  { timestamps: true }
);

const tableSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true
    },
    tableNumber: { type: String, required: true },
    qrCodeUrl: { type: String, required: true },
    status: {
      type: String,
      enum: ["empty", "occupied"],
      default: "empty"
    }
  },
  { timestamps: true }
);

tableSchema.index({ restaurantId: 1, tableNumber: 1 }, { unique: true });

const menuCategorySchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true
    },
    name: { type: String, required: true },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const menuItemSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuCategory",
      required: true
    },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    price: { type: Number, required: true },
    isAvailable: { type: Boolean, default: true },
    isVeg: { type: Boolean, default: false },
    spiceLevel: { type: Number, default: 0 },
    imageUrl: String,
    modifiers: [{ name: String, price: Number }]
  },
  { timestamps: true }
);

const orderItemSchema = new mongoose.Schema(
  {
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    modifiers: [{ name: String, price: Number }],
    specialInstructions: { type: String, default: "" }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true
    },
    tableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Table",
      required: true
    },
    guestName: { type: String, required: true },
    guestPhone: String,
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    tax: { type: Number, required: true },
    total: { type: Number, required: true },
    status: { type: String, enum: ORDER_STATUSES, default: "received" },
    notes: { type: String, default: "" }
  },
  { timestamps: true }
);

export const Restaurant = mongoose.model("Restaurant", restaurantSchema);
export const User = mongoose.model("User", userSchema);
export const Table = mongoose.model("Table", tableSchema);
export const MenuCategory = mongoose.model("MenuCategory", menuCategorySchema);
export const MenuItem = mongoose.model("MenuItem", menuItemSchema);
export const Order = mongoose.model("Order", orderSchema);
