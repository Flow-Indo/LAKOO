import { createProxyMiddleware } from "http-proxy-middleware";
import { generateGatewayToken } from "@shared/utils/gatewayToken.js"

type MaybeUser = { userId?: string; phoneNumber?: string; role?: string } | undefined;

function forwardParsedBody(proxyReq: any, req: any) {
    // When api-gateway has `express.json()` enabled, the original request stream is consumed.
    // http-proxy-middleware won't automatically re-stream `req.body`, so we must re-send it.
    const method = String(req.method || 'GET').toUpperCase();
    if (method === 'GET' || method === 'HEAD') return;

    if (!req.body) return;

    const contentType = String(proxyReq.getHeader('Content-Type') || req.headers['content-type'] || '').toLowerCase();
    if (!contentType.includes('application/json')) return;

    try {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
    } catch (err) {
        console.warn('Failed to forward parsed JSON body to upstream service:', err);
    }
}

const forwardHeaders = (proxyReq: any, req: any) => {
    const userFromReq: MaybeUser = (req as any).user;
    const userId = req.headers['x-user-id'] || userFromReq?.userId;
    const userPhone = req.headers['x-user-phone'] || userFromReq?.phoneNumber;
    const userRole = req.headers['x-user-role'] || userFromReq?.role;

    if (userId) {
        proxyReq.setHeader('x-user-id', userId);
        if (userPhone) proxyReq.setHeader('x-user-phone', userPhone);
        if (userRole) proxyReq.setHeader('x-user-role', userRole);
    }

    // Service-to-service auth (internal callers hitting gateway directly)
    if (req.headers['x-service-auth']) {
        proxyReq.setHeader('x-service-auth', req.headers['x-service-auth']);
    }
    if (req.headers['x-service-name']) {
        proxyReq.setHeader('x-service-name', req.headers['x-service-name']);
    }

    //api gateway key pass on, this is still not efficient, use redis later to cache
    const gatewaySecret =
        process.env.GATEWAY_SECRET ||
        // Backward compat (some services/configs used this name previously)
        (process.env as any).GATEWAY_SECRET_KEY;

    if (!gatewaySecret) {
        // For local docker/dev, keep a consistent default instead of silently using an unrelated value.
        console.warn('GATEWAY_SECRET not configured on api-gateway; using dev-gateway-secret fallback');
    }

    const gatewayKey = generateGatewayToken(gatewaySecret || 'dev-gateway-secret');
    proxyReq.setHeader('x-gateway-auth', gatewayKey);
}

export const createServiceProxy = (target: string, pathRewrite?: any) => 
  createProxyMiddleware({
    target,
    changeOrigin: true,
    // Fail fast instead of hanging the client when an upstream is unreachable.
    timeout: (() => {
      const parsed = Number.parseInt(process.env.GATEWAY_PROXY_TIMEOUT_MS || '30000', 10);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : 30000;
    })(),
    proxyTimeout: (() => {
      const parsed = Number.parseInt(process.env.GATEWAY_PROXY_TIMEOUT_MS || '30000', 10);
      return Number.isFinite(parsed) && parsed > 0 ? parsed : 30000;
    })(),
    // Ensure upstream services receive the full `/api/...` path (not the stripped mount path).
    // If a custom rewrite is provided, use it; otherwise forward `req.originalUrl` unchanged.
    pathRewrite: pathRewrite || ((path: string, req: any) => req?.originalUrl || path),
    // http-proxy-middleware v3 uses the `on` object for event handlers.
    on: {
      proxyReq: (proxyReq: any, req: any) => {
        forwardHeaders(proxyReq, req);
        forwardParsedBody(proxyReq, req);
      },
      error: (err: any, _req: any, res: any) => {
        console.error('Service proxy error:', err?.message || err);
        // If headers were already sent, do not attempt to write.
        if (res.headersSent) return;
        res.status(503).json({ error: 'Service unavailable' });
      }
    }
} as any);
