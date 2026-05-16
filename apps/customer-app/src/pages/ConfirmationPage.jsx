import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import { Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
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
  const [remoteOrder, setRemoteOrder] = useState(
    lastOrder?.id === orderId ? lastOrder : null
  );
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

      <Stack
        spacing={3}
        sx={{
          display: "grid",
          gap: 3,
          gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1fr) 340px" },
          alignItems: "start"
        }}
      >
        <Card
          sx={{
            background:
              "linear-gradient(135deg, rgba(42,29,25,0.96), rgba(112,128,96,0.94))",
            color: "#fffaf4"
          }}
        >
          <CardContent sx={{ p: { xs: 2.5, md: 3.5 } }}>
            <Stack spacing={2.25}>
              <Stack
                alignItems="center"
                justifyContent="center"
                sx={{
                  width: 76,
                  height: 76,
                  borderRadius: "50%",
                  bgcolor: "rgba(255,255,255,0.14)"
                }}
              >
                <CheckCircleRoundedIcon sx={{ fontSize: 42 }} />
              </Stack>

              <Stack spacing={0.75}>
                <Typography variant="h3">Payment confirmed.</Typography>
                <Typography sx={{ color: "rgba(255,250,244,0.78)", maxWidth: 560 }}>
                  The backend verified your payment and then released this order to the kitchen in real time.
                </Typography>
              </Stack>

              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                <Chip
                  label={`Order ${order.orderNumber}`}
                  sx={{ bgcolor: "rgba(255,255,255,0.16)", color: "inherit" }}
                />
                <Chip
                  label={`Receipt ${order.paymentProof.receiptNumber}`}
                  sx={{ bgcolor: "rgba(255,255,255,0.16)", color: "inherit" }}
                />
                <Chip
                  label={`Paid ${formatTimeStamp(order.paymentProof.paymentTimestamp || order.createdAt)}`}
                  sx={{ bgcolor: "rgba(255,255,255,0.16)", color: "inherit" }}
                />
              </Stack>

              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                <Chip
                  label={`Ref ${order.paymentProof.paymentReference}`}
                  sx={{ bgcolor: "rgba(255,255,255,0.16)", color: "inherit" }}
                />
                <Chip
                  label={order.paymentProof.paymentMode.toUpperCase()}
                  sx={{ bgcolor: "rgba(255,255,255,0.16)", color: "inherit" }}
                />
              </Stack>

              <Typography sx={{ color: "rgba(255,250,244,0.84)" }}>
                Kitchen status: {order.fulfillmentStatus}
              </Typography>

              <Button
                variant="contained"
                color="inherit"
                startIcon={<RestartAltRoundedIcon />}
                onClick={() => navigate(APP_ROUTES.home(restaurantId, tableId, seatId))}
                sx={{
                  width: "fit-content",
                  color: "primary.dark",
                  bgcolor: "#fff6ea"
                }}
              >
                Order another round
              </Button>
            </Stack>
          </CardContent>
        </Card>

        <OrderSummaryCard
          title="Paid order"
          cartItems={order.items}
          summary={order.pricing}
          currency={order.pricing.currency || pricing.currency}
        />
      </Stack>
    </CustomerLayout>
  );
}
