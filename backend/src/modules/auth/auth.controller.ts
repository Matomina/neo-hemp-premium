import type { RequestHandler } from 'express';
import { LoginSchema, RegisterSchema } from './auth.schemas';
import { login, register } from './auth.service';

export const registerHandler: RequestHandler = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = RegisterSchema.parse(req.body);
    const token = await register(email, password, firstName, lastName);
    res.status(201).json({ token });
  } catch (err) { next(err); }
};

export const loginHandler: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = LoginSchema.parse(req.body);
    const token = await login(email, password);
    res.json({ token });
  } catch (err) { next(err); }
};

export const logoutHandler: RequestHandler = (_req, res) => {
  res.json({ success: true });
};
