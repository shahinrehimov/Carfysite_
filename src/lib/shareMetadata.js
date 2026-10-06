import { getProductGallery } from "@/lib/getProductGallery";

const OG_LOCALE = {
  az: "az_AZ",
  en: "en_US",
  ru: "ru_RU",
};

export function stripHtml(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function usableText(value, fallback) {
  const text = stripHtml(value);
  if (!text || /^\{[^}]+\}$/.test(text)) return fallback;
  return text;
}

export function defaultShareImage(locale = "az") {
  return `/${locale}/opengraph-image`;
}

export function shareMetadata({
  title,
  description,
  path,
  image,
  locale = "az",
  keywords,
}) {
  const cleanTitle = usableText(title, "Carfy");
  const cleanDescription = usableText(description, cleanTitle).slice(0, 300);
  const imageUrl = image || defaultShareImage(locale);
  const images = [{ url: imageUrl, alt: cleanTitle }];

  return {
    title: cleanTitle,
    description: cleanDescription,
    ...(keywords ? { keywords } : {}),
    openGraph: {
      title: cleanTitle,
      description: cleanDescription,
      url: path,
      siteName: "Carfy",
      type: "website",
      locale: OG_LOCALE[locale] || OG_LOCALE.az,
      alternateLocale: Object.values(OG_LOCALE).filter(
        (value) => value !== (OG_LOCALE[locale] || OG_LOCALE.az),
      ),
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: cleanTitle,
      description: cleanDescription,
      images: [imageUrl],
    },
  };
}

export function productSharePath(locale, segments, search = {}) {
  const params = new URLSearchParams();
  if (search.seller) params.set("seller", search.seller);
  if (search.variant) params.set("variant", search.variant);
  const query = params.toString();
  const path = `/${[locale, ...segments].filter(Boolean).join("/")}`;
  return query ? `${path}?${query}` : path;
}

function asImageUrl(value) {
  if (!value) return null;
  if (typeof value === "string") return value;
  return value.url || value.path || null;
}

export function productShareMetadata(data, { locale, segments, search }) {
  const image = getProductGallery(data).map(asImageUrl).find(Boolean) || null;
  return shareMetadata({
    title: data?.title,
    description: data?.description || data?.product?.description_short || data?.title,
    path: productSharePath(locale, segments, search),
    image,
    locale,
  });
}
