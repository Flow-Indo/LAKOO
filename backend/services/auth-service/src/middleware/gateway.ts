import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

export interface AuthenticatedRequest extends Request {
  userId?: string;
  userRole?: string;
}

const GATEWAY_AUTH_HEADER = 'x-gateway-auth';

function verifyGatewayToken(token: string, secret: string): boolean {
  const parts = token.split(':');
  if (parts.length !== 3) return false;

  const [gatewayName, timestampStr, signature] = parts;
  const timestamp = parseInt(timestampStr!, 10);
  if (!Number.isFinite(timestamp)) return false;

  // 5-minute validity window
  const now = Math.floor(Date.now() / 1000);
  if (now - timestamp > 300) return false;

  const message = `${gatewayName}:${timestamp}`;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(message)
    .digest('hex');

  const sigBuf = Buffer.from(signature!, 'hex');
  const expectedBuf = Buffer.from(expectedSignature, 'hex');
  if (sigBuf.length !== expectedBuf.length) return false;

  return crypto.timingSafeEqual(sigBuf, expectedBuf);
}

/**
 * Verify request came from API Gateway (HMAC token: apiGateway:timestamp:signature)
 */
export const gatewayAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const gatewayToken = req.headers[GATEWAY_AUTH_HEADER] as string | undefined;
  const gatewaySecret = process.env.GATEWAY_SECRET;

  // Development mode bypass
  if (process.env.NODE_ENV === 'development' && !gatewaySecret) {
    req.userId = req.headers['x-user-id'] as string;
    req.userRole = req.headers['x-user-role'] as string;
    return next();
  }

  if (!gatewaySecret) {
    return res.status(500).json({
      success: false,
      error: 'Gateway authentication not configured'
    });
  }

  if (!gatewayToken || !verifyGatewayToken(gatewayToken, gatewaySecret)) {
    return res.status(403).json({
      success: false,
      error: 'Invalid gateway token'
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
export const optionalAuth = (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  const gatewayToken = req.headers[GATEWAY_AUTH_HEADER] as string | undefined;
  const gatewaySecret = process.env.GATEWAY_SECRET;

  if (gatewayToken && gatewaySecret && verifyGatewayToken(gatewayToken, gatewaySecret)) {
    req.userId = req.headers['x-user-id'] as string;
    req.userRole = req.headers['x-user-role'] as string;
  }

  next();
};
