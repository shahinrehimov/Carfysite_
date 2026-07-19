export function getProductUrl(product) {
  if (!product?.seller?.store_code) return null;

  const productData = product.product || product;
  const slug = product.slug || productData.slug;
  const categorySlugs = productData.category_slugs;

  if (!slug || !categorySlugs?.sub_category_slug) return null;

  const sellerQuery = `seller=${product.seller.store_code}`;
  const variantQuery = product.variant_slug
    ? `&variant=${product.variant_slug}`
    : "";

  if (categorySlugs.parent_category_slug) {
    return `/${categorySlugs.parent_category_slug}/${categorySlugs.sub_category_slug}/${slug}?${sellerQuery}${variantQuery}`;
  }

  return `/${categorySlugs.sub_category_slug}/${slug}?${sellerQuery}${variantQuery}`;
}
