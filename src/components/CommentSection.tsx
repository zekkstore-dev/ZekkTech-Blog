'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils';
import { Turnstile } from '@marsidev/react-turnstile';
import type { Comment } from '@/types/post';

interface CommentSectionProps {
  postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [token, setToken] = useState<string>('');
  
  const supabase = createClient();

  useEffect(() => {
    async function fetchComments() {
      // kalo supabase belom diatur, pake data bohongan dulu / jangan ngeload
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!supabaseUrl || supabaseUrl.includes('your-project')) {
        setFetching(false);
        return;
      }

      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setComments(data as Comment[]);
      }
      setFetching(false);
    }
    fetchComments();
  }, [postId, supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    if (!token) {
      setError('Tunggu verifikasi keamanan (mendeteksi bot) selesai...');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          postId,
          name: name.trim(),
          email: email.trim(),
          content: content.trim(),
          token
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengirim komentar.');
      }

      setSuccessMsg(data.message || 'Komentar berhasil masuk ke database! ✨ Akan ditampilkan setelah disetujui Admin.');
      setName('');
      setEmail('');
      setContent('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengirim komentar');
    } finally {
      setLoading(false);
    }
  };

  const visibleComments = showAll ? comments : comments.slice(0, 5);

  return (
    <div className="mt-16 pt-10 border-t border-gray-100">
      <h3 className="text-2xl font-bold text-gray-900 mb-8">Komentar ({comments.length})</h3>

      {/* Tampilkan Pesan Sukses / Error di bagian atas */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          {error}
        </div>
      )}

      {successMsg && (
        <div className="mb-8 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm font-medium flex items-center gap-3">
          <span className="text-xl">✅</span>
          {successMsg}
        </div>
      )}

      {/* Comments List */}
      {fetching ? (
        <div className="text-center text-gray-500 py-8">Memuat komentar...</div>
      ) : comments.length === 0 ? (
        <div className="text-center text-gray-500 py-8 mb-8">Belum ada komentar. Jadilah yang pertama!</div>
      ) : (
        <div className="space-y-6 mb-12">
          {visibleComments.map((comment) => (
            <div key={comment.id} className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 sm:p-6 transition-all hover:shadow-md">
              <div className="flex items-center gap-3 mb-3">
                {/* Avatar yang presisi sejajar dengan nama */}
                <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 text-sm font-bold shrink-0">
                  {comment.user_name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h5 className="font-bold text-gray-900">{comment.user_name}</h5>
                  <span className="text-xs text-gray-400 font-medium">{formatDate(comment.created_at)}</span>
                </div>
              </div>
              <p className="text-gray-700 text-[15px] leading-relaxed whitespace-pre-wrap pl-13">
                {comment.content}
              </p>
            </div>
          ))}
          
          {!showAll && comments.length > 5 && (
            <button
              onClick={() => setShowAll(true)}
              className="w-full mt-4 py-3 text-sm font-medium text-blue-600 bg-blue-50/50 hover:bg-blue-50 border border-blue-100 rounded-xl transition-colors"
            >
              Lihat semua {comments.length} komentar
            </button>
          )}
        </div>
      )}

      {/* Form Pindah ke Bawah */}
      <form onSubmit={handleSubmit} className="mb-12 bg-gray-50 p-6 sm:p-8 rounded-2xl">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Tinggalkan Komentar</h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Nama <span className="text-red-500">*</span></label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama kamu"
              className="w-full h-11 px-4 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
              required
              maxLength={50}
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Langganan <span className="text-red-500">*</span></label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email yang kamu subscribe"
              className="w-full h-11 px-4 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all"
              required
            />
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">Komentar <span className="text-red-500">*</span></label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Tuliskan pendapatmu tentang artikel ini..."
            rows={4}
            className="w-full p-4 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-all resize-y"
            required
            maxLength={1000}
          />
        </div>

        {/* Turnstile Captcha — cuma render kalo site key udah diisi */}
        <div className="mb-6">
          {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? (
            <Turnstile
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
              onSuccess={(t) => setToken(t)}
            />
          ) : (
            <p className="text-xs text-gray-400 italic">Captcha belum dikonfigurasi.</p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !name.trim() || !content.trim() || (!!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !token)}
          className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Mengirim...' : 'Kirim Komentar'}
        </button>
      </form>

    </div>
  );
}
