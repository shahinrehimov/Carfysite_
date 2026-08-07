"use client";

import { useTranslations } from "next-intl";
import SellerAvailabilityBlock from "@/components/store/SellerAvailabilityBlock";

export default function ProductSellerInfo({ data }) {
  console.log(data.seller);
  const t = useTranslations();

  if (!data?.seller) return null;

  return <SellerAvailabilityBlock seller={data.seller} t={t} />;
}
