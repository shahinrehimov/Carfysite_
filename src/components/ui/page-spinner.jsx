import { getTranslations } from "next-intl/server";

export default async function PageSpinner() {
  const t = await getTranslations();

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div
        className="w-12 h-12 rounded-full border-4 border-[#cee5f8] border-t-[#3696e7] animate-spin"
        role="status"
        aria-label={t("loading")}
      />
    </div>
  );
}
