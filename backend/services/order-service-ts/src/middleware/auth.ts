import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from './error-handler';
import { verifyServiceToken } from '../utils/serviceAuth';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role?: string;
  };
}

const SERVICE_AUTH_HEADER = 'x-service-auth';
const SERVICE_NAME_HEADER = 'x-service-name';

const DEV_DEFAULT_USER_ID = process.env.DEV_USER_ID || '11111111-1111-1111-1111-111111111111';

function isUuid(value: unknown): value is string {
  if (typeof value !== 'string') return false;
  // Simple UUID v1-v5 matcher (matches express-validator/zod expectations)
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);
}

function tryServiceAuth(req: AuthenticatedRequest): boolean {
  const tokenHeader = req.headers[SERVICE_AUTH_HEADER];
  const serviceNameHeader = req.headers[SERVICE_NAME_HEADER];

  if (!tokenHeader || !serviceNameHeader) return false;
  if (Array.isArray(tokenHeader) || Array.isArray(serviceNameHeader)) {
    throw new UnauthorizedError('Invalid service auth header format');
  }

  const serviceSecret = process.env.SERVICE_SECRET;

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

    req.user = { id: tokenServiceName, role: 'internal' };
  } catch (err: any) {
    if (err instanceof UnauthorizedError) throw err;
    throw new UnauthorizedError('Invalid service authentication token');
  }

  return true;
}

export const gatewayAuth = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) => {
  const gatewayKey = req.headers['x-gateway-key'] as string;
  const expectedKey = process.env.GATEWAY_SECRET_KEY;

  if (process.env.NODE_ENV === 'development' && !expectedKey) {
    const headerUserId = req.headers['x-user-id'] as string | undefined;
    req.user = {
      id: (headerUserId && isUuid(headerUserId) ? headerUserId : DEV_DEFAULT_USER_ID),
      role: (req.headers['x-user-role'] as string) || 'user'
    };
    return next();
  }

  if (!expectedKey) {
    console.warn('GATEWAY_SECRET_KEY not configured');
    return next(new UnauthorizedError('Gateway authentication not configured'));
  }

  if (!gatewayKey || gatewayKey !== expectedKey) {
    return next(new UnauthorizedError('Invalid gateway key'));
  }

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

export const gatewayOrInternalAuth = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
) => {
  const gatewayKey = req.headers['x-gateway-key'] as string;

  try {
    if (tryServiceAuth(req)) {
      return next();
    }
  } catch (err) {
    return next(err);
  }

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

  if (process.env.NODE_ENV === 'development') {
    const headerUserId = req.headers['x-user-id'] as string | undefined;
    const bodyUserId = (req.body as any)?.userId as string | undefined;
    const chosenUserId = (isUuid(bodyUserId) ? bodyUserId : (isUuid(headerUserId) ? headerUserId : DEV_DEFAULT_USER_ID));

    req.user = {
      id: chosenUserId,
      // If userId comes from body (developer testing), treat it as an internal-style call so controllers can use req.body.userId.
      role: isUuid(bodyUserId) ? 'internal' : ((req.headers['x-user-role'] as string) || 'user')
    };
    return next();
  }

  return next(new UnauthorizedError('Authentication required'));
};

export const authenticate = gatewayAuth;
export const requireAdmin = requireRole('admin');
export const requireInternalAuth = internalServiceAuth;
