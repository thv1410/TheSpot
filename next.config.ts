// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    localPatterns: [
      {
        pathname: "/**", // Allows all static assets in /public (like /profilePic.jpg)
      },
      {
        pathname: "/api/place-photo",
        search: "?**", // Allows the API proxy with query strings
      },
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "maps.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
    ],
  },
};

export default nextConfig;