import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true, // disables vercel images optimization
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
