import { z } from 'zod';

export const findUserSchema = z.object({
    phoneNumber: z.string().optional(),
    userId: z.string().optional(),
    googleId: z.string().optional(),
    email: z.string().email().optional()
}).refine(
    (data) => data.phoneNumber || data.userId || data.googleId || data.email, 
    {
        message: 'Either phone number or userId or googleId must be provided',
        path: ['identifier']
    }
).refine(
  (data) => !(data.phoneNumber && data.userId || data.phoneNumber && data.googleId || data.phoneNumber && data.email || data.userId && data.googleId || data.userId && data.email || data.googleId && data.email),
  {
    message: 'Provide only one identifier: phoneNumber OR userId OR googleId OR email',
    path: ['identifier']
  }
);


// req body validation
export const getUserBodyLoginSchema = z.object({
    phoneNumber: z.string()
        .min(10, "Phone number must be at least 10 digits"),
    password: z.string()
        
})

export const getUserBodySignUpSchema = z.object({
    phoneNumber: z.string()
        .min(10, "Phone number must be at least 10 digits").optional(),
    email: z.string().email().optional(),
    googleId: z.string().optional(),
    firstName: z.string().optional(),
    lastName: z.string().optional(),   
    password: z.string().optional(),
})



// export type GetUserParams = z.infer<typeof getUserParamsSchema>;
// export type GetUserBodyLogin = z.infer<typeof getUserBodyLoginSchema>;
//infer creates a ts type from the schema
// Equivalent to:
// type GetUserParams = {
//     phoneNumber: string;
// }