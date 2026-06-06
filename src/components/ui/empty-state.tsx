"use client";

import { FileX, SearchX, Users } from "lucide-react";

interface EmptyStateProps {
  type?: "no-items" | "no-results" | "no-users";
  message?: string;
  className?: string;
}

export function EmptyState({ 
  type = "no-items", 
  message, 
  className = "" 
}: EmptyStateProps) {
  const icons = {
    "no-items": FileX,
    "no-results": SearchX,
    "no-users": Users,
  };

  const defaultMessages = {
    "no-items": "No items found",
    "no-results": "No results found for your search",
    "no-users": "No users found",
  };

  const Icon = icons[type];
  const displayMessage = message || defaultMessages[type];

  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 ${className}`}>
      <div className="bg-gray-50 rounded-full p-6 mb-4">
        <Icon className="w-12 h-12 text-gray-400" />
      </div>
      <p className="text-gray-500 text-lg font-medium">{displayMessage}</p>
    </div>
  );
}
