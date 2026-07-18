import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { AppError } from './errorHandler';

export const validate = (schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const result = schema.safeParse(req[source]);
        if (!result.success) {
            const errors = result.error.flatten().fieldErrors;
            const message = Object.values(errors).flat().join(', ');
            return next(new AppError(400, message, 'VALIDATION_ERROR'));
        }

        if (source === 'body') {
            req.body = result.data;
        } else if (source === 'query') {
            (req as any).parsedQuery = result.data;
        } else if (source === 'params') {
            // Cast to Record<string, string> because Express params are always strings
            req.params = result.data as Record<string, string>;
        }

        next();
    };
};