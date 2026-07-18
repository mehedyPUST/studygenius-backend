import { Router } from 'express';
import { generatePlanContent } from './ai.controller';
import { authenticate } from '../../middlewares/auth';
import { validate } from '../../middlewares/validate';
import { generatePlanContentSchema } from './ai.schema';
import rateLimit from 'express-rate-limit';

const router = Router();

// Rate limit AI generation (10 requests per hour per IP)
const aiLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10,
    message: { success: false, error: { message: 'Too many AI requests, please try again later' } },
});

router.post('/generate-plan-content', authenticate, aiLimiter, validate(generatePlanContentSchema), generatePlanContent);

export default router;