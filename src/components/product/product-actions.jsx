"use client";

import React, { useState } from "react";
import { Heart, Share2, ShoppingCart } from "lucide-react";
import Image from "next/image";

export default function ProductActions() {
  const [isFavorite, setIsFavorite] = useState(false);

  const handleAddToCart = () => {
    // Add to cart logic here
    console.log("Added to cart");
  };

  const handleShare = () => {
    // Share logic here
    console.log("Share clicked");
  };

  return (
    <div className="space-y-4 mt-4">
      {/* Favorite Button */}
      <button
        onClick={() => setIsFavorite(!isFavorite)}
        className="flex items-center gap-2 text-[#00569C] hover:text-[#00569C] transition-colors cursor-pointer"
      >
        <Heart className={`w-5 h-5 ${isFavorite ? "fill-[#00569C]" : ""}`} />
        <span className="text-sm">Seçilmişlərə əlavə et</span>
      </button>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={handleAddToCart}
          className="flex-1 group bg-white hover:bg-[#00569C] hover:text-white text-[#00569C] border-1 border-[#00569C] font-semibold py-3.5 px-6 rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Image
            src="/icons/cart-primary.svg"
            alt="Cart"
            width={24}
            height={24}
            className="w-5 h-5 group-hover:brightness-0 group-hover:invert"
          />
          <span>Səbətə əlavə et</span>
        </button>
        <button
          onClick={handleShare}
          className="bg-white cursor-pointer  group hover:bg-[#00569C] border-1 border-[#00569C] w-14 h-14 rounded-full transition-colors flex items-center justify-center"
        >
          <Image
            src="/icons/share.svg"
            alt="Share"
            width={24}
            height={24}
            className="w-5 h-5 group-hover:brightness-0 group-hover:invert"
          />
        </button>
      </div>
    </div>
  );
}
