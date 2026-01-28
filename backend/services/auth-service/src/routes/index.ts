import express, {type Router} from 'express';
import {AuthController }from '@src/controllers/auth.controller'
import { validate } from '@shared/middleware/validateZodMiddleware';
import { getUserBodyLoginSchema, getUserBodySignUpSchema, getUserParamsSchema } from '@shared/schemas/user_zodSchema';


const router: Router = express.Router();

const controller = new AuthController();


router.post("/login", validate(getUserBodyLoginSchema), controller.login);
router.post("/signup", validate(getUserBodySignUpSchema), controller.signup);
// router.post("/refresh", controller.refresh);
// router.post("/sendOTP", controller.sendOTP);




export {router};