"use client";
import React, { useState } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";

export default function ProductsHeader({
  totalResults,
  searchTerm,
  onFilterOpen,
}) {
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Sıralama");

  const sortOptions = [
    { value: "default", label: "Sıralama" },
    { value: "price_asc", label: "Ucuzdan bahaya" },
    { value: "price_desc", label: "Bahadan ucuza" },
    { value: "newest", label: "Ən yeni" },
    { value: "popular", label: "Ən populyar" },
  ];

  return (
    <div className="flex items-center justify-end mb-6">
      {/* <h1 className="text-lg lg:text-xl font-medium text-gray-900">
        <span className="text-[#00569C]">"{searchTerm}"</span> üzrə {totalResults} nəticə
      </h1> */}

      <button
        onClick={onFilterOpen}
        className="lg:hidden flex items-center gap-2 text-gray-600 text-sm font-medium cursor-pointer"
      >
        <span>Filter</span>
        <SlidersHorizontal className="w-5 h-5" />
      </button>

      <div className="hidden lg:block relative">
        <button
          onClick={() => setSortOpen(!sortOpen)}
          className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg bg-white hover:bg-gray-50 transition-colors cursor-pointer min-w-[160px] justify-between"
        >
          <span className="text-sm text-gray-700">{selectedSort}</span>
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
            <div className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[160px] py-1">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSelectedSort(option.label);
                    setSortOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors cursor-pointer ${
                    selectedSort === option.label
                      ? "text-[#00569C] bg-blue-50"
                      : "text-gray-700"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
