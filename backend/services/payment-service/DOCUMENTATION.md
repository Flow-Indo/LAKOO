# Payment Service Documentation

**Service:** payment-service  
**Port:** 3007  
**Database:** payment_db (PostgreSQL)  
**Language:** TypeScript (Node.js)  
**Last Updated:** 2026-02-03  

---

## Table of Contents

1. [Overview](#overview)
2. [Responsibilities](#responsibilities)
3. [Architecture](#architecture)
4. [Core Flows](#core-flows)
5. [API Endpoints](#api-endpoints)
6. [Events (Outbox)](#events-outbox)
7. [Integration Guide](#integration-guide)
8. [Setup & Development](#setup--development)
9. [Docker](#docker)
10. [Troubleshooting](#troubleshooting)

---

## Overview

The Payment Service is LAKOO's **payment ledger** + **gateway integration** layer. It handles:

- Payment creation (Xendit invoice)
- Payment status updates (Xendit webhooks)
- Refund requests and processing workflow
- Commission ledger accounting (0.5% by default)
- Gateway reconciliation summaries (`SettlementRecord`)

This service emits domain events using a **transactional outbox** (`ServiceOutbox`).

---

## Responsibilities

**Owns**
- `Payment`, `Refund`, `PaymentGatewayLog` (audit trail)
- `CommissionLedger` (commission accounting, not cash movement)
- `SettlementRecord` (gateway reconciliation summaries)
- `ServiceOutbox` rows written by this service

**Does NOT own**
- Order lifecycle (order-service owns order state)
- Seller identity + bank accounts (seller-service owns seller profile)
- Actually moving money to sellers (wallet-service/payout worker responsibility)

---

## Architecture

### Layers
- Routes (`src/routes/*`): routing + `express-validator` + `validateRequest`
- Middleware (`src/middleware/*`): auth, validation, centralized errors
- Controllers (`src/controllers/*`): request handlers (thin)
- Services (`src/services/*`): business logic + outbound HTTP + outbox publishing
- Repositories (`src/repositories/*`): Prisma data access

### Authentication model

**Gateway trust (end-user traffic via API gateway)**
- `x-gateway-auth` must be a valid HMAC token signed with `GATEWAY_SECRET`
- `x-user-id` required
- `x-user-role` optional (e.g. `admin`)

**Service-to-service (internal traffic)**
- `x-service-auth`: `<serviceName>:<timestamp>:<signature>`
- `x-service-name`: `<serviceName>`
- Verified using `SERVICE_SECRET`
- Internal identity is derived from the **signed token**, and must match `x-service-name` (prevents header spoofing).

### Response format
- Success: `{ success: true, data: ... }`
- Errors: `{ success: false, error: string, details?: any }` (from `src/middleware/error-handler.ts`)

---

## Core Flows

### 1) Create payment (invoice)

```
Client -> API Gateway -> payment-service (POST /api/payments)
  -> Xendit: create invoice
  -> payment-service: create Payment(pending) + outbox payment.created
  -> return invoice URL to client
```

Notes:
- payment-service does **not** fetch user profiles from auth-service; invoice customer fields are taken from the **order snapshot** (order-service). If missing, it uses a placeholder email.
- For internal calls (order-service -> payment-service), payment-service avoids calling back into order-service; internal callers should pass customer snapshot fields in `metadata` (`customerName`, `customerEmail`, `customerPhone`, `orderNumber`).

### 2) Webhook: payment paid / expired

```
Xendit -> payment-service (POST /api/webhooks/xendit/invoice)
  -> verify x-callback-token
  -> write PaymentGatewayLog (idempotent guard)
  -> update Payment status + outbox payment.paid/payment.expired (transactional)
  -> best-effort: notify order-service / notification-service
```

Notes:
- Webhook routes are public by design; security is via `x-callback-token` verification.
- In production, missing `XENDIT_WEBHOOK_VERIFICATION_TOKEN` fails closed.
- Downstream services should treat the **outbox events** as the source of truth.

### 3) Refunds
- `POST /api/payments/refunds` creates a refund request and emits `refund.requested`.
- Refund processing can be gateway-based (some methods) or manual, depending on payment method.

### 4) Commission ledger (0.5%)

Commission is **accounting**, not money movement:
- `pending` -> order not yet completed
- `collectible` -> order completed (ready to collect during payout run)
- `collected` -> payout completed; commission deducted
- `waived/refunded` -> business adjustments

---

## API Endpoints

Base routes:
- `/api/payments` (payments + refunds)
- `/api/transactions` (history + admin summaries)
- `/api/commissions` (commission ledger)
- `/api/admin` (admin analytics/queries)
- `/api/webhooks` (Xendit callbacks)

### Authorization summary

**Payments**
- User-scoped: users can only read/write their own payments/refunds.
- Internal services may operate on any user/order via `gatewayOrInternalAuth`.

**Transactions**
- User-scoped reads:
  - `GET /api/transactions/order/:orderId`
  - `GET /api/transactions/payment/:paymentId`
- Admin/internal only:
  - `GET /api/transactions/summary`
  - `GET /api/transactions/recent`
  - `GET /api/transactions/:transactionCode`

**Commissions**
- Write endpoints are **internal only**:
  - `POST /api/commissions` (record)
  - `PUT /api/commissions/order/:orderId/complete` (mark collectible)
  - `POST /api/commissions/seller/:sellerId/collect` (mark collected)
  - `PUT /api/commissions/order/:orderId/refund`
- Read endpoints are **admin/internal only** (seller dashboard should query via seller-service):
  - `GET /api/commissions/seller/:sellerId`
  - `GET /api/commissions/seller/:sellerId/stats`
  - `GET /api/commissions/order/:orderId`
  - `GET /api/commissions/ledger/:ledgerNumber`
  - `GET /api/commissions/:id`

Swagger: `GET /api-docs`

---

## Events (Outbox)

Outbox table: `ServiceOutbox` (`prisma/schema.prisma`)  
Writer: `src/services/outbox.service.ts`

Emitted event types:
- Payment: `payment.created`, `payment.paid`, `payment.expired`, `payment.failed`, `payment.cancelled`
- Refund: `refund.requested`, `refund.approved`, `refund.rejected`, `refund.completed`, `refund.failed`
- Commission: `commission.recorded`, `commission.collectible`, `commission.collected`, `commission.waived`, `commission.refunded`
- Settlement (gateway reconciliation): `settlement.completed`

Important:
- `settlement.completed` here means **gateway reconciliation**, not “seller payout settlement”.

---

## Integration Guide

### Seller dashboard (seller-service -> payment-service)

Seller dashboard should be served by **seller-service**. It should call payment-service internally:
- Read commission ledger for a seller:
  - `GET /api/commissions/seller/:sellerId`
  - `GET /api/commissions/seller/:sellerId/stats`

Frontend should not call payment-service commission endpoints directly.

Internal request example (seller-service calling payment-service):
```bash
curl -s http://payment-service:3007/api/commissions/seller/<sellerId> \
  -H "X-Service-Name: seller-service" \
  -H "X-Service-Auth: <serviceName:timestamp:signature>"
```

Notes:
- These headers must be generated server-side using `SERVICE_SECRET` (never from the browser).

### How payouts should work (recommended)

Payment-service is not the payout executor. A payout worker (seller-service or wallet-service) should:

1. Determine which sellers are payable (e.g. weekly schedule).
2. Fetch collectible commissions per seller (internal calls to payment-service).
3. Execute payout/disbursement using wallet-service / bank transfer.
4. After payout succeeds, mark commissions as collected:
   - `POST /api/commissions/seller/:sellerId/collect` (internal-only)
   - Pass a `settlementId` that references the payout record (owned by wallet/seller service).

Alternative (event-driven):
- Consume `commission.collectible` outbox events and enqueue payout runs.

### payment-service ↔ order-service

Payment-service may attempt to update order status after payment/refund completion. This is best-effort; the reliable integration is:
- Consume outbox events (`payment.paid`, `refund.*`) downstream.

---

## Setup & Development

Prereqs: Node.js 18+, pnpm, PostgreSQL

### Environment variables (example)
```env
NODE_ENV=development
PORT=3007
SERVICE_NAME=payment-service

# Neon / remote Postgres (recommended): include sslmode=require for Neon
DATABASE_URL=postgresql://user:pass@your-neon-host.neon.tech/payment_db?sslmode=require

GATEWAY_SECRET=your-gateway-secret
SERVICE_SECRET=your-service-auth-secret

ORDER_SERVICE_URL=http://localhost:3006
WAREHOUSE_SERVICE_URL=http://localhost:3012
NOTIFICATION_SERVICE_URL=http://localhost:3008

XENDIT_SECRET_KEY=xnd_development_xxxxx
XENDIT_WEBHOOK_VERIFICATION_TOKEN=your-webhook-verification-token

PAYMENT_SUCCESS_URL=https://your-domain.com/payment/success
PAYMENT_FAILURE_URL=https://your-domain.com/payment/failed

OUTBOUND_HTTP_TIMEOUT_MS=8000

ENABLE_EXPIRATION_CRON=true
EXPIRATION_CRON_SCHEDULE=0 * * * *
```

### Commands
From repo root:
- Install: `pnpm -C backend/services/payment-service install`
- Dev: `pnpm -C backend/services/payment-service dev`
- Build: `pnpm -C backend/services/payment-service build`
- Test: `pnpm -C backend/services/payment-service test`

---

## Docker

- `Dockerfile`: multi-stage build, non-root user, healthcheck
- `docker-compose.yml`: service + redis (DB is expected to be Neon/remote)

Notes:
- Docker build uses pnpm (via corepack), consistent with `pnpm-lock.yaml`.
- Optional schema sync: `payment-migrate` runs `pnpm -s run db:push` under the `migrate` profile (`docker compose --profile migrate ...`).

---

## Troubleshooting

**Webhook returns 403**
- Check Xendit sends `x-callback-token`
- Ensure `XENDIT_WEBHOOK_VERIFICATION_TOKEN` matches Xendit dashboard

**Seller dashboard cannot access commissions**
- Expected: commission endpoints are internal/admin only; route calls through seller-service.

---

<details>
<summary>Legacy documentation (kept for reference)</summary>

# Payment Service Documentation (Legacy)

## 1) Purpose
- Owns payment + refund state (`Payment`, `Refund`, `PaymentGatewayLog`, settlement summaries) and exposes payment/refund APIs.
- Integrates with **Xendit** for invoice creation and (some) refunds.
- Emits integration events via **`ServiceOutbox`** (transactional outbox pattern).
- Does **not** own orders or user identities (reads order snapshot via `ORDER_SERVICE_URL` when needed).

## 2) Architecture (layers & request flow)
- **Routes** (`src/routes/*.routes.ts`): endpoints + `express-validator` rules + `validateRequest`.
- **Controllers** (`src/controllers/*.controller.ts`): HTTP handlers (should be thin).
- **Services** (`src/services/*.service.ts`): business logic + external calls + outbox.
- **Repositories** (`src/repositories/*.repository.ts`): Prisma reads/writes.
- **DB schema** (`prisma/schema.prisma`): data model + outbox table.

Typical request flow:
1. Route validates input → `validateRequest`.
2. Auth middleware sets `req.user`.
3. Controller calls service method.
4. Service uses repositories + external clients, returns result (errors bubble to `errorHandler`).

## 3) Runtime contracts

### Environment variables
- **`PORT`**: listen port (code default is `3007`).
- **`NODE_ENV`**: `development|test|production` (affects logging + dev auth bypass).
- **`DATABASE_URL`**: Postgres connection string for Prisma.
- **`GATEWAY_SECRET`**: verifies gateway traffic (`x-gateway-auth`).
- **`SERVICE_SECRET`**: verifies service-to-service HMAC tokens (`x-service-auth` + `x-service-name`).
- **`XENDIT_SECRET_KEY`**: Xendit API key.
- **`XENDIT_WEBHOOK_VERIFICATION_TOKEN`**: Xendit callback token (matches `x-callback-token`).
- **`ORDER_SERVICE_URL`**, **`WAREHOUSE_SERVICE_URL`**, **`NOTIFICATION_SERVICE_URL`**: upstream service base URLs.
- **`PAYMENT_SUCCESS_URL`**, **`PAYMENT_FAILURE_URL`**: Xendit redirect URLs.
- **`ENABLE_EXPIRATION_CRON`**, **`EXPIRATION_CRON_SCHEDULE`**: expire-payment scheduler controls.
- **`ALLOWED_ORIGINS`**: CORS allowlist (if enabled in `src/index.ts`).

### Authentication & authorization (gateway + service-to-service)
Gateway-trust (external client traffic via API Gateway):
- Gateway must inject:
  - `x-gateway-auth` (HMAC token signed with `GATEWAY_SECRET`)
  - `x-user-id` (required)
  - `x-user-role` (optional; `admin`, `user`, etc.)

Service-to-service (internal traffic, no gateway):
- Caller must send:
  - `x-service-auth`: `serviceName:timestamp:signature`
  - `x-service-name`: `serviceName`
- Service verifies token using **`SERVICE_SECRET`** and sets:
  - `req.user = { id: <serviceName>, role: 'internal' }`

Role values:
- Use **`internal`** consistently for internal calls (service-to-service).

### Response format
- Most success responses: `200/201` with `{ success: true, data: ... }`
- Some delete/void actions may respond `204` with no body (depends on controller).
- Errors are formatted by `src/middleware/error-handler.ts`:
  - `{ success: false, error: string, ...(details) }`

## 4) Endpoint map (route → controller → service/repo)
Base routes:
- **`/api/payments`** → `src/routes/payment.routes.ts`
- **`/api/admin`** → `src/routes/admin.routes.ts`
- **`/api/transactions`** → `src/routes/transaction.routes.ts`
- **`/api/webhooks`** → `src/routes/webhook.routes.ts`
- **`/api/commissions`** → `src/routes/commission.routes.ts`

Payments & refunds (`/api/payments/*`):
- Auth: `gatewayOrInternalAuth`
- Examples:
  - `POST /api/payments` → `PaymentController.createPayment` → `PaymentService.createPayment` (reads order snapshot via `ORDER_SERVICE_URL`) → `PaymentRepository.*`
  - `GET /api/payments/order/:orderId` → `PaymentController.getPaymentByOrder` → `PaymentService.getPaymentByOrderId`
  - Refund routes: `PaymentController.*` → `RefundService.*` → `RefundRepository.*`
  - Admin-only payment analytics routes use `requireRole('admin', 'internal')`

Transactions (`/api/transactions/*`):
- Auth: `gatewayOrInternalAuth`
- Authorization:
  - `GET /api/transactions/order/:orderId` and `GET /api/transactions/payment/:paymentId` are user-scoped (a user can only read their own).
  - `GET /api/transactions/summary`, `GET /api/transactions/recent`, and `GET /api/transactions/:transactionCode` require `requireRole('admin', 'internal')`.

Admin (`/api/admin/*`):
- Auth: `gatewayAuth` + `requireRole('admin')`
- Note: some handlers use Prisma directly (tech debt item: move to services).

Commissions (`/api/commissions/*`):
- Auth: `gatewayOrInternalAuth`
- Authorization:
  - Write endpoints (`record`, `complete`, `collect`, `refund`) require `requireRole('internal')` (service-to-service only).
  - Read endpoints require `requireRole('admin', 'internal')` (seller dashboards should query via seller-service).

Webhooks (`/api/webhooks/xendit/invoice`):
- Validates `x-callback-token` using `CryptoUtils.verifyXenditWebhook(...)`
- Performs idempotency using `PaymentGatewayLog`
- Calls `PaymentService.handlePaidCallback(...)` for `PAID` events
 - Calls `PaymentService.handleExpiredCallback(...)` for `EXPIRED` events

## 5) Middleware
Files under `src/middleware/`.

- **`auth.ts`**
  - `gatewayAuth`: verifies gateway headers; sets `req.user`.
  - `gatewayOrInternalAuth`: accepts gateway OR service-to-service HMAC; sets `req.user`.
  - `internalServiceAuth`: service-to-service only (HMAC).
  - `requireRole(...roles)`: checks `req.user.role`.
- **`validation.ts`**
  - `validateRequest`: checks `express-validator` results and returns `400` on failure.
- **`error-handler.ts`**
  - `AppError` subclasses + global `errorHandler`.
  - `asyncHandler` wrapper for async controllers (preferred).

## 6) Database & Prisma
- Schema: `prisma/schema.prisma`
- Prisma client is generated into `src/generated/prisma`.
- Build copies it into `dist/generated/prisma` using `scripts/copy-generated-prisma.mjs` so `node dist/index.js` works.

Schema changes:
- MVP/local: `pnpm -C backend/services/payment-service db:push`
- Production-grade: prefer migrations (`db:migrate` → generate migration files, `db:migrate:prod` → apply)

## 7) Outbox events
- Table: `ServiceOutbox` (in Prisma schema).
- Writer: `src/services/outbox.service.ts`.
- Typical emitted events (high-signal):
  - `payment.created`, `payment.paid`, `payment.expired`
  - `refund.requested`, `refund.completed`, `refund.failed`, `refund.approved`, `refund.rejected`
  - `settlement.completed` (gateway reconciliation settlement; `src/jobs/weekly-settlement.ts`)

Note:
- `settlement.completed` here represents **gateway reconciliation** (payments/refunds totals vs Xendit), not seller payouts.
- Seller payout settlement is a separate workflow (wallet/disbursement) and is not implemented end-to-end in this service today.

## 8) Local development & scripts
From repo root:
- Install: `pnpm -C backend/services/payment-service install`
- Dev: `pnpm -C backend/services/payment-service dev`
- Build: `pnpm -C backend/services/payment-service build`
- Start built: `pnpm -C backend/services/payment-service start`
- Prisma:
  - `db:generate`, `db:push`, `db:migrate`, `db:migrate:prod`, `db:studio`
- Quality:
  - `lint`, `lint:fix`, `format`

## 9) Docker
- `Dockerfile`: multi-stage image.
- `docker-compose.yml`: app + db + one-shot db init container (uses `prisma db push`).
 
Notes:
- Docker build uses **pnpm** (via corepack), consistent with `pnpm-lock.yaml`.
- The `payment-migrate` container uses the Dockerfile `builder` target to run `pnpm -s run db:push`.

## 10) Tests
- Unit tests exist for some utils (Jest).
- DB-backed endpoint sweep (Neon or local DB): `node backend/smoke/run-neon-full.mjs`

## 11) Future-me problems / tech debt

### 🔴 Critical (Must Fix Before Production)

#### **Commission Integration with Order Service**
- [ ] **Order service must call commission endpoints** when:
  - Order is paid → `POST /api/commissions` (record commission)
  - Order is delivered → `PUT /api/commissions/order/:orderId/complete` (mark collectible)
  - Order is refunded → `PUT /api/commissions/order/:orderId/refund` (void commission)
- [ ] **Add error handling**: What happens if commission recording fails? Should order creation fail or succeed?
- [ ] **Idempotency**: Ensure order-service retries don't create duplicate commissions (already handled, but test it)

#### **Settlement Job Implementation**
- [ ] **Implement seller payout settlement job** (separate from gateway reconciliation) that:
  - Runs on a schedule (weekly/bi-weekly/monthly)
  - For each seller with collectible commissions:
    - Calls `POST /api/commissions/seller/:sellerId/collect`
    - Calculates net payout (gross earnings - commission)
    - Creates payout/disbursement record (wallet-service or bank transfer)
    - Publishes a dedicated payout event (do not reuse `settlement.completed`, which is gateway reconciliation)
- [ ] **Handle settlement failures**: Rollback mechanism if payout fails mid-process
- [ ] **Settlement notifications**: Email/WhatsApp to seller with breakdown
- [ ] **Settlement reports**: Generate PDF invoice with commission breakdown

#### **Xendit Webhook Enhancements**
- [ ] **Add commission recording to payment webhook**: When `payment.paid` webhook arrives, automatically record commission
- [ ] **Handle edge cases**: What if order-service hasn't called commission endpoint yet when webhook arrives?
- [ ] **Webhook retry logic**: Xendit retries failed webhooks, ensure we handle duplicates gracefully

---

### 🟡 High Priority (Needed for Social Commerce Launch)

#### **Commission Analytics & Reporting**
- [ ] **Admin dashboard endpoints**:
  - Total commissions collected (daily/weekly/monthly)
  - Commission breakdown by seller
  - Average commission rate
  - Commission waived vs collected ratio
- [ ] **Seller dashboard integration**: Expose commission data to seller-service
- [ ] **Export functionality**: CSV/Excel export of commission records for accounting

#### **Variable Commission Rates**
- [ ] **Commission rate configuration**: Currently hardcoded to 0.5%, should be configurable
  - Per seller (VIP sellers get lower rate)
  - Per product category (premium categories get higher rate)
  - Promotional periods (0% commission for new sellers)
- [ ] **Commission rate history**: Track when rates change for compliance

#### **Commission Dispute Handling**
- [ ] **Dispute workflow**: Seller can dispute commission amount
  - Freeze commission from collection
  - Admin review process
  - Approve/reject with reason
- [ ] **Manual adjustments**: Admin can manually adjust commission amounts with audit trail

#### **Sponsored Post Payment Integration**
- [ ] **Track sponsored post payments**: When advertisement-service creates sponsored post, record payment here
- [ ] **Ad spend ledger**: Separate tracking for ad spend vs transaction commissions
- [ ] **Ad budget management**: Deduct from seller's ad balance, track remaining budget
- [ ] **Ad refunds**: Handle refunds for unused ad spend

---

### 🟢 Medium Priority (Post-Launch Improvements)

#### **Payment Method Enhancements**
- [ ] **Installment support**: Kredivo, Akulaku integration
  - Record installment schedule
  - Track installment payments
  - Handle failed installment payments
- [ ] **Multiple payment methods**: Allow split payment (wallet + credit card)
- [ ] **Saved payment methods**: Implement tokenization for repeat customers

#### **Refund Improvements**
- [ ] **Partial refunds**: Currently all-or-nothing, support partial amounts
- [ ] **Refund reasons taxonomy**: Standardize refund reasons for analytics
- [ ] **Automatic refund approval**: For trusted sellers/small amounts
- [ ] **Refund SLA tracking**: Alert if refunds taking too long

#### **Performance & Scalability**
- [ ] **Database indexes review**: As data grows, check slow queries
- [ ] **Outbox publisher job**: Separate service to publish events from outbox table to Kafka
- [ ] **Payment archival**: Move old payments (>1 year) to cold storage
- [ ] **Commission aggregation**: Pre-compute seller commission totals for performance

#### **Security & Compliance**
- [ ] **PCI compliance**: If storing card details, ensure PCI DSS compliance
- [ ] **GDPR/data privacy**: Ability to export/delete user payment data
- [ ] **Fraud detection**: Integrate with fraud detection service
  - Unusual payment patterns
  - High-risk transactions
  - Velocity checks (too many payments from same user)
- [ ] **Audit logging**: Enhanced logging for all financial transactions

---

### 🔵 Low Priority (Nice to Have)

#### **Payment Experience**
- [ ] **Payment links**: Generate shareable payment links (for offline sales)
- [ ] **QR code payments**: Generate QR codes for in-person payments
- [ ] **Recurring payments**: Subscription support for future features
- [ ] **Payment reminders**: Notify users of pending payments before expiration

#### **Analytics & Business Intelligence**
- [ ] **Payment success rate**: Track by method, amount, time of day
- [ ] **Conversion funnel**: Payment creation → successful payment
- [ ] **Revenue forecasting**: Predict monthly revenue based on trends
- [ ] **Commission revenue tracking**: Separate P&L for commission vs house brands

#### **Developer Experience**
- [ ] **Payment test mode**: Sandbox environment for testing
- [ ] **Payment simulation API**: Create test payments without Xendit
- [ ] **Better error messages**: More actionable error messages for failed payments
- [ ] **Webhook replay**: Admin can replay webhooks for debugging

#### **Operational Excellence**
- [ ] **Health check enhancement**: Check Xendit API connectivity
- [ ] **Circuit breaker**: Prevent cascading failures when Xendit is down
- [ ] **Rate limiting**: Protect against abuse on payment creation
- [ ] **Monitoring dashboards**: Grafana/DataDog dashboards for payment metrics

---

### 🛠️ Technical Debt (Clean Up When Possible)

#### **Code Quality**
- [ ] **Port default mismatch**: `PORT` defaults to `3006` in code; should be `3007`. Set explicitly in Docker.
- [ ] **Admin routes bypass layering**: Some admin handlers hit Prisma directly; migrate to services for consistency
- [ ] **Transaction management**: Ensure all commission operations use Prisma transactions
- [ ] **Error handling standardization**: Consistent error responses across all endpoints

#### **Testing**
- [ ] **Unit tests**: Add tests for commission service, repository
- [ ] **Integration tests**: Test full payment flow with commission recording
- [ ] **Webhook tests**: Mock Xendit webhooks and test handling
- [ ] **Load testing**: Ensure service can handle Black Friday volumes

#### **Documentation**
- [ ] **API documentation**: Complete Swagger/OpenAPI docs for commission endpoints
- [ ] **Runbook**: Operations guide for common issues (payment stuck, refund failed, etc.)
- [ ] **Sequence diagrams**: Document payment flow with order/commission services
- [ ] **Architecture decision records**: Document why 0.5% commission, why weekly settlements, etc.

#### **Infrastructure**
- [ ] **Dockerfile pnpm support**: Currently uses `npm ci` but has `pnpm-lock.yaml`. Switch to pnpm consistently.
- [ ] **Database connection pooling**: Optimize Prisma connection settings for production
- [ ] **Secrets management**: Use proper secrets manager (AWS Secrets Manager, Vault)
- [ ] **Multi-region support**: Prepare for expansion beyond Jakarta

---

### 📋 Commission-Specific Items (Recently Added - Jan 2026)

#### **Immediate Next Steps**
- [ ] **Test commission flow end-to-end**:
  - Create order → Check commission recorded (status: pending)
  - Complete order → Check commission collectible
  - Run settlement → Check commission collected
  - Verify seller receives net payout (gross - commission)
- [ ] **Create settlement job** (see Critical section above)
- [ ] **Update order-service** to call commission endpoints
- [ ] **Seller dashboard** to show commission breakdown

#### **Commission Edge Cases to Handle**
- [ ] **Order cancellation after completion**: Should collected commission be reversed?
- [ ] **Partial order fulfillment**: What if only some items are delivered?
- [ ] **Multi-seller orders**: Cart with items from different sellers (each gets separate commission record)
- [ ] **House brand orders**: LAKOO house brands don't pay commission (add check)
- [ ] **Promo campaigns**: Track which commissions were waived for promos vs partnerships

#### **Commission Compliance**
- [ ] **Tax reporting**: Generate reports for tax authorities (commission is revenue)
- [ ] **Seller agreements**: Ensure commission terms are in seller ToS
- [ ] **Rate change communication**: Notify sellers 30 days before commission rate changes
- [ ] **Commission invoice**: Provide invoice/receipt to sellers for their accounting

---

### 🔍 Monitoring & Alerts (Set These Up!)

#### **Payment Monitoring**
- [ ] Alert: Payment success rate < 90%
- [ ] Alert: Xendit webhook failures > 5 in 1 hour
- [ ] Alert: Average payment processing time > 30 seconds
- [ ] Alert: Refund approval time > 48 hours

#### **Commission Monitoring**
- [ ] Alert: Commission recording failures (order paid but no commission)
- [ ] Alert: Commission collection failures during settlement
- [ ] Alert: Mismatch between order amounts and commission totals
- [ ] Alert: Unusual commission waiver patterns (fraud detection)

#### **Business Metrics**
- [ ] Dashboard: Daily GMV (Gross Merchandise Value)
- [ ] Dashboard: Commission revenue (daily/weekly/monthly)
- [ ] Dashboard: Average commission per order
- [ ] Dashboard: Top sellers by commission paid
- [ ] Dashboard: Commission waived vs collected ratio

---

### 💡 Future Features (Brainstorming)

#### **Dynamic Commission Models**
- [ ] **Tiered commission**: Lower rate for high-volume sellers
- [ ] **Category-based commission**: Different rates for different product categories
- [ ] **Performance-based commission**: Lower commission for sellers with good ratings
- [ ] **Promotional commission**: 0% commission for first 30 days for new sellers

#### **Advanced Settlement**
- [ ] **Instant payouts**: Sellers can request instant payout for a fee
- [ ] **Flexible settlement schedule**: Weekly, bi-weekly, or monthly options
- [ ] **Split settlements**: Auto-split commission to multiple bank accounts
- [ ] **Settlement holds**: Hold payouts for sellers under review

#### **Financial Products**
- [ ] **Seller financing**: Advance payouts based on future sales
- [ ] **Working capital loans**: Partner with fintech for seller loans
- [ ] **Insurance products**: Payment protection insurance for buyers

---

**Last Updated**: February 3, 2026  
**Commission Implementation**: ✅ Complete  
**Next Milestone**: Settlement Job + Order Service Integration

## 12) File-by-file
- `src/index.ts`: Express bootstrap, routes, health, swagger, error handler, shutdown.
- `src/lib/prisma.ts`: Prisma singleton client.
- `src/middleware/*`: auth/validation/error-handler.
- `src/routes/*`: HTTP routes + validators.
- `src/controllers/*`: request handlers.
- `src/services/*`: business logic + outbox publishing.
- `src/repositories/*`: Prisma access layer.
- `src/utils/*`: shared helpers (incl. `CryptoUtils.verifyXenditWebhook` token compare).
- `scripts/copy-generated-prisma.mjs`: copies generated Prisma client into `dist/`.

</details>

