"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import ProductCard from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/axios";

function AllProducts({ initialProducts = [], initialMeta }) {
  const t = useTranslations();
  const [products, setProducts] = useState(initialProducts);
  const [meta, setMeta] = useState(initialMeta);
  const [loading, setLoading] = useState(false);

  const hasMoreProducts = meta.current_page < meta.last_page;

  const handleLoadMore = async () => {
    if (loading || !hasMoreProducts) return;

    setLoading(true);
    try {
      const nextPage = meta.current_page + 1;
      const response = await api.get(
        `/products/load?limit=${meta.per_page}&page=${nextPage}`
      );

      setProducts((prev) => [...prev, ...response.data.data]);
      setMeta(response.data.meta);
    } catch (error) {
      console.error("Error loading more products:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-12 pb-12 lg:pb-30">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="lg:text-[24px] font-medium lg:font-semibold text-gray-900">
          {t("all_products")}
        </h2>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {products.map((product) => (
          <ProductCard key={product.id ?? product.uuid} product={product} />
        ))}
      </div>

      {/* Load More */}
      {hasMoreProducts && (
        <div className="flex justify-center mt-10">
          <Button
            variant="primary"
            onClick={handleLoadMore}
            disabled={loading}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? t("loading") : t("load_more")}
          </Button>
        </div>
      )}
    </div>
  );
}

export default AllProducts;
