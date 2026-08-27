import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/data/public";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  const title = post?.title || "Parvej Shah | Insights";
  const excerpt = post?.excerpt || "Production AI systems and high-performance web products.";
  const coverUrl = post?.coverImage?.url;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "55px 65px",
          backgroundColor: "#070b11",
          backgroundImage:
            "radial-gradient(circle at 25px 25px, #162032 2%, transparent 0%), radial-gradient(circle at 75px 75px, #162032 2%, transparent 0%)",
          backgroundSize: "100px 100px",
          color: "#ffffff",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={coverUrl}
            alt=""
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.22,
            }}
          />
        ) : null}

        {/* Ambient Top Glow */}
        <div
          style={{
            position: "absolute",
            top: "-100px",
            left: "20%",
            width: "500px",
            height: "300px",
            borderRadius: "100%",
            background: "rgba(16, 185, 129, 0.22)",
            filter: "blur(90px)",
          }}
        />

        {/* Top Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 10,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              fontSize: "24px",
              fontWeight: 900,
              letterSpacing: "-0.5px",
            }}
          >
            <span style={{ color: "#10b981" }}>&lt;</span>
            <span style={{ color: "#ffffff" }}>PS</span>
            <span style={{ color: "#10b981" }}>/&gt;</span>
            <span
              style={{
                color: "#94a3b8",
                fontSize: "17px",
                marginLeft: "12px",
                fontWeight: 500,
              }}
            >
              parvejshah.com/blog
            </span>
          </div>

          <div
            style={{
              padding: "6px 18px",
              borderRadius: "9999px",
              border: "1px solid rgba(16, 185, 129, 0.4)",
              background: "rgba(16, 185, 129, 0.14)",
              color: "#34d399",
              fontSize: "14px",
              fontWeight: 700,
              letterSpacing: "0.8px",
              textTransform: "uppercase",
            }}
          >
            Engineering Insights
          </div>
        </div>

        {/* Center Title & Excerpt */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            zIndex: 10,
            maxWidth: "1050px",
          }}
        >
          <div
            style={{
              fontSize: title.length > 55 ? "44px" : "54px",
              fontWeight: 900,
              lineHeight: 1.15,
              letterSpacing: "-1px",
              color: "#f8fafc",
            }}
          >
            {title}
          </div>

          <div
            style={{
              fontSize: "19px",
              color: "#94a3b8",
              lineHeight: 1.5,
              maxHeight: "60px",
              overflow: "hidden",
            }}
          >
            {excerpt}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(255, 255, 255, 0.12)",
            paddingTop: "18px",
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "9999px",
                background: "rgba(16, 185, 129, 0.15)",
                border: "1.5px solid rgba(16, 185, 129, 0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "16px",
                fontWeight: 800,
                color: "#10b981",
              }}
            >
              PS
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "16px", fontWeight: 700, color: "#ffffff" }}>
                Parvej Shah
              </span>
              <span style={{ fontSize: "13px", color: "#64748b" }}>
                Software Engineer & AI Systems Developer
              </span>
            </div>
          </div>

          <div style={{ fontSize: "15px", color: "#10b981", fontWeight: 600 }}>
            Read on parvejshah.com ↗
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
