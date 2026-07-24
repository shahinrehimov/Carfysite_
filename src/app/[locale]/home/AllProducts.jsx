"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import ProductCard from "@/components/product/product-card";
import { Button } from "@/components/ui/button";

function AllProducts({ products = [] }) {
  const router = useRouter();
  const t = useTranslations();

  return (
    <div className="pt-12 pb-30">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-[24px] font-semibold text-gray-900">
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
      {products.length > 0 && (
        <div className="flex justify-center mt-10">
          <Button variant="primary" onClick={() => router.push("/products")}>
            {t("load_more")}
          </Button>
        </div>
      )}
    </div>
  );
}

export default AllProducts;
