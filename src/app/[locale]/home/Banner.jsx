import MainFilter from "@/components/filter/MainFilter";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";

export default async function Banner({ services }) {
  const t = await getTranslations();

  const cookieStore = await cookies();
  const accessToken =
    cookieStore.get("access_token")?.value ||
    cookieStore.get("auth_token")?.value;
  const userDataRaw = cookieStore.get("user_data")?.value;

  let user = null;
  if (accessToken && userDataRaw) {
    try {
      user = JSON.parse(userDataRaw);
    } catch {
      user = null;
    }
  }

  return (
    <div
      style={{
        backgroundImage: `url(${services.setting?.home_banner_image || "/images/banner.png"})`,
      }}
      data-setting="settings.home_banner_image"
      className="relative container-fluid h-[240px] lg:h-[420px] bg-cover bg-center rounded-b-[16px] rounded-t-[40px] lg:rounded-t-[80px]"
    >
      {user && (
        <div className="container">
          <div className="w-full px-0 lg:px-4 py-2 lg:pt-16 flex flex-col gap-2 lg:gap-4">
            <span className="text-white text-sm lg:text-base font-light">
              {t("banner_title")}
            </span>
            <span className="text-white text-2xl lg:text-4xl font-bold">
              {user.name || user.full_name || user.first_name}
            </span>
            <p className="text-white text-sm lg:text-xl font-medium">
              {t("banner_description")}
            </p>
          </div>
        </div>
      )}

      <MainFilter type="banner" />
    </div>
  );
}
