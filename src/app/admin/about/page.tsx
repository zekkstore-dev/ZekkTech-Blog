'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function AdminAboutPage() {
  const supabase = createClient();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; msg: string } | null>(null);

  // muat konten pertama kali dari database
  useEffect(() => {
    async function loadContent() {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('value')
          .eq('key', 'about_content')
          .single();

        // kalo gagal atau ga ada data, biarin aja kosong
        if (!error && data?.value) {
          setContent(data.value);
        }
      } catch {
        // koneksi gagal, ya sudah
        console.error('[Admin About] gagal load konten');
      } finally {
        setLoading(false);
      }
    }
    loadContent();
  }, [supabase]);

  // simpan perubahan ke database
  const handleSave = async () => {
    setSaving(true);
    setFeedback(null);

    try {
      // coba update dulu, kalo belum ada row ya insert
      const { error: updateError } = await supabase
        .from('site_settings')
        .update({ value: content })
        .eq('key', 'about_content');

      if (updateError) {
        throw updateError;
      }

      setFeedback({ type: 'success', msg: 'Konten berhasil disimpan! 🎉' });

      // auto-hilangkan notifikasi setelah 3 detik
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Gagal menyimpan konten';
      setFeedback({ type: 'error', msg: message });
    } finally {
      setSaving(false);
    }
  };

  // tampilin skeleton kalo lagi loading
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded-lg w-48 animate-pulse" />
        <div className="h-[400px] bg-gray-200 rounded-xl animate-pulse" />
      </div>
    );
  }

  return (
    <div>
      {/* header halaman */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Halaman Tentang Saya</h1>
          <p className="text-sm text-gray-500 mt-1">
            Edit konten halaman &quot;Tentang Saya&quot;. Mendukung format Markdown.
          </p>
        </div>

        {/* tombol simpan */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Menyimpan...
            </>
          ) : (
            <>
              {/* ikon save */}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              Simpan
            </>
          )}
        </button>
      </div>

      {/* notifikasi feedback */}
      {feedback && (
        <div className={`mb-6 p-4 rounded-xl border text-sm font-medium flex items-center gap-3 ${
          feedback.type === 'success'
            ? 'bg-green-50 border-green-200 text-green-700'
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          <span className="text-lg">{feedback.type === 'success' ? '✅' : '🚨'}</span>
          {feedback.msg}
        </div>
      )}

      {/* editor textarea */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        {/* toolbar kecil buat panduan markdown */}
        <div className="px-5 py-3 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500">
            📝 Editor Konten (Markdown)
          </span>
          <a
            href="https://www.markdownguide.org/cheat-sheet/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-500 hover:underline"
          >
            Panduan Markdown ↗
          </a>
        </div>

        {/* area ketik */}
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Tulis konten halaman Tentang Saya di sini... (Markdown didukung)"
          className="w-full min-h-[500px] p-6 text-[15px] text-gray-800 font-mono leading-relaxed resize-y focus:outline-none placeholder:text-gray-400"
          spellCheck={false}
        />
      </div>

      {/* preview singkat di bawah */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Preview Cepat</h3>
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm prose prose-sm prose-gray max-w-none">
          {content ? (
            <div dangerouslySetInnerHTML={{
              __html: content
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                .replace(/\n/g, '<br />')
            }} />
          ) : (
            <p className="text-gray-400 italic">Belum ada konten...</p>
          )}
        </div>
      </div>
    </div>
  );
}
