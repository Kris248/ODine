import { MenuItem } from "../models.js";

export async function seedMenuItems(restaurantId, categories) {
  return MenuItem.create([
    {
      restaurantId,
      categoryId: categories.find((category) => category.name === "Small Plates")._id,
      name: "Saffron Burrata Chaat",
      description: "Burrata, tamarind glaze, crushed papdi, and roasted mango pearls.",
      price: 385,
      isAvailable: true,
      isVeg: true,
      spiceLevel: "mild",
      imageUrl:
        "https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=800&q=80",
      ingredients: ["Burrata", "Papdi", "Tamarind", "Mango pearls"],
      bestseller: true,
      customizationGroups: [
        {
          id: "chaat-crunch",
          name: "Crunch level",
          selectionType: "single",
          required: true,
          options: [
            { id: "classic", label: "Classic crunch", priceDelta: 0 },
            { id: "extra", label: "Extra papdi", priceDelta: 20 }
          ]
        }
      ]
    },
    {
      restaurantId,
      categoryId: categories.find((category) => category.name === "Small Plates")._id,
      name: "Pepper Ghee Prawns",
      description: "Charred prawns with curry leaf ghee, garlic chips, and lime ash.",
      price: 465,
      isAvailable: true,
      isVeg: false,
      spiceLevel: "medium",
      imageUrl:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
      ingredients: ["Tiger prawns", "Curry leaf", "Garlic", "Lime ash"],
      bestseller: true
    },
    {
      restaurantId,
      categoryId: categories.find((category) => category.name === "Signatures")._id,
      name: "Tandoor Smoke Paneer",
      description: "Silken paneer skewers, saffron yogurt, and charred onion dust.",
      price: 445,
      isAvailable: true,
      isVeg: true,
      spiceLevel: "medium",
      imageUrl:
        "https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=800&q=80",
      ingredients: ["Paneer", "Saffron yogurt", "Charred onion"],
      customizationGroups: [
        {
          id: "heat-finish",
          name: "Spice finish",
          selectionType: "single",
          required: true,
          options: [
            { id: "balanced", label: "Balanced", priceDelta: 0 },
            { id: "bolder", label: "Bolder heat", priceDelta: 0 }
          ]
        },
        {
          id: "extras",
          name: "Add-ons",
          selectionType: "multiple",
          required: false,
          options: [
            { id: "mint-labneh", label: "Mint labneh", priceDelta: 35 },
            { id: "crispy-shallots", label: "Crispy shallots", priceDelta: 30 }
          ]
        }
      ]
    },
    {
      restaurantId,
      categoryId: categories.find((category) => category.name === "Mains")._id,
      name: "Coastal Tikka Bowl",
      description: "Coconut rice, market greens, tikka glaze, and citrus slaw.",
      price: 565,
      isAvailable: true,
      isVeg: false,
      spiceLevel: "medium",
      imageUrl:
        "https://images.unsplash.com/photo-1529699727121-188f0d8d6c0f?auto=format&fit=crop&w=800&q=80",
      ingredients: ["Coconut rice", "Greens", "Tikka glaze", "Slaw"],
      customizationGroups: [
        {
          id: "protein",
          name: "Choose your protein",
          selectionType: "single",
          required: true,
          options: [
            { id: "chicken", label: "Chicken tikka", priceDelta: 0 },
            { id: "paneer", label: "Paneer tikka", priceDelta: -20 },
            { id: "prawns", label: "Coastal prawns", priceDelta: 80 }
          ]
        }
      ]
    }
  ]);
}
