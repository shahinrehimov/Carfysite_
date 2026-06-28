"use client";
import React, { useState, useEffect } from "react";
import ProductCard from "./product-card";
import { api } from "@/lib/axios";
import { SearchX, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ProductsList({ initialProducts, initialMeta, filterQueryString = "" }) {
  const t = useTranslations();
  const [products, setProducts] = useState(initialProducts);
  const [meta, setMeta] = useState(initialMeta);
  const [loading, setLoading] = useState(false);
  const [animateFromIndex, setAnimateFromIndex] = useState(null);

  useEffect(() => {
    setProducts(initialProducts);
    setMeta(initialMeta);
    setAnimateFromIndex(null);
  }, [initialProducts, initialMeta]);

  const handleLoadMore = async () => {
    if (loading || meta.current_page >= meta.last_page) return;

    const startIndex = products.length;
    setLoading(true);
    try {
      const nextPage = meta.current_page + 1;
      const params = new URLSearchParams(filterQueryString);
      params.set("page", String(nextPage));
      params.set("limit", String(meta.per_page));
      const response = await api.get(`/products/load?${params.toString()}`);

      setProducts([...products, ...response.data.data]);
      setMeta(response.data.meta);
      setAnimateFromIndex(startIndex);
    } catch (error) {
      console.error("Error loading more products:", error);
    } finally {
      setLoading(false);
    }
  };

  const hasMoreProducts = meta.current_page < meta.last_page;

  if (products.length === 0) {
    return (
      <div className="w-full min-h-[400px] flex flex-col items-center justify-center gap-4 text-center py-16">
        <div className="w-20 h-20 rounded-full bg-[#cee5f8] flex items-center justify-center">
          <SearchX className="w-9 h-9 text-[#3696e7]" strokeWidth={1.5} />
        </div>
        <p className="text-lg text-gray-500 font-light">{t("no_results_found")}</p>
      </div>
    );
  }

  return (
    <>
      {/* Products Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {products.map((item, index) => (
          <div
            key={item.uuid}
            className={
              animateFromIndex !== null && index >= animateFromIndex
                ? "animate-fade-in"
                : undefined
            }
          >
            <ProductCard product={item} />
          </div>
        ))}
      </div>

      {/* Load More Button */}
      {hasMoreProducts && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 min-w-[180px] px-8 py-3 bg-[#3696E7] text-white rounded-full hover:bg-[#2a7bc9] transition-interactive disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? "Yüklənir..." : "Daha çox göstər"}
          </button>
        </div>
      )}
    </>
  );
}

