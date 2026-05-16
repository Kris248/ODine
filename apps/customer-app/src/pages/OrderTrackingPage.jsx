import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import HistoryRoundedIcon from "@mui/icons-material/HistoryRounded";
import { Box, Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AppHeader } from "../components/common/AppHeader.jsx";
import { EmptyState } from "../components/states/EmptyState.jsx";
import { LoadingState } from "../components/states/LoadingState.jsx";
import { APP_ROUTES } from "../constants/routes.js";
import { CustomerLayout } from "../layouts/CustomerLayout.jsx";
import { useLiveOrderTracking } from "../hooks/useLiveOrderTracking.js";
import { useOrdering } from "../store/OrderingContext.jsx";
import { OrderActivityFeed } from "../features/orders/components/OrderActivityFeed.jsx";
import { OrderStatusTimeline } from "../features/orders/components/OrderStatusTimeline.jsx";
import { CompactOrderCard } from "../features/orders/components/CompactOrderCard.jsx";
import { formatCurrency } from "../utils/formatters.js";

export function OrderTrackingPage() {
  const { restaurantId, tableId, orderId } = useParams();
  const [searchParams] = useSearchParams();
  const seatId = searchParams.get("seat") || "";
  const navigate = useNavigate();
  const { lastOrder, orderHistory, setLastOrder } = useOrdering();

  const initialOrder = lastOrder?.id === orderId ? lastOrder : orderHistory.find((entry) => String(entry.id) === String(orderId)) || null;
  const { order, timeline, loading, error, source } = useLiveOrderTracking(orderId, {
    initialOrder,
    enabled: Boolean(orderId)
  });

  useEffect(() => {
    if (order?.id) {
      setLastOrder(order);
    }
  }, [order, setLastOrder]);

  if (loading && !order) {
    return (
      <CustomerLayout>
        <LoadingState />
      </CustomerLayout>
    );
  }

  if (error && !order) {
    return (
      <CustomerLayout>
        <EmptyState
          title="Live tracking is not ready yet"
          description={error}
          actionLabel="Back to menu"
          onAction={() => navigate(APP_ROUTES.home(restaurantId, tableId, seatId))}
          icon={<HistoryRoundedIcon sx={{ fontSize: 34 }} />}
        />
      </CustomerLayout>
    );
  }

  if (!order) {
    return (
      <CustomerLayout>
        <EmptyState
          title="No active order found"
          description="Open your confirmation page to continue tracking the kitchen progress."
          actionLabel="Back to menu"
          onAction={() => navigate(APP_ROUTES.home(restaurantId, tableId, seatId))}
          icon={<HistoryRoundedIcon sx={{ fontSize: 34 }} />}
        />
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <AppHeader
        title="Order live view"
        subtitle={`${order.restaurant?.name || "Restaurant"} · ${order.table?.label || "Table"}`}
        tableLabel={order.table?.label}
        onBack={() => navigate(-1)}
        actions={
          <Chip
            label={source === "socket" ? "Live socket" : source === "poll" ? "Polling" : "Live sync"}
            variant="outlined"
          />
        }
      />

      <Box
        sx={{
          display: "grid",
          gap: 2.25,
          gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1.15fr) minmax(320px, 0.85fr)" },
          alignItems: "start"
        }}
      >
        <Stack spacing={2.25}>
          <OrderStatusTimeline
            order={order}
            timeline={timeline}
            rightAction={
              <Button
                size="small"
                variant="outlined"
                onClick={() => navigate(APP_ROUTES.home(restaurantId, tableId, seatId))}
              >
                Back to menu
              </Button>
            }
          />

          <Card>
            <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
              <Stack spacing={1.5}>
                <Typography variant="subtitle2" color="text.secondary">
                  Kitchen handoff
                </Typography>
                <Typography variant="h6">
                  {formatCurrency(order.pricing?.total || 0, order.pricing?.currency || "INR")} · {order.items?.length || 0} items
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  Your order card is being updated live. When the chef changes the status, the tracker refreshes automatically.
                </Typography>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                  <Button
                    variant="contained"
                    endIcon={<ArrowForwardRoundedIcon />}
                    onClick={() => navigate(APP_ROUTES.home(restaurantId, tableId, seatId))}
                  >
                    Continue browsing
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => navigate(APP_ROUTES.confirmation(restaurantId, tableId, order.id, seatId))}
                  >
                    Open confirmation
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Stack>

        <Stack spacing={2.25}>
          <Card>
            <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
              <Stack spacing={1.2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Order snapshot
                </Typography>
                <Typography variant="h6">{order.orderNumber || order.id}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Table {order.table?.label || tableId} · {order.items?.length || 0} items
                </Typography>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  {(order.items || []).slice(0, 3).map((item) => (
                    <Chip key={item.key || item.itemId || item.name} label={`${item.quantity} × ${item.name}`} variant="outlined" />
                  ))}
                </Stack>
              </Stack>
            </CardContent>
          </Card>

          <OrderActivityFeed order={order} />

          <Card>
            <CardContent sx={{ p: { xs: 2, md: 2.5 } }}>
              <Stack spacing={1.2}>
                <Typography variant="subtitle2" color="text.secondary">
                  Recent orders
                </Typography>
                <Stack spacing={1.1}>
                  {orderHistory.slice(0, 4).map((entry) => (
                    <CompactOrderCard
                      key={entry.id}
                      order={entry}
                      selected={String(entry.id) === String(order.id)}
                      onClick={() => navigate(APP_ROUTES.tracking(restaurantId, tableId, entry.id, seatId))}
                    />
                  ))}
                  {!orderHistory.length ? (
                    <Typography variant="body2" color="text.secondary">
                      No recent orders in this session yet.
                    </Typography>
                  ) : null}
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </CustomerLayout>
  );
}
