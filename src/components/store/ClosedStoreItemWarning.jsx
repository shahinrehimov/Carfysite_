"use client";

import { isSellerClosed } from "@/lib/storeAvailability";

/**
 * Small inline warning when a cart item's seller is currently closed.
 */
export default function ClosedStoreItemWarning({ seller, t }) {
  if (!isSellerClosed(seller)) return null;

  const message = seller.availability?.message;

  return (
    <div className="mt-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-2.5 py-1.5">
      {message || t("store_closed")}
    </div>
  );
}
