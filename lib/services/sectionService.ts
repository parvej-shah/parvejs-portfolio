import { revalidateTag } from "next/cache";
import * as sectionRepo from "@/lib/data/sectionRepo";
import * as auditRepo from "@/lib/data/auditRepo";
import { getSectionSchema, type SectionKey } from "@/lib/validators/section";
import type { MutationContext } from "@/lib/services/mutationContext";

export class SectionNotFoundError extends Error {
  constructor(key: SectionKey) {
    super(`Section not found: ${key}`);
    this.name = "SectionNotFoundError";
  }
}

export async function getSectionContent(key: SectionKey) {
  const section = await sectionRepo.findSectionByKey(key);
  if (!section) throw new SectionNotFoundError(key);
  return getSectionSchema(key).parse(section.data);
}

// Strategy pattern: validate against the schema registered for this specific key.
export async function updateSectionContent(
  key: SectionKey,
  data: unknown,
  context: MutationContext
) {
  const parsed = getSectionSchema(key).parse(data);
  const current = await sectionRepo.findSectionByKey(key);
  const section = await auditRepo.runAuditedMutation(
    context,
    {
      action: "UPDATE_SECTION",
      targetType: "SITE_CONTENT",
      targetId: key,
      before: current?.data,
    },
    (tx) => sectionRepo.upsertSection(key, parsed, tx),
    () => key
  );
  revalidateTag("sections", "max");
  return getSectionSchema(key).parse(section.data);
}
