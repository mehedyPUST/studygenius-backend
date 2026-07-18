import { Request, Response, NextFunction } from 'express';
import * as authService from './auth.service';

export async function register(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await authService.registerUser(req.body);
        res.status(201).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await authService.loginUser(req.body);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

export async function googleAuth(req: Request, res: Response, next: NextFunction) {
    try {
        const result = await authService.googleAuth(req.body.idToken);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(400).json({ success: false, error: { message: 'Refresh token required' } });
        const result = await authService.refreshAccessToken(refreshToken);
        res.json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

export async function demoLogin(_req: Request, res: Response, next: NextFunction) {
    try {
        const credentials = await authService.getDemoCredentials();
        res.json({ success: true, data: credentials });
    } catch (error) {
        next(error);
    }
}