import Image from "next/image";
import React from "react";
import { useTranslations } from "next-intl";

export default function ProductInfo({ data }) {
  const t = useTranslations();
  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold text-gray-900">{data.title}</h2>
      </div>

      {/* Rating and Reviews */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }, (_, index) => (
            <svg
              key={index}
              className={`w-5 h-5 text-[#FF6B35] fill-current ${index < data.ratings.average ? "fill-current" : "fill-gray-200"}`}
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
            </svg>
          ))}
        </div>
        <span className="text-gray-900 font-medium">
          ({data.ratings.average})
        </span>
        <span className="text-gray-600">
          {data.ratings.count} {t("reviews")}
        </span>
      </div>

      {/* Discount Badge */}
      {data.has_discount && (
        <div className="inline-flex items-center gap-2 bg-[#FFF4ED] text-[#FF6B35] px-3 py-2 rounded-md">
          <Image
            src="/icons/coupon.svg"
            alt="Discount"
            width={24}
            height={24}
          />
          <span className="font-medium text-sm">
            {data.discount} {data.discount_type === "by_percentage" ? "%" : "₼"}
          </span>
        </div>
      )}

      {/* Price */}
      <div className="flex items-center gap-4">
        <span className="text-[24px] lg:text-[32px] font-bold text-[#00569C]">
          {data.price_final} ₼
        </span>
        {data.has_discount && (
          <span className="text-[16px] lg:text-[24px] text-[#7B7B7B] line-through">
            {data.price} ₼
          </span>
        )}
      </div>

      {/* Product Code */}

      <div className="text-sm ">
        {t("oem_code")}: {data.oem_code}
      </div>
    </div>
  );
}
