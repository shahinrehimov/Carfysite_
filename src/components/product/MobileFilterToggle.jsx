"use client";
import React, { useState } from "react";
import ProductsHeader from "./ProductsHeader";
import SidebarFilter from "@/components/filter/SidebarFilter";

export default function MobileFilterToggle({ totalResults, searchTerm }) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <>
      <ProductsHeader
        totalResults={totalResults}
        searchTerm={searchTerm}
        onFilterOpen={() => setIsFilterOpen(true)}
      />

      {/* Mobile Filter Modal - Only on Mobile */}
      <div className="lg:hidden">
        <SidebarFilter
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
        />
      </div>
    </>
  );
}

