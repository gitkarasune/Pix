import type { NextConfig } from "next";
import type { Configuration as WebpackDevMiddlewareConfig } from "webpack-dev-middleware";

const nextConfig: NextConfig = {
  /* config options here */
  webpackDevMiddleware: (config: WebpackDevMiddlewareConfig) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  eslint: {ignoreDuringBuilds: true,},
  typescript: {ignoreBuildErrors: true,},
};

export default nextConfig;
