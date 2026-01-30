# Product Service Documentation

**Service:** product-service  
**Port:** 3002  
**Database:** product_db (PostgreSQL)  
**Language:** TypeScript (Node.js)  
**Version:** 3.0 (Social Commerce Model)

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Architecture](#architecture)
4. [Draft Approval Workflow](#draft-approval-workflow)
5. [API Endpoints](#api-endpoints)
6. [Database Schema](#database-schema)
7. [Events](#events)
8. [Integration](#integration)
9. [Business Rules](#business-rules)
10. [Setup & Development](#setup--development)

---

## Overview

The Product Service manages the product catalog for LAKOO's social commerce platform. It handles:

- Product and variant management
- **Draft approval workflow** for seller products (3rd business model)
- Content moderation queue
- Product categorization
- Product search and filtering
- Integration with warehouse (house brands) and seller services

### Key Concept: House Brands vs Seller Products

| Type | sellerId | Approval Required | Warehouse | Who Creates |
|------|----------|-------------------|-----------|-------------|
| **House Brand** | `null` | ❌ No (admin direct) | ✅ Yes | LAKOO admin |
| **Seller Product** | UUID | ✅ Yes (draft workflow) | ❌ No | Sellers |

---

## Features

### Core Features (Existing)
- ✅ Product CRUD operations
- ✅ Variant management (SKU-based)
- ✅ Category hierarchy
- ✅ Product images
- ✅ Wishlists
- ✅ Product views analytics

### 🆕 Social Commerce Features (3rd Business Model)
- ✅ **Draft Approval Workflow** - All seller products must be approved before going live
- ✅ **Moderation Queue** - Prioritized queue for moderators
- ✅ **Content Moderation** - Quality control for product listings
- ✅ **Event-Driven Architecture** - Publishes events for approval/rejection
- ✅ **Service Integration** - Notifies sellers and updates stats

---

## Architecture

### Tech Stack
- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL (Neon)
- **ORM:** Prisma
- **Auth:** Gateway Trust Model
- **Events:** Outbox Pattern → Kafka
- **Validation:** express-validator

### Service Structure
```
src/
├── clients/              # Service-to-service clients
│   ├── seller.client.ts
│   ├── warehouse.client.ts
│   └── notification.client.ts
├── controllers/          # HTTP request handlers
│   ├── draft.controller.ts
│   ├── moderation.controller.ts
│   └── product.controller.ts
├── middleware/           # Express middleware
│   ├── auth.ts          # Gateway trust + role checking
│   ├── validation.ts    # Request validation
│   └── error-handler.ts # Centralized error handling
├── repositories/         # Data access layer
│   ├── product-draft.repository.ts
│   ├── moderation-queue.repository.ts
│   └── product.repository.ts
├── routes/              # API route definitions
│   ├── draft.routes.ts
│   ├── moderation.routes.ts
│   └── product.routes.ts
├── services/            # Business logic
│   ├── product-draft.service.ts
│   ├── moderation.service.ts
│   ├── outbox.service.ts
│   └── product.service.ts
├── utils/               # Utilities
│   └── serviceAuth.ts   # Service-to-service auth
└── index.ts             # App entry point
```

---

## Draft Approval Workflow

### Seller Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    SELLER WORKFLOW                           │
└─────────────────────────────────────────────────────────────┘

1. Create Draft          POST /api/drafts
   └─ Status: draft      (Seller can edit freely)

2. Edit Draft            PUT /api/drafts/:id
   └─ Multiple edits     (Only if status = draft or changes_requested)

3. Submit for Review     POST /api/drafts/:id/submit
   └─ Status: pending    (Added to moderation queue)

4. Wait for Review       
   ├─ Approved           → Product created, goes live
   ├─ Rejected           → Can view reason, can delete
   └─ Changes Requested  → Can edit and resubmit
```

### Moderator Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  MODERATOR WORKFLOW                          │
└─────────────────────────────────────────────────────────────┘

1. View Queue            GET /api/moderation/pending
   └─ Sorted by priority (urgent → high → normal → low)

2. Assign to Self        POST /api/moderation/:id/assign
   └─ Locks draft to moderator

3. Review Draft          
   ├─ Check images (quality, authenticity)
   ├─ Check description (no plagiarism)
   ├─ Check price (reasonable)
   ├─ Check category (correct)
   └─ Check compliance (no prohibited items)

4. Make Decision
   ├─ Approve            POST /api/moderation/:id/approve
   │  └─ Creates product, publishes to platform
   ├─ Reject             POST /api/moderation/:id/reject
   │  └─ Provide reason (min 10 chars)
   └─ Request Changes    POST /api/moderation/:id/request-changes
      └─ Provide feedback (min 10 chars)
```

### Status Flow Diagram

```
       [draft]
          │
          │ submit
          ▼
      [pending] ───────────────┐
          │                     │
    ┌─────┼─────┬───────────────┤
    │     │     │               │
 approve reject request      (auto-escalate
    │     │  changes            after 24h)
    │     │     │               │
    ▼     ▼     ▼               │
[approved][rejected][changes_requested]
    │                   │
    │                   │ edit & resubmit
    │                   │
    └───────────────────┴──────→ [pending]
```

---

## API Endpoints

### Draft Endpoints (Seller)

All require `gatewayAuth` (seller authentication)

| Method | Endpoint | Description | Validation |
|--------|----------|-------------|------------|
| POST | `/api/drafts` | Create new draft | Name (3-255), Images (min 3), Variants (min 1) |
| GET | `/api/drafts/my-drafts` | Get my drafts | Query: `status?` |
| GET | `/api/drafts/:id` | Get draft by ID | Ownership check |
| PUT | `/api/drafts/:id` | Update draft | Only if draft/changes_requested |
| POST | `/api/drafts/:id/submit` | Submit for review | Only if draft/changes_requested |
| DELETE | `/api/drafts/:id` | Delete draft | Only if draft/rejected/changes_requested |

### Moderation Endpoints (Admin/Moderator)

All require `gatewayAuth` + `requireRole('admin', 'moderator')`

| Method | Endpoint | Description | Validation |
|--------|----------|-------------|------------|
| GET | `/api/moderation/pending` | Get pending drafts | Query: `limit?`, `offset?` |
| GET | `/api/moderation/queue` | Get moderation queue | Query: `limit?`, `offset?` |
| GET | `/api/moderation/my-queue` | Get my assigned queue | Query: `includeCompleted?` |
| POST | `/api/moderation/:id/assign` | Assign to self | - |
| POST | `/api/moderation/:id/approve` | Approve draft | Creates product |
| POST | `/api/moderation/:id/reject` | Reject draft | Reason (10-500 chars) |
| POST | `/api/moderation/:id/request-changes` | Request changes | Feedback (10-500 chars) |
| POST | `/api/moderation/:id/priority` | Update priority | `low\|normal\|high\|urgent` |
| GET | `/api/moderation/stats` | Get stats | - |

### Product Endpoints (Public + Internal)

**Public read endpoints (no auth):**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List products (pagination + filters) |
| GET | `/api/products/id/:id` | Get product by UUID (avoids collision with `/:slug`) |
| GET | `/api/products/:slug` | Get product by slug (catch-all; must stay last) |

**Internal service endpoints (requires `internalServiceAuth`):**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products/:id/taggable` | Contract for content/cart services (returns taggable summary) |
| POST | `/api/products/batch-taggable` | Batch taggable check (max 50) |

**Write/admin endpoints (requires `gatewayOrInternalAuth` + `requireRole('admin','internal')`):**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/products` | Create product (admin/internal) |
| PATCH | `/api/products/:id` | Update product |
| PATCH | `/api/products/:id/publish` | Publish product (sets status to `approved`) |
| DELETE | `/api/products/:id` | Soft delete product (sets status to `inactive`) |
| POST | `/api/products/:id/images` | Add product images |
| POST | `/api/products/:id/variants` | Add product variant |
| POST | `/api/products/:id/bundle-composition` | Configure grosir bundle composition (house brands only) |
| POST | `/api/products/:id/warehouse-inventory-config` | Ensure warehouse inventory + thresholds (house brands only) |

**Authenticated read endpoints (requires `gatewayOrInternalAuth`):**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products/variants/:variantId` | Get variant by UUID |
| GET | `/api/products/:id/grosir-config` | Get grosir status (house brands only) |

### Category Endpoints (Public + Admin)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/categories` | Public | List categories |
| GET | `/api/categories/:id` | Public | Get category by ID (includes children) |
| POST | `/api/categories` | Admin/Internal | Create category |
| PATCH | `/api/categories/:id` | Admin/Internal | Update category |
| DELETE | `/api/categories/:id` | Admin/Internal | Delete category |

### Admin Endpoints (Admin/Internal)

All require `gatewayOrInternalAuth` + `requireRole('admin','internal')`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/products` | Create product |
| PUT | `/api/admin/products/:id` | Update product |
| DELETE | `/api/admin/products/:id` | Delete product |
| PUT | `/api/admin/products/:id/status` | Update product status (`draft`, `pending_approval`, `approved`, `rejected`, `inactive`, `out_of_stock`) |
| POST | `/api/admin/products/:id/variants` | Create variant |
| PUT | `/api/admin/products/:id/variants/:variantId` | Update variant |
| DELETE | `/api/admin/products/:id/variants/:variantId` | Soft delete variant (`deletedAt` + `isActive=false`) |
| POST | `/api/admin/products/:id/images` | Add images |
| PUT | `/api/admin/products/:id/images/reorder` | Reorder images |
| DELETE | `/api/admin/products/:id/images/:imageId` | Delete image |
| POST | `/api/admin/products/bulk/update` | Bulk update products |
| POST | `/api/admin/products/bulk/delete` | Bulk delete products (soft delete) |
| POST | `/api/admin/products/bulk/import` | Bulk import (currently returns 501) |
| POST | `/api/admin/categories` | Create category |
| PUT | `/api/admin/categories/:id` | Update category |
| DELETE | `/api/admin/categories/:id` | Delete category |

### Example Requests

#### Create Draft
```bash
POST /api/drafts
Content-Type: application/json
x-gateway-key: your-gateway-key
x-user-id: seller-uuid

{
  "categoryId": "cat-uuid",
  "name": "Hijab Voal Premium",
  "description": "Hijab voal premium berbahan lembut...",
  "shortDescription": "Hijab voal premium",
  "baseSellPrice": 45000,
  "images": [
    "https://s3.amazonaws.com/lakoo/img1.jpg",
    "https://s3.amazonaws.com/lakoo/img2.jpg",
    "https://s3.amazonaws.com/lakoo/img3.jpg"
  ],
  "variants": [
    {
      "color": "BLK",
      "colorName": "Black",
      "colorHex": "#000000",
      "size": "STD",
      "sizeName": "Standard",
      "sellPrice": 45000
    },
    {
      "color": "WHT",
      "colorName": "White",
      "colorHex": "#FFFFFF",
      "size": "STD",
      "sizeName": "Standard",
      "sellPrice": 45000
    }
  ],
  "material": "Voal",
  "tags": ["hijab", "voal", "premium"]
}
```

#### Approve Draft
```bash
POST /api/moderation/draft-uuid/approve
x-gateway-key: your-gateway-key
x-user-id: moderator-uuid
x-user-role: moderator

# Response:
{
  "success": true,
  "message": "Draft approved and product created",
  "data": {
    "draft": { ... },
    "product": { ... }
  }
}
```

Dev note: if `NODE_ENV=development`, you can omit `x-user-id` (and even `x-gateway-key` when `GATEWAY_SECRET_KEY` is not set) and rely on `DEV_MODERATOR_ID` / `DEV_USER_ROLE`. See [Setup & Development](#setup--development).

---

## Database Schema

Source of truth: `backend/services/product-service/prisma/schema.prisma` (the excerpts below are kept in sync for quick reference).

### ProductDraft Model
```prisma
model ProductDraft {
  id               String      @id @default(dbgenerated("gen_random_uuid()"))
  sellerId         String      // Reference to Seller Service
  categoryId       String
  name             String      @db.VarChar(255)
  description      String?
  shortDescription String?     @db.VarChar(500)
  baseSellPrice    Decimal     @db.Decimal(15, 2)
  images           Json[]      // Array of image URLs
  variants         Json[]      // Array of variant data
  weightGrams      Int?
  lengthCm         Decimal?    @db.Decimal(10, 2)
  widthCm          Decimal?    @db.Decimal(10, 2)
  heightCm         Decimal?    @db.Decimal(10, 2)
  material         String?
  careInstructions String?
  countryOfOrigin  String?     @db.VarChar(100)
  tags             String[]

  status           DraftStatus @default(draft)
  submittedAt      DateTime?
  reviewedAt       DateTime?
  reviewedBy       String?     // Moderator ID
  rejectionReason  String?     @db.VarChar(500)
  moderationNotes  String?     // Internal notes
  productId        String?     @unique // If approved
  createdAt        DateTime    @default(now())
  updatedAt        DateTime    @updatedAt
}

enum DraftStatus {
  draft
  pending
  approved
  rejected
  changes_requested
}
```

### ModerationQueue Model
```prisma
model ModerationQueue {
  id              String             @id @default(dbgenerated("gen_random_uuid()"))
  draftId         String
  priority        ModerationPriority @default(normal)
  assignedTo      String?            // Moderator ID
  assignedAt      DateTime?
  completedAt     DateTime?
  createdAt       DateTime           @default(now())
}

enum ModerationPriority {
  low
  normal
  high
  urgent
}
```

### Product Model (Updated)
```prisma
model Product {
  id          String        @id @default(dbgenerated("gen_random_uuid()"))
  categoryId  String
  sellerId    String?       // null = house brand, UUID = seller
  draftId     String?       @unique // Link to original draft
  productCode String        @unique
  name        String        @db.VarChar(255)
  slug        String        @unique @db.VarChar(255)
  baseCostPrice Decimal     @db.Decimal(15, 2)
  baseSellPrice Decimal     @db.Decimal(15, 2)
  status      ProductStatus @default(draft)
  tags        String[]
  publishedAt DateTime?
  createdAt   DateTime      @default(now())
  updatedAt   DateTime      @updatedAt
  deletedAt   DateTime?
}

enum ProductStatus {
  draft
  pending_approval
  approved           // Live on platform
  rejected
  inactive
  out_of_stock
}
```

---

## Events

### Published Events

All events are written to `ServiceOutbox` table for eventual delivery to Kafka.
Outbox writes are done inside the same Prisma transaction as the domain write (transactional outbox), so state changes and events are atomic.

| Event | When | Consumers |
|-------|------|-----------|
| `product.draft_submitted` | Draft submitted for review | seller-service |
| `product.approved` | Draft approved | seller-service, notification-service, content-service |
| `product.rejected` | Draft rejected | notification-service |
| `product.changes_requested` | Changes requested | notification-service |
| `product.created` | Product created (after approval) | brand-service, content-service |
| `product.updated` | Product updated | content-service |
| `product.deleted` | Product deleted | content-service, cart-service |

### Event Payloads

#### product.approved
```json
{
  "draftId": "uuid",
  "productId": "uuid",
  "sellerId": "uuid",
  "categoryId": "uuid",
  "name": "Product Name",
  "baseSellPrice": 45000,
  "reviewedBy": "moderator-uuid",
  "reviewedAt": "2026-01-27T10:00:00Z"
}
```

### Consumed Events

| Event | From | Action |
|-------|------|--------|
| `inventory.low_stock` | warehouse-service | Update product availability (house brands only) |
| `seller.suspended` | seller-service | Hide seller's products |

---

## Integration

### Calls to Other Services

#### seller-service
- `GET /api/sellers/:id` - Get seller info
- `POST /api/sellers/:id/products/increment` - Increment product count after approval
- `POST /api/sellers/:id/products/decrement` - Decrement product count when deleted

#### notification-service
- `POST /api/notifications/send` - Send notification to seller about draft decision

#### warehouse-service (house brands only)
- `GET /api/warehouse/inventory/status?productId=:id&variantId=:variantId` - Check inventory availability
- `GET /api/warehouse/check-bundle-overflow?productId=:id&variantId=:variantId` - Check grosir overflow/locking
- `GET /api/warehouse/check-all-variants?productId=:id` - Get per-variant bundle status (UI/config verification)
- `POST /api/admin/inventory` - Create inventory records (admin endpoint; called by product-service via internal auth)
- `POST /api/admin/bundle-config` - Create/update grosir bundle config (admin endpoint; called by product-service via internal auth)

### Called By Other Services

#### content-service
- `GET /api/products/:id/taggable` - Check if product can be tagged in posts
  - Returns: `{ success: true, data: { id, name, sellerId, status, isTaggable, price, primaryImageUrl, productSource } }`
- `POST /api/products/batch-taggable` - Batch taggable check (internal)

#### cart-service
- `GET /api/products/:id/taggable` - MVP contract for product snapshot (id, name, price, etc.)

---

## Business Rules

### Draft Approval Criteria

**Approve if:**
- ✅ Images are high quality (≥ 800x800px)
- ✅ Images appear original (not stolen from other sites)
- ✅ Description is detailed and original
- ✅ Price is reasonable for the category
- ✅ Category is correct
- ✅ No prohibited items

**Reject if:**
- ❌ Images appear stolen (reverse image search)
- ❌ Images are low quality (< 800x800px)
- ❌ Description is copied from elsewhere
- ❌ Price is suspiciously low (potential counterfeit)
- ❌ Prohibited items (weapons, adult content, etc.)
- ❌ Category mismatch

**Request Changes if:**
- 🟡 Minor issues that can be fixed
- 🟡 Images are acceptable but not great
- 🟡 Description needs improvement
- 🟡 Additional information needed

### House Brands vs Seller Products

```typescript
if (product.sellerId === null) {
  // HOUSE BRAND
  // - Created by admin directly (no draft approval)
  // - Managed in warehouse-service
  // - Can have grosir bundle constraints
  // - Example: LAKOO Basics, LAKOO Modest
} else {
  // SELLER PRODUCT
  // - MUST go through draft approval
  // - Seller manages own inventory
  // - No warehouse integration
  // - Seller fulfills orders
}
```

### Who Can Tag Products

- ANY approved product can be tagged in posts (content-service)
- User can tag products from ANY seller
- Product must be status = `approved`
- This is key for social commerce discovery

---

## Setup & Development

### Prerequisites
- Node.js 18+
- PostgreSQL (Neon)
- pnpm

### Environment Variables
```env
PORT=3002
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000

# Database
DATABASE_URL="postgresql://user:pass@localhost:5432/product_db"
# Back-compat (optional): if you already use PRODUCT_DATABASE_URL, product-service maps it to DATABASE_URL on startup.
# PRODUCT_DATABASE_URL="postgresql://user:pass@localhost:5432/product_db"

# Authentication
GATEWAY_SECRET_KEY=your-gateway-secret
SERVICE_SECRET=your-service-secret
SERVICE_NAME=product-service

# Dev-only auth fallbacks (local testing)
# Used when NODE_ENV=development and gateway auth is not configured (or for gatewayOrInternalAuth's dev fallback).
# Tip: set DEV_USER_ROLE=admin or DEV_USER_ROLE=moderator to test protected routes without any headers.
DEV_USER_ROLE=user
DEV_USER_ID=00000000-0000-0000-0000-000000000000
DEV_SELLER_ID=11111111-1111-1111-1111-111111111111
DEV_MODERATOR_ID=22222222-2222-2222-2222-222222222222
DEV_ADMIN_ID=33333333-3333-3333-3333-333333333333

# Internal service auth headers (when calling protected internal endpoints)
# x-service-auth: <serviceName>:<timestamp>:<signature>
# x-service-name: <serviceName>

# Outbound HTTP
OUTBOUND_HTTP_TIMEOUT_MS=5000

# Inter-service URLs
SELLER_SERVICE_URL=http://localhost:3015
WAREHOUSE_SERVICE_URL=http://localhost:3012
NOTIFICATION_SERVICE_URL=http://localhost:3008
```

Notes:
- This service stores image URLs only; it does not upload to S3 directly.
- Dev auth fallback: if `NODE_ENV=development` and `GATEWAY_SECRET_KEY` is not set, `gatewayAuth` will infer a role from the route prefix (`/api/drafts` → `seller`, `/api/moderation` → `moderator`, `/api/admin` → `admin`) unless you explicitly set `x-user-role` or `DEV_USER_ROLE`.

### Installation
```bash
cd backend/services/product-service
pnpm install
pnpm prisma:generate
```

### Database Setup
```bash
# Push schema to database
pnpm prisma:push

# Or create migration
pnpm prisma:migrate

# Open Prisma Studio
pnpm prisma:studio
```

### Run Development
```bash
pnpm dev
```

### Build
```bash
pnpm build
pnpm start
```

### API Documentation
Visit `http://localhost:3002/api-docs` for Swagger documentation.

---

## Testing

### Manual Testing Flow

1. **Create Draft**
   ```bash
   POST /api/drafts
   # Use seller auth
   ```

2. **Submit for Review**
   ```bash
   POST /api/drafts/:id/submit
   ```

3. **Approve Draft (as moderator)**
   ```bash
   POST /api/moderation/:id/approve
   # Use admin/moderator auth
   ```

4. **Verify Product Created**
   ```bash
   GET /api/products/id/:productId
   ```

5. **Check Events**
   ```sql
   SELECT * FROM service_outbox WHERE aggregate_type = 'ProductDraft';
   ```

---

## Troubleshooting

### Common Issues

**Issue: Draft submission fails**
- Check: Does draft have at least 3 images?
- Check: Does draft have at least 1 variant?
- Check: Is draft status 'draft' or 'changes_requested'?

**Issue: Cannot approve draft**
- Check: Is draft status 'pending'?
- Check: Does moderator have 'admin' or 'moderator' role?

**Issue: Product not showing in feed**
- Check: Is product status 'approved'?
- Check: Is `publishedAt` set?
- Check: If seller product, has it been approved?

**Issue: Service integration failing**
- Check: Are `SERVICE_SECRET` and service URLs configured?
- Check: Are other services running?
- Check: Check service logs for errors

---

## Future Enhancements

- [ ] AI-powered image quality checking
- [ ] Automated reverse image search for stolen images
- [ ] Bulk draft upload
- [ ] Draft templates
- [ ] Advanced moderation analytics
- [ ] A/B testing for product descriptions
- [ ] Multi-language support

---

**Last Updated:** January 2026  
**Maintainer:** Product Service Team  
**Related Services:** seller-service, warehouse-service, content-service
