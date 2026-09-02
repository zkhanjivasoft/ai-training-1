import express from 'express';
import { notesRouter } from './routes/notes.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

export function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/notes', notesRouter);
  app.use(errorHandler);
  return app;
}
