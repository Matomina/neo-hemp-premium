import jwt from 'jsonwebtoken';
import { prisma } from '../../config/prisma';
import { ENV } from '../../config/env';
import { hashPassword, verifyPassword } from '../../utils/password';

export async function register(email: string, password: string, firstName?: string, lastName?: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw Object.assign(new Error('Email already registered'), { status: 409 });
  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({ data: { email, passwordHash, firstName, lastName } });
  return signToken(user.id, user.role);
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user?.passwordHash) throw Object.assign(new Error('Invalid credentials'), { status: 401 });
  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) throw Object.assign(new Error('Invalid credentials'), { status: 401 });
  return signToken(user.id, user.role);
}

function signToken(userId: string, role: string) {
  return jwt.sign({ sub: userId, role }, ENV.JWT_SECRET, { expiresIn: '7d' });
}
