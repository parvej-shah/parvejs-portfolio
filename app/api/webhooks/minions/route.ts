import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import crypto from "crypto";
import { z, ZodError } from "zod";
import { errorResponse, zodErrorResponse } from "@/lib/api-response";
import * as postService from "@/lib/services/postService";

const webhookPayloadSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  excerpt: z.string().optional().nullable(),
  hook: z.string().optional().nullable(),
  content: z.string().min(1),
  coverImageUrl: z.string().url().optional().nullable(),
  hero_image_url: z.string().url().optional().nullable(),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED"]).default("PUBLISHED"),
  publishedAt: z.string().datetime().optional().nullable(),
  published_at: z.string().datetime().optional().nullable(),
});

function verifyWebhookSecret(authHeader: string | null): boolean {
  const secret = process.env.MINIONS_WEBHOOK_SECRET;
  // If no secret configured in environment, allow webhook
  if (!secret) return true;
  if (!authHeader) return false;

  const token = authHeader.replace(/^Bearer\s+/i, "").trim();
  const tokenBuf = Buffer.from(token, "utf8");
  const secretBuf = Buffer.from(secret, "utf8");

  if (tokenBuf.length !== secretBuf.length) return false;
  return crypto.timingSafeEqual(tokenBuf, secretBuf);
}

export async function POST(request: NextRequest) {
  const authHeader =
    request.headers.get("authorization") || request.headers.get("x-webhook-secret");

  if (!verifyWebhookSecret(authHeader)) {
    return errorResponse("Unauthorized: Invalid webhook secret", 401);
  }

  try {
    const rawBody = await request.json();
    const parsed = webhookPayloadSchema.parse(rawBody);

    const postExcerpt = parsed.excerpt || parsed.hook || parsed.title;
    const rawDate = parsed.publishedAt || parsed.published_at;
    const postPublishedAt = rawDate ? new Date(rawDate) : new Date();
    const coverImage = parsed.coverImageUrl || parsed.hero_image_url || null;

    const post = await postService.upsertPostFromWebhook({
      slug: parsed.slug,
      title: parsed.title,
      excerpt: postExcerpt,
      content: parsed.content,
      status: parsed.status,
      publishedAt: parsed.status === "PUBLISHED" ? postPublishedAt : null,
      coverImageUrl: coverImage,
    });

    try {
      revalidatePath("/blog");
      revalidatePath(`/blog/${post.slug}`);
    } catch {}

    return NextResponse.json(
      {
        success: true,
        id: post.id,
        slug: post.slug,
        url: `https://parvejshah.com/blog/${post.slug}`,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof ZodError) {
      return zodErrorResponse(error);
    }
    return errorResponse(
      error instanceof Error ? error.message : "Internal server error",
      500
    );
  }
}
