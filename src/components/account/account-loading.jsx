"use client";

import { cn } from "@/lib/utils";

export function SkeletonBlock({ className }) {
  return <div className={cn("bg-gray-200 rounded animate-pulse", className)} />;
}

export function AccountRowSkeleton({ contained = false }) {
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 animate-pulse p-4",
        !contained && "bg-white border border-gray-200 rounded-xl"
      )}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <SkeletonBlock className="w-10 h-10 rounded-full shrink-0" />
        <div className="flex flex-col gap-2 min-w-0 flex-1">
          <SkeletonBlock className="h-4 w-32" />
          <SkeletonBlock className="h-3 w-48" />
          <SkeletonBlock className="h-3 w-28" />
        </div>
      </div>
      <SkeletonBlock className="h-9 w-20 rounded-full shrink-0" />
    </div>
  );
}

export function AccountListLoading({
  count = 3,
  showTitle = false,
  contained = false,
  className,
}) {
  if (contained) {
    return (
      <div
        className={cn(
          "bg-white border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100",
          className
        )}
      >
        {Array.from({ length: count }).map((_, i) => (
          <AccountRowSkeleton key={i} contained />
        ))}
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {showTitle && (
        <>
          <SkeletonBlock className="h-8 w-52" />
          <SkeletonBlock className="h-4 w-64" />
        </>
      )}
      {Array.from({ length: count }).map((_, i) => (
        <AccountRowSkeleton key={i} />
      ))}
    </div>
  );
}

export function AccountGridLoading({ count = 6, showTitle = false, className }) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      {showTitle && (
        <SkeletonBlock className="h-8 w-52 hidden lg:block" />
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-xl p-4 bg-white animate-pulse"
          >
            <div className="flex flex-col gap-3">
              <SkeletonBlock className="h-4 w-3/4" />
              <SkeletonBlock className="h-3 w-full" />
              <SkeletonBlock className="h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AccountDetailLoading({ className }) {
  return (
    <div className={cn("flex flex-col gap-6 animate-pulse", className)}>
      <SkeletonBlock className="h-8 w-64" />
      <div className="border border-gray-200 rounded-xl p-6 bg-white space-y-4">
        <SkeletonBlock className="h-6 w-48" />
        <SkeletonBlock className="h-4 w-full" />
        <SkeletonBlock className="h-4 w-3/4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <SkeletonBlock className="h-20 rounded-xl" />
          <SkeletonBlock className="h-20 rounded-xl" />
        </div>
      </div>
      <AccountListLoading count={2} />
    </div>
  );
}
