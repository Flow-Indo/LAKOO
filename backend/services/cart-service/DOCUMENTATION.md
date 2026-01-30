# Cart Service Documentation

## Overview

The Cart Service manages shopping carts for the LAKOO e-commerce platform. It handles cart operations, product validation, and integrates with product-service and warehouse-service.

**Language:** Go  
**Port:** 3003  
**Database:** PostgreSQL (Neon)

---

## Architecture

### Service Information
- **Service Name:** cart-service
- **Port:** 3003
- **Database:** cart_db (Neon PostgreSQL)
- **Framework:** Gorilla Mux + GORM

### Dependencies
- **product-service (3002):** Product information and validation
- **warehouse-service (3012):** Stock availability checks

### Dependents
- **order-service (3006):** Retrieves cart data for checkout

---

## Features

1. **Cart Management**
   - Create and retrieve user carts
   - Add items to cart
   - Update item quantities
   - Remove items
   - Clear cart

2. **Product Validation**
   - Validates products via product-service
   - Checks availability
   - Tracks price changes
   - Maintains product snapshots

3. **Cart Types**
   - **warehouse_product:** House brand products (sellerId = null)
   - **seller_product:** Third-party seller products

4. **Cart States**
   - **active:** Currently in use
   - **abandoned:** Inactive for extended period
   - **checked_out:** Converted to order
   - **expired:** Past expiration date

---

## Database Schema

### Cart Table
```sql
CREATE TABLE cart (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    item_count INT NOT NULL DEFAULT 0,
    total DECIMAL(15,2) NOT NULL DEFAULT 0,
    currency VARCHAR(3) NOT NULL DEFAULT 'IDR',
    coupon_id UUID,
    coupon_code VARCHAR(50),
    discount_amount DECIMAL(15,2) NOT NULL DEFAULT 0,
    session_id VARCHAR(255),
    expires_at TIMESTAMP WITH TIME ZONE,
    last_activity_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE,
    INDEX idx_cart_user_id (user_id),
    INDEX idx_cart_expires_at (expires_at),
    INDEX idx_cart_deleted_at (deleted_at)
);
```

### CartItem Table
```sql
CREATE TABLE cart_item (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cart_id UUID NOT NULL,
    item_type VARCHAR(20) NOT NULL,
    product_id UUID,
    variant_id UUID,
    seller_id UUID,
    quantity INT NOT NULL DEFAULT 1,
    unit_price DECIMAL(15,2) NOT NULL,
    subtotal DECIMAL(15,2) NOT NULL DEFAULT 0,
    price_changed BOOLEAN NOT NULL DEFAULT false,
    is_available BOOLEAN NOT NULL DEFAULT true,
    availability_message VARCHAR(255),
    snapshot_product_name VARCHAR(255) NOT NULL,
    snapshot_variant_name VARCHAR(255),
    snapshot_sku VARCHAR(100),
    snapshot_image_url TEXT,
    snapshot_seller_name VARCHAR(255),
    snapshot_unit_price DECIMAL(15,2) NOT NULL,
    added_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    FOREIGN KEY (cart_id) REFERENCES cart(id) ON DELETE CASCADE,
    INDEX idx_cart_item_cart_id (cart_id),
    INDEX idx_cart_item_product_id (product_id),
    INDEX idx_cart_item_variant_id (variant_id),
    INDEX idx_cart_item_seller_id (seller_id)
);
```

---

## API Endpoints

### External Endpoints (User-facing)
All external endpoints require user authentication via middleware.

#### Add Item to Cart
```http
POST /api/cart/addToCart
Authorization: Bearer <user-token>
Content-Type: application/json

{
  "productId": "uuid",
  "variantId": "uuid",
  "quantity": 1,
  "itemType": "warehouse_product"
}
```

#### Get Active Cart
```http
GET /api/cart/
Authorization: Bearer <user-token>
```

**Response:**
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "status": "active",
  "item_count": 2,
  "total": 150000.00,
  "currency": "IDR",
  "items": [
    {
      "id": "uuid",
      "product_id": "uuid",
      "variant_id": "uuid",
      "seller_id": null,
      "item_type": "warehouse_product",
      "quantity": 1,
      "unit_price": 75000.00,
      "subtotal": 75000.00,
      "snapshot_product_name": "Product Name",
      "is_available": true
    }
  ]
}
```

### Internal Endpoints (Service-to-Service)
Internal endpoints require service authentication.

```http
GET /internal/cart/:userId
X-Service-Auth: <service-token>
X-Service-Name: order-service
```

### Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "service": "cart-service"
}
```

---

## Environment Configuration

### Required Environment Variables

```env
# Server Configuration
CART_SERVICE_PORT=:3003
GIN_MODE=debug

# Database Configuration (Neon PostgreSQL)
DATABASE_URL=postgresql://user:pass@host/cart_db?sslmode=require

# Alternative: Individual DB Parameters
DB_HOST=localhost
DB_USER=user
DB_PASSWORD=password
DB_NAME=cart_db
DB_PORT=5432
DB_SSL=disable

# Service URLs
GATEWAY_URL=http://localhost:3000
PRODUCT_SERVICE_URL=http://localhost:3002
WAREHOUSE_SERVICE_URL=http://localhost:3012

# Service Authentication
SERVICE_SECRET=your-service-secret-key-here

# Cart Settings
CART_EXPIRY_HOURS=72
MAX_ITEMS_PER_CART=50
```

---

## Setup & Installation

### Prerequisites
- Go 1.21+
- PostgreSQL database (Neon)
- Access to product-service and warehouse-service

### Installation Steps

1. **Navigate to service directory**
   ```bash
   cd backend/services/cart-service
   ```

2. **Install dependencies**
   ```bash
   go mod tidy
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your actual values
   ```

4. **Run database migrations**
   Migrations run automatically on startup via GORM AutoMigrate.

5. **Build the service**
   ```bash
   go build -o bin/cart-service ./cmd/main
   ```

6. **Run the service**
   ```bash
   ./bin/cart-service
   # OR
   go run ./cmd/main/main.go
   ```

---

## Development

### Project Structure
```
cart-service/
├── cmd/
│   └── main/
│       └── main.go          # Entry point
├── config/
│   └── env.go               # Environment configuration
├── db/
│   └── db.go                # Database connection
├── domain/
│   ├── client/              # Client interfaces
│   ├── models/              # Data models
│   ├── repository/          # Repository interfaces
│   ├── services/            # Service interfaces
│   └── types/               # DTOs
├── internal/
│   ├── controller/          # HTTP handlers
│   ├── repository/          # Data access layer
│   └── service/             # Business logic
├── clients/
│   └── product_http_client.go  # Product service client
├── .env.example             # Environment template
└── DOCUMENTATION.md         # This file
```

### Key Components

#### Models (`domain/models/models.go`)
- `Cart`: Main cart entity
- `CartItem`: Individual cart items
- `CartStatus`: Cart state enum
- `CartItemType`: Item type enum

#### Repository (`internal/repository/cart_repository.go`)
- Data access layer
- GORM-based operations
- Transaction management

#### Service (`internal/service/cart_service.go`)
- Business logic
- Product validation
- Cart calculations
- Integration with external services

#### Controller (`internal/controller/cart_handler.go`)
- HTTP request handling
- Request validation
- Response formatting
- Middleware integration

---

## Testing

### Manual Testing

1. **Health Check**
   ```bash
   curl http://localhost:3003/health
   ```

2. **Add Item to Cart**
   ```bash
   curl -X POST http://localhost:3003/api/cart/addToCart \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <user-token>" \
     -d '{
       "productId": "product-uuid",
       "variantId": "variant-uuid",
       "quantity": 1,
       "itemType": "warehouse_product"
     }'
   ```

3. **Get Active Cart**
   ```bash
   curl http://localhost:3003/api/cart/ \
     -H "Authorization: Bearer <user-token>"
   ```

---

## Integration Points

### Product Service Integration
The cart service integrates with product-service to:
- Validate product existence
- Check product availability
- Retrieve current prices
- Get product details

**Client:** `clients/product_http_client.go`

### Warehouse Service Integration
Future integration for:
- Stock availability checks
- Inventory validation

---

## Error Handling

The service returns standard HTTP status codes:
- **200 OK:** Successful operation
- **400 Bad Request:** Invalid input
- **401 Unauthorized:** Missing or invalid authentication
- **404 Not Found:** Resource not found
- **500 Internal Server Error:** Server error

---

## Security

### Authentication
- **External endpoints:** User JWT token required
- **Internal endpoints:** Service-to-service token required

### Middleware
- `UserIDMiddleware`: Extracts user ID from JWT
- `ServiceAuthMiddleware`: Validates service tokens

---

## Performance Considerations

1. **Database Indexes**
   - Indexed on user_id for fast cart retrieval
   - Indexed on product references for lookups
   - Soft deletes with indexed deleted_at

2. **Caching Opportunities**
   - Product information caching
   - Cart totals caching
   - Session-based cart caching

3. **Optimizations**
   - Batch product validation
   - Lazy loading of cart items
   - Connection pooling

---

## Monitoring & Logging

### Health Endpoint
```http
GET /health
```

### Logging
- GORM query logging (configurable)
- Request/response logging
- Error logging

---

## Future Enhancements

1. **Cart Abandonment Tracking**
   - Email reminders
   - Analytics

2. **Advanced Features**
   - Cart sharing
   - Saved carts
   - Cart templates

3. **Performance**
   - Redis caching
   - Read replicas
   - Event-driven updates

4. **Business Features**
   - Dynamic pricing
   - Bundle discounts
   - Personalized recommendations

---

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify DATABASE_URL or individual DB parameters
   - Check network connectivity to Neon
   - Ensure database exists

2. **Product Service Unavailable**
   - Verify GATEWAY_URL is correct
   - Ensure product-service is running
   - Check SERVICE_SECRET matches

3. **Port Already in Use**
   - Change CART_SERVICE_PORT
   - Kill process using port 3003

---

## Changes Made (2026-01-28)

1. ✅ Added health check endpoint via shared API server
2. ✅ Standardized port to 3003 (already configured)
3. ✅ Updated database connection to support DATABASE_URL
4. ✅ Updated models to match standardized architecture:
   - Removed BrandID, BrandProductID, SellerProductID
   - Updated CartItemType to use warehouse_product and seller_product
   - Added explicit column names with snake_case
   - Added TableName methods
5. ✅ Verified product service client implementation
6. ✅ Created .env.example file
7. ✅ Verified GORM models have snake_case columns
8. ✅ Added auto-migration on startup

---

## Database Connection

**Cart DB (Neon):**
```
postgresql://neondb_owner:npg_GVbUo4NiHXw1@ep-silent-boat-a1jd5w32-pooler.ap-southeast-1.aws.neon.tech/cart_db?sslmode=require
```

---

## Contact & Support

For issues or questions, please refer to:
- Main documentation: `LAKOO/README.md`
- Architecture plan: `MICROSERVICE_ARCHITECTURE_PLAN.md`
- Integration testing: `INTEGRATION_TEST_REPORT.md`

---

**Last Updated:** 2026-01-28  
**Status:** ✅ Setup Complete
