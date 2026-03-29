import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
