"use client";

import { useSelector } from "react-redux";
import { selectBasketData } from "@/store/cart";
import { useTranslations } from "next-intl";

export default function CartHeader() {
  const t = useTranslations();
  const basketData = useSelector(selectBasketData);

  return (
    <h1 className="text-2xl lg:text-3xl xl:text-4xl font-semibold text-center lg:text-left">
      {t("cart")} ({basketData?.total_basket_quantity || 0} {t("products")})
    </h1>
  );
}

