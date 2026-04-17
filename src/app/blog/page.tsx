import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ArticleCard from '@/components/ArticleCard';
import { seedPosts } from '@/lib/seed-data';
import type { Post } from '@/types/post';
import NewsletterSection from '@/components/NewsletterSection';
import { SearchEngine, ScoredPost } from '@/lib/models/SearchEngine';

export const metadata = {
  title: 'Semua Artikel | ZekkTech',
  description: 'Jelajahi seluruh koleksi artikel teknologi, panduan, dan inspirasi kami.',
};

async function getPosts(searchQuery?: string): Promise<Post[]> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl.includes('your-project')) {
      return seedPosts;
    }

    const { createServerSupabaseClient } = await import('@/lib/supabase/server');
    const supabase = await createServerSupabaseClient();

    // ambil semua post soalnya TF-IDF butuh semua data buat dikalkulasi di memori
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

export default async function BlogPage(
  props: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
  }
) {
  const params = await props.searchParams;
  const rawSearchQuery = params?.search;
  const searchQuery = Array.isArray(rawSearchQuery) ? rawSearchQuery[0] : (rawSearchQuery || '');
  const rawPosts = await getPosts();

  // jalanin mesin pencari kalo ada query, kalo ga ya tampilin semua
  const displayPosts: ScoredPost[] = searchQuery
    ? SearchEngine.search(rawPosts, searchQuery)
    : rawPosts.map(p => ({ ...p, similarityScore: undefined, highlightWords: [] }));

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-24 py-16">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            {searchQuery ? `Hasil Pencarian: "${searchQuery}"` : 'Semua Artikel'}
          </h1>
          <p className="text-gray-500 text-lg">
            {searchQuery
              ? `Ditemukan ${displayPosts.length} artikel yang sesuai dengan pencarian Anda.`
              : 'Jelajahi seluruh koleksi artikel teknologi, kumpulan tutorial, dan konten inspiratif.'}
          </p>
        </div>

        {/* Grid Artikel */}
        {displayPosts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayPosts.map((post) => (
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
                similarityScore={post.similarityScore}
                highlightWords={post.highlightWords}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-gray-100">
            <div className="text-4xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Artikel Tidak Ditemukan</h3>
            <p className="text-gray-500">Coba gunakan kata kunci pencarian yang lain.</p>
          </div>
        )}
      </div>

      <NewsletterSection />
      <Footer />
    </main>
  );
}
