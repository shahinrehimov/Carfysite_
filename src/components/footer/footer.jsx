import Image from "next/image";
import { Link } from "@/i18n/routing";
import { serverApi as axiosServerApi } from "@/lib/axios";
import { generateServiceUrl } from "@/lib/generateServiceUrl";
import { getTranslations } from "next-intl/server";

const services = [
  {
    key: "social",
    limit: 100,
  },
  {
    key: "setting",
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
      setting: null,
    };
  }
};
export default async function Footer() {
  const t = await getTranslations();
  const services = await getServices();
  const socialLinks = services.social;
  const setting = services.setting;
  const footerLinks = [
    { href: "/about", label: t("about_us") },
    {
      href: "/pages/privacy-policy",
      label: t("privacy_policy"),
    },
    { href: "/pages/warranty", label: t("warranty") },
    { href: "/pages/returns", label: t("returns") },
    {
      href: "/pages/delivery",
      label: t("delivery"),
    },
    { href: "/faq", label: t("faq") },
    { href: "/contact", label: t("contact") },
  ];

  return (
    <footer className="bg-white rounded-t-[32px] lg:rounded-t-[100px] relative z-10 pb-16 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-12">
          <div className="col-span-2 md:col-span-1 flex flex-col items-center md:items-start text-center md:text-left">
            <Link href="/" className="mb-2 lg:mb-4">
              <Image
                src="/images/logo.svg"
                alt="Carfy"
                width={120}
                height={40}
                className="h-9 lg:h-10 w-auto"
              />
            </Link>
            <p className="text-sm text-gray-600 leading-relaxed max-w-xs line-clamp-2 lg:line-clamp-none">
              {t("description")}
            </p>
          </div>

          <div className="col-span-2 md:col-span-1 flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-sm lg:text-base font-semibold text-gray-900 mb-2.5 lg:mb-4">
              {t("about")}
            </h3>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-2 md:grid-cols-1 md:gap-y-3 w-full max-w-sm md:max-w-none">
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
            <h3 className="text-sm lg:text-base font-semibold text-gray-900 mb-2.5 lg:mb-4">
              {t("call_center")}
            </h3>
            <div className="space-y-2 lg:space-y-3">
              <p className="text-sm text-gray-600">
                {t("hotline")}
                <a
                  href={`tel:${setting?.phone ?? ""}`}
                  className="text-blue-600 font-semibold ml-1 hover:text-blue-700"
                >
                  {setting?.phone}
                </a>
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <h3 className="text-sm lg:text-base font-semibold text-gray-900 mb-2.5 lg:mb-4">
              {t("follow_us")}
            </h3>
            <ul className="flex flex-wrap items-center justify-center md:flex-col md:items-start gap-3 md:gap-3">
              {socialLinks.map((social) => (
                <li key={social.id}>
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.title}
                    className="flex items-center justify-center md:justify-start gap-2.5 text-sm text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    <Image src={social.image} alt="" width={20} height={20} />
                    <span className="hidden md:inline">{social.title}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 lg:mt-8 pt-5 lg:pt-8 border-t border-gray-200">
          <p className="text-center text-xs lg:text-sm text-gray-600">
            {t("copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
