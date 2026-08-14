import React from "react";
import { useTranslations } from "next-intl";

export default function ProductSpecifications({ data }) {
  const t = useTranslations();
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-4 mt-4 border-t border-[#E0E0E0] pt-4">
      <div className="flex flex-col">
        <div className="text-[#9E9E9E] text-sm mb-1.5">{t("city")}</div>
        <div className="text-gray-900 font-normal text-base">
          {data.seller.city.title}
        </div>
      </div>
      <div className="flex flex-col">
        <div className="text-[#9E9E9E] text-sm mb-1.5">{t("category")}</div>
        <div className="text-gray-900 font-normal text-base">
          {" "}
          {data.product?.main_category?.parent?.title}
          {data.product?.main_category?.parent ? ", " : ""}
          {data.product?.main_category?.title}
        </div>
      </div>
      <div className="flex flex-col">
        <div className="text-[#9E9E9E] text-sm mb-1.5">{t("brand")}</div>
        <div className="text-gray-900 font-normal text-base">
          {data.brand_models?.length > 0
            ? data.brand_models.map((model) => model.title).join(", ")
            : "---"}
        </div>
      </div>

      {data.year_from && data.year_to && (
        <div className="flex flex-col">
          <div className="text-[#9E9E9E] text-sm mb-1.5">{t("year")}</div>
          <div className="text-gray-900 font-normal text-base">
            {data.year_from} {data.year_to ? `- ${data.year_to}` : ""}
          </div>
        </div>
      )}

      {data.options.map((option) => (
        <div className="flex flex-col" key={option.value}>
          <div className="text-[#9E9E9E] text-sm mb-1.5">
            {option.option_label}
          </div>
          <div className="text-gray-900 font-normal text-base">
            {option.value}
          </div>
        </div>
      ))}
    </div>
  );
}
