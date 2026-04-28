// next.config.mjs
import createNextIntlPlugin from "next-intl/plugin";

// const withNextIntl = createNextIntlPlugin("./src/i18n/request.js");
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.NEXT_PUBLIC_API_HOST,
      },
    ],
  },
  devIndicators: false,
};

export default withNextIntl(nextConfig);
