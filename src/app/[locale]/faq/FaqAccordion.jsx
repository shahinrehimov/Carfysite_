"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FaqAccordion({ items }) {
  const [openId, setOpenId] = useState(null);

  if (!items?.length) {
    return null;
  }

  return (
    <div className="space-y-3">
      {items.map((faq) => {
        const isOpen = openId === faq.id;

        return (
          <div
            key={faq.id}
            className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
          >
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : faq.id)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-gray-50"
              aria-expanded={isOpen}
            >
              <span className="text-sm font-semibold text-gray-900 lg:text-base">
                {faq.question}
              </span>
              <ChevronDown
                className={cn(
                  "h-5 w-5 shrink-0 text-gray-500 transition-transform duration-200",
                  isOpen && "rotate-180",
                )}
              />
            </button>
            {isOpen && (
              <div className="border-t border-gray-100 px-5 py-4">
                <div
                  className="prose prose-gray max-w-none text-sm leading-relaxed text-gray-600"
                  dangerouslySetInnerHTML={{ __html: faq.answer }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
