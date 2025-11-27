import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack(config) {
    // Keep your SVGR configuration here
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  reactStrictMode: true, // Consider enabling this in development for better practices
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.1.3',
        port: '3001',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.1.4',
        port: '3001',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.1.5',
        port: '3001',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '192.168.1.6',
        port: '3001',
        pathname: '/**',
      },
      // Support dynamic API URL from env
      ...(process.env.NEXT_PUBLIC_API_URL ? (() => {
        try {
          const apiUrl = new URL(process.env.NEXT_PUBLIC_API_URL);
          return [{
            protocol: apiUrl.protocol.replace(':', '') as 'http' | 'https',
            hostname: apiUrl.hostname,
            port: apiUrl.port || '',
            pathname: '/**',
          }];
        } catch {
          return [];
        }
      })() : []),
    ],
  },
};

export default nextConfig;