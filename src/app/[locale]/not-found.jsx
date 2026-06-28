import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { SearchX } from "lucide-react";

export default async function NotFound() {
  const t = await getTranslations();

  return (
    <div className="container py-20 lg:py-32 flex flex-col items-center justify-center text-center gap-5">
      <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
        <SearchX className="w-10 h-10 text-gray-400" />
      </div>

      <div className="flex flex-col gap-2">
        <h1 className="text-6xl font-bold text-gray-200">404</h1>
        <h2 className="text-xl font-semibold text-gray-700">{t("title")}</h2>
        <p className="text-gray-400 text-sm max-w-sm">{t("description")}</p>
      </div>

      <Link
        href="/"
        className="mt-2 inline-flex items-center gap-2 bg-primary text-white text-sm font-medium px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity"
      >
        {t("back_home")}
      </Link>
    </div>
  );
}
