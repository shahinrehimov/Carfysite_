export const siteConfig = {
  apiUrl:
    process.env.NEXT_PUBLIC_API_PROTOCOL +
    "://" +
    process.env.NEXT_PUBLIC_API_HOST +
    "/api",
  apiToken: process.env.NEXT_PUBLIC_API_TOKEN,
};
