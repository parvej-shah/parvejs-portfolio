import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { auth } from "@/lib/auth";
import { errorResponse, zodErrorResponse } from "@/lib/api-response";
import { updateProjectSchema } from "@/lib/validators/project";
import * as projectService from "@/lib/services/projectService";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return errorResponse("Unauthorized", 401);

  const { id } = await params;

  try {
    const project = await projectService.getProject(id);
    return NextResponse.json(project);
  } catch (error) {
    if (error instanceof projectService.ProjectNotFoundError) {
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
    const data = updateProjectSchema.parse(body);
    const project = await projectService.updateProject(id, data);
    return NextResponse.json(project);
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    if (error instanceof projectService.ProjectNotFoundError) {
      return errorResponse(error.message, 404);
    }
    if (error instanceof projectService.DuplicateSlugError) {
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
    await projectService.deleteProject(id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    if (error instanceof projectService.ProjectNotFoundError) {
      return errorResponse(error.message, 404);
    }
    throw error;
  }
}
