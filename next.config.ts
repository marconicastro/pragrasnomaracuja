import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: false, // ✅ Enable type checking
  },
  reactStrictMode: true, // ✅ Enable strict mode to catch bugs
  webpack: (config, { dev }) => {
    if (dev) {
      // Optimize watch options for better performance
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
      };
    }
    return config;
  },
  eslint: {
    ignoreDuringBuilds: false, // ✅ Enable ESLint validation
  },
};

export default nextConfig;
