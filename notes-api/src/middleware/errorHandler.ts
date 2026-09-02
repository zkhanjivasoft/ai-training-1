import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../lib/errors.js';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }
  // express.json()'s body-parser also throws on malformed request bodies,
  // via a plain Error carrying its own statusCode (e.g. 400) rather than HttpError.
  if (err instanceof Error && 'statusCode' in err && typeof err.statusCode === 'number') {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }
  console.error('unhandled error', err);
  res.status(500).json({ error: 'Internal Server Error' });
}
