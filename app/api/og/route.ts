import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const coverUrl = searchParams.get("cover");

  if (coverUrl) {
    try {
      const res = await fetch(coverUrl);
      if (res.ok) {
        const buffer = Buffer.from(await res.arrayBuffer());
        const optimized = await sharp(buffer)
          .resize(1200, 630, { fit: "cover" })
          .jpeg({ quality: 82, progressive: true })
          .toBuffer();

        return new NextResponse(new Uint8Array(optimized), {
          status: 200,
          headers: {
            "Content-Type": "image/jpeg",
            "Content-Length": String(optimized.length),
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      }
    } catch (error) {
      console.error("Failed to optimize cover image in /api/og:", error);
    }
  }

  // Fallback: redirect to static og.jpg
  return NextResponse.redirect(new URL("/og.jpg", request.url));
}
