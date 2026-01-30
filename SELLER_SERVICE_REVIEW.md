# Seller Service Review

**Reviewed:** 2026-01-29
**Reviewer:** Claude Opus 4.5 (Orchestrator Agent)
**Service:** seller-service
**Port:** 3015
**Language:** Go (GORM + Gorilla Mux)

---

## Executive Summary

| Category | Status |
|----------|--------|
| **Overall Readiness** | NOT READY |
| **P0 Issues** | 4 Critical |
| **P1 Issues** | 3 Medium |
| **P2 Issues** | 3 Low |

The seller-service has comprehensive business logic but **will not compile** due to a function signature mismatch with the shared API server. Additionally, it lacks authentication middleware and essential endpoints.

---

## P0 Issues (Critical - Must Fix Before MVP)

### P0-1: RegisterRoutes Signature Mismatch (COMPILATION ERROR)

**File:** [seller_handler.go:25](backend/services/seller-service/internal/controller/seller_handler.go#L25)

**Problem:** The handler's `RegisterRoutes` accepts 1 router, but the shared API server expects 2 routers (external + internal).

**Current Code:**
```go
// seller_handler.go
func (h *SellerHandler) RegisterRoutes(r *mux.Router) {  // WRONG: 1 param
    ...
}

// main.go
apiServer.RegisterRoutes(sellerHandler.RegisterRoutes)  // Expects func(*mux.Router, *mux.Router)
```

**Shared Server Expectation (server.go:40-45):**
```go
func (s *Server) RegisterRoutes(registerFunc func(*mux.Router, *mux.Router)) {
    external_subrouter := ...
    internal_subrouter := ...
    registerFunc(external_subrouter, internal_subrouter)  // Passes 2 routers
}
```

**Fix:** Update handler to accept both external and internal routers.

---

### P0-2: No Gateway Authentication Middleware

**File:** [seller_handler.go:25-74](backend/services/seller-service/internal/controller/seller_handler.go#L25-L74)

**Problem:** All routes are publicly accessible. No `x-gateway-key` validation.

**Comparison with order-service (which is correct):**
```go
// order-service/cmd/api/api.go
subrouter := router.PathPrefix("/api/orders").Subrouter()
subrouter.Use(orderMiddleware.GatewayAuth)  // seller-service MISSING THIS
```

**Impact:** Any client can access seller data without going through the API gateway.

**Fix:** Add `GatewayAuth` middleware to external routes.

---

### P0-3: No Seller Registration Endpoint

**File:** [seller_handler.go](backend/services/seller-service/internal/controller/seller_handler.go)

**Problem:** There's no way to create a new seller. The service only has endpoints to manage existing sellers:
- `GET /{sellerId}` - Get profile
- `PATCH /{sellerId}/shop` - Update shop
- etc.

**Missing Endpoint:**
```
POST /api/sellers - Create new seller (link to user_id)
```

**Impact:** Users cannot become sellers without direct database manipulation.

**Fix:** Add `CreateSeller` endpoint that accepts `user_id` and creates a new seller record.

---

### P0-4: No Internal Routes for Service-to-Service Communication

**File:** [seller_handler.go](backend/services/seller-service/internal/controller/seller_handler.go)

**Problem:** No internal endpoints for other services to communicate with seller-service.

**Required Internal Endpoints:**
| Endpoint | Purpose | Called By |
|----------|---------|-----------|
| `GET /internal/sellers/{id}` | Get seller by ID | order-service |
| `GET /internal/sellers/by-user/{userId}` | Get seller by user ID | auth-service |
| `POST /internal/sellers/{id}/stats/order` | Update order count/revenue | order-service |
| `POST /internal/sellers/{id}/stats/product` | Update product count | product-service |

**Impact:** Other services cannot query seller data or update seller stats.

---

## P1 Issues (Medium - Should Fix)

### P1-1: Deprecated rand.Seed Usage

**File:** [seller_repository.go:675](backend/services/seller-service/internal/repository/seller_repository.go#L675)

**Problem:**
```go
func generateRandomString(length int) string {
    rand.Seed(time.Now().UnixNano())  // DEPRECATED in Go 1.20+
    ...
}
```

**Fix:** Remove `rand.Seed()` call - the global random generator is auto-seeded since Go 1.20.

---

### P1-2: Inconsistent Error Response Format

**File:** [seller_handler.go:145-149](backend/services/seller-service/internal/controller/seller_handler.go#L145-L149)

**Problem:**
```go
func writeError(w http.ResponseWriter, status int, msg string) {
    writeJSON(w, status, map[string]interface{}{
        "error": msg,  // Missing "success": false
    })
}
```

**Expected Format (consistent with other services):**
```json
{
    "success": false,
    "error": "error message"
}
```

---

### P1-3: S3 Required for Service Startup

**File:** [cmd/main.go:41-44](backend/services/seller-service/cmd/main.go#L41-L44)

**Problem:**
```go
s3Uploader, err := storage.NewS3Uploader()
if err != nil {
    log.Fatal("Failed to initialize S3 uploader: ", err)  // Service won't start without S3
}
```

**Impact:** Service cannot start in development without AWS credentials.

**Fix:** Make S3 optional - use nil check before S3 operations.

---

## P2 Issues (Low Priority - Nice to Have)

### P2-1: Missing .env.example File

**Problem:** No `.env.example` to guide developers on required environment variables.

**Required Variables:**
```env
SELLER_SERVICE_PORT=:3015
DB_USER=
DB_PASSWORD=
DB_NAME=seller_db
DB_HOST=localhost
DB_PORT=5432
DB_SSL=disable
AWS_REGION=
AWS_S3_BUCKET=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_PREFIX=seller-verification/
GATEWAY_KEY=
```

---

### P2-2: No Health Check Endpoint

**File:** [cmd/main.go](backend/services/seller-service/cmd/main.go)

**Problem:** The shared API server has `AddHealthCheck()` method but it's not called.

**Fix:** Add `apiServer.AddHealthCheck()` before `Start()`.

---

### P2-3: Stray File in Repository

**File:** [seller-service/-F](backend/services/seller-service/-F)

**Problem:** There's a stray file named `-F` in the repository root - likely from an errant command.

**Fix:** Delete the file.

---

## Schema Analysis

### Models (models/models.go)

| Model | TableName | Columns | Status |
|-------|-----------|---------|--------|
| Seller | `seller` | 45+ fields | Good |
| SellerDocument | `seller_document` | 13 fields | Good |
| SellerProduct | `seller_product` | 30+ fields | Good |
| SellerProductVariant | `seller_product_variant` | 16 fields | Good |
| SellerPayout | `seller_payout` | 24 fields | Good |
| SellerPayoutItem | `seller_payout_item` | 8 fields | Good |
| SellerPayoutSchedule | `seller_payout_schedule` | 10 fields | Good |

**Assessment:** Models are well-structured with proper `TableName()` functions for snake_case.

---

## Architecture Assessment

### Strengths
- Clean layered architecture (handler → service → repository)
- Comprehensive seller management features
- S3 integration for document/image uploads
- Product variant support
- Payout/finance system with scheduling
- Soft delete support
- Swagger documentation

### Weaknesses
- No authentication (P0)
- No seller creation flow (P0)
- No internal API (P0)
- Signature mismatch with shared server (P0)

---

## Integration Points

### Expected Integrations (Not Implemented)

| From | To | Purpose | Status |
|------|-----|---------|--------|
| seller-service | auth-service | Verify seller identity | NOT IMPLEMENTED |
| seller-service | product-service | Create product drafts | NOT IMPLEMENTED |
| product-service | seller-service | Update seller stats | NOT IMPLEMENTED |
| order-service | seller-service | Notify seller of orders | NOT IMPLEMENTED |
| payment-service | seller-service | Process seller payouts | NOT IMPLEMENTED |

---

## Fix Priority Order

1. **P0-1** - Fix RegisterRoutes signature (service won't compile)
2. **P0-2** - Add gateway auth middleware (security)
3. **P0-3** - Add seller registration endpoint (core functionality)
4. **P0-4** - Add internal routes (service integration)
5. **P1-1** - Fix deprecated rand.Seed
6. **P1-2** - Fix error response format
7. **P1-3** - Make S3 optional

---

## Recommended File Structure After Fixes

```
seller-service/
├── cmd/main.go                          # Fix: call AddHealthCheck()
├── config/env.go                        # Add: GATEWAY_KEY
├── internal/
│   ├── controller/
│   │   └── seller_handler.go            # Fix: signature, add Create, split internal
│   ├── middleware/
│   │   └── gateway_auth.go              # NEW: Gateway auth middleware
│   ├── repository/seller_repository.go  # Fix: rand.Seed
│   └── service/seller_service.go        # Add: CreateSeller
├── .env.example                         # NEW
└── ...
```

---

## Estimated Work

| Priority | Issues | Complexity |
|----------|--------|------------|
| P0 | 4 issues | High - requires structural changes |
| P1 | 3 issues | Low - simple fixes |
| P2 | 3 issues | Trivial |

---

**Document Status:** COMPLETE
**Next Step:** Fix P0 issues before integration testing
