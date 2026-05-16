# ODine Kitchen Display (KDS)

## Overview

The ODine Kitchen Display System (KDS) is the live chef-facing board for payment-confirmed restaurant orders.
It provides order intake, status tracking, and real-time updates for kitchen teams.

## Key Features

- **Chef login**
  - Secure kitchen login via email/password
  - Session stored in local storage for persistent access

- **Live order board**
  - Fetches current orders from the backend
  - Displays lanes for new, preparing, ready, delayed, and all orders
  - Uses a grid layout optimized for large kitchen screens

- **Real-time updates**
  - Socket-based updates for payment-confirmed orders
  - Order status changes sync instantly across apps
  - Sound alert when a new paid order arrives

- **Order lifecycle controls**
  - Accept orders
  - Mark orders as preparing
  - Mark orders ready
  - Mark orders served

- **Order details**
  - Shows guest table, order number, items, modifiers, and special instructions
  - Displays order age, ETA, and prep priority
  - Highlights delayed orders

## App Flow

1. Chef navigates to the KDS app.
2. The kitchen logs in using `loginKds()`.
3. The dashboard loads current orders via `fetchOrders()`.
4. `useKdsRealtime()` connects to the socket server for live updates.
5. Incoming paid orders are appended to the board.
6. Kitchen staff move orders through statuses with `updateOrderStatus()`.
7. The board remains synced with backend events and live updates.

## Architecture

### Frontend

- Built with React and Vite
- Uses React Router for login protection and dashboard routing
- Uses Material UI for the kitchen UI
- Theme overrides are provided by `src/theme.js`

### State & data

- `App.jsx` contains the kitchen app shell, login screen, and dashboard
- Local storage is used for session persistence via `kdsApi.js`
- Orders are filtered and grouped into board columns via `orderUtils.js`

### Real-time integration

- `useKdsRealtime()` uses `socket.io-client`
- Connects to `VITE_SOCKET_URL` or `http://localhost:5000`
- Joins the restaurant and outlet room as a `kds` client
- Listens for events:
  - `ORDER_PAID_CONFIRMED`
  - `ORDER_STATUS_UPDATED`

### API Integration

- Backend API root is set by `VITE_API_URL` or defaults to `http://localhost:5000/api`
- `kdsApi.js` handles auth request, login, order fetch, and status updates
- Auth token is sent in `Authorization: Bearer ...` headers

## Files of interest

- `src/App.jsx` — main kitchen display app and dashboard
- `src/hooks/useKdsRealtime.js` — socket connection for live order events
- `src/services/kdsApi.js` — kitchen API requests and auth storage
- `src/utils/orderUtils.js` — order filtering and board column construction
- `src/theme.js` — KDS visual theme

## Local development

```bash
cd apps/kitchen-display
npm install
npm run dev
```

## Build

```bash
cd apps/kitchen-display
npm run build
```
