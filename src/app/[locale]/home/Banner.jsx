import React from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Button } from "@/components/ui/button";

function Banner() {
  const t = useTranslations();
  return (
    <div className="relative container-fluid h-[240px] lg:h-[420px] bg-[url('/images/banner.png')] bg-cover bg-center rounded-b-[16px] rounded-t-[40px] lg:rounded-t-[80px]">
      <div className="container">
        <div className="w-full px-0 lg:px-4 py-2 lg:pt-16 flex flex-col gap-2 lg:gap-4">
          <span className="text-white text-sm lg:text-base font-light">
            {t("banner_title")}
          </span>
          <span className="text-white text-2xl lg:text-4xl font-bold">
            Jamal
          </span>
          <p className="text-white text-sm lg:text-xl font-medium">
            {t("banner_description")}
          </p>
        </div>
      </div>

      <div className="container absolute bottom-[-30px] left-0 right-0 mx-auto  bg-[#FFFFFF52] rounded-[24px] lg:rounded-[40px] backdrop-blur-lg box-shadow-[0px_2px_16px_0px_#0000001F] p-4 flex items-center justify-between">
        <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-4">
          <button className="cursor-pointer col-span-1 bg-white text-lg font-regular rounded-full h-[48px] lg:h-[60px] hidden lg:flex items-center justify-center gap-2">
            <Image
              src="/icons/category.svg"
              alt="category"
              width={20}
              height={20}
            />
            <span className="text-[#00569C] text-sm lg:text-base font-light">
              {t("all_categories")}
            </span>
          </button>

          <div className="col-span-2 relative">
            <div className="bg-white rounded-full h-[48px] lg:h-[60px] flex items-center justify-between pl-6 gap-3">
              <div className="flex items-center gap-3 w-full">
                <Image
                  src="/icons/search.svg"
                  alt="search"
                  width={20}
                  height={20}
                  className="opacity-40"
                />
                <input
                  type="text"
                  placeholder={t("search")}
                  className="flex-1 bg-transparent outline-none text-[#00569C] placeholder:text-[#00569C80] text-sm lg:text-base font-light max-w-fit"
                />
              </div>
              <button className="cursor-pointer px-1 flex items-center justify-center border rounded-[8px] w-[36px] lg:w-[42px] h-[36px] lg:h-[42px] border-[#00569C]">
                <Image
                  src="/icons/filter.svg"
                  alt="filter"
                  width={20}
                  height={20}
                />
              </button>
              <button className="bg-[#3696E7] text-white text-sm lg:text-base font-regular rounded-tl-[8px] rounded-bl-[8px] rounded-tr-[40px] rounded-br-[40px] h-[48px] lg:h-[60px] w-[120px] flex items-center justify-center cursor-pointer">
                {t("find")}
              </button>
            </div>
          </div>

          <div className="col-span-1">
            <Button
              variant="primary"
              size="lg"
              className=" h-[48px] lg:h-[60px] cursor-pointer w-full"
            >
              <Image src="/icons/car.svg" alt="car" width={20} height={20} />
              <span className="text-white text-sm lg:text-base font-light">
                {t("search_by_car")}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Banner;
