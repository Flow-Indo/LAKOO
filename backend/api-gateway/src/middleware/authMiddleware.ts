import jwt from 'jsonwebtoken';
import {type Request, type Response, type NextFunction} from 'express';
import dotenv from 'dotenv';
import { BlacklistService } from '@src/services/blacklistService.js';

dotenv.config();

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

        //check if token is blacklisted
        const isTokenBlacklisted = await BlacklistService.isTokenBlacklisted(token);
        if (isTokenBlacklisted) {
            return res.status(401).json({
                error: 'Token has been revoked'
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET) as {
            userId: string,
            phoneNumber: string,
            role: string
        };
        
        //validate if user exists (deleted/banned)
        const isUserBlacklisted = await BlacklistService.isUserBlacklisted(decoded.userId);
        if(isUserBlacklisted) {
            return res.status(401).json({
                error: 'User not found or has been deactivated'
            })
        } 

        req.headers['x-user-id'] = decoded.userId;
        req.headers['x-user-phoneNumber'] = decoded.phoneNumber;
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