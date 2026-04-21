'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Tipe data untuk setiap item file dari R2
 */
interface MediaFile {
  key: string;        // nama path file di R2, contoh: "content/1713256400000-foto.png"
  url: string;        // URL publik yang bisa langsung diakses
  size: number;       // ukuran dalam byte
  lastModified: Date; // tanggal upload
}

// Filter tab yang tersedia untuk menyaring tampilan galeri
type FilterTab = 'all' | 'content' | 'covers' | 'avatars';

export default function MediaLibraryPage() {
  // =================================================================
  // STATE MANAGEMENT
  // =================================================================

  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State untuk filter tab aktif (all / content / covers / avatars)
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

  // State untuk upload gambar baru dari halaman Media Library
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState('');

  // State untuk konfirmasi hapus: menyimpan key file yang akan dihapus
  const [deletingKey, setDeletingKey] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // State pesan setelah salin URL atau markdown ke clipboard
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // State drag-and-drop untuk area upload
  const [isDragging, setIsDragging] = useState(false);

  // Ref untuk input file tersembunyi di area upload
  const uploadInputRef = useRef<HTMLInputElement>(null);

  // =================================================================
  // DATA FETCHING
  // =================================================================

  /**
   * Ambil daftar semua file dari R2 via API
   * Bisa difilter berdasarkan prefix folder
   */
  const fetchFiles = useCallback(async (filter: FilterTab = 'all') => {
    setLoading(true);
    setError('');
    try {
      // Tentukan prefix berdasarkan tab yang aktif
      const prefixMap: Record<FilterTab, string> = {
        all: '',
        content: 'content/',
        covers: 'covers/',
        avatars: 'avatars/',
      };
      const prefix = prefixMap[filter];
      const url = prefix ? `/api/media?prefix=${encodeURIComponent(prefix)}` : '/api/media';

      const res = await fetch(url);
      if (!res.ok) throw new Error('Gagal mengambil daftar media');

      const data = await res.json();
      setFiles(data.files ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  }, []);

  // Jalankan fetch pertama kali halaman dibuka
  useEffect(() => {
    fetchFiles(activeFilter);
  }, [activeFilter, fetchFiles]);

  // =================================================================
  // UPLOAD GAMBAR BARU
  // =================================================================

  /**
   * Proses upload file gambar baru ke R2
   * Semua gambar yang diupload dari Media Library masuk ke folder "content/"
   */
  const handleUpload = async (file: File) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      setUploadMsg('❌ Hanya JPG, PNG, dan WEBP yang diperbolehkan.');
      setTimeout(() => setUploadMsg(''), 3000);
      return;
    }

    setUploading(true);
    setUploadMsg('⏳ Mengupload...');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'content');

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Upload gagal');
      }

      setUploadMsg('✅ Upload berhasil! Memuat ulang galeri...');
      // Refresh daftar gambar setelah upload berhasil
      await fetchFiles(activeFilter);
      setTimeout(() => setUploadMsg(''), 3000);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload gagal';
      setUploadMsg(`❌ ${msg}`);
      setTimeout(() => setUploadMsg(''), 4000);
    } finally {
      setUploading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleUpload(file);
      e.target.value = ''; // reset agar file sama bisa dipilih lagi
    }
  };

  // Handler drag-and-drop di area upload
  const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = () => setIsDragging(false);
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  // =================================================================
  // HAPUS FILE
  // =================================================================

  /**
   * Konfirmasi dan eksekusi penghapusan file dari R2
   */
  const handleDelete = async (key: string) => {
    setDeletingKey(key);
    try {
      const res = await fetch('/api/media', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Gagal menghapus');
      }

      // Hapus dari state lokal agar langsung hilang dari tampilan
      setFiles(prev => prev.filter(f => f.key !== key));
      setDeleteConfirm(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal menghapus file');
    } finally {
      setDeletingKey(null);
    }
  };

  // =================================================================
  // COPY KE CLIPBOARD
  // =================================================================

  /**
   * Salin teks markdown `![filename](url)` atau URL saja ke clipboard
   */
  const handleCopyMarkdown = (file: MediaFile) => {
    // Buat nama alt-text dari nama file (hapus ekstensi dan timestamp awal)
    const filename = file.key.split('/').pop() ?? file.key;
    const altText = filename.replace(/^\d+-/, '').replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
    const markdown = `![${altText}](${file.url})`;

    navigator.clipboard.writeText(markdown).then(() => {
      setCopiedKey(file.key);
      setTimeout(() => setCopiedKey(null), 2000);
    });
  };

  const handleCopyUrl = (file: MediaFile) => {
    navigator.clipboard.writeText(file.url).then(() => {
      setCopiedKey(file.key + '-url');
      setTimeout(() => setCopiedKey(null), 2000);
    });
  };

  // =================================================================
  // HELPER
  // =================================================================

  /** Format ukuran file dari byte ke KB/MB */
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  /** Ambil nama file dari key, buang prefix timestamp */
  const getDisplayName = (key: string) => {
    return (key.split('/').pop() ?? key).replace(/^\d+-/, '');
  };

  // Daftar tab filter
  const filterTabs: { id: FilterTab; label: string }[] = [
    { id: 'all', label: 'Semua' },
    { id: 'content', label: '📝 Konten Artikel' },
    { id: 'covers', label: '🖼️ Cover' },
    { id: 'avatars', label: '👤 Avatar' },
  ];

  // =================================================================
  // RENDER
  // =================================================================

  return (
    <div className="space-y-6">
      {/* Header halaman */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900">📂 Media Library</h1>
        <p className="text-sm text-gray-500 mt-1">
          Kelola semua gambar yang tersimpan di Cloudflare R2. Upload, salin URL/Markdown, atau hapus sesuai kebutuhan.
        </p>
      </div>

      {/* Area Upload Gambar Baru */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
          isDragging
            ? 'border-blue-400 bg-blue-50 scale-[1.005]'
            : 'border-gray-200 bg-gray-50 hover:border-blue-300 hover:bg-blue-50/30'
        }`}
        onClick={() => uploadInputRef.current?.click()}
      >
        <input
          ref={uploadInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          onChange={handleFileInputChange}
          className="hidden"
        />
        <div className="flex flex-col items-center gap-2 pointer-events-none">
          {uploading ? (
            <>
              <svg className="animate-spin text-blue-500" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
              </svg>
              <p className="text-sm font-semibold text-blue-600">Mengupload gambar...</p>
            </>
          ) : (
            <>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-gray-400" stroke="currentColor" strokeWidth="1.5">
                <path d="M12 16V8M12 8L9 11M12 8L15 11M3 16V17C3 18.657 4.343 20 6 20H18C19.657 20 21 18.657 21 17V16" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="text-sm font-semibold text-gray-700">
                Klik atau seret gambar ke sini untuk upload
              </p>
              <p className="text-xs text-gray-400">JPG, PNG, WEBP • Maks 5MB • Otomatis masuk folder <code className="bg-gray-100 px-1 rounded">content/</code></p>
            </>
          )}
          {/* Pesan feedback upload */}
          {uploadMsg && (
            <span className={`mt-1 text-xs font-medium px-3 py-1 rounded-full ${
              uploadMsg.startsWith('✅') ? 'bg-green-100 text-green-700' :
              uploadMsg.startsWith('❌') ? 'bg-red-100 text-red-700' :
              'bg-yellow-100 text-yellow-700'
            }`}>
              {uploadMsg}
            </span>
          )}
        </div>
      </div>

      {/* Tab Filter Folder */}
      <div className="flex gap-2 flex-wrap border-b border-gray-200 pb-3">
        {filterTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all ${
              activeFilter === tab.id
                ? 'bg-blue-500 text-white shadow-sm shadow-blue-200'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
        <span className="ml-auto text-xs text-gray-400 self-center">{files.length} file</span>
      </div>

      {/* Tampilan error */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="rounded-xl bg-gray-100 animate-pulse aspect-video" />
          ))}
        </div>
      )}

      {/* Grid Galeri Gambar */}
      {!loading && files.length === 0 && (
        <div className="py-20 text-center text-gray-400">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" className="mx-auto mb-3 opacity-40" stroke="currentColor" strokeWidth="1">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
          </svg>
          <p className="font-semibold">Belum ada gambar di folder ini.</p>
          <p className="text-sm mt-1">Upload gambar baru menggunakan area di atas.</p>
        </div>
      )}

      {!loading && files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {files.map((file) => (
            <div
              key={file.key}
              className="group relative bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
            >
              {/* Thumbnail gambar */}
              <div className="aspect-video bg-gray-50 overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={file.url}
                  alt={getDisplayName(file.key)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  onError={(e) => {
                    // Ganti dengan placeholder jika gambar tidak bisa dimuat
                    (e.target as HTMLImageElement).src = '/images/LogoZekkTech.png';
                  }}
                />
                {/* Overlay badge folder */}
                <div className="absolute top-1.5 left-1.5">
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-black/50 text-white backdrop-blur-sm">
                    {file.key.split('/')[0]}
                  </span>
                </div>
              </div>

              {/* Info dan tombol aksi */}
              <div className="p-2">
                <p className="text-[10px] font-medium text-gray-700 truncate" title={getDisplayName(file.key)}>
                  {getDisplayName(file.key)}
                </p>
                <p className="text-[9px] text-gray-400 mb-2">{formatSize(file.size)}</p>

                {/* Tombol: Copy Markdown */}
                <button
                  onClick={() => handleCopyMarkdown(file)}
                  className={`w-full text-[10px] font-bold py-1.5 rounded-lg transition-all mb-1 ${
                    copiedKey === file.key
                      ? 'bg-green-500 text-white'
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100'
                  }`}
                >
                  {copiedKey === file.key ? '✅ Tersalin!' : '📋 Copy Markdown'}
                </button>

                {/* Tombol: Copy URL saja */}
                <button
                  onClick={() => handleCopyUrl(file)}
                  className={`w-full text-[10px] font-bold py-1.5 rounded-lg transition-all mb-1 ${
                    copiedKey === file.key + '-url'
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100 border border-gray-100'
                  }`}
                >
                  {copiedKey === file.key + '-url' ? '✅ Tersalin!' : '🔗 Copy URL'}
                </button>

                {/* Tombol: Hapus */}
                {deleteConfirm === file.key ? (
                  // Tampilkan konfirmasi hapus sebelum benar-benar menghapus
                  <div className="flex gap-1 mt-1">
                    <button
                      onClick={() => handleDelete(file.key)}
                      disabled={deletingKey === file.key}
                      className="flex-1 text-[10px] font-bold py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all disabled:opacity-50"
                    >
                      {deletingKey === file.key ? '...' : 'Ya, Hapus'}
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="flex-1 text-[10px] font-bold py-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all"
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(file.key)}
                    className="w-full text-[10px] font-bold py-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 border border-red-100 transition-all"
                  >
                    🗑️ Hapus
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
