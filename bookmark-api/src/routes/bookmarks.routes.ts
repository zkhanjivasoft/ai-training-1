import { Router } from 'express';
import { bookmarksService } from '../services/bookmarks.service.js';

export const bookmarksRouter = Router();

bookmarksRouter.post('/', (req, res) => {
  const bookmark = bookmarksService.create(req.body);
  res.status(201).json(bookmark);
});
