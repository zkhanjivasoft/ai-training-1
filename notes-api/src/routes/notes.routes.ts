import { Router } from 'express';
import { notesService } from '../services/notes.service.js';

export const notesRouter = Router();

notesRouter.get('/', (_req, res) => {
  res.json(notesService.list());
});
