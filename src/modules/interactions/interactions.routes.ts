import { Router } from 'express';
import { authenticate } from '../../middlewares/auth';
import { getDb } from '../../lib/mongodb';
import { ObjectId } from 'mongodb';

const router = Router();

router.post('/', authenticate, async (req, res, next) => {
    try {
        const { planId, action } = req.body;
        if (!planId || !['view', 'save', 'like'].includes(action)) {
            return res.status(400).json({ success: false, error: { message: 'Invalid planId or action' } });
        }
        const db = await getDb();
        await db.collection('interactions').insertOne({
            userId: new ObjectId((req as any).userId),
            planId: new ObjectId(planId),
            action,
            timestamp: new Date(),
        });
        res.status(201).json({ success: true, message: 'Interaction logged' });
    } catch (error) {
        next(error);
    }
});

export default router;