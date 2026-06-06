"use client";

import { AlertTriangle } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "danger" | "warning" | "info";
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  const variantStyles = {
    danger: {
      confirmBg: "bg-red-500 hover:bg-red-600",
      iconBg: "bg-red-50",
      iconColor: "text-red-500",
    },
    warning: {
      confirmBg: "bg-yellow-500 hover:bg-yellow-600",
      iconBg: "bg-yellow-50",
      iconColor: "text-yellow-500",
    },
    info: {
      confirmBg: "bg-blue-500 hover:bg-blue-600",
      iconBg: "bg-blue-50",
      iconColor: "text-blue-500",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-2xl w-96 max-w-[90vw]">
        <div className="flex items-start gap-4 mb-4">
          <div className={`${styles.iconBg} rounded-full p-3`}>
            <AlertTriangle className={`w-6 h-6 ${styles.iconColor}`} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600">{message}</p>
          </div>
        </div>
        <div className="flex gap-4 mt-6">
          <button
            onClick={onConfirm}
            className={`flex-1 text-white py-3 rounded-xl font-semibold transition-colors ${styles.confirmBg}`}
          >
            {confirmText}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl hover:bg-gray-200 font-semibold transition-colors"
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
}
