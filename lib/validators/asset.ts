import { z } from "zod";

export const assetSchema = z.object({
  id: z.string(),
  key: z.string().min(1),
  url: z.string().url(),
  alt: z.string().nullable().optional(),
  width: z.number().int().positive().nullable().optional(),
  height: z.number().int().positive().nullable().optional(),
  projectId: z.string().nullable().optional(),
  // API responses serialize Date as an ISO string; coerce so client-side parsing accepts it.
  createdAt: z.coerce.date(),
});

export const createAssetSchema = assetSchema.omit({ id: true, createdAt: true });

export const updateAssetSchema = createAssetSchema.partial();
