import "dotenv/config";
import fs from "fs";
import path from "path";
import { uploadObject } from "../lib/storage";

function getMimeType(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  switch (ext) {
    case ".png":
      return "image/png";
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".webp":
      return "image/webp";
    case ".svg":
      return "image/svg+xml";
    case ".gif":
      return "image/gif";
    case ".json":
      return "application/json";
    default:
      return "application/octet-stream";
  }
}

interface UploadTarget {
  localPath: string;
  r2Key: string;
}

async function collectDirectoryFiles(dirPath: string, prefix: string): Promise<UploadTarget[]> {
  const results: UploadTarget[] = [];
  if (!fs.existsSync(dirPath)) return results;

  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isFile()) {
      results.push({
        localPath: fullPath,
        r2Key: `${prefix}/${entry.name}`,
      });
    } else if (entry.isDirectory()) {
      const nested = await collectDirectoryFiles(fullPath, `${prefix}/${entry.name}`);
      results.push(...nested);
    }
  }
  return results;
}

async function main() {
  console.log("🚀 Starting asset upload to Cloudflare R2 (minions-assets)...");

  const uploads: UploadTarget[] = [];

  // 1. public/blog/* -> blog/<filename>
  const blogFiles = await collectDirectoryFiles(path.resolve("public/blog"), "blog");
  uploads.push(...blogFiles);

  // 2. public/projects/* -> projects/<filename>
  const projectFiles = await collectDirectoryFiles(path.resolve("public/projects"), "projects");
  uploads.push(...projectFiles);

  // 3. public/og.jpg -> og.jpg
  if (fs.existsSync(path.resolve("public/og.jpg"))) {
    uploads.push({
      localPath: path.resolve("public/og.jpg"),
      r2Key: "og.jpg",
    });
  }

  // 4. public/og/* -> og/<filename>
  const ogFiles = await collectDirectoryFiles(path.resolve("public/og"), "og");
  uploads.push(...ogFiles);

  // 5. assets/images/* -> assets/images/<filename>
  const assetImageFiles = await collectDirectoryFiles(path.resolve("assets/images"), "assets/images");
  uploads.push(...assetImageFiles);

  // 6. Explicit user uploaded diagrams:
  const userUploads = [
    {
      localPath: "/home/parvej/.gemini/antigravity/brain/b6ccac15-0a22-4be9-9d12-c288bbaf6b48/.user_uploaded/media_1789624977827.png",
      r2Key: "blog/rapid-software-development-two-perspectives.png",
    },
    {
      localPath: "/home/parvej/.gemini/antigravity/brain/b6ccac15-0a22-4be9-9d12-c288bbaf6b48/.user_uploaded/media_1789624975506.png",
      r2Key: "blog/why-rapid-prototyping-matters.png",
    },
    {
      localPath: "/home/parvej/.gemini/antigravity/brain/b6ccac15-0a22-4be9-9d12-c288bbaf6b48/.user_uploaded/media_1789623843926.png",
      r2Key: "blog/rapid-software-development-user-experience.png",
    },
  ];

  for (const item of userUploads) {
    if (fs.existsSync(item.localPath)) {
      const idx = uploads.findIndex((u) => u.r2Key === item.r2Key);
      if (idx !== -1) {
        uploads[idx] = item;
      } else {
        uploads.push(item);
      }
    }
  }

  console.log(`Found ${uploads.length} files to upload to R2.`);

  let successCount = 0;
  let failCount = 0;

  for (const item of uploads) {
    const mimeType = getMimeType(item.localPath);
    const buffer = fs.readFileSync(item.localPath);
    try {
      const publicUrl = await uploadObject(item.r2Key, buffer, mimeType);
      console.log(`✅ [${item.r2Key}] (${mimeType}) -> ${publicUrl}`);
      successCount++;
    } catch (err: any) {
      console.error(`❌ [${item.r2Key}] Failed:`, err?.message || err);
      failCount++;
    }
  }

  console.log("\n📊 Upload Summary:");
  console.log(`   Success: ${successCount}`);
  console.log(`   Failed: ${failCount}`);

  if (failCount > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
