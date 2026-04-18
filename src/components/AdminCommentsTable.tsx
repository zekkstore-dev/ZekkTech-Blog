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
    
    // hapus dulu dari tampilan biar responsif, baru hapus di db
    setComments(comments.filter(c => c.id !== id));
    
    await supabase.from('comments').delete().eq('id', id);
  };

  const handleApprove = async (id: string) => {
    // update tampilan duluan biar ga nunggu loading
    setComments(comments.map(c => c.id === id ? { ...c, is_approved: true } : c));
    
    // baru update ke database benerannya
    await supabase.from('comments').update({ is_approved: true }).eq('id', id);
  };

  return (
    <div className="admin-table bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-colors duration-300">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="admin-table-head bg-gray-50/50 text-gray-700 font-semibold border-b border-gray-100 transition-colors duration-300">
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
              <tr key={c.id} className="admin-table-row hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 align-top">
                  <div className="font-medium text-gray-900 flex items-center gap-2 admin-table-title">
                    {c.user_name}
                    {c.is_approved ? (
                      <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                        Disetujui
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-md bg-yellow-50 px-2 py-1 text-xs font-medium text-yellow-800 ring-1 ring-inset ring-yellow-600/20">
                        Menunggu
                      </span>
                    )}
                  </div>
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
                  <div className="flex items-center justify-end gap-2">
                    {!c.is_approved && (
                      <button
                        onClick={() => handleApprove(c.id)}
                        className="text-green-600 hover:text-green-800 font-medium px-3 py-1 rounded bg-green-50 hover:bg-green-100 transition-colors text-xs"
                      >
                        Setujui
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(c.id)}
                      className="text-red-500 hover:text-red-700 font-medium px-3 py-1 rounded bg-red-50 hover:bg-red-100 transition-colors text-xs"
                    >
                      Hapus
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
