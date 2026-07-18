import { Request, Response, NextFunction } from 'express';
import * as aiService from './ai.service';

export async function generatePlanContent(req: Request, res: Response, next: NextFunction) {
    try {
        const data = await aiService.generatePlanContent(req.body);
        res.json({ success: true, data });
    } catch (error) {
        next(error);
    }
}