import { NextRequest, NextResponse } from "next/server";
import { errorResponse } from "@/lib/api-response";
import * as postService from "@/lib/services/postService";

// Triggered by the GitHub Actions workflow on a schedule. The publishedAt <= now filter
// in lib/data/public.ts already keeps visibility correct between runs, so a missed or
// delayed run is not a correctness issue — this just proactively revalidates sooner.
export async function POST(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  const authHeader = request.headers.get("authorization");

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return errorResponse("Unauthorized", 401);
  }

  const result = await postService.publishDueScheduled();
  return NextResponse.json(result);
}
