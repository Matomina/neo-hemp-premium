import { prisma } from '../../config/prisma';
import type { z } from 'zod';
import type { ContactSchema } from './contact.schemas';

export async function saveContactMessage(data: z.infer<typeof ContactSchema>) {
  return prisma.contactMessage.create({ data });
}
