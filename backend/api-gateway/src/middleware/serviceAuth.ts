import crypto from 'crypto';
import { type NextFunction, type Request, type Response } from 'express';

function timingSafeEqualHex(a: string, b: string) {
  const bufA = Buffer.from(a, 'hex');
  const bufB = Buffer.from(b, 'hex');
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

function verifyServiceToken(token: string, serviceSecret: string) {
  const parts = token.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid service token format');
  }

  const [serviceName, timestampStr, signature] = parts;
  if (!serviceName || !timestampStr || !signature) {
    throw new Error('Invalid service token format');
  }

  const timestamp = Number.parseInt(timestampStr, 10);
  if (!Number.isFinite(timestamp)) {
    throw new Error('Invalid service token timestamp');
  }

  const now = Math.floor(Date.now() / 1000);
  const maxSkewSecondsRaw = process.env.SERVICE_AUTH_MAX_SKEW_SECONDS;
  const maxSkewSecondsParsed = maxSkewSecondsRaw ? Number.parseInt(maxSkewSecondsRaw, 10) : 300;
  const maxSkewSeconds = Number.isFinite(maxSkewSecondsParsed) && maxSkewSecondsParsed > 0 ? maxSkewSecondsParsed : 300;
  if (Math.abs(now - timestamp) > maxSkewSeconds) {
    throw new Error('Service token expired');
  }

  const message = `${serviceName}:${timestamp}`;
  const expectedSignature = crypto.createHmac('sha256', serviceSecret).update(message).digest('hex');

  if (!timingSafeEqualHex(signature, expectedSignature)) {
    throw new Error('Invalid service token signature');
  }

  return { serviceName, timestamp };
}

export function requireServiceAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.headers['x-service-auth'];
  const serviceNameHeader = req.headers['x-service-name'];

  if (typeof token !== 'string' || typeof serviceNameHeader !== 'string') {
    return res.status(401).json({ error: 'Service authentication required' });
  }

  const serviceSecret = process.env.SERVICE_SECRET;
  if (!serviceSecret) {
    return res.status(500).json({ error: 'SERVICE_SECRET not configured' });
  }

  try {
    const verified = verifyServiceToken(token, serviceSecret);
    if (verified.serviceName !== serviceNameHeader) {
      return res.status(403).json({ error: 'Invalid service authentication' });
    }
    (req as any).internalService = { name: verified.serviceName };
    return next();
  } catch (err: any) {
    return res.status(403).json({ error: err?.message || 'Invalid service authentication' });
  }
}
