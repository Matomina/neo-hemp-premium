import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '../../../config/prisma';
import { ENV } from '../../../config/env';
import { logger } from '../../../utils/logger';
import { logAudit } from '../../../services/auditLog/auditLogService';
import { z } from 'zod';

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function adminLogin(req: Request, res: Response): Promise<void> {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: 'Invalid credentials format' });
    return;
  }

  const { email, password } = parsed.data;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  if (!user.isActive) {
    res.status(403).json({ error: 'Account disabled' });
    return;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    res.status(401).json({ error: 'Invalid credentials' });
    return;
  }

  const token = jwt.sign(
    { sub: user.id, email: user.email, role: user.role },
    ENV.JWT_SECRET,
    { expiresIn: ENV.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] },
  );

  await prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
  await logAudit({ actorId: user.id, action: 'ADMIN_LOGIN', entityType: 'User', entityId: user.id });

  logger.info(`[AUTH] Admin login: ${email}`);

  res.json({
    token,
    user: { id: user.id, email: user.email, role: user.role, name: user.name ?? user.firstName },
  });
}

export async function adminLogout(req: Request, res: Response): Promise<void> {
  // Stateless JWT — client drops the token
  if (req.adminUser) {
    await logAudit({ actorId: req.adminUser.sub, action: 'ADMIN_LOGOUT', entityType: 'User', entityId: req.adminUser.sub });
  }
  res.json({ ok: true });
}

export async function adminMe(req: Request, res: Response): Promise<void> {
  if (!req.adminUser) { res.status(401).json({ error: 'Unauthorized' }); return; }
  const user = await prisma.user.findUnique({ where: { id: req.adminUser.sub } });
  if (!user) { res.status(404).json({ error: 'User not found' }); return; }
  res.json({ id: user.id, email: user.email, role: user.role, name: user.name ?? user.firstName });
}
