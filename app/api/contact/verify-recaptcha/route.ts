import { NextRequest, NextResponse } from "next/server";
import { ZodError } from "zod";
import { verifyRecaptchaSchema } from "@/lib/validators/recaptcha";
import { verifyRecaptchaToken } from "@/lib/services/recaptchaService";

/**
 * Controller for reCAPTCHA token verification.
 * Follows MVC pattern: validates boundary input, delegates to service, and formats HTTP response.
 */
export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON request body" },
        { status: 400 }
      );
    }

    const { token } = verifyRecaptchaSchema.parse(body);

    const isValid = await verifyRecaptchaToken(token);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "reCAPTCHA verification failed" },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessage = error.issues[0]?.message || "reCAPTCHA verification failed";
      return NextResponse.json(
        { success: false, error: errorMessage },
        { status: 400 }
      );
    }

    console.error("reCAPTCHA verification error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
