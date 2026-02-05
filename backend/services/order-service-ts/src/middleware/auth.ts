import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { UnauthorizedError, ForbiddenError } from './error-handler';
import { verifyServiceToken } from '../utils/serviceAuth';

/**
 * User info forwarded by API Gateway
 */
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role?: string;
  };
}

const SERVICE_AUTH_HEADER = 'x-service-auth';
const SERVICE_NAME_HEADER = 'x-service-name';
const GATEWAY_AUTH_HEADER = 'x-gateway-auth';

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

function tryServiceAuth(req: AuthenticatedRequest): boolean {
  const tokenHeader = req.headers[SERVICE_AUTH_HEADER];
  const serviceNameHeader = req.headers[SERVICE_NAME_HEADER];

  if (!tokenHeader || !serviceNameHeader) return false;
  if (Array.isArray(tokenHeader) || Array.isArray(serviceNameHeader)) {
    throw new UnauthorizedError('Invalid service auth header format');
  }

  const serviceSecret = process.env.SERVICE_SECRET;

  // Dev fallback (mirrors existing "no key in dev" behavior)
  if (process.env.NODE_ENV === 'development' && !serviceSecret) {
    req.user = { id: serviceNameHeader, role: 'internal' };
    return true;
  }

  if (!serviceSecret) {
    throw new UnauthorizedError('SERVICE_SECRET not configured');
  }

  try {
    const { serviceName: tokenServiceName } = verifyServiceToken(tokenHeader, serviceSecret);

    // Prevent header spoofing: the signed token serviceName must match x-service-name
    if (tokenServiceName !== serviceNameHeader) {
      throw new UnauthorizedError('Service name mismatch');
    }

    // Do not trust x-service-name beyond matching; use the signed token identity
    req.user = { id: tokenServiceName, role: 'internal' };
  } catch (err: any) {
    if (err instanceof UnauthorizedError) throw err;
    throw new UnauthorizedError('Invalid service authentication token');
  }

  return true;
}

/**
 * Gateway Trust Middleware
 *
 * Trusts that authentication was handled by the API Gateway.
 * The gateway forwards user info via headers after validating JWT.
 *
 * Required headers from gateway:
 * - x-gateway-auth: HMAC token (apiGateway:timestamp:signature)
 * - x-user-id: Authenticated user's ID
 * - x-user-role: User's role (optional)
 */
export const gatewayAuth = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) => {
  const gatewayToken = req.headers[GATEWAY_AUTH_HEADER] as string;
  const gatewaySecret = process.env.GATEWAY_SECRET;

  // In development, allow requests without gateway token
  if (process.env.NODE_ENV === 'development' && !gatewaySecret) {
    req.user = {
      id: (req.headers['x-user-id'] as string) || 'dev-user',
      role: (req.headers['x-user-role'] as string) || 'user'
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

  // Extract user info from gateway headers
  const userId = req.headers['x-user-id'] as string;
  if (!userId) {
    return next(new UnauthorizedError('Missing user ID from gateway'));
  }

  req.user = {
    id: userId,
    role: req.headers['x-user-role'] as string
  };

  next();
};

/**
 * Optional gateway auth - doesn't fail if no gateway headers
 * Useful for endpoints that work for both authenticated and anonymous users
 */
export const optionalGatewayAuth = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) => {
  const gatewayToken = req.headers[GATEWAY_AUTH_HEADER] as string;
  const gatewaySecret = process.env.GATEWAY_SECRET;

  // If gateway token is valid, extract user info
  if (gatewayToken && gatewaySecret && verifyGatewayToken(gatewayToken, gatewaySecret)) {
    const userId = req.headers['x-user-id'] as string;
    if (userId) {
      req.user = {
        id: userId,
        role: req.headers['x-user-role'] as string
      };
    }
  }

  next();
};

/**
 * Role check middleware - requires gatewayAuth to run first
 */
export const requireRole = (...roles: string[]) => {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('Not authenticated'));
    }

    if (!req.user.role || !roles.includes(req.user.role)) {
      return next(new ForbiddenError('Insufficient permissions'));
    }

    next();
  };
};

/**
 * Internal service authentication (service-to-service)
 *
 * Requires:
 * - x-service-auth: serviceName:timestamp:signature
 * - x-service-name: serviceName
 * - SERVICE_SECRET: shared secret used to verify the HMAC token
 */
export const internalServiceAuth = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    const ok = tryServiceAuth(req as AuthenticatedRequest);
    if (!ok) {
      return next(new UnauthorizedError('Service authentication required'));
    }
    return next();
  } catch (err) {
    return next(err);
  }
};

/**
 * Combined auth - accepts gateway auth OR internal service auth
 * Useful for endpoints called by both users (via gateway) and other services
 */
export const gatewayOrInternalAuth = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) => {
  const gatewayToken = req.headers[GATEWAY_AUTH_HEADER] as string;
  const gatewaySecret = process.env.GATEWAY_SECRET;

  // Try internal service auth first
  try {
    if (tryServiceAuth(req)) {
      return next();
    }
  } catch (err) {
    return next(err);
  }

  // Try gateway auth (HMAC token verification)
  if (gatewayToken && gatewaySecret && verifyGatewayToken(gatewayToken, gatewaySecret)) {
    const userId = req.headers['x-user-id'] as string;
    if (userId) {
      req.user = {
        id: userId,
        role: req.headers['x-user-role'] as string
      };
      return next();
    }
  }

  // Development mode fallback
  if (process.env.NODE_ENV === 'development') {
    req.user = {
      id: (req.headers['x-user-id'] as string) || 'dev-user',
      role: 'user'
    };
    return next();
  }

  return next(new UnauthorizedError('Authentication required'));
};

/**
 * Backwards-compatible aliases used by routes/controllers.
 */
export const authenticate = gatewayAuth;
export const requireAdmin = requireRole('admin');
export const requireInternalAuth = internalServiceAuth;
