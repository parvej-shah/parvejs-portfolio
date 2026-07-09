import { z } from "zod";
import { assetSchema } from "./asset";

export const statusSchema = z.enum(["DRAFT", "PUBLISHED"]);

export const projectSchema = z.object({
  id: z.string(),
  slug: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().min(1),
  status: statusSchema.default("DRAFT"),

  problem: z.string().nullable().optional(),
  approach: z.string().nullable().optional(),
  solution: z.string().nullable().optional(),
  results: z.string().nullable().optional(),

  client: z.string().nullable().optional(),
  role: z.string().nullable().optional(),
  timeline: z.string().nullable().optional(),
  techStack: z.array(z.string()).default([]),
  keyFeatures: z.array(z.string()).default([]),
  liveUrl: z.preprocess((v) => (v === "" ? null : v), z.string().url().nullable().optional()),
  githubUrl: z.preprocess((v) => (v === "" ? null : v), z.string().url().nullable().optional()),

  // Gallery is managed via /api/upload and /api/assets/[id], not written through PATCH.
  gallery: z.array(assetSchema).default([]),

  order: z.number().int().default(0),
  featured: z.boolean().default(false),

  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createProjectSchema = projectSchema.omit({
  id: true,
  gallery: true,
  createdAt: true,
  updatedAt: true,
});

export const updateProjectSchema = createProjectSchema.partial();
