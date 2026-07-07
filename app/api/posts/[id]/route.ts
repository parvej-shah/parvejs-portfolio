import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { auth } from "@/lib/auth";
import { errorResponse, zodErrorResponse } from "@/lib/api-response";
import { updatePostSchema } from "@/lib/validators/post";
import * as postService from "@/lib/services/postService";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return errorResponse("Unauthorized", 401);

  const { id } = await params;

  try {
    const post = await postService.getPost(id);
    return NextResponse.json(post);
  } catch (error) {
    if (error instanceof postService.PostNotFoundError) {
      return errorResponse(error.message, 404);
    }
    throw error;
  }
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return errorResponse("Unauthorized", 401);

  const { id } = await params;

  try {
    const body = await request.json();
    const data = updatePostSchema.parse(body);
    const post = await postService.updatePost(id, data);
    return NextResponse.json(post);
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    if (error instanceof postService.PostNotFoundError) {
      return errorResponse(error.message, 404);
    }
    if (error instanceof postService.DuplicateSlugError) {
      return errorResponse(error.message, 409);
    }
    throw error;
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return errorResponse("Unauthorized", 401);

  const { id } = await params;

  try {
    await postService.deletePost(id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof postService.PostNotFoundError) {
      return errorResponse(error.message, 404);
    }
    throw error;
  }
}
