import mongoose from "mongoose";
import {
  CHECKOUT_SESSION_STATUSES,
  DEFAULT_RESTAURANT_SETTINGS,
  ORDER_FULFILLMENT_STATUSES,
  PAYMENT_STATUSES,
  USER_ROLES
} from "@odine/shared";

const outletSchema = new mongoose.Schema(
  {
    outletId: { type: String, required: true },
    name: { type: String, required: true },
    code: { type: String, required: true }
  },
  { _id: false }
);

const paymentMethodSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    helperText: { type: String, default: "" },
    type: { type: String, default: "digital" }
  },
  { _id: false }
);

const restaurantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    logoUrl: String,
    active: { type: Boolean, default: true },
    tagline: { type: String, default: "" },
    hook: { type: String, default: "" },
    description: { type: String, default: "" },
    heroImage: { type: String, default: "" },
    ambienceHighlights: [{ type: String }],
    address: { type: String, default: "" },
    outlets: {
      type: [outletSchema],
      default: [
        {
          outletId: "main",
          name: "Main Dining Room",
          code: "main"
        }
      ]
    },
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
      },
      estimatedPrepTimeMinutes: {
        type: Number,
        default: DEFAULT_RESTAURANT_SETTINGS.estimatedPrepTimeMinutes
      },
      paymentMethods: {
        type: [paymentMethodSchema],
        default: DEFAULT_RESTAURANT_SETTINGS.paymentMethods
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

const seatSchema = new mongoose.Schema(
  {
    seatId: { type: String, required: true },
    label: { type: String, required: true },
    qrCodeUrl: { type: String, default: "" }
  },
  { _id: false }
);

const tableSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true
    },
    outletId: { type: String, default: "main" },
    outletName: { type: String, default: "Main Dining Room" },
    code: { type: String, required: true },
    tableNumber: { type: String, required: true },
    label: { type: String, default: "" },
    qrCodeUrl: { type: String, required: true },
    seats: { type: [seatSchema], default: [] },
    status: {
      type: String,
      enum: ["empty", "occupied"],
      default: "empty"
    }
  },
  { timestamps: true }
);

tableSchema.index({ restaurantId: 1, code: 1 }, { unique: true });
tableSchema.index({ restaurantId: 1, tableNumber: 1 }, { unique: true });

const menuCategorySchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true
    },
    name: { type: String, required: true },
    description: { type: String, default: "" },
    imageUrl: { type: String, default: "" },
    displayOrder: { type: Number, default: 0 },
    featured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const menuOptionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    label: { type: String, required: true },
    priceDelta: { type: Number, default: 0 }
  },
  { _id: false }
);

const customizationGroupSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    selectionType: {
      type: String,
      enum: ["single", "multiple"],
      default: "single"
    },
    required: { type: Boolean, default: false },
    options: { type: [menuOptionSchema], default: [] }
  },
  { _id: false }
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
    spiceLevel: { type: String, default: "mild" },
    imageUrl: { type: String, default: "" },
    ingredients: [{ type: String }],
    bestseller: { type: Boolean, default: false },
    customizationGroups: { type: [customizationGroupSchema], default: [] }
  },
  { timestamps: true }
);

const selectedModifierSchema = new mongoose.Schema(
  {
    groupId: { type: String, required: true },
    groupLabel: { type: String, required: true },
    optionId: { type: String, required: true },
    name: { type: String, required: true },
    priceDelta: { type: Number, default: 0 }
  },
  { _id: false }
);

const orderLineSchema = new mongoose.Schema(
  {
    itemId: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "MenuCategory", required: true },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    lineTotal: { type: Number, required: true },
    modifiers: { type: [selectedModifierSchema], default: [] },
    specialInstructions: { type: String, default: "" }
  },
  { _id: false }
);

const pricingSnapshotSchema = new mongoose.Schema(
  {
    currency: { type: String, required: true },
    subtotal: { type: Number, required: true },
    taxRate: { type: Number, required: true },
    tax: { type: Number, required: true },
    serviceChargeRate: { type: Number, required: true },
    serviceCharge: { type: Number, required: true },
    total: { type: Number, required: true }
  },
  { _id: false }
);

const lifecycleEventSchema = new mongoose.Schema(
  {
    status: { type: String, required: true },
    at: { type: Date, default: Date.now },
    note: { type: String, default: "" }
  },
  { _id: false }
);

const paymentProofSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      enum: PAYMENT_STATUSES,
      default: "draft"
    },
    provider: { type: String, required: true },
    paymentMode: { type: String, required: true },
    gatewayOrderId: { type: String, required: true },
    gatewayTransactionId: { type: String, default: "" },
    paymentReference: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    paymentTimestamp: { type: Date, default: null },
    receiptNumber: { type: String, required: true },
    signature: { type: String, default: "" },
    rawPayload: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { _id: false }
);

const checkoutSessionSchema = new mongoose.Schema(
  {
    sessionReference: { type: String, required: true, unique: true },
    lifecycleStatus: {
      type: String,
      enum: CHECKOUT_SESSION_STATUSES,
      default: "SESSION_RESOLVED"
    },
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
    outletId: { type: String, required: true },
    seatId: { type: String, default: "" },
    restaurantSnapshot: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      slug: { type: String, required: true }
    },
    outletSnapshot: {
      outletId: { type: String, required: true },
      name: { type: String, required: true },
      code: { type: String, required: true }
    },
    tableSnapshot: {
      id: { type: String, required: true },
      code: { type: String, required: true },
      tableNumber: { type: String, required: true },
      label: { type: String, required: true }
    },
    seatSnapshot: {
      seatId: { type: String, default: "" },
      label: { type: String, default: "" }
    },
    guestDetails: {
      name: { type: String, required: true },
      phone: { type: String, default: "" }
    },
    notes: { type: String, default: "" },
    items: { type: [orderLineSchema], default: [] },
    pricing: { type: pricingSnapshotSchema, required: true },
    estimatedPrepTimeMinutes: { type: Number, default: 18 },
    paymentMode: { type: String, required: true },
    paymentProof: { type: paymentProofSchema, required: true },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      default: null
    },
    statusTimeline: { type: [lifecycleEventSchema], default: [] }
  },
  { timestamps: true }
);

checkoutSessionSchema.index({ restaurantId: 1, createdAt: -1 });

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    checkoutSessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CheckoutSession",
      required: true
    },
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
    outletId: { type: String, required: true },
    seatId: { type: String, default: "" },
    restaurantSnapshot: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      slug: { type: String, required: true }
    },
    outletSnapshot: {
      outletId: { type: String, required: true },
      name: { type: String, required: true },
      code: { type: String, required: true }
    },
    tableSnapshot: {
      id: { type: String, required: true },
      code: { type: String, required: true },
      tableNumber: { type: String, required: true },
      label: { type: String, required: true }
    },
    seatSnapshot: {
      seatId: { type: String, default: "" },
      label: { type: String, default: "" }
    },
    guestDetails: {
      name: { type: String, required: true },
      phone: { type: String, default: "" }
    },
    notes: { type: String, default: "" },
    items: { type: [orderLineSchema], default: [] },
    pricing: { type: pricingSnapshotSchema, required: true },
    paymentProof: { type: paymentProofSchema, required: true },
    fulfillmentStatus: {
      type: String,
      enum: ORDER_FULFILLMENT_STATUSES,
      default: "new"
    },
    prepPriority: { type: String, default: "normal" },
    estimatedPrepTimeMinutes: { type: Number, default: 18 },
    emittedToKdsAt: { type: Date, default: null },
    statusTimeline: { type: [lifecycleEventSchema], default: [] }
  },
  { timestamps: true }
);

orderSchema.index({ restaurantId: 1, createdAt: -1 });
orderSchema.index({ restaurantId: 1, fulfillmentStatus: 1, createdAt: -1 });
orderSchema.index({ checkoutSessionId: 1 }, { unique: true });

const paymentEventSchema = new mongoose.Schema(
  {
    checkoutSessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CheckoutSession",
      required: true
    },
    provider: { type: String, required: true },
    eventType: { type: String, required: true },
    signatureVerified: { type: Boolean, default: false },
    payload: { type: mongoose.Schema.Types.Mixed, default: {} },
    receivedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const Restaurant = mongoose.model("Restaurant", restaurantSchema);
export const User = mongoose.model("User", userSchema);
export const Table = mongoose.model("Table", tableSchema);
export const MenuCategory = mongoose.model("MenuCategory", menuCategorySchema);
export const MenuItem = mongoose.model("MenuItem", menuItemSchema);
export const CheckoutSession = mongoose.model("CheckoutSession", checkoutSessionSchema);
export const Order = mongoose.model("Order", orderSchema);
export const PaymentEvent = mongoose.model("PaymentEvent", paymentEventSchema);
