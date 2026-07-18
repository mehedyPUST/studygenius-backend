import { Router } from 'express';
import { register, login, googleAuth, refresh, demoLogin } from './auth.controller';
import { validate } from '../../middlewares/validate';
import { registerSchema, loginSchema, googleAuthSchema } from './auth.schema';
import rateLimit from 'express-rate-limit';

const router = Router();

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { success: false, error: { message: 'Too many attempts, please try again later' } },
});

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/google', authLimiter, validate(googleAuthSchema), googleAuth);
router.get('/demo', demoLogin);
router.post('/refresh', refresh);

export default router;