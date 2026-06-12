import { z } from 'zod';
export const CertificateCreateSchema = z.object({
  productId: z.string().optional(),
  lot: z.string().min(1),
  fileUrl: z.string().url(),
  labName: z.string().optional(),
  testedAt: z.string().datetime().optional(),
  thcRate: z.string().optional(),
  cbdRate: z.string().optional(),
});
