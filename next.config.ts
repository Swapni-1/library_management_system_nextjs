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
  }
};

export default nextConfig;
