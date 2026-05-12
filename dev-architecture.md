```markdown
# 🍽️ QR-Based Restaurant Ordering Platform — Development Plan (MERN)

> Enterprise-level, multi-tenant SaaS platform.  
> This document is a **step-by-step action plan** for building the entire system — no fluff, just clear milestones and the exact project structure you need to start coding today.

---

## 📐 Overall Architecture (Diagram)

```
┌─────────────────────────────────────────────────────────────┐
│                     CLIENT BROWSERS                         │
├───────┬───────────┬────────────────┬──────────────────────┤
│Customer│  Admin    │   Kitchen      │   Superadmin/Owner   │
│ App    │  Panel    │   Display (KDS)│   Dashboard          │
│ (PWA)  │ (React)   │   (React)      │   (React)            │
└───┬───┴─────┬─────┴───────┬────────┴──────┬───────────────┘
    │         │             │               │
    └─────────┴──────┬──────┴───────────────┘
                     │ HTTP / WebSocket
              ┌──────▼──────┐
              │  EXPRESS    │
              │  API +      │
              │  Socket.IO  │
              └──────┬──────┘
                     │
              ┌──────▼──────┐
              │  MONGODB    │
              │  ATLAS      │
              └─────────────┘
```

**One backend, four frontends.**  
The **Superadmin** is a separate role that can view aggregated data across all restaurants and manage platform settings, while **Admin** only manages its own restaurant.

---

## ⚙️ Tech Stack

| Layer           | Technology                                      |
|-----------------|-------------------------------------------------|
| **Frontend**    | React 18 (Vite), MUI 5, React Router 6, Redux Toolkit, Socket.IO Client, i18next |
| **Backend**     | Node.js, Express, Mongoose, JWT, Socket.IO, Multer + Cloudinary, express-rate-limit, bcryptjs |
| **Database**    | MongoDB Atlas (via Mongoose)                   |
| **Realtime**    | Socket.IO                                      |
| **DevOps/CI**   | Docker (optional), GitHub Actions, Vercel / Render |
| **PWA**         | vite-plugin-pwa                                |
| **Testing**     | Vitest, React Testing Library, Supertest, mongodb-memory-server |

---

## 📁 Monorepo Folder Structure

```
qr-ordering-platform/
├── package.json                 # workspaces definition
├── .gitignore
├── .env.example
├── README.md
├── apps/
│   ├── server/                  # Express backend
│   ├── customer-app/            # Customer-facing PWA (React)
│   ├── admin-panel/             # Restaurant admin panel
│   ├── kitchen-display/         # Kitchen Display System (KDS)
│   └── superadmin-dashboard/    # Superadmin / Owner dashboard
├── packages/
│   ├── shared-models/           # Mongoose schemas, constants, types (shared across all workspaces)
│   └── ui-components/           # MUI extensions, shared UI components (DataTable, OrderCard, etc.)
└── scripts/                     # DB seeders, QR generators, utils
```

**We use npm workspaces** so that each `apps/*` is an independent Vite/Express project, but all can import from `packages`.

---

## 🚀 Development Phases (8 Phases)

### Phase 0 — Project Initialization
1. Create root `package.json` with:
   ```json
   { "private": true, "workspaces": ["apps/*", "packages/*"] }
   ```
2. Initialize `apps/server`:
   - `npm init -y`
   - Install: `express`, `mongoose`, `dotenv`, `cors`, `bcryptjs`, `jsonwebtoken`, `socket.io`, `multer`, `cloudinary`, `express-rate-limit`, `helmet`, `zod` (or Joi)
3. Create `packages/shared-models`:
   - Define Mongoose schemas: `User`, `Restaurant`, `Table`, `MenuCategory`, `MenuItem`, `Order`, `OrderItem`, `Guest`, `AnalyticsEvent`.
   - Export all models so any app can reuse them.
4. Set up `.env` in server:
   ```
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=mongodb+srv://...
   JWT_SECRET=your-secret
   JWT_EXPIRES_IN=7d
   CLOUDINARY_CLOUD_NAME=...
   CLOUDINARY_API_KEY=...
   CLOUDINARY_API_SECRET=...
   ```
5. Create `apps/server/src/index.js`: connect MongoDB, set up Express with middleware, start HTTP server, attach Socket.IO.

---

### Phase 1 — Backend Core (Auth, REST APIs, Multi-Tenancy)
**Goal:** Admin/Kitchen/Superadmin login, menu CRUD, table management, order placement.

#### 1.1 User Auth & Roles
- **User model:** `name, email, passwordHash, role` (enum: `customer, waiter, chef, manager, owner, superadmin`), `restaurantId` (optional, null for superadmin).
- Routes:
  - `POST /api/auth/register` (admin creates staff)
  - `POST /api/auth/login` → returns JWT with `{ userId, role, restaurantId }`
- **Middleware:**
  - `protect` – verifies JWT and attaches `req.user`
  - `authorize(...roles)` – checks role array

#### 1.2 Restaurant Management
- Model: `name, slug, logo, settings` (tax, service charge, prep time unit), `plan` (starter/standard/premium), `active`.
- Endpoints:
  - `POST /api/restaurants` (superadmin only)
  - `GET /api/restaurants/:id` (admin views own; superadmin views any)
  - `PATCH /api/restaurants/:id` (owner/manager)
- All queries for non-superadmin are scoped to the user’s `restaurantId`.

#### 1.3 Table Management
- Model: `restaurantId, tableNumber, qrCode (base64 string), status (empty/occupied/reserved)`
- Admin CRUD endpoints (manager/owner).
- Use `qrcode` package to generate QR image on table creation.

#### 1.4 Menu Management
- `MenuCategory`: `restaurantId, name, displayOrder, isActive`
- `MenuItem`: `restaurantId, categoryId, name, description, price, spiceLevel, ingredients[], allergens[], image, prepTime, isAvailable, modifiers[], tags[]`
- Admin endpoints: full CRUD (image upload via Multer → Cloudinary)
- **Public endpoint:** `GET /api/menu/:restaurantId` — called by customer app after QR scan.

#### 1.5 Order Lifecycle
- `Order`: `restaurantId, tableId, guestId (optional), items[], subtotal, tax, total, status (received/accepted/preparing/ready/served/cancelled), notes, createdAt`
- `OrderItem`: `itemId, name, quantity, modifiers[], itemPrice, specialInstructions`
- Routes:
  - `POST /api/orders` (customer app, no JWT — just QR data + guest info)
  - `GET /api/orders/live/:restaurantId` (admin/kitchen)
  - `PATCH /api/orders/:id/status` (admin/kitchen)
- **Multi-tenancy:** order placement automatically sets `restaurantId` from resolved table.

#### 1.6 Superadmin Endpoints
- `GET /api/superadmin/restaurants` — all restaurants
- `GET /api/superadmin/analytics` — aggregated orders, revenue, etc.
- `PATCH /api/superadmin/restaurants/:id/plan` — change subscription plan
- Separate router protected by `authorize('superadmin')`.

**Testing Phase 1:** Use Postman/Thunder Client to hit every endpoint. Verify role-based access and data isolation.

---

### Phase 2 — Customer App (PWA, MUI)
**App:** `apps/customer-app/` using Vite + React + MUI.

#### Routes & Screens
| Route               | Screen                     | Key Components                                          |
|---------------------|----------------------------|---------------------------------------------------------|
| `/table/:restaurantId/:tableId` | Welcome / Table ID        | Restaurant branding, language selector, guest name/phone capture |
| `/menu`             | Menu Home                  | Category tabs (Chips), search bar, filter chips (veg, spicy, etc.), quick-add button, shimmer loading |
| `/item/:itemId`     | Item Detail + Customization| Image, spice meter, allergens, modifiers (checkboxes/add-ons), pairing suggestions, special instructions text box |
| `/cart`             | Cart (bottom sheet)        | Live price breakdown (subtotal → tax → total), coupon input, place order button |
| `/order/:orderId`   | Order Tracking             | Status timeline (animations), estimated time remaining, reorder button, request bill / call waiter |
| `/feedback`         | Post-Order Feedback        | Star rating, text feedback, loyalty prompt             |

#### QR Scan Flow
- QR encodes URL: `https://yourapp.com/table/<restaurantId>/<tableId>`
- App reads these from URL, fetches restaurant config + menu, sets theme dynamically.

#### Realtime Order Updates
- After placing order, connect to Socket.IO room `order:<orderId>`.
- Listen for `order:status-updated` events and update UI.

#### PWA Setup
- Install `vite-plugin-pwa`, configure manifest for standalone mobile experience, add service worker for caching menu and offline support.

**Testing Phase 2:** Navigate to `localhost:3000/table/<restaurantId>/<tableId>` (with seeded data). Create orders and verify cart flow. Use different `restaurantId` to test multi-brand themes.

---

### Phase 3 — Admin Panel (Restaurant Manager / Owner)
**App:** `apps/admin-panel/` (Vite + MUI).

#### Routes
| Route              | Screen                 | Features                                           |
|--------------------|------------------------|----------------------------------------------------|
| `/login`           | Login                  | Email/password, redirect based on role             |
| `/dashboard`       | Home Dashboard         | Live KPIs (orders, revenue, active tables), peak hour chart, top items, kitchen performance snapshot, table occupancy map |
| `/orders`          | Live Orders            | Card view, status update buttons, bulk actions, print KOT, special instructions highlighted, order history with filters |
| `/menu`            | Menu Management        | Category + Item CRUD, drag-drop reorder, image crop/upload, availability toggle, seasonal menu scheduler, bulk import (CSV), preview as customer |
| `/tables`          | Table Management       | Table list, QR generate & download (single/bulk), custom QR design, table status, merge/split tables |
| `/billing`         | Billing & Coupons      | Order bill history, create/update discount coupons, view tip/service charge, end-of-day report |
| `/customers`       | Guest CRM              | Guest list (email, phone, visit count, preferences), feedback history, automated marketing triggers (birthday offers) |
| `/staff`           | Staff & Roles          | Create staff accounts, assign roles (owner,manager,chef,waiter,cashier), permission matrix, activity log |
| `/analytics`       | Analytics              | Charts (recharts) for sales, items, kitchen efficiency, cancellation rates; export PDF/CSV, email scheduled reports |
| `/settings`        | Settings               | Restaurant profile, branding (color/logo), tax configuration, printer setup |

#### Real-Time
- Connect to Socket.IO room `restaurant:<id>:admin`.
- On `order:new` → push toast notification + append to live order list.

#### State & Theme
- **Redux Toolkit slices:** `auth`, `restaurant`, `orders` (cached/real-time).
- **MUI theme:** dynamically generated from restaurant’s `brandColor` and logo.

**Testing Phase 3:** Login as admin, seed data, perform CRUD operations. Simulate a customer order via Postman and watch it appear in the live orders screen.

---

### Phase 4 — Kitchen Display System (KDS)
**App:** `apps/kitchen-display/` (Vite + MUI, optimised for large touchscreens).

#### Routes
- `/login` — only `chef` or `manager` roles can log in.
- `/dashboard` — the main KDS view.

#### KDS Dashboard Layout
- **Columns:** New Orders → Accepted → Preparing → Ready.
- Each `OrderCard` displays:
  - Table number & order number
  - Item list (with modifiers and special notes)
  - Priority indicator (colour-coded by time pending: red >10 min, yellow >5, green)
  - Prep timer since order arrival
  - Action buttons: Accept, Item Ready, Order Ready, Delay (with reason)
- **Filters:** by station (Hot Kitchen, Cold Section, Beverages) if multi-station; by veg/non-veg; by table range.
- **Archive view:** all completed orders of the day.
- **Alerts:** Web Audio API sound on new order; 10-minute reminder chime; voice alert option (text-to-speech).
- **Print support:** click to send order ticket to thermal printer (future integration).

#### Realtime
- Room: `restaurant:<id>:kitchen`
- Listen for `order:new` and `order:status-updated`.

**Testing Phase 4:** Open two browser tabs — one customer app, one KDS. Place an order and verify it appears instantly. Test status changes and sound alerts.

---

### Phase 5 — Superadmin / Owner Dashboard
**App:** `apps/superadmin-dashboard/` — only accessible to `superadmin` role.

#### Routes
| Route                | Screen                | Description                                      |
|----------------------|-----------------------|--------------------------------------------------|
| `/login`             | Login                 | Superadmin credentials (no restaurantId)         |
| `/restaurants`       | All Restaurants       | List all tenants, activate/deactivate, change plan, view subscription status |
| `/analytics`         | Aggregated Analytics  | Combined sales, orders, top restaurants, trends  |
| `/subscriptions`     | Subscription Management | Plan definitions, pricing, payment history (future) |
| `/settings`          | Platform Settings     | Global config (email templates, default language) |

**Backend routes** for superadmin were created in Phase 1. The frontend just consumes those APIs.

**Testing Phase 5:** Create multiple restaurant seeds; login as superadmin; view aggregated data and modify plans.

---

### Phase 6 — Realtime Integration (Socket.IO)
- **Server setup:** Attach Socket.IO to the same HTTP server. Authenticate connections using a JWT (passed as auth token or query param). Once authenticated, join the user to the appropriate room:
  - Admin/Manager: `restaurant:<restaurantId>:admin`
  - Chef: `restaurant:<restaurantId>:kitchen`
  - Customer (after order): `order:<orderId>`
- **Events:**
  - `order:new` → broadcast to admin and kitchen rooms of that restaurant.
  - `order:status-updated` → emitted to the order room (customer) and also relayed to admin/kitchen to keep all in sync.
- **Client connection:** Each frontend app creates a Socket.IO client with the server URL and auth token, then listens for relevant events.

---

### Phase 7 — Security Layers
- **CORS:** Allow only frontend origins.
- **Rate Limiting:** Apply `express-rate-limit` on `/api/auth/login` and `/api/orders` creation endpoints.
- **Helmet:** for secure HTTP headers.
- **Password hashing:** bcrypt with salt rounds.
- **JWT:** short expiry (7 days), refresh token mechanism optional for MVP.
- **Input validation:** Zod schemas on all request bodies (shared from `packages/shared-models`).
- **Data isolation:** Every Mongoose query performed by non-superadmin automatically filters by `req.user.restaurantId`. This is ensured by a middleware that adds the filter to `req.query` or a custom Mongoose plugin.
- **Role-based guards:** every protected route has `authorize(...roles)`.

---

### Phase 8 — Testing & Quality (Without a Real Restaurant)
You don’t need a physical restaurant to build and test everything. Here’s how:

- **Seed Script:** Create `scripts/seed.js` that populates the database with:
  - 2–3 restaurants (one active, one inactive)
  - Full menu with categories and items, tables, QR codes.
  - Users: an owner, a manager, a chef, a waiter, and a superadmin.
- **Customer app testing:** Navigate directly to `http://localhost:3000/table/<restaurantId>/<tableId>` (the exact ID from seed). No physical QR needed.
- **KDS testing:** Run KDS on `localhost:3002`, log in as chef. Use the customer app in another tab to place an order; KDS should update in real-time.
- **Admin testing:** Log in as manager on `localhost:3001` and test CRUD, live orders, analytics.
- **API testing (automated):** Use **Supertest** for Express routes. Use an in-memory MongoDB (`mongodb-memory-server`) for test databases.
- **Unit tests:** Vitest for backend services and middleware; React Testing Library + MSW for frontend components.
- **End-to-end (later):** Cypress or Playwright to automate full customer journey.

---

## 🧪 Local Development Environment

1. **MongoDB:** Use Atlas free tier or run a local instance via Docker.
2. **Start backend:**
   ```bash
   cd apps/server && npm run dev   # port 5000
   ```
3. **Start each frontend** (separate terminals):
   - `customer-app` → port 3000
   - `admin-panel` → port 3001
   - `kitchen-display` → port 3002
   - `superadmin-dashboard` → port 3003
4. **Vite proxy config** (for all frontend apps):
   ```js
   // vite.config.js
   export default {
     server: {
       proxy: {
         '/api': 'http://localhost:5000',
         '/socket.io': {
           target: 'http://localhost:5000',
           ws: true
         }
       }
     }
   }
   ```

---

## 🗂️ Example Sub-Project Structure (admin-panel)

```
apps/admin-panel/
├── public/
├── src/
│   ├── api/              # axios instance, API call functions
│   ├── assets/
│   ├── components/       # shared: DataTable, ProtectedRoute, Sidebar, AlertDialog
│   ├── hooks/            # useAuth, useSocket, useOrders
│   ├── layouts/          # MainLayout (sidebar + header + content)
│   ├── pages/            # one folder per route (Dashboard/, Orders/, Menu/, etc.)
│   ├── store/            # Redux slices (authSlice, restaurantSlice, ordersSlice)
│   ├── theme/            # MUI theme creation function
│   ├── App.jsx
│   └── main.jsx
├── .env
├── vite.config.js
└── package.json
```

The other apps (customer, kitchen, superadmin) follow a similar pattern, with pages and state tailored to their roles.

---

## 📈 Enterprise-Level Considerations

- **Code Quality:** ESLint + Prettier across all workspaces. Pre-commit hooks with Husky.
- **Git Workflow:** `main` branch protected, feature branches per module, PRs with review.
- **Environment Variables:** each app has its own `.env.example`. Secrets are only in backend.
- **State Management:** Admin/KDS use Redux Toolkit; Customer app uses React Context + useReducer (simpler for that flow). i18next configured from day one.
- **Monorepo Sharing:** All Mongoose models, Zod validators, and common constants are in `packages/shared-models` so they stay in sync. Shared UI components (MUI customized) live in `packages/ui-components`.
- **Error Handling:** Backend uses a global error handler middleware. Frontend shows user-friendly toasts (via notistack or similar).

---

## 🚦 Where to Start – Immediate Action Plan

1. **Set up the monorepo** and install base dependencies (Phase 0).
2. **Build the backend models and auth system** (Phase 1). This takes about 2–3 days.
3. **Develop the Admin Panel** first — it lets you input menu data, manage tables, and test the whole data flow. Build login, menu CRUD, and table management screens.
4. **Build the Customer App** — QR flow, menu display, cart, and order placement.
5. **Build the Kitchen Display** — start with polling, then upgrade to realtime once Socket.IO is in place.
6. **Build the Superadmin Dashboard** last, after the core platform is functional.

Test every API endpoint as you go. Use the seed script to simulate a multi-restaurant environment.

---

**This is your complete, no-theory, step-by-step development blueprint.**  
You have the architecture, the roadmap, and the exact structure. Now open your code editor and start building — one phase at a time. 🚀
```