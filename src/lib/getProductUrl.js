export function getProductUrl(product) {
  if (!product) return null;

  const productData = product.product || product;
  const slug = product.slug || productData.slug;
  const categorySlugs = productData.category_slugs;
  const storeCode = product.seller?.store_code;
  const variant = product.variant_slug;

  if (storeCode && slug && categorySlugs?.sub_category_slug) {
    const params = new URLSearchParams();
    params.set("seller", storeCode);
    if (variant) params.set("variant", variant);
    const query = params.toString();

    if (categorySlugs.parent_category_slug) {
      return `/${categorySlugs.parent_category_slug}/${categorySlugs.sub_category_slug}/${slug}?${query}`;
    }

    return `/${categorySlugs.sub_category_slug}/${slug}?${query}`;
  }

  // Listings without a store code have no SEO path. The UUID page still opens them.
  const uuid = product.uuid;
  if (!uuid) return null;
  return variant
    ? `/products/show/${uuid}?variant=${encodeURIComponent(variant)}`
    : `/products/show/${uuid}`;
}
