import { getTranslations } from "next-intl/server";
import { HelpCircle } from "lucide-react";
import { serverApi } from "@/lib/axios";
import FaqAccordion from "./FaqAccordion";
import { shareMetadata } from "@/lib/shareMetadata";

const getFaqs = async () => {
  try {
    const res = await serverApi.get("/faqs/list");
    return res.data?.data ?? [];
  } catch {
    return [];
  }
};

export async function generateMetadata({ params }) {
  const { locale } = await params;
  const t = await getTranslations();
  return shareMetadata({
    title: t("faq"),
    description: t("faq_description"),
    path: `/${locale}/faq`,
    locale,
  });
}

export default async function FaqPage() {
  const [faqs, t] = await Promise.all([getFaqs(), getTranslations()]);

  return (
    <div className="container py-10 lg:py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-3 text-center text-3xl font-bold tracking-wide uppercase lg:text-4xl">
          {t("faq")}
        </h1>
        <p className="mb-10 text-center text-sm text-gray-500">
          {t("faq_description")}
        </p>

        {faqs.length > 0 ? (
          <FaqAccordion items={faqs} />
        ) : (
          <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
              <HelpCircle className="h-8 w-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500">{t("no_data_found")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
