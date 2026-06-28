"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronRight, ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import {
  fetchCategoriesWithSubs,
  getCachedCategoriesWithSubs,
} from "@/lib/productFilters";

export default function MobileCategoriesModal({ isOpen, onClose }) {
  const t = useTranslations();
  const router = useRouter();
  const [categories, setCategories] = useState(() => getCachedCategoriesWithSubs() ?? []);
  const [loading, setLoading] = useState(() => !getCachedCategoriesWithSubs());
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showSubcategories, setShowSubcategories] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setShowSubcategories(false);
      setSelectedCategory(null);
      return;
    }

    let cancelled = false;
    setLoading(!getCachedCategoriesWithSubs());

    fetchCategoriesWithSubs()
      .then((data) => {
        if (!cancelled) setCategories(data);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isOpen]);

  const navigateToCategory = (category) => {
    const params = new URLSearchParams();
    params.append("categories[]", category.slug);
    handleClose();
    router.push(`/products?${params.toString()}`);
  };

  const navigateToSubcategory = (category, subcategory) => {
    const params = new URLSearchParams();
    params.append("categories[]", category.slug);
    params.append("sub_categories[]", subcategory.slug);
    handleClose();
    router.push(`/products?${params.toString()}`);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setShowSubcategories(true);
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
                  showSubcategories
                    ? "-translate-x-full pointer-events-none"
                    : "translate-x-0"
                }`}
              >
                {loading ? (
                  <p className="text-gray-500 text-sm text-center py-8">
                    {t("loading")}
                  </p>
                ) : categories.length > 0 ? (
                  categories.map((category) => (
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
                  ))
                ) : (
                  <p className="text-gray-500 text-sm text-center py-8">
                    {t("no_subcategories")}
                  </p>
                )}
              </div>

              {/* Subcategories */}
              <div
                className={`absolute inset-0 overflow-y-auto bg-white transition-transform duration-300 ease-out ${
                  showSubcategories
                    ? "translate-x-0 z-10"
                    : "translate-x-full pointer-events-none"
                }`}
              >
                {selectedCategory && (
                  <div className="p-4 space-y-2">
                    <button
                      onClick={() => navigateToCategory(selectedCategory)}
                      className="block w-full text-left text-base text-[#3696E7] font-medium hover:text-[#00569C] transition-colors py-3 px-2 cursor-pointer rounded-lg hover:bg-gray-50 active:bg-gray-50 border-b border-gray-100 mb-2"
                    >
                      {t("view_all")} →
                    </button>
                    {selectedCategory.subcategories.length > 0 ? (
                      selectedCategory.subcategories.map((subcategory) => (
                        <button
                          key={subcategory.id}
                          onClick={() =>
                            navigateToSubcategory(selectedCategory, subcategory)
                          }
                          className="block w-full text-left text-base text-[#1A1A1A] hover:text-[#3696E7] active:text-[#3696E7] transition-colors py-3 px-2 cursor-pointer rounded-lg hover:bg-gray-50 active:bg-gray-50"
                        >
                          {subcategory.name}
                        </button>
                      ))
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
