'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils';
import type { Post } from '@/types/post';

interface AdminPostTableProps {
  posts: Post[];
}

export default function AdminPostTable({ posts }: AdminPostTableProps) {
  const router = useRouter();
  const supabase = createClient();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Yakin ingin menghapus "${title}"?`)) return;
    setDeletingId(id);
    try {
      const { error } = await supabase.from('posts').delete().eq('id', id);
      if (error) throw error;
      router.refresh();
    } catch (err) {
      alert('Gagal menghapus: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setDeletingId(null);
    }
  };

  const handleTogglePublish = async (id: string, currentPublished: boolean) => {
    setTogglingId(id);
    try {
      const { error } = await supabase
        .from('posts')
        .update({ published: !currentPublished })
        .eq('id', id);
      if (error) throw error;
      router.refresh();
    } catch (err) {
      alert('Gagal mengubah status: ' + (err instanceof Error ? err.message : 'Unknown error'));
    } finally {
      setTogglingId(null);
    }
  };

  if (posts.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-400">
            <path d="M9 12H15M12 9V15M3 12C3 7.029 7.029 3 12 3C16.971 3 21 7.029 21 12C21 16.971 16.971 21 12 21C7.029 21 3 16.971 3 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        <p className="text-gray-500 mb-4">Belum ada artikel</p>
        <Link
          href="/admin/new"
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-all"
        >
          Buat Artikel Pertama
        </Link>
      </div>
    );
  }

  return (
    <div className="admin-table bg-white rounded-2xl border border-gray-100 overflow-hidden transition-colors duration-300">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="admin-table-head bg-gray-50 border-b border-gray-100 transition-colors duration-300">
              <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Artikel</th>
              <th className="text-left px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Kategori</th>
              <th className="text-left px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Tanggal</th>
              <th className="text-center px-4 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {posts.map((post) => (
              <tr key={post.id} className="admin-table-row hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4">
                  <p className="admin-table-title text-sm font-semibold text-gray-900 line-clamp-1">{post.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5 font-mono">/{post.slug}</p>
                </td>
                <td className="px-4 py-4 hidden sm:table-cell">
                  <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600">
                    {post.category}
                  </span>
                </td>
                <td className="px-4 py-4 hidden md:table-cell">
                  <span className="text-sm text-gray-500">{formatDate(post.created_at)}</span>
                </td>
                <td className="px-4 py-4 text-center">
                  <button
                    onClick={() => handleTogglePublish(post.id, post.published)}
                    disabled={togglingId === post.id}
                    className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                      post.published
                        ? 'bg-green-50 text-green-700 hover:bg-green-100'
                        : 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100'
                    } ${togglingId === post.id ? 'opacity-50' : ''}`}
                  >
                    {post.published ? 'Published' : 'Draft'}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/edit/${post.id}`}
                      className="p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all"
                      title="Edit"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                    </Link>
                    <button
                      onClick={() => handleDelete(post.id, post.title)}
                      disabled={deletingId === post.id}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-50"
                      title="Hapus"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
