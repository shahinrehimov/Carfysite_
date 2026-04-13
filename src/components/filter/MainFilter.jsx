"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import { ChevronRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useProductFilters } from "@/hooks/useProductFilters";
import {
  brandOptionsFromBrands,
  categoriesForUi,
  modelOptionsForBrandSlug,
} from "@/lib/productFilters";

function firstParam(searchParams, key) {
  const val = searchParams?.[key];
  return Array.isArray(val) ? val[0] : (val ?? "");
}

function arrayParam(searchParams, key) {
  const val = searchParams?.[key];
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
}

export default function MainFilter({ type = "default", initialFilters }) {
  const t = useTranslations();
  const router = useRouter();
  const { data: filterData } = useProductFilters();
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [marka, setMarka] = useState(() => firstParam(initialFilters, "brands[]"));
  const [model, setModel] = useState(() => arrayParam(initialFilters, "models[]"));
  const [city, setCity] = useState(() => firstParam(initialFilters, "city_id"));
  const [color, setColor] = useState(() => firstParam(initialFilters, "color_id"));
  const [status, setStatus] = useState(() => firstParam(initialFilters, "statuses[]"));
  const [minYear, setMinYear] = useState(() => firstParam(initialFilters, "min_year"));
  const [maxYear, setMaxYear] = useState(() => firstParam(initialFilters, "max_year"));
  const [minPrice, setMinPrice] = useState(() => firstParam(initialFilters, "min_price"));
  const [maxPrice, setMaxPrice] = useState(() => firstParam(initialFilters, "max_price"));
  const [currency, setCurrency] = useState("AZN");

  const brands = filterData?.brands ?? [];
  const yearRange = filterData?.yearRange ?? null;

  const categories = useMemo(() => {
    if (filterData?.categories?.length) {
      return categoriesForUi(filterData.categories);
    }
    return [];
  }, [filterData]);

  const markaOptions = useMemo(() => brandOptionsFromBrands(brands), [brands]);
  const modelOptions = useMemo(
    () => modelOptionsForBrandSlug(brands, marka),
    [brands, marka]
  );

  const cityOptions = useMemo(
    () =>
      (filterData?.cities ?? []).map((c) => ({
        value: String(c.id),
        label: c.title,
      })),
    [filterData]
  );

  const colorOptions = useMemo(
    () =>
      (filterData?.colors ?? []).map((c) => ({
        value: String(c.id),
        label: c.title,
      })),
    [filterData]
  );

  const statusOptions = useMemo(() => {
    const statuses = filterData?.statuses ?? [];
    return [
      { value: "", label: "Hamısı" },
      ...statuses.map((s) => ({ value: String(s.id), label: s.title })),
    ];
  }, [filterData]);

  const currencyOptions = [
    { value: "AZN", label: "AZN" },
    { value: "USD", label: "USD" },
    { value: "EUR", label: "EUR" },
  ];

  useEffect(() => {
    setModel([]);
  }, [marka]);

  useEffect(() => {
    if (categories.length && !selectedCategory) {
      setSelectedCategory(categories[0]);
    }
  }, [categories]);

  const buildFilterParams = () => {
    const params = new URLSearchParams();
    if (marka) params.append("brands[]", marka);
    for (const m of model) params.append("models[]", m);
    if (minYear) params.set("min_year", minYear);
    if (maxYear) params.set("max_year", maxYear);
    if (minPrice) params.set("min_price", minPrice);
    if (maxPrice) params.set("max_price", maxPrice);
    if (city) params.set("city_id", city);
    if (color) params.set("color_id", color);
    if (status) params.append("statuses[]", status);
    return params;
  };

  const handleSubmit = () => {
    const params = buildFilterParams();
    const qs = params.toString();
    router.push(qs ? `/products?${qs}` : "/products");
  };

  const handleCategoryClick = (category) => {
    const params = new URLSearchParams();
    params.append("categories[]", category.slug);
    setIsCategoryMenuOpen(false);
    router.push(`/products?${params.toString()}`);
  };

  const handleSubcategoryClick = (category, subcategory) => {
    const params = new URLSearchParams();
    params.append("categories[]", category.slug);
    params.append("sub_categories[]", subcategory.slug);
    setIsCategoryMenuOpen(false);
    router.push(`/products?${params.toString()}`);
  };

  const handleResetFilters = () => {
    setMarka("");
    setModel([]);
    setCity("");
    setColor("");
    setCurrency("AZN");
    setStatus("");
    setMinYear("");
    setMaxYear("");
    setMinPrice("");
    setMaxPrice("");
  };

  return (
    <>
      <div
        className={cn(
          "container   bg-[#FFFFFF52] rounded-[24px] lg:rounded-[40px] backdrop-blur-lg box-shadow-[0px_2px_16px_0px_#0000001F] p-4",
          type == "banner"
            ? "absolute bottom-[-30px] left-0 right-0 mx-auto"
            : ""
        )}
      >
        <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-4">
          <button
            onClick={() => setIsCategoryMenuOpen(true)}
            className={cn(
              "cursor-pointer col-span-1 bg-white text-lg font-regular rounded-full h-[48px] lg:h-[60px] hidden lg:flex items-center justify-center gap-2",
              type == "default" ? "border border-[#00569C]" : ""
            )}
          >
            <Image
              src="/icons/category.svg"
              alt="category"
              width={20}
              height={20}
            />
            <span className="text-[#00569C] text-sm lg:text-base font-light">
              {t("all_categories")}
            </span>
          </button>

          <div className="col-span-1 lg:col-span-2 relative">
            <div
              className={cn(
                "bg-white rounded-full h-[48px] lg:h-[60px] flex items-center justify-between pl-6 gap-3",
                type == "default" ? "border border-gray-200" : ""
              )}
            >
              <div className="flex items-center gap-3 w-full">
                <Image
                  src="/icons/search.svg"
                  alt="search"
                  width={20}
                  height={20}
                  className="opacity-40"
                />
                <input
                  type="text"
                  placeholder={t("search")}
                  className="flex-1 bg-transparent outline-none text-[#00569C] placeholder:text-[#00569C80] text-sm lg:text-base font-light max-w-fit"
                />
              </div>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="cursor-pointer px-1 flex items-center justify-center border rounded-[8px] w-[36px] lg:w-[42px] h-[36px] lg:h-[42px] border-[#00569C]"
              >
                <Image
                  src="/icons/filter.svg"
                  alt="filter"
                  width={20}
                  height={20}
                />
              </button>
              <button
                className="bg-[#3696E7] text-white text-sm lg:text-base font-regular rounded-tl-[8px] rounded-bl-[8px] rounded-tr-[40px] rounded-br-[40px] h-[48px] lg:h-[60px] w-[120px] flex items-center justify-center cursor-pointer"
                onClick={() => {
                  router.push("/products");
                }}
              >
                {t("find")}
              </button>
            </div>
          </div>

          <div className="col-span-1">
            <Button
              variant="primary"
              size="lg"
              className=" h-[48px] lg:h-[60px] cursor-pointer w-full"
            >
              <Image src="/icons/car.svg" alt="car" width={20} height={20} />
              <span className="text-white text-sm lg:text-base font-light">
                {t("search_by_car")}
              </span>
            </Button>
          </div>
        </div>

        {/* Desktop Filter Expansion */}
        <div
          className={`hidden lg:block mt-4 space-y-4 w-full transition-all duration-500 ease-in-out overflow-hidden ${
            isFilterOpen
              ? "max-h-[500px] opacity-100"
              : "max-h-0 opacity-0 mt-0"
          }`}
        >
          <div
            className={`transition-transform flex flex-col gap-4 duration-500 ease-in-out ${
              isFilterOpen ? "translate-y-0" : "-translate-y-4"
            }`}
          >
            <div className="grid grid-cols-4 gap-4">
              <Combobox
                options={markaOptions}
                value={marka}
                onValueChange={setMarka}
                placeholder="Marka"
                searchPlaceholder="Marka axtar..."
                emptyText="Nəticə tapılmadı"
                triggerClassName="rounded-full h-[48px] lg:h-[60px] px-6 text-sm lg:text-base font-light border-none w-full"
              />

              <Combobox
                multiple
                options={modelOptions}
                value={model}
                onValueChange={setModel}
                placeholder={marka ? "Model" : "Əvvəlcə marka seçin"}
                searchPlaceholder="Model axtar..."
                emptyText="Nəticə tapılmadı"
                disabled={!marka}
                selectedCountLabel="model seçilib"
                triggerClassName="rounded-full h-[48px] lg:h-[60px] px-6 text-sm lg:text-base font-light border-none w-full"
              />

              <div className=" grid grid-cols-2 bg-white rounded-full h-[48px] lg:h-[60px]  items-center  gap-2">
                <input
                  type="number"
                  placeholder={yearRange ? `İl, ${yearRange.min}` : "İl, min."}
                  value={minYear}
                  onChange={(e) => setMinYear(e.target.value)}
                  className="border-r border-gray-200 bg-transparent outline-none text-[#00569C] placeholder:text-[#00569C] text-sm lg:text-base font-light px-4"
                />
                <input
                  type="number"
                  placeholder={yearRange ? `${yearRange.max}` : "maks."}
                  value={maxYear}
                  onChange={(e) => setMaxYear(e.target.value)}
                  className=" bg-transparent outline-none text-[#00569C] placeholder:text-[#00569C] text-sm lg:text-base font-light px-4"
                />
              </div>

              <div className="grid-cols-2 items-center gap-2 grid">
                <Combobox
                  options={cityOptions}
                  value={city}
                  onValueChange={setCity}
                  placeholder="Şəhər"
                  searchPlaceholder="Şəhər axtar..."
                  emptyText="Nəticə tapılmadı"
                  triggerClassName="rounded-full h-[48px] lg:h-[60px] px-6 text-sm lg:text-base font-light border-none w-full"
                />

                <Combobox
                  options={colorOptions}
                  value={color}
                  onValueChange={setColor}
                  placeholder="Rəng"
                  searchPlaceholder="Rəng axtar..."
                  emptyText="Nəticə tapılmadı"
                  triggerClassName="rounded-full h-[48px] lg:h-[60px] px-6 text-sm lg:text-base font-light border-none w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-1 flex items-center">
                <Combobox
                  options={statusOptions}
                  value={status}
                  onValueChange={setStatus}
                  placeholder="Status"
                  emptyText="Nəticə tapılmadı"
                  triggerClassName="rounded-full h-[48px] lg:h-[60px] px-6 text-sm lg:text-base font-light border-none w-full"
                />
              </div>

              {/* Price inputs */}
              <div className="col-span-1 grid grid-cols-2 bg-white rounded-full h-[48px] lg:h-[60px]  items-center  gap-2">
                <input
                  type="number"
                  placeholder="Qiymət, min."
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className=" bg-transparent outline-none text-[#00569C] placeholder:text-[#00569C] text-sm lg:text-base font-light px-4 border-r border-gray-200"
                />
                <input
                  type="number"
                  placeholder="maks."
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className=" bg-transparent outline-none text-[#00569C] placeholder:text-[#00569C] text-sm lg:text-base font-light px-4"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Combobox
                  options={currencyOptions}
                  value={currency}
                  onValueChange={setCurrency}
                  placeholder="AZN"
                  searchPlaceholder="Valyuta axtar..."
                  emptyText="Nəticə tapılmadı"
                  triggerClassName="col-span-2 rounded-full h-[48px] lg:h-[60px] px-6 text-base font-light border border-gray-200 w-full"
                />
                <button
                  onClick={handleResetFilters}
                  className="col-span-1 text-white text-sm lg:text-base font-light flex items-center gap-2 cursor-pointer"
                >
                  Sıfırla
                  <Image
                    src="/icons/reset.svg"
                    alt="refresh"
                    width={20}
                    height={20}
                  />
                </button>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="col-span-1 text-white text-sm lg:text-base font-light flex items-center gap-2 cursor-pointer"
                >
                  Gizlə
                  <Image
                    src="/icons/chevron-up.svg"
                    alt="refresh"
                    width={20}
                    height={20}
                  />
                </button>
              </div>
              <button
                onClick={handleSubmit}
                className="bg-[#3696E7] text-white text-sm lg:text-base font-regular rounded-full h-[48px] lg:h-[60px] px-12 cursor-pointer"
              >
                Göstər
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Bottom Sheet */}
      <>
        <div
          className={`lg:hidden fixed inset-0 bg-[#00000066] z-40 transition-opacity duration-300 ${
            isFilterOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsFilterOpen(false)}
        />
        <div
          className={`lg:hidden fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-[24px] p-6 max-h-[90vh] overflow-y-auto transition-transform duration-500 ease-out ${
            isFilterOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-[#1A1A1A]">Filter</h2>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>

          {/* Filter Content */}
          <div className="space-y-4">
            {/* Marka */}
            <Combobox
              options={markaOptions}
              value={marka}
              onValueChange={setMarka}
              placeholder="Marka"
              searchPlaceholder="Marka axtar..."
              emptyText="Nəticə tapılmadı"
              triggerClassName="rounded-full h-[48px] lg:h-[60px] px-6 text-base font-light border border-gray-200 w-full"
            />

            {/* Model */}
            <Combobox
              multiple
              options={modelOptions}
              value={model}
              onValueChange={setModel}
              placeholder={marka ? "Model" : "Əvvəlcə marka seçin"}
              searchPlaceholder="Model axtar..."
              emptyText="Nəticə tapılmadı"
              disabled={!marka}
              selectedCountLabel="model seçilib"
              triggerClassName="rounded-full h-[48px] lg:h-[60px] px-6 text-base font-light border border-gray-200 w-full"
            />

            {/* Şəhər */}
            <Combobox
              options={cityOptions}
              value={city}
              onValueChange={setCity}
              placeholder="Şəhər"
              searchPlaceholder="Şəhər axtar..."
              emptyText="Nəticə tapılmadı"
              triggerClassName="rounded-full h-[48px] lg:h-[60px] px-6 text-base font-light border border-gray-200 w-full"
            />

            {/* Rəng */}
            <Combobox
              options={colorOptions}
              value={color}
              onValueChange={setColor}
              placeholder="Rəng"
              searchPlaceholder="Rəng axtar..."
              emptyText="Nəticə tapılmadı"
              triggerClassName="rounded-full h-[48px] lg:h-[60px] px-6 text-base font-light border border-gray-200 w-full"
            />

            {/* Status */}
            <Combobox
              options={statusOptions}
              value={status}
              onValueChange={setStatus}
              placeholder="Status"
              emptyText="Nəticə tapılmadı"
              triggerClassName="rounded-full h-[48px] lg:h-[60px] px-6 text-base font-light border border-gray-200 w-full"
            />

            {/* Year Range */}
            <div className="bg-white rounded-full h-[48px] flex items-center px-2 gap-2 border border-gray-200">
              <input
                type="number"
                placeholder={yearRange ? `İl, ${yearRange.min}` : "İl, min."}
                value={minYear}
                onChange={(e) => setMinYear(e.target.value)}
                className="flex-1 bg-transparent outline-none text-[#00569C] placeholder:text-[#00569C] text-base font-light px-4"
              />
              <div className="w-px h-6 bg-gray-300"></div>
              <input
                type="number"
                placeholder={yearRange ? `${yearRange.max}` : "maks."}
                value={maxYear}
                onChange={(e) => setMaxYear(e.target.value)}
                className="flex-1 bg-transparent outline-none text-[#00569C] placeholder:text-[#00569C] text-base font-light px-4"
              />
            </div>

            {/* Price Range */}
            <div className="bg-white rounded-full h-[48px] flex items-center px-2 gap-2 border border-gray-200">
              <input
                type="number"
                placeholder="Qiymət, min."
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="flex-1 bg-transparent outline-none text-[#00569C] placeholder:text-[#00569C] text-base font-light px-4"
              />
              <div className="w-px h-6 bg-gray-300"></div>
              <input
                type="number"
                placeholder="maks."
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="flex-1 bg-transparent outline-none text-[#00569C] placeholder:text-[#00569C] text-base font-light px-4"
              />
            </div>

            {/* Currency */}
            <Combobox
              options={currencyOptions}
              value={currency}
              onValueChange={setCurrency}
              placeholder="AZN"
              searchPlaceholder="Valyuta axtar..."
              emptyText="Nəticə tapılmadı"
              triggerClassName="rounded-full h-[48px] lg:h-[60px] px-6 text-base font-light border border-gray-200 w-full"
            />

            {/* Action Buttons */}
            <button
              onClick={() => {
                handleSubmit();
                setIsFilterOpen(false);
              }}
              className="w-full bg-[#3696E7] text-white text-base font-regular rounded-full h-[48px] cursor-pointer"
            >
              Göstər
            </button>

            <button
              onClick={handleResetFilters}
              className="w-full text-[#00569C] text-base font-light flex items-center justify-center gap-2 cursor-pointer"
            >
              Sıfırla
              <Image
                src="/icons/reset-primary.svg"
                alt="refresh"
                width={20}
                height={20}
              />
            </button>
          </div>
        </div>
      </>

      {/* Category Menu Modal */}
      <div
        className={`fixed inset-0 bg-[#00000066] z-40 transition-opacity duration-300 ${
          isCategoryMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsCategoryMenuOpen(false)}
      />

      {/* Sidebar Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-full max-w-[900px] bg-white z-50 shadow-2xl rounded-r-[40px] overflow-hidden transition-transform duration-500 ease-out ${
          isCategoryMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b">
            <Image
              src="/images/logo.svg"
              alt="Carfy"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
            <button
              onClick={() => setIsCategoryMenuOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Main Categories */}
            <div className="w-[420px] border-r overflow-y-auto">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category)}
                  className={`w-full flex items-center justify-between px-6 py-4 text-left transition-colors border-b cursor-pointer ${
                    selectedCategory?.id === category.id
                      ? "bg-gray-50"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <span className="text-base text-[#1A1A1A]">
                    {category.name}
                  </span>
                  <ChevronRight size={20} className="text-gray-400" />
                </button>
              ))}
            </div>

            {/* Subcategories */}
            <div className="flex-1 p-6 overflow-y-auto">
              {selectedCategory && (
                <>
                  <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">
                    {selectedCategory.name}
                  </h3>

                  {/* Click on the parent category itself */}
                  <button
                    onClick={() => handleCategoryClick(selectedCategory)}
                    className="block w-full text-left text-base text-[#3696E7] font-medium hover:text-[#00569C] transition-colors py-2 cursor-pointer border-b border-gray-100 mb-2"
                  >
                    Hamısına bax →
                  </button>

                  <div className="space-y-3">
                    {selectedCategory.subcategories.length > 0 ? (
                      selectedCategory.subcategories.map((subcategory) => (
                        <button
                          key={subcategory.id}
                          onClick={() =>
                            handleSubcategoryClick(selectedCategory, subcategory)
                          }
                          className="block w-full text-left text-base text-[#1A1A1A] hover:text-[#3696E7] transition-colors py-2 cursor-pointer"
                        >
                          {subcategory.name}
                        </button>
                      ))
                    ) : (
                      <p className="text-gray-500 text-sm">
                        Alt kateqoriya yoxdur
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
