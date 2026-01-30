# Agent: P0 Critical Fixes - Round 2

**Priority:** 🔴 CRITICAL - Must fix before MVP  
**Reference:** `SERVICE_REVIEW_RESULTS.md` (latest review)  
**Output:** Write completion report to `P0_FIXES_ROUND2_COMPLETED.md`

---

## 🎯 Mission

Fix the remaining P0 (MVP-blocking) issues found in the second service review. These issues prevent the core user flow from working.

---

## 📋 P0 Issues to Fix

### Issue 1: user-service Response Field Mapping Bug

**Problem:** `createUser` response uses `user.id` but DTO field is `userId`, causing `id: undefined`

**File:** `backend/services/user-service/src/controllers/user_controller.ts`

**Location:** Around line 67-76

**Fix:** Ensure the response returns the correct field:
```typescript
// Check what the Prisma model returns and map correctly
return res.status(201).json({
  success: true,
  data: {
    id: user.id,           // Make sure this matches Prisma model
    userId: user.id,       // Include both for compatibility
    phoneNumber: user.phoneNumber,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role
  }
});
```

---

### Issue 2: user-service Broken Error Propagation

**Problem:** Repository has `catch { throw error; }` which throws the imported `console.error` symbol instead of the actual caught exception

**File:** `backend/services/user-service/src/repositories/user_repository.ts`

**Location:** Around line 49-52

**Current (BROKEN):**
```typescript
import { error } from 'console';
// ...
} catch {
    throw error;  // This throws the imported symbol, not the exception!
}
```

**Fix:**
```typescript
// Remove the console import if not needed, or fix the catch:
} catch (err) {
    console.error('Repository error:', err);
    throw err;  // Throw the actual caught error
}
```

**Check ALL catch blocks in this file** for the same pattern.

---

### Issue 3: user-service Internal Endpoints Unprotected

**Problem:** `/internal/*` routes have no service-to-service auth middleware, violating trust model

**File:** `backend/services/user-service/src/index.ts`

**Current:** Internal routes mounted without auth
```typescript
app.use("/internal", internalRouter);
```

**Fix:** Add service auth middleware for internal routes

**Step 1:** Create or import service auth middleware

**File:** `backend/services/user-service/src/middleware/serviceAuth.ts`
```typescript
import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

const SERVICE_SECRET = process.env.SERVICE_SECRET || '';

export function serviceAuthMiddleware(req: Request, res: Response, next: NextFunction) {
  const serviceName = req.headers['x-service-name'] as string;
  const serviceAuth = req.headers['x-service-auth'] as string;
  
  if (!serviceName || !serviceAuth) {
    return res.status(401).json({ 
      success: false, 
      error: 'Missing service authentication headers' 
    });
  }
  
  // Verify HMAC token
  const expectedToken = crypto
    .createHmac('sha256', SERVICE_SECRET)
    .update(serviceName)
    .digest('hex');
  
  if (serviceAuth !== expectedToken) {
    return res.status(403).json({ 
      success: false, 
      error: 'Invalid service authentication' 
    });
  }
  
  next();
}
```

**Step 2:** Apply to internal routes

**File:** `backend/services/user-service/src/index.ts`
```typescript
import { serviceAuthMiddleware } from './middleware/serviceAuth';

// Protected internal routes
app.use("/internal", serviceAuthMiddleware, internalRouter);
```

---

### Issue 4: auth-service Wrong Default USER_SERVICE_URL

**Problem:** Defaults to `http://localhost:8018` but user-service runs on port 3004

**File:** `backend/services/auth-service/src/services/auth.service.ts`

**Location:** Around line 15-20

**Current (WRONG):**
```typescript
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:8018';
```

**Fix:**
```typescript
const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:3004';
```

**Also check:** `backend/services/auth-service/src/clients/userServiceClient.ts` for similar issues.

---

### Issue 5: order-service No Auth Middleware

**Problem:** `/api/orders` routes are completely unprotected - anyone can create/list orders

**File:** `backend/services/order-service/cmd/api/api.go`

**Fix:** Add gateway trust middleware to order routes

**Step 1:** Check if shared Go middleware exists at `backend/shared/go/middleware/`

**Step 2:** Apply auth middleware to routes:
```go
// In api.go or where routes are registered
import "github.com/Flow-Indo/LAKOO/backend/shared/go/middleware"

// Wrap order handlers with auth
router.HandleFunc("/api/orders", middleware.GatewayAuth(orderHandler.ListOrders)).Methods("GET")
router.HandleFunc("/api/orders", middleware.GatewayAuth(orderHandler.CreateOrder)).Methods("POST")
```

**If no shared middleware exists**, create gateway auth:
```go
// backend/services/order-service/internal/middleware/gateway_auth.go
package middleware

import (
    "net/http"
    "os"
)

func GatewayAuth(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        gatewayKey := r.Header.Get("x-gateway-key")
        expectedKey := os.Getenv("GATEWAY_SECRET_KEY")
        
        if expectedKey != "" && gatewayKey != expectedKey {
            w.WriteHeader(http.StatusUnauthorized)
            w.Write([]byte(`{"error": "Unauthorized"}`))
            return
        }
        
        next(w, r)
    }
}
```

---

### Issue 6: order-service Checkout Flow Incomplete

**Problem:** `CreateOrder` doesn't integrate with payment-service, warehouse-service, or clear cart

**File:** `backend/services/order-service/internal/service/order_service.go`

**Current:** Creates order but doesn't complete checkout flow

**Fix:** Add the missing integrations in `CreateOrder`:

```go
func (s *OrderService) CreateOrder(ctx context.Context, userID string, req *dto.CreateOrderRequest) (*models.Order, error) {
    // 1. Get cart
    cart, err := s.cartClient.GetCart(ctx, userID)
    if err != nil {
        return nil, fmt.Errorf("failed to get cart: %w", err)
    }
    if cart == nil || len(cart.Items) == 0 {
        return nil, errors.New("cart is empty")
    }
    
    // 2. Create order (existing code)
    order := &models.Order{
        // ... build order from cart
    }
    
    // 3. Save order to database
    if err := s.orderRepo.CreateOrder(ctx, order); err != nil {
        return nil, fmt.Errorf("failed to create order: %w", err)
    }
    
    // 4. Create payment (if payment-service integration exists)
    // Note: This may be optional for MVP if using external payment
    /*
    paymentReq := &PaymentRequest{
        OrderID:     order.ID,
        Amount:      order.TotalAmount,
        Currency:    order.Currency,
        UserID:      userID,
    }
    _, err = s.paymentClient.CreatePayment(ctx, paymentReq)
    if err != nil {
        // Log but don't fail - payment can be retried
        log.Printf("Warning: failed to create payment: %v", err)
    }
    */
    
    // 5. Reserve warehouse inventory (for house brand items)
    // Note: May be optional for MVP
    /*
    for _, item := range order.Items {
        if item.ItemType == "brand_product" {
            // Call warehouse-service to reserve
        }
    }
    */
    
    // 6. Clear cart (IMPORTANT!)
    if err := s.cartClient.ClearCart(ctx, userID); err != nil {
        // Log but don't fail order creation
        log.Printf("Warning: failed to clear cart: %v", err)
    }
    
    // 7. Publish order.created event (existing Kafka code)
    // ...
    
    return order, nil
}
```

**Minimum for MVP:** At least clear the cart after order creation.

---

### Issue 7: cart-service Product Contract (P0/P1 Hybrid)

**Problem:** Cart service calls `GET {GATEWAY_URL}/api/v1/products/productsBase/{id}` which may not exist in product-service

**File:** `backend/services/cart-service/clients/product_http_client.go`

**Location:** Around line 47-49

**Options:**

**Option A (Quick fix):** Update cart-service to use product-service's actual endpoint:
```go
// Change from:
url := fmt.Sprintf("%s/api/v1/products/productsBase/%s", c.gatewayURL, productID)

// To (use taggable endpoint which exists):
url := fmt.Sprintf("%s/api/products/%s/taggable", c.gatewayURL, productID)
```

And update the response DTO to match what `/taggable` returns.

**Option B (Proper fix):** Add a `/api/products/:id/base` endpoint to product-service that returns the minimal data cart needs (id, name, price, image, sellerId, stock).

**For MVP:** Option A is faster - use the existing `/taggable` endpoint.

---

## ✅ Verification Steps

After all fixes:

### 1. Test user-service:
```bash
cd backend/services/user-service
npm run build  # Should have no errors

# Test create user (via auth or direct)
curl -X POST http://localhost:3004/internal/create \
  -H "Content-Type: application/json" \
  -H "x-service-name: auth-service" \
  -H "x-service-auth: <valid-hmac-token>" \
  -d '{"phoneNumber": "+6281234567890", "firstName": "Test", "lastName": "User", "password": "Test123!"}'

# Should return: { "success": true, "data": { "id": "...", "userId": "...", ... } }
```

### 2. Test auth-service → user-service flow:
```bash
# Start both services
cd backend/services/user-service && npm run dev &
cd backend/services/auth-service && npm run dev &

# Test signup
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+6281234567890", "firstName": "Test", "lastName": "User", "password": "Test123!"}'
```

### 3. Test order-service auth:
```bash
cd backend/services/order-service
go build ./...
go run ./cmd/main.go &

# This should fail without auth:
curl http://localhost:3006/api/orders
# Expected: 401 Unauthorized

# This should work with gateway key:
curl http://localhost:3006/api/orders \
  -H "x-gateway-key: <your-gateway-key>"
```

### 4. Test full checkout flow:
```bash
# Add to cart → Create order → Verify cart cleared
```

---

## 📝 Output

Create `P0_FIXES_ROUND2_COMPLETED.md` with:

```markdown
# P0 Fixes Round 2 - Completed

**Date:** [DATE]
**Agent:** [AGENT]

## Summary
| Issue | Status | Notes |
|-------|--------|-------|
| user-service response field | ✅/❌ | [notes] |
| user-service error propagation | ✅/❌ | [notes] |
| user-service internal auth | ✅/❌ | [notes] |
| auth-service USER_SERVICE_URL | ✅/❌ | [notes] |
| order-service auth middleware | ✅/❌ | [notes] |
| order-service checkout flow | ✅/❌ | [notes] |
| cart-service product contract | ✅/❌ | [notes] |

## Files Modified
- [list]

## Verification Results
- [test results]

## Remaining Issues
- [any issues]
```

---

**Created by:** Orchestrator  
**Based on:** SERVICE_REVIEW_RESULTS.md (Round 2)  
**Date:** 2026-01-28
