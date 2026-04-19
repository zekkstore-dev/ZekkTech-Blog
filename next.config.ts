import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.r2.dev',
      },
      {
        protocol: 'https',
        hostname: '*.workers.dev',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
    ],
  },
  // Redirect URL lama /admin dan /login ke 404 — jangan biarkan bisa ditebak
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/not-found',
        permanent: false,
      },
      {
        source: '/admin/:path*',
        destination: '/not-found',
        permanent: false,
      },
      {
        source: '/login',
        destination: '/not-found',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
