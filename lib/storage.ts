import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

// Singleton pattern: one S3Client instance reused across requests.
const globalForR2 = globalThis as unknown as {
  r2Client: S3Client | undefined;
};

const r2Client =
  globalForR2.r2Client ??
  new S3Client({
    region: "auto",
    endpoint: process.env.R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID!,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    },
  });

if (process.env.NODE_ENV !== "production") globalForR2.r2Client = r2Client;

// Adapter pattern: wraps the AWS S3 SDK so the rest of the app never imports it directly,
// keeping storage swappable (Strategy) if we move off R2 later.
export async function uploadObject(
  key: string,
  body: Buffer | Uint8Array,
  contentType: string
): Promise<string> {
  await r2Client.send(
    new PutObjectCommand({
      Bucket: process.env.R2_BUCKET,
      Key: key,
      Body: body,
      ContentType: contentType,
    })
  );

  return getPublicUrl(key);
}

export function getPublicUrl(key: string): string {
  return `${process.env.R2_PUBLIC_URL}/${key}`;
}
