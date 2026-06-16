import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';

export const requireAdmin: RequestHandler = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  try {
    const payload = jwt.verify(auth.slice(7), ENV.JWT_SECRET) as { role?: string };
    if (payload.role !== 'ADMIN') {
      res.status(403).json({ error: 'Forbidden' });
      return;
    }
    next();
  } catch {
    res.status(401).json({ error: 'Invalid token' });
  }
};
