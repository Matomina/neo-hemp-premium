import type { ErrorRequestHandler } from 'express';
import { ZodError } from 'zod';
import { logger } from '../utils/logger';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: ErrorRequestHandler = (err, _req, res, __next) => {
  if (err instanceof ZodError) {
    res.status(400).json({ error: 'Validation error', details: err.flatten() });
    return;
  }
  logger.error(err);
  const status = (err as { status?: number }).status ?? 500;
  const message = status < 500 ? err.message : 'Internal server error';
  res.status(status).json({ error: message });
};
