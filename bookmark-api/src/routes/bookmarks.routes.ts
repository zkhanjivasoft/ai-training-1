import { Router } from 'express';
import { bookmarksService } from '../services/bookmarks.service.js';

export const bookmarksRouter = Router();

bookmarksRouter.post('/', (req, res) => {
  const bookmark = bookmarksService.create(req.body);
  res.status(201).json(bookmark);
});

bookmarksRouter.get('/', (req, res) => {
  const tag = typeof req.query.tag === 'string' ? req.query.tag : undefined;
  res.json(bookmarksService.list(tag));
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
