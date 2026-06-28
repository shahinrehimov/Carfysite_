"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { X, ChevronRight, ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";

const CATEGORY_DEFINITIONS = [
  {
    id: 1,
    nameKey: "category_engine_parts",
    subcategoryKeys: [
      "subcategory_engine_kits",
      "subcategory_piston_valve_rod_crank",
      "subcategory_chain_belt_kits",
      "subcategory_turbo_compressors",
      "subcategory_sensors",
    ],
  },
  { id: 2, nameKey: "category_cooling_heating", subcategoryKeys: [] },
  { id: 3, nameKey: "category_transmission", subcategoryKeys: [] },
  { id: 4, nameKey: "category_suspension_steering", subcategoryKeys: [] },
  { id: 5, nameKey: "category_brake_system", subcategoryKeys: [] },
  { id: 6, nameKey: "category_electrical_electronics", subcategoryKeys: [] },
  { id: 7, nameKey: "category_body", subcategoryKeys: [] },
  { id: 8, nameKey: "category_interior_comfort", subcategoryKeys: [] },
  { id: 9, nameKey: "category_filters_fluids", subcategoryKeys: [] },
  { id: 10, nameKey: "category_wheels_accessories", subcategoryKeys: [] },
  { id: 11, nameKey: "category_accessories_other", subcategoryKeys: [] },
];

export default function MobileCategoriesModal({ isOpen, onClose }) {
  const t = useTranslations();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showSubcategories, setShowSubcategories] = useState(false);

  const categories = useMemo(
    () =>
      CATEGORY_DEFINITIONS.map((category) => ({
        id: category.id,
        name: t(category.nameKey),
        subcategories: category.subcategoryKeys.map((key) => t(key)),
      })),
    [t]
  );

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    if (category.subcategories.length > 0) {
      setShowSubcategories(true);
    }
  };

  const handleBack = () => {
    setShowSubcategories(false);
    setTimeout(() => setSelectedCategory(null), 300);
  };

  const handleClose = () => {
    setShowSubcategories(false);
    setSelectedCategory(null);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`lg:hidden fixed top-0 left-0 right-0 bottom-[65px] bg-[#00000066] z-40 transition-opacity duration-300 ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`lg:hidden fixed top-0 left-0 right-0 bottom-[65px] z-40 pointer-events-none ${
          isOpen ? "" : ""
        }`}
      >
        <div
          className={`absolute top-0 left-0 right-0 bottom-0 bg-white transition-transform duration-300 ease-out pointer-events-auto ${
            isOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              {showSubcategories ? (
                <button
                  onClick={handleBack}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
                >
                  <ChevronLeft size={24} className="text-gray-600" />
                </button>
              ) : (
                <Image
                  src="/images/logo.svg"
                  alt="Carfy"
                  width={100}
                  height={32}
                  className="h-8 w-auto"
                />
              )}
              <h2 className="text-lg font-semibold text-[#1A1A1A]">
                {showSubcategories ? selectedCategory?.name : t("categories")}
              </h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden relative">
              {/* Main Categories */}
              <div
                className={`absolute inset-0 overflow-y-auto transition-transform duration-300 ease-out ${
                  showSubcategories ? "-translate-x-full" : "translate-x-0"
                }`}
              >
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category)}
                    className="w-full flex items-center justify-between px-4 py-4 text-left border-b border-gray-100 active:bg-gray-50 cursor-pointer"
                  >
                    <span className="text-base text-[#1A1A1A]">
                      {category.name}
                    </span>
                    <ChevronRight size={20} className="text-gray-400" />
                  </button>
                ))}
              </div>

              {/* Subcategories */}
              <div
                className={`absolute inset-0 overflow-y-auto bg-white transition-transform duration-300 ease-out ${
                  showSubcategories ? "translate-x-0" : "translate-x-full"
                }`}
              >
                {selectedCategory && (
                  <div className="p-4 space-y-2">
                    {selectedCategory.subcategories.length > 0 ? (
                      selectedCategory.subcategories.map(
                        (subcategory, index) => (
                          <button
                            key={index}
                            className="block w-full text-left text-base text-[#1A1A1A] hover:text-[#3696E7] active:text-[#3696E7] transition-colors py-3 px-2 cursor-pointer rounded-lg hover:bg-gray-50 active:bg-gray-50"
                          >
                            {subcategory}
                          </button>
                        )
                      )
                    ) : (
                      <p className="text-gray-500 text-sm text-center py-8">
                        {t("no_subcategories")}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
