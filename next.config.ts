import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Mengizinkan semua image external masuk termasuk Cloudflare R2 untuk kemudahan
      },
    ],
  },
};

export default nextConfig;
