import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { auth } from "@/lib/auth";
import { errorResponse, zodErrorResponse } from "@/lib/api-response";
import { sectionKeys, type SectionKey } from "@/lib/validators/section";
import * as sectionService from "@/lib/services/sectionService";

type Params = { params: Promise<{ key: string }> };

function parseSectionKey(key: string): SectionKey | null {
  return sectionKeys.includes(key as SectionKey) ? (key as SectionKey) : null;
}

export async function GET(_request: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return errorResponse("Unauthorized", 401);

  const { key } = await params;
  const sectionKey = parseSectionKey(key);
  if (!sectionKey) return errorResponse(`Unknown section: ${key}`, 400);

  try {
    const section = await sectionService.getSectionContent(sectionKey);
    return NextResponse.json(section);
  } catch (error) {
    if (error instanceof sectionService.SectionNotFoundError) {
      return errorResponse(error.message, 404);
    }
    throw error;
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  const session = await auth();
  if (!session) return errorResponse("Unauthorized", 401);

  const { key } = await params;
  const sectionKey = parseSectionKey(key);
  if (!sectionKey) return errorResponse(`Unknown section: ${key}`, 400);

  try {
    const body = await request.json();
    const section = await sectionService.updateSectionContent(sectionKey, body);
    return NextResponse.json(section);
  } catch (error) {
    if (error instanceof ZodError) return zodErrorResponse(error);
    throw error;
  }
}
