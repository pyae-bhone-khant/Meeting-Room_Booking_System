import { createAuthClient } from "better-auth/react"


// export const authClient = createAuthClient({
//   baseURL: "api/auth",
//   fetchOptions: {
//     credentials: "include",
//   },
// }) 

// (Local တွင် http://localhost:3000 ဖြစ်ပြီး၊ Production Vercel တွင် မိမိ Vercel Domain ဖြစ်ပါမည်)
// const appUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const authClient = createAuthClient({
  // အပြည့်အစုံဖြစ်သော URL (e.g., http://localhost:3000/api/auth) ကို ထည့်ပေးရပါမည်
  // baseURL: `${appUrl}/api/auth`,  
   baseURL:
    process.env.NEXT_PUBLIC_API_URL ?
      `${process.env.NEXT_PUBLIC_API_URL}/api/auth`
    : "http://localhost:8080/api/v1",
  fetchOptions: {
    credentials: "include",
  },
});

export const { signIn, signUp, useSession, signOut } = authClient
