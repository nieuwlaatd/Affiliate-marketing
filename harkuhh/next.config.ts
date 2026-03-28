import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'engwe-bikes-eu.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.shopify.com',
      },
      {
        protocol: 'http',
        hostname: 'engwe-bikes-eu.com',
      }
    ],
  },
};

export default nextConfig;
