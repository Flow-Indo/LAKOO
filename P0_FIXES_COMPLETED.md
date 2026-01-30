# P0 Fixes Completed

**Date:** 2026-01-28  
**Agent:** Cursor coding agent (GPT-5.2)

## Summary

| Issue | Status | Notes |
|-------|--------|-------|
| auth↔user route mismatch | ✅ | `user-service` now mounts `internalRouter` at `/internal` and exposes `POST /internal/create` + `POST /internal/verify` to match `auth-service` client expectations. |
| user-service external route | ✅ | Fixed to `GET /api/user/:phoneNumber` (controller reads `req.params.phoneNumber`). |
| user-service createUser response | ✅ | `createUser` now returns `201` + JSON body (and proper error responses). |
| cart-service stubbed methods | ✅ | Implemented cart creation-on-add, `RemoveFromCart`, and `ClearCart` including totals recalculation. |
| cart-service SQL query | ✅ | Fixed active cart query to properly bind status (`status = ?`). |
| cart-service API routes | ✅ | Added `GET /api/cart/{userId}` and `DELETE /api/cart/{userId}` for order-service compatibility (without requiring `x-user-id`). |
| order-service persistence | ✅ | Implemented `CreateOrder` persistence (transactional order + items creation). |
| order-service response | ✅ | `POST /api/orders` now returns `201` with JSON `{ success: true, data: order }`. |
| order-service payment auth | ✅ | Payment client now sends `x-service-auth` HMAC token header (in addition to `x-service-name`). |
| order-service Kafka config | ✅ | Kafka brokers now come from `KAFKA_BROKERS` config (with a safe local fallback). |

## Files Modified

- `backend/services/user-service/src/index.ts`
- `backend/services/user-service/src/routes/internal.ts`
- `backend/services/user-service/src/routes/external.ts`
- `backend/services/user-service/src/controllers/user_controller.ts`
- `backend/shared/typescript/schemas/user_zodSchema.ts`
- `backend/shared/go/api/server.go`
- `backend/services/cart-service/domain/models/models.go`
- `backend/services/cart-service/domain/repository/cart_repository_interface.go`
- `backend/services/cart-service/domain/types/response_dto.go`
- `backend/services/cart-service/internal/repository/cart_repository.go`
- `backend/services/cart-service/internal/service/cart_service.go`
- `backend/services/cart-service/internal/controller/cart_handler.go`
- `backend/services/cart-service/go.mod`
- `backend/services/order-service/internal/repository/order_repository.go`
- `backend/services/order-service/internal/service/order_service.go`
- `backend/services/order-service/internal/controller/order_handler.go`
- `backend/services/order-service/clients/payment_client.go`
- `backend/services/order-service/clients/cart_client.go`
- `backend/services/order-service/go.mod`

## Verification Results

- **TypeScript (user-service/shared schema)**: targeted lint check on edited files → **no lints reported**.
- **Go (cart-service)**: `go test ./...` → **PASS**.
- **Go (order-service)**: `go test ./...` → **PASS**.

## Remaining Issues

- None of the P0 items listed in `AGENT_PROMPT_P0_FIXES.md` remain.

