import { Request, Response, NextFunction } from 'express';
import * as plansService from './plans.service';
import { ObjectId } from 'mongodb';

export async function explore(req: Request, res: Response, next: NextFunction) {
    try {
        // Use parsed query from the validate middleware to avoid read-only errors
        const query = (req as any).parsedQuery || req.query;
        const result = await plansService.getPlans(query);
        res.json({ success: true, data: result.plans, pagination: result.pagination });
    } catch (error) {
        next(error);
    }
}

export async function getPlan(req: Request, res: Response, next: NextFunction) {
    try {
        const plan = await plansService.getPlanById(req.params.id);
        const related = await plansService.getRelatedPlans(req.params.id);
        res.json({ success: true, data: { plan, related } });
    } catch (error) {
        next(error);
    }
}

export async function createPlan(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as any).userId;
        const plan = await plansService.createPlan({ ...req.body, userId: new ObjectId(userId) });
        res.status(201).json({ success: true, data: plan });
    } catch (error) {
        next(error);
    }
}

export async function updatePlan(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as any).userId;
        const plan = await plansService.updatePlan(req.params.id, userId, req.body);
        res.json({ success: true, data: plan });
    } catch (error) {
        next(error);
    }
}

export async function deletePlan(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as any).userId;
        await plansService.deletePlan(req.params.id, userId);
        res.json({ success: true, message: 'Plan deleted' });
    } catch (error) {
        next(error);
    }
}

export async function managePlans(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as any).userId;
        const plans = await plansService.getUserPlans(userId);
        res.json({ success: true, data: plans });
    } catch (error) {
        next(error);
    }
}

export async function addReview(req: Request, res: Response, next: NextFunction) {
    try {
        const userId = (req as any).userId;
        const review = await plansService.addReview(req.params.id, userId, req.body);
        res.status(201).json({ success: true, data: review });
    } catch (error) {
        next(error);
    }
}

export async function getReviews(req: Request, res: Response, next: NextFunction) {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const result = await plansService.getPlanReviews(req.params.id, page, limit);
        res.json({ success: true, data: result.reviews, pagination: result.pagination });
    } catch (error) {
        next(error);
    }
}