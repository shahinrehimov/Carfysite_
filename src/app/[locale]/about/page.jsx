import Image from "next/image";
import { getTranslations } from "next-intl/server";
import MainFilter from "@/components/filter/MainFilter";
import Promotion from "../home/Promotion";
import { shareMetadata } from "@/lib/shareMetadata";

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations();
  return shareMetadata({
    title: t("about_title"),
    description: t("about_feature_1_desc"),
    path: `/${locale}/about`,
    locale,
  });
}

export default async function AboutPage() {
  const t = await getTranslations();

  const features = [
    {
      icon: "/icons/about_1.svg",
      titleKey: "about_feature_1_title",
      descKey: "about_feature_1_desc",
    },
    {
      icon: "/icons/about_2.svg",
      titleKey: "about_feature_2_title",
      descKey: "about_feature_2_desc",
    },
    {
      icon: "/icons/about_3.svg",
      titleKey: "about_feature_3_title",
      descKey: "about_feature_3_desc",
    },
    {
      icon: "/icons/about_4.svg",
      titleKey: "about_feature_4_title",
      descKey: "about_feature_4_desc",
    },
  ];

  return (
    <div className="w-full">
      {/* Filter Section */}
      <div className="bg-[#F8F8F8] py-4 lg:py-6">
        <MainFilter type="default" />
      </div>

      {/* Biz Kimik? Section */}
      <section className="w-full py-10 lg:py-16 bg-white">
        <div className="container">
          <h1 className="text-3xl lg:text-[48px] font-bold text-center mb-8 lg:mb-10">
            {t("about_title")}
          </h1>
          <p className="text-gray-600 text-sm lg:text-base leading-relaxed mb-4">
            {t("about_description")}
          </p>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="w-full pb-10 lg:pb-16 bg-white">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-10">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center text-center gap-3"
              >
                <div className="w-14 h-14 lg:w-[72px] lg:h-[72px] flex items-center justify-center">
                  <Image
                    src={feature.icon}
                    alt={t(feature.titleKey)}
                    width={72}
                    height={72}
                    className="w-full h-auto"
                  />
                </div>
                <h3 className="text-sm lg:text-base font-semibold text-[#1A1A1A] leading-snug">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-xs lg:text-sm text-gray-500 leading-relaxed">
                  {t(feature.descKey)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blue Car Banner */}
      <section className="w-full relative overflow-hidden min-h-[200px] sm:min-h-[280px] lg:min-h-[580px]">
        <Image
          src="/images/about_speed_car.png"
          alt="Carfy Speed Car"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="relative z-10 container h-full justify-end flex items-center py-12 lg:py-20">
          <h2 className="text-right text-xl sm:text-2xl md:text-3xl lg:text-[44px] xl:text-[52px] font-bold text-[#00569C8F] leading-tight">
            {t("about_banner_title")}
          </h2>
        </div>
      </section>

      {/* Content Section Below Banner */}
      <section className="w-full pt-10 pb-12 lg:pb-30 bg-white">
        <div className="container">
          <p className="text-gray-600 text-sm lg:text-base leading-relaxed mb-4">
            {t("about_content")}
          </p>
        </div>
      </section>

      {/* App Promotion */}
      <Promotion />
      <div className="w-full h-[50px] bg-[#CEE5F8] mb-[-50px] lg:h-[100px] lg:mb-[-100px]"></div>
    </div>
  );
}
