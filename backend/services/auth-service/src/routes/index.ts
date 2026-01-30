import express, {type Router} from 'express';
import {AuthController }from '@src/controllers/auth.controller'
import { validate } from '@shared/middleware/validateZodMiddleware';
import { getUserBodyLoginSchema, getUserBodySignInSchema, getUserParamsSchema } from '@shared/schemas/user_zodSchema';
import { gatewayAuth, optionalAuth } from '@src/middleware/gateway';


const router: Router = express.Router();

const controller = new AuthController();

// Public routes (no auth required)
router.post("/login", validate(getUserBodyLoginSchema), controller.login);
router.post("/signup", validate(getUserBodySignInSchema), controller.signup);
router.post("/send-otp", controller.sendOTP);
// router.post("/refresh", controller.refresh);

// Protected routes (require gateway auth) - to be implemented
// router.post("/logout", gatewayAuth, controller.logout);
// router.post("/logout-all", gatewayAuth, controller.logoutAll);
// router.get("/me", gatewayAuth, controller.getCurrentUser);
// router.post("/change-password", gatewayAuth, controller.changePassword);

// Admin routes - to be implemented
// router.get("/sessions", gatewayAuth, controller.getSessions);
// router.delete("/sessions/:sessionId", gatewayAuth, controller.revokeSession);


export {router};