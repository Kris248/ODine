const spiceLabels = {
  mild: "Mild warmth",
  medium: "Balanced spice",
  hot: "Bold heat"
};

export function formatCurrency(value, currency = "INR", locale = "en-IN") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 0
  }).format(value);
}

export function formatSpiceLabel(spiceLevel) {
  return spiceLabels[spiceLevel] || "Chef's blend";
}

export function formatDietaryLabel(dietaryType) {
  if (dietaryType === "veg") {
    return "Veg";
  }
  if (dietaryType === "non-veg") {
    return "Non-veg";
  }
  return "Chef special";
}

export function formatTableLabel(tableId) {
  return String(tableId || "")
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatTimeStamp(value) {
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}
