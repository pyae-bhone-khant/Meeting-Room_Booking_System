"use client";
import { authClient } from "@/src/lib/auth-client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = authClient.useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Session ကို အချိန်ပေးပြီးမှသာ စစ်ဆေးပါ
    if (isPending) return; 

    const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");

    if (!session && !isAuthPage) {
      router.push("/login");
    }
  }, [session, isPending, pathname, router]);

  // ✅ အဓိကအချက်: isPending ဖြစ်နေစဉ်တွင် "Loading..." ဟု ပြပေးခြင်းဖြင့်
  // Stylesheet မရောက်ခင် Page ကို မပြမိအောင် ကာကွယ်ပေးပါသည်
  if (isPending) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}