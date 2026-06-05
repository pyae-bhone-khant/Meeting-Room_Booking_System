"use client";

import React from 'react';
import { authClient } from '../lib/auth-client';
import { Slot } from "@radix-ui/react-slot"; // ဒီ library ကို သုံးရပါမယ်

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
  icon?: React.ReactNode;
  asChild?: boolean; // ဒီမှာထည့်ပါ
}

export const CustomButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ label, onClick, variant = 'primary', className, icon, asChild = false, ...props }, ref) => {
    
    const { data: session } = authClient.useSession();
    const user = session?.user as any;

    const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2";
    
    let variantStyle = "";
    if (variant === 'primary') {
      variantStyle = "bg-blue-400 text-white hover:bg-blue-500 ";
    } else {
      if (user?.role === 'ADMIN') variantStyle = "bg-purple-700 text-white hover:bg-purple-800 ";
      else if (user?.role === 'USER') variantStyle = "bg-green-400 text-white hover:bg-green-500 ";
      else variantStyle = "bg-gray-200 text-black hover:bg-gray-300";
    }

    // asChild ဖြစ်ရင် Slot ကိုသုံး၊ မဟုတ်ရင် button ကိုသုံး
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        onClick={onClick}
        className={`${baseStyle} ${variantStyle} ${className}`}
        {...props}
      >
        {label}
        {icon}
        {props.children}
      </Comp>
    );
  }
);

CustomButton.displayName = "CustomButton";