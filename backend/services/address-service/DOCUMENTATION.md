# Address Service Documentation

**Service:** address-service
**Port:** 3010
**Database:** address_db (PostgreSQL)
**Language:** TypeScript (Node.js)
**Last Updated:** 2026-02-01

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

The Address Service is LAKOO's **user address management** + **Indonesian location data** layer. It handles:

- User address CRUD operations
- Default address management with concurrency control
- Indonesian location data (Provinces, Cities, Districts, Villages)
- Postal code lookup and validation
- Address usage tracking for analytics
- Courier integration metadata (Biteship, JNE, JNT)

This service emits domain events using a **transactional outbox** (`ServiceOutbox`).

---

## Responsibilities

**Owns**
- `Address` (user delivery addresses with default-address rules)
- `Province`, `City`, `District`, `Village` (Indonesian administrative hierarchy)
- `PostalCode` (postal code reference data)
- `AddressValidationCache` (address validation cache)
- `ServiceOutbox` rows written by this service

**Does NOT own**
- User identity and authentication (auth-service owns user profiles)
- Order data (order-service owns order state)
- Shipping/logistics (logistic-service owns shipment processing)

---

## Architecture

### Layers
- Routes (`src/routes/*`): routing + `express-validator` + `validateRequest`
- Middleware (`src/middleware/*`): auth, validation, centralized errors
- Controllers (`src/controllers/*`): request handlers (thin) + ownership checks
- Services (`src/services/*`): business logic + outbox publishing
- Repositories (`src/repositories/*`): Prisma data access + transactions

### Authentication model

**Gateway trust (end-user traffic via API gateway)**
- `x-gateway-key` must equal `GATEWAY_SECRET_KEY`
- `x-user-id` required
- `x-user-role` optional (e.g. `admin`)

**Service-to-service (internal traffic)**
- `x-service-auth`: `<serviceName>:<timestamp>:<signature>`
- `x-service-name`: `<serviceName>`
- Verified using `SERVICE_SECRET`
- Internal identity is derived from the **signed token**, and must match `x-service-name` (prevents header spoofing).

**Development mode bypass (local testing)**
- When `NODE_ENV=development` and you send **no** `x-gateway-key` / `x-service-auth` headers, the service will allow the request for Swagger/local testing.
- You can optionally set:
  - `x-user-id` (defaults to `DEV_USER_ID` or `11111111-1111-1111-1111-111111111111`)
  - `x-user-role` (defaults to `DEV_USER_ROLE` or `admin` for routes using `gatewayOrInternalAuth`)
- If you send an auth header (e.g. `x-gateway-key`) it will still be validated (wrong keys are rejected).

### Response format
- Success: `{ success: true, data: ... }`
- Delete: `204` (no body)
- Errors: `{ success: false, error: string, details?: any }` (from `src/middleware/error-handler.ts`)

---

## Core Flows

### 1) Create address

```
Client -> API Gateway -> address-service (POST /api/addresses)
  -> Validate user ownership (req.user.id)
  -> Create Address record
  -> If first address: set as default
  -> Write outbox event: address.created
  -> Return address data
```

### 2) Set default address (with concurrency control)

```
Client -> API Gateway -> address-service (POST /api/addresses/:id/set-default)
  -> Verify address ownership
  -> Acquire per-user advisory lock (Postgres)
  -> Transaction:
    - Clear existing default for user
    - Set new address as default
    - Write outbox events: address.updated + address.set_default
  -> Release advisory lock
  -> Return updated address
```

Notes:
- Advisory lock prevents race conditions when multiple requests try to set default simultaneously
- Lock is per-user, so different users don't block each other

### 3) Delete address (soft delete)

```
Client -> API Gateway -> address-service (DELETE /api/addresses/:id)
  -> Verify address ownership
  -> Check: cannot delete the only remaining address
  -> Soft delete (set deletedAt timestamp)
  -> If deleted address was default: pick new default
  -> Write outbox event: address.deleted
  -> Return 204 No Content
```

### 4) Location data lookup

```
Client -> API Gateway -> address-service (GET /api/locations/cities?provinceId=xxx)
  -> Query location repository with filters
  -> Return filtered list of cities
```

Notes:
- Location endpoints are read-heavy, consider caching
- Admin/internal roles can create/update/delete location data
- Regular users can only read location data

---

## API Endpoints

Base routes:
- `/api/addresses` (user address management)
- `/api/locations` (Indonesian location data)

### Authorization summary

**Addresses** (`/api/addresses/*`)
- User-scoped: users can only read/write their own addresses (enforced by `req.user.id`)
- Internal services may operate on any user's addresses via `gatewayOrInternalAuth`
- Special internal-only endpoint: `POST /api/addresses/:id/mark-used` (for order placement tracking)

**Locations** (`/api/locations/*`)
- Read endpoints: accessible to all authenticated users
- Write endpoints (POST/PATCH/DELETE): require `admin` or `internal` role
- Organized in hierarchical groups: provinces, cities, districts, villages, postal-codes

### Address Endpoints

**POST /api/addresses**
- Create a new address for the authenticated user
- Auto-set as default if it's the user's first address
- Returns 201 with created address

**GET /api/addresses/user/:userId**
- List all addresses for a user
- User can only access their own addresses (unless internal)
- Returns array of address objects (excludes soft-deleted)

**GET /api/addresses/user/:userId/default**
- Get the default address for a user
- Used by order-service during checkout
- Returns 404 if no default address found

**GET /api/addresses/:id**
- Get a single address by ID
- User can only access their own addresses

**PATCH /api/addresses/:id**
- Update an address
- If `isDefault` is set to `true`, handles default switching
- User can only update their own addresses

**POST /api/addresses/:id/set-default**
- Set an address as the default
- Uses advisory lock for concurrency control
- Automatically unsets previous default

**DELETE /api/addresses/:id**
- Soft delete an address
- Business rule: cannot delete the only remaining address
- If deleted address was default, picks a new default automatically

**POST /api/addresses/:id/mark-used** (internal-only)
- Mark an address as used (increments `useCount`, updates `lastUsedAt`)
- Called by order-service when an order is placed
- Requires `internal` role

### Location Endpoints

All location endpoints follow similar CRUD patterns. Read operations are available to all authenticated users, while write operations require `admin` or `internal` role.

#### Provinces

**GET /api/locations/provinces**
- Query params: `search` (string), `isActive` (boolean)
- Returns list of provinces

**GET /api/locations/provinces/:id**
- Returns single province by ID

**POST /api/locations/provinces** (admin/internal only)
- Body: `{ code, name, altNames?, latitude?, longitude?, isActive? }`
- Returns 201 with created province

**PATCH /api/locations/provinces/:id** (admin/internal only)
- Update province fields
- Returns updated province

**DELETE /api/locations/provinces/:id** (admin/internal only)
- Deactivate province (sets `isActive = false`)

#### Cities

**GET /api/locations/cities**
- Query params: `provinceId` (UUID), `search` (string), `isActive` (boolean)
- Returns list of cities, optionally filtered by province

**GET /api/locations/cities/:id**
- Returns single city by ID with province relation

**POST /api/locations/cities** (admin/internal only)
- Body: `{ provinceId, code, name, type, altNames?, latitude?, longitude?, isActive? }`
- `type` must be `"kota"` or `"kabupaten"`
- Returns 201 with created city

**PATCH /api/locations/cities/:id** (admin/internal only)
- Update city fields

**DELETE /api/locations/cities/:id** (admin/internal only)
- Deactivate city

#### Districts

**GET /api/locations/districts**
- Query params: `cityId` (UUID), `search` (string), `isActive` (boolean)
- Returns list of districts (kecamatan)

**GET /api/locations/districts/:id**
- Returns single district by ID

**POST /api/locations/districts** (admin/internal only)
- Body: `{ cityId, code, name, altNames?, latitude?, longitude?, isActive? }`
- Returns 201 with created district

**PATCH /api/locations/districts/:id** (admin/internal only)
- Update district fields

**DELETE /api/locations/districts/:id** (admin/internal only)
- Deactivate district

#### Villages

**GET /api/locations/villages**
- Query params: `districtId` (UUID), `postalCode` (string), `search` (string), `isActive` (boolean)
- Returns list of villages (kelurahan/desa)

**GET /api/locations/villages/:id**
- Returns single village by ID

**POST /api/locations/villages** (admin/internal only)
- Body: `{ districtId, code, name, type, postalCode?, altNames?, latitude?, longitude?, isActive? }`
- `type` must be `"kelurahan"` or `"desa"`
- Returns 201 with created village

**PATCH /api/locations/villages/:id** (admin/internal only)
- Update village fields

**DELETE /api/locations/villages/:id** (admin/internal only)
- Deactivate village

#### Postal Codes

**GET /api/locations/postal-codes**
- Query params: `postalCode` (string), `cityName` (string), `provinceName` (string)
- Returns list of postal code records

**GET /api/locations/postal-codes/:id**
- Returns single postal code record by ID

**POST /api/locations/postal-codes** (admin/internal only)
- Body: `{ postalCode, villageName?, districtName?, cityName, provinceName, latitude?, longitude?, biteshipAreaId? }`
- Returns 201 with created postal code record

**PATCH /api/locations/postal-codes/:id** (admin/internal only)
- Update postal code record

**DELETE /api/locations/postal-codes/:id** (admin/internal only)
- Hard delete postal code record

### Swagger

Interactive API documentation: `GET /api-docs`

---

## Events (Outbox)

Outbox table: `ServiceOutbox` (`prisma/schema.prisma`)
Writer: `src/services/outbox.service.ts`

Emitted event types:
- Address: `address.created`, `address.updated`, `address.deleted`, `address.set_default`

Important:
- Events are written transactionally with the main operation
- Downstream services can consume these events for eventual consistency
- Future: implement outbox publisher to relay events to Kafka

---

## Integration Guide

### Order service integration (order-service -> address-service)

When creating an order, order-service should:

1. Fetch the user's default address (or specific address):
   ```bash
   GET /api/addresses/user/{userId}/default
   ```

2. After order placement, mark the address as used:
   ```bash
   POST /api/addresses/{addressId}/mark-used
   -H "X-Service-Name: order-service"
   -H "X-Service-Auth: <serviceName:timestamp:signature>"
   ```

Notes:
- These headers must be generated server-side using `SERVICE_SECRET` (never from browser)
- The `mark-used` endpoint is internal-only for security

### Frontend integration

Frontend should:
- Display location dropdowns in hierarchical order (province → city → district → village)
- Fetch cities only after province is selected
- Validate postal codes using the postal-code lookup endpoint
- Show default address indicator in address list
- Implement address search/filter on client side if needed

Example flow for address form:
```javascript
// 1. User selects province
GET /api/locations/provinces?isActive=true

// 2. User selects city (filtered by province)
GET /api/locations/cities?provinceId={provinceId}&isActive=true

// 3. User selects district
GET /api/locations/districts?cityId={cityId}&isActive=true

// 4. User selects village
GET /api/locations/villages?districtId={districtId}&isActive=true

// 5. Auto-fill postal code (if available)
// Village record may contain postalCode field

// 6. Create address with all data
POST /api/addresses
```

### Logistics service integration

Logistic-service can query postal codes for shipping calculations:
```bash
GET /api/locations/postal-codes?postalCode={code}
```

This returns postal code records with courier area IDs (Biteship, etc.) that can be used for rate calculations.

---

## Setup & Development

Prereqs: Node.js 18+, pnpm, PostgreSQL

### Environment variables (example)

```env
NODE_ENV=development
PORT=3010
SERVICE_NAME=address-service

# Neon / remote Postgres (recommended): include sslmode=require for Neon
ADDRESS_DATABASE_URL=postgresql://user:pass@your-neon-host.neon.tech/address_db?sslmode=require

GATEWAY_SECRET_KEY=your-gateway-secret-key
SERVICE_SECRET=your-service-auth-secret

ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173
```

### Commands

From repo root:
- Install: `pnpm -C backend/services/address-service install`
- Dev: `pnpm -C backend/services/address-service dev`
- Build: `pnpm -C backend/services/address-service build`
- Test: `pnpm -C backend/services/address-service test`
- Prisma:
  - Generate client: `pnpm -C backend/services/address-service db:generate`
  - Push schema: `pnpm -C backend/services/address-service db:push`
  - Create migration: `pnpm -C backend/services/address-service db:migrate`
  - Deploy migrations: `pnpm -C backend/services/address-service db:migrate:prod`
  - Prisma Studio: `pnpm -C backend/services/address-service db:studio`

---

## Docker

- `Dockerfile`: multi-stage build, non-root user
- `docker-compose.yml`: service (DB is expected to be Neon/remote)

Notes:
- Docker build uses pnpm (via corepack), consistent with `pnpm-lock.yaml`
- Optional schema sync: `address-db-push` runs `pnpm -s run db:push` under the `migrate` profile (`docker compose --profile migrate ...`).

---

## Troubleshooting

**Cannot set address as default - concurrent requests**
- Advisory lock should prevent this, but if it happens:
- Check database connection pool isn't exhausted
- Ensure advisory locks are being released (check `pg_locks` table)

**Location data missing**
- Location data must be seeded/imported manually
- Consider creating a seed script for Indonesian location data
- Sources: BPS (Badan Pusat Statistik), courier APIs

**Internal endpoint returns 403**
- Ensure `x-service-auth` header is correctly generated
- Verify `SERVICE_SECRET` matches between services
- Check timestamp isn't too far in past/future

**User can see other users' addresses**
- Check ownership verification in controllers
- Ensure `req.user.id` matches `address.userId` for non-internal requests

---

## File-by-file

- `src/index.ts`: Express bootstrap, routes, health, swagger, error handler, shutdown
- `src/config/env.ts`: Environment validation with fail-fast
- `src/config/swagger.ts`: OpenAPI configuration
- `src/lib/prisma.ts`: Prisma singleton client
- `src/middleware/auth.ts`: `gatewayOrInternalAuth`, `internalOnly`
- `src/middleware/validation.ts`: `validateRequest` + validators
- `src/middleware/error-handler.ts`: Centralized error formatting (`AppError` subclasses)
- `src/routes/address.routes.ts`: Address endpoints + Swagger JSDoc
- `src/routes/location.routes.ts`: Location endpoints (provinces, cities, districts, villages, postal codes)
- `src/controllers/address.controller.ts`: Address request handlers + ownership checks
- `src/controllers/location.controller.ts`: Location request handlers
- `src/services/address.service.ts`: Address business logic + default switching + outbox
- `src/services/location.service.ts`: Location business logic (CRUD operations)
- `src/services/outbox.service.ts`: Outbox event writer
- `src/repositories/address.repository.ts`: Address data access + advisory lock
- `src/repositories/location.repository.ts`: Location data access (provinces, cities, districts, villages, postal codes)
- `scripts/copy-generated-prisma.mjs`: Copies Prisma client into `dist/`

---

## Future Improvements

### High Priority

**Address Validation**
- [ ] Implement address validation cache
- [ ] Integrate with Google Maps/Biteship geocoding API
- [ ] Auto-suggest addresses during input
- [ ] Validate postal code matches city/district

**Location Data**
- [ ] Create seed script for Indonesian location data
- [ ] Implement location data import from BPS
- [ ] Add location data versioning (for annual updates)
- [ ] Cache location queries (Redis)

**Performance**
- [ ] Add database indexes for common queries
- [ ] Implement read replicas for location data
- [ ] Add CDN caching for location endpoints
- [ ] Optimize default address queries

### Medium Priority

**Features**
- [ ] Address templates (save partial addresses)
- [ ] Address verification status workflow
- [ ] Bulk address import API
- [ ] Address deduplication detection
- [ ] Favorite addresses (beyond default)

**Integration**
- [ ] Webhook notifications for address changes
- [ ] Export addresses to CSV/Excel
- [ ] Integration with courier APIs for validation
- [ ] Address autocomplete API

**Security**
- [ ] Rate limiting on address creation
- [ ] Audit logging for address access
- [ ] PII encryption for sensitive fields
- [ ] GDPR compliance (data export/deletion)

### Low Priority

**Developer Experience**
- [ ] GraphQL API for flexible querying
- [ ] Address mocking for development
- [ ] Better Swagger documentation with examples
- [ ] Postman collection

**Analytics**
- [ ] Most-used addresses dashboard
- [ ] Popular delivery areas heatmap
- [ ] Address completion rate metrics
- [ ] Location coverage gaps analysis

---

**Last Updated**: February 1, 2026
**Current Status**: ✅ Addresses + Location Data Complete
**Next Milestone**: Address Validation + Location Data Seeding
