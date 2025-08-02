import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  output: "standalone",
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      if (config.optimization?.minimizer?.[0]?.options?.terserOptions) {
        config.optimization.minimizer[0].options.terserOptions.compress = {
          ...config.optimization.minimizer[0].options.terserOptions.compress,
          drop_console: true,
          drop_debugger: true,
        };
      }
    }
    return config;
  },

  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dhcv9w2ilyvje.cloudfront.net",
        port: "",
        pathname: "/**",
      },
    ],
  },
  // async headers() {
  //   return [
  //     {
  //       source: "/:all*(svg|jpg|png|jpeg|gif|webp|avif|ico|bmp|tiff)",
  //       locale: false,
  //       headers: [
  //         {
  //           key: "Cache-Control",
  //           value: "public, max-age=86400",
  //         },
  //       ],
  //     },
  //   ];
  // },
};

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
export default withNextIntl(withPWA(nextConfig));
