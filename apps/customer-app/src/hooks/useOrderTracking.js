import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { SOCKET_URL } from "../config/env.js";
import { fetchPublicOrder } from "../services/api/customerApi.js";

export function useOrderTracking(orderId) {
  const [state, setState] = useState({
    loading: true,
    error: "",
    order: null
  });

  useEffect(() => {
    let isActive = true;

    fetchPublicOrder(orderId)
      .then((payload) => {
        if (!isActive) {
          return;
        }
        setState({ loading: false, error: "", order: payload.order });
      })
      .catch((error) => {
        if (!isActive) {
          return;
        }
        setState({ loading: false, error: error.message, order: null });
      });

    return () => {
      isActive = false;
    };
  }, [orderId]);

  useEffect(() => {
    const socket = io(SOCKET_URL);
    socket.emit("join", { orderId });
    socket.on("order:status-updated", (updatedOrder) => {
      if (updatedOrder._id === orderId) {
        setState((current) => ({ ...current, order: updatedOrder }));
      }
    });
    return () => socket.disconnect();
  }, [orderId]);

  return state;
}
