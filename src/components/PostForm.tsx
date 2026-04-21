'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { generateSlug, estimateReadingTime } from '@/lib/utils';
import type { Post } from '@/types/post';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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

  const initialCats = Array.from(new Set([...CATEGORIES, ...(post?.category ? post.category.split(', ') : [])]));
  const [availableCategories, setAvailableCategories] = useState<string[]>(initialCats);
  const [newCatInput, setNewCatInput] = useState('');

  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    post?.category ? post.category.split(', ') : [CATEGORIES[0]]
  );
  const [authorName, setAuthorName] = useState(post?.author_name || 'Kadek Surya');
  const [featured, setFeatured] = useState(post?.featured || false);
  const [published, setPublished] = useState(post?.published || false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState(post?.cover_url || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // === State khusus fitur insert gambar ke konten ===
  // Apakah sedang ada proses upload gambar konten yang berjalan
  const [imageUploading, setImageUploading] = useState(false);
  // Pesan feedback saat upload gambar konten berhasil/gagal
  const [imageMsg, setImageMsg] = useState('');
  // Apakah area textarea sedang dalam kondisi di-drag gambar ke atasnya
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  // Ref untuk textarea konten agar kita bisa tahu posisi kursor saat ini
  const contentRef = useRef<HTMLTextAreaElement>(null);
  // Ref untuk input file tersembunyi yang dipicu dari tombol toolbar
  const contentImageInputRef = useRef<HTMLInputElement>(null);

  // otomatis bikin slug dari judul biar ga perlu ketik manual
  useEffect(() => {
    if (mode === 'create' && title) {
      setSlug(generateSlug(title));
    }
  }, [title, mode]);

  const handleAddCategory = () => {
    const cat = newCatInput.trim();
    if (cat && !availableCategories.includes(cat)) {
      setAvailableCategories(prev => [...prev, cat]);
      setSelectedCategories(prev => [...prev, cat]);
    }
    setNewCatInput('');
  };

  const handleRemoveCategory = (catToRemove: string) => {
    setAvailableCategories(prev => prev.filter(c => c !== catToRemove));
    setSelectedCategories(prev => prev.filter(c => c !== catToRemove));
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverFile(file);
      setCoverPreview(URL.createObjectURL(file));
    }
  };

  /**
   * Fungsi inti: Upload file gambar ke R2 via /api/upload,
   * lalu sisipkan teks markdown `![nama-file](url)` di posisi kursor textarea
   */
  const uploadContentImage = useCallback(async (file: File) => {
    // Validasi tipe file: hanya JPG, PNG, WEBP
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setImageMsg('❌ Hanya JPG, PNG, dan WEBP yang diperbolehkan.');
      setTimeout(() => setImageMsg(''), 3000);
      return;
    }

    setImageUploading(true);
    setImageMsg('⏳ Mengupload gambar...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      // Kirim parameter folder agar API upload tahu ini gambar "content", bukan "cover"
      formData.append('folder', 'content');

      const res = await fetch('/api/upload', { method: 'POST', body: formData });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Upload gagal');
      }

      const { publicUrl } = await res.json();

      // Buat teks markdown yang akan disisipkan ke editor
      const altText = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
      const markdownSnippet = `\n![${altText}](${publicUrl})\n`;

      // Ambil posisi kursor saat ini dari textarea
      const textarea = contentRef.current;
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        // Sisipkan teks markdown tepat di posisi kursor
        const newContent =
          content.substring(0, start) +
          markdownSnippet +
          content.substring(end);

        setContent(newContent);

        // Pindahkan kursor ke akhir teks yang baru disisipkan
        setTimeout(() => {
          textarea.selectionStart = start + markdownSnippet.length;
          textarea.selectionEnd = start + markdownSnippet.length;
          textarea.focus();
        }, 0);
      } else {
        // Fallback: kalau tidak bisa baca posisi kursor, tambahkan di akhir konten
        setContent(prev => prev + markdownSnippet);
      }

      setImageMsg('✅ Gambar berhasil disisipkan!');
      setTimeout(() => setImageMsg(''), 3000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload gagal';
      setImageMsg(`❌ ${msg}`);
      setTimeout(() => setImageMsg(''), 4000);
    } finally {
      setImageUploading(false);
    }
  }, [content]);

  /**
   * Handler saat pengguna memilih gambar melalui tombol toolbar "🖼️ Sisipkan Gambar"
   */
  const handleContentImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadContentImage(file);
      // Reset input agar file yang sama bisa dipilih lagi
      e.target.value = '';
    }
  };

  /**
   * Handler Drag & Drop: saat pengguna menyeret gambar ke atas area textarea
   */
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // wajib dipanggil agar drop bisa terjadi
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);

    // Ambil file pertama yang di-drop, pastikan itu file gambar
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      uploadContentImage(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // validasi input dulu
      if (!title.trim()) throw new Error('Judul wajib diisi');
      if (!slug.trim()) throw new Error('Slug wajib diisi');
      if (!content.trim()) throw new Error('Konten wajib diisi');
      if (selectedCategories.length === 0) throw new Error('Minimal pilih 1 Kategori');

      let coverUrl = post?.cover_url || '';

      // upload gambar cover ke server kita, nanti di-forward ke R2
      if (coverFile) {
        const formData = new FormData();
        formData.append('file', coverFile);

        const uploadRes = await fetch('/api/upload', {
          method: 'POST',
          body: formData, // ga perlu set Content-Type, browser otomatis handle multipart
        });

        if (!uploadRes.ok) {
          const errData = await uploadRes.json();
          throw new Error(`Upload gagal: ${errData.error}`);
        }

        const { publicUrl } = await uploadRes.json();
        coverUrl = publicUrl;
      }

      const postData = {
        title: title.trim(),
        slug: slug.trim(),
        content: content.trim(),
        excerpt: excerpt.trim() || title.trim().slice(0, 150),
        cover_url: coverUrl,
        category: selectedCategories.join(', '),
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

      router.push('/admin-zt');
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
        <label htmlFor="title" className="admin-label block text-sm font-semibold text-gray-700 mb-2">
          Judul Artikel <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Masukkan judul artikel..."
          className="admin-input w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
          required
        />
      </div>

      {/* Slug */}
      <div>
        <label htmlFor="slug" className="admin-label block text-sm font-semibold text-gray-700 mb-2">
          Slug (URL) <span className="text-red-500">*</span>
        </label>
        <input
          id="slug"
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="auto-generated-from-title"
          className="admin-input w-full h-12 px-4 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-700 font-mono text-sm placeholder:text-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
          required
        />
      </div>

      {/* Category & Author Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="admin-label block text-sm font-semibold text-gray-700 mb-2">Kategori (Bisa Pilih Banyak)</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {availableCategories.map((cat) => (
              <div key={cat} className="group relative inline-flex">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategories(prev =>
                      prev.includes(cat)
                        ? prev.filter(c => c !== cat)
                        : [...prev, cat]
                    );
                  }}
                  className={`px-3 py-1.5 pr-8 text-xs font-semibold rounded-full border transition-all ${
                    selectedCategories.includes(cat)
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'admin-category-btn bg-white text-gray-600 border-gray-200 hover:border-blue-400 hover:text-blue-500'
                  }`}
                >
                  {cat}
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleRemoveCategory(cat); }}
                  className={`absolute right-1 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full opacity-60 hover:opacity-100 transition-opacity ${
                    selectedCategories.includes(cat) ? 'text-white hover:bg-white/20' : 'text-red-500 hover:bg-red-50'
                  }`}
                  title="Hapus kategori ini"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={newCatInput}
              onChange={(e) => setNewCatInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddCategory(); } }}
              placeholder="Tambah kategori baru..."
              className="admin-input flex-1 h-9 px-3 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400 transition-all"
            />
            <button
              type="button"
              onClick={handleAddCategory}
              className="px-3 h-9 bg-gray-100 hover:bg-gray-200 admin-cancel-btn text-sm font-medium rounded-lg transition-colors border border-transparent"
            >
              Tambah
            </button>
          </div>
        </div>
        <div>
          <label htmlFor="author" className="admin-label block text-sm font-semibold text-gray-700 mb-2">Nama Penulis</label>
          <input
            id="author"
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="admin-input w-full h-12 px-4 bg-white border-2 border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
          />
        </div>
      </div>

      {/* Excerpt */}
      <div>
        <label htmlFor="excerpt" className="admin-label block text-sm font-semibold text-gray-700 mb-2">Ringkasan</label>
        <textarea
          id="excerpt"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Ringkasan singkat artikel..."
          rows={2}
          className="admin-textarea w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
        />
      </div>

      {/* ===== KONTEN ARTIKEL ===== */}
      <div className="space-y-4">
        <div>
          <div className="flex justify-between items-end mb-2">
            <label htmlFor="content" className="admin-label block text-sm font-semibold text-gray-700">
              Konten <span className="text-red-500">*</span>
            </label>
            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"/><path d="M4 6v12c0 1.1.9 2 2 2h14v-4"/></svg>
              Markdown Supported <span className="hidden sm:inline">(Anti-XSS)</span>
            </span>
          </div>

          {/* Toolbar di atas textarea: tombol sisipkan gambar */}
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {/* Input file tersembunyi, dipicu oleh tombol di bawahnya */}
            <input
              ref={contentImageInputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              onChange={handleContentImageChange}
              className="hidden"
              aria-label="Pilih gambar untuk disisipkan ke konten"
            />
            {/* Tombol utama toolbar: klik akan membuka file picker */}
            <button
              type="button"
              onClick={() => contentImageInputRef.current?.click()}
              disabled={imageUploading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-gray-200 rounded-lg hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              title="Upload gambar dan sisipkan ke posisi kursor"
            >
              {imageUploading ? (
                // Spinner saat upload berjalan
                <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
              ) : (
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                </svg>
              )}
              {imageUploading ? 'Mengupload...' : '🖼️ Sisipkan Gambar'}
            </button>

            {/* Link ke Media Library agar pengguna bisa copy URL gambar lama */}
            <a
              href="/admin-zt/media"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-gray-200 rounded-lg hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50 transition-all"
              title="Buka Media Library untuk mengambil URL gambar lama"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
              </svg>
              Media Library
            </a>

            {/* Pesan feedback upload (berhasil / gagal) */}
            {imageMsg && (
              <span className={`text-xs font-medium px-2 py-1 rounded-md ${
                imageMsg.startsWith('✅') ? 'bg-green-50 text-green-700' :
                imageMsg.startsWith('❌') ? 'bg-red-50 text-red-700' :
                'bg-yellow-50 text-yellow-700'
              }`}>
                {imageMsg}
              </span>
            )}
          </div>

          {/* Wrapper area drag & drop — membungkus textarea */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative rounded-xl transition-all ${
              isDraggingOver
                ? 'ring-2 ring-blue-400 ring-offset-1'
                : ''
            }`}
          >
            {/* Overlay hint saat gambar di-drag ke area ini */}
            {isDraggingOver && (
              <div className="absolute inset-0 flex items-center justify-center bg-blue-50/90 rounded-xl z-10 pointer-events-none border-2 border-dashed border-blue-400">
                <div className="text-center">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-blue-500 mx-auto mb-2" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                  </svg>
                  <p className="text-sm font-bold text-blue-600">Lepaskan untuk upload gambar</p>
                  <p className="text-xs text-blue-500 mt-1">JPG, PNG, WEBP</p>
                </div>
              </div>
            )}
            <textarea
              id="content"
              ref={contentRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tulis konten artikel bebas styling dengan aturan Markdown (contoh: # Judul Besar, **Tebal**, dll)...&#10;&#10;💡 Tips: Seret & lepas gambar ke sini untuk langsung upload!"
              rows={12}
              className="admin-textarea w-full px-4 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-y font-mono text-sm leading-relaxed"
              required
            />
          </div>
          <p className="mt-2 text-xs text-gray-500 font-medium flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            Konten aman dari XSS. Seret gambar ke area editor untuk upload cepat.
          </p>
        </div>

        {/* Live Preview konten markdown */}
        <div>
          <h3 className="admin-preview-title text-sm font-semibold text-gray-700 mb-2">Live Preview (Konten)</h3>
          <div className="admin-preview bg-white rounded-xl border border-gray-200 p-6 min-h-[200px] shadow-sm transition-colors duration-300">
            {content ? (
              <div className="prose prose-sm max-w-none prose-headings:font-bold prose-a:text-blue-600 prose-strong:text-gray-900 prose-blockquote:border-blue-400 admin-preview-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {content}
                </ReactMarkdown>
              </div>
            ) : (
              <p className="text-gray-400 italic text-sm">Preview konten otomatis muncul di sini...</p>
            )}
          </div>
        </div>
      </div>

      {/* Cover Image */}
      <div>
        <label className="admin-label block text-sm font-semibold text-gray-700 mb-2">Cover Image (Wajib Rasio 16:9)</label>
        <div className="flex items-start gap-4">
          {coverPreview && (
            <div className="w-40 aspect-video rounded-xl overflow-hidden bg-gray-100 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
            </div>
          )}
          <label className="admin-upload-zone flex-1 flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 transition-colors cursor-pointer bg-gray-50 hover:bg-blue-50/50">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-gray-400 mb-2">
              <path d="M12 16V8M12 8L9 11M12 8L15 11M3 16V17C3 18.657 4.343 20 6 20H18C19.657 20 21 18.657 21 17V16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="text-sm font-semibold text-gray-700 mb-1">Klik untuk memilih gambar lokal</span>
            <span className="text-xs text-gray-500 text-center px-4">Tipe: <span className="font-mono text-blue-500">.JPG, .PNG, .WEBP</span> (Maksimal yang disarankan 150KB)</span>
            <input type="file" accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp" onChange={handleCoverChange} className="hidden" />
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
          <span className="admin-label text-sm font-medium text-gray-700">Artikel Unggulan</span>
        </label>
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="w-5 h-5 text-blue-500 border-2 border-gray-300 rounded focus:ring-blue-400"
          />
          <span className="admin-label text-sm font-medium text-gray-700">Publikasikan</span>
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
          className="admin-cancel-btn px-8 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-semibold transition-all"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
