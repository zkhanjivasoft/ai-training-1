import { Router } from 'express';
import { notesService } from '../services/notes.service.js';

export const notesRouter = Router();

notesRouter.get('/', (req, res) => {
  const q = req.query.q as string | undefined;
  res.json(notesService.search(q));
});

notesRouter.get('/:id', (req, res) => {
  const note = notesService.getById(req.params.id);
  if (!note) {
    res.status(404).json({ error: 'note not found' });
    return;
  }
  res.json(note);
});
