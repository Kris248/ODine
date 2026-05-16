export function buildCartItemKey(itemId, selectedCustomizations = []) {
  const signature = [...selectedCustomizations]
    .sort((left, right) => left.groupId.localeCompare(right.groupId))
    .map((group) => {
      const optionSignature = group.options
        .map((option) => option.id)
        .sort((left, right) => left.localeCompare(right))
        .join(",");

      return `${group.groupId}:${optionSignature}`;
    })
    .join("|");

  return `${itemId}::${signature || "standard"}`;
}

export function getDefaultSelectionState(customizationGroups = []) {
  return customizationGroups.reduce((state, group) => {
    if (group.selectionType === "single" && group.options.length > 0) {
      state[group.id] = group.required ? group.options[0].id : "";
      return state;
    }

    state[group.id] = [];
    return state;
  }, {});
}

export function resolveSelectedCustomizations(customizationGroups = [], selectionState = {}) {
  return customizationGroups
    .map((group) => {
      if (group.selectionType === "single") {
        const optionId = selectionState[group.id];
        const option = group.options.find((entry) => entry.id === optionId);

        return option
          ? {
              groupId: group.id,
              groupLabel: group.name,
              options: [option]
            }
          : null;
      }

      const optionIds = selectionState[group.id] || [];
      const options = group.options.filter((entry) => optionIds.includes(entry.id));

      return options.length > 0
        ? {
            groupId: group.id,
            groupLabel: group.name,
            options
          }
        : null;
    })
    .filter(Boolean);
}

export function calculateCustomizationDelta(selectedCustomizations = []) {
  return selectedCustomizations.reduce(
    (groupTotal, group) =>
      groupTotal +
      group.options.reduce((optionTotal, option) => optionTotal + (option.priceDelta || 0), 0),
    0
  );
}

export function createCartLine({
  item,
  quantity = 1,
  selectedCustomizations = [],
  specialInstructions = ""
}) {
  const customizationDelta = calculateCustomizationDelta(selectedCustomizations);
  const unitPrice = item.price + customizationDelta;

  return {
    key: buildCartItemKey(item.id, selectedCustomizations),
    itemId: item.id,
    name: item.name,
    description: item.description,
    image: item.image,
    dietaryType: item.dietaryType,
    basePrice: item.price,
    unitPrice,
    quantity,
    selectedCustomizations,
    specialInstructions: specialInstructions.trim()
  };
}

export function calculateOrderSummary(cartItems, pricing) {
  const subtotal = cartItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const taxRate = pricing?.taxRate || 0;
  const serviceFee = pricing?.serviceFee || 0;
  const taxes = Math.round(subtotal * taxRate);
  const total = subtotal + taxes + serviceFee;

  return {
    subtotal,
    taxRate,
    taxes,
    serviceFee,
    total
  };
}
