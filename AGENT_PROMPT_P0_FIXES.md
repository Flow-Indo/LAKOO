# Agent: P0 Critical Fixes (MVP Blockers)

**Priority:** 🔴 CRITICAL - Must fix before MVP  
**Reference:** `SERVICE_REVIEW_RESULTS.md`  
**Output:** Write completion report to `P0_FIXES_COMPLETED.md`

---

## 🎯 Mission

Fix all P0 (MVP-blocking) issues identified in the service review. These issues prevent the core user flow:

```
Register → Login → Browse → Add to Cart → Checkout → Pay
```

---

## 📋 P0 Issues to Fix (In Order)

### Issue 1: auth-service ↔ user-service Route Mismatch

**Problem:** 
- `auth-service` calls `/internal/verify` and `/internal/create`
- `user-service` exposes `/internal/user/create` and has NO verify endpoint

**Files to Fix:**

#### Option A: Fix user-service routes (RECOMMENDED)

**File:** `backend/services/user-service/src/routes/internal.ts`

Add these routes to match what auth-service expects:
```typescript
// POST /internal/verify - Verify user credentials
router.post('/verify', async (req, res) => {
  // Verify phoneNumber + password
  // Return user if valid, 401 if invalid
});

// POST /internal/create - Create new user  
router.post('/create', async (req, res) => {
  // Create user with phoneNumber, firstName, lastName, password
  // Return created user
});
```

**Also update:** `backend/services/user-service/src/index.ts`
Change from:
```typescript
app.use("/internal/user", internalRouter);
```
To:
```typescript
app.use("/internal", internalRouter);
```

---

### Issue 2: user-service External Route Broken

**Problem:** Route is `GET /api/user/` but controller reads `req.params.phoneNumber`

**File:** `backend/services/user-service/src/routes/external.ts`

Fix the route parameter:
```typescript
// Change from:
router.get('/', userController.findByPhoneNumber);

// To:
router.get('/:phoneNumber', userController.findByPhoneNumber);
```

---

### Issue 3: user-service createUser Doesn't Respond

**Problem:** Controller creates user but never returns response

**File:** `backend/services/user-service/src/controllers/user_controller.ts`

Add response to createUser:
```typescript
async createUser(req: Request, res: Response) {
  try {
    const { phoneNumber, firstName, lastName, password } = req.body;
    const user = await userRepository.createUser(phoneNumber, firstName, lastName, password);
    
    if (!user) {
      return res.status(400).json({ success: false, error: 'Failed to create user' });
    }
    
    // ADD THIS - Return the created user
    return res.status(201).json({
      success: true,
      data: {
        id: user.id,
        phoneNumber: user.phoneNumber,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
```

---

### Issue 4: cart-service Core Methods Stubbed (Go)

**Problem:** `RemoveFromCart`, `ClearCart` return nil, `AddToCart` doesn't create carts

**File:** `backend/services/cart-service/internal/service/cart_service.go`

#### Fix AddToCart - Create cart if not exists:
```go
func (s *CartService) AddToCart(ctx context.Context, userID uuid.UUID, req *dto.AddToCartRequest) (*dto.CartResponse, error) {
    // Get or CREATE cart
    cart, err := s.cartRepo.GetActiveCartByUserID(ctx, userID)
    if err != nil {
        return nil, err
    }
    
    if cart == nil {
        // CREATE NEW CART
        cart = &models.Cart{
            UserID:         &userID,
            Status:         models.CartStatusActive,
            Currency:       "IDR",
            ItemCount:      0,
            Subtotal:       0,
            DiscountAmount: 0,
            LastActivityAt: time.Now(),
            CreatedAt:      time.Now(),
            UpdatedAt:      time.Now(),
        }
        if err := s.cartRepo.CreateCart(ctx, cart); err != nil {
            return nil, err
        }
    }
    
    // ... rest of add to cart logic
}
```

#### Fix RemoveFromCart:
```go
func (s *CartService) RemoveFromCart(ctx context.Context, userID uuid.UUID, itemID uuid.UUID) error {
    cart, err := s.cartRepo.GetActiveCartByUserID(ctx, userID)
    if err != nil {
        return err
    }
    if cart == nil {
        return errors.New("no active cart found")
    }
    
    // Remove the item
    if err := s.cartRepo.RemoveCartItem(ctx, cart.ID, itemID); err != nil {
        return err
    }
    
    // Recalculate totals
    return s.cartRepo.RecalculateCartTotals(ctx, cart.ID)
}
```

#### Fix ClearCart:
```go
func (s *CartService) ClearCart(ctx context.Context, userID uuid.UUID) error {
    cart, err := s.cartRepo.GetActiveCartByUserID(ctx, userID)
    if err != nil {
        return err
    }
    if cart == nil {
        return nil // No cart to clear
    }
    
    // Delete all items
    if err := s.cartRepo.DeleteAllCartItems(ctx, cart.ID); err != nil {
        return err
    }
    
    // Reset cart totals
    cart.ItemCount = 0
    cart.Subtotal = 0
    cart.UpdatedAt = time.Now()
    
    return s.cartRepo.UpdateCart(ctx, cart)
}
```

---

### Issue 5: cart-service Broken SQL Query

**Problem:** `Where("user_id = ? AND status = active", userId)` - status not quoted

**File:** `backend/services/cart-service/internal/repository/cart_repository.go`

Fix the query:
```go
// Change from:
db.Where("user_id = ? AND status = active", userId)

// To:
db.Where("user_id = ? AND status = ?", userId, models.CartStatusActive)
```

---

### Issue 6: cart-service API Route Mismatch

**Problem:** order-service expects `GET /api/cart/{userId}` and `DELETE /api/cart/{userId}`
but cart-service has `GET /api/cart/` with header-based user ID

**File:** `backend/services/cart-service/internal/controller/cart_handler.go`

Add routes for order-service compatibility:

```go
func (h *CartHandler) RegisterRoutes(r *mux.Router) {
    // Existing routes (user-facing with header auth)
    r.HandleFunc("/api/cart/addToCart", h.AddToCart).Methods("POST")
    r.HandleFunc("/api/cart/", h.GetCart).Methods("GET")
    
    // ADD: Internal routes for order-service (path-based user ID)
    r.HandleFunc("/api/cart/{userId}", h.GetCartByUserID).Methods("GET")
    r.HandleFunc("/api/cart/{userId}", h.ClearCartByUserID).Methods("DELETE")
}

// Add handler for path-based user ID
func (h *CartHandler) GetCartByUserID(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    userIDStr := vars["userId"]
    
    userID, err := uuid.Parse(userIDStr)
    if err != nil {
        http.Error(w, "Invalid user ID", http.StatusBadRequest)
        return
    }
    
    cart, err := h.cartService.GetActiveCart(r.Context(), userID)
    // ... return cart JSON
}

func (h *CartHandler) ClearCartByUserID(w http.ResponseWriter, r *http.Request) {
    vars := mux.Vars(r)
    userIDStr := vars["userId"]
    
    userID, err := uuid.Parse(userIDStr)
    if err != nil {
        http.Error(w, "Invalid user ID", http.StatusBadRequest)
        return
    }
    
    err = h.cartService.ClearCart(r.Context(), userID)
    // ... return success
}
```

---

### Issue 7: order-service Doesn't Persist Orders (Go)

**Problem:** `CreateOrder` returns nil and does nothing

**File:** `backend/services/order-service/internal/repository/order_repository.go`

Implement CreateOrder:
```go
func (r *OrderRepository) CreateOrder(ctx context.Context, order *models.Order) error {
    result := r.db.WithContext(ctx).Create(order)
    if result.Error != nil {
        return result.Error
    }
    return nil
}
```

---

### Issue 8: order-service No Response on Create

**Problem:** Create handler doesn't return JSON body

**File:** `backend/services/order-service/internal/handler/order_handler.go`

Add response:
```go
func (h *OrderHandler) CreateOrder(w http.ResponseWriter, r *http.Request) {
    // ... validation and order creation logic ...
    
    order, err := h.orderService.CreateOrder(ctx, req)
    if err != nil {
        w.WriteHeader(http.StatusInternalServerError)
        json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
        return
    }
    
    // ADD: Return created order
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(http.StatusCreated)
    json.NewEncoder(w).Encode(map[string]interface{}{
        "success": true,
        "data":    order,
    })
}
```

---

### Issue 9: order-service Payment Client Missing Auth Header

**Problem:** Payment client doesn't send `x-service-auth` token

**File:** `backend/services/order-service/clients/payment_client.go`

Add service auth header:
```go
func (c *PaymentClient) CreatePayment(ctx context.Context, req PaymentRequest) (*PaymentResponse, error) {
    // Generate service token
    serviceToken := generateServiceToken("order-service", c.serviceSecret)
    
    httpReq, _ := http.NewRequestWithContext(ctx, "POST", c.paymentServiceURL+"/api/payments", body)
    httpReq.Header.Set("Content-Type", "application/json")
    httpReq.Header.Set("x-service-name", "order-service")
    httpReq.Header.Set("x-service-auth", serviceToken)  // ADD THIS
    
    // ... rest of request
}
```

---

### Issue 10: order-service Hardcoded Kafka Brokers

**Problem:** Ignores `KAFKA_BROKERS` config, uses hardcoded localhost

**File:** `backend/services/order-service/internal/service/order_service.go`

Fix to use config:
```go
// Change from:
brokers := []string{"localhost:9092", "localhost:9093"}

// To:
brokers := strings.Split(config.Envs.KAFKA_BROKERS, ",")
if len(brokers) == 0 || brokers[0] == "" {
    brokers = []string{"localhost:9092"} // Fallback for local dev
}
```

---

## ✅ Verification Steps

After all fixes:

### 1. Test auth → user flow:
```bash
# Start services
cd backend/services/user-service && npm run dev
cd backend/services/auth-service && npm run dev

# Test user creation via auth
curl -X POST http://localhost:3001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+6281234567890", "firstName": "Test", "lastName": "User", "password": "Test123!"}'
```

### 2. Test cart-service:
```bash
cd backend/services/cart-service && go build ./... && go run ./cmd/main/main.go

# Add to cart
curl -X POST http://localhost:3003/api/cart/addToCart \
  -H "Content-Type: application/json" \
  -H "x-user-id: <user-uuid>" \
  -d '{"productId": "<product-uuid>", "quantity": 1}'

# Get cart (for order-service)
curl http://localhost:3003/api/cart/<user-uuid>
```

### 3. Test order-service:
```bash
cd backend/services/order-service && go build ./... && go run ./cmd/main.go

# Create order
curl -X POST http://localhost:3006/api/orders \
  -H "Content-Type: application/json" \
  -H "x-user-id: <user-uuid>" \
  -d '{...order data...}'
```

---

## 📝 Output

Create `P0_FIXES_COMPLETED.md` with:

```markdown
# P0 Fixes Completed

**Date:** [DATE]
**Agent:** [AGENT]

## Summary
| Issue | Status | Notes |
|-------|--------|-------|
| auth↔user route mismatch | ✅/❌ | [notes] |
| user-service external route | ✅/❌ | [notes] |
| user-service createUser response | ✅/❌ | [notes] |
| cart-service stubbed methods | ✅/❌ | [notes] |
| cart-service SQL query | ✅/❌ | [notes] |
| cart-service API routes | ✅/❌ | [notes] |
| order-service persistence | ✅/❌ | [notes] |
| order-service response | ✅/❌ | [notes] |
| order-service payment auth | ✅/❌ | [notes] |
| order-service Kafka config | ✅/❌ | [notes] |

## Files Modified
- [list of files]

## Verification Results
- [test results]

## Remaining Issues
- [any issues that couldn't be fixed]
```

---

**Created by:** Orchestrator  
**Based on:** SERVICE_REVIEW_RESULTS.md  
**Date:** 2026-01-28
