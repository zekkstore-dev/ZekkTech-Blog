import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';
import NewsletterSection from '@/components/NewsletterSection';
import { seedPosts } from '@/lib/seed-data';
import type { Post } from '@/types/post';
import { Search } from 'lucide-react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

const knownCategories: Record<string, string> = {
  'pilihan-editor': 'Pilihan Editor',
  'tutorial-teknologi': 'Tutorial Teknologi',
  'berita-teknologi': 'Berita Teknologi',
  template: 'Template',
  'tips-trik': 'Tips & Trik',
  funfact: 'FunFact',
};

function slugifyCategory(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function postCategories(post: Post): string[] {
  return post.category
    .split(',')
    .map((c) => c.trim())
    .filter(Boolean);
}

async function getPosts(): Promise<Post[]> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl.includes('your-project')) {
      return seedPosts;
    }

    const { createServerSupabaseClient } = await import('@/lib/supabase/server');
    const supabase = await createServerSupabaseClient();

    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return seedPosts;
    }
    return data;
  } catch {
    return seedPosts;
  }
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await props.params;
  const name = knownCategories[slug] ?? slug.replace(/-/g, ' ');
  const title = `Kategori ${name} | ZekkTech`;
  const description = `Artikel ZekkTech dalam kategori ${name}.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/category/${slug}`,
    },
    openGraph: {
      title,
      description,
      url: `/category/${slug}`,
      type: 'website',
    },
    twitter: {
      title,
      description,
    },
  };
}

export default async function CategoryPage(
  props: { params: Promise<{ slug: string }> }
) {
  const { slug } = await props.params;
  const posts = await getPosts();

  const matched = posts.filter((post) =>
    postCategories(post).some((cat) => slugifyCategory(cat) === slug)
  );

  const matchedName = matched.length > 0
    ? postCategories(matched[0]).find((cat) => slugifyCategory(cat) === slug)
    : undefined;
  const categoryName = knownCategories[slug] ?? matchedName;

  if (!categoryName) {
    notFound();
  }

  return (
    <main className="blog-page min-h-screen bg-[var(--bg-primary)] transition-colors duration-300">
      <Navbar />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-24 py-16">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Kategori: {categoryName}
          </h1>
          <p className="blog-description text-gray-500 dark:text-gray-400 text-lg">
            {matched.length > 0
              ? `Ditemukan ${matched.length} artikel dalam kategori ${categoryName}.`
              : `Belum ada artikel dalam kategori ${categoryName}.`}
          </p>
        </div>

        {matched.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
            {matched.map((post) => (
              <ArticleCard
                key={post.id}
                title={post.title}
                slug={post.slug}
                coverUrl={post.cover_url}
                excerpt={post.excerpt}
                category={post.category}
                authorName={post.author_name}
                createdAt={post.created_at}
                readingTime={post.reading_time}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state text-center py-20 bg-[var(--bg-tertiary)] rounded-2xl border border-gray-100">
            <Search className="w-12 h-12 mx-auto mb-4 text-gray-400 dark:text-gray-600" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Artikel Tidak Ditemukan</h3>
            <p className="text-gray-500 dark:text-gray-400">Belum ada artikel yang diterbitkan dalam kategori ini.</p>
          </div>
        )}
      </div>

      <NewsletterSection />
      <Footer />
    </main>
  );
}
