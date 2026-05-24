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
      {
        source: '/compare',
        destination: '/e-bikes/vergelijk',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ];
  },
};

export default nextConfig;
