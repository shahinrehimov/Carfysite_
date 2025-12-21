import MainFilter from "@/components/filter/MainFilter";
import { getTranslations } from "next-intl/server";

export default async function Banner() {
  const t = await getTranslations("home");

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

      <MainFilter type="banner" />
    </div>
  );
}
