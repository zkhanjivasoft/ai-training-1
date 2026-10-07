import { Router } from 'express';
import { notesService, ValidationError } from '../services/notes.service.js';

export const notesRouter = Router();

notesRouter.post('/', (req, res) => {
  try {
    const note = notesService.create(req.body ?? {});
    res.status(201).json(note);
  } catch (err) {
    if (err instanceof ValidationError) {
      res.status(400).json({ error: err.message });
      return;
    }
    throw err;
  }
});

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
