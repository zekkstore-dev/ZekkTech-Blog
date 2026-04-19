import { MetadataRoute } from 'next';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { seedPosts } from '@/lib/seed-data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { getBaseUrl } = await import('@/lib/utils');
  const baseUrl = getBaseUrl();
  
  // Static routes
  const routes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.5,
    },
  ];

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    
    // kalo belum setup supabase (masih default), pake seed data
    if (!supabaseUrl || supabaseUrl.includes('your-project')) {
      const dynamicRoutes = seedPosts.map((post) => ({
        url: `${baseUrl}/post/${post.slug}`,
        lastModified: new Date(post.created_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
      return [...routes, ...dynamicRoutes];
    }

    const supabase = await createServerSupabaseClient();
    const { data: posts } = await supabase
      .from('posts')
      .select('slug, updated_at, created_at')
      .eq('published', true);

    if (posts) {
      const dynamicRoutes = posts.map((post) => ({
        url: `${baseUrl}/post/${post.slug}`,
        lastModified: new Date(post.updated_at || post.created_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
      }));
      return [...routes, ...dynamicRoutes];
    }
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }

  return routes;
}
