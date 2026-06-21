'use client';

import { useState, useRef } from 'react';
import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile';

/**
 * SubscribeSection — Form subscribe di landing page
 * Syarat untuk bisa komentar di artikel
 */
export default function SubscribeSection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [token, setToken] = useState('');
  const [showCaptcha, setShowCaptcha] = useState(false); // lazy render Turnstile
  const turnstileRef = useRef<TurnstileInstance>(null);

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
      setMessage('Berhasil! Email kamu sudah terdaftar. Sekarang kamu bisa berkomentar di setiap artikel.');
      setEmail('');
    } catch (err) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'Terjadi kesalahan.');
      turnstileRef.current?.reset();
      setToken('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="subscribe" className="w-full bg-[var(--bg-secondary)] border-t border-[var(--border-primary)] py-10 sm:py-20 scroll-mt-20 transition-colors duration-300">
      <div className="max-w-[680px] mx-auto px-6 text-center">

        {/* Icon */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900/30 flex items-center justify-center mx-auto mb-3 sm:mb-5 rounded-lg">
          <svg width="18" height="18" className="sm:w-[22px] sm:h-[22px]" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </div>

        <h2 className="text-lg sm:text-3xl font-extrabold text-[var(--text-primary)] mb-2 sm:mb-3">
          Subscribe untuk Bisa Komentar
        </h2>
        <p className="text-[12px] sm:text-[15px] text-[var(--text-secondary)] mb-1.5 sm:mb-2 leading-relaxed">
          Daftar email kamu di sini untuk mendapatkan update artikel terbaru dan
          <strong className="text-[var(--text-primary)]"> bisa berkomentar & berinteraksi</strong> di setiap postingan.
        </p>
        <p className="text-[11px] sm:text-[13px] text-[var(--text-tertiary)] mb-5 sm:mb-8">
          Gratis. Tidak ada spam. Keluar kapan saja.
        </p>

        {/* Indikator benefit kecil */}
        <div className="flex flex-wrap justify-center gap-2.5 sm:gap-4 mb-5 sm:mb-8 text-[10px] sm:text-[12px] text-[var(--text-secondary)]">
          <span className="flex items-center gap-1 sm:gap-1.5">
            <svg width="11" height="11" className="sm:w-[13px] sm:h-[13px]" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Update artikel terbaru
          </span>
          <span className="flex items-center gap-1 sm:gap-1.5">
            <svg width="11" height="11" className="sm:w-[13px] sm:h-[13px]" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Bisa komentar di semua artikel
          </span>
          <span className="flex items-center gap-1 sm:gap-1.5">
            <svg width="11" height="11" className="sm:w-[13px] sm:h-[13px]" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Gratis selamanya
          </span>
        </div>

        {/* Form subscribe — stack vertikal, mobile-friendly */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-2.5 w-full max-w-[500px] mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onFocus={() => setShowCaptcha(true)}
            placeholder="Masukkan email kamu..."
            required
            disabled={loading || status === 'success'}
            className="w-full h-[44px] sm:h-[52px] px-4 sm:px-5 bg-[var(--bg-input)] border border-[var(--border-secondary)] rounded-xl text-xs sm:text-[14px] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !email.trim() || !token || status === 'success'}
            className="w-full h-[44px] sm:h-[52px] px-6 sm:px-8 bg-blue-500 hover:bg-blue-600 text-white text-xs sm:text-[15px] font-semibold rounded-xl transition-all hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? 'Mendaftar...' : status === 'success' ? 'Terdaftar!' : 'Daftar Sekarang'}
          </button>
        </form>

        {/* Turnstile Captcha — hanya muncul setelah user fokus ke input */}
        {showCaptcha && process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
          <div className="mt-4 flex justify-center">
            <Turnstile
              ref={turnstileRef}
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
              onSuccess={(t) => setToken(t)}
            />
          </div>
        )}

        {/* Feedback */}
        {status === 'success' && (
          <div className="mt-5 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800/30 text-green-700 dark:text-green-400 text-sm font-medium rounded-xl">
            <p className="font-bold mb-1">Berhasil terdaftar!</p>
            <p>{message}</p>
          </div>
        )}
        {status === 'error' && (
          <div className="mt-5 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 text-red-600 dark:text-red-400 text-sm rounded-xl">
            {message}
          </div>
        )}
      </div>
    </section>
  );
}
