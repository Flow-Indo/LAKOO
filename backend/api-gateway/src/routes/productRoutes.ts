import { Router } from 'express';
import { createServiceProxy } from '../utils/proxy';


const productRouter = Router();

const PRODUCT_SERVICE = process.env.PRODUCT_SERVICE_URL || 'http://localhost:3005';

const productProxy = createServiceProxy(PRODUCT_SERVICE);

//public



//protected


export default productRouter;