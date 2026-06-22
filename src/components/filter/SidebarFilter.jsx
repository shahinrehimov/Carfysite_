"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronDown, Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useProductFilters } from "@/hooks/useProductFilters";
import {
  brandOptionsFromBrands,
  modelOptionsForBrandSlug,
} from "@/lib/productFilters";

function firstParam(searchParams, key) {
  const val = searchParams?.[key];
  return Array.isArray(val) ? val[0] : (val ?? "");
}

function FilterSection({
  title,
  sectionKey,
  options,
  value,
  onChange,
  emptyHint,
  isExpanded,
  onToggle,
}) {
  return (
    <div className="border-b border-gray-100 pb-4">
      <button
        type="button"
        onClick={() => onToggle(sectionKey)}
        className="w-full flex items-center justify-between py-2 cursor-pointer"
      >
        <span className="text-[15px] text-gray-800 font-medium">{title}</span>
        <div className="w-7 h-7 rounded-full bg-[#FF6B35] flex items-center justify-center">
          <ChevronDown
            className={cn(
              "w-4 h-4 text-white transition-transform duration-300",
              isExpanded ? "rotate-180" : ""
            )}
          />
        </div>
      </button>

      {isExpanded && (
        <div className="mt-2 overflow-hidden">
        {options.length === 0 && emptyHint ? (
          <p className="text-sm text-gray-500 py-1">{emptyHint}</p>
        ) : (
          <div className="h-[200px] overflow-y-auto overscroll-y-contain contain-strict space-y-2 pr-1">
            {options.map((option) => {
              const isChecked = value === option.value;
              return (
                <label
                  key={option.value}
                  className="flex items-center gap-2.5 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    name={sectionKey}
                    value={option.value}
                    checked={isChecked}
                    onChange={() =>
                      onChange(isChecked ? "" : option.value)
                    }
                    className="sr-only"
                  />
                  <div
                    className={cn(
                      "w-4 h-4 rounded shrink-0 border-2 flex items-center justify-center transition-all duration-150",
                      isChecked
                        ? "bg-[#00569C] border-[#00569C]"
                        : "bg-white border-gray-300 group-hover:border-[#00569C]"
                    )}
                  >
                    {isChecked && (
                      <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                    )}
                  </div>
                  <span className="text-sm text-gray-600 select-none">
                    {option.label}
                  </span>
                </label>
              );
            })}
          </div>
        )}
        </div>
      )}
    </div>
  );
}

export default function SidebarFilter({ isOpen, onClose, initialFilters, mode = "desktop" }) {
  const t = useTranslations();
  const router = useRouter();
  const { data: filterData } = useProductFilters();
  const brands = filterData?.brands ?? [];
  const cities = filterData?.cities ?? [];
  const [expandedSections, setExpandedSections] = useState({
    city: false,
    marka: false,
    model: false,
    rating: false,
  });
  const [currency, setCurrency] = useState("AZN");
  const [sortOption, setSortOption] = useState("");
  const [selectedCity, setSelectedCity] = useState(() => firstParam(initialFilters, "city_id"));
  const [selectedMarka, setSelectedMarka] = useState(() => firstParam(initialFilters, "brands[]"));
  const [selectedModel, setSelectedModel] = useState(() => firstParam(initialFilters, "models[]"));
  const [selectedRating, setSelectedRating] = useState("");
  const [minPrice, setMinPrice] = useState(() => firstParam(initialFilters, "min_price"));
  const [maxPrice, setMaxPrice] = useState(() => firstParam(initialFilters, "max_price"));
  const [minYear, setMinYear] = useState(() => firstParam(initialFilters, "min_year"));
  const [maxYear, setMaxYear] = useState(() => firstParam(initialFilters, "max_year"));

  // Derive individual values so they can be stable dep array entries
  const pCity   = firstParam(initialFilters, "city_id");
  const pMarka  = firstParam(initialFilters, "brands[]");
  const pModel  = firstParam(initialFilters, "models[]");
  const pMinPrice = firstParam(initialFilters, "min_price");
  const pMaxPrice = firstParam(initialFilters, "max_price");
  const pMinYear  = firstParam(initialFilters, "min_year");
  const pMaxYear  = firstParam(initialFilters, "max_year");

  // Sync state when URL params change (e.g. after MainFilter submits)
  useEffect(() => {
    setSelectedCity(pCity);
    setSelectedMarka(pMarka);
    setSelectedModel(pModel);
    setMinPrice(pMinPrice);
    setMaxPrice(pMaxPrice);
    setMinYear(pMinYear);
    setMaxYear(pMaxYear);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pCity, pMarka, pModel, pMinPrice, pMaxPrice, pMinYear, pMaxYear]);

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleMarkaChange = (val) => {
    if (val !== selectedMarka) {
      setSelectedModel("");
    }
    setSelectedMarka(val);
  };

  const markaOptions = useMemo(
    () => brandOptionsFromBrands(brands),
    [brands]
  );
  const modelOptions = useMemo(
    () => modelOptionsForBrandSlug(brands, selectedMarka),
    [brands, selectedMarka]
  );
  const cityOptions = useMemo(
    () =>
      cities.map((c) => ({
        value: String(c.id),
        label: c.title,
      })),
    [cities]
  );

  const modelSectionEmptyHint = !selectedMarka
    ? t("first_select_brand")
    : modelOptions.length === 0
      ? t("no_models_for_brand")
      : null;

  const handleReset = () => {
    setSelectedCity("");
    setSelectedMarka("");
    setSelectedModel("");
    setSelectedRating("");
    setMinPrice("");
    setMaxPrice("");
    setMinYear("");
    setMaxYear("");
    setSortOption("");
    router.push("/products");
  };

  const buildFilterParams = () => {
    const params = new URLSearchParams();
    if (selectedMarka) params.append("brands[]", selectedMarka);
    if (selectedModel) params.append("models[]", selectedModel);
    if (selectedCity) params.set("city_id", selectedCity);
    if (minPrice) params.set("min_price", minPrice);
    if (maxPrice) params.set("max_price", maxPrice);
    if (minYear) params.set("min_year", minYear);
    if (maxYear) params.set("max_year", maxYear);
    if (sortOption) {
      const [opt, type] = sortOption.split("_");
      params.set("sort_option", opt);
      params.set("sort_type", type);
    }
    return params;
  };

  const handleSubmit = () => {
    const params = buildFilterParams();
    const qs = params.toString();
    router.push(qs ? `/products?${qs}` : "/products");
  };

  const ratingOptions = [
    { value: "5", label: "5 ulduz" },
    { value: "4", label: "4+ ulduz" },
    { value: "3", label: "3+ ulduz" },
  ];

  if (mode === "mobile") {
    if (!isOpen) return null;

    return (
      <>
        {/* Overlay */}
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-[24px] max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">{t("filter")}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        <div className="p-5 space-y-1">
          <FilterSection
            title={t("city")}
            sectionKey="city"
            options={cityOptions}
            value={selectedCity}
            onChange={setSelectedCity}
            isExpanded={expandedSections.city}
            onToggle={toggleSection}
          />

          <FilterSection
            title={t("brand")}
            sectionKey="marka"
            options={markaOptions}
            value={selectedMarka}
            onChange={handleMarkaChange}
            isExpanded={expandedSections.marka}
            onToggle={toggleSection}
          />

          <FilterSection
            title={t("model")}
            sectionKey="model"
            options={modelOptions}
            value={selectedModel}
            onChange={setSelectedModel}
            emptyHint={modelSectionEmptyHint}
            isExpanded={expandedSections.model}
            onToggle={toggleSection}
          />

          <FilterSection
            title={t("rating")}
            sectionKey="rating"
            options={ratingOptions}
            value={selectedRating}
            onChange={setSelectedRating}
            isExpanded={expandedSections.rating}
            onToggle={toggleSection}
          />

          {/* Price */}
          <div className="py-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[15px] text-gray-800 font-medium">{t("price")}</span>
              <div className="flex rounded-full border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setCurrency("AZN")}
                  className={cn(
                    "px-3 py-1 text-xs font-medium transition-colors cursor-pointer",
                    currency === "AZN" ? "bg-gray-100 text-gray-800" : "text-gray-500"
                  )}
                >
                  AZN
                </button>
                <button
                  onClick={() => setCurrency("USD")}
                  className={cn(
                    "px-3 py-1 text-xs font-medium transition-colors cursor-pointer",
                    currency === "USD" ? "bg-gray-100 text-gray-800" : "text-gray-500"
                  )}
                >
                  USD
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={t("price_min")}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="flex-1 h-10 px-3 border border-gray-200 rounded-lg text-sm text-gray-600 placeholder:text-gray-400 outline-none focus:border-[#00569C]"
              />
              <input
                type="text"
                placeholder={t("price_max")}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="flex-1 h-10 px-3 border border-gray-200 rounded-lg text-sm text-gray-600 placeholder:text-gray-400 outline-none focus:border-[#00569C]"
              />
            </div>
          </div>

          {/* Year */}
          <div className="py-4 border-b border-gray-100">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder={t("year_min")}
                value={minYear}
                onChange={(e) => setMinYear(e.target.value)}
                className="flex-1 h-10 px-3 border border-gray-200 rounded-lg text-sm text-gray-600 placeholder:text-gray-400 outline-none focus:border-[#00569C]"
              />
              <input
                type="text"
                placeholder={t("max")}
                value={maxYear}
                onChange={(e) => setMaxYear(e.target.value)}
                className="flex-1 h-10 px-3 border border-gray-200 rounded-lg text-sm text-gray-600 placeholder:text-gray-400 outline-none focus:border-[#00569C]"
              />
            </div>
          </div>

          {/* Sorting Options - Mobile Only */}
          <div className="py-4 border-b border-gray-100">
            <label className="flex items-center justify-between py-2 cursor-pointer group">
              <span className="text-sm text-gray-700">{t("price_asc")}</span>
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-150",
                  sortOption === "price_asc"
                    ? "border-[#00569C]"
                    : "border-gray-300 group-hover:border-[#00569C]"
                )}
              >
                {sortOption === "price_asc" && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00569C]" />
                )}
              </div>
              <input
                type="radio"
                name="sort"
                value="price_asc"
                checked={sortOption === "price_asc"}
                onChange={(e) => setSortOption(e.target.value)}
                className="sr-only"
              />
            </label>
            <label className="flex items-center justify-between py-2 cursor-pointer group">
              <span className="text-sm text-gray-700">{t("price_desc")}</span>
              <div
                className={cn(
                  "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-150",
                  sortOption === "price_desc"
                    ? "border-[#00569C]"
                    : "border-gray-300 group-hover:border-[#00569C]"
                )}
              >
                {sortOption === "price_desc" && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#00569C]" />
                )}
              </div>
              <input
                type="radio"
                name="sort"
                value="price_desc"
                checked={sortOption === "price_desc"}
                onChange={(e) => setSortOption(e.target.value)}
                className="sr-only"
              />
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 space-y-3">
            <button
              onClick={() => { handleSubmit(); onClose(); }}
              className="w-full h-12 bg-gradient-to-r from-[#3696E7] to-[#00569C] text-white text-base font-medium rounded-full cursor-pointer hover:opacity-90 transition-opacity"
            >
              {t("show")}
            </button>

            <button
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-2 text-[#00569C] text-sm font-light cursor-pointer hover:opacity-80 transition-opacity"
            >
              {t("reset")}
              <Image src="/icons/reset-primary.svg" alt="reset" width={16} height={16} />
            </button>
          </div>
        </div>
      </div>
    </>
    );
  }

  return (
    <div className="bg-white rounded-[20px] p-5 shadow-sm">
      <FilterSection
        title={t("city")}
        sectionKey="city"
        options={cityOptions}
        value={selectedCity}
        onChange={setSelectedCity}
        isExpanded={expandedSections.city}
        onToggle={toggleSection}
      />

      <FilterSection
        title={t("brand")}
        sectionKey="marka"
        options={markaOptions}
        value={selectedMarka}
        onChange={handleMarkaChange}
        isExpanded={expandedSections.marka}
        onToggle={toggleSection}
      />

      <FilterSection
        title={t("model")}
        sectionKey="model"
        options={modelOptions}
        value={selectedModel}
        onChange={setSelectedModel}
        emptyHint={modelSectionEmptyHint}
        isExpanded={expandedSections.model}
        onToggle={toggleSection}
      />

      <FilterSection
        title={t("rating")}
        sectionKey="rating"
        options={ratingOptions}
        value={selectedRating}
        onChange={setSelectedRating}
        isExpanded={expandedSections.rating}
        onToggle={toggleSection}
      />

      {/* Price */}
      <div className="py-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[15px] text-gray-800 font-medium">{t("price")}</span>
          <div className="flex rounded-full border border-gray-200 overflow-hidden">
            <button
              onClick={() => setCurrency("AZN")}
              className={cn(
                "px-3 py-1 text-xs font-medium transition-colors cursor-pointer",
                currency === "AZN" ? "bg-gray-100 text-gray-800" : "text-gray-500"
              )}
            >
              AZN
            </button>
            <button
              onClick={() => setCurrency("USD")}
              className={cn(
                "px-3 py-1 text-xs font-medium transition-colors cursor-pointer",
                currency === "USD" ? "bg-gray-100 text-gray-800" : "text-gray-500"
              )}
            >
              USD
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder={t("price_min")}
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="flex-1 w-full h-10 px-3 border border-gray-200 rounded-lg text-sm text-gray-600 placeholder:text-gray-400 outline-none focus:border-[#00569C]"
          />
          <input
            type="text"
            placeholder={t("price_max")}
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="flex-1 w-full h-10 px-3 border border-gray-200 rounded-lg text-sm text-gray-600 placeholder:text-gray-400 outline-none focus:border-[#00569C]"
          />
        </div>
      </div>

      {/* Year */}
      <div className="py-4">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder={t("year_min")}
            value={minYear}
            onChange={(e) => setMinYear(e.target.value)}
            className="flex-1 w-full h-10 px-3 border border-gray-200 rounded-lg text-sm text-gray-600 placeholder:text-gray-400 outline-none focus:border-[#00569C]"
          />
          <input
            type="text"
            placeholder={t("max")}
            value={maxYear}
            onChange={(e) => setMaxYear(e.target.value)}
            className="flex-1 w-full h-10 px-3 border border-gray-200 rounded-lg text-sm text-gray-600 placeholder:text-gray-400 outline-none focus:border-[#00569C]"
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full h-12 bg-gradient-to-r from-[#3696E7] to-[#00569C] text-white text-base font-medium rounded-full cursor-pointer hover:opacity-90 transition-opacity"
      >
        {t("show")}
      </button>

      <button
        onClick={handleReset}
        className="w-full flex items-center justify-center gap-2 mt-4 text-[#00569C] text-sm font-light cursor-pointer hover:opacity-80 transition-opacity"
      >
        <Image src="/icons/reset-primary.svg" alt="reset" width={16} height={16} />
        {t("reset")}
      </button>
    </div>
  );
}
