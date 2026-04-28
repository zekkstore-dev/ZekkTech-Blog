import { MetadataRoute } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { seedPosts } from '@/lib/seed-data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { getBaseUrl } = await import('@/lib/utils');
  const baseUrl = getBaseUrl();
  const now = new Date();

  // ── Static routes ─────────────────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/portofolio`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/sertifikat`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    // ── Fallback: pakai seed data kalau Supabase belum diatur ──────────────
    if (!supabaseUrl || supabaseUrl.includes('your-project')) {
      const dynamicRoutes = seedPosts.map((post) => ({
        url: `${baseUrl}/post/${post.slug}`,
        lastModified: new Date(post.created_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
      return [...staticRoutes, ...dynamicRoutes];
    }

    const supabase = await createServerSupabaseClient();

    // ── Fetch semua artikel yang dipublish ─────────────────────────────────
    const { data: posts } = await supabase
      .from('posts')
      .select('slug, updated_at, created_at, featured, category')
      .eq('published', true)
      .order('created_at', { ascending: false });

    const postRoutes: MetadataRoute.Sitemap = (posts ?? []).map((post) => ({
      url: `${baseUrl}/post/${post.slug}`,
      lastModified: new Date(post.updated_at || post.created_at),
      changeFrequency: 'weekly' as const,
      // artikel featured dapat priority lebih tinggi
      priority: post.featured ? 0.9 : 0.75,
    }));

    // ── Kategori unik dari artikel → /blog?search=<kategori> ──────────────
    const categorySet = new Set<string>();
    (posts ?? []).forEach((post) => {
      post.category?.split(',').forEach((cat: string) => {
        const trimmed = cat.trim();
        if (trimmed) categorySet.add(trimmed);
      });
    });

    const categoryRoutes: MetadataRoute.Sitemap = Array.from(categorySet).map((cat) => ({
      url: `${baseUrl}/blog?search=${encodeURIComponent(cat)}`,
      lastModified: now,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    return [...staticRoutes, ...postRoutes, ...categoryRoutes];

  } catch (error) {
    console.error('Error generating sitemap:', error);
  }

  return staticRoutes;
}
