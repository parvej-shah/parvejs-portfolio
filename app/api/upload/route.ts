import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { errorResponse } from "@/lib/api-response";
import * as uploadService from "@/lib/services/uploadService";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return errorResponse("Unauthorized", 401);

  const formData = await request.formData();
  const file = formData.get("file");
  const projectId = formData.get("projectId");

  if (!(file instanceof File)) {
    return errorResponse("Missing file", 400);
  }

  try {
    const asset = await uploadService.uploadImage(
      file,
      typeof projectId === "string" ? projectId : undefined
    );
    return NextResponse.json(asset, { status: 201 });
  } catch (error) {
    if (error instanceof uploadService.InvalidFileError) {
      return errorResponse(error.message, 400);
    }
    throw error;
  }
}
