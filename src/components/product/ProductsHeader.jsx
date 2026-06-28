"use client";
import React, { useMemo, useState } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import { useProductFilters } from "@/hooks/useProductFilters";
import { useTranslations } from "next-intl";

export default function ProductsHeader({
  totalResults,
  searchTerm,
  onFilterOpen,
}) {
  const t = useTranslations();
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState(null);
  const router = useRouter();
  const { data: filterData } = useProductFilters();

  const sortOptions = useMemo(() => {
    const opts = filterData?.sortOptions ?? [];
    const types = filterData?.sortTypes ?? [];
    if (!opts.length || !types.length) return [];
    const combined = [];
    for (const opt of opts) {
      for (const type of types) {
        combined.push({
          value: `${opt.id}_${type.id}`,
          label: `${opt.title} (${type.title})`,
          sort_option: opt.id,
          sort_type: type.id,
        });
      }
    }
    return combined;
  }, [filterData]);

  const selectedLabel = selectedSort?.label ?? t("sort");

  const handleSortSelect = (option) => {
    setSelectedSort(option);
    setSortOpen(false);
    const params = new URLSearchParams(
      typeof window !== "undefined" ? window.location.search : ""
    );
    params.set("sort_option", option.sort_option);
    params.set("sort_type", option.sort_type);
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="flex items-center justify-end mb-6">
      <button
        onClick={onFilterOpen}
        className="lg:hidden flex items-center gap-2 text-gray-600 text-sm font-medium cursor-pointer"
      >
        <span>{t("filter")}</span>
        <SlidersHorizontal className="w-5 h-5" />
      </button>

      <div className="hidden lg:block relative">
        <button
          onClick={() => setSortOpen(!sortOpen)}
          className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors cursor-pointer min-w-[180px] justify-between"
        >
          <span className="text-sm text-gray-700">{selectedLabel}</span>
          <ChevronDown
            className={`w-4 h-4 text-gray-500 transition-transform ${
              sortOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {sortOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setSortOpen(false)}
            />
            <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[180px] py-1">
              {sortOptions.length === 0 ? (
                <p className="px-4 py-2 text-sm text-gray-400">{t("loading")}</p>
              ) : (
                sortOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleSortSelect(option)}
                    className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors cursor-pointer ${
                      selectedSort?.value === option.value
                        ? "text-[#00569C] bg-blue-50"
                        : "text-gray-700"
                    }`}
                  >
                    {option.label}
                  </button>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
