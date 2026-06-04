import { NextRequest, NextResponse } from "next/server";
import { authClient } from "./lib/auth-client";

// Role များအတွက် Type သတ်မှတ်ခြင်း
type Role = "ADMIN" | "OWNER" | "USER";

interface User {
  id: string;
  email: string;
  role?: Role;
  [key: string]: any;
}

interface Session {
  user: User;
  [key: string]: any;
}

// 🔑 Session ကို Request Header ၏ Cookie နှင့်အတူ Fetch လုပ်ခြင်း
const getSession = async (request: NextRequest) => {
  try {
    const session = await authClient.getSession({
      fetchOptions: {
        headers: {
          // ✅ Browser မှ Cookie ကို Backend ဆီသို့ သေချာပေါက် ပို့ပေးခြင်း
          cookie: request.headers.get("cookie") || "",
        },
      },
    });
    return session.data as Session | null;
  } catch {
    return null;
  }
};

// 🔄 Role အလိုက် Dashboard သို့ ပို့ပေးမည့် Function
function redirectToDashboard(role: string, request: NextRequest) {
  const path = role === "ADMIN" ? "/admin" : role === "OWNER" ? "/owner" : "/user";
  return NextResponse.redirect(new URL(path, request.url));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getSession(request);

  // Default အနေဖြင့် Role မရှိပါက "USER" ဟု သတ်မှတ်သည်
  const userRole = (session?.user?.role?.toUpperCase() as Role) ?? "USER";

  // 1. Auth Pages (Login/Register) များကို စစ်ဆေးခြင်း
  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    if (session) {
      return redirectToDashboard(userRole, request);
    }
    return NextResponse.next();
  }

  // 2. Protected Routes များအတွက် Session မရှိပါက Login ဆီ ပြန်ပို့ခြင်း
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 3. Role-Based Route Protection (သက်ဆိုင်ရာ Role မှလွဲ၍ တခြားသူများဝင်ခြင်းကို ပိတ်ပင်ခြင်း)
  if (pathname.startsWith("/admin") && userRole !== "ADMIN") {
    return redirectToDashboard(userRole, request);
  }

  if (pathname.startsWith("/owner") && userRole !== "OWNER") {
    return redirectToDashboard(userRole, request);
  }

  if (pathname.startsWith("/user") && userRole !== "USER") {
    return redirectToDashboard(userRole, request);
  }

  // 4. Root Path ("/") သို့ရောက်လာပါက Role အလိုက် သင့်လျော်ရာဆီ ပို့ပေးခြင်း
  if (pathname === "/") {
    return redirectToDashboard(userRole, request);
  }

  return NextResponse.next();
}

// 🎯 Middleware အလုပ်လုပ်မည့် Routes များ
export const config = {
  matcher: [
    "/",
    "/admin/:path*",
    "/owner/:path*",
    "/user/:path*",
    "/login",
    "/register",
  ],
};