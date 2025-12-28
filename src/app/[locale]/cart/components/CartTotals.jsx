"use client";

import { useSelector } from "react-redux";
import { selectBasketData } from "@/store/cart";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

export default function CartTotals() {
  const t = useTranslations();
  const basketData = useSelector(selectBasketData);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("az-AZ", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price || 0);
  };

  return (
    <div className="col-span-1">
      <div className="flex flex-col gap-5 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex flex-row gap-2 items-center">
          <span className="text-base font-regular text-gray-600">{t("subtotal")}</span>
          <div className="flex-1 border-b border-gray-300 border-dashed"></div>
          <span className="text-base font-medium text-[#1A1A1A]">
            {formatPrice(basketData.total_price_in_basket)} ₼
          </span>
        </div>

        <div className="flex flex-row gap-2 items-center">
          <span className="text-base font-regular text-gray-600">{t("products")}</span>
          <div className="flex-1 border-b border-gray-300 border-dashed"></div>
          <span className="text-base font-medium text-[#1A1A1A]">
            {basketData.total_basket_quantity || 0}
          </span>
        </div>

        {basketData.total_discount_in_basket > 0 && (
          <div className="flex flex-row gap-2 items-center">
            <span className="text-base font-regular text-gray-600">{t("discount")}</span>
            <div className="flex-1 border-b border-gray-300 border-dashed"></div>
            <span className="text-base font-medium text-green-600">
              -{formatPrice(basketData.total_discount_in_basket)} ₼
            </span>
          </div>
        )}

        <div className="flex flex-row gap-2 items-center">
          <span className="text-base font-regular text-gray-600">{t("shipping")}</span>
          <div className="flex-1 border-b border-gray-300 border-dashed"></div>
          <span className="text-base font-medium text-green-600">
            {basketData.shipping === 0
              ? t("free")
              : `${formatPrice(basketData.shipping)} ₼`}
          </span>
        </div>

        <div className="flex flex-row gap-2 items-center pt-4 border-t border-gray-200">
          <span className="text-lg font-bold text-[#1A1A1A]">{t("total-amount")}</span>
          <div className="flex-1 border-b border-gray-400 border-dashed"></div>
          <span className="text-lg font-bold text-[#3696E7]">
            {formatPrice(
              (basketData.total_price_final_in_basket || 0) +
                (basketData.shipping || 0)
            )}{" "}
            ₼
          </span>
        </div>

        <Button asChild variant="primary" size="lg" className="w-full mt-2">
          <Link href="/checkout">{t("complete-order")}</Link>
        </Button>
      </div>
    </div>
  );
}

