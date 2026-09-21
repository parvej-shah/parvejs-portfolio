import { randomUUID } from "node:crypto";

export type MutationActorType = "ADMIN" | "MCP_CLIENT" | "SYSTEM";

export type MutationContext = {
  actorId: string;
  actorType: MutationActorType;
  requestId: string;
  clientId?: string;
  toolName?: string;
};

export function createAdminMutationContext(actorId: string): MutationContext {
  return {
    actorId,
    actorType: "ADMIN",
    requestId: randomUUID(),
  };
}

export function createSystemMutationContext(actorId: string): MutationContext {
  return {
    actorId,
    actorType: "SYSTEM",
    requestId: randomUUID(),
  };
}
