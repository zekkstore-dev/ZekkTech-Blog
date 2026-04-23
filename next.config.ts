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

  // ─── Security Headers ────────────────────────────────────────────────────────
  async headers() {
    return [
      {
        // Terapkan ke semua route
        source: '/(.*)',
        headers: [
          // Mencegah clickjacking
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          // Mencegah MIME sniffing
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          // Kontrol referrer yang dikirim ke situs lain
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          // Batasi akses fitur browser yang tidak diperlukan
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
          },
          // Aktifkan DNS prefetch untuk performa
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          // Content Security Policy
          // - Cloudflare Turnstile butuh: challenges.cloudflare.com
          // - Supabase: *.supabase.co + wss untuk realtime
          // - R2/Workers: *.r2.dev, *.workers.dev
          // - WhatsApp link preview: tidak perlu CSP khusus
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // Next.js butuh unsafe-inline untuk hydration & style injection
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self' data:",
              // Gambar dari supabase, r2, dan workers
              "img-src 'self' data: blob: https://*.supabase.co https://*.r2.dev https://*.workers.dev",
              // Fetch/XHR ke supabase, turnstile verify, dan api sendiri
              "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://challenges.cloudflare.com https://*.r2.dev https://*.workers.dev",
              // Iframe hanya untuk Turnstile widget
              "frame-src https://challenges.cloudflare.com",
              // Situs lain tidak boleh embed halaman ini
              "frame-ancestors 'self'",
              // Form hanya boleh submit ke domain sendiri
              "form-action 'self'",
              // Base URI dibatasi ke domain sendiri
              "base-uri 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },

  // ─── Redirect URL lama ke not-found ──────────────────────────────────────────
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
