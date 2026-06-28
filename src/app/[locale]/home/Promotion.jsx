import React from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

async function Promotion() {
  const t = await getTranslations();

  return (
    <section className="w-full bg-[#CEE5F8] ">
      <div className="container mx-auto px-4 py-8 md:py-0 relative">
        <Image
          src="/images/handphone.png"
          alt="Carfy Mobile App"
          width={660}
          height={620}
          className=" absolute bottom-0 w-[300px] lg:w-[550px] lg:left-[200px]"
          priority
        />
        <div className="w-full relative z-10 lg:py-10">
          <div className="w-full pl-30 lg:pl-150 flex flex-col   ">
            <h2 className="text-[24px] lg:text-[48px] font-bold text-[#EC5C30] leading-tight mb-4 md:mb-6">
              {t("promotion_title_line1")}
              <br />
              {t("promotion_title_line2")}
            </h2>

            <p className="text-base lg:text-[20px] text-gray-800 mb-6 md:mb-8 max-w-md">
              {t("promotion_description")}
            </p>

            <div className="flex  items-center gap-4 md:gap-6">
              <div className="flex flex-col gap-3 sm:gap-4">
                <a
                  href="#"
                  className="block w-[115px] lg:w-[160px] transition-transform hover:scale-105"
                  aria-label={t("download_google_play")}
                >
                  <Image
                    src="/icons/google-play.svg"
                    alt={t("download_google_play")}
                    width={160}
                    height={50}
                    className="w-full h-auto"
                  />
                </a>

                <a
                  href="#"
                  className="block w-[115px] lg:w-[160px] transition-transform hover:scale-105"
                  aria-label={t("download_app_store")}
                >
                  <Image
                    src="/icons/app-store.svg"
                    alt={t("download_app_store")}
                    width={160}
                    height={50}
                    className="w-full h-auto"
                  />
                </a>
              </div>

              <div className="shrink-0">
                <div className="w-[80px] h-[80px] lg:w-[120px] lg:h-[120px] relative">
                  <Image
                    src="/images/qr.png"
                    alt="QR Code"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Promotion;
