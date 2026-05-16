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
import { CustomerLayout } from "../layouts/CustomerLayout.jsx";
import { fetchConfirmedOrder } from "../services/orderService.js";
import { useOrdering } from "../store/OrderingContext.jsx";
import { formatTimeStamp } from "../utils/formatters.js";

export function ConfirmationPage() {
  const { restaurantId, tableId, orderId } = useParams();
  const [searchParams] = useSearchParams();
  const seatId = searchParams.get("seat") || "";
  const navigate = useNavigate();
  const { lastOrder, pricing, setLastOrder } = useOrdering();
  const [remoteOrder, setRemoteOrder] = useState(lastOrder?.id === orderId ? lastOrder : null);
  const [loading, setLoading] = useState(!remoteOrder);

  useEffect(() => {
    if (remoteOrder) {
      return;
    }

    let active = true;
    setLoading(true);

    fetchConfirmedOrder(orderId)
      .then((response) => {
        if (!active || !response?.order) {
          return;
        }
        setRemoteOrder(response.order);
        setLastOrder(response.order);
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [orderId, remoteOrder, setLastOrder]);

  const order = remoteOrder || (lastOrder?.id === orderId ? lastOrder : null);

  if (loading && !order) {
    return (
      <CustomerLayout>
        <LoadingState />
      </CustomerLayout>
    );
  }

  if (!order) {
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
        subtitle={`${order.restaurant.name} / ${order.table.label}`}
        tableLabel={order.table.label}
      />

      <Box
        sx={{
          display: "grid",
          gap: 2.5,
          gridTemplateColumns: { xs: "1fr", xl: "minmax(0, 1fr) 360px" },
          alignItems: "start"
        }}
      >
        <Card
          sx={{
            background:
              "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(255,240,241,0.96))",
            border: "1px solid rgba(226,55,68,0.18)"
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
            <Stack spacing={2.25}>
              <Stack
                alignItems="center"
                justifyContent="center"
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  bgcolor: "rgba(226,55,68,0.10)"
                }}
              >
                <CheckCircleRoundedIcon sx={{ fontSize: 46 }} color="primary" />
              </Stack>

              <Stack spacing={0.75}>
                <Typography variant="h3" sx={{ fontSize: { xs: 28, sm: 38 } }}>
                  Payment confirmed.
                </Typography>
                <Typography color="text.secondary" sx={{ maxWidth: 560 }}>
                  The backend verified your payment and then released this order to the kitchen in real time.
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                <Chip label={`Order ${order.orderNumber}`} variant="outlined" />
                <Chip label={`Receipt ${order.paymentProof.receiptNumber}`} variant="outlined" />
                <Chip
                  label={`Paid ${formatTimeStamp(order.paymentProof.paymentTimestamp || order.createdAt)}`}
                  variant="outlined"
                />
              </Stack>

              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                <Chip label={`Ref ${order.paymentProof.paymentReference}`} variant="outlined" />
                <Chip label={order.paymentProof.paymentMode.toUpperCase()} variant="outlined" />
                <Chip label={`Kitchen ${order.fulfillmentStatus}`} color="success" variant="outlined" />
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
                <Button
                  variant="contained"
                  startIcon={<RestartAltRoundedIcon />}
                  onClick={() => navigate(APP_ROUTES.home(restaurantId, tableId, seatId))}
                >
                  Order another round
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate(APP_ROUTES.home(restaurantId, tableId, seatId))}
                >
                  Back to menu
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        <Stack spacing={2.25} sx={{ position: { xl: "sticky" }, top: { xl: 16 } }}>
          <OrderSummaryCard
            title="Paid order"
            cartItems={order.items}
            summary={order.pricing}
            currency={order.pricing.currency || pricing.currency}
            subtitle="Kitchen-ready order details"
          />
          <Card>
            <CardContent sx={{ p: 2.5 }}>
              <Stack spacing={1.25}>
                <Typography variant="subtitle2" color="text.secondary">
                  What happens now
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  The order is now visible to the kitchen display. You can continue ordering from the menu if needed.
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Box>
    </CustomerLayout>
  );
}
