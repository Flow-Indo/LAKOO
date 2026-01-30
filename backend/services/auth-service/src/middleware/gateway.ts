import { Request, Response, NextFunction } from 'express';

const GATEWAY_SECRET = process.env.GATEWAY_SECRET || 'internal-gateway-secret';

export interface AuthenticatedRequest extends Request {
  userId?: string;
  userRole?: string;
}

/**
 * Verify request came from API Gateway
 */
export const gatewayAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const gatewayKey = req.headers['x-gateway-key'];
  
  // Development mode bypass
  if (process.env.NODE_ENV === 'development' && !gatewayKey) {
    req.userId = req.headers['x-user-id'] as string;
    req.userRole = req.headers['x-user-role'] as string;
    return next();
  }

  if (gatewayKey !== GATEWAY_SECRET) {
    return res.status(403).json({
      success: false,
      error: 'Invalid gateway key'
    });
  }

  // Extract user info from gateway headers
  req.userId = req.headers['x-user-id'] as string;
  req.userRole = req.headers['x-user-role'] as string;

  next();
};

/**
 * Optional auth - doesn't fail if no auth provided
 */
export const optionalAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const gatewayKey = req.headers['x-gateway-key'];
  
  if (gatewayKey === GATEWAY_SECRET) {
    req.userId = req.headers['x-user-id'] as string;
    req.userRole = req.headers['x-user-role'] as string;
  }

  next();
};
