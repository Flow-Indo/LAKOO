# Seller-Service P0 Fixes Summary

**For:** Friend handling seller-service
**Priority:** All P0 (must fix before MVP)
**Service:** seller-service (Go, Port 3015)

---

## Quick Overview

| # | Issue | Status | Impact |
|---|-------|--------|--------|
| P0-1 | RegisterRoutes signature | ❌ | **Won't compile** |
| P0-2 | No gateway auth | ❌ | Security hole |
| P0-3 | No seller registration | ❌ | Can't create sellers |
| P0-4 | No internal routes | ❌ | Service integration broken |

---

## P0-1: Fix RegisterRoutes Signature (COMPILATION ERROR)

**File:** `internal/controller/seller_handler.go:25`

**Problem:** The shared API server expects 2 router parameters, but handler only accepts 1.

**Current (broken):**
```go
func (h *SellerHandler) RegisterRoutes(r *mux.Router) {
    // all routes here...
}
```

**Fix:**
```go
func (h *SellerHandler) RegisterRoutes(external *mux.Router, internal *mux.Router) {
    // External routes (gateway auth required)
    external.HandleFunc("", h.CreateSeller).Methods("POST")  // NEW: registration
    external.HandleFunc("/{sellerId}", h.GetSellerProfile).Methods("GET")
    external.HandleFunc("/{sellerId}/shop", h.UpdateShopInfo).Methods("PATCH")
    // ... rest of external routes ...

    // Internal routes (service-to-service auth)
    internal.HandleFunc("/{sellerId}", h.GetSellerInternal).Methods("GET")
    internal.HandleFunc("/by-user/{userId}", h.GetSellerByUserID).Methods("GET")
}
```

---

## P0-2: Add Gateway Auth Middleware

**Problem:** All routes are publicly accessible without `x-gateway-key` validation.

**Fix:** Create middleware file and apply to external routes.

**Create:** `internal/middleware/gateway_auth.go`
```go
package middleware

import (
    "net/http"
    "os"
)

func GatewayAuth(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        gatewayKey := r.Header.Get("x-gateway-key")
        expectedKey := os.Getenv("GATEWAY_KEY")

        if expectedKey == "" {
            // Dev mode: skip auth
            next.ServeHTTP(w, r)
            return
        }

        if gatewayKey != expectedKey {
            w.Header().Set("Content-Type", "application/json")
            w.WriteHeader(http.StatusUnauthorized)
            w.Write([]byte(`{"success":false,"error":"unauthorized"}`))
            return
        }

        next.ServeHTTP(w, r)
    })
}
```

**Update:** `cmd/main.go` - The shared api.Server already applies middleware, just ensure `GATEWAY_KEY` env var is set.

---

## P0-3: Add Seller Registration Endpoint

**Problem:** No way to create a new seller (only update existing).

**Add to handler:**
```go
// @Summary Create Seller
// @Description Register a new seller account linked to a user
// @Tags Sellers
// @Accept json
// @Produce json
// @Param seller body types.CreateSellerPayload true "Seller registration info"
// @Success 201 {object} types.SellerProfileResponseDTO
// @Router / [post]
func (h *SellerHandler) CreateSeller(w http.ResponseWriter, r *http.Request) {
    var payload types.CreateSellerPayload
    if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
        writeError(w, http.StatusBadRequest, "invalid JSON body")
        return
    }

    seller, err := h.service.CreateSeller(payload)
    if err != nil {
        writeError(w, http.StatusInternalServerError, err.Error())
        return
    }

    writeJSON(w, http.StatusCreated, toProfileDTO(seller))
}
```

**Add to types/request_dto.go:**
```go
type CreateSellerPayload struct {
    UserID          string  `json:"user_id"`
    ShopName        string  `json:"shop_name"`
    BusinessType    string  `json:"business_type"`
    ContactName     string  `json:"contact_name"`
    ContactEmail    string  `json:"contact_email"`
    ContactPhone    string  `json:"contact_phone"`
    ContactWhatsapp *string `json:"contact_whatsapp,omitempty"`
}
```

**Add to service + repository:** Implement `CreateSeller` method.

---

## P0-4: Add Internal Routes

**Problem:** Other services (order-service, product-service) can't query seller data.

**Add internal handlers:**
```go
// GetSellerInternal - for service-to-service calls
func (h *SellerHandler) GetSellerInternal(w http.ResponseWriter, r *http.Request) {
    sellerID := mux.Vars(r)["sellerId"]
    seller, err := h.service.GetSellerProfile(sellerID)
    if err != nil {
        writeError(w, http.StatusNotFound, "seller not found")
        return
    }
    writeJSON(w, http.StatusOK, toProfileDTO(seller))
}

// GetSellerByUserID - lookup seller by user_id
func (h *SellerHandler) GetSellerByUserID(w http.ResponseWriter, r *http.Request) {
    userID := mux.Vars(r)["userId"]
    seller, err := h.service.GetSellerByUserID(userID)
    if err != nil {
        writeError(w, http.StatusNotFound, "seller not found")
        return
    }
    writeJSON(w, http.StatusOK, toProfileDTO(seller))
}
```

**Add to repository:**
```go
func (r *SellerRepository) GetByUserID(userID string) (models.Seller, error) {
    var seller models.Seller
    err := r.db.Where("user_id = ?", userID).First(&seller).Error
    return seller, err
}
```

---

## P1 Fixes (Lower Priority)

| Issue | File | Fix |
|-------|------|-----|
| Deprecated `rand.Seed` | `seller_repository.go:675` | Remove the line (Go 1.20+ auto-seeds) |
| Error format | `seller_handler.go:146` | Change `{"error": msg}` to `{"success": false, "error": msg}` |
| S3 required | `cmd/main.go:41` | Make S3 optional with nil check |

---

## Testing After Fixes

```bash
# 1. Build (should compile now)
cd backend/services/seller-service
go build ./...

# 2. Run
go run cmd/main.go

# 3. Test registration
curl -X POST http://localhost:3015/api/sellers \
  -H "Content-Type: application/json" \
  -H "x-gateway-key: your-key" \
  -d '{"user_id":"uuid","shop_name":"Test Shop","contact_name":"Test","contact_email":"test@test.com","contact_phone":"+62812345678","business_type":"individual"}'

# 4. Test internal endpoint
curl http://localhost:3015/internal/sellers/by-user/{userId}
```

---

## Reference Files

- Full review: `SELLER_SERVICE_REVIEW.md`
- Order-service pattern (has gateway auth): `backend/services/order-service/`
- Shared API server: `backend/shared/go/api/server.go`

---

**Questions?** Check the detailed `SELLER_SERVICE_REVIEW.md` or ask the orchestrator (Claude).
