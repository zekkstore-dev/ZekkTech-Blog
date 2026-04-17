import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NODE_ENV === 'production' ? 'https://zekktech.com' : 'http://localhost:3000';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/', '/login/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
