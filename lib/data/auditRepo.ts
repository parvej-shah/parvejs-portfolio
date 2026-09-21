import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type { MutationContext } from "@/lib/services/mutationContext";

type DatabaseClient = Prisma.TransactionClient | typeof prisma;

type AuditEntry = {
  action: string;
  targetType: string;
  targetId: string;
  before?: unknown;
  after?: unknown;
  metadata?: unknown;
};

function jsonValue(value: unknown): Prisma.InputJsonValue | undefined {
  if (value === undefined || value === null) return undefined;
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

export function findAuditByRequestId(requestId: string) {
  return prisma.auditLog.findUnique({ where: { requestId } });
}

export function listAudits(limit: number) {
  return prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
  });
}

export function createAudit(
  context: MutationContext,
  entry: AuditEntry,
  db: DatabaseClient = prisma
) {
  return db.auditLog.create({
    data: {
      actorId: context.actorId,
      actorType: context.actorType,
      clientId: context.clientId,
      toolName: context.toolName,
      requestId: context.requestId,
      action: entry.action,
      targetType: entry.targetType,
      targetId: entry.targetId,
      before: jsonValue(entry.before),
      after: jsonValue(entry.after),
      metadata: jsonValue(entry.metadata),
    },
  });
}

export function runAuditedMutation<T>(
  context: MutationContext,
  entry: Omit<AuditEntry, "targetId" | "after"> & { targetId?: string },
  mutate: (tx: Prisma.TransactionClient) => Promise<T>,
  getTargetId: (result: T) => string
) {
  return prisma.$transaction(async (tx) => {
    const result = await mutate(tx);
    await createAudit(
      context,
      {
        ...entry,
        targetId: entry.targetId ?? getTargetId(result),
        after: result,
      },
      tx
    );
    return result;
  });
}
