import {Router, type Router as RouterType, type Request, type Response} from 'express';
import { UserController } from '@src/controllers/user_controller';
import { getUserParamsSchema, getUserBodyLoginSchema, getUserBodySignInSchema } from '@shared/schemas/user_zodSchema';
import { validate } from '@shared/middleware/validateZodMiddleware';

const externalRouter: RouterType = Router();

const controller = new UserController();


externalRouter.get("/:phoneNumber", validate(getUserParamsSchema), controller.findUser);
externalRouter.post("/verify", validate(getUserBodyLoginSchema), controller.verifyUser);


export {externalRouter};