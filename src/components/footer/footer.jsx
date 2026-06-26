import Image from "next/image";
import { Link } from "@/i18n/routing";
import { serverApi as axiosServerApi } from "@/lib/axios";
import { generateServiceUrl } from "@/lib/generateServiceUrl";

const services = [
  {
    key: "social",
    limit: 100,
  },
];

const getServices = async () => {
  try {
    const res = await axiosServerApi.get(generateServiceUrl(services));
    return res.data.data;
  } catch (error) {
    return {
      social: [],
    };
  }
};
export default async function Footer({ translations = {} }) {
  const services = await getServices();
  const socialLinks = services.social;
  const t = (key) => translations[key] || key;

  const footerLinks = [
    { href: "/about", label: t("aboutUs") || "Hüquqi məlumat" },
    {
      href: "/pages/privacy-policy",
      label: t("privacy_policy") || "Məxfilik siyasəti",
    },
    { href: "/pages/warranty", label: t("warranty") || "Zəmanət" },
    { href: "/pages/returns", label: t("returns") || "Qaytarılma" },
    {
      href: "/pages/delivery",
      label: t("delivery") || "Çatdırılma və ödəmə",
    },
    { href: "/pages/faq", label: t("faq") || "Ən çox verilən suallar" },
    { href: "/contact", label: t("contact") || "Əlaqə" },
  ];

  return (
    <footer className="bg-white rounded-t-[32px] lg:rounded-t-[100px] relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <Link href="/" className="mb-4">
              <Image
                src="/images/logo.svg"
                alt="Carfy"
                width={120}
                height={40}
                className="h-10 w-auto"
              />
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed max-w-xs">
              {t("description") ||
                "Burada istənilən marka və model üçün orijinal ehtiyat hissələrinin elanlarını tapın, satıcı ilə birbaşa əlaqə saxlayın və lazım olan hissəni sürətlə əldə edin."}
            </p>
          </div>

          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              {t("about") || "Haqqımızda"}
            </h3>
            <ul className="space-y-3">
              {footerLinks.map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              {t("callCenter") || "Çağrı mərkəzi"}
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {t("hotline") || "Qaynar xətt:"}
                  <a
                    href="tel:991"
                    className="text-blue-600 font-semibold ml-1 hover:text-blue-700"
                  >
                    991
                  </a>
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {t("workingHours") || "Çağrı mərkəzinin iş saatları:"}
                </p>
                <p className="text-sm text-gray-900 font-medium">
                  {t("hours") || "Hər gün:08:00 - 01:00"}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              {t("followUs") || "Bizi izləyin"}
            </h3>
            <ul className="space-y-3 w-full">
              {socialLinks.map((social) => (
                <li key={social.id}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center md:justify-start gap-3 text-sm text-gray-700 hover:text-gray-900 transition-colors group"
                  >
                    <Image
                      src={social.image}
                      alt={social.title}
                      width={20}
                      height={20}
                    />
                    <span>{social.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            {t("copyright") || "© Carfy 2025. Bütün müəllif hüquqları qorunur"}
          </p>
        </div>
      </div>
    </footer>
  );
}
