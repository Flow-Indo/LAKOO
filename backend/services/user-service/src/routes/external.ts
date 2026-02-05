import {Router,  type Request, type Response} from 'express';
import { UserController } from '@src/controllers/user_controller.js';
import {  getUserBodyLoginSchema } from '@shared/schemas/user_zodSchema.js';
import { validate } from '@shared/middleware/validateZodMiddleware.js';

const externalRouter = Router();

const controller = new UserController();


externalRouter.get("/:identifier", controller.findUser);
externalRouter.post("/verify", validate(getUserBodyLoginSchema), controller.verifyUser);


export {externalRouter};