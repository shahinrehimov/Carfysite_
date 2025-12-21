import Image from "next/image";
import React from "react";

export default function ProductInfo({ product }) {
  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="space-y-1">
        <h1 className="text-xl font-normal text-gray-900">{product.title}</h1>
        <h2 className="text-2xl font-semibold text-gray-900">
          {product.subtitle}
        </h2>
      </div>

      {/* Rating and Reviews */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-0.5">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className="w-5 h-5 text-[#FF6B35] fill-current"
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          ))}
        </div>
        <span className="text-gray-900 font-medium">({product.rating})</span>
        <span className="text-gray-600">{product.reviewCount} rəy</span>
      </div>

      {/* Discount Badge */}
      {product.discount && (
        <div className="inline-flex items-center gap-2 bg-[#FFF4ED] text-[#FF6B35] px-3 py-2 rounded-md">
          <Image
            src="/icons/coupon.svg"
            alt="Discount"
            width={24}
            height={24}
          />
          <span className="font-medium text-sm">{product.discount}</span>
        </div>
      )}

      {/* Price */}
      <div className="flex items-center gap-4">
        <span className="text-[24px] lg:text-[32px] font-bold text-[#00569C]">
          {product.currentPrice} {product.currency}
        </span>
        {product.oldPrice && (
          <span className="text-[16px] lg:text-[24px] text-[#7B7B7B] line-through">
            {product.oldPrice} {product.currency}
          </span>
        )}
      </div>

      {/* Product Code */}
      {product.productCode && (
        <div className="text-sm ">Məhsul kodu: {product.productCode}</div>
      )}
    </div>
  );
}
