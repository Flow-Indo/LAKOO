# Gold Standard Service Review: logistic-service

**Reviewed:** 2026-01-29
**Reviewer:** Claude Opus 4.5 (Orchestrator Agent)
**Purpose:** Establish patterns for all other LAKOO microservices to follow

---

## Executive Summary

| Category | Score | Notes |
|----------|-------|-------|
| **Architecture** | 9/10 | Clean layered architecture |
| **Security** | 9/10 | Comprehensive auth, minor improvement areas |
| **Validation** | 9/10 | Zod + express-validator |
| **Error Handling** | 9/10 | Consistent, typed errors |
| **Database** | 4/10 | ⚠️ **P0-CRITICAL: Missing @map() for snake_case columns** |
| **Documentation** | 8/10 | Swagger, but could use more JSDoc |
| **External Integrations** | 8/10 | Good patterns, some improvement areas |
| **Testing** | 6/10 | Missing test files |
| **Overall** | **7.5/10** | **Good patterns but schema needs P0 fix** |

> ⚠️ **CRITICAL WARNING:** The database schema is missing `@map()` directives for all camelCase fields. This will create columns like `shipmentNumber` instead of `shipment_number`. **This must be fixed before using as a gold standard.**

---

## Table of Contents

1. [Project Structure](#1-project-structure)
2. [Authentication Patterns](#2-authentication-patterns)
3. [Route Organization](#3-route-organization)
4. [Validation Patterns](#4-validation-patterns)
5. [Error Handling](#5-error-handling)
6. [Service Layer](#6-service-layer)
7. [Repository Pattern](#7-repository-pattern)
8. [External Integrations](#8-external-integrations)
9. [Event-Driven Patterns](#9-event-driven-patterns)
10. [Database Schema](#10-database-schema)
11. [Security Best Practices](#11-security-best-practices)
12. [Issues Found](#12-issues-found)
13. [Recommendations](#13-recommendations)

---

## 1. Project Structure

### Excellent Structure (Follow This)

```
logistic-service/
├── prisma/
│   └── schema.prisma           # Database schema
├── src/
│   ├── config/
│   │   ├── biteship.ts         # External API client
│   │   └── swagger.ts          # OpenAPI docs config
│   ├── controllers/
│   │   ├── index.ts            # Barrel export
│   │   ├── shipment.controller.ts
│   │   ├── rate.controller.ts
│   │   ├── admin.controller.ts
│   │   └── webhook.controller.ts
│   ├── generated/
│   │   └── prisma/             # Generated Prisma client
│   ├── lib/
│   │   ├── index.ts
│   │   └── prisma.ts           # Prisma singleton
│   ├── middleware/
│   │   ├── index.ts
│   │   ├── auth.ts             # Auth middleware (GOLD STANDARD)
│   │   ├── error-handler.ts    # Error classes + handler
│   │   └── validation.ts       # Zod schemas + middleware
│   ├── repositories/
│   │   ├── index.ts
│   │   ├── shipment.repository.ts
│   │   ├── tracking.repository.ts
│   │   ├── courier.repository.ts
│   │   ├── warehouse.repository.ts
│   │   └── rate-cache.repository.ts
│   ├── routes/
│   │   ├── index.ts            # Barrel export
│   │   ├── shipment.routes.ts  # User routes
│   │   ├── rate.routes.ts      # Public routes
│   │   ├── admin.routes.ts     # Admin routes
│   │   ├── webhook.routes.ts   # Webhook routes
│   │   └── internal.routes.ts  # Service-to-service routes
│   ├── services/
│   │   ├── index.ts
│   │   ├── shipment.service.ts
│   │   ├── rate.service.ts
│   │   └── outbox.service.ts   # Event publishing
│   ├── types/
│   │   └── index.ts            # DTOs, interfaces, types
│   ├── utils/
│   │   └── serviceAuth.ts      # Service-to-service auth
│   └── index.ts                # Entry point
├── .env.example
├── package.json
└── tsconfig.json
```

### Key Principles
- **Barrel exports** (`index.ts`) for clean imports
- **Separation of concerns**: routes → controllers → services → repositories
- **Generated code isolated** in `generated/` folder
- **Config separate** from business logic

---

## 2. Authentication Patterns

### Gold Standard Auth Middleware

**File:** `src/middleware/auth.ts`

This is the **best implementation** in the codebase. All services should copy this pattern.

```typescript
// 1. Gateway Auth (for user-facing routes)
export const gatewayAuth = (req, res, next) => {
  const gatewayKey = req.headers['x-gateway-key'];
  const expectedKey = process.env.GATEWAY_SECRET_KEY;

  // Development fallback (configurable)
  if (process.env.NODE_ENV === 'development' && !expectedKey) {
    req.user = { id: req.headers['x-user-id'] || 'dev-user' };
    return next();
  }

  if (!gatewayKey || gatewayKey !== expectedKey) {
    return next(new UnauthorizedError('Invalid gateway key'));
  }

  req.user = {
    id: req.headers['x-user-id'],
    role: req.headers['x-user-role']
  };
  next();
};

// 2. Internal Service Auth (for service-to-service)
export const internalServiceAuth = (req, res, next) => {
  const tokenHeader = req.headers['x-service-auth'];
  const serviceNameHeader = req.headers['x-service-name'];

  if (!tokenHeader || !serviceNameHeader) {
    return next(new UnauthorizedError('Service auth required'));
  }

  verifyServiceToken(tokenHeader, process.env.SERVICE_SECRET);
  req.user = { id: serviceNameHeader, role: 'internal' };
  next();
};

// 3. Combined Auth (for dual-access endpoints)
export const gatewayOrInternalAuth = (req, res, next) => {
  // Try internal first, then gateway
  if (tryServiceAuth(req)) return next();
  // Fall back to gateway auth
  ...
};

// 4. Optional Auth (for public + enhanced auth)
export const optionalGatewayAuth = (req, res, next) => {
  // Extract user if present, but don't fail
  ...
  next();
};

// 5. Role-based access
export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user?.role || !roles.includes(req.user.role)) {
    return next(new ForbiddenError('Insufficient permissions'));
  }
  next();
};

// Convenience aliases
export const authenticate = gatewayAuth;
export const requireAdmin = requireRole('admin');
export const requireInternalAuth = internalServiceAuth;
```

### Auth Types Summary

| Middleware | Use Case | Headers Required |
|------------|----------|------------------|
| `gatewayAuth` | User-facing authenticated routes | `x-gateway-key`, `x-user-id` |
| `internalServiceAuth` | Service-to-service calls | `x-service-auth`, `x-service-name` |
| `gatewayOrInternalAuth` | Dual-access endpoints | Either set |
| `optionalGatewayAuth` | Public routes with enhanced auth | Optional |
| `requireRole('admin')` | Role-restricted routes | `x-user-role` |

---

## 3. Route Organization

### Route Types

```
/api/shipments/*        → External user routes (gatewayAuth)
/api/rates/*            → Public routes (no auth or optional)
/api/admin/*            → Admin routes (gatewayAuth + requireAdmin)
/api/webhooks/*         → Webhook routes (signature verification)
/api/internal/*         → Service-to-service (internalServiceAuth)
```

### Excellent Route Pattern

**File:** `src/routes/shipment.routes.ts`

```typescript
const router = Router();

// ========== Public Routes ==========
router.get('/track/:trackingNumber', shipmentController.trackShipment);

// ========== Authenticated Routes ==========
router.post('/',
  authenticate,                    // Auth first
  validate(createShipmentSchema),  // Then validate
  shipmentController.createShipment
);

router.get('/user', authenticate, shipmentController.getUserShipments);
router.get('/:id', authenticate, shipmentController.getShipmentById);
```

### Excellent Admin Routes Pattern

**File:** `src/routes/admin.routes.ts`

```typescript
const router = Router();

// Apply auth to ALL routes in this router
router.use(authenticate, requireAdmin);

// Now all routes below require admin
router.get('/shipments', adminController.getAllShipments);
router.put('/shipments/:id', adminController.updateShipment);
```

### Excellent Internal Routes Pattern

**File:** `src/routes/internal.routes.ts`

```typescript
const router = Router();

// All internal routes require service auth
router.use(requireInternalAuth);

// Service-to-service endpoints
router.post('/shipments', validate(createShipmentSchema), shipmentController.createShipmentInternal);
router.post('/shipments/:id/book', shipmentController.bookShipmentInternal);
router.get('/shipments/order/:orderId', shipmentController.getByOrderIdInternal);
```

---

## 4. Validation Patterns

### Dual Validation Approach (Excellent)

Uses both **Zod** (type-safe) and **express-validator** (request-level).

**File:** `src/middleware/validation.ts`

```typescript
// Zod schemas with detailed validation
export const createShipmentSchema = z.object({
  orderId: z.string().uuid(),
  userId: z.string().uuid().optional(),
  courier: z.string().min(1),
  shippingCost: z.number().positive(),
  weightGrams: z.number().int().positive(),
  destination: addressSchema,  // Nested schema
  metadata: z.record(z.any()).optional()
});

// Zod middleware
export function validate(schema: z.ZodSchema) {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      return next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      return next(error);
    }
  };
}

// Express-validator middleware (for query params)
export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array().map(err => ({
        field: err.type === 'field' ? err.path : err.type,
        message: err.msg
      }))
    });
  }
  return next();
};
```

### Validation Best Practices

1. **UUID validation** for IDs
2. **Positive number validation** for amounts
3. **Enum validation** for statuses
4. **Nested object validation** for addresses
5. **Optional fields** explicitly marked
6. **Consistent error response format**

---

## 5. Error Handling

### Typed Error Classes (Excellent)

**File:** `src/middleware/error-handler.ts`

```typescript
// Base error class with operational flag
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;  // Distinguishes programmer vs operational errors
  public code?: string;           // Machine-readable code

  constructor(message: string, statusCode: number, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.code = code;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Specific error types
export class BadRequestError extends AppError {
  constructor(message = 'Bad request', code?: string) {
    super(message, 400, code);
  }
}

export class UnauthorizedError extends AppError { ... }  // 401
export class ForbiddenError extends AppError { ... }     // 403
export class NotFoundError extends AppError { ... }      // 404
export class ConflictError extends AppError { ... }      // 409
export class ShipmentError extends AppError { ... }      // 422 (domain-specific)
```

### Global Error Handler (Excellent)

```typescript
export const errorHandler = (err, req, res, _next) => {
  // Log error
  console.error(`[ERROR] ${req.method} ${req.path}:`, {
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });

  // Handle AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      code: err.code,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
  }

  // Handle Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    switch (err.code) {
      case 'P2002': return res.status(409).json({ ... });  // Unique constraint
      case 'P2025': return res.status(404).json({ ... });  // Not found
    }
  }

  // Handle validation errors
  if (err.name === 'ZodError') { ... }

  // Default 500
  return res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production'
      ? 'Internal server error'
      : err.message,
    code: 'INTERNAL_ERROR',
  });
};
```

### Async Handler (Excellent)

```typescript
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Usage in controllers
trackShipment = asyncHandler(async (req, res) => {
  const shipment = await this.service.getShipmentByTrackingNumber(trackingNumber);
  res.json({ success: true, data: shipment });
});
```

---

## 6. Service Layer

### Clean Service Pattern

**File:** `src/services/shipment.service.ts`

```typescript
export class ShipmentService {
  private shipmentRepository: ShipmentRepository;
  private trackingRepository: TrackingRepository;
  private warehouseRepository: WarehouseRepository;

  constructor() {
    // Initialize dependencies
    this.shipmentRepository = new ShipmentRepository();
    this.trackingRepository = new TrackingRepository();
    this.warehouseRepository = new WarehouseRepository();
  }

  async createShipment(data: CreateShipmentDTO) {
    // Business logic: default warehouse if no origin
    if (!data.origin) {
      const defaultWarehouse = await this.warehouseRepository.findDefault();
      if (!defaultWarehouse) {
        throw new BadRequestError('No default warehouse configured');
      }
      data.origin = mapWarehouseToAddress(defaultWarehouse);
    }

    // Repository call
    const shipment = await this.shipmentRepository.create(data);

    // Event publishing (fire-and-forget)
    await outboxService.shipmentCreated(shipment);

    return shipment;
  }

  async updateShipmentStatus(shipmentId: string, status: ShipmentStatus, additionalData?) {
    // Verify exists
    const shipment = await this.shipmentRepository.findById(shipmentId);
    if (!shipment) throw new NotFoundError('Shipment not found');

    // Update
    const previousStatus = shipment.status;
    const updated = await this.shipmentRepository.updateStatus(shipmentId, status, additionalData);

    // Publish event
    await outboxService.shipmentStatusChanged(updated, previousStatus);

    // Notify other services (non-blocking)
    await this.updateOrderShipmentStatus(shipment.orderId, status);

    // Send user notification for key statuses
    if (['delivered', 'failed', 'out_for_delivery'].includes(status)) {
      await this.sendShipmentNotification(shipment.userId, ...);
    }

    return updated;
  }

  // Service-to-service calls (non-critical, don't throw)
  private async updateOrderShipmentStatus(orderId: string, status: ShipmentStatus) {
    try {
      await axios.put(
        `${ORDER_SERVICE_URL}/api/orders/${orderId}/shipment-status`,
        { shipmentStatus: status },
        { headers: getServiceAuthHeaders() }
      );
    } catch (error) {
      console.error(`Failed to update order ${orderId}:`, error.message);
      // Don't throw - this is a notification, not critical
    }
  }
}
```

### Service Layer Best Practices

1. **Dependency injection** via constructor
2. **Business logic** in service, not controller
3. **Typed DTOs** for input/output
4. **Event publishing** after state changes
5. **Non-blocking** service-to-service calls
6. **Error handling** with typed exceptions

---

## 7. Repository Pattern

### Clean Repository Pattern

**File:** `src/repositories/shipment.repository.ts`

```typescript
export class ShipmentRepository {
  // Business ID generation
  private generateShipmentNumber(): string {
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 7).toUpperCase();
    return `SHP-${dateStr}-${random}`;
  }

  // Create with computed fields
  async create(data: CreateShipmentDTO) {
    const shipmentNumber = this.generateShipmentNumber();
    const totalCost = data.shippingCost + (data.insuranceCost || 0);

    return prisma.shipment.create({
      data: { shipmentNumber, totalCost, ... },
      include: { trackingEvents: true }
    });
  }

  // Find with relations
  async findById(id: string) {
    return prisma.shipment.findUnique({
      where: { id },
      include: {
        trackingEvents: { orderBy: { eventTime: 'desc' } }
      }
    });
  }

  // Paginated query
  async findByUserId(userId: string, options?: PaginationOptions) {
    const page = options?.page || 1;
    const limit = options?.limit || 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.shipment.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: limit,
        skip,
        include: { trackingEvents: { take: 1 } }  // Only latest
      }),
      prisma.shipment.count({ where: { userId } })
    ]);

    return {
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) }
    };
  }

  // Status update with timestamps
  async updateStatus(id: string, status: ShipmentStatus, additionalData?) {
    const now = new Date();
    const updateData: Prisma.ShipmentUpdateInput = { status, ...additionalData };

    // Set appropriate timestamp
    switch (status) {
      case 'booked': updateData.bookedAt = now; break;
      case 'delivered': updateData.deliveredAt = now; break;
      // ...
    }

    return prisma.shipment.update({ where: { id }, data: updateData });
  }

  // Aggregations
  async getShipmentStats(startDate: Date, endDate: Date) {
    const [byStatus, totals] = await Promise.all([
      prisma.shipment.groupBy({
        by: ['status'],
        where: { createdAt: { gte: startDate, lte: endDate } },
        _count: true
      }),
      prisma.shipment.aggregate({
        where: { createdAt: { gte: startDate, lte: endDate } },
        _sum: { shippingCost: true, totalCost: true },
        _count: true
      })
    ]);
    return { byStatus, totals };
  }
}
```

---

## 8. External Integrations

### API Client Pattern

**File:** `src/config/biteship.ts`

```typescript
class BiteshipClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: process.env.BITESHIP_BASE_URL || 'https://api.biteship.com/v1',
      headers: {
        'Authorization': `Bearer ${process.env.BITESHIP_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
  }

  async getRates(request: BiteshipRateRequest): Promise<BiteshipRateResponse[]> {
    try {
      const payload = this.mapToExternalFormat(request);
      const response = await this.client.post('/rates/couriers', payload);
      return this.mapToInternalFormat(response.data.pricing);
    } catch (error) {
      console.error('Biteship getRates error:', error.response?.data || error.message);
      throw new Error(`Failed to get rates: ${error.message}`);
    }
  }
}

// Singleton export
export const biteshipClient = new BiteshipClient();
```

### Service-to-Service Auth

**File:** `src/utils/serviceAuth.ts`

```typescript
// HMAC-based token generation
export function generateServiceToken(serviceName: string, secret: string): string {
  const timestamp = Math.floor(Date.now() / 1000);
  const message = `${serviceName}:${timestamp}`;
  const signature = crypto
    .createHmac('sha256', secret)
    .update(message)
    .digest('hex');
  return `${serviceName}:${timestamp}:${signature}`;
}

// Token verification with timing attack protection
export function verifyServiceToken(token: string, secret: string) {
  const [serviceName, timestampStr, signature] = token.split(':');

  // Validate timestamp (5 minute window)
  const timestamp = Number.parseInt(timestampStr, 10);
  const now = Math.floor(Date.now() / 1000);
  if (timestamp - now > 60 || now - timestamp > 300) {
    throw new Error('Token expired');
  }

  // Verify signature with timing-safe comparison
  const expected = crypto.createHmac('sha256', secret)
    .update(`${serviceName}:${timestamp}`)
    .digest('hex');

  if (!crypto.timingSafeEqual(Buffer.from(signature, 'hex'), Buffer.from(expected, 'hex'))) {
    throw new Error('Invalid signature');
  }

  return { serviceName, timestamp };
}

// Helper for outbound calls
export function getServiceAuthHeaders(serviceName = 'logistic-service') {
  const token = generateServiceToken(serviceName, process.env.SERVICE_SECRET);
  return {
    'X-Service-Auth': token,
    'X-Service-Name': serviceName
  };
}
```

---

## 9. Event-Driven Patterns

### Outbox Pattern (Excellent)

**File:** `src/services/outbox.service.ts`

```typescript
export class OutboxService {
  async publish(
    aggregateType: 'Shipment' | 'Tracking',
    aggregateId: string,
    eventType: EventType,
    payload: Record<string, any>
  ): Promise<void> {
    await prisma.serviceOutbox.create({
      data: { aggregateType, aggregateId, eventType, payload }
    });
  }

  async shipmentCreated(shipment) {
    const payload: ShipmentCreatedPayload = {
      shipmentId: shipment.id,
      shipmentNumber: shipment.shipmentNumber,
      orderId: shipment.orderId,
      ...
    };
    await this.publish('Shipment', shipment.id, 'shipment.created', payload);
  }

  async shipmentStatusChanged(shipment, previousStatus) {
    const eventType = `shipment.${shipment.status}` as ShipmentEventType;
    await this.publish('Shipment', shipment.id, eventType, { ... });
  }
}

export const outboxService = new OutboxService();
```

### Event Types

```typescript
export type ShipmentEventType =
  | 'shipment.created'
  | 'shipment.booked'
  | 'shipment.picked_up'
  | 'shipment.in_transit'
  | 'shipment.delivered'
  | 'shipment.failed'
  | 'shipment.cancelled';
```

---

## 10. Database Schema

### ⚠️ P0-CRITICAL: Schema Missing @map() Directives

**Current schema has a MAJOR issue:** While table names use `@@map("table_name")`, **individual fields are missing `@map("column_name")`** directives. This creates camelCase columns instead of PostgreSQL standard snake_case.

### Current (WRONG):
```prisma
model Shipment {
  shipmentNumber String @unique @db.VarChar(50)  // Creates column "shipmentNumber" ❌
  orderId        String @db.Uuid                  // Creates column "orderId" ❌
  courierName    String? @db.VarChar(100)         // Creates column "courierName" ❌
  createdAt      DateTime @default(now())         // Creates column "createdAt" ❌
  @@map("shipment")  // Table is correct ✅
}
```

### Correct (REQUIRED):
```prisma
model Shipment {
  shipmentNumber String @unique @map("shipment_number") @db.VarChar(50)  // ✅
  orderId        String @map("order_id") @db.Uuid                        // ✅
  courierName    String? @map("courier_name") @db.VarChar(100)           // ✅
  createdAt      DateTime @default(now()) @map("created_at")             // ✅
  @@map("shipment")  // ✅
}
```

### Fields Requiring @map() (90+ total):

**Shipment model (50+ fields):**
| Field | Should map to |
|-------|---------------|
| `shipmentNumber` | `shipment_number` |
| `orderId` | `order_id` |
| `returnId` | `return_id` |
| `userId` | `user_id` |
| `courierName` | `courier_name` |
| `serviceType` | `service_type` |
| `serviceName` | `service_name` |
| `trackingNumber` | `tracking_number` |
| `waybillId` | `waybill_id` |
| `shippingCost` | `shipping_cost` |
| `insuranceCost` | `insurance_cost` |
| `codAmount` | `cod_amount` |
| `totalCost` | `total_cost` |
| `weightGrams` | `weight_grams` |
| `lengthCm` | `length_cm` |
| `widthCm` | `width_cm` |
| `heightCm` | `height_cm` |
| `itemCount` | `item_count` |
| `itemDescription` | `item_description` |
| `originName` | `origin_name` |
| `originPhone` | `origin_phone` |
| `originAddress` | `origin_address` |
| `originDistrict` | `origin_district` |
| `originCity` | `origin_city` |
| `originProvince` | `origin_province` |
| `originPostalCode` | `origin_postal_code` |
| `originLatitude` | `origin_latitude` |
| `originLongitude` | `origin_longitude` |
| `destName` | `dest_name` |
| `destPhone` | `dest_phone` |
| `destAddress` | `dest_address` |
| `destDistrict` | `dest_district` |
| `destCity` | `dest_city` |
| `destProvince` | `dest_province` |
| `destPostalCode` | `dest_postal_code` |
| `destLatitude` | `dest_latitude` |
| `destLongitude` | `dest_longitude` |
| `estimatedDelivery` | `estimated_delivery` |
| `bookedAt` | `booked_at` |
| `pickedUpAt` | `picked_up_at` |
| `inTransitAt` | `in_transit_at` |
| `outForDeliveryAt` | `out_for_delivery_at` |
| `deliveredAt` | `delivered_at` |
| `failedAt` | `failed_at` |
| `returnedAt` | `returned_at` |
| `failureReason` | `failure_reason` |
| `receiverName` | `receiver_name` |
| `proofOfDeliveryUrl` | `proof_of_delivery_url` |
| `internalNotes` | `internal_notes` |
| `biteshipOrderId` | `biteship_order_id` |
| `createdAt` | `created_at` |
| `updatedAt` | `updated_at` |

**TrackingEvent model:**
| Field | Should map to |
|-------|---------------|
| `shipmentId` | `shipment_id` |
| `statusCode` | `status_code` |
| `courierStatus` | `courier_status` |
| `eventTime` | `event_time` |
| `rawPayload` | `raw_payload` |
| `createdAt` | `created_at` |

**CourierIntegration model:**
| Field | Should map to |
|-------|---------------|
| `courierCode` | `courier_code` |
| `courierName` | `courier_name` |
| `isActive` | `is_active` |
| `apiEndpoint` | `api_endpoint` |
| `apiKey` | `api_key` |
| `supportsCod` | `supports_cod` |
| `supportsInsurance` | `supports_insurance` |
| `supportsPickup` | `supports_pickup` |
| `supportsDropoff` | `supports_dropoff` |
| `supportsRealTimeTracking` | `supports_real_time_tracking` |
| `hasFixedRates` | `has_fixed_rates` |
| `rateMultiplier` | `rate_multiplier` |
| `logoUrl` | `logo_url` |
| `displayOrder` | `display_order` |
| `pickupCutoffTime` | `pickup_cutoff_time` |
| `createdAt` | `created_at` |
| `updatedAt` | `updated_at` |

**CourierService, ShippingRateCache, WarehouseLocation, ServiceOutbox** - All have similar issues with camelCase fields.

### What IS Correct in the Schema

Despite the @map() issue, these patterns ARE good:

```prisma
model Shipment {
  // UUID with database generation (not application-side) ✅
  id String @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid

  // Proper decimal for money ✅
  shippingCost Decimal @db.Decimal(15, 2)

  // Explicit column sizes ✅
  courier String @db.VarChar(50)

  // Proper timestamps with timezone ✅
  createdAt DateTime @default(now()) @db.Timestamptz(6)

  // Indexes for query performance ✅
  @@index([shipmentNumber])
  @@index([orderId])
  @@index([status])

  // Snake_case table name ✅
  @@map("shipment")
}
```

---

## 11. Security Best Practices

### Webhook Signature Verification

**File:** `src/controllers/webhook.controller.ts`

```typescript
function verifyBiteshipSignature(payload: string, signature: string): boolean {
  // Fail closed in production
  if (!BITESHIP_WEBHOOK_SECRET) {
    if (process.env.NODE_ENV === 'production') return false;
    console.warn('Secret not configured, skipping (dev only)');
    return true;
  }

  const expected = crypto
    .createHmac('sha256', BITESHIP_WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');

  // Timing-safe comparison
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expected, 'hex')
  );
}
```

### Security Checklist Met

| Security Measure | Status | Notes |
|-----------------|--------|-------|
| Gateway key validation | ✅ | `gatewayAuth` middleware |
| Service-to-service HMAC | ✅ | `serviceAuth.ts` |
| Timing-safe comparison | ✅ | `crypto.timingSafeEqual` |
| Development fallback control | ✅ | Configurable via env |
| Production fail-closed | ✅ | Returns 401/500 if misconfigured |
| Role-based access | ✅ | `requireRole` middleware |
| Webhook signature verify | ✅ | HMAC verification |
| Input validation | ✅ | Zod schemas |
| SQL injection prevention | ✅ | Prisma parameterized queries |

---

## 12. Issues Found

### P0 Issues (CRITICAL - Must Fix Before Production)

#### P0-1: Schema missing @map() directives for snake_case columns
**File:** `prisma/schema.prisma` (ALL MODELS)

**Issue:** Every camelCase field in the schema is missing `@map()` directive. This creates camelCase column names in PostgreSQL instead of standard snake_case.

**Impact:**
- Database columns don't follow PostgreSQL conventions
- Inconsistent with other databases in the system
- May cause issues with database tools, migrations, and queries
- **90+ fields affected across 7 models**

**Current:**
```prisma
model Shipment {
  shipmentNumber String @unique @db.VarChar(50)  // Creates "shipmentNumber" column
  orderId        String @db.Uuid                  // Creates "orderId" column
}
```

**Fix:**
```prisma
model Shipment {
  shipmentNumber String @unique @map("shipment_number") @db.VarChar(50)
  orderId        String @map("order_id") @db.Uuid
}
```

**Full list:** See [Section 10 - Database Schema](#10-database-schema) for complete field mapping table.

---

### P1 Issues (Should Fix)

#### P1-1: Test endpoint exposed
**File:** `src/routes/webhook.routes.ts:10`
```typescript
router.post('/biteship/test', webhookController.testBiteshipWebhook);
```
**Issue:** Test endpoint should be guarded more strictly. While it checks `NODE_ENV`, the route is still registered.

**Fix:** Don't register the route at all in production:
```typescript
if (process.env.NODE_ENV !== 'production') {
  router.post('/biteship/test', webhookController.testBiteshipWebhook);
}
```

#### P1-2: Biteship client verifyWebhookSignature placeholder
**File:** `src/config/biteship.ts:231`
```typescript
verifyWebhookSignature(payload: string, signature: string): boolean {
  // ... placeholder comment
  return true;  // Always returns true!
}
```
**Issue:** This method always returns true. The actual verification is in webhook.controller.ts, so this is unused/misleading.

**Fix:** Remove this method or implement properly.

#### P1-3: Missing request timeout on external calls
**File:** `src/services/shipment.service.ts:340`
```typescript
await axios.put(url, data, { headers: getServiceAuthHeaders() });
```
**Issue:** No timeout configured for service-to-service calls.

**Fix:** Add timeout configuration:
```typescript
await axios.put(url, data, {
  headers: getServiceAuthHeaders(),
  timeout: 5000  // 5 second timeout
});
```

### P2 Issues (Nice to Have)

#### P2-1: Missing .env.example
No `.env.example` file to guide developers.

#### P2-2: Controller instantiates service directly
**File:** `src/controllers/shipment.controller.ts:29`
```typescript
constructor() {
  this.service = new ShipmentService();
}
```
**Issue:** Tight coupling. Consider dependency injection for testability.

#### P2-3: Missing unit tests
No test files found in the project.

#### P2-4: Prisma logging in development
**File:** `src/lib/prisma.ts:11`
```typescript
log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
```
**Note:** Query logging in dev is fine, but can be verbose. Consider using `['error', 'warn']` instead.

---

## 13. Recommendations

### For All Services to Implement

1. **Copy auth middleware** from `logistic-service/src/middleware/auth.ts`
2. **Copy error handler** from `logistic-service/src/middleware/error-handler.ts`
3. **Copy serviceAuth utility** from `logistic-service/src/utils/serviceAuth.ts`
4. **Follow route organization**: separate external, internal, admin, webhook routes
5. **Use Zod validation** with the `validate()` middleware pattern
6. **Implement outbox pattern** for event publishing
7. **Use typed DTOs** in `types/index.ts`

### Checklist for Service Compliance

```
[ ] Auth middleware implemented (gateway, internal, combined)
[ ] Error handler with typed errors
[ ] Zod validation schemas
[ ] Route separation (external/internal/admin)
[ ] Service layer with business logic
[ ] Repository pattern for database access
[ ] Outbox pattern for events
[ ] Service-to-service auth headers
[ ] Proper Prisma schema:
    [ ] @@map("table_name") for snake_case table names
    [ ] @map("column_name") for ALL camelCase fields  ← CRITICAL!
    [ ] Indexes on frequently queried columns
    [ ] UUID with dbgenerated()
    [ ] Decimal(15,2) for money
    [ ] Timestamptz(6) for timestamps
[ ] Health check endpoint
[ ] Graceful shutdown handling
```

---

## Summary

**logistic-service is a GOOD reference implementation** with:

✅ **Excellent patterns to copy:**
- Comprehensive authentication patterns
- Clean layered architecture
- Robust error handling
- Type-safe validation
- Event-driven patterns (outbox)
- Security best practices

⚠️ **P0 Issue requiring fix:**
- **Database schema missing @map() directives** - All 90+ camelCase fields need `@map("snake_case")` before this can truly be the gold standard

**Use this service as the template** for:
- Authentication middleware patterns
- Error handling patterns
- Service layer architecture
- Validation patterns

**DO NOT copy the schema** until `@map()` directives are added to all fields.

---

**Document Status:** CORRECTED (P0 schema issue identified)
**Last Updated:** 2026-01-29
**Revision:** 2 - Added P0 schema issue (missing @map directives)
**Maintained By:** Orchestrator Agent (Claude Opus 4.5)

---

## Appendix: Correct Schema Example

Here's what a properly mapped model should look like:

```prisma
model Shipment {
  id                  String         @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  shipmentNumber      String         @unique @map("shipment_number") @db.VarChar(50)
  orderId             String         @map("order_id") @db.Uuid
  returnId            String?        @map("return_id") @db.Uuid
  userId              String         @map("user_id") @db.Uuid
  courier             String         @db.VarChar(50)
  courierName         String?        @map("courier_name") @db.VarChar(100)
  serviceType         String?        @map("service_type") @db.VarChar(50)
  serviceName         String?        @map("service_name") @db.VarChar(100)
  trackingNumber      String?        @map("tracking_number") @db.VarChar(100)
  waybillId           String?        @map("waybill_id") @db.VarChar(100)
  shippingCost        Decimal        @map("shipping_cost") @db.Decimal(15, 2)
  insuranceCost       Decimal        @default(0) @map("insurance_cost") @db.Decimal(15, 2)
  codAmount           Decimal        @default(0) @map("cod_amount") @db.Decimal(15, 2)
  totalCost           Decimal        @map("total_cost") @db.Decimal(15, 2)
  weightGrams         Int            @map("weight_grams")
  lengthCm            Decimal?       @map("length_cm") @db.Decimal(10, 2)
  widthCm             Decimal?       @map("width_cm") @db.Decimal(10, 2)
  heightCm            Decimal?       @map("height_cm") @db.Decimal(10, 2)
  itemCount           Int            @default(1) @map("item_count")
  itemDescription     String?        @map("item_description") @db.VarChar(255)
  originName          String         @map("origin_name") @db.VarChar(255)
  originPhone         String         @map("origin_phone") @db.VarChar(20)
  originAddress       String         @map("origin_address")
  originDistrict      String?        @map("origin_district") @db.VarChar(100)
  originCity          String         @map("origin_city") @db.VarChar(100)
  originProvince      String         @map("origin_province") @db.VarChar(100)
  originPostalCode    String         @map("origin_postal_code") @db.VarChar(10)
  originLatitude      Decimal?       @map("origin_latitude") @db.Decimal(10, 8)
  originLongitude     Decimal?       @map("origin_longitude") @db.Decimal(11, 8)
  destName            String         @map("dest_name") @db.VarChar(255)
  destPhone           String         @map("dest_phone") @db.VarChar(20)
  destAddress         String         @map("dest_address")
  destDistrict        String?        @map("dest_district") @db.VarChar(100)
  destCity            String         @map("dest_city") @db.VarChar(100)
  destProvince        String         @map("dest_province") @db.VarChar(100)
  destPostalCode      String         @map("dest_postal_code") @db.VarChar(10)
  destLatitude        Decimal?       @map("dest_latitude") @db.Decimal(10, 8)
  destLongitude       Decimal?       @map("dest_longitude") @db.Decimal(11, 8)
  estimatedDelivery   DateTime?      @map("estimated_delivery") @db.Timestamptz(6)
  bookedAt            DateTime?      @map("booked_at") @db.Timestamptz(6)
  pickedUpAt          DateTime?      @map("picked_up_at") @db.Timestamptz(6)
  inTransitAt         DateTime?      @map("in_transit_at") @db.Timestamptz(6)
  outForDeliveryAt    DateTime?      @map("out_for_delivery_at") @db.Timestamptz(6)
  deliveredAt         DateTime?      @map("delivered_at") @db.Timestamptz(6)
  failedAt            DateTime?      @map("failed_at") @db.Timestamptz(6)
  returnedAt          DateTime?      @map("returned_at") @db.Timestamptz(6)
  status              ShipmentStatus @default(pending)
  failureReason       String?        @map("failure_reason") @db.VarChar(500)
  receiverName        String?        @map("receiver_name") @db.VarChar(255)
  proofOfDeliveryUrl  String?        @map("proof_of_delivery_url")
  signature           String?
  instructions        String?        @db.VarChar(500)
  internalNotes       String?        @map("internal_notes")
  biteshipOrderId     String?        @map("biteship_order_id") @db.VarChar(100)
  metadata            Json?
  createdAt           DateTime       @default(now()) @map("created_at") @db.Timestamptz(6)
  updatedAt           DateTime       @updatedAt @map("updated_at") @db.Timestamptz(6)

  trackingEvents TrackingEvent[]

  @@index([shipmentNumber])
  @@index([orderId])
  @@index([trackingNumber])
  @@index([status])
  @@index([createdAt])
  @@map("shipment")
}
```

**Rule of thumb:** If a field name has multiple words (camelCase), it needs `@map("snake_case")`.
