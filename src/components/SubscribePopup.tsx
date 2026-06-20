'use client';

import { useState, useEffect, useRef } from 'react';
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';
import { usePathname } from 'next/navigation';

export default function SubscribePopup() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');
  const [showCaptcha, setShowCaptcha] = useState(false);
  const turnstileRef = useRef<TurnstileInstance>(null);

  useEffect(() => {
    // Jalankan hanya di client-side
    const hasSubscribed = localStorage.getItem('zekktech_subscribed') === 'true';
    if (hasSubscribed) return;

    const isClosedThisSession = sessionStorage.getItem('zekktech_popup_closed') === 'true';
    const isPostPage = pathname?.startsWith('/post/');

    // Jika di halaman post/artikel, abaikan session storage close flag dan tampilkan popup.
    // Jika di halaman non-artikel, patuhi session storage close flag.
    if (!isPostPage && isClosedThisSession) return;

    // Reset status open agar delay trigger ulang bekerja saat ganti artikel
    setIsOpen(false);

    // Tampilkan popup dengan sedikit delay (3 detik) agar tidak mengagetkan user
    const timer = setTimeout(() => {
      setIsOpen(true);
      setShowCaptcha(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [pathname]);

  const handleClose = () => {
    setIsOpen(false);
    // Simpan di sessionStorage agar tidak muncul lagi di setiap perpindahan halaman/artikel pada sesi ini
    sessionStorage.setItem('zekktech_popup_closed', 'true');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;

    if (!token) {
      setStatus('error');
      setMessage('Tunggu verifikasi keamanan selesai...');
      return;
    }

    setLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), token }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Gagal berlangganan.');

      setStatus('success');
      // Set status berlangganan permanen di localStorage
      localStorage.setItem('zekktech_subscribed', 'true');
      
      // Close modal auto after 2 seconds on success
      setTimeout(() => {
        setIsOpen(false);
      }, 2500);
      
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Terjadi kesalahan.');
      turnstileRef.current?.reset();
      setToken('');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop overlay blur */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300"
        onClick={handleClose}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-[500px] bg-white dark:bg-[#1a1d24] rounded-2xl p-8 shadow-xl border border-gray-100 dark:border-slate-800 transform transition-all duration-300 scale-100 animate-fade-in-up">
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Tutup"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Content */}
        <div className="text-center">
          {/* Mail Icon */}
          <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800/50 flex items-center justify-center mx-auto mb-6 rounded-xl">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>

          <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-3">
            Subscribe Kolom Diskusi!
          </h3>
          <p className="text-[14px] text-gray-500 dark:text-gray-400 mb-6 leading-relaxed">
            Daftarkan email kamu sekarang untuk bisa diskusi! <strong className="text-slate-700 dark:text-gray-200 font-bold">bisa berkomentar & berinteraksi</strong> di setiap artikel.
          </p>

          {status === 'success' ? (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-300 text-sm font-medium rounded-xl">
              <p className="font-bold mb-1">🎉 Pendaftaran Berhasil!</p>
              <p>Terima kasih sudah Subs Email! Sekarang kamu bisa menulis komentar di blog ini.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan alamat email kamu..."
                  required
                  disabled={loading}
                  className="w-full h-12 px-5 bg-gray-50 dark:bg-slate-800/50 border-2 border-gray-200 dark:border-slate-800 rounded-xl text-[14px] text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/35 transition-all disabled:opacity-50"
                />
              </div>

              {/* Turnstile Captcha */}
              {showCaptcha && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
                <div className="flex justify-center">
                  <Turnstile
                    ref={turnstileRef}
                    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
                    onSuccess={(t) => setToken(t)}
                  />
                </div>
              )}

              {status === 'error' && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs rounded-xl text-left">
                  ⚠️ {message}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !email.trim() || !token}
                className="w-full h-12 bg-blue-500 hover:bg-blue-600 text-white text-[15px] font-bold rounded-xl transition-all hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loading ? 'Menghubungkan...' : 'Subscribe Sekarang'}
              </button>
            </form>
          )}

          <button
            onClick={handleClose}
            className="mt-4 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors focus:outline-none underline"
          >
            Lain Kali Saja
          </button>
        </div>
      </div>
    </div>
  );
}
