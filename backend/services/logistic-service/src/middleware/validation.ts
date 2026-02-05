import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { z } from 'zod';

/**
 * Middleware to check express-validator results
 * Use after validator array in route definitions
 */
export const validateRequest = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
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

// =============================================================================
// Zod Schemas
// =============================================================================

const emptyToUndefined = (value: unknown) => (value === '' || value === null ? undefined : value);

const zCoerceInt = (schema: z.ZodNumber) => z.preprocess(emptyToUndefined, schema);
const zCoerceNumber = (schema: z.ZodNumber) => z.preprocess(emptyToUndefined, schema);

const zCoerceBoolean = z.preprocess((value: unknown) => {
  const cleaned = emptyToUndefined(value);
  if (cleaned === undefined) return undefined;

  if (typeof cleaned === 'string') {
    const lowered = cleaned.trim().toLowerCase();
    if (lowered === 'true' || lowered === '1') return true;
    if (lowered === 'false' || lowered === '0') return false;
  }

  return cleaned;
}, z.boolean());

const addressSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(1),
  address: z.string().min(1),
  district: z.string().optional(),
  city: z.string().min(1),
  province: z.string().min(1),
  postalCode: z.string().min(1),
  latitude: zCoerceNumber(z.coerce.number()).optional(),
  longitude: zCoerceNumber(z.coerce.number()).optional()
});

export const createShipmentSchema = z.object({
  orderId: z.string().uuid(),
  userId: z.string().uuid().optional(), // Set by controller from auth
  returnId: z.string().uuid().optional(),
  courier: z.string().min(1),
  courierName: z.string().optional(),
  serviceType: z.string().optional(),
  serviceName: z.string().optional(),
  shippingCost: zCoerceNumber(z.coerce.number().positive()),
  insuranceCost: zCoerceNumber(z.coerce.number().min(0)).optional(),
  codAmount: zCoerceNumber(z.coerce.number().min(0)).optional(),
  weightGrams: zCoerceInt(z.coerce.number().int().positive()),
  lengthCm: zCoerceNumber(z.coerce.number().positive()).optional(),
  widthCm: zCoerceNumber(z.coerce.number().positive()).optional(),
  heightCm: zCoerceNumber(z.coerce.number().positive()).optional(),
  itemCount: zCoerceInt(z.coerce.number().int().positive()).optional(),
  itemDescription: z.string().optional(),
  origin: addressSchema.optional(),
  destination: addressSchema,
  instructions: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

/**
 * Internal service calls must supply the userId explicitly (there is no gateway user context).
 */
export const createShipmentInternalSchema = createShipmentSchema.extend({
  userId: z.string().uuid()
});

export const getRatesSchema = z.object({
  originPostalCode: z.string().min(1),
  destPostalCode: z.string().min(1),
  productId: z.string().uuid().optional(),
  variantId: z.string().uuid().optional(),
  quantity: zCoerceInt(z.coerce.number().int().positive()).optional(),
  weightGrams: zCoerceInt(z.coerce.number().int().positive()).optional(),
  lengthCm: zCoerceNumber(z.coerce.number().positive()).optional(),
  widthCm: zCoerceNumber(z.coerce.number().positive()).optional(),
  heightCm: zCoerceNumber(z.coerce.number().positive()).optional(),
  itemValue: zCoerceNumber(z.coerce.number().positive()).optional(),
  couriers: z.array(z.string()).optional()
}).superRefine((val, ctx) => {
  if (!val.weightGrams && !val.productId) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['weightGrams'],
      message: 'weightGrams is required when productId is not provided'
    });
  }
});

export const updateShipmentStatusSchema = z.object({
  status: z.enum([
    'pending',
    'booked',
    'awaiting_pickup',
    'picked_up',
    'in_transit',
    'at_destination_hub',
    'out_for_delivery',
    'delivered',
    'failed',
    'returned',
    'cancelled'
  ]),
  failureReason: z.string().optional(),
  receiverName: z.string().optional(),
  proofOfDeliveryUrl: z.string().url().optional(),
  signature: z.string().optional()
});

export const updateShipmentSchema = z.object({
  trackingNumber: z.string().min(1).optional(),
  waybillId: z.string().min(1).optional(),
  biteshipOrderId: z.string().min(1).optional(),
  status: updateShipmentStatusSchema.shape.status.optional(),
  estimatedDelivery: z.preprocess(emptyToUndefined, z.union([z.string().min(1), z.date()])).optional(),
  failureReason: z.string().min(1).optional(),
  receiverName: z.string().min(1).optional(),
  proofOfDeliveryUrl: z.string().url().optional(),
  signature: z.string().min(1).optional(),
  internalNotes: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

export const bookShipmentSchema = z.object({
  trackingNumber: z.string().min(1).optional(),
  waybillId: z.string().min(1).optional(),
  biteshipOrderId: z.string().min(1).optional(),
  estimatedDelivery: z.preprocess(emptyToUndefined, z.union([z.string().min(1), z.date()])).optional()
});

export const createTrackingEventSchema = z.object({
  status: z.string().min(1),
  statusCode: z.string().optional(),
  description: z.string().optional(),
  location: z.string().optional(),
  city: z.string().optional(),
  courierStatus: z.string().optional(),
  eventTime: z.string().datetime()
});

export const markDeliveredSchema = z.object({
  receiverName: z.string().min(1).optional(),
  proofOfDeliveryUrl: z.string().url().optional(),
  signature: z.string().min(1).optional()
});

export const markFailedSchema = z.object({
  failureReason: z.string().min(1)
});

export const toggleCourierSchema = z.object({
  isActive: zCoerceBoolean
});

export const createCourierServiceSchema = z.object({
  serviceCode: z.string().min(1),
  serviceName: z.string().min(1),
  serviceType: z.string().optional(),
  estimatedDays: z.string().optional(),
  isActive: zCoerceBoolean.optional(),
  displayOrder: zCoerceInt(z.coerce.number().int()).optional()
});

export const createCourierSchema = z.object({
  courierCode: z.string().min(1),
  courierName: z.string().min(1),
  isActive: zCoerceBoolean.optional(),
  apiEndpoint: z.string().url().optional(),
  apiKey: z.string().optional(),
  supportsCod: zCoerceBoolean.optional(),
  supportsInsurance: zCoerceBoolean.optional(),
  supportsPickup: zCoerceBoolean.optional(),
  supportsDropoff: zCoerceBoolean.optional(),
  supportsRealTimeTracking: zCoerceBoolean.optional(),
  hasFixedRates: zCoerceBoolean.optional(),
  rateMultiplier: zCoerceNumber(z.coerce.number().positive()).optional(),
  logoUrl: z.string().url().optional(),
  displayOrder: zCoerceInt(z.coerce.number().int()).optional(),
  pickupCutoffTime: z.string().optional(),
  settings: z.record(z.any()).optional()
});

export const updateCourierSchema = createCourierSchema.partial().omit({ courierCode: true });

export const createWarehouseSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  contactName: z.string().min(1),
  contactPhone: z.string().min(1),
  address: z.string().min(1),
  district: z.string().optional(),
  city: z.string().min(1),
  province: z.string().min(1),
  postalCode: z.string().min(1),
  latitude: zCoerceNumber(z.coerce.number()).optional(),
  longitude: zCoerceNumber(z.coerce.number()).optional(),
  isDefault: zCoerceBoolean.optional(),
  isActive: zCoerceBoolean.optional(),
  operatingHours: z.string().optional()
});

export const updateWarehouseSchema = createWarehouseSchema.partial().omit({ code: true });

// =============================================================================
// Zod Validation Middleware
// =============================================================================

export function validate(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.body);
      (req as any).body = parsed;
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
