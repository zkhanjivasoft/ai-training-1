import { Router } from 'express';
import { notesService } from '../services/notes.service.js';

export const notesRouter = Router();

notesRouter.get('/', (_req, res) => {
  res.json(notesService.list());
});

notesRouter.get('/:id', (req, res) => {
  const note = notesService.getById(req.params.id);
  if (!note) {
    res.status(404).json({ error: 'note not found' });
    return;
  }
  res.json(note);
});
