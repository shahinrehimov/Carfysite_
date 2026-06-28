import React from "react";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
const services = [
  {
    key: "setting",
    limit: 100,
  },
];
const getServices = async () => {
  try {
    const res = await serverApi.get(generateServiceUrl(services));
    return res.data.data;
  } catch (error) {
    return {
      setting: null,
    };
  }
};
async function Promotion() {
  const t = await getTranslations();
  const services = await getServices();
  const setting = services.setting;
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
                  data-setting-key="setting.google_play_url"
                  href={setting?.google_play_url ?? "#"}
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
                  data-setting-key="setting.app_store_url"
                  href={setting?.app_store_url ?? "#"}
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
                <div
                  className="w-[80px] h-[80px] lg:w-[120px] lg:h-[120px] relative"
                  data-setting-key="setting.qr_code_image"
                >
                  <Image
                    src={setting?.qr_code_image ?? "/images/qr.png"}
                    asChild
                    alt="QR Code"
                    data-setting-key="setting.qr_code_image"
                    width={120}
                    height={120}
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
