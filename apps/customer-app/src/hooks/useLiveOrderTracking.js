import { useEffect, useMemo, useRef, useState } from "react";
import { io } from "socket.io-client";
import { API_URL, USE_MOCK_DATA } from "../config/env.js";
import { fetchConfirmedOrder } from "../services/orderService.js";
import {
  buildOrderStatusTimeline,
  getNextOrderStatus,
  normalizeOrderStatus,
  ORDER_STATUS_META
} from "../constants/orderStatuses.js";

const baseSocketUrl = API_URL.replace(/\/api\/?$/, "");

function getSocketTransportOptions() {
  return {
    transports: ["websocket", "polling"],
    reconnection: true,
    reconnectionAttempts: 5,
    timeout: 8000
  };
}

function normalizeOrder(payload) {
  if (!payload) return null;

  const fulfillmentStatus = normalizeOrderStatus(payload.fulfillmentStatus || payload.status);
  const statusTimeline = Array.isArray(payload.statusTimeline) && payload.statusTimeline.length
    ? payload.statusTimeline
    : buildOrderStatusTimeline(payload);

  return {
    ...payload,
    fulfillmentStatus,
    statusTimeline,
    liveStatusUpdatedAt: payload.liveStatusUpdatedAt || payload.updatedAt || payload.createdAt || new Date().toISOString()
  };
}

export function useLiveOrderTracking(orderId, { initialOrder = null, enabled = true } = {}) {
  const [order, setOrder] = useState(() => normalizeOrder(initialOrder));
  const [loading, setLoading] = useState(Boolean(orderId && enabled && !initialOrder));
  const [error, setError] = useState("");
  const [source, setSource] = useState(initialOrder ? "local" : "network");
  const socketRef = useRef(null);
  const pollRef = useRef(null);
  const broadcastRef = useRef(null);

  const timeline = useMemo(() => buildOrderStatusTimeline(order), [order]);
  const status = order?.fulfillmentStatus || "pending";
  const nextStatus = getNextOrderStatus(status);
  const statusMeta = ORDER_STATUS_META[status] || ORDER_STATUS_META.pending;

  useEffect(() => {
    if (!enabled || !orderId) {
      setLoading(false);
      return undefined;
    }

    let active = true;

    async function loadLatest() {
      try {
        const response = await fetchConfirmedOrder(orderId);
        if (!active || !response?.order) {
          return;
        }
        setOrder(normalizeOrder(response.order));
        setError("");
        setSource("poll");
      } catch (err) {
        if (!active) return;
        setError(err?.message || "Unable to refresh live order status.");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadLatest();

    pollRef.current = window.setInterval(loadLatest, USE_MOCK_DATA ? 2500 : 4500);

    try {
      const socket = io(baseSocketUrl, getSocketTransportOptions());
      socketRef.current = socket;

      socket.on("connect", () => {
        socket.emit("customer:join", { orderId });
        socket.emit("join:order", { orderId });
      });

      const handleIncoming = (payload) => {
        const incomingOrder = payload?.order || payload;
        if (!incomingOrder) return;

        const incomingOrderId = incomingOrder.id || incomingOrder.orderId || incomingOrder.order?.id;
        if (incomingOrderId && String(incomingOrderId) !== String(orderId)) {
          return;
        }

        setOrder((current) =>
          normalizeOrder({
            ...(current || {}),
            ...incomingOrder,
            fulfillmentStatus: incomingOrder.fulfillmentStatus || incomingOrder.status || current?.fulfillmentStatus
          })
        );
        setError("");
        setSource("socket");
      };

      ["order:updated", "order:update", "kitchen:order:update", "kitchen:order:updated", "table:order:update"].forEach((eventName) => {
        socket.on(eventName, handleIncoming);
      });

      socket.on("connect_error", () => {
        setSource((current) => (current === "socket" ? "poll" : current));
      });
    } catch {
      // Socket is optional; polling keeps the UI live.
    }

    if ("BroadcastChannel" in window) {
      broadcastRef.current = new BroadcastChannel("odine.orders");
      broadcastRef.current.onmessage = (event) => {
        const incomingOrder = event.data?.order || event.data;
        if (!incomingOrder) return;
        const incomingOrderId = incomingOrder.id || incomingOrder.orderId;
        if (incomingOrderId && String(incomingOrderId) !== String(orderId)) {
          return;
        }

        setOrder((current) =>
          normalizeOrder({
            ...(current || {}),
            ...incomingOrder
          })
        );
        setSource("broadcast");
      };
    }

    const storageHandler = (event) => {
      if (event.key !== `odine.order.${orderId}` || !event.newValue) return;
      try {
        setOrder(normalizeOrder(JSON.parse(event.newValue)));
        setSource("storage");
      } catch {
        // ignore invalid storage payloads
      }
    };
    window.addEventListener("storage", storageHandler);

    const localHandler = (event) => {
      const incomingOrder = event.detail?.order || event.detail;
      if (!incomingOrder) return;
      const incomingOrderId = incomingOrder.id || incomingOrder.orderId;
      if (incomingOrderId && String(incomingOrderId) !== String(orderId)) {
        return;
      }
      setOrder((current) => normalizeOrder({ ...(current || {}), ...incomingOrder }));
      setSource("local");
    };
    window.addEventListener("odine:order-update", localHandler);

    return () => {
      active = false;
      if (pollRef.current) window.clearInterval(pollRef.current);
      if (socketRef.current) socketRef.current.disconnect();
      if (broadcastRef.current) broadcastRef.current.close();
      window.removeEventListener("storage", storageHandler);
      window.removeEventListener("odine:order-update", localHandler);
    };
  }, [enabled, orderId]);

  return {
    order,
    timeline,
    status,
    nextStatus,
    statusMeta,
    loading,
    error,
    source,
    refreshKey: order?.liveStatusUpdatedAt || order?.updatedAt || order?.createdAt || null
  };
}
