import { z } from 'zod';
export declare const getUserParamsSchema: z.ZodObject<{
    params: z.ZodObject<{
        phoneNumber: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const getUserBodyLoginSchema: z.ZodObject<{
    body: z.ZodObject<{
        phoneNumber: z.ZodString;
        password: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
export declare const getUserBodySignInSchema: z.ZodObject<{
    body: z.ZodObject<{
        phoneNumber: z.ZodString;
        firstName: z.ZodString;
        lastName: z.ZodString;
        password: z.ZodString;
    }, z.core.$strip>;
}, z.core.$strip>;
//# sourceMappingURL=user_zodSchema.d.ts.map