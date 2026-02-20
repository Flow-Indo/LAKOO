import { createProxyMiddleware } from "http-proxy-middleware";
import { generateGatewayToken } from "@shared/utils/gatewayToken.js"


const forwardHeaders = (proxyReq: any, req: any) => {
    if(req.headers['x-user-id']) {
        proxyReq.setHeader('x-user-id', req.headers['x-user-id']);
        proxyReq.setHeader('x-user-phone', req.headers['x-user-phone']);
        proxyReq.setHeader('x-user-role', req.headers['x-user-role']);
    } 

    //api gateway key pass on, this is still not efficient, use redis later to cache
    const gatewayKey = generateGatewayToken(process.env.GATEWAY_SECRET || "gateway_secret");
    proxyReq.setHeader('x-gateway-auth', gatewayKey)
}

function forwardParsedBody(proxyReq: any, req: any) {
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

export const createServiceProxy = (target: string, pathRewrite?: any) => 
  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite,
    onProxyReq: (proxyReq: any, req: any) => {
      forwardHeaders(proxyReq, req);
      forwardParsedBody(proxyReq, req);
    },
    onError: (err: any, req: any, res: any) => {
      console.error('Service error:', err.message);
      res.status(503).json({ error: 'Service unavailable' });
    }
} as any);