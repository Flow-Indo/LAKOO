"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.internalRouter = void 0;
const user_controller_1 = require("@src/controllers/user_controller");
const express_1 = require("express");
const user_zodSchema_1 = require("@shared/schemas/user_zodSchema");
const validateZodMiddleware_1 = require("@shared/middleware/validateZodMiddleware");
const internalRouter = (0, express_1.Router)();
exports.internalRouter = internalRouter;
const controller = new user_controller_1.UserController();
internalRouter.post("/create", (0, validateZodMiddleware_1.validate)(user_zodSchema_1.getUserBodySignInSchema), controller.createUser);
internalRouter.post("/verify", (0, validateZodMiddleware_1.validate)(user_zodSchema_1.getUserBodyLoginSchema), controller.verifyUser);
//# sourceMappingURL=internal.js.map