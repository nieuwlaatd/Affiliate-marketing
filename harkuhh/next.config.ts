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
      },
      {
        protocol: 'https',
        hostname: 'duotts.com',
      },
      {
        protocol: 'https',
        hostname: 'www.samebike.com',
      },
      {
        protocol: 'https',
        hostname: 'samebike.com',
      },
      {
        protocol: 'https',
        hostname: 'dyucycle.com',
      },
      {
        protocol: 'https',
        hostname: 'vtuviaebike.com',
      }
    ],
  },
  async redirects() {
    return [
      {
        source: '/fietsen',
        destination: '/e-bikes',
        permanent: true,
      },
      {
        source: '/fietsen/:path*',
        destination: '/e-bikes/:path*',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
