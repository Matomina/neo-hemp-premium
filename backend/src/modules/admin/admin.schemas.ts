import { z } from 'zod';

export const OrderStatusUpdateSchema = z.object({
  status: z.enum(['DRAFT', 'PENDING', 'CONFIRMED', 'CANCELLED', 'REFUNDED']),
});

export const CertificateUpdateSchema = z.object({
  status: z.enum(['PENDING', 'VALIDATED', 'EXPIRED', 'REJECTED']).optional(),
  labName: z.string().optional(),
  testedAt: z.string().datetime().optional(),
  thcRate: z.string().optional(),
  cbdRate: z.string().optional(),
});
