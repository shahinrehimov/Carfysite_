"use client";

import * as React from "react";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const toastVariants = {
  success: {
    className: "border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/30 dark:text-green-200",
    icon: CheckCircle,
    iconClassName: "text-green-600 dark:text-green-400"
  },
  error: {
    className: "border-red-200 bg-red-50 text-red-800 dark:border-red-800 dark:bg-red-900/30 dark:text-red-200",
    icon: AlertCircle,
    iconClassName: "text-red-600 dark:text-red-400"
  },
  warning: {
    className: "border-yellow-200 bg-yellow-50 text-yellow-800 dark:border-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200",
    icon: AlertTriangle,
    iconClassName: "text-yellow-600 dark:text-yellow-400"
  },
  info: {
    className: "border-blue-200 bg-blue-50 text-blue-800 dark:border-blue-800 dark:bg-blue-900/30 dark:text-blue-200",
    icon: Info,
    iconClassName: "text-blue-600 dark:text-blue-400"
  }
};

const Toast = React.forwardRef(({ 
  className, 
  variant = "info", 
  title,
  description,
  onClose,
  action,
  ...props 
}, ref) => {
  const variantConfig = toastVariants[variant];
  const Icon = variantConfig.icon;

  return (
    <div
      ref={ref}
      className={cn(
        "group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-4 pr-8 shadow-lg transition-all",
        "animate-in slide-in-from-right-full",
        variantConfig.className,
        className
      )}
      {...props}
    >
      <div className="flex items-center space-x-3">
        <Icon className={cn("h-5 w-5 flex-shrink-0", variantConfig.iconClassName)} />
        <div className="grid gap-1">
          {title && (
            <div className="text-sm font-semibold">{title}</div>
          )}
          {description && (
            <div className="text-sm opacity-90">{description}</div>
          )}
        </div>
      </div>
      {action && (
        <div className="flex flex-shrink-0">{action}</div>
      )}
      <button
        onClick={onClose}
        className={cn(
          "absolute right-2 top-2 rounded-md p-1 opacity-0 transition-opacity hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100",
          variantConfig.iconClassName.replace("text-", "hover:text-").replace("dark:text-", "focus:ring-")
        )}
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </button>
    </div>
  );
});

Toast.displayName = "Toast";

const ToastContainer = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
));

ToastContainer.displayName = "ToastContainer";

export { Toast, ToastContainer, toastVariants };

