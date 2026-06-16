import { z } from 'zod';

export const DraftOrderSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number().positive(),
    quantity: z.number().int().positive(),
  })).min(1),
  customerEmail: z.string().email(),
  customerName: z.string().min(2),
  customerPhone: z.string().optional(),
  addressLine1: z.string().min(5),
  addressLine2: z.string().optional(),
  postalCode: z.string().min(2),
  city: z.string().min(1),
  country: z.string().min(2),
  adultConfirmed: z.literal(true, { errorMap: () => ({ message: 'Vous devez confirmer être majeur' }) }),
  termsAccepted: z.literal(true, { errorMap: () => ({ message: 'Vous devez accepter les CGV' }) }),
});
