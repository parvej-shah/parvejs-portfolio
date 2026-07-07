import { NextResponse } from "next/server";
import { ZodError } from "zod";

// Consistent JSON error shape for all app/api/** route handlers.
export function errorResponse(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

export function zodErrorResponse(error: ZodError) {
  return NextResponse.json(
    { error: "Validation failed", issues: error.issues },
    { status: 400 }
  );
}
