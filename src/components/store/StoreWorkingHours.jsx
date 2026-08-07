"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatWorkingHourRow } from "@/lib/storeAvailability";

/**
 * Collapsible weekly schedule — only shown when working_hours is non-empty.
 */
export default function StoreWorkingHours({ workingHours, t }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!workingHours?.length) return null;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between gap-2 px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
        aria-expanded={isOpen}
      >
        <span>{t("workingHours")}</span>
        <ChevronDown
          className={cn(
            "w-4 h-4 text-gray-500 transition-transform",
            isOpen && "rotate-180"
          )}
        />
      </button>

      {isOpen && (
        <div className="px-4 py-3 space-y-2 bg-white">
          {workingHours.map((row) => {
            const { day, hours } = formatWorkingHourRow(row, t);
            return (
              <div
                key={row.day_of_week}
                className="flex items-center justify-between text-sm"
              >
                <span className="text-gray-600">{day}</span>
                <span
                  className={cn(
                    "font-medium",
                    row.is_closed ? "text-gray-400" : "text-gray-900"
                  )}
                >
                  {hours}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
