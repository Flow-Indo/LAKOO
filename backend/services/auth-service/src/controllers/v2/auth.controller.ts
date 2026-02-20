import { type Request, type Response} from 'express';
import dotenv from 'dotenv';
import { UserResponseDTO } from '@src/types/response_dto';
import AuthService from '@src/services/auth.service';
import {generateBothToken, generateAccessTokenOnly, setRefreshToken } from '@src/utils/jwtToken';

dotenv.config();

//v2 doesnt use OTP

export class AuthController {
    private authService: AuthService;

    constructor() {
        this.authService = new AuthService();
    }


    login = async (req: Request, res: Response) => {
        try {
            const { phoneNumber, password } = req.body;

            if(!phoneNumber || !password) {
                return res.status(400).json({
                    error: "Phone number and Password required"
                });
            }

            //verify user
            const userData : UserResponseDTO | null = await this.authService.verifyUser(phoneNumber, password);
            if(!userData) {
                return res.status(401).json({
                    error: "Invalid credentials"
                })
            }


            const {accessToken, refreshToken} = generateBothToken(userData.userId, userData.phoneNumber, userData.role);

            setRefreshToken(res, refreshToken);

            res.json({
                success: true,
                user : userData,
                access_token: accessToken
            });
        } catch(err) {
            return res.status(500).json({
                error: "Internal server error"
            })
        }
    }

    signup = async (req: Request, res: Response) => {
        try {
            const { phoneNumber, firstName, lastName, password, confirmPassword } = req.body;

            if(password != confirmPassword) {
                return res.status(400).json({
                    error: "Passwords do not match"
                });
            }

            const userData : UserResponseDTO = await this.authService.createUser(phoneNumber, firstName, lastName, password);

            const {accessToken, refreshToken} = generateBothToken(userData.userId, userData.phoneNumber, userData.role);

            setRefreshToken(res, refreshToken);

            return res.json({
                success: true,
                access_token: accessToken,
            })
        } catch(err: any) {
            return res.status(500).json({
                error: err.message
            })
        }
    }

    // refresh = async (req: Request, res: Response) => {
    //     try {
    //         const refreshToken = req.cookies.refreshToken;

    //         if(!refreshToken) {
    //             return res.status(401).json({
    //                 error: "Refresh Token not provided"
    //             })
    //         }

    //         const JWT_SECRET = process.env.JWT_SECRET;

    //         if(!JWT_SECRET) {
    //             return res.status(500).json({
    //                 error: "JWT Secret is not given from the server"
    //             })
    //         }
    //         const decoded = jwt.verify(refreshToken, JWT_SECRET) as {
    //             type: string,
    //             phoneNumber: string
    //         };

    //         if(decoded.type !== "refreshToken") {
    //             return res.status(403).json({
    //                 error: "Token is not refresh type"
    //             })
    //         }

    //         const userData : UserResponseDTO | null = await this.authService.findUser(decoded.phoneNumber);

    //         if(!userData) {
    //             throw new Error();
    //         }

    //         const {accessToken} = generateAccessTokenOnly(userData.userId, userData.phoneNumber, userData.role);

    //         setTokenCookies(res, accessToken);

    //         return res.json({
    //             success: true
    //         })
    //     } catch {   
    //         return res.status(500).json({
    //             error: "Token refresh failed"
    //         })
    //     }   
    // }

    


}
