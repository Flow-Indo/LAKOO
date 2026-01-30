"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = void 0;
const zod_1 = require("zod");
const validate = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync({
                params: req.params,
                body: req.body,
                query: req.query,
            });
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Validation failed',
                    errors: error.issues.map(issue => ({
                        field: issue.path.join('.'),
                        message: issue.message
                    }))
                });
            }
            next(error);
        }
    };
};
exports.validate = validate;
//# sourceMappingURL=validateZodMiddleware.js.map