"use client";

import { Plus } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function AddCarCard({ onClick }) {
  const t = useTranslations();
  return (
    <>
      <div className="hidden lg:block bg-white rounded-2xl overflow-hidden border-2 border-gray-200 relative">
        <div className="relative h-[160px] flex items-center relative">
          <div
            className="absolute inset-0 z-2"
            style={{
              background:
                "linear-gradient(90deg,rgba(0,0,0,0) 13%, rgba(255,255,255,1) 60%)",
            }}
          ></div>
          <div className="w-2/3 h-full relative z-1">
            <Image
              src="/images/banner.png"
              alt={t("cars_add_banner_alt")}
              fill
              className="object-cover"
            />
          </div>

          <div className="w-1/3 flex items-center justify-center px-6 relative z-3">
            <Button
              onClick={onClick}
              variant="outline"
              className="border-1 border-[#4A90E2] text-[#4A90E2] hover:bg-[#4A90E2] hover:text-white rounded-full px-10 py-6 text-base font-medium transition-all cursor-pointer min-w-[260px]"
            >
              <Plus className="w-5 h-5 mr-2" />
              {t("cars_add_card")}
            </Button>
          </div>
        </div>
      </div>

      <div className="lg:hidden bg-white rounded-2xl overflow-hidden">
        <div className="relative h-[240px]">
          <Image
            src="/images/banner.png"
            alt={t("cars_add_banner_alt")}
            fill
            className="object-cover"
          />

          <div className="absolute inset-0 bg-black/10" />

          <div className="absolute inset-0 flex items-center justify-center ">
            <Button
              onClick={onClick}
              variant="outline"
              className=" bg-white/95 backdrop-blur-sm border-2 border-[#4A90E2] text-[#4A90E2] hover:bg-[#4A90E2] hover:text-white rounded-full px-8 py-6 text-base font-medium transition-all w-full cursor-pointer max-w-[260px]"
            >
              <Plus className="w-5 h-5 mr-2" />
              {t("cars_add_card")}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
