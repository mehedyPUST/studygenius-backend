import express from 'express';
import cors from 'cors';

export function createApp() {
  const app = express();
  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json());

  app.get('/api/health', (_req, res) => res.json({ success: true, message: 'StudyGenius API is running' }));

  return app;
}
