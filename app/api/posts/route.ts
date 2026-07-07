import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { auth } from "@/lib/auth";
import { errorResponse, zodErrorResponse } from "@/lib/api-response";
import { createPostSchema } from "@/lib/validators/post";
import * as postService from "@/lib/services/postService";

export async function GET() {
  const session = await auth();
  if (!session) return errorResponse("Unauthorized", 401);

  const posts = await postService.listPosts();
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return errorResponse("Unauthorized", 401);

  try {
    const body = await request.json();
    const data = createPostSchema.parse(body);
    const post = await postService.createPost(data);
    return NextResponse.json(post, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    if (error instanceof postService.DuplicateSlugError) {
      return errorResponse(error.message, 409);
    }
    throw error;
  }
}
