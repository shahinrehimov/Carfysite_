"use client";
import React, { useState } from "react";
import ProductCard from "./product-card";
import { api } from "@/lib/axios";

export default function ProductsList({ initialProducts, initialMeta, filterQueryString = "" }) {
  const [products, setProducts] = useState(initialProducts);
  const [meta, setMeta] = useState(initialMeta);
  const [loading, setLoading] = useState(false);

  const handleLoadMore = async () => {
    if (loading || meta.current_page >= meta.last_page) return;

    setLoading(true);
    try {
      const nextPage = meta.current_page + 1;
      const params = new URLSearchParams(filterQueryString);
      params.set("page", String(nextPage));
      params.set("limit", String(meta.per_page));
      const response = await api.get(`/products/load?${params.toString()}`);
      
      setProducts([...products, ...response.data.data]);
      setMeta(response.data.meta);
    } catch (error) {
      console.error("Error loading more products:", error);
    } finally {
      setLoading(false);
    }
  };

  const hasMoreProducts = meta.current_page < meta.last_page;

  return (
    <>
      {/* Products Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {products.map((item) => (
          <ProductCard key={item.uuid} product={item} />
        ))}
      </div>

      {/* Load More Button */}
      {hasMoreProducts && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={handleLoadMore}
            disabled={loading}
            className="px-8 py-3 bg-[#3696E7] text-white rounded-full hover:bg-[#2a7bc9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {loading ? "Yüklənir..." : "Daha çox göstər"}
          </button>
        </div>
      )}
    </>
  );
}

