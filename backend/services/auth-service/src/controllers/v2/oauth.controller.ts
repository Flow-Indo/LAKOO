import { generateBothToken, setRefreshToken } from '@src/utils/jwtToken';
import { Request, Response } from 'express';

export class OAuthController {

        googleCallback = async (req: Request, res: Response) => {

            try {
                const user = (req as any).user;
                if (!user) {
                    return res.status(400).json({ error: "User not authenticated" });
                }


                const { accessToken, refreshToken } = generateBothToken(
                    user.id,
                    user.email || user.phoneNumber,
                    user.role
                );

                setRefreshToken(res, refreshToken);

                res.redirect(`${process.env.CLIENT_URL}/oauth/callback?success=true`);
            } catch (error) {
                res.status(500).json({ error: "Internal server error" });
            }
            
        }
    
}