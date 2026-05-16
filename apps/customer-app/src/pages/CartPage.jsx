import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import ShoppingBagRoundedIcon from "@mui/icons-material/ShoppingBagRounded";
import { Button, Card, CardContent, Stack, TextField, Typography } from "@mui/material";
import { useEffect } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AppHeader } from "../components/common/AppHeader.jsx";
import { EmptyState } from "../components/states/EmptyState.jsx";
import { ErrorState } from "../components/states/ErrorState.jsx";
import { LoadingState } from "../components/states/LoadingState.jsx";
import { APP_ROUTES } from "../constants/routes.js";
import { CartItemCard } from "../features/cart/components/CartItemCard.jsx";
import { StickyCartBar } from "../features/cart/components/StickyCartBar.jsx";
import { OrderSummaryCard } from "../features/checkout/components/OrderSummaryCard.jsx";
import { useRestaurantExperience } from "../hooks/useRestaurantExperience.js";
import { CustomerLayout } from "../layouts/CustomerLayout.jsx";
import { useOrdering } from "../store/OrderingContext.jsx";

export function CartPage() {
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
    orderNote,
    hydrateRestaurant,
    changeQuantity,
    removeItem,
    setOrderNote
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
          title="Cart details are unavailable"
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
          title="Your cart"
          subtitle="Nothing has been added yet."
          tableLabel={resolvedTable?.label}
          onBack={() => navigate(-1)}
        />
        <EmptyState
          title="Your cart is still empty"
          description="Browse the menu and add a few dishes to continue with checkout."
          actionLabel="Back to menu"
          onAction={() => navigate(APP_ROUTES.home(restaurantId, tableId, seatId))}
          icon={<ShoppingBagRoundedIcon sx={{ fontSize: 34 }} />}
        />
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <AppHeader
        title="Your cart"
        subtitle={`${resolvedRestaurant?.name || "Restaurant"} / ready for a quick review`}
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
        <Stack spacing={2}>
          {cartItems.map((item) => (
            <CartItemCard
              key={item.key}
              item={item}
              currency={pricing.currency}
              onIncrease={() => changeQuantity(item.key, 1)}
              onDecrease={() => changeQuantity(item.key, -1)}
              onRemove={removeItem}
            />
          ))}

          <Card>
            <CardContent sx={{ p: 2.25 }}>
              <Stack spacing={1.25}>
                <Typography variant="h5">Special instructions</Typography>
                <Typography color="text.secondary">
                  Add one note for the kitchen if you want the whole order handled a certain way.
                </Typography>
                <TextField
                  multiline
                  minRows={4}
                  placeholder="Less spicy overall, bring drinks first, pack one dessert..."
                  value={orderNote}
                  onChange={(event) => setOrderNote(event.target.value)}
                />
              </Stack>
            </CardContent>
          </Card>
        </Stack>

        <Stack spacing={2} sx={{ position: "sticky", top: 18 }}>
          <OrderSummaryCard
            cartItems={cartItems}
            summary={summary}
            currency={pricing.currency}
            title="Order summary"
          />
          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForwardRoundedIcon />}
            onClick={() => navigate(APP_ROUTES.checkout(restaurantId, tableId, seatId))}
          >
            Continue to checkout
          </Button>
        </Stack>
      </Stack>

      <StickyCartBar
        itemCount={itemCount}
        total={summary.total}
        currency={pricing.currency}
        label="One more step before payment"
        actionLabel="Checkout"
        onAction={() => navigate(APP_ROUTES.checkout(restaurantId, tableId, seatId))}
      />
    </CustomerLayout>
  );
}
