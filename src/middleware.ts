import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 🔑 Better-Auth ရဲ့ Session Token ကို Cookie ထဲကနေ ဆွဲထုတ်ခြင်း
  const sessionToken = request.cookies.get("better-auth.session_token")?.value;

  // ❌ ၁။ အကယ်၍ အကောင့်ဝင်မထားရင် (Session Token မရှိရင်)
  if (!sessionToken) {
    // URL လမ်းကြောင်းက /login သို့မဟုတ် /register မဟုတ်ခဲ့ရင် အတင်း Login ဆီ ပြန်မောင်းထုတ်မည်
    if (!pathname.includes("/login") && !pathname.includes("/register")) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // 🟢 ၂။ အကယ်၍ အကောင့်ဝင်ထားပြီးသားဆိုရင် (Session Token ရှိနေရင်)
  // အကယ်၍ လူက /login သို့မဟုတ် /register သို့မဟုတ် Root `/` ကို လာရင် /user ဆီ တိုက်ရိုက် ပေးဝင်လိုက်ပါမည်
  if (pathname.includes("/login") || pathname.includes("/register") || pathname === "/") {
    return NextResponse.redirect(new URL("/user", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Static Files များနှင့် Next.js Internal Files များကိုသာ Middleware မပတ်အောင် ဖယ်ထုတ်ထားခြင်း
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};