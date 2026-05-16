import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import { Box, Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AppHeader } from "../components/common/AppHeader.jsx";
import { EmptyState } from "../components/states/EmptyState.jsx";
import { LoadingState } from "../components/states/LoadingState.jsx";
import { APP_ROUTES } from "../constants/routes.js";
import { OrderSummaryCard } from "../features/checkout/components/OrderSummaryCard.jsx";
import { LiveOrderBanner } from "../features/orders/components/LiveOrderBanner.jsx";
import { OrderStatusTimeline } from "../features/orders/components/OrderStatusTimeline.jsx";
import { CustomerLayout } from "../layouts/CustomerLayout.jsx";
import { fetchConfirmedOrder } from "../services/orderService.js";
import { useOrdering } from "../store/OrderingContext.jsx";
import { formatTimeStamp } from "../utils/formatters.js";
import { useLiveOrderTracking } from "../hooks/useLiveOrderTracking.js";

export function ConfirmationPage() {
  const { restaurantId, tableId, orderId } = useParams();
  const [searchParams] = useSearchParams();
  const seatId = searchParams.get("seat") || "";
  const navigate = useNavigate();
  const { lastOrder, pricing, setLastOrder } = useOrdering();
  const [remoteOrder, setRemoteOrder] = useState(lastOrder?.id === orderId ? lastOrder : null);
  const [loading, setLoading] = useState(!remoteOrder);

  useEffect(() => {
    if (remoteOrder) return;

    let active = true;
    setLoading(true);

    fetchConfirmedOrder(orderId)
      .then((response) => {
        if (!active || !response?.order) return;
        setRemoteOrder(response.order);
        setLastOrder(response.order);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [orderId, remoteOrder, setLastOrder]);

  const order = remoteOrder || (lastOrder?.id === orderId ? lastOrder : null);
  const liveTracking = useLiveOrderTracking(order?.id, { initialOrder: order, enabled: Boolean(order?.id) });

  useEffect(() => {
    if (liveTracking.order?.id) {
      setLastOrder(liveTracking.order);
    }
  }, [liveTracking.order, setLastOrder]);

  const currentOrder = liveTracking.order || order;

  if (loading && !currentOrder) {
    return (
      <CustomerLayout>
        <LoadingState />
      </CustomerLayout>
    );
  }

  if (!currentOrder) {
    return (
      <CustomerLayout>
        <AppHeader
          title="Order confirmation"
          subtitle="We could not find the latest summary for this order."
          onBack={() => navigate(APP_ROUTES.home(restaurantId, tableId, seatId))}
        />
        <EmptyState
          title="Order placed, summary unavailable"
          description="This confirmation may have opened in a fresh session. You can continue browsing the menu from here."
          actionLabel="Back to menu"
          onAction={() => navigate(APP_ROUTES.home(restaurantId, tableId, seatId))}
        />
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <AppHeader
        title="Order confirmed"
        subtitle={`${currentOrder.restaurant.name} · ${currentOrder.table.label}`}
        tableLabel={currentOrder.table.label}
        actions={
          <Chip
            label={liveTracking.source === "socket" ? "Live socket" : liveTracking.source === "poll" ? "Polling" : "Live sync"}
            variant="outlined"
          />
        }
      />

      <LiveOrderBanner
        order={currentOrder}
        restaurantId={restaurantId}
        tableId={tableId}
        seatId={seatId}
        onOpenTracking={() => navigate(APP_ROUTES.tracking(restaurantId, tableId, currentOrder.id, seatId))}
      />

      <Box
        sx={{
          display: "grid",
          gap: 2.25,
          gridTemplateColumns: { xs: "1fr", xl: "minmax(0, 1fr) 360px" },
          alignItems: "start",
          mt: 2.25
        }}
      >
        <Card>
          <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
            <Stack spacing={2.25}>
              <Stack
                alignItems="center"
                justifyContent="center"
                sx={{
                  width: 78,
                  height: 78,
                  borderRadius: 5,
                  bgcolor: "rgba(15,118,110,0.08)",
                  border: "1px solid rgba(15,118,110,0.12)"
                }}
              >
                <CheckCircleRoundedIcon sx={{ fontSize: 42 }} color="primary" />
              </Stack>

              <Stack spacing={0.75}>
                <Typography variant="h3" sx={{ fontSize: { xs: 28, sm: 38 } }}>
                  Payment confirmed.
                </Typography>
                <Typography color="text.secondary" sx={{ maxWidth: 560, lineHeight: 1.7 }}>
                  The backend verified your payment and then released this order to the kitchen in real time.
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                <Chip label={`Order ${currentOrder.orderNumber}`} variant="outlined" />
                <Chip label={`Receipt ${currentOrder.paymentProof.receiptNumber}`} variant="outlined" />
                <Chip
                  label={`Paid ${formatTimeStamp(currentOrder.paymentProof.paymentTimestamp || currentOrder.createdAt)}`}
                  variant="outlined"
                />
              </Stack>

              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                <Chip label={`Ref ${currentOrder.paymentProof.paymentReference}`} variant="outlined" />
                <Chip label={currentOrder.paymentProof.paymentMode.toUpperCase()} variant="outlined" />
                <Chip label={`Kitchen ${currentOrder.fulfillmentStatus}`} color="success" variant="outlined" />
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
                <Button
                  variant="contained"
                  startIcon={<RestartAltRoundedIcon />}
                  onClick={() => navigate(APP_ROUTES.home(restaurantId, tableId, seatId))}
                >
                  Order another round
                </Button>
                <Button variant="outlined" onClick={() => navigate(APP_ROUTES.home(restaurantId, tableId, seatId))}>
                  Back to menu
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Stack spacing={2.25} sx={{ position: { xl: "sticky" }, top: { xl: 16 } }}>
          <OrderStatusTimeline
            order={currentOrder}
            timeline={liveTracking.timeline}
            compact
            rightAction={
              <Button size="small" variant="outlined" onClick={() => navigate(APP_ROUTES.tracking(restaurantId, tableId, currentOrder.id, seatId))}>
                Open live view
              </Button>
            }
          />
          <OrderSummaryCard
            title="Paid order"
            cartItems={currentOrder.items}
            summary={currentOrder.pricing}
            currency={currentOrder.pricing.currency || pricing.currency}
            subtitle="Kitchen-ready order details"
          />
          <Card>
            <CardContent sx={{ p: 2.25 }}>
              <Stack spacing={1.25}>
                <Typography variant="subtitle2" color="text.secondary">
                  What happens now
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  The order is now visible to the kitchen display. You can keep the tracker open while the chef moves it through the queue.
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </CustomerLayout>
  );
}
