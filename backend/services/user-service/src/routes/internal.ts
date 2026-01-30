import { UserController } from "@src/controllers/user_controller";
import { Router, type Router as RouterType } from "express";
import { getUserBodyLoginSchema, getUserBodySignInSchema } from "@shared/schemas/user_zodSchema";
import { validate } from '@shared/middleware/validateZodMiddleware';



const internalRouter: RouterType = Router();
const controller = new UserController();

internalRouter.post("/create", validate(getUserBodySignInSchema), controller.createUser);
internalRouter.post("/verify", validate(getUserBodyLoginSchema), controller.verifyUser);



export {internalRouter};