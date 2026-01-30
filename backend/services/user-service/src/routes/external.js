"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.externalRouter = void 0;
const express_1 = require("express");
const user_controller_1 = require("@src/controllers/user_controller");
const user_zodSchema_1 = require("@shared/schemas/user_zodSchema");
const validateZodMiddleware_1 = require("@shared/middleware/validateZodMiddleware");
const externalRouter = (0, express_1.Router)();
exports.externalRouter = externalRouter;
const controller = new user_controller_1.UserController();
externalRouter.get("/:phoneNumber", (0, validateZodMiddleware_1.validate)(user_zodSchema_1.getUserParamsSchema), controller.findUser);
externalRouter.post("/verify", (0, validateZodMiddleware_1.validate)(user_zodSchema_1.getUserBodyLoginSchema), controller.verifyUser);
//# sourceMappingURL=external.js.map