import { Router } from 'express';
import { loginHandler, logoutHandler, meHandler, registerHandler } from './auth.controller';
import { authRateLimit } from '../../middlewares/rateLimit';

const router = Router();
router.post('/register', authRateLimit, registerHandler);
router.post('/login', authRateLimit, loginHandler);
router.post('/logout', logoutHandler);
router.get('/me', meHandler);
export default router;
