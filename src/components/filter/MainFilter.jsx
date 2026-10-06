"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Combobox } from "@/components/ui/combobox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChevronRight, ChevronUp, X, Car } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter, Link } from "@/i18n/routing";
import { useProductFilters } from "@/hooks/useProductFilters";
import { isAuthenticated } from "@/lib/auth";
import { profileCarsService } from "@/lib/profileCarsService";
import {
  brandOptionsFromBrands,
  categoriesForUi,
  modelOptionsForBrandSlug,
} from "@/lib/productFilters";
import SearchSuggestions, {
  useProductSuggestions,
} from "@/components/search/search-suggestions";

function firstParam(searchParams, key) {
  const val = searchParams?.[key];
  return Array.isArray(val) ? val[0] : (val ?? "");
}

function arrayParam(searchParams, key) {
  const val = searchParams?.[key];
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
}

function formatCarLabel(car) {
  const brand = car.brand?.title ?? "";
  const model = car.brand_model?.title ?? "";
  const year = car.year != null ? ` (${car.year})` : "";
  return `${brand} ${model}${year}`.trim();
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
  const [color, setColor] = useState(() => firstParam(initialFilters, "color_ids[]"));
  const [status, setStatus] = useState(() => firstParam(initialFilters, "statuses[]"));
  const [minYear, setMinYear] = useState(() => firstParam(initialFilters, "min_year"));
  const [maxYear, setMaxYear] = useState(() => firstParam(initialFilters, "max_year"));
  const [minPrice, setMinPrice] = useState(() => firstParam(initialFilters, "min_price"));
  const [maxPrice, setMaxPrice] = useState(() => firstParam(initialFilters, "max_price"));
  const [search, setSearch] = useState(() => firstParam(initialFilters, "search"));
  const searchFieldRef = useRef(null);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const [currency, setCurrency] = useState("AZN");
  const [isCarSearchOpen, setIsCarSearchOpen] = useState(false);
  const [userCars, setUserCars] = useState([]);
  const [carsLoading, setCarsLoading] = useState(false);
  const [carsLoadError, setCarsLoadError] = useState(null);
  const [selectedUserCarId, setSelectedUserCarId] = useState(() =>
    firstParam(initialFilters, "user_car_id")
  );

  // Sync state when URL params change (e.g. after SidebarFilter submits)
  const pMarka   = firstParam(initialFilters, "brands[]");
  const pCity    = firstParam(initialFilters, "city_id");
  const pColor   = firstParam(initialFilters, "color_ids[]");
  const pStatus  = firstParam(initialFilters, "statuses[]");
  const pMinYear = firstParam(initialFilters, "min_year");
  const pMaxYear = firstParam(initialFilters, "max_year");
  const pMinPrice = firstParam(initialFilters, "min_price");
  const pMaxPrice = firstParam(initialFilters, "max_price");
  const pSearch = firstParam(initialFilters, "search");
  const pModels  = arrayParam(initialFilters, "models[]").join(",");
  const pUserCarId = firstParam(initialFilters, "user_car_id");

  useEffect(() => {
    setMarka(pMarka);
    setModel(pModels ? pModels.split(",") : []);
    setCity(pCity);
    setColor(pColor);
    setStatus(pStatus);
    setMinYear(pMinYear);
    setMaxYear(pMaxYear);
    setMinPrice(pMinPrice);
    setMaxPrice(pMaxPrice);
    setSearch(pSearch);
    setSelectedUserCarId(pUserCarId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pMarka, pModels, pCity, pColor, pStatus, pMinYear, pMaxYear, pMinPrice, pMaxPrice, pSearch, pUserCarId]);

  const {
    products: suggestionProducts,
    categories: suggestionCategories,
    status: suggestionStatus,
  } = useProductSuggestions(search, suggestionsOpen);

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
      { value: "", label: t("all") },
      ...statuses.map((s) => ({ value: String(s.id), label: s.title })),
    ];
  }, [filterData, t]);

  const currencyOptions = [
    { value: "AZN", label: "AZN" },
    { value: "USD", label: "USD" },
    { value: "EUR", label: "EUR" },
  ];

  const handleMarkaChange = (val) => {
    setMarka(val);
    setModel([]);
  };

  useEffect(() => {
    if (categories.length && !selectedCategory) {
      setSelectedCategory(categories[0]);
    }
  }, [categories]);

  useEffect(() => {
    if (!isCarSearchOpen) return;

    let cancelled = false;
    (async () => {
      setCarsLoading(true);
      setCarsLoadError(null);
      const res = await profileCarsService.listCars();
      if (cancelled) return;
      if (res.success) {
        setUserCars(res.data);
      } else {
        setUserCars([]);
        setCarsLoadError(res.error);
      }
      setCarsLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [isCarSearchOpen]);

  const buildFilterParams = () => {
    const params = new URLSearchParams();
    const trimmedSearch = search.trim();
    if (trimmedSearch) params.set("search", trimmedSearch.slice(0, 500));
    if (marka) params.append("brands[]", marka);
    for (const m of model) params.append("models[]", m);
    if (minYear) params.set("min_year", minYear);
    if (maxYear) params.set("max_year", maxYear);
    if (minPrice) params.set("min_price", minPrice);
    if (maxPrice) params.set("max_price", maxPrice);
    if (city) params.set("city_id", city);
    if (color) params.append("color_ids[]", color);
    if (status) params.append("statuses[]", status);
    if (selectedUserCarId) params.set("user_car_id", selectedUserCarId);
    return params;
  };

  const handleSubmit = () => {
    setSuggestionsOpen(false);
    const params = buildFilterParams();
    const qs = params.toString();
    router.push(qs ? `/products?${qs}` : "/products");
  };

  const handleFind = () => {
    handleSubmit();
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
    setSearch("");
    setSelectedUserCarId("");
  };

  const handleCarSearchClick = () => {
    if (!isAuthenticated()) {
      router.push("/auth/login");
      return;
    }
    setIsCarSearchOpen(true);
  };

  const handleCarSearchSubmit = () => {
    if (!selectedUserCarId) return;
    const params = buildFilterParams();
    params.set("user_car_id", selectedUserCarId);
    setIsCarSearchOpen(false);
    router.push(`/products?${params.toString()}`);
  };

  const isBanner = type === "banner";
  const actionBtnClass = cn(
    "text-sm lg:text-base font-light flex items-center justify-center gap-2 cursor-pointer",
    isBanner ? "text-white" : "text-[#00569C]"
  );
  const minYearPlaceholder = yearRange
    ? `${t("year")}, ${yearRange.min}`
    : t("year_min");
  const maxYearPlaceholder = yearRange ? String(yearRange.max) : t("max");
  const modelPlaceholder = marka ? t("model") : t("first_select_brand");

  return (
    <>
      <div
        className={cn(
          "w-full max-w-full min-w-0 overflow-x-hidden bg-[#FFFFFF52] rounded-[24px] lg:rounded-[40px] backdrop-blur-lg box-shadow-[0px_2px_16px_0px_#0000001F] p-4",
          type == "banner"
            ? "absolute bottom-[-30px] left-0 right-0 mx-auto px-4 lg:w-[min(92vw,96rem)]"
            : "container"
        )}
      >
        <div className="w-full min-w-0 grid grid-cols-1 lg:grid-cols-4 gap-4">
          <button
            onClick={() => {
              setSuggestionsOpen(false);
              setIsCategoryMenuOpen(true);
            }}
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

          <div
            className="col-span-1 lg:col-span-2 relative min-w-0"
            ref={searchFieldRef}
          >
            <div
              className={cn(
                "bg-white rounded-full h-[48px] lg:h-[60px] flex items-center min-w-0 overflow-hidden pl-4 lg:pl-6 gap-2 lg:gap-3",
                type == "default" ? "border border-gray-200" : ""
              )}
            >
              <div className="flex items-center gap-2 lg:gap-3 flex-1 min-w-0">
                <Image
                  src="/icons/search.svg"
                  alt="search"
                  width={20}
                  height={20}
                  className="opacity-40 shrink-0"
                />
                <input
                  type="search"
                  name="q"
                  enterKeyHint="search"
                  value={search}
                  role="combobox"
                  aria-expanded={suggestionsOpen}
                  aria-autocomplete="list"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="off"
                  spellCheck={false}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearch(value);
                    setSuggestionsOpen(value.trim().length >= 2);
                  }}
                  onFocus={() => {
                    if (search.trim().length >= 2) setSuggestionsOpen(true);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !suggestionsOpen) handleFind();
                  }}
                  placeholder={t("search")}
                  className="flex-1 bg-transparent outline-none text-[#00569C] placeholder:text-[#00569C80] text-base font-light min-w-0 w-0 [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden"
                />
              </div>
              <button
                onClick={() => {
                  setSuggestionsOpen(false);
                  setIsFilterOpen(!isFilterOpen);
                }}
                className="cursor-pointer px-1 shrink-0 flex items-center justify-center border rounded-[8px] w-[36px] lg:w-[42px] h-[36px] lg:h-[42px] border-[#00569C]"
              >
                <Image
                  src="/icons/filter.svg"
                  alt="filter"
                  width={20}
                  height={20}
                />
              </button>
              <button
                type="button"
                className="bg-[#3696E7] text-white text-xs lg:text-base font-regular rounded-tl-[8px] rounded-bl-[8px] rounded-tr-[40px] rounded-br-[40px] h-[48px] lg:h-[60px] w-[72px] sm:w-[88px] lg:w-[120px] shrink-0 flex items-center justify-center cursor-pointer"
                onClick={handleFind}
              >
                {t("find")}
              </button>
            </div>
            <SearchSuggestions
              open={suggestionsOpen}
              query={search}
              products={suggestionProducts}
              categories={suggestionCategories}
              status={suggestionStatus}
              anchorRef={searchFieldRef}
              viewAllHref={(() => {
                const params = buildFilterParams();
                const qs = params.toString();
                return qs ? `/products?${qs}` : "/products";
              })()}
              onClose={() => setSuggestionsOpen(false)}
            />
          </div>

          <div className="col-span-1">
            <Button
              variant="primary"
              size="lg"
              type="button"
              onClick={handleCarSearchClick}
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
                onValueChange={handleMarkaChange}
                placeholder={t("brand")}
                searchPlaceholder={t("search_brand")}
                emptyText={t("no_results_found")}
                triggerClassName="rounded-full h-[48px] lg:h-[60px] px-6 text-sm lg:text-base font-light border-none w-full"
              />

              <Combobox
                multiple
                options={modelOptions}
                value={model}
                onValueChange={setModel}
                placeholder={modelPlaceholder}
                searchPlaceholder={t("search_model")}
                emptyText={t("no_results_found")}
                disabled={!marka}
                selectedCountLabel={t("models_selected")}
                triggerClassName="rounded-full h-[48px] lg:h-[60px] px-6 text-sm lg:text-base font-light border-none w-full"
              />

              <div className=" grid grid-cols-2 bg-white rounded-full h-[48px] lg:h-[60px]  items-center  gap-2">
                <input
                  type="number"
                  placeholder={minYearPlaceholder}
                  value={minYear}
                  onChange={(e) => setMinYear(e.target.value)}
                  className="border-r border-gray-200 bg-transparent outline-none text-[#00569C] placeholder:text-[#00569C] text-sm lg:text-base font-light px-4"
                />
                <input
                  type="number"
                  placeholder={maxYearPlaceholder}
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
                  placeholder={t("city")}
                  searchPlaceholder={t("search_city")}
                  emptyText={t("no_results_found")}
                  triggerClassName="rounded-full h-[48px] lg:h-[60px] px-6 text-sm lg:text-base font-light border-none w-full"
                />

                <Combobox
                  options={colorOptions}
                  value={color}
                  onValueChange={setColor}
                  placeholder={t("color")}
                  searchPlaceholder={t("search_color")}
                  emptyText={t("no_results_found")}
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
                  placeholder={t("status")}
                  emptyText={t("no_results_found")}
                  triggerClassName="rounded-full h-[48px] lg:h-[60px] px-6 text-sm lg:text-base font-light border-none w-full"
                />
              </div>

              {/* Price inputs */}
              <div className="col-span-1 grid grid-cols-2 bg-white rounded-full h-[48px] lg:h-[60px]  items-center  gap-2">
                <input
                  type="number"
                  placeholder={t("price_min")}
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className=" bg-transparent outline-none text-[#00569C] placeholder:text-[#00569C] text-sm lg:text-base font-light px-4 border-r border-gray-200"
                />
                <input
                  type="number"
                  placeholder={t("price_max")}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className=" bg-transparent outline-none text-[#00569C] placeholder:text-[#00569C] text-sm lg:text-base font-light px-4"
                />
              </div>

              <div className="col-span-1 grid grid-cols-2 items-center gap-4">
                {/* <Combobox
                  options={currencyOptions}
                  value={currency}
                  onValueChange={setCurrency}
                  placeholder="AZN"
                  searchPlaceholder={t("search_currency")}
                  emptyText={t("no_results_found")}
                  triggerClassName="col-span-2 rounded-full h-[48px] lg:h-[60px] px-6 text-base font-light border border-gray-200 w-full"
                /> */}
                <button
                  onClick={handleResetFilters}
                  className={actionBtnClass}
                >
                  {t("reset")}
                  <Image
                    src={isBanner ? "/icons/reset.svg" : "/icons/reset-primary.svg"}
                    alt={t("reset")}
                    width={20}
                    height={20}
                  />
                </button>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className={actionBtnClass}
                >
                  {t("hide")}
                  {isBanner ? (
                    <Image
                      src="/icons/chevron-up.svg"
                      alt={t("hide")}
                      width={20}
                      height={20}
                    />
                  ) : (
                    <ChevronUp className="size-5 text-[#00569C]" strokeWidth={1.5} />
                  )}
                </button>
              </div>
              <button
                onClick={handleSubmit}
                className="bg-[#3696E7] text-white text-sm lg:text-base font-regular rounded-full h-[48px] lg:h-[60px] px-12 cursor-pointer"
              >
                {t("show")}
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
          className={`lg:hidden fixed bottom-0 left-0 right-0 w-full max-w-[100vw] bg-white z-50 rounded-t-[24px] p-6 max-h-[90vh] overflow-y-auto overflow-x-hidden transition-transform duration-500 ease-out ${
            isFilterOpen ? "translate-y-0" : "translate-y-full"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6 min-w-0">
            <h2 className="text-xl font-semibold text-[#1A1A1A]">{t("filter")}</h2>
            <button
              onClick={() => setIsFilterOpen(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer shrink-0"
            >
              <X size={24} className="text-gray-600" />
            </button>
          </div>

          {/* Filter Content */}
          <div className="space-y-4 min-w-0">
            {/* Marka */}
            <Combobox
              options={markaOptions}
              value={marka}
              onValueChange={handleMarkaChange}
              placeholder={t("brand")}
              searchPlaceholder={t("search_brand")}
              emptyText={t("no_results_found")}
              triggerClassName="rounded-full h-[48px] lg:h-[60px] px-6 text-base font-light border border-gray-200 w-full"
            />

            {/* Model */}
            <Combobox
              multiple
              options={modelOptions}
              value={model}
              onValueChange={setModel}
              placeholder={modelPlaceholder}
              searchPlaceholder={t("search_model")}
              emptyText={t("no_results_found")}
              disabled={!marka}
              selectedCountLabel={t("models_selected")}
              triggerClassName="rounded-full h-[48px] lg:h-[60px] px-6 text-base font-light border border-gray-200 w-full"
            />

            {/* Şəhər */}
            <Combobox
              options={cityOptions}
              value={city}
              onValueChange={setCity}
              placeholder={t("city")}
              searchPlaceholder={t("search_city")}
              emptyText={t("no_results_found")}
              triggerClassName="rounded-full h-[48px] lg:h-[60px] px-6 text-base font-light border border-gray-200 w-full"
            />

            {/* Rəng */}
            <Combobox
              options={colorOptions}
              value={color}
              onValueChange={setColor}
              placeholder={t("color")}
              searchPlaceholder={t("search_color")}
              emptyText={t("no_results_found")}
              triggerClassName="rounded-full h-[48px] lg:h-[60px] px-6 text-base font-light border border-gray-200 w-full"
            />

            {/* Status */}
            <Combobox
              options={statusOptions}
              value={status}
              onValueChange={setStatus}
              placeholder={t("status")}
              emptyText={t("no_results_found")}
              triggerClassName="rounded-full h-[48px] lg:h-[60px] px-6 text-base font-light border border-gray-200 w-full"
            />

            {/* Year Range */}
            <div className="bg-white rounded-full h-[48px] flex items-center px-2 gap-2 border border-gray-200 min-w-0 overflow-hidden">
              <input
                type="number"
                placeholder={minYearPlaceholder}
                value={minYear}
                onChange={(e) => setMinYear(e.target.value)}
                className="flex-1 min-w-0 bg-transparent outline-none text-[#00569C] placeholder:text-[#00569C] text-base font-light px-2 sm:px-4"
              />
              <div className="w-px h-6 bg-gray-300 shrink-0"></div>
              <input
                type="number"
                placeholder={maxYearPlaceholder}
                value={maxYear}
                onChange={(e) => setMaxYear(e.target.value)}
                className="flex-1 min-w-0 bg-transparent outline-none text-[#00569C] placeholder:text-[#00569C] text-base font-light px-2 sm:px-4"
              />
            </div>

            {/* Price Range */}
            <div className="bg-white rounded-full h-[48px] flex items-center px-2 gap-2 border border-gray-200 min-w-0 overflow-hidden">
              <input
                type="number"
                placeholder={t("price_min")}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="flex-1 min-w-0 bg-transparent outline-none text-[#00569C] placeholder:text-[#00569C] text-base font-light px-2 sm:px-4"
              />
              <div className="w-px h-6 bg-gray-300 shrink-0"></div>
              <input
                type="number"
                placeholder={t("price_max")}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="flex-1 min-w-0 bg-transparent outline-none text-[#00569C] placeholder:text-[#00569C] text-base font-light px-2 sm:px-4"
              />
            </div>

            {/* Currency */}
            <Combobox
              options={currencyOptions}
              value={currency}
              onValueChange={setCurrency}
              placeholder="AZN"
              searchPlaceholder={t("search_currency")}
              emptyText={t("no_results_found")}
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
              {t("show")}
            </button>

            <button
              onClick={handleResetFilters}
              className="w-full text-[#00569C] text-base font-light flex items-center justify-center gap-2 cursor-pointer"
            >
              {t("reset")}
              <Image
                src="/icons/reset-primary.svg"
                alt={t("reset")}
                width={20}
                height={20}
              />
            </button>
          </div>
        </div>
      </>

      {/* Category Menu Modal — desktop only */}
      <div
        className={`hidden lg:block fixed inset-0 bg-[#00000066] z-40 transition-opacity duration-300 ${
          isCategoryMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsCategoryMenuOpen(false)}
      />

      {/* Sidebar Menu — desktop only */}
      <div
        className={`hidden lg:block fixed top-0 left-0 h-full w-full max-w-[900px] bg-white z-50 shadow-2xl rounded-r-[40px] overflow-hidden transition-transform duration-500 ease-out ${
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
                    {t("view_all")} →
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
                        {t("no_subcategories")}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={isCarSearchOpen} onOpenChange={setIsCarSearchOpen}>
        <DialogContent className="sm:max-w-lg" showCloseButton>
          <DialogHeader>
            <DialogTitle>{t("search_by_car")}</DialogTitle>
            <DialogDescription>
              {t("search_by_car_description")}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 max-h-[360px] overflow-y-auto">
            {carsLoading && (
              <p className="text-sm text-gray-500 py-4 text-center">{t("loading")}</p>
            )}

            {!carsLoading && carsLoadError && (
              <p className="text-sm text-red-600 py-2">{carsLoadError}</p>
            )}

            {!carsLoading && !carsLoadError && userCars.length === 0 && (
              <div className="py-4 text-center space-y-3">
                <p className="text-sm text-gray-600">{t("cars_garage_empty")}</p>
                <Link
                  href="/account/cars"
                  className="text-sm text-[#3696E7] font-medium hover:underline"
                  onClick={() => setIsCarSearchOpen(false)}
                >
                  {t("cars_add_card")} →
                </Link>
              </div>
            )}

            {!carsLoading &&
              userCars.map((car) => {
                const carId = String(car.id);
                const isSelected = selectedUserCarId === carId;
                return (
                  <button
                    key={car.id}
                    type="button"
                    onClick={() => setSelectedUserCarId(carId)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-colors cursor-pointer",
                      isSelected
                        ? "border-[#00569C] bg-[#00569C]/5"
                        : "border-gray-200 hover:border-[#00569C]/40"
                    )}
                  >
                    <div className="w-14 h-14 rounded-lg bg-gray-100 shrink-0 overflow-hidden">
                      {car.photo ? (
                        <Image
                          src={car.photo}
                          alt={formatCarLabel(car)}
                          width={56}
                          height={56}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Car className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {formatCarLabel(car)}
                    </span>
                  </button>
                );
              })}
          </div>

          <Button
            variant="primary"
            size="lg"
            type="button"
            disabled={!selectedUserCarId || carsLoading || userCars.length === 0}
            onClick={handleCarSearchSubmit}
            className="w-full h-12 cursor-pointer"
          >
            {t("show")}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
}
