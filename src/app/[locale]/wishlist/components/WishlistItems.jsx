"use client";
import { useState } from "react";
import ProductCard from "@/components/product/product-card";
import { Heart } from "lucide-react";
import { useTranslations } from "next-intl";

export default function WishlistItems({ initialProducts }) {
  const t = useTranslations();
  const [favoriteProducts, setFavoriteProducts] = useState(initialProducts);

  const handleFavoriteToggle = async (productId) => {
    // Remove from the list when unfavorited
    setFavoriteProducts((prev) =>
      prev.filter((product) => product.id !== productId)
    );
  };

  if (favoriteProducts.length === 0) {
    return (
      <div className="w-full min-h-[500px] pt-10 flex flex-col items-center justify-start gap-6">
        <div className="w-24 h-24 rounded-full bg-[#cee5f8] flex items-center justify-center">
          <Heart className="w-10 h-10 text-[#3696e7]" strokeWidth={1.5} />
        </div>
        <h2 className="text-lg lg:text-2xl font-regular text-gray-600">
          {t("wishlist_empty")}
        </h2>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5 pb-10">
      {favoriteProducts.map((product) => (
        <div key={product.uuid}>
          <ProductCard
            product={product}
            onFavoriteToggle={() => handleFavoriteToggle(product.id)}
          />
        </div>
      ))}
    </div>
  );
}
