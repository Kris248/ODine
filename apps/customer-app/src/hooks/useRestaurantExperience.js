import { useEffect, useState } from "react";
import { getRestaurantExperience } from "../services/restaurantService.js";

const idleState = {
  loading: false,
  error: "",
  data: null
};

export function useRestaurantExperience(restaurantId, tableId, seatId = "", enabled = true) {
  const [state, setState] = useState(enabled ? { ...idleState, loading: true } : idleState);

  useEffect(() => {
    if (!enabled) {
      setState(idleState);
      return undefined;
    }

    let isActive = true;

    setState((current) => ({
      ...current,
      loading: true,
      error: ""
    }));

    getRestaurantExperience(restaurantId, tableId, seatId)
      .then((data) => {
        if (!isActive) {
          return;
        }

        setState({
          loading: false,
          error: "",
          data
        });
      })
      .catch((error) => {
        if (!isActive) {
          return;
        }

        setState({
          loading: false,
          error: error.message || "Unable to load your table right now.",
          data: null
        });
      });

    return () => {
      isActive = false;
    };
  }, [enabled, restaurantId, seatId, tableId]);

  return state;
}
