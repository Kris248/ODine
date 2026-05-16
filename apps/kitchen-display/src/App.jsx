import NotificationsActiveRoundedIcon from "@mui/icons-material/NotificationsActiveRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import TaskAltRoundedIcon from "@mui/icons-material/TaskAltRounded";
import TimerRoundedIcon from "@mui/icons-material/TimerRounded";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CssBaseline,
  Divider,
  FormControlLabel,
  LinearProgress,
  Stack,
  Switch,
  TextField,
  ThemeProvider,
  Typography
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { useKdsRealtime } from "./hooks/useKdsRealtime.js";
import {
  authRequest,
  clearStoredSession,
  fetchOrders,
  getStoredSession,
  loginKds,
  setStoredSession,
  updateOrderStatus
} from "./services/kdsApi.js";
import { kdsTheme } from "./theme.js";
import {
  buildBoardColumns,
  filterOrders,
  formatCurrency,
  formatTime,
  getOrderAgeMinutes,
  isDelayed
} from "./utils/orderUtils.js";

function playAlert() {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    return;
  }

  const context = new AudioContextClass();
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  oscillator.type = "triangle";
  oscillator.frequency.value = 880;
  gainNode.gain.value = 0.025;
  oscillator.connect(gainNode);
  gainNode.connect(context.destination);
  oscillator.start();
  oscillator.stop(context.currentTime + 0.16);
}

function Login({ onLogin }) {
  const [form, setForm] = useState({
    email: "chef@odine.test",
    password: "password123"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const session = await loginKds(form);
      setStoredSession(session);
      onLogin(session);
    } catch (submitError) {
      setError(submitError.message || "Kitchen login failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        px: 2
      }}
    >
      <Card
        sx={{
          width: "min(480px, 100%)",
          borderRadius: 6,
          boxShadow: 12,
          background:
            "linear-gradient(180deg, rgba(15,29,35,0.94), rgba(8,18,23,0.98))"
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Stack component="form" spacing={2.5} onSubmit={submit}>
            <Stack spacing={0.75}>
              <Typography variant="overline" sx={{ color: "secondary.light", letterSpacing: 2 }}>
                ODine KDS
              </Typography>
              <Typography variant="h3">Kitchen command board</Typography>
              <Typography color="text.secondary">
                Live, payment-confirmed order intake for chef stations.
              </Typography>
            </Stack>

            <TextField
              label="Email"
              value={form.email}
              onChange={(event) => setForm({ ...form, email: event.target.value })}
            />
            <TextField
              label="Password"
              type="password"
              value={form.password}
              onChange={(event) => setForm({ ...form, password: event.target.value })}
            />

            {error ? <Alert severity="error">{error}</Alert> : null}

            <Button type="submit" variant="contained" size="large" disabled={loading}>
              {loading ? "Entering kitchen board..." : "Enter kitchen board"}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

function OrderCard({ order, onStatusChange, updating }) {
  const ageMinutes = getOrderAgeMinutes(order);
  const delayed = isDelayed(order);

  return (
    <Card
      sx={{
        borderRadius: 5,
        boxShadow: delayed ? 8 : 3,
        borderColor: delayed ? "warning.main" : "divider",
        background:
          delayed
            ? "linear-gradient(180deg, rgba(53,33,13,0.95), rgba(22,20,18,0.98))"
            : "linear-gradient(180deg, rgba(15,29,35,0.94), rgba(10,20,26,0.98))"
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Stack spacing={1.5}>
          <Stack direction="row" justifyContent="space-between" alignItems="start" spacing={1}>
            <Stack spacing={0.5}>
              <Typography variant="overline" sx={{ color: "secondary.light", letterSpacing: 1.6 }}>
                {order.restaurant.name}
              </Typography>
              <Typography variant="h4">{order.table.label}</Typography>
              <Typography color="text.secondary">{order.orderNumber}</Typography>
            </Stack>
            <Stack spacing={1} alignItems="end">
              <Chip color="success" label="Payment confirmed" />
              <Chip
                color={delayed ? "warning" : "default"}
                icon={<TimerRoundedIcon sx={{ color: "inherit !important" }} />}
                label={`${ageMinutes} min`}
              />
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
            <Chip label={`Placed ${formatTime(order.createdAt)}`} />
            <Chip label={`ETA ${order.estimatedPrepTimeMinutes} min`} />
            <Chip
              label={`Priority ${order.prepPriority}`}
              color={order.prepPriority === "high" ? "warning" : "default"}
            />
          </Stack>

          {order.notes ? (
            <Alert severity="warning" sx={{ borderRadius: 3 }}>
              {order.notes}
            </Alert>
          ) : null}

          <Stack spacing={1.2}>
            {order.items.map((item) => (
              <Box
                key={`${order.id}-${item.itemId}-${item.name}`}
                sx={{
                  p: 1.5,
                  borderRadius: 3,
                  bgcolor: "rgba(255,255,255,0.03)"
                }}
              >
                <Stack direction="row" justifyContent="space-between" spacing={1}>
                  <Typography variant="h6">
                    {item.quantity} x {item.name}
                  </Typography>
                  <Typography fontWeight={700}>
                    {formatCurrency(item.lineTotal, order.pricing.currency)}
                  </Typography>
                </Stack>
                {item.modifiers?.length ? (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                    {item.modifiers
                      .map((modifier) => `${modifier.groupLabel}: ${modifier.name}`)
                      .join(" / ")}
                  </Typography>
                ) : null}
                {item.specialInstructions ? (
                  <Typography variant="body2" color="warning.light" sx={{ mt: 0.5 }}>
                    Note: {item.specialInstructions}
                  </Typography>
                ) : null}
              </Box>
            ))}
          </Stack>

          <Divider />

          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack spacing={0.35}>
              <Typography color="text.secondary">Total</Typography>
              <Typography variant="h5">
                {formatCurrency(order.pricing.total, order.pricing.currency)}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap" justifyContent="flex-end">
              {[
                { key: "accepted", label: "Accept" },
                { key: "preparing", label: "Preparing" },
                { key: "ready", label: "Ready" },
                { key: "served", label: "Served" }
              ].map((statusAction) => (
                <Button
                  key={statusAction.key}
                  variant={order.fulfillmentStatus === statusAction.key ? "contained" : "outlined"}
                  color={statusAction.key === "served" ? "success" : "primary"}
                  size="small"
                  disabled={updating}
                  onClick={() => onStatusChange(order.id, statusAction.key)}
                >
                  {statusAction.label}
                </Button>
              ))}
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

function Dashboard({ session, onLogout }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [updatingOrderId, setUpdatingOrderId] = useState("");

  async function loadOrders() {
    setLoading(true);
    setError("");
    try {
      const data = await fetchOrders();
      setOrders(data.orders || []);
    } catch (loadError) {
      setError(loadError.message || "Unable to load the board.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  useKdsRealtime({
    session,
    onPaidConfirmed: (incomingOrder) => {
      setOrders((current) => {
        const deduped = current.filter((order) => order.id !== incomingOrder.id);
        return [incomingOrder, ...deduped];
      });
      if (soundEnabled) {
        playAlert();
      }
    },
    onStatusUpdated: (updatedOrder) => {
      setOrders((current) =>
        current.map((order) => (order.id === updatedOrder.id ? updatedOrder : order))
      );
    }
  });

  async function handleStatusChange(orderId, status) {
    setUpdatingOrderId(orderId);
    try {
      const response = await updateOrderStatus(orderId, status);
      setOrders((current) =>
        current.map((order) => (order.id === orderId ? response.order : order))
      );
    } catch (updateError) {
      setError(updateError.message || "Unable to update order status.");
    } finally {
      setUpdatingOrderId("");
    }
  }

  const visibleOrders = useMemo(() => filterOrders(orders, activeFilter), [activeFilter, orders]);
  const columns = useMemo(() => buildBoardColumns(visibleOrders), [visibleOrders]);
  const delayedCount = useMemo(() => orders.filter(isDelayed).length, [orders]);

  return (
    <Box sx={{ minHeight: "100vh", px: { xs: 1.5, md: 2.5 }, py: { xs: 1.5, md: 2.5 } }}>
      <Stack spacing={2.5}>
        <Card
          sx={{
            borderRadius: 6,
            background:
              "linear-gradient(135deg, rgba(16,34,40,0.96), rgba(11,19,24,0.98))"
          }}
        >
          <CardContent sx={{ p: { xs: 2.25, md: 3 } }}>
            <Stack spacing={2}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "start", md: "center" }}
                spacing={2}
              >
                <Stack spacing={0.75}>
                  <Typography variant="overline" sx={{ color: "secondary.light", letterSpacing: 1.8 }}>
                    Live KDS
                  </Typography>
                  <Typography variant="h2">Payment-confirmed kitchen flow</Typography>
                  <Typography color="text.secondary">
                    Orders appear here only after webhook verification succeeds on the backend.
                  </Typography>
                </Stack>

                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  <Button
                    variant="outlined"
                    startIcon={<RefreshRoundedIcon />}
                    onClick={loadOrders}
                  >
                    Refresh
                  </Button>
                  <Button
                    variant="outlined"
                    color="inherit"
                    onClick={() => {
                      clearStoredSession();
                      onLogout();
                    }}
                  >
                    Logout
                  </Button>
                </Stack>
              </Stack>

              <Stack direction={{ xs: "column", md: "row" }} spacing={1} justifyContent="space-between">
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  {[
                    { key: "all", label: `All ${orders.length}` },
                    { key: "new", label: `New ${orders.filter((order) => order.fulfillmentStatus === "new").length}` },
                    {
                      key: "preparing",
                      label: `Preparing ${orders.filter((order) => order.fulfillmentStatus === "preparing").length}`
                    },
                    { key: "ready", label: `Ready ${orders.filter((order) => order.fulfillmentStatus === "ready").length}` },
                    { key: "delayed", label: `Delayed ${delayedCount}` }
                  ].map((filter) => (
                    <Chip
                      key={filter.key}
                      label={filter.label}
                      color={activeFilter === filter.key ? "primary" : "default"}
                      variant={activeFilter === filter.key ? "filled" : "outlined"}
                      onClick={() => setActiveFilter(filter.key)}
                    />
                  ))}
                </Stack>

                <FormControlLabel
                  control={
                    <Switch
                      checked={soundEnabled}
                      onChange={(event) => setSoundEnabled(event.target.checked)}
                    />
                  }
                  label={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <NotificationsActiveRoundedIcon fontSize="small" />
                      <Typography variant="body2">Sound alert</Typography>
                    </Stack>
                  }
                />
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {loading ? <LinearProgress sx={{ borderRadius: 999 }} /> : null}
        {error ? <Alert severity="error">{error}</Alert> : null}

        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, minmax(0, 1fr))",
              xl: "repeat(4, minmax(0, 1fr))"
            }
          }}
        >
          {columns.map((column) => (
            <Card
              key={column.key}
              sx={{
                borderRadius: 5,
                minHeight: 320,
                background:
                  "linear-gradient(180deg, rgba(12,24,31,0.96), rgba(8,18,23,0.98))"
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Stack spacing={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h4">{column.label}</Typography>
                    <Chip label={column.orders.length} />
                  </Stack>

                  <Stack spacing={1.5}>
                    {column.orders.length === 0 ? (
                      <Card
                        variant="outlined"
                        sx={{ borderStyle: "dashed", borderRadius: 4, bgcolor: "transparent" }}
                      >
                        <CardContent sx={{ p: 2 }}>
                          <Stack spacing={1} alignItems="start">
                            <TaskAltRoundedIcon color="success" />
                            <Typography>No orders in this lane right now.</Typography>
                          </Stack>
                        </CardContent>
                      </Card>
                    ) : (
                      column.orders.map((order) => (
                        <OrderCard
                          key={order.id}
                          order={order}
                          updating={updatingOrderId === order.id}
                          onStatusChange={handleStatusChange}
                        />
                      ))
                    )}
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Stack>
    </Box>
  );
}

function AppShell() {
  const [session, setSession] = useState(() => getStoredSession());

  useEffect(() => {
    if (!session) {
      return;
    }

    authRequest("/auth/me").catch(() => {
      clearStoredSession();
      setSession(null);
    });
  }, [session]);

  return (
    <Routes>
      <Route
        path="/login"
        element={session ? <Navigate to="/" replace /> : <Login onLogin={setSession} />}
      />
      <Route
        path="/"
        element={
          session ? (
            <Dashboard session={session} onLogout={() => setSession(null)} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={kdsTheme}>
      <CssBaseline />
      <AppShell />
    </ThemeProvider>
  );
}
