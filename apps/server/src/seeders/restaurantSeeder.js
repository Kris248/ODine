import { Restaurant } from "../models.js";

export async function seedRestaurant() {
  return Restaurant.create({
    name: "Saffron Cove",
    slug: "saffron-cove",
    logoUrl:
      "https://images.unsplash.com/photo-1529042410759-befb1204b468?auto=format&fit=crop&w=500&q=80",
    heroImage:
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    tagline: "Elegant tableside ordering for unhurried evenings.",
    hook: "Scan, settle in, and send only paid orders to the kitchen.",
    description:
      "A coastal Indian dining room with premium QR ordering, live KDS sync, and payment-first dispatching.",
    address: "Riverside Arcade, Pune",
    ambienceHighlights: ["Curated tasting plates", "Freshly fired tandoor", "Quiet fine-casual dining"],
    outlets: [
      {
        outletId: "main",
        name: "Main Dining Room",
        code: "main"
      }
    ],
    settings: {
      currency: "INR",
      taxRate: 5,
      serviceChargeRate: 0,
      brandColor: "#9b5b3d",
      estimatedPrepTimeMinutes: 18,
      paymentMethods: [
        {
          id: "upi",
          label: "UPI",
          helperText: "Recommended for the fastest mobile checkout.",
          type: "instant"
        },
        {
          id: "card",
          label: "Card",
          helperText: "All major debit and credit cards.",
          type: "digital"
        }
      ]
    }
  });
}
