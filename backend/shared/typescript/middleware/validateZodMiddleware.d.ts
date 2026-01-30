import { type Request, type Response, type NextFunction } from 'express';
import { z } from 'zod';
export declare const validate: (schema: z.ZodObject<any>) => (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
//# sourceMappingURL=validateZodMiddleware.d.ts.map