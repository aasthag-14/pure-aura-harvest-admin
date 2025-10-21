"use client";

import React from "react";

export default function ConfirmDialog({
  title,
  message,
  confirmText = "Confirm",
  confirmVariant = "primary",
  onCancel,
  onConfirm,
}: {
  title: string;
  message: string;
  confirmText?: string;
  confirmVariant?: "primary" | "danger";
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="p-4 border-b border-gray-200 font-semibold">
          {title}
        </div>
        <div className="p-4 text-sm text-gray-700">{message}</div>
        <div className="p-4 border-t border-gray-200 flex justify-end gap-2">
          <button onClick={onCancel} className="px-4 py-2 btn-secondary">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={
              confirmVariant === "danger"
                ? "px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
                : "px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            }
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
