import { Request, Response, NextFunction } from 'express';
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
const DEV_DEFAULT_USER_ID = '00000000-0000-0000-0000-000000000000';
const UUID_REGEX = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

function normalizeUuid(value?: string): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  const withoutPrefix = trimmed.toLowerCase().startsWith('urn:uuid:') ? trimmed.slice('urn:uuid:'.length) : trimmed;
  return UUID_REGEX.test(withoutPrefix) ? withoutPrefix : undefined;
}

function devUserFromHeaders(req: AuthenticatedRequest): { id: string; role: string } {
  const headerRoleHeader = req.headers['x-user-role'];
  const headerRoleRaw = Array.isArray(headerRoleHeader) ? undefined : (headerRoleHeader as string | undefined);

  const inferRoleFromPath = () => {
    const path = (req.originalUrl || req.path || '').toLowerCase();
    if (path.startsWith('/api/moderation')) return 'moderator';
    if (path.startsWith('/api/admin')) return 'admin';
    if (path.startsWith('/api/drafts')) return 'seller';
    return 'user';
  };

  const role = (headerRoleRaw || process.env.DEV_USER_ROLE || inferRoleFromPath()).trim().toLowerCase();

  const headerIdHeader = req.headers['x-user-id'];
  const headerIdRaw = Array.isArray(headerIdHeader) ? undefined : (headerIdHeader as string | undefined);
  const headerId = normalizeUuid(headerIdRaw);

  const roleEnvIdRaw =
    role === 'admin'
      ? process.env.DEV_ADMIN_ID
      : role === 'moderator'
        ? process.env.DEV_MODERATOR_ID
        : role === 'seller'
          ? process.env.DEV_SELLER_ID
          : undefined;

  const id =
    headerId ||
    normalizeUuid(roleEnvIdRaw) ||
    normalizeUuid(process.env.DEV_USER_ID) ||
    DEV_DEFAULT_USER_ID;

  return { id, role };
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
 * - x-gateway-key: Shared secret to verify request came from gateway
 * - x-user-id: Authenticated user's ID
 * - x-user-role: User's role (optional)
 */
export const gatewayAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const gatewayKey = req.headers['x-gateway-key'] as string;
  const expectedKey = process.env.GATEWAY_SECRET_KEY;

  // In development, allow requests without gateway key
  if (process.env.NODE_ENV === 'development' && !expectedKey) {
    req.user = devUserFromHeaders(req);
    return next();
  }

  // Verify gateway key
  if (!expectedKey) {
    console.warn('GATEWAY_SECRET_KEY not configured');
    return next(new UnauthorizedError('Gateway authentication not configured'));
  }

  if (!gatewayKey || gatewayKey !== expectedKey) {
    return next(new UnauthorizedError('Invalid gateway key'));
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
  res: Response,
  next: NextFunction
) => {
  const gatewayKey = req.headers['x-gateway-key'] as string;
  const expectedKey = process.env.GATEWAY_SECRET_KEY;

  // If gateway key matches, extract user info
  if (gatewayKey && expectedKey && gatewayKey === expectedKey) {
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
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
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
  res: Response,
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
  res: Response,
  next: NextFunction
) => {
  const gatewayKey = req.headers['x-gateway-key'] as string;

  // Try internal service auth first
  try {
    if (tryServiceAuth(req)) {
      return next();
    }
  } catch (err) {
    return next(err);
  }

  // Try gateway auth
  if (gatewayKey && gatewayKey === process.env.GATEWAY_SECRET_KEY) {
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
    req.user = devUserFromHeaders(req);
    return next();
  }

  return next(new UnauthorizedError('Authentication required'));
};
