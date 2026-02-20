import { Router, type Request, type Response} from "express";
import authMiddleware from '@src/middleware/authMiddleware.js'
import { createServiceProxy } from "@src/utils/proxy.js";


const router: Router = Router();

//cart route: protected route
const cartProxy = createServiceProxy(process.env.CART_SERVICE_URL || 'http://localhost:8003');
router.use("/cart", authMiddleware,  cartProxy);

//auth route: public route
const authProxy = createServiceProxy(process.env.AUTH_SERVICE_URL || 'http://localhost:8001'); 
router.use("/auth", authProxy);

//order route: protected route
const orderProxy = createServiceProxy(process.env.ORDER_SERVICE_URL || 'http://localhost:8006');
router.use("/order", authMiddleware,  orderProxy);

//seller route: protected route
const sellerProxy = createServiceProxy(process.env.SELLER_SERVICE_URL || 'http://localhost:8015');
router.use("/seller", authMiddleware,  sellerProxy);

//product route: half protected, half public (FOR NOW, MAKE PUBLIC)
const productProxy = createServiceProxy(process.env.PRODUCT_SERVICE_URL || 'http://localhost:8002');
router.use("/product", productProxy); 

//payment route: protected route
const paymentProxy = createServiceProxy(process.env.PAYMENT_SERVICE_URL || 'http://localhost:8007');
router.use("/payments", authMiddleware, paymentProxy);

//address route: protected route
const addressProxy = createServiceProxy(process.env.ADDRESS_SERVICE_URL || 'http://localhost:8010');
router.use("/addresses", authMiddleware, addressProxy);

//logistic routes: protected route
const logisticProxy = createServiceProxy(process.env.LOGISTIC_SERVICE_URL || 'http://localhost:8009');
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