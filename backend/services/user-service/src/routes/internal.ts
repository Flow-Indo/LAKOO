import { UserController } from "@src/controllers/user_controller";
import { Router } from "express";
import { getUserBodySignUpSchema } from "@shared/schemas/user_zodSchema";
import { validate } from '@shared/middleware/validateZodMiddleware';



const internalRouter = Router();
const controller = new UserController();

internalRouter.post("/create", validate(getUserBodySignUpSchema), controller.createUser);



export {internalRouter};