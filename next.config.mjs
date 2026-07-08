const r2PublicUrl = process.env.R2_PUBLIC_URL;
const r2PublicHostname = r2PublicUrl ? new URL(r2PublicUrl).hostname : "cdn.mathpro.academy";

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Inline CSS into the HTML to remove the render-blocking stylesheet
    // round trip — on throttled mobile this directly cuts FCP (and LCP).
    inlineCss: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: r2PublicHostname,
      },
    ],
  },
};

export default nextConfig;
