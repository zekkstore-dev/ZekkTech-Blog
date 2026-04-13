import Navbar from '@/components/Navbar';
import HeroSection from '@/components/HeroSection';
import CategorySection from '@/components/CategorySection';
import ArticleSection from '@/components/ArticleSection';
import NewsletterSection from '@/components/NewsletterSection';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { seedPosts } from '@/lib/seed-data';
import type { Post } from '@/types/post';

async function getPosts(): Promise<Post[]> {
  // Try to fetch from Supabase, fall back to seed data
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || supabaseUrl.includes('your-project')) {
      // Supabase not configured, use seed data
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
  const cssPosts = posts.filter((p) => p.category === 'CSS Dasar').slice(0, 4);
  const jsPosts = posts.filter((p) => p.category === 'Javascript Tingkat Dasar').slice(0, 4);
  const reactPosts = posts.filter((p) => p.category === 'React JS').slice(0, 4);

  return (
    <main 
      className="min-h-screen bg-white"
      style={{
        backgroundImage: 'url(/images/Dot.svg)',
        backgroundRepeat: 'repeat',
        backgroundPosition: 'top center',
      }}
    >
      <Navbar />
      <HeroSection />
      <CategorySection />

      <div className="bg-white pt-6 pb-4">
        <ArticleSection title="Pilihan Editor" posts={featuredPosts} linkHref="/category/pilihan-editor" />
        <ArticleSection title="CSS Dasar" posts={cssPosts} linkHref="/category/css-dasar" />
        <ArticleSection title="Javascript Tingkat Dasar" posts={jsPosts} linkHref="/category/javascript-tingkat-dasar" />
        <ArticleSection title="React JS" posts={reactPosts} linkHref="/category/react-js" />

        {/* Lihat Semua button */}
        <div className="flex justify-center py-10">
          <Link
            href="#"
            className="inline-flex items-center justify-center px-10 py-3.5 bg-blue-500 hover:bg-blue-600 text-white rounded-full text-[15px] font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98]"
          >
            Lihat Semua
          </Link>
        </div>
      </div>

      <NewsletterSection />
      <Footer />
    </main>
  );
}
