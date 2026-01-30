# Seller Service – Cursor Implementation Notes

This document summarizes what has been implemented/changed in `services/seller-service` during the recent session. It’s written to be pasted into future Cursor chats for fast context.

## Service basics

- **Service**: `seller-service`
- **Go module root**: `services/seller-service`
- **Main entrypoint**: `services/seller-service/cmd/main.go`
- **Base API prefix** (from Swagger `@BasePath`): `/api/sellers`
- **Swagger UI**: `GET /api/sellers/swagger/`

### Running locally

- Run from the module root:

```bash
cd services/seller-service
go run ./cmd
```

If you run `go run ./cmd` from the monorepo root, Go will complain it can’t find the module.

## Analytics endpoints (implemented)

### Routes
Registered in:
- `services/seller-service/internal/controller/seller_handler.go` → `RegisterRoutes`

Endpoints:
- `GET /api/sellers/{sellerId}/analytics/overview`
- `GET /api/sellers/{sellerId}/analytics/top-products`
  - Optional query: `limit` (default `10`)

### Behavior

#### `GET /analytics/overview` (MVP)
Implemented in:
- `services/seller-service/internal/controller/seller_handler.go` → `GetAnalyticsOverview`

Current response DTO:
- `services/seller-service/types/response_dto.go` → `types.SellerAnalyticsOverviewResponseDTO`

Returns:
- `seller_id`
- `total_orders`
- `total_revenue`
- `total_products`
- `top_products` (top 5)

Implementation details:
- Totals are sourced from existing stats logic:
  - `SellerService.GetStatsOverview(sellerID)` → `repo.GetStatsOverview` → reads from `models.Seller` fields (`TotalOrders`, `TotalRevenue`, `TotalProducts`).
- `top_products` is sourced from existing top products logic:
  - `SellerService.GetTopSellingProducts(sellerID, 5)`.

#### `GET /analytics/top-products`
Implemented in:
- `services/seller-service/internal/controller/seller_handler.go` → `GetTopSellingProducts`

Response DTO:
- `services/seller-service/types/response_dto.go` → `types.TopSellingProductsResponseDTO`

Returns:
- `{ "products": []types.TopProductDTO }`

### Active-only top products
Per MVP decision, top products are **active-only**.

Repository change:
- `services/seller-service/internal/repository/seller_repository.go` → `GetTopSellingProducts`

Now filters:
- `seller_id = ?`
- `status = 'active'`
- `deleted_at IS NULL`
- ordered by `sold_count DESC`

## Swagger updates (implemented)

### Swagger annotations added
Added Swagger annotations to analytics handlers:
- `GetAnalyticsOverview`
- `GetTopSellingProducts`

Tag used:
- `@Tags Analytics`

### DTOs added/adjusted for Swagger
Added/updated in:
- `services/seller-service/types/response_dto.go`

DTOs:
- `TopProductDTO`
- `TopSellingProductsResponseDTO`
- `SellerAnalyticsOverviewResponseDTO`

### Swaggo parsing fix for `datatypes.JSON`
Swaggo had trouble generating schema for `gorm.io/datatypes.JSON` fields in request DTOs.

Fix applied in:
- `services/seller-service/types/request_dto.go`

Changes:
- Keep Go types as `datatypes.JSON` / `*datatypes.JSON` for runtime correctness.
- Add struct tag: `swaggertype:"object"` so Swaggo can generate schemas.

Fields:
- `CreateSellerProductPayload.Images datatypes.JSON  `json:"images,omitempty" swaggertype:"object"``
- `UpdateSellerProductPayload.Images *datatypes.JSON `json:"images,omitempty" swaggertype:"object"``

Swagger regeneration command used:

```bash
swag init -g services/seller-service/cmd/main.go
```

Generated files live in:
- `services/seller-service/docs/docs.go`
- `services/seller-service/docs/swagger.json`
- `services/seller-service/docs/swagger.yaml`

Note: There is a non-fatal warning when running swag from the monorepo root (Go module detection). Running from `services/seller-service` avoids that.

## Product counter consistency (implemented)

Problem addressed:
- `seller.total_products` should reflect **non-deleted** seller products.

Fix:
- Increment `seller.total_products` when creating a product.
- Decrement `seller.total_products` when soft deleting a product.
- Clamp to `>= 0`.

Implemented in:
- `services/seller-service/internal/repository/seller_repository.go`

### Create product
Function updated:
- `CreateSellerProduct(product *models.SellerProduct) error`

Now runs in a DB transaction:
- `tx.Create(product)`
- `UPDATE seller SET total_products = GREATEST(total_products + 1, 0)`

### Soft delete product
Function updated:
- `SoftDeleteSellerProduct(sellerID, productID string) error`

Now runs in a DB transaction:
- Soft-deletes product (`deleted_at = now()`).
- If a row was actually deleted (`RowsAffected > 0`):
  - `UPDATE seller SET total_products = GREATEST(total_products - 1, 0)`

## Smoke test commands

### Analytics overview
```bash
curl -sS "http://localhost:3015/api/sellers/<SELLER_ID>/analytics/overview" | jq
```

### Top products
```bash
curl -sS "http://localhost:3015/api/sellers/<SELLER_ID>/analytics/top-products?limit=5" | jq
```

### Create a product
```bash
curl -sS -X POST "http://localhost:3015/api/sellers/<SELLER_ID>/products" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "MVP Test Product",
    "price": 19999,
    "description": "test create product",
    "tags": ["mvp","test"]
  }' | jq
```

### Publish product (required for active-only top-products)
```bash
curl -sS -X PATCH "http://localhost:3015/api/sellers/<SELLER_ID>/products/<PRODUCT_ID>/publish" | jq
```

## Notes / assumptions

- `seller.total_orders`, `seller.total_revenue`, `seller.total_products` are stored on the `seller` table (see `models.Seller`). This service currently reads those counters; it does not compute them from an orders table.
- `top-products` uses `seller_product.sold_count` ordering. If you don’t see results, verify:
  - products have `status = 'active'`
  - `sold_count > 0` (or at least rows exist)
  - products are not soft-deleted.
