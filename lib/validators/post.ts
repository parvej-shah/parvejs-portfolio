import { z } from "zod";
import { statusSchema } from "./project";
import { assetSchema } from "./asset";

export const postSchema = z.object({
  id: z.string(),
  slug: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  status: statusSchema.default("DRAFT"),
  featured: z.boolean().default(false),
  coverImageId: z.string().nullable().optional(),
  coverImage: assetSchema.nullable().optional(),

  publishedAt: z.coerce.date().nullable().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

// A scheduled post must carry a future go-live time so the cron/visibility filter has
// something to act on.
function hasFutureSchedule(data: { status?: string; publishedAt?: Date | null }) {
  return data.status !== "SCHEDULED" || (!!data.publishedAt && data.publishedAt > new Date());
}
const scheduleRuleOptions = {
  message: "Scheduled posts require a publish date in the future",
  path: ["publishedAt"] as string[],
};

export const createPostSchema = postSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    coverImage: true,
  })
  .refine(hasFutureSchedule, scheduleRuleOptions);

export const updatePostSchema = postSchema
  .omit({
    id: true,
    createdAt: true,
    updatedAt: true,
    coverImage: true,
  })
  .partial()
  .refine(hasFutureSchedule, scheduleRuleOptions);
