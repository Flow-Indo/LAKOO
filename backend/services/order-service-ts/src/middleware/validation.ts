import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { z } from 'zod';

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

const emptyToUndefined = (value: unknown) => (value === '' || value === null ? undefined : value);
const zCoerceNumber = (schema: z.ZodNumber) => z.preprocess(emptyToUndefined, schema);

export const createOrderSchema = z.object({
  // Used only for internal calls; gateway calls derive userId from auth headers.
  userId: z.string().uuid().optional(),
  idempotencyKey: z.string().min(1),
  items: z.array(z.object({
    productId: z.string().uuid(),
    variantId: z.string().uuid().optional(),
    quantity: z.coerce.number().int().positive()
  })).min(1),
  shippingAddressId: z.string().uuid().optional(),
  shippingAddress: z.object({
    name: z.string().min(1),
    phone: z.string().min(1),
    province: z.string().min(1),
    city: z.string().min(1),
    district: z.string().optional(),
    postalCode: z.string().optional(),
    address: z.string().min(1),
    latitude: zCoerceNumber(z.coerce.number()).optional(),
    longitude: zCoerceNumber(z.coerce.number()).optional()
  }),
  shippingNotes: z.string().optional(),
  discountAmount: zCoerceNumber(z.coerce.number().min(0)).optional(),
  paymentMethod: z.enum([
    'bank_transfer',
    'virtual_account',
    'credit_card',
    'ewallet_ovo',
    'ewallet_gopay',
    'ewallet_dana',
    'qris'
  ]).optional(),
  expiresAt: z.string().datetime().optional()
});

export const updateOrderStatusSchema = z.object({
  newStatus: z.enum([
    'pending',
    'awaiting_payment',
    'paid',
    'confirmed',
    'processing',
    'ready_to_ship',
    'shipped',
    'in_transit',
    'out_for_delivery',
    'delivered',
    'completed',
    'cancelled',
    'refunded',
    'partially_refunded'
  ]),
  reason: z.string().optional(),
  notes: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

export const updateShippingCostSchema = z.object({
  shippingCost: zCoerceNumber(z.coerce.number().min(0)),
  taxAmount: zCoerceNumber(z.coerce.number().min(0)).optional()
});

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
