import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',

      },
      {
        protocol: 'https',
        hostname: 'aeroverso.com.br',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'www.aeroverso.com.br',
        pathname: '/media/**',
      },
    ],
  },
  output: 'standalone'
};

export default nextConfig;