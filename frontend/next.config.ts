import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,

  experimental: {
    optimizePackageImports: ["shadcn-ui"],
  },

  // Explicitly enable Turbopack (no webpack)
  turbopack: {},
};

export default nextConfig;
