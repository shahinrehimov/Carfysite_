import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { siteConfig } from "@/config/site";

let translationsCache = {};
let versionCache = null;

async function getTranslations(locale) {
  try {
    const versionResponse = await fetch(`${siteConfig.apiUrl}/versions`, {
      headers: { Token: siteConfig.apiToken },
    });
    const { lang_version } = await versionResponse.json();

    if (lang_version !== versionCache || !translationsCache[locale]) {
      const response = await fetch(
        `${siteConfig.apiUrl}/site/local-translations/${locale}`,
        { headers: { Token: siteConfig.apiToken } }
      );
      const { data } = await response.json();
      translationsCache[locale] = data.translations;
      versionCache = lang_version;
    }

    return translationsCache[locale];
  } catch (error) {
    console.error("Error fetching translations:", error);
    return {};
  }
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale)) {
    locale = routing.defaultLocale;
  }

  const messages = await getTranslations(locale);

  return {
    locale,
    messages,
    timeZone: "Asia/Baku",
    now: new Date(),
    defaultTranslationValues: {},
    getMessageFallback: ({ key }) => {
      return `{${key}}`;
    },
    onError: () => undefined,
    logging: { level: "error" },
  };
});
