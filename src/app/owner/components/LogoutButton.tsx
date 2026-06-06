"use client";

import { CustomButton } from "@/src/component/customButton";
import { signOut } from "@/src/lib/auth-client";

/**
 * LogoutButton Component
 * Uses CustomButton for consistent styling
 * Handles logout and redirects to home page
 */
export default function LogoutButton() {
  const handleLogout = async () => {
    try {
      await signOut();
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <CustomButton 
      label="Logout" 
      onClick={handleLogout}
      variant="secondary"
    />
  );
}
