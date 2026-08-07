"use client";

import StoreAvailabilityBadge from "./StoreAvailabilityBadge";
import StoreWorkingHours from "./StoreWorkingHours";
import { isSellerClosed } from "@/lib/storeAvailability";

/**
 * Seller availability section for product detail page.
 */
export default function SellerAvailabilityBlock({ seller, t }) {
  if (!seller) return null;

  const availability = seller.availability;
  const closed = isSellerClosed(seller);

  return (
    <div className="mt-4 p-4 border border-gray-200 rounded-xl bg-gray-50/50 space-y-3">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span className="text-sm font-semibold text-gray-900">
          {seller.label || seller.seller_label || seller.store_code}
        </span>
        {availability && <StoreAvailabilityBadge seller={seller} t={t} />}
      </div>

      {closed && availability?.message && (
        <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
          {availability.message}
        </p>
      )}

      <StoreWorkingHours workingHours={seller.working_hours} t={t} />
    </div>
  );
}
