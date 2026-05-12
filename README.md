# ODine MVP

ODine is a multi-surface restaurant ordering MVP with:

- Express + MongoDB backend
- Admin panel for menu, tables, staff, and orders
- Customer ordering app
- Kitchen display system

## Workspace apps

- `apps/server`
- `apps/admin-panel`
- `apps/customer-app`
- `apps/kitchen-display`
- `packages/shared`

## Quick start

1. Install dependencies with `npm install`
2. Copy `.env.example` to `.env`
3. Start MongoDB locally or update `MONGODB_URI`
4. Seed demo data with `npm run seed`
5. Run each app:
   - `npm run dev:server`
   - `npm run dev:admin`
   - `npm run dev:customer`
   - `npm run dev:kds`
