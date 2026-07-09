import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { auth } from "@/lib/auth";
import { errorResponse } from "@/lib/api-response";
import * as uploadService from "@/lib/services/uploadService";

type Params = { params: Promise<{ id: string }> };

export async function DELETE(_request: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return errorResponse("Unauthorized", 401);

  const { id } = await params;

  try {
    await uploadService.deleteImage(id);
    revalidateTag("projects", "max");
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof uploadService.AssetNotFoundError) {
      return errorResponse(error.message, 404);
    }
    throw error;
  }
}
