import { createProxyMiddleware } from "http-proxy-middleware";


const forwardHeaders = (proxyReq: any, req: any) => {
    if(req.headers['x-user-id']) {
        proxyReq.setHeader('x-user-id', req.headers['x-user-id']);
        proxyReq.setHeader('x-user-phone', req.headers['x-user-phone']);
        proxyReq.setHeader('x-user-role', req.headers['x-user-role']);
    } 
    
    if(req.headers['x-service-name']) {
        proxyReq.setHeader('x-service-name', req.headers['x-service-name']);
    }
}

export const createServiceProxy = (target: string, pathRewrite?: any) => 
  createProxyMiddleware({
    target,
    changeOrigin: true,
    pathRewrite,
    onProxyReq: forwardHeaders,
    onError: (err: any, req: any, res: any) => {
      console.error('Service error:', err.message);
      res.status(503).json({ error: 'Service unavailable' });
    }
} as any);