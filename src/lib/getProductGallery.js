/**
 * Build the product detail gallery for a variant payload.
 *
 * The seller's own photos come first so the gallery opens on the same image the
 * product card showed, then the variant's images, then the product's as the
 * shared fallback. Duplicates are dropped because the same file can appear in
 * more than one collection.
 */
export function getProductGallery(data) {
  if (!data) return [];

  const urls = [
    ...(data.seller?.images || []).map((image) => image?.url),
    data.main_image,
    data.hover_image,
    ...(data.images || []),
    data.product?.main_image,
    data.product?.hover_image,
    ...(data.product?.images || []),
  ];

  return [...new Set(urls.filter(Boolean))];
}
