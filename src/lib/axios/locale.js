import { getLocale as getNextIntlLocale } from "next-intl/server";
import { routing } from "../../i18n/routing";

/**
 * Get current locale
 * Works both on server-side and client-side
 * @returns {Promise<string>|string} Current locale or default locale
 */
export async function getLocale() {
  const serverSide = typeof window === "undefined";
  let currentLang;

  if (serverSide) {
    try {
      currentLang = await getNextIntlLocale();
    } catch {
      currentLang = routing.defaultLocale;
    }
  } else {
    // Client-side: extract locale from current pathname
    const pathname = window.location.pathname;
    const pathSegments = pathname.split('/');
    const pathLocale = pathSegments[1]; // First segment after '/'
    
    // Check if the path locale is valid
    if (routing.locales.includes(pathLocale)) {
      currentLang = pathLocale;
    } else {
      currentLang = routing.defaultLocale;
    }
  }

  return currentLang;
}

