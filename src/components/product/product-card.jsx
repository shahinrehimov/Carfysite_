"use client";
import Image from "next/image";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { Button } from "../ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function ProductCard({ product }) {
  const [isLiked, setIsLiked] = useState(false);
  const router = useRouter();
  return (
    <div
      className=" cursor-pointer bg-white rounded-[20px] p-3 lg:p-5 shadow-sm hover:shadow-md transition-shadow h-full flex flex-col"
      onClick={() => router.push(`/products/${product.slug}`)}
    >
      {/* Image Container */}
      <div className="relative mb-3 lg:mb-4 aspect-square">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-contain"
        />
        {/* Heart Icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsLiked(!isLiked);
          }}
          className={cn(
            "absolute top-2 right-2 w-8 h-8 lg:w-9 lg:h-9 rounded-full flex items-center justify-center transition-colors cursor-pointer",
            isLiked
              ? "bg-[#3696E7] hover:bg-[#2a7bc9]"
              : "bg-white hover:bg-gray-50 border border-gray-100"
          )}
        >
          <Heart
            className={cn(
              "w-4 h-4 transition-colors",
              isLiked ? "text-white fill-white" : "text-gray-400"
            )}
          />
        </button>
      </div>

      {/* Price */}
      <div className="flex items-center gap-2 mb-1 lg:mb-2">
        <span className="text-lg lg:text-[22px] font-semibold text-[#3696E7]">
          {product.price.toFixed(2)} ₼
        </span>
        <span className="text-sm lg:text-[16px] text-gray-400 line-through">
          {product.oldPrice.toFixed(2)} ₼
        </span>
      </div>

      {/* Title and Code */}
      <h3 className="text-[13px] lg:text-[14px] text-gray-900 mb-0.5 font-medium line-clamp-1">
        {product.title}
      </h3>
      <p className="text-[13px] lg:text-[14px] text-gray-900 mb-2 lg:mb-3">
        {product.code}
      </p>

      {/* Rating */}
      <div className="flex items-center gap-1 lg:gap-2 mb-3 lg:mb-4">
        <div className="flex gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="w-4 h-4 lg:w-5 lg:h-5 fill-[#FF6B35] text-[#FF6B35]"
            />
          ))}
        </div>
        <span className="text-[11px] lg:text-[13px] text-gray-600">
          ({product.reviews} reytinq)
        </span>
      </div>

      {/* Add to Cart Button - pushes to bottom */}
      <div className="mt-auto">
        <Button
          variant="primary"
          size="default"
          className="w-full text-[12px] lg:text-[14px] font-medium cursor-pointer h-10 lg:h-11"
          onClick={(e) => e.stopPropagation()}
        >
          <ShoppingCart className="w-4 h-4" />
          Səbətə əlavə et
        </Button>
      </div>
    </div>
  );
}
