import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { auth } from "@/lib/auth";
import { errorResponse, zodErrorResponse } from "@/lib/api-response";
import { createProjectSchema } from "@/lib/validators/project";
import * as projectService from "@/lib/services/projectService";
import { createAdminMutationContext } from "@/lib/services/mutationContext";

export async function GET() {
  const session = await auth();
  if (!session) return errorResponse("Unauthorized", 401);

  const projects = await projectService.listProjects();
  return NextResponse.json(projects);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session) return errorResponse("Unauthorized", 401);

  try {
    const body = await request.json();
    const data = createProjectSchema.parse(body);
    const project = await projectService.createProject(
      data,
      createAdminMutationContext(session.user?.id ?? session.user?.email ?? "admin")
    );
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    if (error instanceof projectService.DuplicateSlugError) {
      return errorResponse(error.message, 409);
    }
    throw error;
  }
}
