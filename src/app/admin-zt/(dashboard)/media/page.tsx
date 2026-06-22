'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { convertToWebP } from '@/lib/image-converter';
import { FileText, Image as ImageIcon, User, Zap, UploadCloud, Clipboard, Link2, Trash2, FolderClosed, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';

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
type FilterTab = 'all' | 'content' | 'covers' | 'avatars' | 'converter';

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
  // STATE & REFS UNTUK WEBP CONVERTER TOOL
  // =================================================================
  const [converterFiles, setConverterFiles] = useState<{
    id: string;
    file: File;
    originalSize: number;
    convertedFile: File | null;
    convertedSize: number | null;
    status: 'pending' | 'converting' | 'done' | 'failed' | 'uploaded';
    r2Url?: string;
  }[]>([]);
  const [converterQuality, setConverterQuality] = useState<number>(80);
  const [isConverterDragging, setIsConverterDragging] = useState(false);
  const converterInputRef = useRef<HTMLInputElement>(null);

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
        converter: '',
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
    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!allowed.includes(file.type)) {
      setUploadMsg('❌ Hanya JPG, PNG, WEBP, dan SVG yang diperbolehkan.');
      setTimeout(() => setUploadMsg(''), 3000);
      return;
    }

    setUploading(true);
    setUploadMsg('⏳ Mengonversi ke WebP...');

    try {
      const optimizedFile = await convertToWebP(file);
      setUploadMsg('⏳ Mengupload...');
      const formData = new FormData();
      formData.append('file', optimizedFile);
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

  // =================================================================
  // WEBP CONVERTER TOOL HANDLERS
  // =================================================================
  const handleConverterFilesAdded = (addedFiles: File[]) => {
    const newItems = addedFiles.map(file => ({
      id: Math.random().toString(36).substring(2, 9),
      file,
      originalSize: file.size,
      convertedFile: null,
      convertedSize: null,
      status: 'pending' as const,
    }));
    setConverterFiles(prev => [...prev, ...newItems]);
  };

  const handleStartConvertAll = async () => {
    const pendingItems = converterFiles.filter(item => item.status === 'pending' || item.status === 'failed');
    for (const item of pendingItems) {
      setConverterFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'converting' } : f));
      try {
        const converted = await convertToWebP(item.file, converterQuality / 100);
        setConverterFiles(prev => prev.map(f => f.id === item.id ? {
          ...f,
          convertedFile: converted,
          convertedSize: converted.size,
          status: 'done'
        } : f));
      } catch (err) {
        console.error(err);
        setConverterFiles(prev => prev.map(f => f.id === item.id ? { ...f, status: 'failed' } : f));
      }
    }
  };

  const handleUploadConverterFile = async (id: string, file: File) => {
    try {
      setConverterFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'converting' } : f));
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'content');

      const res = await fetch('/api/upload', { method: 'POST', body: formData });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Upload gagal');
      }

      const data = await res.json();
      setConverterFiles(prev => prev.map(f => f.id === id ? {
        ...f,
        status: 'uploaded',
        r2Url: data.publicUrl
      } : f));
      
      // Refresh media library list in the background
      fetchFiles(activeFilter);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal upload ke R2');
      setConverterFiles(prev => prev.map(f => f.id === id ? { ...f, status: 'done' } : f));
    }
  };

  const handleClearConverter = () => {
    setConverterFiles([]);
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
    const markdown = `![${altText} oleh ZekkTech (Zakaria Mujur Prasetyo)](${file.url})`;

    navigator.clipboard.writeText(markdown).then(() => {
      setCopiedKey(file.key);
      setTimeout(() => setCopiedKey(null), 2000);
    });
  };

  /**
   * Salin tag HTML <img> — gunakan ini saat memasukkan gambar di dalam
   * elemen HTML seperti <li>, <div>, dll. di mana sintaks markdown ![]()
   * tidak diproses oleh parser.
   */
  const handleCopyHtml = (file: MediaFile) => {
    const filename = file.key.split('/').pop() ?? file.key;
    const altText = filename.replace(/^\d+-/, '').replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
    const html = `<img src="${file.url}" alt="${altText} oleh ZekkTech (Zakaria Mujur Prasetyo)" style="max-width:100%;border-radius:8px;margin:10px 0;" />`;

    navigator.clipboard.writeText(html).then(() => {
      setCopiedKey(file.key + '-html');
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
  const filterTabs: { id: FilterTab; label: string; icon?: any }[] = [
    { id: 'all', label: 'Semua' },
    { id: 'content', label: 'Konten Artikel', icon: FileText },
    { id: 'covers', label: 'Cover', icon: ImageIcon },
    { id: 'avatars', label: 'Avatar', icon: User },
    { id: 'converter', label: 'WebP Converter Tool', icon: Zap },
  ];

  // =================================================================
  // RENDER
  // =================================================================

  return (
    <div className="space-y-6">
      {/* Header halaman */}
      <div>
        <h1 className="text-2xl font-extrabold text-gray-900 inline-flex items-center gap-2">
          <FolderClosed className="w-7 h-7 text-blue-500" />
          <span>Media Library</span>
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Kelola semua gambar yang tersimpan di Cloudflare R2. Upload, salin URL/Markdown, atau hapus sesuai kebutuhan.
        </p>
      </div>

      {/* Area Upload Gambar Baru */}
      {activeFilter !== 'converter' && (
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
            accept=".jpg,.jpeg,.png,.webp,.svg,image/jpeg,image/png,image/webp,image/svg+xml"
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
                <p className="text-xs text-gray-400">JPG, PNG, WEBP, SVG • Maks 5MB • Otomatis masuk folder <code className="bg-gray-100 px-1 rounded">content/</code></p>
              </>
            )}
            {/* Pesan feedback upload */}
            {uploadMsg && (
              <span className={`mt-1 text-xs font-medium px-3 py-1.5 rounded-full inline-flex items-center gap-1.5 ${
                uploadMsg.startsWith('✅') ? 'bg-green-100 text-green-700' :
                uploadMsg.startsWith('❌') ? 'bg-red-100 text-red-700' :
                'bg-yellow-100 text-yellow-700'
              }`}>
                {uploadMsg.startsWith('✅') ? <CheckCircle className="w-3.5 h-3.5 text-green-600" /> :
                 uploadMsg.startsWith('❌') ? <AlertCircle className="w-3.5 h-3.5 text-red-600" /> :
                 <RefreshCw className="w-3.5 h-3.5 text-yellow-600 animate-spin" />}
                <span>{uploadMsg.replace(/^[✅❌⏳]\s*/, '')}</span>
              </span>
            )}
          </div>
        </div>
      )}

      <div className="flex gap-2 flex-wrap border-b border-gray-200 pb-3">
        {filterTabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-4 py-1.5 text-xs font-semibold rounded-full transition-all inline-flex items-center gap-1.5 ${
                activeFilter === tab.id
                  ? 'bg-blue-500 text-white shadow-sm shadow-blue-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600'
              }`}
            >
              {Icon && <Icon className="w-3.5 h-3.5" />}
              <span>{tab.label}</span>
            </button>
          );
        })}
        <span className="ml-auto text-xs text-gray-400 self-center">{files.length} file</span>
      </div>

      {activeFilter === 'converter' ? (
        <div className="bg-white dark:bg-[#1e1e36] border border-gray-200 dark:border-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span>WebP Converter Tool</span>
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                Konversi file PNG, JPG, JPEG, SVG lokal Anda ke format WebP teroptimasi secara offline di browser.
              </p>
            </div>
            
            <div className="flex items-center gap-3 bg-gray-50 dark:bg-slate-800/50 p-2.5 rounded-xl border border-gray-100 dark:border-slate-800">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Kualitas: {converterQuality}%</span>
              <input
                type="range"
                min="10"
                max="100"
                value={converterQuality}
                onChange={(e) => setConverterQuality(Number(e.target.value))}
                className="w-24 accent-blue-500 cursor-pointer h-1 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none"
              />
            </div>
          </div>

          {/* Area Drop untuk Converter */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsConverterDragging(true); }}
            onDragLeave={() => setIsConverterDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsConverterDragging(false);
              if (e.dataTransfer.files) {
                const filesArray = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'));
                handleConverterFilesAdded(filesArray);
              }
            }}
            onClick={() => converterInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer mb-6 ${
              isConverterDragging
                ? 'border-blue-400 bg-blue-50/50 dark:bg-blue-900/10'
                : 'border-gray-200 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/30 hover:border-blue-300 hover:bg-blue-50/20'
            }`}
          >
            <input
              ref={converterInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                if (e.target.files) {
                  handleConverterFilesAdded(Array.from(e.target.files));
                }
              }}
              className="hidden"
            />
            <div className="flex flex-col items-center gap-2 pointer-events-none">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" className="text-blue-500" stroke="currentColor" strokeWidth="1.5">
                <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242M12 12v9m0-9-3 3m3-3 3 3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                Pilih atau seret gambar (PNG, JPG, SVG, WEBP) ke sini
              </p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Mendukung multi-file sekaligus</p>
            </div>
          </div>

          {/* List file yang sedang diproses */}
          {converterFiles.length > 0 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-slate-800 pb-2">
                <span className="text-xs font-bold text-gray-500">{converterFiles.length} File dalam antrean</span>
                <div className="flex gap-2">
                  <button
                    onClick={handleStartConvertAll}
                    disabled={converterFiles.every(f => f.status === 'done' || f.status === 'uploaded')}
                    className="px-3 py-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Mulai Konversi Semua
                  </button>
                  <button
                    onClick={handleClearConverter}
                    className="px-3 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Bersihkan Antrean
                  </button>
                </div>
              </div>

              <div className="max-h-[350px] overflow-y-auto pr-1 space-y-2.5">
                {converterFiles.map((item) => {
                  const savings = item.convertedSize && item.originalSize
                    ? Math.round(((item.originalSize - item.convertedSize) / item.originalSize) * 100)
                    : 0;

                  return (
                    <div
                      key={item.id}
                      className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 bg-gray-50 dark:bg-slate-850 border border-gray-100 dark:border-slate-800 rounded-xl gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-900/30">
                          <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                            {item.file.name.split('.').pop()?.toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate" title={item.file.name}>
                            {item.file.name}
                          </p>
                          <p className="text-[10px] text-gray-400">
                            Ukuran Asli: {formatSize(item.originalSize)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto justify-between sm:justify-end">
                        {/* Status dan info konversi */}
                        <div className="text-right">
                          {item.status === 'pending' && (
                            <span className="text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-0.5 rounded-full font-semibold">Menunggu</span>
                          )}
                          {item.status === 'converting' && (
                            <span className="text-[10px] bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 px-2 py-0.5 rounded-full font-semibold animate-pulse">Mengonversi...</span>
                          )}
                          {item.status === 'failed' && (
                            <span className="text-[10px] bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full font-semibold">Gagal</span>
                          )}
                          {(item.status === 'done' || item.status === 'uploaded') && (
                            <div className="flex flex-col items-end">
                              <span className="text-[10px] text-gray-400">
                                WebP: {formatSize(item.convertedSize || 0)}
                              </span>
                              {savings > 0 ? (
                                <span className="text-[9px] font-bold text-green-500 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded-md mt-0.5">
                                  Hemat {savings}%
                                </span>
                              ) : (
                                <span className="text-[9px] font-bold text-gray-500 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-md mt-0.5">
                                  Sama/Lebih Besar
                                </span>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Tombol Aksi */}
                        <div className="flex gap-2">
                          {/* Unduh file hasil konversi */}
                          {item.convertedFile && (
                            <a
                              href={URL.createObjectURL(item.convertedFile)}
                              download={item.convertedFile.name}
                              className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:text-blue-400 dark:border-blue-900/50 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
                              title="Download hasil WebP ke komputer"
                            >
                              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                              Unduh
                            </a>
                          )}

                          {/* Upload langsung ke R2 */}
                          {item.convertedFile && item.status !== 'uploaded' && (
                            <button
                              onClick={() => handleUploadConverterFile(item.id, item.convertedFile!)}
                              className="px-2.5 py-1.5 bg-green-50 hover:bg-green-100 text-green-600 border border-green-200 dark:bg-green-900/20 dark:hover:bg-green-900/30 dark:text-green-400 dark:border-green-900/50 rounded-lg text-[10px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                              title="Upload hasil konversi langsung ke R2 Media"
                            >
                              <UploadCloud className="w-3.5 h-3.5" />
                              <span>Upload ke R2</span>
                            </button>
                          )}

                          {item.status === 'uploaded' && (
                            <span className="px-2.5 py-1.5 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 rounded-lg text-[10px] font-bold flex items-center gap-1.5">
                              <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                              <span>Uploaded</span>
                            </span>
                          )}

                          <button
                            onClick={() => setConverterFiles(prev => prev.filter(f => f.id !== item.id))}
                            className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                            title="Hapus dari antrean"
                          >
                            &times;
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
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
                  className="group relative bg-white dark:bg-[#1e1e36] border border-gray-100 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5"
                >
                  {/* Thumbnail gambar */}
                  <div className="aspect-video bg-gray-50 dark:bg-[#16162a] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={file.url}
                      alt={getDisplayName(file.key)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
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
                    <p className="text-[10px] font-medium text-gray-700 dark:text-gray-300 truncate" title={getDisplayName(file.key)}>
                      {getDisplayName(file.key)}
                    </p>
                    <p className="text-[9px] text-gray-400 dark:text-gray-500 mb-2">{formatSize(file.size)}</p>

                    {/* Tombol: Copy Markdown */}
                    <button
                      onClick={() => handleCopyMarkdown(file)}
                      className={`w-full text-[10px] font-bold py-1.5 rounded-lg transition-all mb-1 cursor-pointer inline-flex items-center justify-center gap-1.5 ${
                        copiedKey === file.key
                          ? 'bg-green-500 text-white'
                          : 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400 hover:bg-blue-100 border border-blue-100 dark:border-blue-900/40'
                      }`}
                    >
                      {copiedKey === file.key ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Clipboard className="w-3.5 h-3.5" />
                          <span>Copy Markdown</span>
                        </>
                      )}
                    </button>

                    {/* Tombol: Copy HTML <img> */}
                    <button
                      onClick={() => handleCopyHtml(file)}
                      className={`w-full text-[10px] font-bold py-1.5 rounded-lg transition-all mb-1 cursor-pointer inline-flex items-center justify-center gap-1.5 ${
                        copiedKey === file.key + '-html'
                          ? 'bg-green-500 text-white'
                          : 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 hover:bg-purple-100 border border-purple-100 dark:border-purple-900/40'
                      }`}
                      title="Pakai ini jika gambar ada di dalam tag HTML seperti <li>"
                    >
                      {copiedKey === file.key + '-html' ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-3.5 h-3.5" />
                          <span>Copy HTML &lt;img&gt;</span>
                        </>
                      )}
                    </button>

                    {/* Tombol: Copy URL saja */}
                    <button
                      onClick={() => handleCopyUrl(file)}
                      className={`w-full text-[10px] font-bold py-1.5 rounded-lg transition-all mb-1 cursor-pointer inline-flex items-center justify-center gap-1.5 ${
                        copiedKey === file.key + '-url'
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-50 text-gray-600 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-100 border border-gray-100 dark:border-gray-700'
                      }`}
                    >
                      {copiedKey === file.key + '-url' ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Tersalin!</span>
                        </>
                      ) : (
                        <>
                          <Link2 className="w-3.5 h-3.5" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>

                    {/* Tombol: Hapus */}
                    {deleteConfirm === file.key ? (
                      <div className="flex gap-1 mt-1">
                        <button
                          onClick={() => handleDelete(file.key)}
                          disabled={deletingKey === file.key}
                          className="flex-1 text-[10px] font-bold py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all disabled:opacity-50 cursor-pointer"
                        >
                          {deletingKey === file.key ? '...' : 'Ya, Hapus'}
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(null)}
                          className="flex-1 text-[10px] font-bold py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-750 transition-all cursor-pointer"
                        >
                          Batal
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeleteConfirm(file.key)}
                        className="w-full text-[10px] font-bold py-1.5 bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400 rounded-lg hover:bg-red-100 border border-red-100 dark:border-red-900/40 transition-all cursor-pointer inline-flex items-center justify-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Hapus</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
