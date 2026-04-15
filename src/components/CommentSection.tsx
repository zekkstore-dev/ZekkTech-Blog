'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils';
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
  
  const supabase = createClient();

  useEffect(() => {
    async function fetchComments() {
      // Mock mode fallback when no Supabase
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!supabaseUrl || supabaseUrl.includes('your-project')) {
        setFetching(false);
        return;
      }

      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('post_id', postId)
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

    setLoading(true);
    setError('');

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!supabaseUrl || supabaseUrl.includes('your-project')) {
        // Mock add comment if Supabase is not configured
        if (!email.includes('@')) throw new Error('Email tidak valid');
        const newComment: Comment = {
          id: Date.now().toString(),
          post_id: postId,
          user_name: name,
          content: content,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setComments([newComment, ...comments]);
        setName('');
        setEmail('');
        setContent('');
        setLoading(false);
        return;
      }

      // Pengecekan Aman (Panggil Fungsi RPC di Database yang punya akses khusus)
      const { data: isSubscriber, error: subError } = await supabase.rpc('check_is_subscriber', { 
        check_email: email.trim() 
      });
        
      if (subError || !isSubscriber) {
        throw new Error('Hanya subscriber yang dapat berkomentar. Silakan berlangganan Newsletter terlebih dahulu!');
      }

      const { data, error: insertError } = await supabase
        .from('comments')
        .insert([{
          post_id: postId,
          user_name: name.trim(),
          content: content.trim()
        }])
        .select();

      if (insertError) throw insertError;

      if (data && data.length > 0) {
        setComments([data[0] as Comment, ...comments]);
        setName('');
        setEmail('');
        setContent('');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengirim komentar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-16 pt-10 border-t border-gray-100">
      <h3 className="text-2xl font-bold text-gray-900 mb-8">Komentar ({comments.length})</h3>

      {/* Form */}
      <form onSubmit={handleSubmit} className="mb-12 bg-gray-50 p-6 sm:p-8 rounded-2xl">
        <h4 className="text-lg font-semibold text-gray-800 mb-4">Tinggalkan Komentar</h4>
        
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

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

        <button
          type="submit"
          disabled={loading || !name.trim() || !content.trim()}
          className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Mengirim...' : 'Kirim Komentar'}
        </button>
      </form>

      {/* Comments List */}
      {fetching ? (
        <div className="text-center text-gray-500 py-8">Memuat komentar...</div>
      ) : comments.length === 0 ? (
        <div className="text-center text-gray-500 py-8">Belum ada komentar. Jadilah yang pertama!</div>
      ) : (
        <div className="space-y-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-gray-600 text-sm font-bold shrink-0">
                {comment.user_name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 bg-white border border-gray-100 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-semibold text-gray-800">{comment.user_name}</h5>
                  <span className="text-xs text-gray-400">{formatDate(comment.created_at)}</span>
                </div>
                <p className="text-gray-600 text-[15px] leading-relaxed whitespace-pre-wrap">
                  {comment.content}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
