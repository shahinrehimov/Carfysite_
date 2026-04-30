import { getTranslations } from "next-intl/server";
import { serverApi } from "@/lib/serverApi";
import { generateServiceUrl } from "@/lib/generateServiceUrl";
import ContactForm from "./ContactForm";
import Image from "next/image";
const getContactSettings = async () => {
  try {
    const url = generateServiceUrl([{ key: "setting", limit: 100 }]);
    const res = await serverApi.get(url);
    return res.data?.data?.setting ?? {};
  } catch {
    return {};
  }
};

export async function generateMetadata() {
  const t = await getTranslations();
  return {
    title: t("contact"),
  };
}

export default async function ContactPage() {
  const t = await getTranslations();
  const settings = await getContactSettings();

  const phone = settings.phone || settings.support_phone || null;
  const email = settings.email || settings.support_email || null;

  return (
    <div className="container py-10 lg:py-16">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-start">
        {/* Left — info */}
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-wide uppercase mb-3">
            {t("contact")}
          </h1>
          <p className="text-gray-500 text-sm mb-10">
            {t("contact_description")}
          </p>

          <div className="flex flex-col gap-7">
            {/* Support */}
            {phone && (
              <div className="flex items-start gap-3">
                <Image
                  src="/icons/contact-phone.svg"
                  alt="phone"
                  width={20}
                  height={20}
                  className="w-[20px] h-[20px] object-contain"
                />
                <div>
                  <p className="font-medium text-sm text-gray-900">
                    {t("support")}
                  </p>
                  <a
                    href={`tel:${phone}`}
                    className="text-sm text-gray-500 hover:text-blue-500 transition"
                  >
                    {phone}
                  </a>
                </div>
              </div>
            )}

            {/* Email */}
            {email && (
              <div className="flex items-start gap-3">
                <Image
                  src="/icons/contact-email.svg"
                  alt="phone"
                  width={20}
                  height={20}
                  className="w-[20px] h-[20px] object-contain"
                />
                <div>
                  <p className="font-medium text-sm text-gray-900">
                    {t("email")}
                  </p>
                  <a
                    href={`mailto:${email}`}
                    className="text-sm text-gray-500 hover:text-blue-500 transition"
                  >
                    {email}
                  </a>
                </div>
              </div>
            )}

            {/* Address */}
            {
              <div className="flex items-start gap-3">
                <Image
                  src="/icons/contact-address.svg"
                  alt="phone"
                  width={20}
                  height={20}
                  className="w-[20px] h-[20px] object-contain"
                />
                <div>
                  <p className="font-medium text-sm text-gray-900">
                    {t("office")}
                  </p>
                  <p className="text-sm text-gray-500">{t("address")}</p>
                </div>
              </div>
            }
          </div>
        </div>

        {/* Right — form */}
        <div>
          <ContactForm />
        </div>
      </div>
    </div>
  );
}
