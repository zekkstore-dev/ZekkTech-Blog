import { getBaseUrl } from '@/lib/utils';
import { seedPosts } from '@/lib/seed-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = getBaseUrl();
  const now = new Date().toISOString();

  // Static routes configuration
  const staticRoutes = [
    { loc: `${baseUrl}`, priority: '1.0', changefreq: 'daily', lastmod: now },
    { loc: `${baseUrl}/blog`, priority: '0.9', changefreq: 'daily', lastmod: now },
    { loc: `${baseUrl}/about`, priority: '0.7', changefreq: 'monthly', lastmod: now },
    { loc: `${baseUrl}/portofolio`, priority: '0.7', changefreq: 'weekly', lastmod: now },
    { loc: `${baseUrl}/sertifikat`, priority: '0.5', changefreq: 'monthly', lastmod: now },
  ];

  const categorySet = new Set<string>();

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (supabaseUrl && !supabaseUrl.includes('your-project')) {
      const { createServerSupabaseClient } = await import('@/lib/supabase/server');
      const supabase = await createServerSupabaseClient();
      const { data: posts } = await supabase
        .from('posts')
        .select('category')
        .eq('published', true);

      (posts ?? []).forEach((post) => {
        post.category?.split(',').forEach((cat: string) => {
          const trimmed = cat.trim();
          if (trimmed) categorySet.add(trimmed);
        });
      });
    } else {
      // Fallback seed categories
      seedPosts.forEach((post) => {
        post.category?.split(',').forEach((cat: string) => {
          const trimmed = cat.trim();
          if (trimmed) categorySet.add(trimmed);
        });
      });
    }
  } catch (error) {
    console.error('Error fetching categories for sitemap:', error);
  }

  const categoryRoutes = Array.from(categorySet).map((cat) => ({
    loc: `${baseUrl}/blog?search=${encodeURIComponent(cat)}`,
    priority: '0.6',
    changefreq: 'weekly',
    lastmod: now,
  }));

  const allUrls = [...staticRoutes, ...categoryRoutes];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/main-sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${allUrls
    .map(
      (item) => `
  <url>
    <loc>${item.loc}</loc>
    <priority>${item.priority}</priority>
    <changefreq>${item.changefreq}</changefreq>
    <lastmod>${item.lastmod}</lastmod>
  </url>`
    )
    .join('')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=600',
    },
  });
}
