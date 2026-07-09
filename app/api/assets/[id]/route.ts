import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { ZodError } from "zod";
import { auth } from "@/lib/auth";
import { errorResponse, zodErrorResponse } from "@/lib/api-response";
import { updateAssetSchema } from "@/lib/validators/asset";
import * as uploadService from "@/lib/services/uploadService";

type Params = { params: Promise<{ id: string }> };

// Alt text is the only editable field: it powers image SEO / accessibility.
const updateAltSchema = updateAssetSchema.pick({ alt: true });

export async function PATCH(request: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return errorResponse("Unauthorized", 401);

  const { id } = await params;

  try {
    const body = await request.json();
    const { alt } = updateAltSchema.parse(body);
    const asset = await uploadService.updateImageAlt(id, alt ?? null);
    revalidateTag("projects", "max");
    return NextResponse.json(asset);
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    if (error instanceof uploadService.AssetNotFoundError) {
      return errorResponse(error.message, 404);
    }
    throw error;
  }
}

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
