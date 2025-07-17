import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'rem.0e8cd25dc98d9d71371ded06043d3725.r2.cloudflarestorage.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig; 