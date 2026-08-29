import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") || "Parvej Shah — Software Engineer & AI Systems Developer";
    const category = searchParams.get("category") || "Case Studies & Architecture";
    const author = searchParams.get("author") || "Parvej Shah · University of Dhaka / CoderVai";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "space-between",
            backgroundColor: "#070c14",
            backgroundImage:
              "radial-gradient(circle at 25px 25px, rgba(255, 255, 255, 0.07) 2px, transparent 0)",
            backgroundSize: "40px 40px",
            padding: "60px 70px",
            fontFamily: "sans-serif",
            color: "#ffffff",
            border: "10px solid #00E676",
          }}
        >
          {/* Header row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "32px",
                fontWeight: "900",
              }}
            >
              <span style={{ color: "#00E676" }}>&lt;</span>
              <span style={{ color: "#ffffff" }}>PS</span>
              <span style={{ color: "#00E676" }}>/&gt;</span>
            </div>

            <div
              style={{
                padding: "8px 20px",
                borderRadius: "9999px",
                backgroundColor: "rgba(0, 230, 118, 0.12)",
                border: "1px solid rgba(0, 230, 118, 0.4)",
                color: "#00E676",
                fontSize: "16px",
                fontWeight: "700",
                letterSpacing: "0.5px",
                textTransform: "uppercase",
              }}
            >
              {category}
            </div>
          </div>

          {/* Title body */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              maxWidth: "1050px",
            }}
          >
            <div
              style={{
                fontSize: title.length > 60 ? "46px" : "56px",
                fontWeight: "900",
                lineHeight: 1.18,
                letterSpacing: "-1px",
                color: "#ffffff",
              }}
            >
              {title}
            </div>
          </div>

          {/* Footer row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
              borderTop: "1px solid rgba(255, 255, 255, 0.12)",
              paddingTop: "24px",
            }}
          >
            <div style={{ fontSize: "20px", fontWeight: "600", color: "#94a3b8" }}>
              {author}
            </div>
            <div style={{ fontSize: "20px", fontWeight: "700", color: "#00E676" }}>
              parvejshah.com
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (err) {
    console.error("Failed to generate dynamic OG card:", err);
    return new Response("Failed to generate OG image", { status: 500 });
  }
}
