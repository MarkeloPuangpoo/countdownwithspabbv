import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    "http://localhost:3000",
    "http://192.168.1.108:3000",
    "http://169.254.83.107:3000",
  ],
};

export default nextConfig;
