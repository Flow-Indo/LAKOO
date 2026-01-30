"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserBodySignInSchema = exports.getUserBodyLoginSchema = exports.getUserParamsSchema = void 0;
const zod_1 = require("zod");
//req params validation
exports.getUserParamsSchema = zod_1.z.object({
    params: zod_1.z.object({
        phoneNumber: zod_1.z.string()
            .min(10, "Phone number must be at least 10 digits")
        //FIX: maybe regex for phone number format later
    })
});
// req body validation
exports.getUserBodyLoginSchema = zod_1.z.object({
    body: zod_1.z.object({
        phoneNumber: zod_1.z.string()
            .min(10, "Phone number must be at least 10 digits"),
        password: zod_1.z.string(),
    })
});
exports.getUserBodySignInSchema = zod_1.z.object({
    body: zod_1.z.object({
        phoneNumber: zod_1.z.string()
            .min(10, "Phone number must be at least 10 digits"),
        firstName: zod_1.z.string(),
        lastName: zod_1.z.string(),
        password: zod_1.z.string(),
    })
});
// export type GetUserParams = z.infer<typeof getUserParamsSchema>;
// export type GetUserBodyLogin = z.infer<typeof getUserBodyLoginSchema>;
//infer creates a ts type from the schema
// Equivalent to:
// type GetUserParams = {
//     phoneNumber: string;
// }
//# sourceMappingURL=user_zodSchema.js.map