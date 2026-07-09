import { z } from "zod";
import { statusSchema } from "./project";

export const postSchema = z.object({
  id: z.string(),
  slug: z.string().min(1),
  title: z.string().min(1),
  excerpt: z.string().min(1),
  content: z.string().min(1),
  status: statusSchema.default("DRAFT"),
  featured: z.boolean().default(false),
  coverImageId: z.string().nullable().optional(),

  publishedAt: z.coerce.date().nullable().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const createPostSchema = postSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updatePostSchema = createPostSchema.partial();
