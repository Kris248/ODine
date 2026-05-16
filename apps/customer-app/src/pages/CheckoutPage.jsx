import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import { Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AppHeader } from "../components/common/AppHeader.jsx";
import { EmptyState } from "../components/states/EmptyState.jsx";
import { ErrorState } from "../components/states/ErrorState.jsx";
import { LoadingState } from "../components/states/LoadingState.jsx";
import { APP_ROUTES } from "../constants/routes.js";
import { StickyCartBar } from "../features/cart/components/StickyCartBar.jsx";
import { OrderSummaryCard } from "../features/checkout/components/OrderSummaryCard.jsx";
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
    setGuestDetails
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
    if (!data) {
      return;
    }

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
        subtitle={`${resolvedRestaurant?.name || "Restaurant"} / almost ready`}
        tableLabel={resolvedTable?.label}
        onBack={() => navigate(-1)}
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
        <Card>
          <CardContent sx={{ p: 2.25 }}>
            <Stack spacing={2}>
              <Typography variant="h5">Guest details</Typography>
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

        <Stack spacing={2} sx={{ position: "sticky", top: 18 }}>
          <OrderSummaryCard
            cartItems={cartItems}
            summary={summary}
            currency={pricing.currency}
            title="Review before payment"
          />
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForwardRoundedIcon />}
            onClick={() => navigate(APP_ROUTES.payment(restaurantId, tableId, seatId))}
          >
            Select payment
          </Button>
        </Stack>
      </Stack>

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
