# LAKU Seller Service (Go + GORM)

REST API for seller profiles, store page customization, payouts, and analytics. This service is consumed by the seller-dashboard frontend via `/api/sellers/...`.

## Quick start

### Requirements
- Go 1.22+
- PostgreSQL 13+ (schema required; see notes below)
- AWS S3 credentials (for product/shop image upload)

### Environment
Set in `.env` or shell (defaults in `config/env.go`):
```
SELLER_SERVICE_PORT=:3015
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=seller_db
DB_HOST=localhost
DB_PORT=5432
DB_SSL=disable

AWS_REGION=
AWS_S3_BUCKET=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_PREFIX=seller-verification/
```

### Run
```bash
cd backend/services/seller-service
go run cmd/main.go
# or
go test ./...
```

Service listens on `http://localhost:3015` with base path `/api/sellers`.

### Swagger
When running:
- Swagger UI: `http://localhost:3015/api/sellers/swagger/index.html`
- Host/BasePath (from annotations): `localhost:3015`, `/api/sellers`

## Project structure
- `cmd/main.go` — bootstrap server (DB, S3, routes)
- `config/` — env loader
- `db/` — Postgres connector
- `internal/controller/` — HTTP handlers (mux)
- `internal/service/` — business logic
- `internal/repository/` — DB access (GORM)
- `internal/storage/` — S3 uploader
- `models/` — GORM models
- `types/` — request/response DTOs
- `docs/` — generated Swagger

## Key endpoints (mux)
Base: `/api/sellers/{sellerId}`

**Profile & settings**
- `GET /` seller profile
- `PATCH /shop` update shop info
- `POST /shop/logo` upload logo (S3)
- `PATCH /bank` / `GET /bank`
- `PATCH /business`
- `GET /verification` status
- `GET /stats/overview`

**Verification documents**
- `POST /verification/documents`
- `GET /verification/documents`

**Analytics**
- `GET /analytics/overview`
- `GET /analytics/top-products`

**Finance & payouts**
- `GET /finance/balance`
- `GET /finance/payouts`
- `GET /finance/payouts/{payoutId}`
- `POST /finance/withdraw`
- `GET /finance/payout-schedule`
- `PATCH /finance/payout-schedule`

## Database
- Uses Postgres + GORM; **no auto-migrations here**. Provision schema beforehand (see `backend/seller-service-schema.prisma` for reference).
- Models: `models/*.go` (Seller, SellerStorePage, SellerInventory, SellerPayout, SellerPayoutSchedule, etc.)

## S3 uploads
- Logo: `/{sellerId}/shop/logo`
- Requires AWS creds and bucket configured.

## Common pitfalls
- 404 on variants or products: ensure service is running and base path is `/api/sellers`; restart after adding routes.
- DB connection errors: check `DB_*` envs and Postgres running status.
- S3 errors: verify `AWS_*` envs and bucket/prefix.

## Deployment
- Build: `go build ./...`
- Run behind HTTPS-aware proxy if needed; service itself is HTTP.
