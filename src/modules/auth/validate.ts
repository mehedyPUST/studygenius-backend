import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { AppError } from '../../../src/middlewares/errorHandler';

export const validate = (schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const result = schema.safeParse(req[source]);
        if (!result.success) {
            const errors = result.error.flatten().fieldErrors;
            const message = Object.values(errors).flat().join(', ');
            throw new AppError(400, message, 'VALIDATION_ERROR');
        }
        // Replace with parsed data (if needed)
        req[source] = result.data;
        next();
    };
};