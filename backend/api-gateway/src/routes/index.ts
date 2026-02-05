import { Router, type Request, type Response} from "express";
import authMiddleware from '@src/middleware/authMiddleware.js'
import { createServiceProxy } from "@src/utils/proxy.js";
import jwt from 'jsonwebtoken';
import { requireServiceAuth } from '@src/middleware/serviceAuth.js';


const router: Router = Router();

// =============================================================================
// Test utilities (local/dev)
// =============================================================================

router.post('/test/token', requireServiceAuth, (req: Request, res: Response) => {
  const enabled = String(process.env.ENABLE_TEST_TOKEN_ENDPOINT || 'false').toLowerCase() === 'true';
  if (!enabled) {
    return res.status(404).json({ error: 'Not found' });
  }

  const JWT_SECRET = process.env.JWT_SECRET as string | undefined;
  if (!JWT_SECRET) {
    return res.status(500).json({ error: 'JWT_SECRET not configured' });
  }

  const { userId, phoneNumber, role } = (req.body || {}) as any;
  if (!userId || !phoneNumber) {
    return res.status(400).json({ error: 'userId and phoneNumber are required' });
  }

  const token = jwt.sign(
    { userId, phoneNumber, role: role || 'user' },
    JWT_SECRET,
    { expiresIn: '1h' }
  );

  return res.json({ token });
});

//cart route: protected route
const cartProxy = createServiceProxy(process.env.CART_SERVICE_URL || 'http://localhost:3003');
router.use("/cart", authMiddleware,  cartProxy);

//auth route: public route
const authProxy = createServiceProxy(process.env.AUTH_SERVICE_URL || 'http://localhost:3001'); 
router.use("/auth", authProxy);

//order route: protected route
const orderProxy = createServiceProxy(process.env.ORDER_SERVICE_URL || 'http://localhost:3006');
router.use("/orders", authMiddleware, orderProxy);
router.use(
  "/order",
  authMiddleware,
  createServiceProxy(process.env.ORDER_SERVICE_URL || 'http://localhost:3006', (_path: string, req: any) => {
    const originalUrl: string = req?.originalUrl || _path;
    return originalUrl.replace(/^\/api\/order(?=\/|$)/, '/api/orders');
  })
);

//seller route: protected route
const sellerProxy = createServiceProxy(process.env.SELLER_SERVICE_URL || 'http://localhost:3015');
router.use("/sellers", authMiddleware, sellerProxy);
router.use(
  "/seller",
  authMiddleware,
  createServiceProxy(process.env.SELLER_SERVICE_URL || 'http://localhost:3015', (_path: string, req: any) => {
    const originalUrl: string = req?.originalUrl || _path;
    return originalUrl.replace(/^\/api\/seller(?=\/|$)/, '/api/sellers');
  })
);

//product route: half protected, half public (FOR NOW, MAKE PUBLIC)
const productProxy = createServiceProxy(process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002');
router.use("/products", productProxy);
router.use(
  "/product",
  createServiceProxy(process.env.PRODUCT_SERVICE_URL || 'http://localhost:3002', (_path: string, req: any) => {
    const originalUrl: string = req?.originalUrl || _path;
    return originalUrl.replace(/^\/api\/product(?=\/|$)/, '/api/products');
  })
); 

//payment route: protected route
const paymentProxy = createServiceProxy(process.env.PAYMENT_SERVICE_URL || 'http://localhost:3007');
router.use("/payments", authMiddleware, paymentProxy);

//address route: protected route
const addressProxy = createServiceProxy(process.env.ADDRESS_SERVICE_URL || 'http://localhost:3010');
router.use("/addresses", authMiddleware, addressProxy);

//logistic routes: protected route
const logisticProxy = createServiceProxy(process.env.LOGISTIC_SERVICE_URL || 'http://localhost:3009');
router.use("/rates", authMiddleware, logisticProxy);
router.use("/shipments", authMiddleware, logisticProxy);

//check api gateway
router.get('/health', (req: Request, res: Response) => {
    res.json({ 
        status: 'ok', 
        service: 'api-gateway',
        timestamp: new Date().toISOString()
    });
});

export {router}
