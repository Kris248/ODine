import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import { Box, Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AppHeader } from "../components/common/AppHeader.jsx";
import { EmptyState } from "../components/states/EmptyState.jsx";
import { ErrorState } from "../components/states/ErrorState.jsx";
import { LoadingState } from "../components/states/LoadingState.jsx";
import { APP_ROUTES } from "../constants/routes.js";
import { StickyCartBar } from "../features/cart/components/StickyCartBar.jsx";
import { OrderSummaryCard } from "../features/checkout/components/OrderSummaryCard.jsx";
import { LiveOrderBanner } from "../features/orders/components/LiveOrderBanner.jsx";
import { useRestaurantExperience } from "../hooks/useRestaurantExperience.js";
import { CustomerLayout } from "../layouts/CustomerLayout.jsx";
import { useOrdering } from "../store/OrderingContext.jsx";

export function CheckoutPage() {
  const { restaurantId, tableId } = useParams();
  const [searchParams] = useSearchParams();
  const seatId = searchParams.get("seat") || "";
  const navigate = useNavigate();
  const {
    restaurant,
    table,
    paymentMethods,
    cartItems,
    summary,
    itemCount,
    pricing,
    guestDetails,
    orderNote,
    hydrateRestaurant,
    setGuestDetails,
    lastOrder
  } = useOrdering();

  const shouldLoad =
    !restaurant ||
    restaurant.id !== restaurantId ||
    table?.id !== tableId ||
    paymentMethods.length === 0;
  const { loading, error, data } = useRestaurantExperience(
    restaurantId,
    tableId,
    seatId,
    shouldLoad
  );

  useEffect(() => {
    if (!data) return;
    hydrateRestaurant({
      session: data.session,
      restaurant: data.restaurant,
      table: data.table,
      pricing: data.pricing,
      paymentMethods: data.paymentMethods
    });
  }, [data, hydrateRestaurant]);

  const resolvedRestaurant = data?.restaurant || restaurant;
  const resolvedTable = data?.table || table;

  if (loading && !resolvedRestaurant) {
    return (
      <CustomerLayout>
        <LoadingState />
      </CustomerLayout>
    );
  }

  if (error && !resolvedRestaurant) {
    return (
      <CustomerLayout>
        <ErrorState
          title="Checkout is not ready yet"
          description={error}
          actionLabel="Back to menu"
          onAction={() => navigate(APP_ROUTES.home(restaurantId, tableId, seatId))}
        />
      </CustomerLayout>
    );
  }

  if (cartItems.length === 0) {
    return (
      <CustomerLayout>
        <AppHeader
          title="Checkout"
          subtitle="Add a few dishes before you review payment."
          tableLabel={resolvedTable?.label}
          onBack={() => navigate(-1)}
        />
        <EmptyState
          title="Nothing to check out yet"
          description="Your order summary appears here as soon as you add dishes."
          actionLabel="Browse menu"
          onAction={() => navigate(APP_ROUTES.home(restaurantId, tableId, seatId))}
          icon={<PersonOutlineRoundedIcon sx={{ fontSize: 34 }} />}
        />
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <AppHeader
        title="Checkout"
        subtitle={`${resolvedRestaurant?.name || "Restaurant"} · almost ready`}
        tableLabel={resolvedTable?.label}
        onBack={() => navigate(-1)}
      />

      {lastOrder ? (
        <Box sx={{ mb: 2.25 }}>
          <LiveOrderBanner
            order={lastOrder}
            restaurantId={restaurantId}
            tableId={tableId}
            seatId={seatId}
            dense
            onOpenTracking={() =>
              navigate(APP_ROUTES.tracking(restaurantId, tableId, lastOrder.id, seatId))
            }
          />
        </Box>
      ) : null}

      <Box
        sx={{
          display: "grid",
          gap: 2.25,
          gridTemplateColumns: { xs: "1fr", xl: "minmax(0, 1fr) 360px" },
          alignItems: "start"
        }}
      >
        <Stack spacing={2.25}>
          <Card>
            <CardContent sx={{ p: 2.5 }}>
              <Stack spacing={1.8}>
                <Typography variant="h6">Guest details</Typography>
                <Typography color="text.secondary">
                  Keep this light. We only need enough to make handoff and support easy.
                </Typography>
                <TextField
                  label="Your name"
                  placeholder="Aarav"
                  value={guestDetails.name}
                  onChange={(event) => setGuestDetails({ name: event.target.value })}
                />
                <TextField
                  label="Phone number"
                  placeholder="+91 98XXXXXX12"
                  value={guestDetails.phone}
                  onChange={(event) => setGuestDetails({ phone: event.target.value })}
                />
                <TextField
                  label="Dining note"
                  value={orderNote}
                  placeholder="Optional note for this table"
                  disabled
                  helperText="Edit this on the cart screen if you want to update the kitchen note."
                />
              </Stack>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: 2.5 }}>
              <Stack spacing={1.25}>
                <Typography variant="h6">What happens next</Typography>
                <Typography variant="body2" color="text.secondary">
                  Review payment on the next screen, then confirm to generate the live kitchen handoff.
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Stack>

        <Stack spacing={2.25} sx={{ position: { xl: "sticky" }, top: { xl: 16 } }}>
          <OrderSummaryCard
            cartItems={cartItems}
            summary={summary}
            currency={pricing.currency}
            title="Review before payment"
            subtitle="Confirm the guest and order details"
          />
          <Card>
            <CardContent sx={{ p: 2.25 }}>
              <Stack spacing={1.2}>
                <Button
                  variant="outlined"
                  onClick={() => navigate(APP_ROUTES.cart(restaurantId, tableId, seatId))}
                >
                  Back to cart
                </Button>
                <Button
                  variant="contained"
                  size="large"
                  endIcon={<ArrowForwardRoundedIcon />}
                  onClick={() => navigate(APP_ROUTES.payment(restaurantId, tableId, seatId))}
                >
                  Select payment
                </Button>
              </Stack>
            </CardContent>
          </Card>
        </Stack>
      </Box>

      <StickyCartBar
        itemCount={itemCount}
        total={summary.total}
        currency={pricing.currency}
        label="Guest details saved for this table"
        actionLabel="Payment"
        onAction={() => navigate(APP_ROUTES.payment(restaurantId, tableId, seatId))}
      />
    </CustomerLayout>
  );
}
