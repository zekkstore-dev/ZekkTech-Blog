import { getBaseUrl } from '@/lib/utils';
import { seedPosts } from '@/lib/seed-data';

export const dynamic = 'force-dynamic';

export async function GET() {
  const baseUrl = getBaseUrl();
  let posts: any[] = [];

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (supabaseUrl && !supabaseUrl.includes('your-project')) {
      const { createServerSupabaseClient } = await import('@/lib/supabase/server');
      const supabase = await createServerSupabaseClient();
      const { data, error } = await supabase
        .from('posts')
        .select('slug, updated_at, created_at, featured')
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (!error && data) {
        posts = data;
      } else {
        posts = seedPosts;
      }
    } else {
      posts = seedPosts;
    }
  } catch (error) {
    console.error('Error fetching posts for sitemap:', error);
    posts = seedPosts;
  }

  const postUrls = posts.map((post) => {
    const lastmod = new Date(post.updated_at || post.created_at).toISOString();
    const priority = post.featured ? '0.9' : '0.75';
    return {
      loc: `${baseUrl}/post/${post.slug}`,
      priority: priority,
      changefreq: 'weekly',
      lastmod: lastmod,
    };
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<?xml-stylesheet type="text/xsl" href="/main-sitemap.xsl"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${postUrls
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
