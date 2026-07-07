import { z } from "zod";
import {
  statusSchema,
  projectSchema,
  createProjectSchema,
  updateProjectSchema,
} from "./validators/project";
import { postSchema, createPostSchema, updatePostSchema } from "./validators/post";
import { assetSchema, createAssetSchema, updateAssetSchema } from "./validators/asset";
import { sectionSchemas, type SectionKey } from "./validators/section";

export type Status = z.infer<typeof statusSchema>;

export type Project = z.infer<typeof projectSchema>;
export type CreateProject = z.infer<typeof createProjectSchema>;
export type UpdateProject = z.infer<typeof updateProjectSchema>;

export type Post = z.infer<typeof postSchema>;
export type CreatePost = z.infer<typeof createPostSchema>;
export type UpdatePost = z.infer<typeof updatePostSchema>;

export type Asset = z.infer<typeof assetSchema>;
export type CreateAsset = z.infer<typeof createAssetSchema>;
export type UpdateAsset = z.infer<typeof updateAssetSchema>;

export type { SectionKey };
export type SectionData<K extends SectionKey> = z.infer<(typeof sectionSchemas)[K]>;
