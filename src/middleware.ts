// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { authClient } from "./lib/auth-client";

// 👤 Project ရဲ့ Role သတ်မှတ်ချက်အတိုင်း Interface တည်ဆောက်ခြင်း
interface User {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  image?: string | null;
  role?: "ADMIN" | "OWNER" | "USER"; // 🎯 Role ၃ မျိုးစလုံး ထည့်သွင်းထားသည်
  [key: string]: any;
}

interface Session {
  user: User;
  [key: string]: any;
}

// 🔑 Better-Auth Session ကို လက်ရှိ Request Headers များဖြင့် ရယူခြင်း
const getSession = async () => {
  try {
    const session = await authClient.getSession({
      fetchOptions: {
        headers: await headers(),
      },
    });
    return session.data as Session | null;
  } catch {
    return null;
  }
};

// 🔄 Role အလိုက် သက်ဆိုင်ရာ လမ်းကြောင်းဆီ Redirect လုပ်ပေးမည့် Helper Function
function redirectToDashboard(role: string, request: NextRequest) {
  if (role === "ADMIN") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }
  if (role === "OWNER") {
    return NextResponse.redirect(new URL("/owner", request.url));
  }
  return NextResponse.redirect(new URL("/user", request.url));
}

// 🌟 ၁။ Named Export အနေဖြင့် သတ်မှတ်ခြင်း
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getSession();
  
  // Role ကို အမြဲတမ်း စာလုံးအကြီးဖြင့် ရယူပြီး Default အနေဖြင့် "USER" ပေးထားမည်
  const userRole = (session?.user as User | undefined)?.role?.toUpperCase() ?? "USER";

  // 🚪 Auth Pages (Login / Register) စစ်ဆေးခြင်း
  if (pathname.startsWith("/login") || pathname.startsWith("/register")) {
    if (session) {
      // အကောင့်ဝင်ပြီးသားလူဆိုရင် Dashboard ဆီ တိုက်ရိုက် မောင်းထုတ်မည်
      return redirectToDashboard(userRole, request);
    }
    return NextResponse.next();
  }

  // ❌ အကယ်၍ အကောင့်ဝင်မထားရင် (Session မရှိရင်) Auth Pages မဟုတ်သမျှ ဝင်ခွင့်မပြုပါ
  if (!session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 🔒 Role-Based Route Protection (Folder လမ်းကြောင်းများအား စောင့်ကြည့်စစ်ဆေးခြင်း)
  
  // Admin Folder Route Protection
  if (pathname.startsWith("/admin") && userRole !== "ADMIN") {
    return redirectToDashboard(userRole, request);
  }

  // Owner Folder Route Protection
  if (pathname.startsWith("/owner") && userRole !== "OWNER") {
    return redirectToDashboard(userRole, request);
  }

  // User Folder Route Protection
  if (pathname.startsWith("/user") && userRole !== "USER") {
    return redirectToDashboard(userRole, request);
  }

  // 🏠 Root `/` လမ်းကြောင်းကို လာရောက်လျှင် သက်ဆိုင်ရာ Dashboard ဆီ ပို့ပေးခြင်း
  if (pathname === "/") {
    return redirectToDashboard(userRole, request);
  }

  return NextResponse.next();
}

// 🌟 ၂။ Next.js 16 Compiler / Turbopack အတွက် Default Export ပါ တစ်ခါတည်း တွဲထုတ်ပေးခြင်း
export default middleware;

// 🎯 Middleware အလုပ်လုပ်မည့် ရွေးချယ်ထားသော Route Configurations
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