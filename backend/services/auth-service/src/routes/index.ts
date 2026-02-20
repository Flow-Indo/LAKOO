import express, {type Router} from 'express';
import {AuthController }from '@src/controllers/v1/auth.controller'
import { OAuthController } from '@src/controllers/v2/oauth.controller';
import { validate } from '@shared/middleware/validateZodMiddleware';
import { getUserBodyLoginSchema, getUserBodySignUpSchema } from '@shared/schemas/user_zodSchema';
import passport from 'passport';


const router: Router = express.Router();

const authController = new AuthController();

router.use((req, res, next) => {
  console.log(`router auth service received: ${req.method} ${req.url}`);
  next();
});
router.get('/health', (req, res) => {
  res.json({ status: 'ok banget', service: 'auth-service' });
});

router.post("/login", validate(getUserBodyLoginSchema), authController.login);
router.post("/signup", validate(getUserBodySignUpSchema), authController.signup);

// router.post("/refresh", controller.refresh);
// router.post("/sendOTP", controller.sendOTP);

const oauthController = new OAuthController();

router.get("/google", passport.authenticate('google', { scope : ['profile', 'email']}));
router.get("/google/callback", passport.authenticate('google', { 
        session: false,
        failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth_failed`
    }), oauthController.googleCallback);





export {router};