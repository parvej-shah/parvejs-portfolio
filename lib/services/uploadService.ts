import { randomUUID } from "node:crypto";
import { uploadObject, deleteObject } from "@/lib/storage";
import * as assetRepo from "@/lib/data/assetRepo";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export class InvalidFileError extends Error {}

export class AssetNotFoundError extends Error {
  constructor(id: string) {
    super(`Asset not found: ${id}`);
    this.name = "AssetNotFoundError";
  }
}

function extensionFor(contentType: string) {
  return contentType.split("/")[1] ?? "bin";
}

export async function uploadImage(file: File, projectId?: string) {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new InvalidFileError(`Unsupported file type: ${file.type}`);
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new InvalidFileError(`File too large: max ${MAX_SIZE_BYTES / 1024 / 1024}MB`);
  }

  const key = `uploads/${randomUUID()}.${extensionFor(file.type)}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const url = await uploadObject(key, buffer, file.type);

  return assetRepo.createAsset({
    key,
    url,
    alt: null,
    width: null,
    height: null,
    projectId: projectId ?? null,
  });
}

export async function deleteImage(id: string) {
  const asset = await assetRepo.findAssetById(id);
  if (!asset) throw new AssetNotFoundError(id);

  await deleteObject(asset.key);
  return assetRepo.deleteAsset(id);
}
