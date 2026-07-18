import express from 'express';
import cors from 'cors';
import authRoutes from './modules/auth/auth.routes';
import plansRoutes from './modules/plans/plans.routes';
import profileRoutes from './modules/profile/profile.routes';
import recommendationRoutes from './modules/recommendations/recommendations.routes';
import interactionRoutes from './modules/interactions/interactions.routes';
import aiRoutes from './modules/ai/ai.routes';
import { errorHandler } from './middlewares/errorHandler';

export function createApp() {
  const app = express();
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());

  app.get('/api/health', (_req, res) => res.json({ success: true, message: 'StudyGenius API is running' }));

  // Modular routes
  app.use('/api/auth', authRoutes);
  app.use('/api/plans', plansRoutes);
  app.use('/api/profile', profileRoutes);
  app.use('/api/recommendations', recommendationRoutes);
  app.use('/api/interactions', interactionRoutes);
  app.use('/api/ai', aiRoutes);

  // Global Error Handler
  app.use(errorHandler);

  return app;
}
