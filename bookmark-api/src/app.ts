import express from 'express';
import { healthRouter } from './routes/health.routes.js';
import { bookmarksRouter } from './routes/bookmarks.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/health', healthRouter);
  app.use('/bookmarks', bookmarksRouter);
  app.use(errorHandler);
  return app;
}
