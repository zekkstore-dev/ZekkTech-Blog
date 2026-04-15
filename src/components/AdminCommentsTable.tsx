'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function AdminCommentsTable({ initialComments }: { initialComments: any[] }) {
  const [comments, setComments] = useState(initialComments);
  const supabase = createClient();

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus komentar ini?')) return;
    
    // Optimistic UI
    setComments(comments.filter(c => c.id !== id));
    
    await supabase.from('comments').delete().eq('id', id);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="bg-gray-50/50 text-gray-700 font-semibold border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 w-48">Pengguna</th>
              <th className="px-6 py-4">Komentar</th>
              <th className="px-6 py-4 w-48">Artikel Rujukan</th>
              <th className="px-6 py-4 w-32 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {comments.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-400">Belum ada komentar sama sekali.</td>
              </tr>
            ) : comments.map((c) => (
              <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 align-top">
                  <div className="font-medium text-gray-900">{c.user_name}</div>
                  <div className="text-xs text-gray-400 mt-1">{formatDate(c.created_at)}</div>
                </td>
                <td className="px-6 py-4 text-gray-700 align-top whitespace-pre-wrap max-w-sm">
                  {c.content}
                </td>
                <td className="px-6 py-4 align-top">
                  {c.posts ? (
                    <Link href={`/post/${c.posts.slug}`} target="_blank" className="text-blue-500 hover:underline line-clamp-2">
                      {c.posts.title}
                    </Link>
                  ) : <span className="text-gray-400">Artikel tak dikenal</span>}
                </td>
                <td className="px-6 py-4 text-right align-top">
                  <button
                    onClick={() => handleDelete(c.id)}
                    className="text-red-500 hover:text-red-700 font-medium px-3 py-1 rounded bg-red-50 hover:bg-red-100 transition-colors text-xs"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
