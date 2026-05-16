# ODine Customer-App Roadmap (MVP → Production)

## Vision

ODine Customer-App is a premium QR-based dine-in ordering web application focused on:

* fast ordering
* minimal waiter dependency
* premium restaurant experience
* smooth mobile-first UX
* real-time kitchen communication

The goal is NOT to become another delivery app.

The goal is:

> “Restaurant dining operating experience.”

---

# CURRENT CORE FLOW

## Existing

* QR scan
* menu browsing
* add to cart
* checkout
* order placement
* payment flow
* order confirmation

---

# PHASE 1 — REQUIRED MVP FEATURES

(Highest Priority)

These are mandatory before onboarding restaurants seriously.

---

# 1. Live Order Tracking

## Goal

Customer should see real-time order states.

## Status Flow

```txt
Pending
→ Accepted
→ Preparing
→ Ready
→ Served
```

## UI

* timeline tracker
* animated progress states
* live socket updates

## Required

* websocket sync
* order status component
* order history state

---

# 2. Sticky Floating Cart

## Goal

Cart should always stay accessible.

## Features

* floating bottom bar
* live item count
* total amount
* expand animation
* smooth transitions

## UX Notes

* should not block menu browsing
* mobile-first
* compact design

---

# 3. Seat-Based Ordering

## Goal

Allow multiple guests on same table.

## Features

* Seat 1 / Seat 2 selection
* shared dishes
* seat tagging

## Benefits

* avoids bill confusion
* easier serving
* better KDS mapping

---

# 4. Call Waiter System

## Goal

Reduce customer frustration.

## Options

* Water
* Tissue
* Bill
* Assistance

## UI

* floating FAB button
* instant confirmation
* real-time notification to staff

---

# 5. Bill Request Flow

## Features

* request bill
* split bill
* pay individually
* UPI integration support

## Important

Should work smoothly even before full payment gateway integration.

---

# 6. Dynamic Dish Availability

## Goal

Hide unavailable items instantly.

## Features

* out-of-stock badge
* unavailable overlay
* disable add-to-cart

## Sync

Connected with KDS/Admin.

---

# 7. Dish Modifiers

## Examples

Burger:

* extra cheese
* spicy
* no onion
* extra patty

## Required

* dynamic modifier system
* pricing updates
* modifier summary

---

# 8. Excellent Search System

## Features

* fast search
* typo tolerance
* category search
* veg/non-veg filters

## UX

Search should feel instant.

---

# 9. Smart Category Navigation

## Goal

Long menus should be easy to browse.

## Features

* sticky category tabs
* auto-highlight while scrolling
* smooth category jump

---

# 10. Order History

## Features

* previous orders
* reorder items
* repeat full order

## Business Impact

Increases repeat purchases.

---

# PHASE 2 — PREMIUM UX FEATURES

---

# 11. Skeleton Loading States

## Goal

Avoid blank loading screens.

## Required

* menu skeletons
* cart skeletons
* order skeletons

---

# 12. Beautiful Empty States

## Cases

* empty cart
* no orders
* unavailable menu

## UX

Should feel premium and polished.

---

# 13. Real-Time Notifications

## Examples

* order accepted
* preparing
* ready soon
* waiter coming

## Types

* toast
* subtle popup
* bottom sheet

---

# 14. Upselling Engine

## Examples

After burger:
Suggest:

* fries
* coke

## Goal

Increase order value.

---

# 15. Offer & Combo System

## Examples

* combo meals
* chef specials
* happy hour
* BOGO offers

---

# 16. Persistent Cart

## Goal

Cart survives:

* refresh
* network issues
* accidental close

## Storage

* localStorage
* indexedDB later

---

# 17. Offline Recovery

## Goal

Weak internet handling.

## Features

* retry requests
* queue pending actions
* restore session

---

# PHASE 3 — ADVANCED EXPERIENCE

---

# 18. Customer Feedback Flow

## After Payment

Collect:

* food rating
* service rating
* ambience

---

# 19. Dining Session System

## Features

* session timer
* active guests
* live table session

## Future Use

Analytics + billing.

---

# 20. Smart Recommendations

## Based On

* popular dishes
* previous selections
* table trends

---

# 21. Accessibility Improvements

## Features

* larger touch areas
* contrast modes
* readable fonts

---

# 22. Performance Optimization

## Required

* lazy loading
* virtualization
* optimized image rendering

## Important

Restaurant tablets are often weak devices.

---

# UI DESIGN RULES

---

# Design Identity

## Style

* modern
* light
* premium
* minimal

## Avoid

❌ clutter
❌ huge rounded blobs
❌ delivery-app feel

---

# Colors

* ivory white
* soft gray
* subtle emerald accent
* warm orange CTA

---

# Layout Rules

* mobile-first
* one-hand usage
* low scrolling
* large tap targets

---

# Animation Rules

* subtle only
* smooth transitions
* fast feedback

---

# TECHNICAL STRUCTURE TO MAINTAIN

## Keep Business Logic Separate

Do NOT mix:

* UI
* API
* cart logic
* sockets

---

# Suggested Structure

```txt
src/
├── components/
├── pages/
├── layouts/
├── hooks/
├── services/
├── store/
├── sockets/
├── utils/
├── theme/
├── animations/
├── features/
```

---

# IMPORTANT BUSINESS PRIORITY

Focus first on:

1. speed
2. stability
3. real-time experience
4. ease of ordering

Before adding:

* AI
* loyalty
* gamification
* unnecessary complexity

---

# FINAL PRODUCT POSITIONING

ODine should feel like:

> “A premium restaurant operating experience.”

NOT:

> “another QR menu.”
