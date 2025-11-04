import { siteConfig } from "@/config/site";

let translationsCache = {};
let versionCache = null;

export async function getTranslations(locale) {
  try {
    const versionResponse = await fetch(`${siteConfig.apiUrl}/versions`, {
      headers: { Token: siteConfig.apiToken },
    });
    const { lang_version } = await versionResponse.json();

    if (lang_version !== versionCache || !translationsCache[locale]) {
      const response = await fetch(
        `${siteConfig.apiUrl}/app/local-translations/${locale}`,
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
