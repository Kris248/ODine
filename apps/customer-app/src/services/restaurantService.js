import { USE_MOCK_DATA } from "../config/env.js";
import { getMockRestaurantExperience } from "../data/mockRestaurant.js";
import { resolveQrSessionApi } from "./api/customerApi.js";

function sleep(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

export async function getRestaurantExperience(restaurantId, tableId, seatId = "") {
  if (USE_MOCK_DATA) {
    await sleep(650);
    return getMockRestaurantExperience(restaurantId, tableId, seatId);
  }

  return resolveQrSessionApi(restaurantId, tableId, seatId);
}
