"use client";
import { useState } from "react";
import ProductCard from "@/components/product/product-card";
import Image from "next/image";

export default function WishlistItems({ initialProducts }) {
  const [favoriteProducts, setFavoriteProducts] = useState(initialProducts);

  const handleFavoriteToggle = async (productId) => {
    // Remove from the list when unfavorited
    setFavoriteProducts((prev) => prev.filter((product) => product.id !== productId));
  };

  if (favoriteProducts.length === 0) {
    return (
      <div className="w-full min-h-[500px] pt-10 flex flex-col items-center justify-start gap-10">
        <div className="relative w-[170px] h-[170px]">
          <Image
            src="/images/wishlist-empty.png"
            alt="empty wishlist"
            fill
            className="object-contain"
          />
        </div>
        <h2 className="text-lg lg:text-2xl font-regular text-gray-600">
          Seçilmiş məhsullarınız yoxdur
        </h2>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5 pb-10">
      {favoriteProducts.map((product) => (
        <div key={product.id}>
          <ProductCard
            product={product}
            onFavoriteToggle={() => handleFavoriteToggle(product.id)}
          />
        </div>
      ))}
    </div>
  );
}

