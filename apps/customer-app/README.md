# ODine Customer App

## Overview

The ODine Customer App is the guest-facing ordering experience for dine-in QR table service.
It is designed for quick menu browsing, category-first discovery, cart management, checkout, and payment confirmation.

## Key Features

- **QR-powered table experience**
  - Route format: `/table/:restaurantId/:tableId`
  - Optional `seat` query param for seat-level ordering

- **Menu browsing**
  - Featured category cards for fast navigation
  - Responsive category dropdown on mobile
  - Category sections rendered as accordions for reduced scroll
  - Search across dish names, descriptions, and ingredients

- **Smooth ordering flow**
  - Quick-add dishes directly from cards
  - Full item details and customization dialog
  - Compact card layout for a modern food app feel

- **Cart review**
  - Review dish quantities, pricing, and extras
  - Add notes for the kitchen
  - Sticky cart preview for fast checkout access

- **Checkout flow**
  - Guest details capture (name, phone)
  - Payment method selection
  - Payment request creation and confirmation

- **Confirmation page**
  - Order summary after payment verification
  - Real-time kitchen handoff messaging
  - Option to continue browsing or start another order

## App Flow

1. Customer scans a restaurant QR code.
2. The browser navigates to `/table/:restaurantId/:tableId`.
3. `MenuPage` loads restaurant state via `useRestaurantExperience()`.
4. Guest browses categories, searches items, and adds dishes to cart.
5. `CartPage` shows line items, quantity controls, and kitchen notes.
6. `CheckoutPage` captures guest details and validates order readiness.
7. `PaymentPage` creates a checkout session and confirms payment.
8. `ConfirmationPage` shows the paid order and final kitchen-ready status.

## Architecture

### Frontend

- Built with React and Vite
- Uses React Router for routing
- Uses Material UI for reusable UI elements
- `AppRouter` defines the customer routes:
  - `/table/:restaurantId/:tableId`
  - `/table/:restaurantId/:tableId/cart`
  - `/table/:restaurantId/:tableId/checkout`
  - `/table/:restaurantId/:tableId/payment`
  - `/table/:restaurantId/:tableId/confirmation/:orderId`

### State & data

- `useRestaurantExperience()` loads the current dining session from the API
- `OrderingContext` manages cart state, restaurant session state, checkout session, payment method, and last order
- Shared pricing, cart summary, and guest details are persisted across pages

### API Integration

- Restaurant experience and menu data are loaded from the backend via `restaurantService.js`
- Checkout sessions and payment confirmation are handled by `orderService.js`
- The app relies on backend routes for menu data, payment flow, and order confirmation

## Files of interest

- `src/App.jsx` — root app entrypoint
- `src/routes/AppRouter.jsx` — customer route definitions
- `src/pages/MenuPage.jsx` — main menu browsing and quick ordering
- `src/pages/CartPage.jsx` — cart review and note capture
- `src/pages/CheckoutPage.jsx` — guest detail and review screen
- `src/pages/PaymentPage.jsx` — payment selection and confirmation flow
- `src/pages/ConfirmationPage.jsx` — order confirmation page
- `src/hooks/useRestaurantExperience.js` — API loading hook
- `src/store/OrderingContext.jsx` — cart and checkout state management
- `src/features/menu/components/CategoryTabs.jsx` — category navigation UI
- `src/features/menu/components/MenuItemCard.jsx` — dish card UI

## Local development

```bash
cd apps/customer-app
npm install
npm run dev
```

## Build

```bash
cd apps/customer-app
npm run build
```
