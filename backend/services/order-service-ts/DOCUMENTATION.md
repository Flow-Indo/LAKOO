# Order Service Documentation

**Service:** order-service  
**Port:** 3006  
**Database:** order_db (PostgreSQL)  
**Language:** TypeScript (Node.js)  
**Business model:** Social commerce (Jan 2026)

---

## Table of Contents

1. [Overview](#overview)
2. [Key Concepts](#key-concepts)
3. [Architecture](#architecture)
4. [Order Lifecycle](#order-lifecycle)
5. [API Endpoints](#api-endpoints)
6. [Events (Outbox)](#events-outbox)
7. [Integration](#integration)
8. [Setup & Development](#setup--development)

---

## Overview

The Order Service is responsible for:

- Creating orders during checkout
- Storing immutable order snapshots (shipping + item snapshots)
- Managing order status transitions
- Publishing order events (transactional outbox)

This service **does not** manage:
- Payment gateway logic (belongs to `payment-service`)
- Seller payouts/settlement orchestration (belongs to `seller-service` + `wallet-service`)
- Shipment booking/tracking (belongs to `logistic-service`)

---

## Key Concepts

### No `factoryId`

LAKOO’s current social commerce model does **not** use `factoryId`.  
Orders are grouped by **seller**:

- **Seller product** → `sellerId` present → order is created as `orderSource = seller`
- **House brand product** → `sellerId = null` in product-service → order is created as `orderSource = brand`

### Order splitting

Checkout can include items from multiple sellers.  
This service creates **separate orders per seller** (and a separate order for house-brand items).

This matches:
- payment-service’s model (1 payment invoice per order)
- commission ledger uniqueness (`orderId + sellerId`)

---

## Architecture

Layering (Gold Standard):

```
routes → controllers → services → repositories → prisma
                      ↘ outbox
                      ↘ clients (payment/cart/product/auth)
```

Auth (Gold Standard):

- **Gateway trust (user-facing):** `x-gateway-key`, `x-user-id`, optional `x-user-role`
- **Service-to-service HMAC (internal):** `X-Service-Auth`, `X-Service-Name` signed with `SERVICE_SECRET`

---

## Order Lifecycle

### Checkout → payment initiation

1. Client calls `POST /api/orders` (via API gateway)
2. Order-service:
   - fetches product data from `product-service`
   - computes prices server-side (does not trust client prices)
   - splits items by sellerId (plus house-brand bucket)
   - writes orders + orderItems + outbox event `order.created`
3. Order-service calls `payment-service` to create invoice(s)
4. On success, order-service transitions each order to `awaiting_payment`

#### Idempotency (safe retry)

`POST /api/orders` requires an `idempotencyKey`.

If the client retries the same checkout with the same `idempotencyKey`, order-service:
- returns the existing order(s) created for that key
- re-uses payment-service idempotency keys so invoice creation is safe and repeatable

### Payment confirmation

1. Xendit sends webhook to `payment-service`
2. payment-service updates its ledger and publishes `payment.paid` (outbox)
3. payment-service makes a **best-effort** call to:
   - `PUT /api/orders/:orderId/status { newStatus: "paid" }` (service-to-service auth)

If order-service is temporarily down, the outbox event is still the source of truth for reconciliation.

### Delivery & completion

Shipping and tracking are managed by `logistic-service`.  
When an order is delivered, the platform should move the order to:
- `delivered` → then `completed` after confirmation/auto-complete policy.

---

## API Endpoints

### External (Gateway or Internal)

- `GET /health`
- `POST /api/orders` → checkout (creates order(s) and payment invoice(s))
- `GET /api/orders` → list orders  
  - Users only see their own orders; admin/internal can query any userId/sellerId
- `GET /api/orders/number/:orderNumber`
- `GET /api/orders/:id`
- `PUT /api/orders/:id/status` → **admin/internal only**
- `PUT /api/orders/:id/shipping-cost` → **admin/internal only**
- `POST /api/orders/:id/cancel`

### Admin

- `GET /api/admin/orders`
- `GET /api/admin/orders/:id`
- `PUT /api/admin/orders/:id/status`

Swagger:
- `GET /api-docs`

---

## Events (Outbox)

Transactional outbox table: `service_outbox`

Current events:
- `order.created`
- `order.status_changed`

---

## Integration

## Service-to-Service Authentication (Required)

Order-service uses the **Gold Standard** service-to-service HMAC headers on outbound calls (even if the target endpoint does not currently enforce them).

Required env:
- `SERVICE_SECRET`
- `SERVICE_NAME=order-service`

Headers sent:
- `X-Service-Auth`: `<serviceName>:<timestamp>:<hmac>`
- `X-Service-Name`: `<serviceName>`

Implementation:
- Header generation: `backend/services/order-service-ts/src/utils/serviceAuth.ts#L1`

### product-service

Used to retrieve product + variant data for immutable order-item snapshots.

Env:
- `PRODUCT_SERVICE_URL` (default `http://localhost:3002`)

Client:
- `fetchProduct(...)`: `backend/services/order-service-ts/src/clients/product.client.ts#L1`

### auth-service

Used to snapshot customer identity at order creation time.

Env:
- `AUTH_SERVICE_URL` (default `http://localhost:3001`)

Client:
- `fetchUser(...)`: `backend/services/order-service-ts/src/clients/auth.client.ts#L1`

### cart-service

Order-service clears the user's cart after checkout (best-effort, non-blocking).

Env:
- `CART_SERVICE_URL` (default `http://localhost:3003`)

Client:
- `clearUserCart(...)`: `backend/services/order-service-ts/src/clients/cart.client.ts#L1`

Endpoint used:
- `DELETE /api/cart/:userId`

### payment-service

Order-service calls payment-service to create invoice(s).  
payment-service calls order-service to set `paid` when webhook confirms payment.

Env:
- `PAYMENT_SERVICE_URL` (default `http://localhost:3007`)

### seller-service (dashboard + payouts)

Seller dashboard should not read commissions directly from payment-service.
Recommended interaction:

- Seller dashboard → `seller-service`
- `seller-service` calls `order-service` (internal auth) to fetch seller orders:
  - `GET /api/orders?sellerId=<sellerId>`
- `seller-service` drives weekly payouts by coordinating:
  - eligible payments/commissions from `payment-service`
  - payouts via `wallet-service`

---

## Setup & Development

### Environment Variables

See `.env.example`.

### Install
```bash
cd backend/services/order-service-ts
pnpm install
pnpm run db:generate
```

### Run
```bash
pnpm dev
```

### Build
```bash
pnpm build
pnpm start
```
