"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Loader2, Search } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { api } from "@/lib/axios";
import { cn } from "@/lib/utils";

function label(t, key, values) {
  try {
    const value = values ? t(key, values) : t(key);
    if (!value || value === key || value === `{${key}}`) return key;
    return value;
  } catch {
    return key;
  }
}

function formatMoney(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return "";
  return number.toFixed(2);
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function Highlight({ text, query }) {
  const source = text == null ? "" : String(text);
  const words = [
    ...new Set(
      query
        .trim()
        .toLowerCase()
        .split(/\s+/)
        .filter((word) => word.length >= 2)
    ),
  ];
  if (!source || words.length === 0) return source;

  const pattern = new RegExp(`(${words.map(escapeRegExp).join("|")})`, "ig");
  const parts = source.split(pattern);

  return parts.map((part, index) =>
    words.includes(part.toLowerCase()) ? (
      <mark key={index} className="bg-[#FFF3C4] text-inherit rounded-sm">
        {part}
      </mark>
    ) : (
      <span key={index}>{part}</span>
    )
  );
}

export function categoryPath(category) {
  if (!category?.title) return "";
  if (category.parent_title) {
    return `${category.parent_title} › ${category.title}`;
  }
  if (category.parent?.title) {
    return `${category.parent.title} › ${category.title}`;
  }
  return category.title;
}

export function suggestionProductHref(product) {
  const storeCode = product?.seller?.store_code;
  const slug = product?.product_slug || product?.slug;
  const categorySlug = product?.category?.slug;
  const params = new URLSearchParams();
  if (product?.variant_slug) params.set("variant", product.variant_slug);

  if (storeCode && slug && categorySlug) {
    params.set("seller", storeCode);
    const parentSlug = product.category?.parent_slug;
    const path = parentSlug
      ? `/${parentSlug}/${categorySlug}/${slug}`
      : `/${categorySlug}/${slug}`;
    return `${path}?${params.toString()}`;
  }

  if (product?.uuid) {
    const query = params.toString();
    return query
      ? `/products/show/${product.uuid}?${query}`
      : `/products/show/${product.uuid}`;
  }

  return null;
}

export function suggestionCategoryHref(query, category) {
  const search = encodeURIComponent(query.trim().slice(0, 500));
  const slug = encodeURIComponent(category.slug);
  const key = category.is_sub ? "sub_categories[]" : "categories[]";
  return `/products?search=${search}&${key}=${slug}`;
}

function readSuggestionsPayload(payload) {
  if (!payload || typeof payload !== "object") {
    return { products: [], categories: [] };
  }

  const body =
    Array.isArray(payload.products) || Array.isArray(payload.categories)
      ? payload
      : payload.data && typeof payload.data === "object"
        ? payload.data
        : {};

  return {
    products: Array.isArray(body.products) ? body.products : [],
    categories: Array.isArray(body.categories) ? body.categories : [],
  };
}

export function useProductSuggestions(query, enabled) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    const trimmed = query.trim();
    if (!enabled || trimmed.length < 2) {
      setProducts([]);
      setCategories([]);
      setStatus("idle");
      return;
    }

    const controller = new AbortController();
    setProducts([]);
    setCategories([]);
    setStatus("loading");

    const timer = setTimeout(async () => {
      try {
        const response = await api.get("/products/suggestions", {
          params: {
            search: trimmed.slice(0, 100),
            limit: 6,
            categories_limit: 5,
          },
          signal: controller.signal,
        });
        if (controller.signal.aborted) return;
        const body = readSuggestionsPayload(response.data);
        setProducts(body.products);
        setCategories(body.categories);
        setStatus("success");
      } catch (error) {
        if (controller.signal.aborted || error?.code === "ERR_CANCELED") return;
        setProducts([]);
        setCategories([]);
        setStatus("error");
      }
    }, 300);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query, enabled]);

  return { products, categories, status };
}

function ProductThumb({ src, alt }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-lg bg-gray-100 shrink-0" aria-hidden />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={56}
      height={56}
      className="w-11 h-11 sm:w-14 sm:h-14 rounded-lg object-contain bg-gray-50 shrink-0"
      onError={() => setFailed(true)}
    />
  );
}

function sellersText(sellers, t) {
  if (!sellers || sellers.count <= 1) return null;
  if (sellers.has_other_prices) {
    return label(t, "search_suggestions_from_price", {
      count: sellers.count,
      price: formatMoney(sellers.min_price),
    });
  }
  return label(t, "search_suggestions_stores", { count: sellers.count });
}

export default function SearchSuggestions({
  open,
  query,
  products,
  categories,
  status,
  anchorRef,
  viewAllHref,
  onClose,
}) {
  const t = useTranslations();
  const router = useRouter();
  const panelRef = useRef(null);
  const listId = useId();
  const [activeIndex, setActiveIndex] = useState(-1);
  const [box, setBox] = useState(null);
  const trimmed = query.trim();

  const items = useMemo(() => {
    const next = [];
    categories.forEach((category) => {
      if (!category?.slug) return;
      next.push({
        type: "category",
        key: `category-${category.id}`,
        href: suggestionCategoryHref(trimmed, category),
        category,
      });
    });
    products.forEach((product) => {
      const href = suggestionProductHref(product);
      if (!href) return;
      next.push({
        type: "product",
        key: `product-${product.id ?? product.uuid}`,
        href,
        product,
      });
    });
    if (trimmed.length >= 2 && viewAllHref) {
      next.push({ type: "all", key: "all-results", href: viewAllHref });
    }
    return next;
  }, [categories, products, trimmed, viewAllHref]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [trimmed, products, categories]);

  const pinFieldRef = useRef(false);

  useEffect(() => {
    if (open) pinFieldRef.current = true;
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    let frame = 0;

    const place = () => {
      const element = anchorRef.current;
      if (!element) return;

      const viewport = window.visualViewport;
      const viewportTop = viewport?.offsetTop ?? 0;
      const viewportWidth = viewport?.width ?? window.innerWidth;
      const viewportBottom =
        viewportTop + (viewport?.height ?? window.innerHeight);
      const keyboardInset = Math.max(0, window.innerHeight - viewportBottom);
      const isMobile = window.innerWidth < 1024;
      const keyboardOpen = isMobile && keyboardInset > 80;
      const bottomGap = keyboardOpen ? 64 : isMobile ? 88 : 16;
      const bottomLimit = viewportBottom - bottomGap;

      if (pinFieldRef.current && isMobile) {
        pinFieldRef.current = false;
        const current = element.getBoundingClientRect();
        const targetTop = viewportTop + 8;
        if (current.top > targetTop + 12 || current.bottom > bottomLimit - 200) {
          window.scrollBy(0, current.top - targetTop);
        }
      }

      const rect = element.getBoundingClientRect();
      const margin = isMobile ? 12 : 8;
      const left = isMobile ? margin : Math.max(margin, rect.left);
      const width = isMobile
        ? viewportWidth - margin * 2
        : Math.min(rect.width, viewportWidth - left - margin);
      const top = Math.max(viewportTop + 8, rect.bottom + 8);

      setBox({
        top,
        left,
        width,
        maxHeight: Math.max(160, bottomLimit - top),
      });
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(place);
    };

    const onViewportResize = () => {
      pinFieldRef.current = true;
      schedule();
    };

    schedule();
    window.addEventListener("resize", schedule);
    window.addEventListener("scroll", schedule, true);
    const viewport = window.visualViewport;
    viewport?.addEventListener("resize", onViewportResize);
    viewport?.addEventListener("scroll", schedule);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("scroll", schedule, true);
      window.visualViewport?.removeEventListener("resize", onViewportResize);
      window.visualViewport?.removeEventListener("scroll", schedule);
    };
  }, [open, anchorRef]);

  useEffect(() => {
    if (!open) return undefined;

    const onPointerDown = (event) => {
      const target = event.target;
      if (anchorRef.current?.contains(target)) return;
      if (panelRef.current?.contains(target)) return;
      onClose();
    };

    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open, anchorRef, onClose]);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      const input = anchorRef.current?.querySelector("input");
      if (!input || document.activeElement !== input) return;

      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (items.length === 0) return;
        setActiveIndex((current) => (current + 1) % items.length);
        return;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        if (items.length === 0) return;
        setActiveIndex((current) =>
          current <= 0 ? items.length - 1 : current - 1
        );
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        const selected = activeIndex >= 0 ? items[activeIndex] : null;
        const href = selected?.href || viewAllHref;
        if (!href) return;
        onClose();
        router.push(href);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, items, activeIndex, anchorRef, onClose, router, viewAllHref]);

  useEffect(() => {
    if (activeIndex < 0) return;
    document
      .getElementById(`${listId}-option-${activeIndex}`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, listId]);

  if (!open || trimmed.length < 2 || !box || typeof document === "undefined") {
    return null;
  }

  const showEmpty = status === "success" && products.length === 0 && categories.length === 0;
  const categoriesLabel = label(t, "categories");
  const productsLabel = label(t, "products");
  let optionIndex = 0;

  const panel = (
    <div
      ref={panelRef}
      id={listId}
      role="listbox"
      style={{
        position: "fixed",
        top: box.top,
        left: box.left,
        width: box.width,
        maxHeight: box.maxHeight,
      }}
      onPointerDown={(event) => event.preventDefault()}
      className="z-[70] overflow-y-auto overscroll-contain rounded-2xl border border-gray-200 bg-white shadow-xl"
    >
      {status === "loading" && products.length === 0 && categories.length === 0 && (
        <div className="flex items-center justify-center gap-2 px-4 py-6 text-sm text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin text-[#3696E7]" />
          <span>{t("loading")}</span>
        </div>
      )}

      {status === "error" && (
        <p className="px-4 py-6 text-sm text-center text-gray-500">{t("error")}</p>
      )}

      {showEmpty && (
        <p className="px-4 py-6 text-sm text-center text-gray-500">
          {label(t, "no_results_found")}
        </p>
      )}

      {categories.length > 0 && (
        <div className="py-2">
          <p className="px-4 pb-1 text-[11px] font-medium uppercase tracking-wide text-gray-400">
            {categoriesLabel}
          </p>
          {items
            .filter((item) => item.type === "category")
            .map((item) => {
              const index = optionIndex;
              optionIndex += 1;
              const active = index === activeIndex;
              return (
                <Link
                  key={item.key}
                  id={`${listId}-option-${index}`}
                  href={item.href}
                  prefetch={false}
                  role="option"
                  aria-selected={active}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={onClose}
                  className={cn(
                    "flex items-center justify-between gap-3 px-4 py-2.5 text-sm text-[#1A1A1A]",
                    active ? "bg-[#F3F8FD]" : "hover:bg-[#F3F8FD]"
                  )}
                >
                  <span className="min-w-0 truncate">
                    {categoryPath(item.category)}
                  </span>
                  <span className="shrink-0 text-gray-400">
                    ({item.category.products_count})
                  </span>
                </Link>
              );
            })}
        </div>
      )}

      {products.length > 0 && (
        <div className={cn("py-2", categories.length > 0 && "border-t border-gray-100")}>
          <p className="px-4 pb-1 text-[11px] font-medium uppercase tracking-wide text-gray-400">
            {productsLabel}
          </p>
          {items
            .filter((item) => item.type === "product")
            .map((item) => {
              const index = optionIndex;
              optionIndex += 1;
              const product = item.product;
              const active = index === activeIndex;
              const hasDiscount = Boolean(product.has_discount) && product.discount != null;
              const otherSellers = sellersText(product.sellers, t);
              return (
                <Link
                  key={item.key}
                  id={`${listId}-option-${index}`}
                  href={item.href}
                  prefetch={false}
                  role="option"
                  aria-selected={active}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={onClose}
                  className={cn(
                    "flex items-start gap-3 px-4 py-2.5",
                    active ? "bg-[#F3F8FD]" : "hover:bg-[#F3F8FD]"
                  )}
                >
                  <ProductThumb src={product.image} alt={product.title || ""} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-[#1A1A1A] line-clamp-2">
                      <Highlight text={product.title} query={trimmed} />
                    </span>
                    {product.oem_code && (
                      <span className="mt-0.5 block text-xs text-gray-500 truncate">
                        <Highlight text={product.oem_code} query={trimmed} />
                      </span>
                    )}
                    {categoryPath(product.category) && (
                      <span className="mt-0.5 block text-xs text-gray-500 truncate">
                        {categoryPath(product.category)}
                      </span>
                    )}
                    <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5">
                      <span className="text-sm font-semibold text-[#00569C]">
                        {formatMoney(product.price_final)} ₼
                      </span>
                      {hasDiscount && (
                        <span className="text-xs text-gray-400 line-through">
                          {formatMoney(product.price)} ₼
                        </span>
                      )}
                      {hasDiscount && (
                        <span className="text-xs font-medium text-red-500">
                          {product.discount_type === "by_amount"
                            ? `-${product.discount} ₼`
                            : `-${product.discount}%`}
                        </span>
                      )}
                    </span>
                    {otherSellers && (
                      <span className="mt-0.5 block text-xs text-gray-500">
                        {otherSellers}
                      </span>
                    )}
                  </span>
                </Link>
              );
            })}
        </div>
      )}

      {viewAllHref && (
        <Link
          id={`${listId}-option-${items.findIndex((item) => item.type === "all")}`}
          href={viewAllHref}
          prefetch={false}
          role="option"
          aria-selected={items[activeIndex]?.type === "all"}
          onMouseEnter={() =>
            setActiveIndex(items.findIndex((item) => item.type === "all"))
          }
          onClick={onClose}
          className={cn(
            "sticky bottom-0 flex items-center gap-2 border-t border-gray-100 bg-white px-4 py-3 text-sm font-medium text-[#00569C]",
            items[activeIndex]?.type === "all" ? "bg-[#F3F8FD]" : "hover:bg-[#F3F8FD]"
          )}
        >
          <Search className="h-4 w-4 shrink-0" />
          <span className="min-w-0 truncate">
            {label(t, "search_suggestions_all", { query: trimmed })}
          </span>
        </Link>
      )}
    </div>
  );

  return createPortal(panel, document.body);
}
