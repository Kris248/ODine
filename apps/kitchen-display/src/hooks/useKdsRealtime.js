import { useEffect } from "react";
import { io } from "socket.io-client";
import { SOCKET_EVENTS } from "../constants/socketEvents.js";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export function useKdsRealtime({ session, onPaidConfirmed, onStatusUpdated }) {
  useEffect(() => {
    if (!session?.user?.restaurantId) return undefined;

    const socket = io(SOCKET_URL, {
      transports: ["websocket", "polling"]
    });

    socket.emit("join", {
      restaurantId: session.user.restaurantId,
      outletId: "main",
      kind: "kds"
    });

    socket.on(SOCKET_EVENTS.ORDER_PAID_CONFIRMED, onPaidConfirmed);
    socket.on(SOCKET_EVENTS.ORDER_STATUS_UPDATED, onStatusUpdated);

    return () => {
      socket.off(SOCKET_EVENTS.ORDER_PAID_CONFIRMED, onPaidConfirmed);
      socket.off(SOCKET_EVENTS.ORDER_STATUS_UPDATED, onStatusUpdated);
      socket.disconnect();
    };
  }, [onPaidConfirmed, onStatusUpdated, session]);
}
