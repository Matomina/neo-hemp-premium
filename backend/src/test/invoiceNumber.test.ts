import { describe, it, expect, vi } from 'vitest';
import { mockPrisma } from './mockPrisma';

vi.mock('../config/prisma', () => ({ prisma: mockPrisma }));

describe('Invoice number sequence', () => {
  it('génère un numéro transactionnel basé sur une séquence unique', async () => {
    mockPrisma.invoiceSequence.upsert.mockResolvedValueOnce({ value: 12 });
    const { generateInvoiceNumber } = await import('../services/invoiceNumber/invoiceNumberService');

    const invoiceNumber = await generateInvoiceNumber('F');

    expect(invoiceNumber).toBe('FAC-2026-0012');
    expect(mockPrisma.invoiceSequence.upsert).toHaveBeenCalledWith({
      where: { scope: 'FAC-2026' },
      create: { scope: 'FAC-2026', value: 1 },
      update: { value: { increment: 1 } },
      select: { value: true },
    });
  });
});
