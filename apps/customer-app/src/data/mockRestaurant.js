import { formatTableLabel } from "../utils/formatters.js";

function createIllustration(title, accentA, accentB, accentC) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 520">
      <defs>
        <linearGradient id="bg" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stop-color="${accentA}" />
          <stop offset="55%" stop-color="${accentB}" />
          <stop offset="100%" stop-color="${accentC}" />
        </linearGradient>
      </defs>
      <rect width="720" height="520" rx="42" fill="url(#bg)" />
      <circle cx="580" cy="118" r="128" fill="rgba(255,255,255,0.14)" />
      <circle cx="126" cy="426" r="152" fill="rgba(255,244,228,0.16)" />
      <path d="M118 352c68-82 132-119 214-119 82 0 134 18 274 96" fill="none" stroke="rgba(255,255,255,0.26)" stroke-width="16" stroke-linecap="round" />
      <rect x="74" y="78" width="196" height="44" rx="22" fill="rgba(250,242,230,0.18)" />
      <text x="98" y="107" font-size="22" fill="#fff6ef" font-family="Georgia, serif">Tableside Dining</text>
      <text x="74" y="258" font-size="58" fill="#fffaf4" font-family="Georgia, serif" font-weight="700">${title}</text>
    </svg>
  `;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const categoryImages = {
  smallPlates: createIllustration("Small Plates", "#755543", "#b8825f", "#d9b48a"),
  signatures: createIllustration("Signatures", "#3a2b24", "#815741", "#cc9565"),
  mains: createIllustration("Mains", "#47543e", "#7d8f6c", "#b3c29e"),
  sweets: createIllustration("Sweet Finish", "#7a4f51", "#c28882", "#e3c3ba"),
  sips: createIllustration("Crafted Sips", "#2e4344", "#587a78", "#a9cbc5")
};

const itemImages = {
  saffronBurrata: createIllustration("Burrata Chaat", "#6e4030", "#c78357", "#f0c8a1"),
  pepperPrawns: createIllustration("Pepper Prawns", "#2f2020", "#8b5550", "#c78a6a"),
  paneer: createIllustration("Paneer Skewers", "#4a5138", "#86936a", "#d1cf9e"),
  chicken: createIllustration("Chicken Salli", "#593529", "#a26949", "#d7b082"),
  truffleKulcha: createIllustration("Kulcha Tacos", "#4b3e33", "#8d6a52", "#d9bc8b"),
  tikkaBowl: createIllustration("Tikka Bowl", "#60493b", "#a37857", "#e1bd8b"),
  smokedCheesecake: createIllustration("Smoked Cheesecake", "#6d505f", "#af8399", "#edd6dd"),
  tonic: createIllustration("Citrus Tonic", "#284043", "#447072", "#b4d7cd"),
  coldBrew: createIllustration("Jaggery Cold Brew", "#2c2320", "#715246", "#bd9a82")
};

const baseExperience = {
  restaurant: {
    id: "saffron-cove",
    name: "Saffron Cove",
    tagline: "Elegant tableside ordering, designed for unhurried evenings.",
    hook: "Scan, settle in, and let the kitchen come to you.",
    description:
      "A coastal Indian dining room with smoky tandoor aromas, modern plating, and a calm candlelit pace.",
    heroImage: createIllustration("Saffron Cove", "#2a1d19", "#7c513b", "#d9a87a"),
    ambienceHighlights: ["Curated tasting plates", "Freshly fired tandoor", "Quiet fine-casual dining"],
    estimatedPrepTime: "18-22 min",
    rating: "4.8",
    address: "Riverside Arcade, Pune"
  },
  pricing: {
    currency: "INR",
    taxRate: 0.05,
    serviceFee: 49
  },
  categories: [
    {
      id: "small-plates",
      name: "Small Plates",
      description: "Bright openings and shareable textures.",
      image: categoryImages.smallPlates,
      featured: true
    },
    {
      id: "signatures",
      name: "Signatures",
      description: "House favourites with depth and drama.",
      image: categoryImages.signatures,
      featured: true
    },
    {
      id: "mains",
      name: "Mains",
      description: "Generous plates built for comfort.",
      image: categoryImages.mains,
      featured: true
    },
    {
      id: "sweets",
      name: "Sweet Finish",
      description: "Soft landings and warm spice.",
      image: categoryImages.sweets,
      featured: false
    },
    {
      id: "sips",
      name: "Crafted Sips",
      description: "Low-fuss pours to keep things easy.",
      image: categoryImages.sips,
      featured: false
    }
  ],
  paymentMethods: [
    {
      id: "upi",
      label: "UPI",
      helperText: "Fastest for tableside checkout.",
      type: "instant"
    },
    {
      id: "card",
      label: "Card",
      helperText: "All major debit and credit cards.",
      type: "digital"
    },
    {
      id: "wallet",
      label: "Wallet",
      helperText: "Paytm, PhonePe, Amazon Pay and more.",
      type: "digital"
    },
    {
      id: "netbanking",
      label: "Net banking",
      helperText: "Secure bank transfer experience.",
      type: "bank"
    },
    {
      id: "cashless",
      label: "Tap to pay",
      helperText: "Placeholder for NFC or restaurant POS handoff.",
      type: "card"
    }
  ],
  menuItems: [
    {
      id: "saffron-burrata-chaat",
      categoryId: "small-plates",
      name: "Saffron Burrata Chaat",
      price: 385,
      image: itemImages.saffronBurrata,
      description: "Burrata, tamarind glaze, crushed papdi, and roasted mango pearls.",
      ingredients: ["Burrata", "Papdi", "Tamarind", "Mango pearls"],
      spiceLevel: "mild",
      dietaryType: "veg",
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
      id: "pepper-ghee-prawns",
      categoryId: "small-plates",
      name: "Pepper Ghee Prawns",
      price: 465,
      image: itemImages.pepperPrawns,
      description: "Charred prawns with curry leaf ghee, garlic chips, and lime ash.",
      ingredients: ["Tiger prawns", "Curry leaf", "Garlic", "Lime ash"],
      spiceLevel: "medium",
      dietaryType: "non-veg",
      bestseller: true
    },
    {
      id: "tandoor-smoke-paneer",
      categoryId: "signatures",
      name: "Tandoor Smoke Paneer",
      price: 445,
      image: itemImages.paneer,
      description: "Silken paneer skewers, saffron yogurt, and charred onion dust.",
      ingredients: ["Paneer", "Saffron yogurt", "Charred onion"],
      spiceLevel: "medium",
      dietaryType: "veg",
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
      id: "chicken-salli-kebab",
      categoryId: "signatures",
      name: "Chicken Salli Kebab",
      price: 495,
      image: itemImages.chicken,
      description: "Tender chicken with potato salli, green chilli glaze, and smoked yogurt.",
      ingredients: ["Chicken thigh", "Potato salli", "Green chilli"],
      spiceLevel: "hot",
      dietaryType: "non-veg"
    },
    {
      id: "truffle-kulcha-tacos",
      categoryId: "mains",
      name: "Truffle Kulcha Tacos",
      price: 525,
      image: itemImages.truffleKulcha,
      description: "Mini kulchas filled with mushroom keema, truffle cream, and pickled onion.",
      ingredients: ["Kulcha", "Mushroom keema", "Truffle cream"],
      spiceLevel: "mild",
      dietaryType: "veg",
      customizationGroups: [
        {
          id: "serving-size",
          name: "Serving size",
          selectionType: "single",
          required: true,
          options: [
            { id: "two", label: "2 pieces", priceDelta: 0 },
            { id: "three", label: "3 pieces", priceDelta: 110 }
          ]
        }
      ]
    },
    {
      id: "coastal-tikka-bowl",
      categoryId: "mains",
      name: "Coastal Tikka Bowl",
      price: 565,
      image: itemImages.tikkaBowl,
      description: "Coconut rice, market greens, tikka glaze, and a citrus slaw.",
      ingredients: ["Coconut rice", "Greens", "Tikka glaze", "Slaw"],
      spiceLevel: "medium",
      dietaryType: "non-veg",
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
    },
    {
      id: "smoked-mishti-cheesecake",
      categoryId: "sweets",
      name: "Smoked Mishti Cheesecake",
      price: 345,
      image: itemImages.smokedCheesecake,
      description: "Baked yogurt cheesecake with jaggery caramel and sea salt praline.",
      ingredients: ["Hung curd", "Jaggery caramel", "Sea salt praline"],
      spiceLevel: "mild",
      dietaryType: "veg"
    },
    {
      id: "citrus-saffron-tonic",
      categoryId: "sips",
      name: "Citrus Saffron Tonic",
      price: 235,
      image: itemImages.tonic,
      description: "Bubbly house tonic with gondhoraj lime and saffron mist.",
      ingredients: ["House tonic", "Gondhoraj", "Saffron"],
      spiceLevel: "mild",
      dietaryType: "veg"
    },
    {
      id: "jaggery-cold-brew",
      categoryId: "sips",
      name: "Jaggery Cold Brew",
      price: 215,
      image: itemImages.coldBrew,
      description: "Slow-steeped cold brew with toasted jaggery and orange peel.",
      ingredients: ["Cold brew", "Jaggery", "Orange peel"],
      spiceLevel: "mild",
      dietaryType: "veg"
    }
  ]
};

export function getMockRestaurantExperience(restaurantId, tableId, seatId = "") {
  const seatLabel = seatId ? formatTableLabel(seatId) : "";

  return {
    ...baseExperience,
    session: {
      restaurantId: restaurantId || baseExperience.restaurant.id,
      tableId,
      outletId: "main",
      seatId,
      roomTargets: {
        restaurant: `restaurant:${restaurantId || baseExperience.restaurant.id}`,
        kds: `kds:${restaurantId || baseExperience.restaurant.id}`,
        table: `table:${restaurantId || baseExperience.restaurant.id}:${tableId}`
      }
    },
    restaurant: {
      ...baseExperience.restaurant,
      id: restaurantId || baseExperience.restaurant.id
    },
    table: {
      id: tableId,
      label: seatLabel
        ? `${formatTableLabel(tableId) || "Table 12"} / ${seatLabel}`
        : formatTableLabel(tableId) || "Table 12",
      baseLabel: formatTableLabel(tableId) || "Table 12",
      seat: seatId
        ? {
            seatId,
            label: seatLabel
          }
        : null
    }
  };
}
