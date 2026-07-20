import { createAuthClient } from "better-auth/react"


// export const authClient = createAuthClient({
//   baseURL: "api/auth",
//   fetchOptions: {
//     credentials: "include",
//   },
// }) 

// (Local တွင် http://localhost:3000 ဖြစ်ပြီး၊ Production Vercel တွင် မိမိ Vercel Domain ဖြစ်ပါမည်)
// import { createAuthClient } from "better-auth/react";

// Browser တွင် Run လျှင် "/api/auth" ကို သုံး၍ (Rewrite Proxy ဖြတ်ရန်)
// Server/Build-time တွင် Run လျှင် Absolute URL ကို သုံးရန်
const getBaseURL = () => {
  if (typeof window !== "undefined") {
    return "/api/auth"; // Browser (Client-side) အတွက်
  }
  
  // Next.js Server / Build time (npm run build) အတွက်
  return process.env.NEXT_PUBLIC_APP_URL 
    ? `${process.env.NEXT_PUBLIC_APP_URL}/api/auth` 
    : "http://localhost:3000/api/auth";
};

export const authClient = createAuthClient({
  baseURL: getBaseURL(),
  fetchOptions: {
    credentials: "include",
  },
});

export const { signIn, signUp, useSession, signOut } = authClient
