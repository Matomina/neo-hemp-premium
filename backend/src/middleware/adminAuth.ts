import type { Request, Response, NextFunction, RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { ENV } from '../config/env';

export interface AdminTokenPayload {
  sub: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      adminUser?: AdminTokenPayload;
    }
  }
}

export const requireAdmin: RequestHandler = (req: Request, res: Response, next: NextFunction): void => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Unauthorized — missing token' });
    return;
  }
  try {
    const payload = jwt.verify(auth.slice(7), ENV.JWT_SECRET) as AdminTokenPayload;
    if (payload.role !== 'ADMIN' && payload.role !== 'SUPER_ADMIN') {
      res.status(403).json({ error: 'Forbidden — admin role required' });
      return;
    }
    req.adminUser = payload;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};
