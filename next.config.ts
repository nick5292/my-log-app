import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    appDir: true, // ← ★これが必要！
  },
};

export default nextConfig;
