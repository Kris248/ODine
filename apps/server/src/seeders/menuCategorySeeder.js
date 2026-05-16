import { MenuCategory } from "../models.js";

export async function seedMenuCategories(restaurantId) {
  return MenuCategory.create([
    {
      restaurantId,
      name: "Small Plates",
      description: "Bright openings and shareable textures.",
      imageUrl:
        "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
      displayOrder: 1,
      featured: true
    },
    {
      restaurantId,
      name: "Signatures",
      description: "House favourites with depth and drama.",
      imageUrl:
        "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80",
      displayOrder: 2,
      featured: true
    },
    {
      restaurantId,
      name: "Mains",
      description: "Generous plates built for comfort.",
      imageUrl:
        "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80",
      displayOrder: 3,
      featured: true
    }
  ]);
}
