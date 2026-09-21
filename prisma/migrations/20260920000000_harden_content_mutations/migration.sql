-- AlterEnum
ALTER TYPE "Status" ADD VALUE 'ARCHIVED';

-- CreateEnum
CREATE TYPE "AuditActorType" AS ENUM ('ADMIN', 'MCP_CLIENT', 'SYSTEM');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN "version" INTEGER NOT NULL DEFAULT 1;
ALTER TABLE "Project" ADD COLUMN "version" INTEGER NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "actorType" "AuditActorType" NOT NULL,
    "clientId" TEXT,
    "toolName" TEXT,
    "action" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "requestId" TEXT NOT NULL,
    "before" JSONB,
    "after" JSONB,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AuditLog_requestId_key" ON "AuditLog"("requestId");
CREATE INDEX "AuditLog_targetType_targetId_createdAt_idx" ON "AuditLog"("targetType", "targetId", "createdAt");
CREATE INDEX "AuditLog_actorId_createdAt_idx" ON "AuditLog"("actorId", "createdAt");
