"use client";

import { toast } from "sonner";

// Generic Toast Manager
export const AppToast = {
  success: (message, options = {}) => {
    toast.success(message, { duration: 2500, ...options });
  },

  error: (message, options = {}) => {
    toast.error(message, { duration: 3000, ...options });
  },

  info: (message, options = {}) => {
    toast(message, { duration: 2500, ...options });
  },

  // Copy link / Info confirmation
  copied: (text = "Link copied!") => {
    toast.success(text, {
      duration: 2000,
      description: "Ready to share.",
    });
  },

  // Delete with Undo
  deletedWithUndo: (message, onUndo, duration = 5000) => {
    toast.warning(message, {
      duration,
      action: {
        label: "Undo",
        onClick: () => {
          if (typeof onUndo === "function") onUndo();
          toast.success("Action undone", { duration: 1500 });
        },
      },
    });
  },

  // Custom flexible toast
  custom: (message, options = {}) => {
    toast(message, { ...options });
  },
};
