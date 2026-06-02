import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // .env.local ထဲက နာမည်အတိုင်း ကွက်တိဖြစ်သွားပါပြီ
  baseURL: process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3000", 
});

export const { signIn, signUp, useSession } = authClient;