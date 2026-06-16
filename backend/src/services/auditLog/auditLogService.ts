import { Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma';

interface LogEntry {
  actorId?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}

export async function logAudit(entry: LogEntry): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: entry.actorId,
        action: entry.action,
        entityType: entry.entityType,
        entity: entry.entityType,
        entityId: entry.entityId,
        metadata: (entry.metadata ?? {}) as Prisma.InputJsonValue,
      },
    });
  } catch {
    // Audit log failure must never break the main flow
  }
}
