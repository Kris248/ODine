# Payment-Confirmed Order Flow

## 1. Architecture
The system now uses MongoDB and Mongoose end to end because the repo already had a Mongo foundation and the order flow benefits from document snapshots. The customer app creates a checkout session and payment request first, the payment gateway webhook is the only authority that can mark payment as confirmed, and only that verified backend transition can create the final order and emit it to KDS.

## 2. Folder Structure
```text
apps/
  customer-app/
    src/
      pages/
      services/
        api/
      store/
      hooks/
      features/
  kitchen-display/
    src/
      hooks/
      services/
      utils/
      theme.js
  server/
    src/
      services/
        orderPresenter.js
        paymentGateway.js
      app.js
      models.js
      seed.js
packages/
  shared/
    src/
      constants.js
docs/
  payment-confirmed-order-flow.md
```

## 3. Backend Flow
1. `GET /api/public/session/:restaurantRef/:tableRef?seat=...` resolves the QR session.
2. `POST /api/public/checkout-sessions` validates restaurant, table, seat, cart items, totals, and payment mode.
3. The server creates a `CheckoutSession` with lifecycle states through `PAYMENT_PENDING`.
4. A payment request is created through the gateway abstraction in `paymentGateway.js`.
5. `POST /api/payments/webhooks/mock` verifies the HMAC signature, validates amount and references, and logs the gateway event.
6. Only after verification does the server create an `Order`, attach payment proof, and move the session to `ORDER_CREATED`.
7. The server emits `order:paid_confirmed` to the KDS rooms and updates the session to `ORDER_EMITTED_TO_KDS`.

## 4. Event Flow
- Rooms:
  - `restaurant:{restaurantId}`
  - `kds:{restaurantId}`
  - `kds:{restaurantId}:{outletId}`
  - `table:{restaurantId}:{tableId}`
  - `order:{orderId}`
- Events:
  - `order:paid_confirmed`
  - `order:status_updated`

## 5. Customer App Updates
- QR session resolution supports seat-aware table routes through the `seat` query string.
- Cart remains a draft until a checkout session is created.
- Payment is now two-step:
  - create payment request
  - confirm payment and wait for backend webhook verification
- Confirmation screen shows order number, receipt, payment reference, and payment timestamp.
- No public endpoint can create an unpaid kitchen order anymore.

## 6. KDS App
- The KDS subscribes only to payment-confirmed events.
- Orders are grouped by status and filterable by `all`, `new`, `preparing`, `ready`, and `delayed`.
- Cards show restaurant, table, seat, order number, items, modifiers, notes, total, payment badge, age timer, priority, and one-tap status actions.

## 7. Data Models
- `Restaurant`
  - branding, pricing, prep-time defaults, payment methods, outlets
- `Table`
  - outlet mapping, code, label, seat list, QR URL
- `CheckoutSession`
  - lifecycle status, session reference, guest info, draft cart snapshot, pricing, payment request, final order link
- `Order`
  - immutable paid order snapshot, KDS fulfillment status, timing, payment proof, room-ready table and seat snapshots
- `PaymentEvent`
  - raw webhook log, provider, signature verification result, audit trail

## 8. Reliability Rule
The KDS feed is downstream from `processPaymentConfirmation()` in `apps/server/src/app.js`. If payment is not signature-verified and amount-validated there, no order is created and no socket event is emitted.
