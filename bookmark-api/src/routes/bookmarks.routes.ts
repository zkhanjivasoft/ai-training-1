import { Router } from 'express';
import { bookmarksService } from '../services/bookmarks.service.js';
import { ValidationError } from '../lib/errors.js';

export const bookmarksRouter = Router();

bookmarksRouter.post('/', (req, res) => {
  const bookmark = bookmarksService.create(req.body);
  res.status(201).json(bookmark);
});

bookmarksRouter.get('/', (req, res) => {
  // A repeated ?tag=a&tag=b parses to an array, not a string — reject it explicitly
  // rather than silently ignoring the filter and returning everything.
  if (req.query.tag !== undefined && typeof req.query.tag !== 'string') {
    throw new ValidationError('tag must be a single string value');
  }
  res.json(bookmarksService.list(req.query.tag));
});

bookmarksRouter.get('/:id', (req, res) => {
  res.json(bookmarksService.getById(req.params.id));
});

bookmarksRouter.patch('/:id', (req, res) => {
  res.json(bookmarksService.update(req.params.id, req.body));
});

bookmarksRouter.delete('/:id', (req, res) => {
  bookmarksService.remove(req.params.id);
  res.json({ deleted: true });
});
