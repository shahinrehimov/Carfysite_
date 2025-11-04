import { getTranslations } from "@/lib/getTranslations";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import { Providers } from "@/providers/providers";
import { poppins } from "@/lib/fonts";
import "@/assets/styles/globals.css";
import Header from "@/components/header/header";
import { defaultMetaTags } from "@/lib/constants/defaultMetaTags";
export const viewport = {
  width: "device-width",
  initialScale: 1,
};
export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL),
  ...defaultMetaTags,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: {
      url: "/apple-touch-icon.png",
      sizes: "180x180",
      type: "image/png",
    },
    other: [
      {
        url: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },
};

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;
  if (!routing.locales.includes(locale)) notFound();
  const messages = await getTranslations(locale);
  return (
    <html lang={locale} className={poppins.variable}>
      <body>
        <Providers locale={locale} messages={messages}>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
