import createIntlMiddleware from "next-intl/middleware";
import { routing } from "@/i18n/routing";

const intlMiddleware = createIntlMiddleware({
  localeDetection: true,
  ...routing,
});

export default function proxy(request) {
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|public|.*\\..*).*)"],
};
