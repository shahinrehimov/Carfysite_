"use client";

import { cn } from "@/lib/utils";
import { getOpensAtShortLabel, isSellerClosed } from "@/lib/storeAvailability";

/**
 * Compact open/closed badge for product cards and lists.
 */
export default function StoreAvailabilityBadge({
  seller,
  className,
  t,
  /** When true, badge is hidden for open stores (product cards). */
  closedOnly = false,
}) {
  if (!seller?.availability) return null;

  const closed = isSellerClosed(seller);
  if (closedOnly && !closed) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[11px] lg:text-xs font-medium",
        closed ? "text-red-600" : "text-green-700",
        className
      )}
    >
      <span
        className={cn(
          "inline-block w-1.5 h-1.5 rounded-full shrink-0",
          closed ? "bg-red-500" : "bg-green-500"
        )}
        aria-hidden
      />
      {closed ? t("store_closed") : t("store_open")}
    </span>
  );
}
