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
