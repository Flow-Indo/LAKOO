import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { UnauthorizedError, ForbiddenError } from './error-handler';
import { verifyServiceToken } from '../utils/serviceAuth';

const DEV_DEFAULT_USER_ID = process.env.DEV_USER_ID || '11111111-1111-1111-1111-111111111111';
const DEV_DEFAULT_USER_ROLE = process.env.DEV_USER_ROLE || 'admin';
const GATEWAY_AUTH_HEADER = 'x-gateway-auth';
const SERVICE_AUTH_HEADER = 'x-service-auth';
const SERVICE_NAME_HEADER = 'x-service-name';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

/**
 * Verify HMAC gateway token (format: apiGateway:timestamp:signature)
 */
function verifyGatewayToken(token: string, secret: string): boolean {
  const parts = token.split(':');
  if (parts.length !== 3) return false;

  const [gatewayName, timestampStr, signature] = parts;
  const timestamp = Number.parseInt(timestampStr!, 10);
  if (!Number.isFinite(timestamp)) return false;

  // Check timestamp skew (default 5 minutes). Allow override for local docker time drift.
  const now = Math.floor(Date.now() / 1000);
  const maxSkewSecondsRaw = process.env.GATEWAY_AUTH_MAX_SKEW_SECONDS;
  const maxSkewSecondsParsed = maxSkewSecondsRaw ? Number.parseInt(maxSkewSecondsRaw, 10) : 300;
  const maxSkewSeconds = Number.isFinite(maxSkewSecondsParsed) && maxSkewSecondsParsed > 0 ? maxSkewSecondsParsed : 300;
  if (Math.abs(now - timestamp) > maxSkewSeconds) return false;

  // Verify signature
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
 * Gateway authentication - trusts that API Gateway has validated the JWT
 * and forwarded user info via headers.
 *
 * Required headers from gateway:
 * - x-gateway-auth: HMAC token (apiGateway:timestamp:signature)
 * - x-user-id: Authenticated user's ID
 * - x-user-role: User's role (optional)
 */
export const gatewayAuth = (req: Request, _res: Response, next: NextFunction) => {
  const gatewayToken = req.headers[GATEWAY_AUTH_HEADER] as string | undefined;
  const gatewaySecret = process.env.GATEWAY_SECRET;

  // In development, allow requests without any auth headers (Swagger/local testing).
  if (process.env.NODE_ENV === 'development' && !gatewaySecret) {
    req.user = {
      id: (req.headers['x-user-id'] as string) || DEV_DEFAULT_USER_ID,
      role: (req.headers['x-user-role'] as string) || process.env.DEV_USER_ROLE || 'user'
    };
    return next();
  }

  // Verify gateway token
  if (!gatewaySecret) {
    console.warn('GATEWAY_SECRET not configured');
    return next(new UnauthorizedError('Gateway authentication not configured'));
  }

  if (!gatewayToken || !verifyGatewayToken(gatewayToken, gatewaySecret)) {
    return next(new UnauthorizedError('Invalid gateway token'));
  }

  // Extract user info from headers (set by API Gateway after JWT validation)
  const userId = req.headers['x-user-id'] as string;
  const userRole = req.headers['x-user-role'] as string;

  if (!userId) {
    return next(new UnauthorizedError('Missing user identification'));
  }

  req.user = { id: userId, role: userRole || 'user' };
  next();
};

/**
 * For endpoints that can be called by gateway OR internal services
 */
export const gatewayOrInternalAuth = (req: Request, _res: Response, next: NextFunction) => {
  const gatewayToken = req.headers[GATEWAY_AUTH_HEADER] as string | undefined;
  const gatewaySecret = process.env.GATEWAY_SECRET;
  const tokenHeader = req.headers[SERVICE_AUTH_HEADER];
  const serviceNameHeader = req.headers[SERVICE_NAME_HEADER];
  const serviceSecret = process.env.SERVICE_SECRET;

  // Development mode bypass: if no auth headers are present, allow the request through for Swagger/local testing.
  if (process.env.NODE_ENV === 'development') {
    const hasGatewayAttempt = !!gatewayToken;
    const hasServiceAttempt = !!tokenHeader || !!serviceNameHeader;

    if (!hasGatewayAttempt && !hasServiceAttempt) {
      req.user = {
        id: (req.headers['x-user-id'] as string) || DEV_DEFAULT_USER_ID,
        role: (req.headers['x-user-role'] as string) || DEV_DEFAULT_USER_ROLE
      };
      return next();
    }
  }

  // Check gateway auth first (HMAC token verification)
  if (gatewayToken && !gatewaySecret) {
    return next(new UnauthorizedError('Gateway authentication not configured'));
  }

  if (gatewayToken && gatewaySecret) {
    if (!verifyGatewayToken(gatewayToken, gatewaySecret)) {
      return next(new UnauthorizedError('Invalid gateway token'));
    }

    const userId = req.headers['x-user-id'] as string;
    if (!userId) {
      return next(new UnauthorizedError('Missing user identification'));
    }
    req.user = { id: userId, role: (req.headers['x-user-role'] as string) || 'user' };
    return next();
  }

  // Check internal service auth (HMAC token)
  if (tokenHeader && serviceNameHeader) {
    if (Array.isArray(tokenHeader) || Array.isArray(serviceNameHeader)) {
      return next(new UnauthorizedError('Invalid service auth header format'));
    }

    // Dev fallback
    if (process.env.NODE_ENV === 'development' && !serviceSecret) {
      req.user = { id: serviceNameHeader, role: 'internal' };
      return next();
    }

    if (!serviceSecret) {
      return next(new UnauthorizedError('SERVICE_SECRET not configured'));
    }

    try {
      verifyServiceToken(tokenHeader, serviceSecret);
      req.user = { id: serviceNameHeader, role: 'internal' };
      return next();
    } catch (err) {
      return next(new UnauthorizedError(err instanceof Error ? err.message : 'Invalid service token'));
    }
  }

  return next(new UnauthorizedError('Invalid authentication'));
};

/**
 * Role-based access control - use after gatewayAuth
 */
export const requireRole = (...allowedRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('Not authenticated'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError(`Required role: ${allowedRoles.join(' or ')}`));
    }

    next();
  };
};

/**
 * Internal-only middleware - only allows internal service calls
 */
export const internalOnly = (req: Request, _res: Response, next: NextFunction) => {
  if (!req.user) {
    return next(new UnauthorizedError('Not authenticated'));
  }

  if (req.user.role !== 'internal') {
    return next(new ForbiddenError('Internal service access only'));
  }

  next();
};
