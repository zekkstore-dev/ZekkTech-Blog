import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import CategorySection from '@/components/CategorySection';
import ArticleSection from '@/components/ArticleSection';
import NewsletterSection from '@/components/NewsletterSection';
import Footer from '@/components/Footer';
import MotionFAQ from '@/components/MotionFAQ';
import Link from 'next/link';
import { seedPosts } from '@/lib/seed-data';
import type { Post } from '@/types/post';

async function getPosts(): Promise<Post[]> {
  // coba ambil dari supabase, kalo gagal pake data dummy aja
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (!supabaseUrl || supabaseUrl.includes('your-project')) {
      // supabase belom di-setup, pake data contoh dulu
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

export default async function HomePage() {
  const posts = await getPosts();

  const featuredPosts = posts.filter((p) => p.featured || p.category === 'Pilihan Editor').slice(0, 4);
  const tutorialPosts = posts.filter((p) => p.category === 'Tutorial Teknologi').slice(0, 4);
  const beritaPosts = posts.filter((p) => p.category === 'Berita Teknologi').slice(0, 4);
  const templatePosts = posts.filter((p) => p.category === 'Template').slice(0, 4);

  return (
    <main 
      className="min-h-screen bg-[var(--bg-primary)] transition-colors duration-300"
      style={{
        backgroundImage: 'url(/images/Dot.svg)',
        backgroundRepeat: 'repeat',
        backgroundPosition: 'top center',
      }}
    >
      <Navbar />
      <HeroSection />
      <CategorySection />

      <div className="articles-bg bg-[var(--bg-secondary)] pt-6 pb-4 transition-colors duration-300">
        <ArticleSection title="Pilihan Editor" posts={featuredPosts} linkHref="/category/pilihan-editor" />
        <ArticleSection title="Tutorial Teknologi" posts={tutorialPosts} linkHref="/category/tutorial-teknologi" />
        <ArticleSection title="Berita Teknologi" posts={beritaPosts} linkHref="/category/berita-teknologi" />
        <ArticleSection title="Template" posts={templatePosts} linkHref="/category/template" />

        {/* Lihat Semua button */}
        <div className="flex justify-center py-10">
          <Link
            href="/blog"
            className="inline-flex items-center justify-center px-10 py-3.5 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-[15px] font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98]"
          >
            Lihat Semua
          </Link>
        </div>
      </div>

      <MotionFAQ />
      <NewsletterSection />
      <Footer />
    </main>
  );
}
