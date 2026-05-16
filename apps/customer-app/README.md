# ODine Customer App

ODine Customer App is the guest-facing dine-in ordering experience for QR table service.

It now includes:
- light premium mobile-first UI
- QR table session flow
- menu browsing and category navigation
- cart and checkout
- payment confirmation
- live order tracking with real-time updates

## Main flow

1. Customer scans a QR code.
2. The app opens `/table/:restaurantId/:tableId`.
3. Customer browses the menu and adds dishes.
4. Customer reviews cart and checkout details.
5. Customer selects payment and confirms the order.
6. The app opens a live order view.
7. Chef status updates reflect in the customer UI through polling/socket/fallback sync.

## New live tracking behavior

The customer app now tracks:
- Pending
- Accepted
- Preparing
- Ready
- Served

It uses:
- socket.io updates when available
- polling fallback
- local mock progression for demo mode

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
