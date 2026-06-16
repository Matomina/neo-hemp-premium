import jwt from 'jsonwebtoken';
import { prisma } from '../../config/prisma';
import { ENV } from '../../config/env';
import { hashPassword, verifyPassword } from '../../utils/password';

const USER_SELECT = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
} as const;

export async function register(email: string, password: string, firstName?: string, lastName?: string) {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw Object.assign(new Error('Cet email est déjà utilisé'), { status: 409 });
  const passwordHash = await hashPassword(password);
  const user = await prisma.user.create({
    data: { email, passwordHash, firstName, lastName },
    select: USER_SELECT,
  });
  return { token: signToken(user.id, user.role), user };
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user?.passwordHash) throw Object.assign(new Error('Identifiants incorrects'), { status: 401 });
  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) throw Object.assign(new Error('Identifiants incorrects'), { status: 401 });
  const safeUser = { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role };
  return { token: signToken(user.id, user.role), user: safeUser };
}

export async function getUserById(id: string) {
  return prisma.user.findUnique({ where: { id }, select: USER_SELECT });
}

function signToken(userId: string, role: string) {
  return jwt.sign({ sub: userId, role }, ENV.JWT_SECRET, { expiresIn: '7d' });
}
