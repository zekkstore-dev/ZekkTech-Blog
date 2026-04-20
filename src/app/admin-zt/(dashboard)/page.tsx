import Link from 'next/link';
import { FileText, Eye, Users } from 'lucide-react';
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

async function getStats() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl.includes('your-project')) {
      return { views: 0, subs: 0 };
    }
    const { createServerSupabaseClient } = await import('@/lib/supabase/server');
    const supabase = await createServerSupabaseClient();

    // Using exact=true to get count effectively
    const { count: vCount } = await supabase.from('page_views').select('*', { count: 'exact', head: true });
    const { count: sCount } = await supabase.from('subscribers').select('*', { count: 'exact', head: true });

    return { views: vCount || 0, subs: sCount || 0 };
  } catch {
    return { views: 0, subs: 0 };
  }
}

export default async function AdminDashboard() {
  const posts = await getAllPosts();
  const stats = await getStats();

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="admin-title text-2xl font-bold text-gray-900">Semua Artikel</h1>
          <p className="admin-subtitle-text text-sm text-gray-500 mt-1">{posts.length} artikel ditemukan</p>
        </div>
        <Link
          href="/admin-zt/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/25"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5V19M5 12H19" />
          </svg>
          Buat Artikel Baru
        </Link>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="admin-stat-card bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between transition-colors duration-300">
          <div>
            <p className="admin-stat-label text-sm font-medium text-gray-500 mb-1">Total Artikel</p>
            <h4 className="admin-stat-value text-3xl font-bold text-gray-900">{posts.length}</h4>
          </div>
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="admin-stat-card bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between transition-colors duration-300">
          <div>
            <p className="admin-stat-label text-sm font-medium text-gray-500 mb-1">Total Pengunjung</p>
            <h4 className="admin-stat-value text-3xl font-bold text-gray-900">{stats.views}</h4>
          </div>
          <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-500">
            <Eye className="w-6 h-6" />
          </div>
        </div>

        <div className="admin-stat-card bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between transition-colors duration-300">
          <div>
            <p className="admin-stat-label text-sm font-medium text-gray-500 mb-1">Total Subscribers</p>
            <h4 className="admin-stat-value text-3xl font-bold text-gray-900">{stats.subs}</h4>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-500">
            <Users className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Post Table */}
      <AdminPostTable posts={posts} />
    </div>
  );
}
