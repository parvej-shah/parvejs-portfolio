import { revalidateTag } from "next/cache";
import * as sectionRepo from "@/lib/data/sectionRepo";
import { getSectionSchema, type SectionKey } from "@/lib/validators/section";

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
export async function updateSectionContent(key: SectionKey, data: unknown) {
  const parsed = getSectionSchema(key).parse(data);
  const section = await sectionRepo.upsertSection(key, parsed);
  revalidateTag("sections", "max");
  return getSectionSchema(key).parse(section.data);
}
