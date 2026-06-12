import { z } from 'zod';

export const QuoteItemSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().int().min(1),
  unitCents: z.number().int().min(0),
  totalCents: z.number().int().min(0),
});

export const CreateQuoteSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().optional(),
  clientMessage: z.string().optional(),
  simulatorPayload: z.record(z.unknown()).optional(),
  items: z.array(QuoteItemSchema).min(1),
  shippingCents: z.number().int().min(0).default(0),
  taxCents: z.number().int().min(0).default(0),
});

export const AdminUpdateQuoteSchema = z.object({
  adminNotes: z.string().optional(),
  totalCents: z.number().int().min(0).optional(),
  shippingCents: z.number().int().min(0).optional(),
  taxCents: z.number().int().min(0).optional(),
  status: z.enum(['NEW', 'REVIEWED', 'APPROVED', 'PAYMENT_SENT', 'PAID', 'CANCELLED', 'EXPIRED']).optional(),
});

export type CreateQuoteInput = z.infer<typeof CreateQuoteSchema>;
export type AdminUpdateQuoteInput = z.infer<typeof AdminUpdateQuoteSchema>;
