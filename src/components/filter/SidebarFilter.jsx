"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useProductFilters } from "@/hooks/useProductFilters";
import {
  brandOptionsFromBrands,
  modelOptionsForBrandId,
} from "@/lib/productFilters";

export default function SidebarFilter({ isOpen, onClose }) {
  const { data: filterData } = useProductFilters();
  const brands = filterData?.brands ?? [];
  const [expandedSections, setExpandedSections] = useState({
    city: false,
    marka: false,
    model: false,
    rating: false,
  });
  const [showMoreSections, setShowMoreSections] = useState({
    city: false,
    marka: false,
    model: false,
    rating: false,
  });
  const [currency, setCurrency] = useState("AZN");
  const [sortOption, setSortOption] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedMarka, setSelectedMarka] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedRating, setSelectedRating] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minYear, setMinYear] = useState("");
  const [maxYear, setMaxYear] = useState("");

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const toggleShowMore = (section) => {
    setShowMoreSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  useEffect(() => {
    setSelectedModel("");
  }, [selectedMarka]);

  const markaOptions = useMemo(
    () => brandOptionsFromBrands(brands),
    [brands]
  );
  const modelOptions = useMemo(
    () => modelOptionsForBrandId(brands, selectedMarka),
    [brands, selectedMarka]
  );

  const modelSectionEmptyHint =
    !selectedMarka
      ? "Əvvəlcə marka seçin"
      : modelOptions.length === 0
        ? "Bu marka üçün model yoxdur"
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
  };

  const cityOptions = [
    { value: "baku", label: "Bakı" },
    { value: "ganja", label: "Gəncə" },
    { value: "nakhchivan", label: "Naxçıvan" },
    { value: "shaki", label: "Şəki" },
    { value: "sumqayit", label: "Sumqayıt" },
    { value: "mingachevir", label: "Mingəçevir" },
    { value: "lankaran", label: "Lənkəran" },
    { value: "shirvan", label: "Şirvan" },
    { value: "quba", label: "Quba" },
    { value: "shamakhi", label: "Şamaxı" },
  ];

  const ratingOptions = [
    { value: "5", label: "5 ulduz" },
    { value: "4", label: "4+ ulduz" },
    { value: "3", label: "3+ ulduz" },
  ];

  const FilterSection = ({
    title,
    sectionKey,
    options,
    value,
    onChange,
    initialShowCount = 5,
    emptyHint,
  }) => {
    const showMore = showMoreSections[sectionKey];
    const displayOptions = showMore
      ? options
      : options.slice(0, initialShowCount);
    const hasMore = options.length > initialShowCount;

    return (
      <div className="border-b border-gray-100 pb-4">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full flex items-center justify-between py-2 cursor-pointer"
        >
          <span className="text-[15px] text-gray-800 font-medium">{title}</span>
          <div
            className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center transition-colors",
              expandedSections[sectionKey] ? "bg-[#FF6B35]" : "bg-[#FF6B35]"
            )}
          >
            <ChevronDown
              className={cn(
                "w-4 h-4 text-white transition-transform",
                expandedSections[sectionKey] ? "rotate-180" : ""
              )}
            />
          </div>
        </button>
        <div
          className={cn(
            "overflow-hidden transition-all duration-300",
            expandedSections[sectionKey] ? "max-h-[400px] mt-2" : "max-h-0"
          )}
        >
          <div className="space-y-2">
            {displayOptions.length === 0 && emptyHint ? (
              <p className="text-sm text-gray-500 py-1">{emptyHint}</p>
            ) : (
              displayOptions.map((option) => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    name={sectionKey}
                    value={option.value}
                    checked={value === option.value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-4 h-4 rounded border-gray-300 text-[#00569C] focus:ring-[#00569C]"
                  />
                  <span className="text-sm text-gray-600">{option.label}</span>
                </label>
              ))
            )}
          </div>

          {hasMore && displayOptions.length > 0 && (
            <button
              onClick={() => toggleShowMore(sectionKey)}
              className="mt-3 text-sm text-gray-600 underline hover:text-[#00569C] transition-colors cursor-pointer"
            >
              {showMore ? "Daha az" : "Daha çox"}
            </button>
          )}
        </div>
      </div>
    );
  };

  // Desktop Sidebar Filter
  const DesktopFilter = () => (
    <div className="bg-white rounded-[20px] p-5 shadow-sm">
      {/* City */}
      <FilterSection
        title="Şəhər"
        sectionKey="city"
        options={cityOptions}
        value={selectedCity}
        onChange={setSelectedCity}
      />

      {/* Marka */}
      <FilterSection
        title="Marka"
        sectionKey="marka"
        options={markaOptions}
        value={selectedMarka}
        onChange={setSelectedMarka}
      />

      {/* Model */}
      <FilterSection
        title="Model"
        sectionKey="model"
        options={modelOptions}
        value={selectedModel}
        onChange={setSelectedModel}
        emptyHint={modelSectionEmptyHint}
      />

      {/* Rating */}
      <FilterSection
        title="Reytinq"
        sectionKey="rating"
        options={ratingOptions}
        value={selectedRating}
        onChange={setSelectedRating}
      />

      {/* Price */}
      <div className="py-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[15px] text-gray-800 font-medium">Qiymət</span>
          <div className="flex rounded-full border border-gray-200 overflow-hidden">
            <button
              onClick={() => setCurrency("AZN")}
              className={cn(
                "px-3 py-1 text-xs font-medium transition-colors cursor-pointer",
                currency === "AZN"
                  ? "bg-gray-100 text-gray-800"
                  : "text-gray-500"
              )}
            >
              AZN
            </button>
            <button
              onClick={() => setCurrency("USD")}
              className={cn(
                "px-3 py-1 text-xs font-medium transition-colors cursor-pointer",
                currency === "USD"
                  ? "bg-gray-100 text-gray-800"
                  : "text-gray-500"
              )}
            >
              USD
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Min. qiymət"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="flex-1 w-full h-10 px-3 border border-gray-200 rounded-lg text-sm text-gray-600 placeholder:text-gray-400 outline-none focus:border-[#00569C]"
          />
          <input
            type="text"
            placeholder="Maks. qiymət"
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
            placeholder="İl, Min."
            value={minYear}
            onChange={(e) => setMinYear(e.target.value)}
            className="flex-1 w-full h-10 px-3 border border-gray-200 rounded-lg text-sm text-gray-600 placeholder:text-gray-400 outline-none focus:border-[#00569C]"
          />
          <input
            type="text"
            placeholder="Maks."
            value={maxYear}
            onChange={(e) => setMaxYear(e.target.value)}
            className="flex-1 w-full h-10 px-3 border border-gray-200 rounded-lg text-sm text-gray-600 placeholder:text-gray-400 outline-none focus:border-[#00569C]"
          />
        </div>
      </div>

      {/* Show Button */}
      <button className="w-full h-12 bg-gradient-to-r from-[#3696E7] to-[#00569C] text-white text-base font-medium rounded-full cursor-pointer hover:opacity-90 transition-opacity">
        Göstər
      </button>

      {/* Reset */}
      <button
        onClick={handleReset}
        className="w-full flex items-center justify-center gap-2 mt-4 text-[#00569C] text-sm font-light cursor-pointer hover:opacity-80 transition-opacity"
      >
        <Image
          src="/icons/reset-primary.svg"
          alt="reset"
          width={16}
          height={16}
        />
        Sıfırla
      </button>
    </div>
  );

  // Mobile Filter Modal
  const MobileFilter = () => (
    <>
      {/* Overlay */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 bg-black/40 z-40 transition-opacity duration-300",
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={cn(
          "lg:hidden fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-[24px] max-h-[90vh] overflow-y-auto transition-transform duration-500 ease-out",
          isOpen ? "translate-y-0" : "translate-y-full"
        )}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Filter</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        <div className="p-5 space-y-1">
          {/* City */}
          <FilterSection
            title="Şəhər"
            sectionKey="city"
            options={cityOptions}
            value={selectedCity}
            onChange={setSelectedCity}
          />

          {/* Marka */}
          <FilterSection
            title="Marka"
            sectionKey="marka"
            options={markaOptions}
            value={selectedMarka}
            onChange={setSelectedMarka}
          />

          {/* Model */}
          <FilterSection
            title="Model"
            sectionKey="model"
            options={modelOptions}
            value={selectedModel}
            onChange={setSelectedModel}
            emptyHint={modelSectionEmptyHint}
          />

          {/* Rating */}
          <FilterSection
            title="Reytinq"
            sectionKey="rating"
            options={ratingOptions}
            value={selectedRating}
            onChange={setSelectedRating}
          />

          {/* Price */}
          <div className="py-4 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[15px] text-gray-800 font-medium">
                Qiymət
              </span>
              <div className="flex rounded-full border border-gray-200 overflow-hidden">
                <button
                  onClick={() => setCurrency("AZN")}
                  className={cn(
                    "px-3 py-1 text-xs font-medium transition-colors cursor-pointer",
                    currency === "AZN"
                      ? "bg-gray-100 text-gray-800"
                      : "text-gray-500"
                  )}
                >
                  AZN
                </button>
                <button
                  onClick={() => setCurrency("USD")}
                  className={cn(
                    "px-3 py-1 text-xs font-medium transition-colors cursor-pointer",
                    currency === "USD"
                      ? "bg-gray-100 text-gray-800"
                      : "text-gray-500"
                  )}
                >
                  USD
                </button>
              </div>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Min. qiymət"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="flex-1 h-10 px-3 border border-gray-200 rounded-lg text-sm text-gray-600 placeholder:text-gray-400 outline-none focus:border-[#00569C]"
              />
              <input
                type="text"
                placeholder="Maks. qiymət"
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
                placeholder="İl, Min."
                value={minYear}
                onChange={(e) => setMinYear(e.target.value)}
                className="flex-1 h-10 px-3 border border-gray-200 rounded-lg text-sm text-gray-600 placeholder:text-gray-400 outline-none focus:border-[#00569C]"
              />
              <input
                type="text"
                placeholder="Maks."
                value={maxYear}
                onChange={(e) => setMaxYear(e.target.value)}
                className="flex-1 h-10 px-3 border border-gray-200 rounded-lg text-sm text-gray-600 placeholder:text-gray-400 outline-none focus:border-[#00569C]"
              />
            </div>
          </div>

          {/* Sorting Options - Mobile Only */}
          <div className="py-4 border-b border-gray-100">
            <label className="flex items-center justify-between py-2 cursor-pointer">
              <span className="text-sm text-gray-700">Ucuzdan bahaya</span>
              <input
                type="radio"
                name="sort"
                value="price_asc"
                checked={sortOption === "price_asc"}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-5 h-5 text-[#00569C] border-gray-300 focus:ring-[#00569C]"
              />
            </label>
            <label className="flex items-center justify-between py-2 cursor-pointer">
              <span className="text-sm text-gray-700">Bahadan ucuza</span>
              <input
                type="radio"
                name="sort"
                value="price_desc"
                checked={sortOption === "price_desc"}
                onChange={(e) => setSortOption(e.target.value)}
                className="w-5 h-5 text-[#00569C] border-gray-300 focus:ring-[#00569C]"
              />
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 space-y-3">
            <button
              onClick={onClose}
              className="w-full h-12 bg-gradient-to-r from-[#3696E7] to-[#00569C] text-white text-base font-medium rounded-full cursor-pointer hover:opacity-90 transition-opacity"
            >
              Göstər
            </button>

            <button
              onClick={handleReset}
              className="w-full flex items-center justify-center gap-2 text-[#00569C] text-sm font-light cursor-pointer hover:opacity-80 transition-opacity"
            >
              Sıfırla
              <Image
                src="/icons/reset-primary.svg"
                alt="reset"
                width={16}
                height={16}
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Filter */}
      <div className="hidden lg:block">
        <DesktopFilter />
      </div>

      {/* Mobile Filter Modal */}
      <MobileFilter />
    </>
  );
}
