import { Router } from 'express';
import { explore, getPlan, createPlan, updatePlan, deletePlan, managePlans, addReview, getReviews } from './plans.controller';
import { authenticate } from '../../middlewares/auth';
import { validate } from '../../middlewares/validate';
import { createPlanSchema, updatePlanSchema, reviewSchema, planQuerySchema } from './plans.schema';

const router = Router();

// Public explore (no auth)
router.get('/', validate(planQuerySchema, 'query'), explore);

// Protected manage (must be before /:id)
router.get('/manage', authenticate, managePlans);

// Public details
router.get('/:id', getPlan);
router.get('/:id/reviews', getReviews);

// Protected CRUD
router.post('/', authenticate, validate(createPlanSchema), createPlan);
router.put('/:id', authenticate, validate(updatePlanSchema), updatePlan);
router.delete('/:id', authenticate, deletePlan);
router.post('/:id/reviews', authenticate, validate(reviewSchema), addReview);

export default router;