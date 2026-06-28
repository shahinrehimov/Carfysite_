import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { loadMessages } from "@/lib/loadMessages";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;
  if (!locale || !routing.locales.includes(locale)) {
    locale = routing.defaultLocale;
  }

  const messages = await loadMessages(locale);

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
