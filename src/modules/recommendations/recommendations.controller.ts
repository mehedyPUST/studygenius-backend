import { Request, Response, NextFunction } from 'express';
import * as recService from './recommendations.service';

export async function getRecommendations(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as any).userId;
        const items = await recService.getRecommendationsForUser(userId);
        res.json({ success: true, data: items });
    } catch (error) {
        next(error);
    }
}

export async function submitFeedback(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as any).userId;
        const { title, liked } = req.body;
        if (!title || typeof liked !== 'boolean') {
            return res.status(400).json({ success: false, error: { message: 'title and liked (boolean) are required' } });
        }
        await recService.submitFeedback(userId, title, liked);
        res.json({ success: true, message: 'Feedback recorded' });
    } catch (error) {
        next(error);
    }
}