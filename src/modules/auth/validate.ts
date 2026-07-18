import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { AppError } from '../../middlewares/errorHandler';   // fixed import

export const validate = (schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const result = schema.safeParse(req[source]);
        if (!result.success) {
            const errors = result.error.flatten().fieldErrors;
            const message = Object.values(errors).flat().join(', ');
            return next(new AppError(400, message, 'VALIDATION_ERROR'));   // use next, not throw
        }
        req[source] = result.data;
        next();
    };
};