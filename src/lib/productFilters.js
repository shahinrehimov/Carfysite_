import { api } from "@/lib/axios";
import { siteConfig } from "@/config/site";

let cache = null;
let inflight = null;

/**
 * Normalizes GET `/{provider}/products/filters` payload (see filterexample.json).
 */
export function normalizeProductFiltersPayload(raw) {
  if (!raw || typeof raw !== "object") {
    return {
      categories: [],
      brands: [],
      priceRanges: null,
      cities: [],
      colors: [],
      statuses: [],
      yearRange: null,
      sortOptions: [],
      sortTypes: [],
    };
  }
  return {
    categories: Array.isArray(raw.categories) ? raw.categories : [],
    brands: Array.isArray(raw.brands) ? raw.brands : [],
    priceRanges:
      raw.price_ranges && typeof raw.price_ranges === "object"
        ? raw.price_ranges
        : null,
    cities: Array.isArray(raw.cities) ? raw.cities : [],
    colors: Array.isArray(raw.colors) ? raw.colors : [],
    statuses: Array.isArray(raw.statuses) ? raw.statuses : [],
    yearRange:
      raw.year_range && typeof raw.year_range === "object"
        ? raw.year_range
        : null,
    sortOptions: Array.isArray(raw.sort_options) ? raw.sort_options : [],
    sortTypes: Array.isArray(raw.sort_types) ? raw.sort_types : [],
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
    value: b.slug ?? String(b.id),
    label: b.title ?? "",
  }));
}

export function modelOptionsForBrandSlug(brands, brandSlug) {
  if (!brandSlug) return [];
  const brand = brands.find((b) => (b.slug ?? String(b.id)) === brandSlug);
  const models = brand?.brand_models;
  if (!Array.isArray(models)) return [];
  return models.map((m) => ({
    value: m.slug ?? String(m.id),
    label: m.title ?? "",
  }));
}

function normalizeSubcategories(cat) {
  const rawSubs = cat.subs ?? cat.sub_categories ?? cat.subcategories ?? [];
  if (!Array.isArray(rawSubs)) return [];
  return rawSubs
    .map((s) => ({
      id: s.id,
      slug: s.slug ?? "",
      name: s.title ?? s.name ?? "",
    }))
    .filter((s) => s.name);
}

export function categoriesForUi(brandsPayloadCategories) {
  return brandsPayloadCategories.map((cat) => ({
    id: cat.id,
    slug: cat.slug ?? "",
    name: cat.title ?? cat.name ?? "",
    subcategories: normalizeSubcategories(cat),
  }));
}

let categoriesCache = null;
let categoriesInflight = null;

export function getCachedCategoriesWithSubs() {
  return categoriesCache;
}

/** Deduplicated fetch for category navigation (includes nested subs). */
export function fetchCategoriesWithSubs() {
  if (categoriesCache) {
    return Promise.resolve(categoriesCache);
  }
  if (categoriesInflight) {
    return categoriesInflight;
  }
  categoriesInflight = api
    .get("/categories/list?with_subs=yes")
    .then((res) => {
      const raw = res.data?.data ?? res.data;
      categoriesCache = Array.isArray(raw) ? categoriesForUi(raw) : [];
      return categoriesCache;
    })
    .finally(() => {
      categoriesInflight = null;
    });
  return categoriesInflight;
}
