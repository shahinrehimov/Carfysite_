import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { ChevronRight, MoreHorizontal } from "lucide-react";

import { cn } from "@/lib/utils";

function Breadcrumb({ ...props }) {
  return (
    <nav
      aria-label="breadcrumb"
      data-slot="breadcrumb"
      className="relative"
      {...props}
    />
  );
}

function BreadcrumbList({ className, ...props }) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "flex flex-wrap items-center gap-0 lg:gap-1 text-sm text-slate-600 dark:text-slate-400",
        className
      )}
      {...props}
    />
  );
}

function BreadcrumbItem({ className, ...props }) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn(
        "inline-flex items-center gap-1 lg:gap-1.5",
        "transition-all duration-200 ease-in-out",
        className
      )}
      {...props}
    />
  );
}

function BreadcrumbLink({ asChild, className, ...props }) {
  const Comp = asChild ? Slot : "a";

  return (
    <Comp
      data-slot="breadcrumb-link"
      className={cn(
        "inline-flex items-center px-2 py-1 rounded-md",
        " text-[14px] lg:text-lg text-[#7B7B7B] transition-all duration-200 ease-in-out font-regular",
        className
      )}
      {...props}
    />
  );
}

function BreadcrumbPage({ className, ...props }) {
  return (
    <span
      data-slot="breadcrumb-page"
      role="link"
      aria-disabled="true"
      aria-current="page"
      className={cn(
        "inline-flex items-center px-2 py-1 rounded-md",
        "text-[#00569C] font-semibold text-[14px] lg:text-lg",
        className
      )}
      {...props}
    />
  );
}

function BreadcrumbSeparator({ children, className, ...props }) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn(
        "flex items-center justify-center",
        "text-[14px] lg:text-lg",
        className
      )}
      {...props}
    >
      {children ?? <ChevronRight className="drop-shadow-sm" />}
    </li>
  );
}

function BreadcrumbEllipsis({ className, ...props }) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      role="presentation"
      aria-hidden="true"
      className={cn(
        "flex size-8 items-center justify-center rounded-md",
        "text-slate-500 dark:text-slate-400",
        "hover:text-slate-700 dark:hover:text-slate-300",
        "hover:bg-white/80 dark:hover:bg-slate-700/60",
        "border border-transparent hover:border-slate-200/60 dark:hover:border-slate-600/60",
        "transition-all duration-200 ease-in-out",
        "cursor-pointer",
        className
      )}
      {...props}
    >
      <MoreHorizontal className="size-4" />
      <span className="sr-only">Show more breadcrumbs</span>
    </span>
  );
}

export {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
};
