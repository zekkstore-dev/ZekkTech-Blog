import Link from 'next/link';
import AdminPostTable from '@/components/AdminPostTable';
import { seedPosts } from '@/lib/seed-data';
import type { Post } from '@/types/post';

async function getAllPosts(): Promise<Post[]> {
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
      .order('created_at', { ascending: false });

    if (error || !data) return seedPosts;
    return data;
  } catch {
    return seedPosts;
  }
}

export default async function AdminDashboard() {
  const posts = await getAllPosts();

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Semua Artikel</h1>
          <p className="text-sm text-gray-500 mt-1">{posts.length} artikel ditemukan</p>
        </div>
        <Link
          href="/admin/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/25"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5V19M5 12H19" />
          </svg>
          Buat Artikel Baru
        </Link>
      </div>

      {/* Post Table */}
      <AdminPostTable posts={posts} />
    </div>
  );
}
