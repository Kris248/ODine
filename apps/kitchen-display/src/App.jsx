import { useCallback, useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import LoginScreen from "./components/LoginScreen.jsx";
import DashboardShell from "./components/DashboardShell.jsx";
import { useKdsRealtime } from "./hooks/useKdsRealtime.js";
import {
  authRequest,
  clearStoredSession,
  fetchOrders,
  getStoredSession,
  updateOrderStatus
} from "./services/kdsApi.js";
import { kdsTheme } from "./theme.js";
import {
  buildKitchenMetrics,
  describeOrder,
  getStatusCounts,
  getTableLabel,
  isDelayed,
  sortOrdersForKitchen
} from "./utils/orderUtils.js";

function playAlert() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  oscillator.type = "triangle";
  oscillator.frequency.value = 740;
  gainNode.gain.value = 0.02;
  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.14);
}

function normalizeText(value) {
  return String(value || "").toLowerCase().trim();
}

function orderMatches(order, search) {
  if (!search) return true;
  const haystack = [
    order?.orderNumber,
    order?.id,
    order?.table?.label,
    order?.tableLabel,
    order?.restaurant?.name,
    order?.notes,
    order?.fulfillmentStatus,
    order?.prepPriority,
    ...(order?.items || []).flatMap((item) => [
      item?.name,
      item?.specialInstructions,
      ...(item?.modifiers || []).map((modifier) => modifier?.name),
      ...(item?.modifiers || []).map((modifier) => modifier?.groupLabel)
    ])
  ]
    .map(normalizeText)
    .join(" | ");
  return haystack.includes(normalizeText(search));
}

function statusFilter(order, filterKey) {
  const status = normalizeText(order?.fulfillmentStatus || "new");
  if (filterKey === "all") return true;
  if (filterKey === "delayed") return isDelayed(order);
  if (filterKey === "active") return ["new", "accepted", "preparing"].includes(status);
  return status === filterKey;
}

function getTableHints(orders) {
  return [...new Set(orders.map((order) => getTableLabel(order)))].sort((a, b) => a.localeCompare(b));
}

function AppShell() {
  const [session, setSession] = useState(() => getStoredSession());
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeView, setActiveView] = useState("live");
  const [search, setSearch] = useState("");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState("");
  const [latestEvent, setLatestEvent] = useState(null);

  useEffect(() => {
    if (!session) return;
    authRequest("/auth/me").catch(() => {
      clearStoredSession();
      setSession(null);
    });
  }, [session]);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchOrders();
      setOrders(Array.isArray(data.orders) ? data.orders : []);
    } catch (loadError) {
      setError(loadError.message || "Unable to load the board.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session) return;
    loadOrders();
  }, [loadOrders, session]);

  const filteredOrders = useMemo(() => {
    const searched = orders.filter((order) => orderMatches(order, search));
    return sortOrdersForKitchen(searched.filter((order) => statusFilter(order, activeFilter)));
  }, [orders, activeFilter, search]);

  const metrics = useMemo(() => buildKitchenMetrics(filteredOrders), [filteredOrders]);
  const statusCounts = useMemo(() => getStatusCounts(orders), [orders]);
  const tableHints = useMemo(() => getTableHints(filteredOrders), [filteredOrders]);

  const announceEvent = useCallback((type, order) => {
    if (!order) return;
    setLatestEvent({
      type,
      orderId: order.id,
      title: type === "new" ? "New order arrived" : "Order updated",
      message: describeOrder(order)
    });
    if (soundEnabled) playAlert();
  }, [soundEnabled]);

  const handlePaidConfirmed = useCallback(
    (incomingOrder) => {
      setOrders((current) => {
        const exists = current.some((order) => order.id === incomingOrder.id);
        const rest = current.filter((order) => order.id !== incomingOrder.id);
        const next = sortOrdersForKitchen([incomingOrder, ...rest]);
        if (!exists) announceEvent("new", incomingOrder);
        return next;
      });
    },
    [announceEvent]
  );

  const handleStatusUpdated = useCallback(
    (updatedOrder) => {
      setOrders((current) => {
        const exists = current.some((order) => order.id === updatedOrder.id);
        const next = sortOrdersForKitchen(current.map((order) => (order.id === updatedOrder.id ? updatedOrder : order)));
        if (exists) announceEvent("status", updatedOrder);
        return next;
      });
    },
    [announceEvent]
  );

  useKdsRealtime({
    session,
    onPaidConfirmed: handlePaidConfirmed,
    onStatusUpdated: handleStatusUpdated
  });

  const handleStatusChange = useCallback(async (orderId, status) => {
    setUpdatingOrderId(orderId);
    try {
      const response = await updateOrderStatus(orderId, status);
      setOrders((current) => sortOrdersForKitchen(current.map((order) => (order.id === orderId ? response.order : order))));
      setLatestEvent({
        type: "status",
        orderId,
        title: "Status changed",
        message: `${status.toUpperCase()} updated successfully`
      });
    } catch (updateError) {
      setError(updateError.message || "Unable to update order status.");
    } finally {
      setUpdatingOrderId("");
    }
  }, []);

  const handleLogout = useCallback(() => {
    clearStoredSession();
    setSession(null);
    setOrders([]);
    setSearch("");
    setActiveFilter("all");
    setActiveView("live");
    setLatestEvent(null);
  }, []);

  if (!session) {
    return (
      <Routes>
        <Route path="/login" element={<LoginScreen onLogin={setSession} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<Navigate to="/" replace />} />
      <Route
        path="/"
        element={
          <DashboardShell
            orders={filteredOrders}
            loading={loading}
            error={error}
            session={session}
            soundEnabled={soundEnabled}
            onSoundChange={setSoundEnabled}
            activeView={activeView}
            onViewChange={setActiveView}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
            search={search}
            onSearchChange={setSearch}
            onRefresh={loadOrders}
            onLogout={handleLogout}
            onStatusChange={handleStatusChange}
            updatingOrderId={updatingOrderId}
            tableHints={tableHints}
            metrics={metrics}
            latestEvent={latestEvent}
            onClearEvent={() => setLatestEvent(null)}
            statusCounts={statusCounts}
          />
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={kdsTheme}>
      <AppShell />
    </ThemeProvider>
  );
}
