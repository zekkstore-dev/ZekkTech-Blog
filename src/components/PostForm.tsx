'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { generateSlug, estimateReadingTime } from '@/lib/utils';
import type { Post } from '@/types/post';

interface PostFormProps {
  post?: Post;
  mode: 'create' | 'edit';
}

const CATEGORIES = [
  'Pilihan Editor',
  'CSS Dasar',
  'Javascript Tingkat Dasar',
  'React JS',
  'Tips & Trik',
  'Berita Teknologi',
  'FunFact',
  'Tutorial',
  'Template',
];

export default function PostForm({ post, mode }: PostFormProps) {
  const router = useRouter();
  const supabase = createClient();

  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [content, setContent] = useState(post?.content || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [category, setCategory] = useState(post?.category || CATEGORIES[0]);
  const [authorName, setAuthorName] = useState(post?.author_name || 'Kadek Surya');
  const [featured, setFeatured] = useState(post?.featured || false);
  const [published, setPublished] = useState(post?.published || false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState(post?.cover_url || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Auto-generate slug from title
  useEffect(() => {
    if (mode === 'create' && title) {
      setSlug(generateSlug(title));
    }
  }, [title, mode]);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validation
      if (!title.trim()) throw new Error('Judul wajib diisi');
      if (!slug.trim()) throw new Error('Slug wajib diisi');
      if (!content.trim()) throw new Error('Konten wajib diisi');

      let coverUrl = post?.cover_url || '';

      // Upload cover image if new file selected
      if (coverFile) {
        const fileExt = coverFile.name.split('.').pop();
        const fileName = `${slug}-${Date.now()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('covers')
          .upload(fileName, coverFile, { upsert: true });

        if (uploadError) throw new Error(`Upload gagal: ${uploadError.message}`);

        const { data: urlData } = supabase.storage
          .from('covers')
          .getPublicUrl(fileName);
        coverUrl = urlData.publicUrl;
      }

      const postData = {
        title: title.trim(),
        slug: slug.trim(),
        content: content.trim(),
        excerpt: excerpt.trim() || title.trim().slice(0, 150),
        cover_url: coverUrl,
        category,
        author_name: authorName.trim(),
        reading_time: estimateReadingTime(content),
        featured,
        published,
      };

      if (mode === 'create') {
        const { error: insertError } = await supabase
          .from('posts')
          .insert([postData]);
        if (insertError) throw new Error(insertError.message);
      } else {
        const { error: updateError } = await supabase
          .from('posts')
          .update(postData)
          .eq('id', post!.id);
        if (updateError) throw new Error(updateError.message);
      }

      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
          Judul Artikel <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Masukkan judul artikel..."
          className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
          required
        />
      </div>

      {/* Slug */}
      <div>
        <label htmlFor="slug" className="block text-sm font-semibold text-gray-700 mb-2">
          Slug (URL) <span className="text-red-500">*</span>
        </label>
        <input
          id="slug"
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="auto-generated-from-title"
          className="w-full h-12 px-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700 font-mono text-sm placeholder:text-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
          required
        />
      </div>

      {/* Category & Author Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="category" className="block text-sm font-semibold text-gray-700 mb-2">Kategori</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="author" className="block text-sm font-semibold text-gray-700 mb-2">Nama Penulis</label>
          <input
            id="author"
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>
      </div>

      {/* Excerpt */}
      <div>
        <label htmlFor="excerpt" className="block text-sm font-semibold text-gray-700 mb-2">Ringkasan</label>
        <textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Ringkasan singkat artikel..."
          rows={2}
          className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
        />
      </div>

      {/* Content */}
      <div>
        <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">
          Konten <span className="text-red-500">*</span>
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Tulis konten artikel di sini..."
          rows={16}
          className="w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-y font-mono text-sm leading-relaxed"
          required
        />
      </div>

      {/* Cover Image */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-2">Cover Image</label>
        <div className="flex items-start gap-4">
          {coverPreview && (
            <div className="w-40 h-28 rounded-xl overflow-hidden bg-gray-100 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
            </div>
          )}
          <label className="flex-1 flex flex-col items-center justify-center h-28 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 transition-colors cursor-pointer">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-400 mb-1">
              <path d="M12 16V8M12 8L9 11M12 8L15 11M3 16V17C3 18.657 4.343 20 6 20H18C19.657 20 21 18.657 21 17V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-sm text-gray-500">Pilih gambar</span>
            <input type="file" accept="image/*" onChange={handleCoverChange} className="hidden" />
          </label>
        </div>
      </div>

      {/* Toggles */}
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="w-5 h-5 text-blue-500 border-2 border-gray-300 rounded focus:ring-blue-400"
          />
          <span className="text-sm font-medium text-gray-700">Artikel Unggulan</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="w-5 h-5 text-blue-500 border-2 border-gray-300 rounded focus:ring-blue-400"
          />
          <span className="text-sm font-medium text-gray-700">Publikasikan</span>
        </label>
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Menyimpan...' : mode === 'create' ? 'Buat Artikel' : 'Simpan Perubahan'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-all"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
