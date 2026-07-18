import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { AppError } from './errorHandler';

export function authenticate(req: Request, _res: Response, next: NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new AppError(401, 'Authentication required', 'UNAUTHORIZED'));
    }

    const token = authHeader.split(' ')[1];
    try {
        const payload = verifyAccessToken(token);
        (req as any).userId = payload.userId;
        (req as any).userEmail = payload.email;
        next();
    } catch (error) {
        return next(new AppError(401, 'Invalid or expired access token', 'INVALID_TOKEN'));
    }
}