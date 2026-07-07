import { z } from "zod";

export const assetSchema = z.object({
  id: z.string(),
  key: z.string().min(1),
  url: z.string().url(),
  alt: z.string().nullable().optional(),
  width: z.number().int().positive().nullable().optional(),
  height: z.number().int().positive().nullable().optional(),
  projectId: z.string().nullable().optional(),
  createdAt: z.date(),
});

export const createAssetSchema = assetSchema.omit({ id: true, createdAt: true });

export const updateAssetSchema = createAssetSchema.partial();
