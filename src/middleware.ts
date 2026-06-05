import { NextRequest, NextResponse } from "next/server";
import { authClient } from "./lib/auth-client";

// Role-to-path mapping
const ROLE_DASHBOARDS: Record<string, string> = {
  ADMIN: "/admin",
  OWNER: "/owner",
  USER: "/user",
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const session = await authClient.getSession({
    fetchOptions: { headers: { cookie: request.headers.get("cookie") || "" } },
  });

  const user = session.data?.user as any;
  const userRole = user?.role?.toUpperCase();
  const isAuthenticated = !!user;

  // 1. Public Routes Logic
  if (pathname === "/login" || pathname === "/register") {
    if (isAuthenticated) {
      const destination = ROLE_DASHBOARDS[userRole] || "/user";
      return NextResponse.redirect(new URL(destination, request.url));
    }
    return NextResponse.next();
  }

  // 2. Auth Guard
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3. Role Authorization Logic
  const requiredRole = pathname.split("/")[1].toUpperCase(); // admin, owner, or user

  // အကယ်၍ current role က required role နဲ့ မကိုက်ရင်
  if (userRole !== requiredRole) {
    const destination = ROLE_DASHBOARDS[userRole] || "/user";
    return NextResponse.redirect(new URL(destination, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/owner/:path*", "/user/:path*", "/login", "/register"],
};