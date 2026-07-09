import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { auth } from "@/lib/auth";
import { errorResponse, zodErrorResponse } from "@/lib/api-response";
import { reorderProjectsSchema } from "@/lib/validators/project";
import * as projectService from "@/lib/services/projectService";

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session) return errorResponse("Unauthorized", 401);

  try {
    const body = await request.json();
    const { orderedIds } = reorderProjectsSchema.parse(body);
    await projectService.reorderProjects(orderedIds);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    throw error;
  }
}
