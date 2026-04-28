import { MetadataRoute } from 'next';
import { getBaseUrl } from '@/lib/utils';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getBaseUrl();

  return {
    rules: [
      {
        // Bot umum: izinkan semua halaman publik
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin-zt/',
          '/admin-zt/login',
          '/api/',
          '/_next/',
          '/not-found',
        ],
      },
      {
        // Googlebot: beri akses penuh ke halaman publik
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin-zt/', '/api/'],
      },
      {
        // Batasi bot AI/scraper yang agresif
        userAgent: ['GPTBot', 'ChatGPT-User', 'CCBot', 'anthropic-ai', 'Claude-Web'],
        disallow: '/',
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
