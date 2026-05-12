import { useEffect, useState } from "react";
import { mapExperiencePayload } from "../models/menu.js";
import { fetchTableExperience } from "../services/api/customerApi.js";

export function useRestaurantExperience(restaurantId, tableId) {
  const [state, setState] = useState({
    loading: true,
    error: "",
    data: null
  });

  useEffect(() => {
    let isActive = true;

    fetchTableExperience(restaurantId, tableId)
      .then((payload) => {
        if (!isActive) {
          return;
        }
        setState({
          loading: false,
          error: "",
          data: mapExperiencePayload(payload)
        });
      })
      .catch((error) => {
        if (!isActive) {
          return;
        }
        setState({
          loading: false,
          error: error.message,
          data: null
        });
      });

    return () => {
      isActive = false;
    };
  }, [restaurantId, tableId]);

  return state;
}
