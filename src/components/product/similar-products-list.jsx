import React from "react";
import ProductCard from "./product-card";
import { useTranslations } from "next-intl";

export default function SimilarProductsList({ similarProducts }) {
  const t = useTranslations();
  return (
    <div className="py-6 pb-4 lg:py-10 lg:pb-10 bg-[#F8F8F8]">
      <div className="container">
        <div className="px-0 lg:px-20">
          <h2 className="text-[24px] lg:text-[32px] font-medium text-center text-gray-900 mb-6">
            {t("similar_products")}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {similarProducts.map((product) => (
              <ProductCard key={product.uuid} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
