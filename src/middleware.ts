import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const sessionToken = request.cookies.get("better-auth.session_token")?.value;

  if (!sessionToken) {
    if (!pathname.startsWith("/login") && !pathname.startsWith("/register")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || "https://meeting-room-booking-system-api.onrender.com";
    
    const response = await fetch(`${backendUrl}/api/auth/get-session`, {
      headers: {
        Cookie: request.headers.get("cookie") || "",
      },
    });

    const sessionData = await response.json();
    const userRole = sessionData?.user?.role; // "ADMIN" | "OWNER" | "USER"

    if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
      return redirectToDashboard(userRole, request);
    }

    if (pathname.startsWith("/ADMIN") && userRole !== "ADMIN") {
      return redirectToDashboard(userRole, request);
    }

    if (pathname.startsWith("/OWNER") && userRole !== "OWNER") {
      return redirectToDashboard(userRole, request);
    }

    if (pathname.startsWith("/USER") && userRole !== "USER") {
      return redirectToDashboard(userRole, request);
    }

    
    if (pathname === "/") {
      return redirectToDashboard(userRole, request);
    }

  } catch (error) {
    console.error("Auth Middleware Error:", error);
 
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

function redirectToDashboard(role: string, request: NextRequest) {
  if (role === "ADMIN") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  if (role === "OWNER") {
    return NextResponse.redirect(new URL("/owner", request.url));
  }
  return NextResponse.redirect(new URL("/user", request.url)); 
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};