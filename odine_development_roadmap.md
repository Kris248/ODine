# ODine Development Roadmap
## Customer App + KDS Sync Plan
**Version:** 1.0  
**Focus:** Dine-in QR ordering, waiter verification, live order tracking, and kitchen coordination  
**Not in scope:** Delivery logistics, payroll, inventory ERP, accounting system

---

## 1. Product Vision

ODine is a **dine-in restaurant operating system**.  
It should feel like a smooth daily habit for customers, waiters, and chefs.

The product should solve these real restaurant problems:

- customers do not know order status
- waiters are overused for simple questions
- kitchen and table communication is slow
- bill finalization takes time
- owners need EOD sales/reporting fast

The system must stay **simple**, **fast**, and **low-friction**.

---

## 2. Core Product Modules

ODine is split into 3 modules:

1. **Customer-App**  
   QR scan, browse menu, place order, track order, request waiter, request bill.

2. **KDS-App**  
   Kitchen order queue, accept/prepare/ready/served workflow, grouping, timers, station handling.

3. **Admin/App Report Layer**  
   Menu control, table/session overview, daily sales, dish analytics, order history, restaurant insights.

---

## 3. Biggest Product Idea

### Table-first dine-in flow
Each restaurant table has a QR code.

Customer flow:
1. Scan QR
2. Open table session
3. Browse menu
4. Add items slowly and comfortably
5. Request order verification
6. Waiter confirms
7. Kitchen receives order
8. Customer sees live status
9. Customer requests final bill
10. Restaurant completes payment on cash / counter / online as needed

This removes the need to repeatedly call the waiter for every small thing.

---

## 4. Feature Count Summary

### Customer-App features to build
**14 major features**

### KDS features to build
**12 major features**

### Shared realtime sync and backend features
**8 major features**

### Total features in this development roadmap
**34 major features**

---

# 5. Customer-App Development Roadmap

## 5.1 Must-have features

### 1) QR Table Session
Each scan should open a live table session with:
- restaurant id
- table id
- seat count if available
- session timer
- guest state

### 2) Premium Menu Browsing
Menu should be:
- fast
- mobile-first
- category-first
- visually clean
- easy to browse without waiter help

### 3) Live Order Request Flow
Customer should not directly send everything to the kitchen without verification.

Flow:
- draft order
- request verification
- waiter verifies
- order confirmed
- kitchen receives it

### 4) Live Order Tracking
Customer should see:
- Pending
- Accepted
- Preparing
- Ready
- Served

Must update in real time.

### 5) Sticky Cart
Cart should stay accessible without blocking browsing.

Must show:
- item count
- current amount
- quick open
- smooth animation

### 6) Seat-based Ordering
For shared tables:
- Seat 1
- Seat 2
- Seat 3
- shared table order

This helps waiter and kitchen visibility.

### 7) Call Waiter Actions
Quick buttons for:
- Water
- Tissue
- Spoon
- Assistance
- Bill help

### 8) Live Bill Summary
Bill should keep updating as items are added or removed.

### 9) Final Bill Request
Customer should be able to request final bill from the app.

### 10) Order History
Customer should view previous sessions/orders if needed.

### 11) Dynamic Availability
Out-of-stock items should be hidden or disabled instantly.

### 12) Dish Modifiers
Support:
- extra cheese
- no onion
- spicy
- extra patty
- custom notes

### 13) Search and Filters
Search should support:
- fast text search
- category jump
- veg / non-veg filters
- popular items

### 14) Notifications
Customer should get instant messages for:
- order verified
- order accepted
- preparing
- ready
- waiter notified
- bill ready

---

## 5.2 Customer-App UX rules

- light and premium look
- no delivery-app feeling
- low scroll
- large readable cards
- fast action buttons
- minimal clutter
- clean spacing
- clear progress states

---

# 6. KDS Development Roadmap

## 6.1 Must-have kitchen features

### 1) Live Incoming Order Queue
Kitchen should see every verified order instantly.

### 2) Compact Order Cards
Cards must show:
- table number
- seat number
- time elapsed
- item count
- priority
- status

### 3) Order Status Workflow
Chef can update:
- Pending
- Accepted
- Preparing
- Ready
- Served

### 4) Table-wise View
Chef should be able to filter by table.

### 5) Seat-wise Visibility
Orders from the same table should show clearly which seat they came from.

### 6) Batch Cooking / Group View
Kitchen should be able to group similar items:
- burgers
- fries
- drinks
- biryani
- pasta

This reduces repeated work.

### 7) Delay Indicators
Old orders should be highlighted clearly.

### 8) Station Filters
If needed, items can be seen by station:
- grill
- fryer
- drinks
- dessert
- main kitchen

### 9) Live Notifications
Kitchen should get alerts for:
- new order
- order verification
- bill request
- delayed ticket
- urgent table

### 10) One-touch Actions
Chef should not need too many clicks:
- accept
- start
- ready
- served

### 11) TV / Tablet / Mobile Responsive View
KDS must work on:
- chef TV
- tablet
- mobile

### 12) Low-scroll Design
Most important info must be visible immediately.

---

# 7. Customer-App ↔ KDS Sync Design

## 7.1 Sync principle

Customer-App and KDS must speak through a real-time event system.

### Recommended sync layers
- WebSocket for live events
- REST API for initial data load
- local fallback state for poor network
- optional polling fallback if socket disconnects

---

## 7.2 Shared order lifecycle

```txt
Draft
→ Verification Requested
→ Waiter Verified
→ Sent To Kitchen
→ Accepted
→ Preparing
→ Ready
→ Served
```

### Who changes what?
- **Customer-App** creates draft and requests verification
- **Waiter/Owner** verifies
- **KDS** accepts and updates progress
- **Customer-App** reflects all changes live

---

## 7.3 Important live events

### From Customer-App
- `session.opened`
- `order.draft_created`
- `order.verification_requested`
- `order.item_added`
- `order.final_bill_requested`
- `waiter.assistance_requested`

### From KDS
- `order.verified`
- `order.accepted`
- `order.preparing`
- `order.ready`
- `order.served`
- `order.delayed`

### Shared events
- `bill.updated`
- `menu.item_unavailable`
- `session.closed`
- `order.synced`

---

## 7.4 Sync behavior rules

### Rule 1: Customer sees live state changes instantly
If chef clicks `Preparing`, customer UI updates immediately.

### Rule 2: Bill updates in real time
If customer adds another item, both bill summary and KDS ticket state must reflect it.

### Rule 3: Session must survive refresh
If the page reloads, the session should restore from:
- session id
- table id
- last order state

### Rule 4: Offline fallback
If socket disconnects:
- show connection warning
- retry sync
- keep local cart/session state

### Rule 5: No duplicate orders
Order ids and session ids must be unique to avoid double submission.

---

# 8. Backend Data Needed

## 8.1 Core entities
- Restaurant
- Table
- Seat
- Session
- Menu Item
- Modifier
- Cart
- Order
- Order Item
- Bill
- Payment State
- Waiter Request
- Notification
- Daily Report

## 8.2 Important state fields
- order status
- table id
- seat id
- requested at
- verified at
- accepted at
- prepared at
- served at
- bill total
- tax breakdown
- payment mode

---

# 9. EOD Reporting Requirements

At restaurant closing time, the system should generate a fast daily report.

## Must show
- total sales
- total orders
- average order value
- top dishes
- low-selling dishes
- peak hour
- slow hour
- average prep time
- delayed tickets
- table occupancy

This should be generated automatically without manual counting.

---

# 10. Recommended Build Phases

## Phase 1 — Customer-App live tracking
- QR session
- menu
- cart
- order request
- verification
- live status tracker

## Phase 2 — KDS core workflow
- live queue
- status buttons
- delay view
- compact cards
- responsive board

## Phase 3 — Bill and waiter flow
- live billing
- final bill request
- waiter actions
- notifications

## Phase 4 — Analytics
- daily sales report
- dish analytics
- table analytics
- prep analytics

## Phase 5 — Polish
- animations
- skeletons
- empty states
- performance tuning
- accessibility

---

# 11. Files and folders that should exist

```txt
src/
├── components/
├── features/
│   ├── customer/
│   ├── order-tracking/
│   ├── waiter-actions/
│   └── billing/
├── pages/
├── layouts/
├── hooks/
├── services/
├── sockets/
├── store/
├── theme/
├── utils/
├── assets/
└── types/
```

---

# 12. Final Product Goal

ODine should feel like a daily habit inside restaurants.

The product should make the experience:
- faster
- clearer
- smoother
- more premium
- less dependent on shouting for waiter help

The best result is when a customer thinks:

> “I just scan, order, track, and enjoy.”
