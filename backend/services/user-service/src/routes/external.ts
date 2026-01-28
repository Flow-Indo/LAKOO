import {Router,  type Request, type Response} from 'express';
import { UserController } from '@src/controllers/user_controller';
import { getUserParamsSchema, getUserBodyLoginSchema, getUserBodySignUpSchema } from '@shared/schemas/user_zodSchema';
import { validate } from '@shared/middleware/validateZodMiddleware';

const externalRouter = Router();

const controller = new UserController();


externalRouter.get("/", validate(getUserParamsSchema), controller.findUser);
externalRouter.post("/verify", validate(getUserBodyLoginSchema), controller.verifyUser);


export {externalRouter};