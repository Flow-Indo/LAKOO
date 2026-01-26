import { type Request, type Response, type NextFunction } from 'express';
import { z, ZodError} from 'zod';


export const validate = (schema: z.ZodObject<any>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({ //validate all at once
                params: req.params,
                body: req.body,
                query: req.query,
            });

            next()
        } catch(error) {
            if (error instanceof ZodError) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Validation failed',
                    errors: error.issues.map(issue => ({
                        field: issue.path.join('.'),
                        message: issue.message
                    }))
                });
            }

            next(error)
        }
    }
}