"use client";

import React, { createContext, useContext, useCallback, useState } from "react";
import { Toast, ToastContainer } from "@/components/ui/toast";
import { useTranslations } from "next-intl";

const ToastContext = createContext(undefined);

let toastCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ 
    title, 
    description, 
    variant = "info", 
    duration = 5000,
    action 
  }) => {
    const id = ++toastCounter;
    const toast = {
      id,
      title,
      description,
      variant,
      action
    };

    setToasts(prev => [...prev, toast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const removeAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{
      addToast,
      removeToast,
      removeAllToasts,
      toasts
    }}>
      {children}
      {toasts.length > 0 && (
        <ToastContainer>
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              variant={toast.variant}
              title={toast.title}
              description={toast.description}
              action={toast.action}
              onClose={() => removeToast(toast.id)}
              className="mb-2"
            />
          ))}
        </ToastContainer>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  const { addToast, removeToast, removeAllToasts } = context;
  const t = useTranslations();

  return {
    toast: addToast,
    success: (message, options = {}) => 
      addToast({ 
        variant: "success", 
        title: options.title || t("success"),
        description: message,
        ...options 
      }),
    error: (message, options = {}) => 
      addToast({ 
        variant: "error", 
        title: options.title || t("error"),
        description: message,
        ...options 
      }),
    warning: (message, options = {}) => 
      addToast({ 
        variant: "warning", 
        title: options.title || t("warning"),
        description: message,
        ...options 
      }),
    info: (message, options = {}) => 
      addToast({ 
        variant: "info", 
        title: options.title || t("info"),
        description: message,
        ...options 
      }),
    dismiss: removeToast,
    dismissAll: removeAllToasts
  };
}

