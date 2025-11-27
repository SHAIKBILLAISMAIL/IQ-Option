import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  try {
    // PUBLIC PATHS - skip middleware
    const PUBLIC_PATHS = [
      "/login",
      "/register",
      "/",
      "/api/auth",
      "/api/auth/set-cookie",
      "/api/market-data",
      "/favicon.ico",
      "/_next",
      "/public",
    ];
    const pathname = request.nextUrl.pathname;
    if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
      return NextResponse.next();
    }

    // Check for bearer_token cookie (set after login by /api/auth/set-cookie)
    const bearerToken = request.cookies.get("bearer_token")?.value;
    if (bearerToken) {
      // Token exists, allow access
      return NextResponse.next();
    }

    // No token, redirect to login
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: ["/((?!_next|api/auth).*)"  ],
};