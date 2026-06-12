import cors from 'cors';
import { ENV } from './env';

export const corsMiddleware = cors({
  origin: (origin, cb) => {
    if (!origin || ENV.FRONTEND_ORIGINS.includes(origin)) return cb(null, true);
    cb(new Error(`Origin ${origin} not allowed`));
  },
  credentials: true,
});
