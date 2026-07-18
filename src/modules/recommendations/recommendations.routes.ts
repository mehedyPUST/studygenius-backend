import { Router } from 'express';
import { getRecommendations, submitFeedback } from './recommendations.controller';
import { authenticate } from '../../middlewares/auth';

const router = Router();

router.get('/', authenticate, getRecommendations);
router.post('/feedback', authenticate, submitFeedback);

export default router;