import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images : {
    remotePatterns : [
      {
        hostname : "**",
        protocol : "https"
      }
    ]
  },
  experimental : {
    turbo : {
      
    }
  },
  eslint: {
    // This allows production builds to complete even with ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // This allows production builds to complete even with TypeScript errors.
    ignoreBuildErrors: true,
  }
};

export default nextConfig;
