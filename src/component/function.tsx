import { authClient } from "../lib/auth-client";
import { useRouter } from "next/navigation";

export const handleLogout = async () => {
  try {
    const result = await authClient.signOut();

    console.log(result);

    const router = useRouter();
    router.push("/login");
  } catch (error) {
    console.error(error);
  }
};