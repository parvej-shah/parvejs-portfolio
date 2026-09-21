import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { uploadObject, deleteObject } from "@/lib/storage";
import * as assetRepo from "@/lib/data/assetRepo";
import * as auditRepo from "@/lib/data/auditRepo";
import { fetchRemoteImage } from "@/lib/services/remoteImage";
import { decodeInlineImage } from "@/lib/services/inlineImage";
import type { MutationContext } from "@/lib/services/mutationContext";

const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"]);
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

// Target output constraints: every stored image is WebP under 200KB.
const OUTPUT_CONTENT_TYPE = "image/webp";
const OUTPUT_EXTENSION = "webp";
const TARGET_SIZE_BYTES = 200 * 1024;
// Quality ladder tried before falling back to downscaling.
const QUALITY_STEPS = [80, 70, 60, 50, 40];
const MIN_QUALITY = QUALITY_STEPS[QUALITY_STEPS.length - 1];
// Fraction to shrink dimensions by on each downscale pass, with a floor.
const DOWNSCALE_FACTOR = 0.85;
const MIN_DIMENSION = 320;

export class InvalidFileError extends Error {}

export class AssetNotFoundError extends Error {
  constructor(id: string) {
    super(`Asset not found: ${id}`);
    this.name = "AssetNotFoundError";
  }
}

type CompressedImage = { buffer: Buffer; width: number; height: number };

/**
 * Compresses any supported input into WebP under TARGET_SIZE_BYTES.
 * Strategy: lower quality first; if the smallest quality still exceeds the
 * target, progressively downscale dimensions until it fits (or the floor is hit).
 */
async function compressToWebp(input: Buffer): Promise<CompressedImage> {
  const source = sharp(input, { animated: true }).rotate();
  const meta = await source.metadata();
  let width = meta.width ?? MIN_DIMENSION;

  while (true) {
    const resized = sharp(input, { animated: true })
      .rotate()
      .resize({ width, withoutEnlargement: true });

    for (const quality of QUALITY_STEPS) {
      const buffer = await resized.clone().webp({ quality, effort: 4 }).toBuffer();
      if (buffer.length <= TARGET_SIZE_BYTES || quality === MIN_QUALITY) {
        if (buffer.length <= TARGET_SIZE_BYTES || width <= MIN_DIMENSION) {
          const out = await sharp(buffer).metadata();
          return { buffer, width: out.width ?? width, height: out.height ?? width };
        }
        break; // min quality still too big and room to downscale — shrink and retry
      }
    }

    width = Math.max(MIN_DIMENSION, Math.floor(width * DOWNSCALE_FACTOR));
  }
}

export async function uploadImage(file: File, projectId?: string) {
  if (!ALLOWED_TYPES.has(file.type)) {
    throw new InvalidFileError(`Unsupported file type: ${file.type}`);
  }
  if (file.size > MAX_SIZE_BYTES) {
    throw new InvalidFileError(`File too large: max ${MAX_SIZE_BYTES / 1024 / 1024}MB`);
  }

  const input = Buffer.from(await file.arrayBuffer());
  const { buffer, width, height } = await compressToWebp(input);

  const key = `uploads/${randomUUID()}.${OUTPUT_EXTENSION}`;
  const url = await uploadObject(key, buffer, OUTPUT_CONTENT_TYPE);

  return assetRepo.createAsset({
    key,
    url,
    alt: null,
    width,
    height,
    projectId: projectId ?? null,
  });
}

type ImageIngestOptions = { alt?: string | null; projectId?: string | null };

/**
 * Shared tail of every agent-sourced upload: compress, store, and record the
 * asset in the same audited transaction. Only the way the bytes arrive differs
 * between the URL and inline paths, so only that part lives in the callers.
 */
async function storeIngestedImage(
  input: Buffer,
  sourceMetadata: Record<string, unknown>,
  options: ImageIngestOptions,
  context: MutationContext
) {
  const { buffer, width, height } = await compressToWebp(input);

  const key = `uploads/${randomUUID()}.${OUTPUT_EXTENSION}`;
  const url = await uploadObject(key, buffer, OUTPUT_CONTENT_TYPE);

  return auditRepo.runAuditedMutation(
    context,
    {
      action: "UPLOAD_IMAGE",
      targetType: "ASSET",
      metadata: { ...sourceMetadata, sourceBytes: input.length, storedBytes: buffer.length },
    },
    (tx) =>
      tx.asset.create({
        data: {
          key,
          url,
          alt: options.alt ?? null,
          width,
          height,
          projectId: options.projectId ?? null,
        },
      }),
    (created) => created.id
  );
}

/**
 * Ingests an image the caller named by URL. This is the path agents should
 * normally take: the bytes move server to server instead of through the
 * model's context. The fetch itself is guarded in remoteImage.ts; everything
 * after it reuses the same compression and storage path as a dashboard upload,
 * so an MCP-sourced image is not a second class of asset.
 */
export async function uploadImageFromUrl(
  sourceUrl: string,
  options: ImageIngestOptions,
  context: MutationContext
) {
  const remote = await fetchRemoteImage(sourceUrl);
  return storeIngestedImage(
    remote.buffer,
    { source: "url", sourceUrl: remote.sourceUrl, sourceContentType: remote.contentType },
    options,
    context
  );
}

/**
 * Ingests an image the caller sent inline as base64, for files that have no
 * public URL to fetch from. Expensive in context, so the tool description
 * points at uploadImageFromUrl first.
 */
export async function uploadImageFromData(
  imageBase64: string,
  options: ImageIngestOptions,
  context: MutationContext
) {
  const inline = decodeInlineImage(imageBase64);
  return storeIngestedImage(
    inline.buffer,
    { source: "inline", sourceContentType: inline.contentType },
    options,
    context
  );
}

export function listImages(limit: number) {
  return assetRepo.listAssets(limit);
}

export class AssetInUseError extends Error {
  constructor(id: string, usedBy: string) {
    super(`Asset ${id} is still in use as ${usedBy}; detach it before deleting.`);
    this.name = "AssetInUseError";
  }
}

/**
 * Deleting a referenced asset would leave a post or project pointing at a dead
 * URL, so an in-use asset is refused rather than cascaded.
 */
export async function deleteImageChecked(id: string, context: MutationContext) {
  const asset = await assetRepo.findAssetWithUsage(id);
  if (!asset) throw new AssetNotFoundError(id);
  if (asset.postCover) throw new AssetInUseError(id, `the cover image of "${asset.postCover.title}"`);
  if (asset.projectId) throw new AssetInUseError(id, "a project gallery image");

  await deleteObject(asset.key);
  return auditRepo.runAuditedMutation(
    context,
    { action: "DELETE_IMAGE", targetType: "ASSET", targetId: id, before: asset },
    (tx) => tx.asset.delete({ where: { id } }),
    (deleted) => deleted.id
  );
}

export async function updateImageAlt(id: string, alt: string | null) {
  const asset = await assetRepo.findAssetById(id);
  if (!asset) throw new AssetNotFoundError(id);

  return assetRepo.updateAsset(id, { alt });
}

export async function deleteImage(id: string) {
  const asset = await assetRepo.findAssetById(id);
  if (!asset) throw new AssetNotFoundError(id);

  await deleteObject(asset.key);
  return assetRepo.deleteAsset(id);
}
