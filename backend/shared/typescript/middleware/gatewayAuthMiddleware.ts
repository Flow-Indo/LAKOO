
import { Request, Response, NextFunction } from 'express';
import { verifyGatewayToken } from '../utils/gatewayToken.js';

const GATEWAY_AUTH_HEADER = 'X-Gateway-Auth';

export const gatewayAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {

    const gatewayKey = req.headers[GATEWAY_AUTH_HEADER.toLowerCase()];

    if (!gatewayKey) {
        return res.status(401).json({
            error: 'Not from API-gateway'
        });
    }

    const gatewaySecret = process.env.GATEWAY_SECRET;
    if (!gatewaySecret) {
        return res.status(500).json({
            error: 'Gateway secret not configured'
        });
    }

    try {
        verifyGatewayToken(gatewayKey, gatewaySecret)
    } catch (error) {
        return res.status(401).json({
            error: error
        })
    }
    
    //valid service auth
    next();
};
