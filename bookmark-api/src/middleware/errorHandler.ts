import type { NextFunction, Request, Response } from 'express';
import { HttpError } from '../lib/errors.js';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  if (err instanceof HttpError) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }
  // express.json()'s body-parser also throws on malformed request bodies, via a plain
  // Error carrying its own statusCode and an `expose` flag rather than HttpError.
  // Only forward the message when the error is both a 4xx AND explicitly marked safe
  // to show (`expose`) — a 5xx from some other library landing here must never leak
  // its message to the client, even if it happens to carry a numeric statusCode.
  if (
    err instanceof Error &&
    'statusCode' in err &&
    typeof err.statusCode === 'number' &&
    err.statusCode < 500 &&
    'expose' in err &&
    err.expose === true
  ) {
    res.status(err.statusCode).json({ error: err.message });
    return;
  }
  console.error('unhandled error', err);
  res.status(500).json({ error: 'Internal Server Error' });
}
