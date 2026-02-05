import { UserController } from "@src/controllers/user_controller.js";
import { Router } from "express";
import { getUserBodySignUpSchema } from "@shared/schemas/user_zodSchema.js";
import { validate } from '@shared/middleware/validateZodMiddleware.js';

const internalRouter = Router();
const controller = new UserController();

internalRouter.post("/create", validate(getUserBodySignUpSchema), controller.createUser);



export {internalRouter};