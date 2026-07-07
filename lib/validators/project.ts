import { z } from "zod";

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

  order: z.number().int().default(0),
  featured: z.boolean().default(false),

  createdAt: z.date(),
  updatedAt: z.date(),
});

export const createProjectSchema = projectSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const updateProjectSchema = createProjectSchema.partial();
