import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export function signAccessToken(payload: { userId: string; email: string }): string {
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: '15m' });
}

export function signRefreshToken(payload: { userId: string }): string {
    return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
}

export function verifyAccessToken(token: string): { userId: string; email: string } {
    return jwt.verify(token, env.JWT_ACCESS_SECRET) as { userId: string; email: string };
}

export function verifyRefreshToken(token: string): { userId: string } {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: string };
}