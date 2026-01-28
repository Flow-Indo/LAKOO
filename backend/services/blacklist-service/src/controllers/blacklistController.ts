import { type Request, type Response} from 'express';
import jwt from 'jsonwebtoken'
import redis from '../redis/redis';


export class BlacklistController {

    BlacklistUser = async (req: Request, res: Response) => {
        try {
            const { userId } = req.body;
           
            if (!userId || typeof userId !== 'string' || userId.trim() === '') {
                return res.status(400).json({
                    success: false,
                    error: "Valid user ID is required"
                });
            }

            await redis.sadd('blacklist:users', userId); //adds userId to a redis set blacklist:users
            return res.status(200).json({success: true})
        } catch (error) {
            console.error('Error blacklisting user: ', error);
            return res.status(500).json({
                success: false,
                error: `Error blacklisting user: ${error}`
            });
        }
    }

    CheckUser = async (req: Request, res: Response) => {
        try {
            const userId = req.params.userId;

            if (!userId || typeof userId !== 'string' || userId.trim() === '') {
                return res.status(400).json({
                    success: false,
                    error: "Valid user ID is required"
                });
            }

            const result = await redis.sismember('blacklist:users', userId); //checks if userId exists in the set blacklist:users

            return res.status(200).json({isBlacklisted: result === 1})

        } catch (error) {
            console.error("Error checking user blacklist: ", error);
            return res.status(500).json({
                error: `Error checking user blacklist: ${error}`
            });
        }
    }

    BlacklistToken = async (req: Request, res: Response) => {
        try {
            const { access_token } = req.body;
            const decoded = jwt.decode(access_token) as {exp?: number};

            if(!decoded || !decoded.exp) {
                throw new Error("Invalid token");
            }

            //calculate TTL time, which is time until token expires
            const now = Math.floor(Date.now() / 1000);
            const ttl = decoded.exp - now;

            if (ttl > 0) {
                //store token in Redis with TTL (creates a key-value pair with an expiration time)
                await redis.setex(`blacklist:token:${access_token}`, ttl, 'true');
            }

            return res.status(200).json({success: true});
        } catch(error) {
            console.error("Error blacklisting token: ", error);
            return res.status(500).json({
                success: false,
                error: `Error blacklisting token: ${error}`
            });
        }
    }

    CheckToken = async (req: Request, res: Response) => {
        try {
            const { access_token } = req.body;

            if(!access_token) {
                return res.status(400).json({
                    error: "Token is required"
                })
            }
            const result = await redis.get(`blacklist:token:${access_token}`); //returns true if token exists in blacklist, and null if not
            return res.status(200).json({
                isBlacklisted: result !== null
            })
        } catch (error) {
            return res.status(500).json({
                error: `Error checking token blacklist: ${error}`
            });
        }
    }

    RemoveUser = async (req: Request, res: Response) => {
        try {
            const userId = req.params.userId
            if (!userId || typeof userId !== 'string' || userId.trim() === '') {
                return res.status(400).json({
                    success: false,
                    error: "Valid user ID is required"
                });
            }

            await redis.srem('blacklist:users', userId);

            return res.status(200).json({success: true});
        } catch(error) {
            return res.status(500).json({
                success: false,
                error: `Error removing user from blacklist: ${error}`
            });
        }
    }

}