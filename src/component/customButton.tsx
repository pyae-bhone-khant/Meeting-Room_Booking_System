"use client";

import React from 'react';
import { authClient } from '../lib/auth-client';

interface ButtonProps {
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  className?: string;
  icon?: React.ReactNode;
}

export const CustomButton: React.FC<ButtonProps> = ({ label, onClick, variant = 'primary', className , icon }) => {
  // Client Component မှာ Hook ကိုသုံးပြီး session ကို အလွယ်တကူရယူပါ
  const { data: session } = authClient.useSession();
  const user = session?.user as any;

  const baseStyle = "px-4 py-2 rounded-lg font-medium transition-all";
  
  // Variant Logic
  let variantStyle = "";
  if (variant === 'primary') {
    variantStyle = "bg-blue-400 text-white hover:bg-blue-500 ";
  } else {
    // Session ထဲက role ကို အခြေခံပြီး စစ်ဆေးခြင်း
    if (user?.role === 'ADMIN') {
      variantStyle = "bg-purple-700 text-white hover:bg-purple-800 ";
    } else if (user?.role === 'USER') {
      variantStyle = "bg-green-400 text-white hover:bg-green-500 ";
    } else {
      variantStyle = "bg-gray-200 text-black hover:bg-gray-300";
    }
  }

  return (
    <button 
      onClick={onClick} 
      className={`${baseStyle} ${variantStyle} ${className}`}
    > <div className="flex items-center gap-2">
        {label}
        {icon}
    </div>
    </button>
  );
};