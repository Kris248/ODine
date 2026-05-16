import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import ReceiptLongRoundedIcon from "@mui/icons-material/ReceiptLongRounded";
import SyncRoundedIcon from "@mui/icons-material/SyncRounded";
import { Alert, Box, Button, Card, CardContent, Chip, Stack, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { AppHeader } from "../components/common/AppHeader.jsx";
import { EmptyState } from "../components/states/EmptyState.jsx";
import { ErrorState } from "../components/states/ErrorState.jsx";
import { LoadingState } from "../components/states/LoadingState.jsx";
import { APP_ROUTES } from "../constants/routes.js";
import { StickyCartBar } from "../features/cart/components/StickyCartBar.jsx";
import { OrderSummaryCard } from "../features/checkout/components/OrderSummaryCard.jsx";
import { PaymentMethodCard } from "../features/checkout/components/PaymentMethodCard.jsx";
import { useRestaurantExperience } from "../hooks/useRestaurantExperience.js";
import { CustomerLayout } from "../layouts/CustomerLayout.jsx";
import { completeCheckoutPayment, createCheckoutSession } from "../services/orderService.js";
import { useOrdering } from "../store/OrderingContext.jsx";

export function PaymentPage() {
  const { restaurantId, tableId } = useParams();
  const [searchParams] = useSearchParams();
  const seatId = searchParams.get("seat") || "";
  const navigate = useNavigate();
  const [creatingSession, setCreatingSession] = useState(false);
  const [confirmingPayment, setConfirmingPayment] = useState(false);
  const [paymentError, setPaymentError] = useState("");
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
    selectedPaymentMethodId,
    activeCheckoutSession,
    hydrateRestaurant,
    setPaymentMethod,
    setActiveCheckoutSession,
    setLastOrder,
    clearCheckout
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
  const resolvedPaymentMethods = data?.paymentMethods || paymentMethods;
  const selectedPaymentMethod = useMemo(
    () =>
      resolvedPaymentMethods.find((method) => method.id === selectedPaymentMethodId) ||
      resolvedPaymentMethods[0] ||
      null,
    [resolvedPaymentMethods, selectedPaymentMethodId]
  );

  useEffect(() => {
    if (!selectedPaymentMethod && resolvedPaymentMethods[0]) {
      setPaymentMethod(resolvedPaymentMethods[0].id);
    }
  }, [resolvedPaymentMethods, selectedPaymentMethod, setPaymentMethod]);

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
          title="Payment options are unavailable"
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
          title="Payment"
          subtitle="Your cart has been cleared."
          tableLabel={resolvedTable?.label}
          onBack={() => navigate(-1)}
        />
        <EmptyState
          title="No order to pay for"
          description="Add items first, then come back here to choose a payment method."
          actionLabel="Return to menu"
          onAction={() => navigate(APP_ROUTES.home(restaurantId, tableId, seatId))}
        />
      </CustomerLayout>
    );
  }

  async function handleCreatePaymentRequest() {
    if (!selectedPaymentMethod || !resolvedRestaurant || !resolvedTable) {
      return null;
    }

    setPaymentError("");
    setCreatingSession(true);

    try {
      const checkoutSession = await createCheckoutSession({
        restaurant: resolvedRestaurant,
        table: resolvedTable,
        items: cartItems,
        summary,
        pricing,
        guestDetails,
        orderNote,
        paymentMode: selectedPaymentMethod,
        seatId
      });

      setActiveCheckoutSession(checkoutSession);
      return checkoutSession;
    } catch (requestError) {
      setPaymentError(requestError.message || "Unable to create the payment request.");
      return null;
    } finally {
      setCreatingSession(false);
    }
  }

  async function handleConfirmPayment() {
    const session = activeCheckoutSession || (await handleCreatePaymentRequest());
    if (!session) {
      return;
    }

    setPaymentError("");
    setConfirmingPayment(true);

    try {
      const confirmation = await completeCheckoutPayment(session.id);
      setLastOrder(confirmation.order);
      clearCheckout();
      navigate(APP_ROUTES.confirmation(restaurantId, tableId, confirmation.order.id, seatId));
    } catch (confirmError) {
      setPaymentError(confirmError.message || "Payment confirmation is still pending.");
    } finally {
      setConfirmingPayment(false);
    }
  }

  const callToActionLabel = activeCheckoutSession
    ? confirmingPayment
      ? "Waiting for webhook confirmation..."
      : "Confirm payment"
    : creatingSession
      ? "Creating payment request..."
      : "Create payment request";

  return (
    <CustomerLayout>
      <AppHeader
        title="Select payment"
        subtitle={`${resolvedRestaurant?.name || "Restaurant"} / final review`}
        tableLabel={resolvedTable?.label}
        onBack={() => navigate(-1)}
      />

      <Box
        sx={{
          display: "grid",
          gap: 2.5,
          gridTemplateColumns: { xs: "1fr", xl: "minmax(0, 1fr) 360px" },
          alignItems: "start"
        }}
      >
        <Stack spacing={2.25}>
          <Card>
            <CardContent sx={{ p: 2.5 }}>
              <Stack spacing={1.5}>
                <Typography variant="h6">Choose how to pay</Typography>
                <Typography color="text.secondary">
                  Pick the payment method, then create a checkout request for the live order.
                </Typography>
              </Stack>
            </CardContent>
          </Card>

          <Stack spacing={1.5}>
            {resolvedPaymentMethods.map((method) => (
              <PaymentMethodCard
                key={method.id}
                method={method}
                selected={selectedPaymentMethod?.id === method.id}
                onSelect={setPaymentMethod}
              />
            ))}
          </Stack>

          <Card>
            <CardContent sx={{ p: 2.5 }}>
              <Stack spacing={1.2}>
                <Typography variant="h6">Final review</Typography>
                <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                  <Chip label={`Table ${resolvedTable?.label || tableId}`} />
                  {guestDetails.name ? <Chip label={`Guest ${guestDetails.name}`} /> : null}
                  {guestDetails.phone ? <Chip label={guestDetails.phone} /> : null}
                  {selectedPaymentMethod ? <Chip label={selectedPaymentMethod.label} color="primary" /> : null}
                </Stack>
                <Typography color="text.secondary">
                  {orderNote || "No extra kitchen note added for this order."}
                </Typography>
              </Stack>
            </CardContent>
          </Card>

          {activeCheckoutSession ? (
            <Card
              sx={{
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.98), rgba(255,240,241,0.96))",
                border: "1px solid rgba(226,55,68,0.18)"
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Stack spacing={1.5}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1.5}>
                    <Typography variant="h6">Payment request created</Typography>
                    <Chip
                      icon={<CheckCircleRoundedIcon sx={{ color: "inherit !important" }} />}
                      label={activeCheckoutSession.lifecycleStatus}
                      color="success"
                      variant="outlined"
                    />
                  </Stack>
                  <Typography color="text.secondary">
                    The kitchen will see this order only after the backend verifies the payment webhook.
                  </Typography>
                  <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                    <Chip label={`Ref ${activeCheckoutSession.payment.paymentReference}`} variant="outlined" />
                    <Chip label={`Gateway ${activeCheckoutSession.payment.gatewayOrderId}`} variant="outlined" />
                    <Chip label={`Receipt ${activeCheckoutSession.payment.receiptNumber}`} variant="outlined" />
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          ) : null}

          {paymentError ? <Alert severity="error">{paymentError}</Alert> : null}
        </Stack>

        <Stack spacing={2.25} sx={{ position: { xl: "sticky" }, top: { xl: 16 } }}>
          <OrderSummaryCard
            cartItems={cartItems}
            summary={summary}
            currency={pricing.currency}
            title={activeCheckoutSession ? "Awaiting confirmation" : "Pay and confirm"}
            subtitle="Everything is ready at the table"
          />
          {!activeCheckoutSession ? (
            <Button
              variant="contained"
              size="large"
              startIcon={<ReceiptLongRoundedIcon />}
              onClick={handleCreatePaymentRequest}
              disabled={!selectedPaymentMethod || creatingSession}
            >
              {callToActionLabel}
            </Button>
          ) : (
            <Button
              variant="contained"
              size="large"
              startIcon={<SyncRoundedIcon />}
              onClick={handleConfirmPayment}
              disabled={confirmingPayment}
            >
              {callToActionLabel}
            </Button>
          )}
        </Stack>
      </Box>

      <StickyCartBar
        itemCount={itemCount}
        total={summary.total}
        currency={pricing.currency}
        label={
          activeCheckoutSession
            ? "Payment request ready. Confirm to trigger backend verification."
            : selectedPaymentMethod
              ? `${selectedPaymentMethod.label} selected`
              : "Choose a payment option"
        }
        actionLabel={callToActionLabel}
        onAction={activeCheckoutSession ? handleConfirmPayment : handleCreatePaymentRequest}
      />
    </CustomerLayout>
  );
}
