import jwt from 'jsonwebtoken';
import {type Request, type Response, type NextFunction} from 'express';
import dotenv from 'dotenv';
import { BlacklistService } from '@src/services/blacklistService.js';

dotenv.config();

type DecodedJwt = {
    userId: string;
    phoneNumber: string;
    role: string;
};

const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        //get token from cookie or header
        const token = req.cookies.jwt || req.headers.authorization?.replace(/^Bearer\s+/i, '')?.trim();
        
        //if no token -> go to auth
        if(!token) {
            return res.status(401).json({
                error: "Authentication required"
            });
        }

        const JWT_SECRET = process.env.JWT_SECRET as string;

        if(!JWT_SECRET) {
            return res.status(500).json({
                error: "JWT secret not available"
            })
        }

        const decoded = jwt.verify(token, JWT_SECRET) as DecodedJwt;
        
        const blacklistStrict = String(process.env.BLACKLIST_STRICT || 'false').toLowerCase() === 'true';
        const disableBlacklist = String(process.env.DISABLE_BLACKLIST || 'false').toLowerCase() === 'true';

        if (!disableBlacklist) {
            try {
                //check if token is blacklisted
                const isTokenBlacklisted = await BlacklistService.isTokenBlacklisted(token);
                if (isTokenBlacklisted) {
                    return res.status(401).json({
                        error: 'Token has been revoked'
                    });
                }

                //validate if user exists (deleted/banned)
                const isUserBlacklisted = await BlacklistService.isUserBlacklisted(decoded.userId);
                if(isUserBlacklisted) {
                    return res.status(401).json({
                        error: 'User not found or has been deactivated'
                    })
                }
            } catch (err: any) {
                if (blacklistStrict) {
                    throw err;
                }
                console.warn('Blacklist service unavailable; skipping blacklist checks.', err?.message || err);
            }
        }

        // Store on req for downstream middleware (proxy) without relying on mutating req.headers.
        (req as any).user = decoded;

        req.headers['x-user-id'] = decoded.userId;
        req.headers['x-user-phone'] = decoded.phoneNumber;
        req.headers['x-user-role'] = decoded.role || 'user';

        next();
    } catch(error: any) {
        if(error.name === 'TokenExpiredError') {
            return res.status(401).json({
                error: 'Token expired',
            });
        }

        return res.status(403).json({
            error: 'Invalid token',
        })
    }
}

export default authMiddleware;
