export default function ProductShareTags({ data }) {
  if (!data) return null;

  const amount = Number(data.price_final ?? data.price);
  const brand =
    data.product?.brand?.title || data.fitments?.[0]?.brand?.title || "";
  const availability = Number(data.stock) > 0 ? "in stock" : "out of stock";

  return (
    <>
      {Number.isFinite(amount) && (
        <meta property="product:price:amount" content={amount.toFixed(2)} />
      )}
      <meta property="product:price:currency" content="AZN" />
      <meta property="product:availability" content={availability} />
      {brand ? <meta property="product:brand" content={brand} /> : null}
    </>
  );
}
