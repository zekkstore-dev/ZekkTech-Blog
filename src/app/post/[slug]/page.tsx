import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CommentSection from '@/components/CommentSection';
import { seedPosts } from '@/lib/seed-data';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import NewsletterSection from '@/components/NewsletterSection';
import ViewTracker from '@/components/ViewTracker';
import type { Post } from '@/types/post';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getPost(slug: string): Promise<Post | null> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl.includes('your-project')) {
      return seedPosts.find((p) => p.slug === slug) || null;
    }
    const { createServerSupabaseClient } = await import('@/lib/supabase/server');
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single();
    return data || seedPosts.find((p) => p.slug === slug) || null;
  } catch {
    return seedPosts.find((p) => p.slug === slug) || null;
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: 'Artikel tidak ditemukan' };
  return {
    title: `${post.title} | ZekkTech`,
    description: post.excerpt || post.title,
  };
}

export default async function PostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) notFound();

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      <article className="max-w-[720px] mx-auto px-6 py-10 sm:py-16">
        {/* Category badge */}
        <div className="mb-4">
          <Link 
            href="/#kategori" 
            className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
          >
            #{post.category}
          </Link>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-gray-900 leading-tight mb-6">
          {post.title}
        </h1>

        {/* Meta row */}
        <div className="flex items-center gap-4 mb-10 pb-8 border-b border-gray-100">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-sm font-bold">
            {post.author_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{post.author_name}</p>
            <p className="text-xs text-gray-400">
              {formatDate(post.created_at)} • {post.reading_time} Menit Dibaca
            </p>
          </div>
        </div>

        {/* Cover image */}
        {post.cover_url && (
          <div className="w-full max-h-[400px] rounded-2xl overflow-hidden bg-gray-100 mb-10 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.cover_url}
              alt={post.title}
              className="w-full h-full max-h-[400px] object-cover"
            />
          </div>
        )}

        {/* Content */}
        <div className="prose prose-lg prose-gray max-w-none">
          {post.content.split('\n').map((paragraph, i) => (
            <p key={i} className="text-gray-700 leading-relaxed mb-4 text-[16px]">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Comments */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <CommentSection postId={post.id} />
        </div>
      </article>

      {/* Analytics Hidden Tracker */}
      <ViewTracker postId={post.id} />

      {/* Newsletter */}
      <NewsletterSection />

      <Footer />
    </main>
  );
}
