# Gold Standard Service Base: `logistic-service`

**Last Updated:** 2026-01-29
**Purpose:** This is the reference implementation + review checklist to standardize all LAKOO microservices.

---

## What “Gold Standard” Means Here
This service is the baseline for:
- Auth patterns (gateway trust + service-to-service HMAC)
- Clean layering (routes → controllers → services → repositories)
- Consistent errors + response shape
- Zod validation
- Docker baseline (multi-stage, non-root, healthcheck)

It is also the checklist you should use to audit every other service.

---

## Canonical Patterns To Copy (with source files)

### 1) Authentication (must match these invariants)
**Files:**
- `backend/services/logistic-service/src/middleware/auth.ts`
- `backend/services/logistic-service/src/utils/serviceAuth.ts`

**Gateway trust (user-facing):**
- Require `x-gateway-key` == `GATEWAY_SECRET_KEY`.
- Require `x-user-id`.
- Optional `x-user-role`.

**Service-to-service HMAC (internal):**
- Require both `x-service-auth` and `x-service-name`.
- Verify the token signature using `SERVICE_SECRET`.
- **Critical:** the signed token’s `serviceName` MUST match `x-service-name` (prevents header spoofing).
- Set the internal identity from the signed token (don’t trust headers beyond matching).

**Dev fallbacks:**
- Allowed only when `NODE_ENV=development` and secrets are intentionally unset.

### 2) Routing (avoid foot-guns)
**Files:**
- `backend/services/logistic-service/src/routes/*.ts`

**Rules:**
- Separate routers by purpose: external, internal, admin, webhook.
- Always apply auth middleware before validation.
- **Order routes from most-specific to least-specific**:
  - Put `/order/:orderId` before `/:id`.
  - Put static paths before `/:param` catch-alls.

### 3) Validation
**File:** `backend/services/logistic-service/src/middleware/validation.ts`

**Rules:**
- Use Zod + a single `validate(schema)` middleware.
- Maintain separate schemas when gateway vs internal requirements differ.
  - Example: internal create-shipment requires `userId`; gateway create-shipment derives it from auth headers.
- Keep error responses consistent (`{ success: false, error, details? }`).

### 4) Error Handling
**File:** `backend/services/logistic-service/src/middleware/error-handler.ts`

**Rules:**
- Use typed errors (`AppError` subclasses) and a single global `errorHandler`.
- Wrap async controllers with `asyncHandler`.

### 5) Database + Prisma
**Files:**
- `backend/services/logistic-service/prisma/schema.prisma`
- `backend/services/logistic-service/src/lib/prisma.ts`
- `backend/services/logistic-service/src/services/outbox.service.ts`

**Rules:**
- Prisma singleton per process.
- Disconnect Prisma on shutdown.
- **Transactional outbox:** write domain changes + outbox rows in the same `prisma.$transaction(...)`.

**Important repo-level decision:**
- Decide whether LAKOO uses snake_case columns.
  - If yes: add `@map("snake_case")` for every multi-word field (Prisma defaults to camelCase columns otherwise).
  - Apply consistently across all services (or migrations become painful).

### 6) External Integrations (Biteship)
**Files:**
- `backend/services/logistic-service/src/config/biteship.ts`
- `backend/services/logistic-service/src/controllers/webhook.controller.ts`
- `backend/services/logistic-service/src/index.ts`

**Rules:**
- Fail fast if required API keys are missing.
- Webhooks must verify signature and must preserve raw-body capture.
- In production: fail closed when webhook verification secrets are missing.

### 7) Docker Baseline
**Files:**
- `backend/services/logistic-service/Dockerfile`
- `backend/services/logistic-service/.dockerignore`
- `backend/services/logistic-service/docker-compose.yml`

**Rules:**
- Multi-stage build.
- Run as non-root.
- Healthcheck.
- Include `.dockerignore`.
- If you need “migrate” in compose, run it on a stage that contains Prisma + schema.

---

## Service Review Checklist (Use for EVERY Service)
Copy/paste this section into your review notes.

### A) Structure
- [ ] Standard folders exist (`src/`, `src/routes/`, `src/controllers/`, `src/services/`, `src/repositories/`, `src/middleware/`)
- [ ] Has `DOCUMENTATION.md` or equivalent
- [ ] Has `.env.example` with correct ports + required secrets
- [ ] Has `Dockerfile`, `.dockerignore`, and (if used) `docker-compose.yml`

### B) Runtime
- [ ] `GET /health` exists and returns service name + env
- [ ] Swagger/OpenAPI available (or documented)
- [ ] Graceful shutdown closes HTTP server and DB clients

### C) Auth & Security
- [ ] Gateway trust middleware implemented (`x-gateway-key`, `x-user-id`)
- [ ] Internal service auth implemented (`x-service-auth`, `x-service-name`, HMAC)
- [ ] **Service name spoofing prevented** (token identity matches header)
- [ ] Role checks centralized (`requireRole`, `requireAdmin`)
- [ ] CORS allowlist configured
- [ ] Helmet enabled

### D) Validation & API Contracts
- [ ] Zod validation on all write endpoints
- [ ] Internal endpoints have schemas appropriate for internal callers
- [ ] Consistent response format across controllers

### E) Data Layer
- [ ] Prisma client is per-service (generated client in service)
- [ ] Naming strategy is consistent (snake_case via `@map` OR documented camelCase)
- [ ] Important queries indexed

### F) Integrations
- [ ] All outbound HTTP calls have timeouts (env-driven)
  - `OUTBOUND_HTTP_TIMEOUT_MS` (service-to-service)
  - `BITESHIP_TIMEOUT_MS` (Biteship)
- [ ] Retries/backoff where appropriate (env-driven where possible)
  - `OUTBOUND_HTTP_RETRIES` (idempotent service-to-service calls)
  - `BITESHIP_RETRIES` (idempotent vendor calls like rates/tracking)
- [ ] Uses `getServiceAuthHeaders()` for service-to-service calls
- [ ] No hardcoded `localhost` defaults that break docker

### G) Ops & DX
- [ ] Logs are structured enough to debug (request IDs if possible)
- [ ] No secrets printed in logs
- [ ] Minimal smoke tests or a documented manual test plan exists

---

## Known Pitfalls (Caught in `logistic-service`, now fixed)
- Route collision: `/order/:orderId` must come before `/:id`.
- Service auth spoofing: don’t trust `x-service-name` without matching the signed token.
- Internal vs gateway validation: internal create-shipment must require `userId`.
- Docker hygiene: missing `.dockerignore` bloats builds.
- Biteship client: don’t send `Authorization: Bearer undefined`.
- Compose migrate: run Prisma commands from a stage that contains Prisma.
- Outbound calls: add timeouts to service-to-service and vendor HTTP.
- Webhook test routes: don’t register them in production.
- Webhook logs: don’t log full payloads in production.

---

## Remaining “Gold Standard” Gaps (do these before production)
- Centralize outbound HTTP policy further (shared client, metrics/tracing, idempotency for notification writes).
- Add an outbox publisher/worker (retries, DLQ, exactly-once-ish semantics) once you introduce a broker.
- Add request IDs + structured logs consistently across services.

---

## Changelog
- **2026-01-29 (Revision 4):** Added transactional outbox + retry/timeout envs + unit-test expectations; kept `GOLD_STANDARD_LOGISTIC_SERVICE.legacy.md` as backup.
