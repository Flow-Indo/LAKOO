import express, {type Request, type Response} from "express";
import authMiddleware from '../middleware/authMiddleware'
import { createServiceProxy } from "../utils/proxy";


const router = express.Router();

//cart route: protected route
const cartProxy = createServiceProxy(process.env.ORDER_SERVICE_URL || 'http://localhost:8003');
router.use("/cart", authMiddleware,  cartProxy);

//auth route: public route
const authProxy = createServiceProxy(process.env.AUTH_SERVICE_URL || 'http://localhost:8001'); 
router.use("/auth", authProxy);

//check api gateway
router.get('/health', (req: Request, res: Response) => {
    res.json({ 
        status: 'ok', 
        service: 'api-gateway',
        timestamp: new Date().toISOString()
    });
});

export {router}