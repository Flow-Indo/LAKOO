# Service Authentication Audit Report

**Date:** 2026-01-29
**Auditor:** Claude Opus 4.5 (Orchestrator)

---

## Executive Summary

| Category | Count | Status |
|----------|-------|--------|
| Services with Gateway Auth | 4/14 | ⚠️ Low coverage |
| Services with Internal Routes | 3/14 | ⚠️ Low coverage |
| Fully Compliant | 3/14 | ✅ |
| Needs P0 Fixes | 1/14 | ❌ seller-service |
| Needs P1 Fixes | 8/14 | ⚠️ |

**Key Finding:** Most services rely on the API gateway for authentication and don't have defense-in-depth. This is acceptable for MVP but should be hardened for production.

---

## Detailed Service Analysis

### ✅ Fully Compliant Services

#### 1. logistic-service (Port 3009) - BEST EXAMPLE
**Status:** ✅ EXCELLENT

| Feature | Status | Implementation |
|---------|--------|----------------|
| Gateway Auth | ✅ | `gatewayAuth` middleware |
| Internal Routes | ✅ | `/api/internal/*` with `requireInternalAuth` |
| Optional Auth | ✅ | `optionalGatewayAuth` for public endpoints |
| Combined Auth | ✅ | `gatewayOrInternalAuth` for dual-access |

**Auth File:** [logistic-service/src/middleware/auth.ts](backend/services/logistic-service/src/middleware/auth.ts)

This service has the **gold standard** auth implementation. Other services should follow this pattern.

---

#### 2. user-service (Port 3004)
**Status:** ✅ OK

| Feature | Status | Notes |
|---------|--------|-------|
| Gateway Auth | N/A | Public user lookup (intentional) |
| Internal Routes | ✅ | `/internal` with `serviceAuthMiddleware` |

**Correct Pattern:**
```typescript
app.use('/api/user', externalRouter);       // Public
app.use('/internal', serviceAuthMiddleware, internalRouter);  // Protected
```

---

#### 3. order-service (Port 3006 - Go)
**Status:** ✅ OK

| Feature | Status | Notes |
|---------|--------|-------|
| Gateway Auth | ✅ | `GatewayAuth` middleware on subrouter |
| Internal Routes | Own impl | Uses direct HTTP client |

---

### ⚠️ Services Needing P1 Fixes (Defense-in-Depth)

These services work but rely entirely on the API gateway. They should have gateway auth as backup.

#### 4. product-service (Port 3002)
**Status:** ⚠️ P1

| Feature | Status | Issue |
|---------|--------|-------|
| Gateway Auth | ❌ | Routes have NO auth middleware |
| Internal Routes | ❌ | None defined |

**Current:** All routes public
```typescript
app.use('/api/products', productRoutes);  // No auth!
```

**Risk:** If gateway is bypassed, all product data is exposed.

---

#### 5. content-service (Port 3017)
**Status:** ⚠️ P1

| Feature | Status | Issue |
|---------|--------|-------|
| Gateway Auth | ✅ | Has `gatewayAuth` on write routes |
| Internal Routes | ❌ | None defined |

**Good:** Has auth on mutation routes
**Missing:** No internal routes for service-to-service calls

---

#### 6. feed-service (Port 3018)
**Status:** ⚠️ P1

| Feature | Status | Issue |
|---------|--------|-------|
| Gateway Auth | ✅ | `router.use(gatewayAuth)` on all routes |
| Internal Routes | ❌ | None defined |

**Good:** All routes protected
**Missing:** No internal routes for event consumers

---

#### 7. warehouse-service (Port 3012)
**Status:** ⚠️ P1

| Feature | Status | Issue |
|---------|--------|-------|
| Gateway Auth | ❌ | Routes have NO auth middleware |
| Internal Routes | ❌ | None defined |

**Risk:** Inventory data exposed if gateway bypassed.

---

#### 8. payment-service (Port 3007)
**Status:** ⚠️ P1

| Feature | Status | Issue |
|---------|--------|-------|
| Gateway Auth | ❌ | Routes have NO auth middleware |
| Internal Routes | ❌ | None defined |

**Risk:** Payment endpoints exposed. Webhooks should be protected by signature verification (check implementation).

---

#### 9. address-service (Port 3010)
**Status:** ⚠️ P1

| Feature | Status | Issue |
|---------|--------|-------|
| Gateway Auth | ❌ | Routes have NO auth middleware |
| Internal Routes | ❌ | None defined |

---

#### 10. review-service (Port 3016)
**Status:** ⚠️ P1

| Feature | Status | Issue |
|---------|--------|-------|
| Gateway Auth | ❌ | Routes have NO auth middleware |
| Internal Routes | ❌ | None defined |

---

#### 11. cart-service (Port 3003 - Go)
**Status:** ⚠️ P1

| Feature | Status | Issue |
|---------|--------|-------|
| Gateway Auth | ❌ | External routes only have `UserIDMiddleware` |
| Internal Routes | ❌ | Router exists but NO routes registered |

**Current Code:**
```go
func (h *CartHandler) RegisterRoutes(external *mux.Router, internal *mux.Router) {
    userFacing := external.PathPrefix("").Subrouter()
    userFacing.Use(middleware.UserIDMiddleware)  // Only checks x-user-id, NOT gateway key!

    // External routes allow ANY userId to be specified!
    external.HandleFunc("/{userId}", h.GetCartByUserID)  // Security issue!

    internal.Use(middleware.ServiceAuthMiddleware)
    // NO internal routes registered!
}
```

**Issues:**
1. No `GatewayAuth` on external routes
2. `/{userId}` endpoint allows accessing ANY user's cart
3. Internal router has middleware but no routes

---

#### 12. auth-service (Port 3001)
**Status:** ✅ OK (Special Case)

| Feature | Status | Notes |
|---------|--------|-------|
| Gateway Auth | N/A | This IS the auth entry point |
| Internal Routes | N/A | Called via shared auth utilities |

Auth-service is the authentication provider - it doesn't need gateway auth.

---

### ❌ Services Needing P0 Fixes

#### 13. seller-service (Port 3015 - Go)
**Status:** ❌ P0

| Feature | Status | Issue |
|---------|--------|-------|
| Gateway Auth | ❌ | Missing |
| Internal Routes | ❌ | Missing |
| Compilation | ❌ | Wrong `RegisterRoutes` signature |

See [SELLER_SERVICE_REVIEW.md](SELLER_SERVICE_REVIEW.md) for full details.

---

### ⏳ Not Implemented

#### 14. notification-service (Port 3008)
**Status:** ⏳ Not implemented yet

---

## Risk Assessment

| Risk Level | Services | Action |
|------------|----------|--------|
| **Critical (P0)** | seller-service | Must fix before deploy |
| **High (P1)** | cart-service (userId exposure) | Should fix for security |
| **Medium (P1)** | product, warehouse, payment, address, review | Add gateway auth for defense-in-depth |
| **Low** | content, feed | Already have gateway auth, just missing internal routes |

---

## Recommended Fix Priority

### Immediate (Before MVP)
1. **seller-service P0** - Won't compile, no auth, no registration
2. **cart-service P1** - `/{userId}` endpoint is a security hole

### Short-term (Post-MVP)
3. Add gateway auth to: product, warehouse, payment, address, review
4. Add internal routes where needed for service-to-service communication

### Pattern to Follow

Use **logistic-service** as the reference implementation:

```typescript
// middleware/auth.ts
export const gatewayAuth = ...
export const requireInternalAuth = ...
export const gatewayOrInternalAuth = ...

// routes/external.ts
router.use(gatewayAuth);
router.get('/', controller.list);

// routes/internal.ts
router.use(requireInternalAuth);
router.post('/shipments', controller.createInternal);
```

---

## Summary Table

| Service | Port | Lang | Gateway Auth | Internal Routes | Status |
|---------|------|------|--------------|-----------------|--------|
| auth-service | 3001 | TS | N/A | N/A | ✅ OK |
| product-service | 3002 | TS | ❌ | ❌ | ⚠️ P1 |
| cart-service | 3003 | Go | ❌ | ❌ (empty) | ⚠️ P1 |
| user-service | 3004 | TS | N/A | ✅ | ✅ OK |
| order-service | 3006 | Go | ✅ | Own | ✅ OK |
| payment-service | 3007 | TS | ❌ | ❌ | ⚠️ P1 |
| logistic-service | 3009 | TS | ✅ | ✅ | ✅ BEST |
| address-service | 3010 | TS | ❌ | ❌ | ⚠️ P1 |
| warehouse-service | 3012 | TS | ❌ | ❌ | ⚠️ P1 |
| seller-service | 3015 | Go | ❌ | ❌ | ❌ P0 |
| review-service | 3016 | TS | ❌ | ❌ | ⚠️ P1 |
| content-service | 3017 | TS | ✅ | ❌ | ⚠️ P1 |
| feed-service | 3018 | TS | ✅ | ❌ | ⚠️ P1 |

---

**Document Status:** COMPLETE
**Next Action:** Fix seller-service P0, then cart-service P1
