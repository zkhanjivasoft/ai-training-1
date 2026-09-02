import express from 'express';
import { notesRouter } from './routes/notes.routes.js';

export function createApp() {
  const app = express();
  app.use(express.json());
  app.use('/notes', notesRouter);
  return app;
}
