# Orders API (Seller-facing)

MVP subset of endpoints used by the seller dashboard.

Base path (from main.go):

- Host: `localhost:3015`
- Base: `/api/sellers/{sellerId}`

## List Orders

`GET /api/sellers/{sellerId}/orders`

Query params (all optional):

- `status`: `pending | processing | ready_to_ship | shipped | completed | cancelled`
- `from`: ISO date string (e.g. `2026-01-01`)
- `to`: ISO date string (e.g. `2026-01-31`)
- `q`: free-text search (order number, buyer name, etc.)
- `page`: page number (default `1`)
- `limit`: page size (default `20`)

Response (example shape):

```json
{
  "orders": [
    {
      "id": "order-id-1",
      "order_number": "INV-20260127-0001",
      "status": "pending",
      "created_at": "2026-01-27T10:00:00Z",
      "buyer_name": "John Doe",
      "total_amount": 155000,
      "shipping_city": "Jakarta"
    }
  ],
  "page": 1,
  "limit": 20,
  "total": 123
}
```

## Get Order Detail

`GET /api/sellers/{sellerId}/orders/{orderId}`

Response (simplified UI shape):

```json
{
  "id": "order-id-1",
  "order_number": "INV-20260127-0001",
  "status": "pending",
  "created_at": "2026-01-27T10:00:00Z",
  "buyer_name": "John Doe",
  "buyer_phone": "+62 812 3456 7890",
  "shipping_address": "Jl. Contoh No. 123",
  "shipping_city": "Jakarta",
  "shipping_postal_code": "12345",
  "subtotal": 140000,
  "shipping_cost": 15000,
  "tax_amount": 0,
  "discount_amount": 0,
  "total_amount": 155000,
  "tracking_number": "AB123456789ID",
  "estimated_delivery_date": "2026-01-30",
  "items": [
    {
      "id": "item-1",
      "product_id": "prod-1",
      "name": "Kaos Laku Merah",
      "variant": "Size M",
      "quantity": 1,
      "unit_price": 75000,
      "subtotal": 75000
    }
  ]
}
```

## Fulfilment Actions

### Confirm Order

`POST /api/sellers/{sellerId}/orders/{orderId}/confirm`

Use when seller accepts the order.

### Ship Order

`POST /api/sellers/{sellerId}/orders/{orderId}/ship`

Use when seller hands the package to courier.

### Update Tracking

`PATCH /api/sellers/{sellerId}/orders/{orderId}/tracking`

Request body:

```json
{
  "tracking_number": "AB123456789ID"
}
```

## Status model (MVP)

Recommended minimal state machine:

- `pending` → order placed and paid
- `ready_to_ship` → optional intermediate before shipping
- `shipped` → package handed to courier
- `completed` → delivered or auto-completed
- `cancelled` → cancelled by system/support

The seller dashboard currently uses:

- Tab `Perlu Dikirim` → `ready_to_ship`
- Tab `Dikirim` → `shipped`
- Tab `Selesai` → `completed`
- Tab `Pembatalan` → `cancelled`

