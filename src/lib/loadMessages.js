import { siteConfig } from "@/config/site";
import { getForwardedForHeaders } from "@/lib/getClientIp";

let translationsCache = {};
let versionCache = null;

/**
 * Site UI translations for next-intl (client + server).
 * Must match keys uploaded with group "site".
 */
export async function loadMessages(locale) {
  try {
    const forwardHeaders = await getForwardedForHeaders();

    const versionResponse = await fetch(`${siteConfig.apiUrl}/versions`, {
      headers: { Token: siteConfig.apiToken, ...forwardHeaders },
      next: { revalidate: 60 },
    });
    const { lang_version } = await versionResponse.json();

    if (lang_version !== versionCache || !translationsCache[locale]) {
      const response = await fetch(
        `${siteConfig.apiUrl}/site/local-translations/${locale}`,
        {
          headers: { Token: siteConfig.apiToken, ...forwardHeaders },
          next: { revalidate: 60 },
        }
      );
      const { data } = await response.json();
      translationsCache[locale] = data.translations ?? {};
      versionCache = lang_version;
    }

    return translationsCache[locale];
  } catch (error) {
    console.error("Error fetching translations:", error);
    return {};
  }
}
