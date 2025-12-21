"use client";
import BreadcrumbView from "@/components/breadcrumb/breadcrumb";
import MainFilter from "@/components/filter/MainFilter";
import SidebarFilter from "@/components/filter/SidebarFilter";
import ProductCard from "@/components/product/product-card";
import Image from "next/image";
import React, { useState } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";

export default function Products() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("Sıralama");

  const sortOptions = [
    { value: "default", label: "Sıralama" },
    { value: "price_asc", label: "Ucuzdan bahaya" },
    { value: "price_desc", label: "Bahadan ucuza" },
    { value: "newest", label: "Ən yeni" },
    { value: "popular", label: "Ən populyar" },
  ];

  // Sample products data
  const products = [
    {
      id: 1,
      image: "/images/product-1.png",
      title: "Automobile spare part",
      code: "362428345",
      price: 365.0,
      oldPrice: 365.0,
      reviews: 72,
    },
    {
      id: 2,
      image: "/images/product-2.png",
      title: "Automobile spare part",
      code: "362428345",
      price: 365.0,
      oldPrice: 365.0,
      reviews: 72,
    },
    {
      id: 3,
      image: "/images/product-3.png",
      title: "Automobile spare part",
      code: "362428345",
      price: 365.0,
      oldPrice: 365.0,
      reviews: 72,
    },
    {
      id: 4,
      image: "/images/product-4.png",
      title: "Automobile spare part",
      code: "362428345",
      price: 365.0,
      oldPrice: 365.0,
      reviews: 72,
    },
    {
      id: 5,
      image: "/images/product-1.png",
      title: "Automobile spare part",
      code: "362428345",
      price: 365.0,
      oldPrice: 365.0,
      reviews: 72,
    },
    {
      id: 6,
      image: "/images/product-2.png",
      title: "Automobile spare part",
      code: "362428345",
      price: 365.0,
      oldPrice: 365.0,
      reviews: 72,
    },
    {
      id: 7,
      image: "/images/product-3.png",
      title: "Automobile spare part",
      code: "362428345",
      price: 365.0,
      oldPrice: 365.0,
      reviews: 72,
    },
    {
      id: 8,
      image: "/images/product-4.png",
      title: "Automobile spare part",
      code: "362428345",
      price: 365.0,
      oldPrice: 365.0,
      reviews: 72,
    },
  ];

  return (
    <div>
      {/* Main Filter Bar */}
      <div className="bg-[#F8F8F8]">
        <MainFilter type="default" />
      </div>

      <div className="container">
        {/* Breadcrumb */}
        <div className="py-4">
          <BreadcrumbView
            data={[
              { id: 1, type: "link", href: "/", title: "Ana səhifə" },
              { id: 2, type: "link", href: "/", title: "Mühərrik hissələri" },
              { id: 3, type: "page", title: "Mator" },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 pb-10">
          <div className="col-span-1 hidden lg:flex flex-col gap-6">
            <SidebarFilter isOpen={false} onClose={() => {}} />

            <div className="sticky top-4">
              <Image
                src="/images/ads.png"
                alt="Advertisement"
                width={500}
                height={800}
                className="w-full h-auto object-cover rounded-[20px]"
              />
            </div>
          </div>

          <div className="col-span-1 lg:col-span-4">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-lg lg:text-xl font-medium text-gray-900">
                <span className="text-[#00569C]">"Mator"</span> üzrə 11 nəticə
              </h1>

              <button
                onClick={() => setIsFilterOpen(true)}
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

            {/* Products Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Load More / Pagination could go here */}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal - Only on Mobile */}
      <div className="lg:hidden">
        <SidebarFilter
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
        />
      </div>
    </div>
  );
}
