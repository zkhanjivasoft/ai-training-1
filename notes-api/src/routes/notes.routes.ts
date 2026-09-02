import { Router } from 'express';
import { notesService } from '../services/notes.service.js';

export const notesRouter = Router();

notesRouter.get('/', (_req, res) => {
  res.json(notesService.list());
});

notesRouter.post('/', (req, res) => {
  const note = notesService.create(req.body);
  res.status(201).json(note);
});
