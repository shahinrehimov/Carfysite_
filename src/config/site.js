export const siteConfig = {
  apiUrl:
    process.env.NEXT_PUBLIC_API_PROTOCOL +
    "://" +
    process.env.NEXT_PUBLIC_API_HOST +
    "/api",
  apiToken: process.env.NEXT_PUBLIC_API_TOKEN,
  /** Path segment for `/api/site/{apiProvider}/products/filters` */
  apiProvider: process.env.NEXT_PUBLIC_API_PROVIDER ?? "site",
};
