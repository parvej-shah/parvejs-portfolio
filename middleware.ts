import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth.config";

// Server-side guard for /admin/*: never trust a client-supplied role, always check the session.
// Uses the edge-safe config (no bcrypt/Prisma) since middleware runs on the Edge runtime.
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

  if (isAdminRoute && !isLoggedIn) {
    // Behind Vercel's proxy req.nextUrl.origin is the deployment host, not the
    // domain the visitor typed, so redirecting to it would strand them on
    // *.vercel.app and set the session cookie on the wrong domain. Trust the
    // forwarded host instead, which preserves parvejshah.com.
    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
    const proto = req.headers.get("x-forwarded-proto") ?? "https";
    const origin = host ? `${proto}://${host}` : req.nextUrl.origin;
    return NextResponse.redirect(new URL("/login", origin));
  }
});

export const config = {
  matcher: ["/admin/:path*"],
};
