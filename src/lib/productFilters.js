import { api } from "@/lib/axios";
import { siteConfig } from "@/config/site";

let cache = null;
let inflight = null;

/**
 * Normalizes GET `/{provider}/products/filters` payload (see filterexample.json).
 * Intentionally omits `statuses` from consumer-facing shape.
 */
export function normalizeProductFiltersPayload(raw) {
  if (!raw || typeof raw !== "object") {
    return { categories: [], brands: [], priceRanges: null };
  }
  return {
    categories: Array.isArray(raw.categories) ? raw.categories : [],
    brands: Array.isArray(raw.brands) ? raw.brands : [],
    priceRanges:
      raw.price_ranges && typeof raw.price_ranges === "object"
        ? raw.price_ranges
        : null,
  };
}

export function getCachedProductFilters() {
  return cache;
}

/**
 * Deduplicated client fetch for product filter metadata.
 */
export function fetchProductFilters() {
  if (cache) {
    return Promise.resolve(cache);
  }
  if (inflight) {
    return inflight;
  }
  const path = `/products/filters`;
  inflight = api
    .get(path)
    .then((res) => {
      const raw = res.data?.data ?? res.data;
      cache = normalizeProductFiltersPayload(raw);
      return cache;
    })
    .catch((err) => {
      throw err;
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

export function brandOptionsFromBrands(brands) {
  return brands.map((b) => ({
    value: String(b.id),
    label: b.title ?? "",
  }));
}

export function modelOptionsForBrandId(brands, brandIdStr) {
  if (!brandIdStr) return [];
  const brand = brands.find((b) => String(b.id) === String(brandIdStr));
  const models = brand?.brand_models;
  if (!Array.isArray(models)) return [];
  return models.map((m) => ({
    value: String(m.id),
    label: m.title ?? "",
  }));
}

export function categoriesForUi(brandsPayloadCategories) {
  return brandsPayloadCategories.map((cat) => ({
    id: cat.id,
    name: cat.title ?? "",
    subcategories: Array.isArray(cat.subs)
      ? cat.subs.map((s) => s.title ?? "").filter(Boolean)
      : [],
  }));
}
