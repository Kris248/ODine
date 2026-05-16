# ODine Admin Panel

## Overview

The ODine Admin Panel is the restaurant management workspace for owners, managers, and staff.
It provides a central control console for live orders, menu publishing, table status, staff management, analytics, and restaurant settings.

## Key Features

- **Secure login / workspace access**
  - Admin users sign in with email/password
  - Redirects to the workspace only after authentication

- **Dashboard / Overview**
  - High-level restaurant metrics
  - Active orders summary
  - Occupied table count
  - Menu availability status
  - Staff access overview

- **Orders management**
  - Live order list
  - Order status updates
  - Kitchen and service visibility for active orders

- **Menu publishing**
  - Create and manage menu categories
  - Add new menu items
  - Enable / disable item availability
  - Organize the menu for customer-facing QR ordering

- **Tables management**
  - Create dining tables
  - Track table status (occupied, available, etc.)
  - Support multi-table restaurant floor layout workflows

- **Staff management**
  - Create staff accounts
  - Manage restaurant access for operational roles

- **Analytics**
  - Order insights and trends
  - Revenue metrics
  - Guest spending and order volume analysis

- **Restaurant settings**
  - Update restaurant profile
  - Configure currency, tax, service charge, and brand color
  - Manage visitor-facing workspace details

## Architecture

### Frontend

- Built with React and Vite
- Uses React Router for page navigation
- Uses context providers for app state:
  - `SessionProvider` handles authentication state
  - `AdminWorkspaceProvider` manages restaurant workspace data
- Modular admin pages are rendered inside `WorkspacePage` using route-based modules

### Main app flow

1. User opens admin panel
2. `AppRouter` checks session state
3. Unauthenticated users are sent to `/login`
4. Authenticated users are shown the workspace routes:
   - `/` → Overview
   - `/orders`
   - `/menu`
   - `/tables`
   - `/staff`
   - `/analytics`
   - `/settings`

### Admin workspace bundle

The app loads a workspace bundle from the server via `fetchWorkspaceBundle()`:
- `/restaurants/me`
- `/tables`
- `/menu/categories`
- `/menu/items`
- `/orders`
- `/staff`

### Data & actions

The workspace provider exposes actions for:
- refreshing the workspace
- creating tables
- updating table status
- creating menu categories and items
- toggling menu item availability
- creating staff accounts
- updating order status
- saving restaurant profile changes
- ingesting live order events

### UI layout

- The admin workspace is wrapped in `AdminLayout`
- A sidebar navigation exposes the main modules
- The main content area renders module pages and status banners
- The layout is designed for operational clarity and quick control

## Local development

From the workspace root:

```bash
cd apps/admin-panel
npm install
npm run dev
```

Then open the Vite dev URL shown in the terminal.

## Build

```bash
cd apps/admin-panel
npm run build
```

## Files of interest

- `src/App.jsx` — app entrypoint
- `src/app/AppRouter.jsx` — login + protected routes
- `src/pages/WorkspacePage.jsx` — app workspace shell and route mountpoint
- `src/layouts/AdminLayout.jsx` — sidebar + main admin layout
- `src/store/SessionContext.jsx` — auth session state
- `src/store/AdminWorkspaceContext.jsx` — workspace data + actions
- `src/services/api/workspaceApi.js` — workspace API integration
- `src/modules/*` — feature modules for overview, orders, menu, tables, staff, analytics, settings

## Notes

This admin panel is part of the larger ODine ecosystem and works with the server backend and the customer-facing ordering app.

The app relies on the shared package `@odine/shared` for shared constants and interfaces.
