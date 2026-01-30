# Service Review Results

**Date:** 2026-01-28  
**Reviewer:** Agent  
**Services Reviewed:** 8

---

## Executive Summary

| Service | Structure | Schema | API | Auth | Code | Integration | Ready |
|---------|-----------|--------|-----|------|------|-------------|-------|
| auth-service | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ |
| product-service | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ |
| cart-service | ✅ | ⚠️ | ⚠️ | ❌ | ⚠️ | ⚠️ | ❌ |
| user-service | ⚠️ | ❌ | ⚠️ | ⚠️ | ⚠️ | ✅ | ❌ |
| order-service | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ❌ | ❌ |
| warehouse-service | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ✅ |
| content-service | ✅ | ✅ | ✅ | ✅ | ⚠️ | ⚠️ | ⚠️ |
| feed-service | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ⚠️ |

**Legend:** ✅ Good | ⚠️ Issues | ❌ Broken/Missing  
**Overall MVP Ready:** 1/8 services (warehouse-service only)  

---

## Detailed Findings

### 1. auth-service (Port 3001)

**Overall Status:** ⚠️ Partial

#### Structure & Files
- Has basic `src/` layout (controllers/routes/services/clients).
- **Missing local Prisma + DB schema** within service; OTP is stored in-memory.

#### Entry Point & Health
- Port: ✅ defaults to `3001` (`backend/services/auth-service/src/index.ts:37-42`)
- Health endpoint: ✅ `/health` exists.
- Graceful shutdown: ❌ not implemented.

#### Database/Schema
- **No DB** used by this service (OTP stored in-memory): `backend/services/auth-service/src/repositories/otp.repository.ts:1-29`.
- This conflicts with the architecture plan that assigns **auth_db** to auth concerns; may be intentional (delegating persistence to `user-service`), but creates reliability/security risks.

#### API Routes
- Endpoints found:
  - `POST /api/auth/login`
  - `POST /api/auth/signup`
  - `POST /api/auth/send-otp`
- Missing endpoints (commented placeholders): logout, refresh, sessions, etc. (`backend/services/auth-service/src/routes/index.ts:18-26`)
- Validation: uses shared Zod middleware for login/signup; `send-otp` lacks schema validation.

#### Authentication & Security
- Gateway auth exists, but **uses `process.env.GATEWAY_SECRET` (not `GATEWAY_SECRET_KEY`)** and has a **hardcoded default fallback** (`internal-gateway-secret`) (`backend/services/auth-service/src/middleware/gateway.ts:3-28`).
- **OTP storage is in-memory** (not production-safe, not distributed, no rate limiting, no attempt tracking enforcement) (`otp.repository.ts`).

#### Service Integration
- Depends on `user-service` for user creation/verification; uses service-auth headers (`backend/services/auth-service/src/clients/userServiceClient.ts:37-54`).
- Risk: `SERVICE_SECRET` default fallback `'secret'` is used if env missing (`auth.service.ts:14-20`) → weak security if deployed misconfigured.

#### Issues Found
| Severity | Issue | Location | Description |
|----------|-------|----------|-------------|
| P0 | Weak gateway auth config | `src/middleware/gateway.ts` | Uses `GATEWAY_SECRET` + hardcoded default; inconsistent with repo standard `GATEWAY_SECRET_KEY`. |
| P0 | OTP persistence not production-safe | `src/repositories/otp.repository.ts` | In-memory OTP store (lost on restart, not shared across instances, no real abuse protection). |
| P1 | Missing protected auth endpoints | `src/routes/index.ts` | Logout/session endpoints are placeholders only. |

#### Recommendations
1. Replace `GATEWAY_SECRET` usage with `GATEWAY_SECRET_KEY` and remove insecure defaults.
2. Move OTP storage to Redis (or DB table with TTL) + add rate limiting + attempt limits.
3. Either (a) give auth-service its own DB schema as intended by architecture, or (b) explicitly document auth-service as “stateless auth facade” and tighten security accordingly.

---

### 2. product-service (Port 3002)

**Overall Status:** ⚠️ Partial (close to ready)

#### Structure & Files
- Strong standardized structure: `middleware/`, `lib/prisma.ts`, repositories/services/controllers/routes, swagger, outbox.

#### Entry Point & Health
- Health endpoint: ✅ `/health` exists (`backend/services/product-service/src/index.ts:43-52`)
- Graceful shutdown: ✅ implemented.
- CORS: ✅ supports `ALLOWED_ORIGINS`.

#### Database/Schema
- Prisma schema uses `DATABASE_URL` (`backend/services/product-service/prisma/schema.prisma:13-16`).
- **Docs reference `PRODUCT_DATABASE_URL` instead** (`backend/services/product-service/DOCUMENTATION.md:492-499`) → config mismatch risk.
- Local Prisma client exists at `src/lib/prisma.ts`.

#### API Routes
- Draft approval workflow + moderation endpoints are implemented and validated (express-validator + `validateRequest`).

#### Authentication & Security
- Implements gateway trust, internal service auth, and gateway-or-internal patterns (`src/middleware/auth.ts`).

#### Service Integration
- Outbox events implemented.
- Clients exist for seller/warehouse/notification.

#### Issues Found
| Severity | Issue | Location | Description |
|----------|-------|----------|-------------|
| P1 | Env var mismatch for DB URL | `DOCUMENTATION.md` vs `prisma/schema.prisma` | Docs show `PRODUCT_DATABASE_URL`, schema expects `DATABASE_URL`. |
| P2 | Missing `.env.example` in workspace | `backend/services/product-service/.env.example` | File appears absent (could break onboarding); docs claim it exists. |

#### Recommendations
1. Standardize on `DATABASE_URL` across service docs + `.env.example`.
2. Add/restore `product-service/.env.example` to match the documented setup.

---

### 3. cart-service (Port 3003, Go)

**Overall Status:** ❌ Not Ready (security + contract drift)

#### Structure & Files
- Good Go layering (`internal/controller`, `internal/service`, `internal/repository`, shared server wrapper).
- Health: ✅ provided by shared server (`backend/services/cart-service/cmd/main/main.go:25-34`).

#### Entry Point & Health
- Health endpoint: ✅ `/health` implemented via shared server.
- Graceful shutdown: ❌ not implemented (`ListenAndServe` with no signal handling in shared server).

#### Database/Schema
- Uses GORM + AutoMigrate (`backend/services/cart-service/db/db.go:14-45`).
- **Canonical schema exists** at repo root: `cart-service-schema.prisma`.
- **Config mismatch**: canonical Prisma expects `CART_DATABASE_URL` (`cart-service-schema.prisma:13-16`) while Go service expects `DATABASE_URL` (`backend/services/cart-service/config/env.go:12-28`).

#### API Routes & Endpoints
- External routes:
  - `POST /api/cart/addToCart` (requires `x-user-id` header via middleware)
  - `GET /api/cart/` (requires `x-user-id`)
  - `GET /api/cart/{userId}` (**no auth applied**)
  - `DELETE /api/cart/{userId}` (**no auth applied**)  
  (`backend/services/cart-service/internal/controller/cart_handler.go:24-37`)
- Internal router has `ServiceAuthMiddleware` applied but **no internal endpoints are actually registered** (`cart_handler.go:35-37`).
- Documentation claims bearer JWT auth and “warehouse_product” item type, which **does not match code** (code uses `x-user-id` and `brand_product`) (`DOCUMENTATION.md` vs `domain/models/models.go`).

#### Authentication & Security
- **P0:** anyone can fetch/clear any user’s cart by calling `/api/cart/{userId}` if the service is reachable (no gateway key, no service auth, no user-id enforcement).
- Service secret defaults to `"secret"` if not configured (`backend/services/cart-service/config/env.go:25-27`).

#### Service Integration
- Product client calls `GET {GATEWAY_URL}/api/products/:id/taggable` with service-auth headers (`clients/product_http_client.go:47-69`).
- Order-service currently calls cart-service without service-auth headers (see cross-service section).

#### Issues Found
| Severity | Issue | Location | Description |
|----------|-------|----------|-------------|
| P0 | Unauthenticated userId path routes | `internal/controller/cart_handler.go:31-33` | `GET/DELETE /api/cart/{userId}` bypasses auth middleware. |
| P0 | Internal endpoints missing | `internal/controller/cart_handler.go:35-37` | Internal router has auth middleware but no registered handlers. |
| P1 | Docs/contract drift | `DOCUMENTATION.md` vs code | Docs mention bearer auth + `warehouse_product`; code uses `x-user-id` + `brand_product`. |
| P1 | DB env var mismatch | `cart-service-schema.prisma` vs Go config | Prisma schema uses `CART_DATABASE_URL`, Go uses `DATABASE_URL`. |

#### Recommendations
1. Remove or protect `/api/cart/{userId}` and `/api/cart/{userId} DELETE` (make them internal-only with service auth, or enforce `x-user-id == userId`).
2. Implement internal endpoints under `/internal/cart/*` and update order-service to use them with service-auth headers.
3. Align naming: decide `brand_product` vs `warehouse_product` and update code + docs + upstream services accordingly.

---

### 4. user-service (Port 3004)

**Overall Status:** ❌ Not Ready (service boundary + security)

#### Structure & Files
- Minimal service with local Prisma client and internal routes protected by shared service auth middleware.
- Missing many standard features (structured logging, standardized error handling, cors allowlist, swagger).

#### Entry Point & Health
- Health endpoint: ✅ `/health` exists (`backend/services/user-service/src/index.ts:18-25`)
- Graceful shutdown: ❌ not implemented.

#### Database/Schema
- Prisma schema file header says **“AUTH SERVICE DATABASE SCHEMA / auth_db”** (`backend/services/user-service/prisma/schema.prisma:1-17`), indicating **service boundary drift** (auth vs user responsibilities conflated).

#### API Routes
- External routes:
  - `GET /api/user/:phoneNumber`
  - `POST /api/user/verify`  (**public password verification**)  
  (`backend/services/user-service/src/routes/external.ts:11-12`)
- Internal routes (service-auth protected):
  - `POST /internal/create`
  - `POST /internal/verify`

#### Authentication & Security
- Internal routes are protected by `serviceAuthMiddleware`, but external `POST /api/user/verify` exposes password verification to any caller if service is reachable.
- No gateway trust (`x-gateway-key`) used at all for external routes.

#### Issues Found
| Severity | Issue | Location | Description |
|----------|-------|----------|-------------|
| P0 | Public password verification endpoint | `src/routes/external.ts:12` | Exposes credential verification without gateway trust / rate limiting. |
| P0 | Service boundary drift (auth schema in user-service) | `prisma/schema.prisma` | Schema appears to belong to auth-service/auth_db, not “user-service” (naming/ownership confusion). |
| P1 | Missing production hardening | `src/index.ts` | No graceful shutdown, no strict CORS allowlist, no standardized error handler. |

#### Recommendations
1. Remove/lock down `POST /api/user/verify` (internal-only; never public).
2. Clarify ownership: either rename service to reflect auth_db ownership or split user profile vs auth identity cleanly.
3. Add gateway trust middleware to any user-facing endpoints (if any remain).

---

### 5. order-service (Port 3006, Go)

**Overall Status:** ❌ Not Ready (security + integration)

#### Structure & Files
- Basic Go API server with handlers/services/repositories.
- Health endpoint: ✅ `/health` exists (`backend/services/order-service/cmd/api/api.go:30-35`).

#### Database/Schema
- Uses GORM with host/user/password envs (`backend/services/order-service/db/db.go:11-31`).
- Canonical root schema exists (`order-service-schema.prisma`) but expects `ORDER_DATABASE_URL` (not used by Go service).

#### API Routes
- Implemented:
  - `GET /api/orders`
  - `POST /api/orders`
- Many expected endpoints are commented out (`order_handler.go:26-35`).

#### Authentication & Security
- GatewayAuth only verifies `x-gateway-key`; it does **not** bind request user identity (`x-user-id`) to the created order (`internal/middleware/gateway_auth.go:11-28`).
- CreateOrder payload includes `userId` provided by client (`types/request_dto.go:17-21`) → risky unless validated against gateway headers.

#### Service Integration
- Cart client calls `GET /api/cart/{userId}` and `DELETE /api/cart/{userId}` with **no service auth headers** (`clients/cart_client.go:57-96`).
- Payment client does include service-auth headers, but does not enforce presence of `SERVICE_SECRET` (empty secret would generate weak/invalid signatures).

#### Issues Found
| Severity | Issue | Location | Description |
|----------|-------|----------|-------------|
| P0 | Insecure cart integration | `clients/cart_client.go` + cart-service routes | Uses unauthenticated cart endpoints; coupled with cart-service bug this is a major data integrity/security problem. |
| P1 | User identity not enforced | `internal/middleware/gateway_auth.go` + `types/request_dto.go` | Gateway auth doesn’t bind `x-user-id`; order creation trusts payload `userId`. |
| P2 | Panic stub in DTO | `types/request_dto.go:23-26` | `CreateOrderPayload.Read()` panics if invoked. |
| P2 | DB config drift vs canonical | `order-service-schema.prisma` vs Go | Canonical expects `ORDER_DATABASE_URL`; Go uses host/user/pass envs (no DATABASE_URL support). |

#### Recommendations
1. Use gateway trust model properly: read `x-user-id` and ignore/validate payload `userId`.
2. Switch cart integration to internal service-auth protected endpoints.
3. Add `DATABASE_URL` support (or align canonical schema + docs to actual config).

---

### 6. warehouse-service (Port 3012)

**Overall Status:** ✅ Ready

#### Highlights
- Strong standardized implementation: swagger, strict CORS allowlist, centralized error handling, gateway + service auth, validation, transactional outbox.
- Schema uses `DATABASE_URL` and local Prisma client.
- Major remaining gap is **event consumption/tests**, not basic correctness.

#### Issues Found
| Severity | Issue | Location | Description |
|----------|-------|----------|-------------|
| P2 | No automated tests yet | service-level | High confidence code, but missing unit/integration tests. |
| P2 | Event consumer not implemented | `MIGRATION_COMPLETE.md` | Publishes outbox events but doesn’t consume upstream events yet. |

---

### 7. content-service (Port 3017)

**Overall Status:** ⚠️ Partial (close to ready)

#### Structure & Files
- Standardized structure: auth/validation/error-handler, local Prisma, strong routing and validation, outbox writes.

#### Database/Schema
- Prisma schema expects `DATABASE_URL` (`backend/services/content-service/prisma/schema.prisma:13-16`)
- Docs recommend `CONTENT_DATABASE_URL` instead (`DOCUMENTATION.md:371-383`) → config mismatch.

#### API Routes
- Posts/comments/collections/moderation implemented with validation and auth patterns.
- Public feed endpoints exist for posts listing and trending hashtags.

#### Authentication & Security
- Gateway trust + internal service auth patterns implemented.

#### Issues Found
| Severity | Issue | Location | Description |
|----------|-------|----------|-------------|
| P1 | Graceful shutdown import bug | `src/index.ts:134-137` | In `tsx` dev mode it imports `./lib/prisma.js`, which won’t exist (likely breaks shutdown path). |
| P1 | Env var mismatch for DB URL | `DOCUMENTATION.md` vs schema | Docs show `CONTENT_DATABASE_URL`, schema expects `DATABASE_URL`. |

#### Recommendations
1. Replace dynamic import with TS-safe import (`./lib/prisma`) or guard by environment/build target.
2. Align docs + `.env.example` to `DATABASE_URL`.

---

### 8. feed-service (Port 3018)

**Overall Status:** ⚠️ Partial (close to ready)

#### Structure & Files
- Standardized structure with auth/validation/error handling and background jobs.

#### Database/Schema
- Prisma schema expects `DATABASE_URL` (`backend/services/feed-service/prisma/schema.prisma:13-16`)
- Docs recommend `FEED_DATABASE_URL` (`DOCUMENTATION.md:478-506`) → config mismatch.

#### API Routes
- Feed endpoints require auth; trending endpoints are public.

#### Authentication & Security
- Gateway trust implemented for user endpoints; internal service auth helpers exist.

#### Issues Found
| Severity | Issue | Location | Description |
|----------|-------|----------|-------------|
| P1 | Env var mismatch for DB URL | `DOCUMENTATION.md` vs schema | Docs show `FEED_DATABASE_URL`, schema expects `DATABASE_URL`. |
| P2 | Event consumption not implemented | `DOCUMENTATION.md` | Consumes events “future: Kafka”; currently relies on polling/outbox design. |

---

## Cross-Service Issues

### Contract/Integration Issues
- **Cart ↔ Order (P0)**: order-service calls cart endpoints that are currently **unauthenticated**, and cart-service exposes userId-based routes without enforcing identity.
- **Env var naming drift (P1)**:
  - Many Prisma schemas use **`DATABASE_URL`** (product/content/feed/warehouse), while docs often use **`*_DATABASE_URL`**.
  - Root canonical Prisma schemas use `CART_DATABASE_URL` and `ORDER_DATABASE_URL`, while Go services currently use `DATABASE_URL` (cart) or DB_HOST/DB_USER (order).
- **Service boundary drift (P0)**: `user-service` schema is effectively an auth schema (auth_db) while `auth-service` itself is stateless and delegates persistence.

### Consistency Issues
- **Header conventions**: some shared middleware/docs refer to `X-Service-Auth`/`X-Service-Name` while most services use `x-service-auth`/`x-service-name`. Node lowercases headers so it often works, but docs and examples should be unified.
- **Terminology drift**: `brand_product` vs `warehouse_product` used inconsistently across docs/code.

---

## P0 Issues Summary (MVP Blockers)

| # | Service | Issue | Impact |
|---|---------|-------|--------|
| 1 | cart-service | Unauthenticated `GET/DELETE /api/cart/{userId}` | Any caller can read/clear another user’s cart if reachable. |
| 2 | order-service | Uses insecure cart integration | Orders can be created/cleared against carts without service auth. |
| 3 | user-service | Public credential verification endpoint | Credential brute force / data exposure risk. |
| 4 | auth-service | Weak gateway secret handling + OTP in-memory | Auth integrity and abuse prevention not production-safe. |

---

## P1 Issues Summary (High Priority)

| # | Service | Issue | Impact |
|---|---------|-------|--------|
| 1 | product/content/feed | DB env var mismatch in docs | Frequent misconfiguration / startup failures. |
| 2 | content-service | `tsx` dev shutdown imports `./lib/prisma.js` | Breaks graceful shutdown path; possible runtime error. |
| 3 | order-service | Gateway auth doesn’t bind `x-user-id` | Potential spoofed order creation if misrouted/exposed. |

---

## Prioritized Action Plan

### P0 - Must Fix for MVP
1. **cart-service**: Make userId-based routes internal-only or enforce `x-user-id == :userId`; add internal endpoints and require service auth.
2. **order-service**: Call cart-service internal endpoints with service-auth headers; enforce `x-user-id` from gateway instead of trusting payload.
3. **user-service**: Remove/lock down public `/api/user/verify`; make password verification internal-only.
4. **auth-service**: Remove hardcoded gateway secret defaults; implement real OTP storage + abuse controls.

### P1 - Fix Before Production
1. Standardize DB env var naming across services/docs (`DATABASE_URL` recommended) and update `.env.example` accordingly.
2. Fix `content-service` shutdown import to be compatible with `tsx` development runtime.

### P2 - Post-MVP
1. Add test suites (warehouse/content/feed/product at minimum).
2. Implement Kafka/outbox consumers (warehouse/feed/content as designed).
3. Add consistent observability (structured logs, metrics, tracing).

---

## Final Verdict

**MVP Ready:** NO  
**Confidence:** HIGH  
**Services Ready:** 1/8  
**Blocking Issues:** 4  

**Recommendation:** Treat cart/order/user/auth security issues as immediate P0 work, then re-run this review after fixes and after aligning env/doc conventions.

---

**Review Completed:** 2026-01-28

# Service Review Results

**Date:** 2026-01-28  
**Reviewer:** Agent  
**Services Reviewed:** 8 (`auth-service`, `product-service`, `cart-service`, `user-service`, `order-service`, `warehouse-service`, `content-service`, `feed-service`)

---

## Executive Summary

| Service | Structure | Schema | API | Auth | Code | Integration | Ready |
|---------|-----------|--------|-----|------|------|-------------|-------|
| auth-service | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ | ⚠️ |
| product-service | ✅ | ✅ | ✅ | ✅ | ⚠️ | ⚠️ | ✅ |
| cart-service | ✅ | ✅ | ⚠️ | ✅ | ⚠️ | ❌ | ⚠️ |
| user-service | ⚠️ | ⚠️ | ⚠️ | ❌ | ❌ | ⚠️ | ❌ |
| order-service | ⚠️ | ⚠️ | ❌ | ❌ | ⚠️ | ⚠️ | ❌ |
| warehouse-service | ✅ | ⚠️ | ✅ | ✅ | ✅ | ✅ | ✅ |
| content-service | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| feed-service | ✅ | ✅ | ✅ | ✅ | ✅ | ⚠️ | ✅ |

**Legend:** ✅ Good | ⚠️ Issues | ❌ Broken/Missing  
**Overall MVP Ready:** 4/8 services

---

## Detailed Findings

### 1. auth-service (Port 3001)

**Overall Status:** ⚠️ Partial

#### Structure & Files
- Present: `src/index.ts`, `src/routes/index.ts`, `src/controllers/auth.controller.ts`, `src/services/auth.service.ts`, `src/middleware/gateway.ts`, `src/repositories/otp.repository.ts`.
- Missing vs `backend/services/claude.md`: strict CORS allowlist, `morgan`, swagger, centralized error-handler module, graceful shutdown.

#### Entry Point & Health
- Port: `process.env.PORT || 3001` ✅ (`backend/services/auth-service/src/index.ts:L37-L42`)
- Health endpoint: `GET /health` ✅ (`src/index.ts:L16-L23`)
- Graceful shutdown: ❌

#### Database/Schema
- No Prisma schema in service folder (OTP/user persistence delegated elsewhere). ⚠️
- OTP persistence is in-memory Map (not durable).

#### API Routes & Endpoints
- Found:
  - `POST /api/auth/login`
  - `POST /api/auth/signup`
  - `POST /api/auth/send-otp`
- Missing/commented (expected for production readiness): refresh/session/logout/me endpoints ⚠️
- Validation:
  - login/signup use shared Zod middleware ✅ (`backend/services/auth-service/src/routes/index.ts:L13-L14`)
  - send-otp has no validation ⚠️ (`routes/index.ts:L15`)

#### Authentication & Security
- Gateway trust middleware exists but deviates from standard:
  - **P1:** uses `GATEWAY_SECRET` with insecure default `'internal-gateway-secret'` (`backend/services/auth-service/src/middleware/gateway.ts:L3-L4`)
  - **P1:** open CORS (`cors()`) (`backend/services/auth-service/src/index.ts:L12-L15`)
- No rate limiting for OTP endpoints (abuse risk).

#### Service Integration
- Calls `user-service` internal endpoints:
  - `POST {USER_SERVICE_URL}/internal/verify`
  - `POST {USER_SERVICE_URL}/internal/create`
- **P0:** wrong default `USER_SERVICE_URL` (`http://localhost:8018`) (`backend/services/auth-service/src/services/auth.service.ts:L15-L20`)

#### Code Quality
- Inconsistent response envelopes (`success` sometimes present, sometimes not).
- OTP repository explicitly warns it is not production ready.

#### Issues Found
| Severity | Issue | Location | Description |
|----------|-------|----------|-------------|
| P0 | Wrong default user-service URL | `backend/services/auth-service/src/services/auth.service.ts:L15-L20` | Defaults to port 8018, breaking login/signup unless env overrides. |
| P1 | Insecure gateway secret default + env drift | `backend/services/auth-service/src/middleware/gateway.ts:L3-L4` | Uses `GATEWAY_SECRET` with default value; standard expects `GATEWAY_SECRET_KEY` and no default. |
| P1 | Open CORS | `backend/services/auth-service/src/index.ts:L12-L15` | `cors()` without allowlist. |
| P1 | OTP storage is in-memory | `backend/services/auth-service/src/repositories/otp.repository.ts:L4-L7` | Breaks on restart / multi-instance. |
| P2 | Missing send-otp validation | `backend/services/auth-service/src/routes/index.ts:L15` | No schema validation/rate limit. |

#### Recommendations
1. **P0:** Fix default `USER_SERVICE_URL` to `http://localhost:3004`.
2. **P1:** Align gateway trust to `claude.md` (`GATEWAY_SECRET_KEY`, strict allowlist CORS; remove default secret).
3. **P1:** Move OTP storage to Redis (TTL + attempts) and add rate limiting.

---

### 2. product-service (Port 3002)

**Overall Status:** ✅ Ready (with P1 cleanup)

#### Structure & Files
- Strong `claude.md` compliance: swagger, strict CORS allowlist, morgan, centralized error handler, auth middleware, graceful shutdown ✅.

#### Entry Point & Health
- `GET /health` ✅ (`backend/services/product-service/src/index.ts:L43-L52`)

#### Database/Schema
- Prisma schema present and aligned with social commerce draft approval workflow + outbox ✅ (`backend/services/product-service/prisma/schema.prisma`).

#### API Routes & Endpoints
- Tagging contracts:
  - `GET /api/products/:id/taggable` ✅ (`backend/services/product-service/src/routes/product.routes.ts:L172`)
  - `POST /api/products/batch-taggable` ✅ (`product.routes.ts:L196`)
- Draft + moderation workflows implemented ✅ (`src/routes/draft.routes.ts`, `src/routes/moderation.routes.ts`)

#### Authentication & Security
- Gateway trust + internal service auth + RBAC patterns present ✅ (`backend/services/product-service/src/middleware/auth.ts`)

#### Service Integration
- Draft approval calls seller-service + notification-service clients (outside the “8 core services” list but relevant operationally).

#### Code Quality
- Draft approval publishes outbox events and uses DB transactions ✅ (`backend/services/product-service/src/services/product-draft.service.ts`)
- **P1 risk:** `AdminController` appears to reference legacy Prisma model names/columns (`prisma.product_variants`, `variant_name`, `stock_quantity`), which may not exist in the current Prisma schema (`backend/services/product-service/src/controllers/admin.controller.ts:L143-L152`).

#### Issues Found
| Severity | Issue | Location | Description |
|----------|-------|----------|-------------|
| P1 | Possible legacy Prisma usage in admin controller | `backend/services/product-service/src/controllers/admin.controller.ts:L143-L152` | Could break `/api/admin/*` endpoints or builds if model names don’t exist in current Prisma schema. |
| P2 | Outbox publisher not visible in 8-service slice | N/A | Service writes `ServiceOutbox`, but relay/worker is not shown here. |

#### Recommendations
1. **P1:** Reconcile `/api/admin/*` handlers with current Prisma schema or remove legacy code paths.
2. **P2:** Confirm and document outbox relay publishing to Kafka.

---

### 3. cart-service (Port 3003, Go)

**Overall Status:** ⚠️ Partial

#### Structure & Files
- Standard layout: `cmd/main/main.go`, `internal/controller`, `internal/service`, `internal/repository`, `domain/*` ✅.

#### Entry Point & Health
- Uses shared server; health endpoint added ✅ (`backend/services/cart-service/cmd/main/main.go:L25-L34`)

#### Database/Schema
- GORM schema for `cart` + `cart_item` ✅ (`backend/services/cart-service/domain/models/models.go`)
- Item types are `brand_product` and `seller_product` (note docs use `warehouse_product`) ⚠️.

#### API Routes & Endpoints
- User-facing:
  - `POST /api/cart/addToCart` ✅
  - `GET /api/cart/` ✅ (requires header-based user id middleware)
- Compatibility (order-service style):
  - `GET /api/cart/{userId}` ✅
  - `DELETE /api/cart/{userId}` ✅
- Internal router exists but has no internal endpoints registered yet ⚠️.

#### Authentication & Security
- Uses shared Go middleware:
  - `UserIDMiddleware` for user-facing routes ✅
  - `ServiceAuthMiddleware` for internal router ✅

#### Service Integration
- **P0:** product integration depends on gateway-only endpoint and mismatched DTO:
  - calls `GET {GATEWAY_URL}/api/v1/products/productsBase/{id}` (`backend/services/cart-service/clients/product_http_client.go:L47-L49`)
  - expects `{ supplier_id, stock_quantity, price, image_url }` (`backend/services/cart-service/domain/types/response_dto.go:L13-L25`)
  - does not match product-service’s documented public routes; requires a gateway adapter/legacy endpoint.

#### Code Quality
- Cart creation + totals recalculation implemented ✅ (`backend/services/cart-service/internal/service/cart_service.go:L66-L156`)
- Some business mapping uses heuristic `supplier_id == nil => seller_product` (fragile) ⚠️.

#### Issues Found
| Severity | Issue | Location | Description |
|----------|-------|----------|-------------|
| P0 | Product contract depends on gateway-only endpoint | `backend/services/cart-service/clients/product_http_client.go:L47-L49` | Breaks unless gateway exposes/maintains `productsBase` contract. |
| P1 | Docs/enum mismatch (`warehouse_product` vs `brand_product`) | `backend/services/cart-service/DOCUMENTATION.md` + `domain/models/models.go:L103-L108` | Confusing and breaks contract assumptions across services. |
| P2 | Internal endpoints not implemented | `backend/services/cart-service/internal/controller/cart_handler.go:L35-L38` | Internal router only wires middleware; no internal operations exposed. |

#### Recommendations
1. **P0:** Define the canonical product “base snapshot” API and implement it directly in product-service OR formalize the gateway adapter with tests.
2. **P1:** Standardize item-type naming across services/docs.

---

### 4. user-service (Port 3004)

**Overall Status:** ❌ Not Ready

#### Structure & Files
- Basic structure present, local prisma client exists ✅ (`backend/services/user-service/src/lib/prisma.ts`)
- Missing standard middleware set: no gateway auth, no internal service auth, no strict CORS allowlist, no morgan/swagger/error handler module. ❌

#### Entry Point & Health
- Health endpoint exists ✅ (`backend/services/user-service/src/index.ts:L17-L24`)
- CORS is open (`cors()`) ⚠️.

#### Database/Schema
- Prisma schema exists but is mis-labeled and uses `AUTH_DATABASE_URL` env name (likely misconfigured) ⚠️ (`backend/services/user-service/prisma/schema.prisma:L14-L17`).

#### API Routes & Endpoints
- External:
  - `GET /api/user/:phoneNumber` ✅ (`backend/services/user-service/src/routes/external.ts:L11-L12`)
  - `POST /api/user/verify` ✅
- Internal:
  - `POST /internal/create` ✅
  - `POST /internal/verify` ✅

#### Authentication & Security
- **P0:** `/internal/*` is unprotected; violates service-to-service trust model.
- `/api/user/*` has no gateway trust enforcement.

#### Code Quality
- **P0:** create-user response mapping bug: uses `user.id` but DTO field is `userId` (`backend/services/user-service/src/controllers/user_controller.ts:L67-L76`).
- **P0:** repository error handling bug: `catch { throw error; }` throws imported `console.error` symbol, not the caught exception (`backend/services/user-service/src/repositories/user_repository.ts:L49-L52`).

#### Issues Found
| Severity | Issue | Location | Description |
|----------|-------|----------|-------------|
| P0 | Wrong field in createUser response | `backend/services/user-service/src/controllers/user_controller.ts:L67-L76` | Returns `id: undefined` (should return `userId` or include `id`). |
| P0 | Broken exception propagation | `backend/services/user-service/src/repositories/user_repository.ts:L49-L52` | Throws imported `error` symbol instead of actual caught error. |
| P0 | Internal endpoints unprotected | `backend/services/user-service/src/index.ts:L27-L28` | No service auth middleware for `/internal/*`. |
| P1 | Schema/env drift | `backend/services/user-service/prisma/schema.prisma:L14-L17` | Uses `AUTH_DATABASE_URL`; likely breaks deployment consistency. |

#### Recommendations
1. **P0:** Fix controller response mapping (`user.userId` vs `user.id`).
2. **P0:** Fix repository catch block and remove `import { error } from 'console'`.
3. **P0:** Add service-to-service HMAC auth to `/internal/*` and gateway trust to `/api/user/*`.
4. **P1:** Normalize env var naming and schema ownership labeling.

---

### 5. order-service (Port 3006, Go)

**Overall Status:** ❌ Not Ready

#### Structure & Files
- Go layout is clean: controller/service/repository + clients ✅.

#### Entry Point & Health
- Health endpoint exists ✅ (`backend/services/order-service/cmd/api/api.go:L29-L34`)

#### Database/Schema
- Order + items are persisted transactionally ✅ (`backend/services/order-service/internal/repository/order_repository.go:L33-L52`)
- Full schema alignment to `order-service-schema.prisma` not validated in this pass ⚠️.

#### API Routes & Endpoints
- Implemented:
  - `GET /api/orders`
  - `POST /api/orders`
- Missing (commented out, but expected per docs): many lifecycle endpoints ❌ (`backend/services/order-service/internal/controller/order_handler.go:L26-L35`)

#### Authentication & Security
- **P0:** No gateway trust/auth middleware protecting `/api/orders` (open create/list). ❌

#### Service Integration
- Cart client uses `GET/DELETE /api/cart/{userId}` and cart-service supports these ✅ (`backend/services/order-service/clients/cart_client.go:L57-L97`)
- Payment client sets service auth headers but is not invoked in CreateOrder ✅ (`payment_client.go:L64-L67`)
- No warehouse reservations called from CreateOrder (checkout incomplete).

#### Code Quality
- Kafka publish call uses placeholder payload `"testing"`/`"Created Order"` ⚠️ (`backend/services/order-service/internal/service/order_service.go:L150-L152`)

#### Issues Found
| Severity | Issue | Location | Description |
|----------|-------|----------|-------------|
| P0 | Missing most order endpoints | `backend/services/order-service/internal/controller/order_handler.go:L26-L35` | Only GET/POST active; lifecycle endpoints commented out. |
| P0 | No auth on order APIs | `backend/services/order-service/cmd/api/api.go` | No gateway trust/service auth enforcement. |
| P0 | Checkout flow incomplete | `backend/services/order-service/internal/service/order_service.go:L57-L155` | Does not create payment, reserve inventory, or clear cart. |
| P2 | Placeholder Kafka event | `backend/services/order-service/internal/service/order_service.go:L150-L152` | Not a structured `order.created` event. |

#### Recommendations
1. **P0:** Add gateway trust middleware for all order endpoints (shared Go equivalent).
2. **P0:** Implement core MVP flows: create payment, reserve/release/confirm warehouse inventory for house brands, clear cart, emit structured `order.created`.
3. **P2:** Replace direct Kafka publish with outbox pattern (or structured event schema).

---

### 6. warehouse-service (Port 3012)

**Overall Status:** ✅ Ready (with one P1 schema caveat)

#### Structure & Files
- Fully standardized: swagger, strict CORS allowlist, morgan, centralized error handler, auth middleware, outbox, graceful shutdown ✅.

#### Entry Point & Health
- `GET /health` ✅ (`backend/services/warehouse-service/src/index.ts:L47-L56`)

#### Database/Schema
- Rich schema for inventory/reservations/outbox ✅
- **P1:** nullable unique hazard: `@@unique([productId, variantId])` while `variantId` nullable (Postgres allows multiple NULLs) (`backend/services/warehouse-service/prisma/schema.prisma:L24-L57`)

#### API Routes & Endpoints
- Warehouse APIs + admin APIs exist and are protected via `gatewayOrInternalAuth` and roles ✅ (`backend/services/warehouse-service/src/routes/*`)

#### Authentication & Security
- Gateway trust + internal service auth implemented consistently ✅ (`backend/services/warehouse-service/src/middleware/auth.ts`)

#### Issues Found
| Severity | Issue | Location | Description |
|----------|-------|----------|-------------|
| P1 | Nullable unique constraint hazard | `backend/services/warehouse-service/prisma/schema.prisma:L24-L57` | Multiple rows can exist where `variantId=NULL`; needs partial unique index or logic. |

#### Recommendations
1. **P1:** Add partial unique indexes for `(product_id) WHERE variant_id IS NULL` and `(product_id, variant_id) WHERE variant_id IS NOT NULL`.

---

### 7. content-service (Port 3017)

**Overall Status:** ✅ Ready

#### Structure & Files
- Standardized patterns present (auth, validation, error handling, strict CORS allowlist, graceful shutdown) ✅.

#### Entry Point & Health
- `GET /health` ✅ (`backend/services/content-service/src/index.ts:L56-L63`)

#### Database/Schema
- Prisma schema includes posts/media/tags with snapshots, hashtags, engagement, moderation, outbox ✅ (`backend/services/content-service/prisma/schema.prisma`)

#### API Routes & Endpoints
- Posts CRUD + engagement + product tag click tracking ✅ (`backend/services/content-service/src/routes/post.routes.ts`)
- Comments, hashtags, collections, moderation routes exist ✅.

#### Authentication & Security
- Gateway trust applied to authenticated post operations; optional auth for some reads ✅.

#### Service Integration
- Integrates with product-service tagging APIs:
  - `GET /api/products/{id}/taggable`
  - `POST /api/products/batch-taggable`
- **P2 risk:** assumes product-service response shape `response.data.data` (`backend/services/content-service/src/clients/product.client.ts:L41-L42`)

#### Issues Found
| Severity | Issue | Location | Description |
|----------|-------|----------|-------------|
| P2 | Response envelope coupling to product-service | `backend/services/content-service/src/clients/product.client.ts:L41-L42` | If product-service response format differs, tagging breaks. |
| P2 | Followers-only visibility check TODO | `backend/services/content-service/src/services/post.service.ts:L292-L316` | No follow relationship enforcement outside dev. |

#### Recommendations
1. **P2:** Add contract tests for taggable endpoints and unify response envelope typing.
2. **P2:** Implement follower relationship check (likely via feed-service follow graph).

---

### 8. feed-service (Port 3018)

**Overall Status:** ✅ Ready (with P1 scaling caveat)

#### Structure & Files
- Standard middleware structure and background jobs ✅.

#### Entry Point & Health
- `GET /health` ✅ (`backend/services/feed-service/src/index.ts:L54-L63`)

#### Database/Schema
- Prisma schema exists ✅ (`backend/services/feed-service/prisma/schema.prisma`)

#### API Routes & Endpoints
- Feed routes (gateway-auth):
  - `GET /api/feed/for-you`
  - `GET /api/feed/following`
  - `GET /api/feed/explore`
  - `POST /api/feed/refresh`
- Follow + trending routes exist ✅.

#### Authentication & Security
- Gateway auth enforced on feed routes ✅ (`backend/services/feed-service/src/routes/feed.routes.ts:L9-L11`)

#### Service Integration
- Expected to ingest engagement/follow signals; outbox exists for follow actions.

#### Issues Found
| Severity | Issue | Location | Description |
|----------|-------|----------|-------------|
| P1 | Cron jobs run inside API process | `backend/services/feed-service/src/index.ts:L101-L108` | Multi-replica deployments can double-run jobs; needs locking or separate worker. |

#### Recommendations
1. **P1:** Run jobs in a dedicated worker deployment or add distributed locking.

---

## Cross-Service Issues

### Contract/Integration Issues
- **P0:** cart-service ↔ product-service contract drift: cart expects `productsBase` gateway endpoint + DTO not matching product-service public APIs.
- **P0:** order-service does not integrate with payment-service or warehouse-service for the MVP checkout path.
- **P0/P1:** user-service internal endpoints violate service-to-service auth model; auth-service defaults are incorrect.

### Consistency Issues
- **P1:** item type naming drift (`warehouse_product` vs `brand_product`).
- **P2:** inconsistent response envelopes across services.

### Architecture Issues
- **P2:** outbox relay/publisher to Kafka is not visible in the 8-service slice; verify and document.

---

## P0 Issues Summary (MVP Blockers)

| # | Service | Issue | Impact |
|---|---------|-------|--------|
| 1 | user-service | Broken create-user response + broken error propagation + no internal auth | Signup/login + internal trust model unreliable |
| 2 | cart-service | Product contract depends on gateway-only endpoint | Add-to-cart likely broken without gateway adapter |
| 3 | order-service | Missing lifecycle endpoints + no auth + checkout integrations missing | Checkout flow incomplete + insecure |
| 4 | auth-service | Wrong default `USER_SERVICE_URL` | Signup/login broken without env override |

---

## P1 Issues Summary (High Priority)

| # | Service | Issue | Impact |
|---|---------|-------|--------|
| 1 | auth-service | Insecure gateway secret default + open CORS | Security exposure |
| 2 | product-service | Possible legacy Prisma usage in admin controller | Admin endpoints/build risk |
| 3 | warehouse-service | Nullable unique constraint hazard | Duplicate inventory rows possible |
| 4 | feed-service | In-process cron jobs | Scaling/races |

---

## Prioritized Action Plan

### P0 - Must Fix for MVP
1. **user-service:** fix response mapping, fix repository catch/throw bug, add service auth on `/internal/*`, add gateway auth on `/api/user/*`.
2. **cart-service ↔ product-service:** implement a stable “product base snapshot” endpoint (or formalize gateway adapter) + add contract tests.
3. **order-service:** add auth, implement missing endpoints, integrate payment + warehouse reservation flows, clear cart, emit structured `order.created`.
4. **auth-service:** fix default `USER_SERVICE_URL`, align auth/cors/otp persistence with `claude.md`.

### P1 - Fix Before Production
1. Fix warehouse partial unique indexes for nullable `variantId`.
2. Split feed-service jobs into worker or add distributed locking.
3. Remove/reconcile legacy admin code paths in product-service.

### P2 - Post-MVP
1. Document and operationalize outbox relay publishing.
2. Standardize response envelope across services.
3. Implement follower checks for followers-only visibility in content-service.

---

## Final Verdict

**MVP Ready:** NO (PARTIAL)  
**Confidence:** MEDIUM  
**Services Ready:** 4/8  
**Blocking Issues:** 4

**Recommendation:** Fix the P0 list and re-run an end-to-end smoke flow: signup → login → create post with product tags → add to cart → create order → create payment → (house brands) reserve inventory.

---

**Review Completed:** 2026-01-28
