import { z } from 'zod';

//req params validation
export const getUserParamsSchema = z.object({
    phoneNumber: z.string()
        .min(10, "Phone number must be at least 10 digits")
        //FIX: maybe regex for phone number format later
})

// req body validation
export const getUserBodyLoginSchema = z.object({
    phoneNumber: z.string()
        .min(10, "Phone number must be at least 10 digits"),
    password: z.string()
        
})

export const getUserBodySignUpSchema = z.object({
    phoneNumber: z.string()
        .min(10, "Phone number must be at least 10 digits"),
    firstName: z.string(),
    lastName: z.string(),   
    password: z.string(),
})



// export type GetUserParams = z.infer<typeof getUserParamsSchema>;
// export type GetUserBodyLogin = z.infer<typeof getUserBodyLoginSchema>;
//infer creates a ts type from the schema
// Equivalent to:
// type GetUserParams = {
//     phoneNumber: string;
// }