import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['picsum.photos', 'res.cloudinary.com', 'raw.githubusercontent.com']
  }
};

export default nextConfig;
