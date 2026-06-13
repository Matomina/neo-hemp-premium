import type { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { LoginSchema, RegisterSchema } from './auth.schemas';
import { login, register, getUserById } from './auth.service';
import { ENV } from '../../config/env';

export const registerHandler: RequestHandler = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = RegisterSchema.parse(req.body);
    const { token, user } = await register(email, password, firstName, lastName);
    res.status(201).json({ token, user });
  } catch (err) { next(err); }
};

export const loginHandler: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = LoginSchema.parse(req.body);
    const { token, user } = await login(email, password);
    res.json({ token, user });
  } catch (err) { next(err); }
};

export const logoutHandler: RequestHandler = (_req, res) => {
  res.json({ success: true });
};

export const meHandler: RequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Non autorisé' });
      return;
    }
    const token = authHeader.slice(7);
    const payload = jwt.verify(token, ENV.JWT_SECRET) as { sub: string };
    const user = await getUserById(payload.sub);
    if (!user) { res.status(401).json({ error: 'Utilisateur introuvable' }); return; }
    res.json(user);
  } catch (err) { next(err); }
};
