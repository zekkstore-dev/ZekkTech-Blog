'use client';

import { useState } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';

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
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="subscribe" className="w-full bg-white border-t border-gray-100 py-16 sm:py-20 scroll-mt-20">
      <div className="max-w-[680px] mx-auto px-6 text-center">

        {/* Icon */}
        <div className="w-12 h-12 bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto mb-5">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-3">
          Subscribe untuk Bisa Komentar
        </h2>
        <p className="text-[14px] sm:text-[15px] text-gray-500 mb-2 leading-relaxed">
          Daftar email kamu di sini untuk mendapatkan update artikel terbaru dan
          <strong className="text-gray-700"> bisa berkomentar & berinteraksi</strong> di setiap postingan.
        </p>
        <p className="text-[13px] text-gray-400 mb-8">
          Gratis. Tidak ada spam. Keluar kapan saja.
        </p>

        {/* Indikator benefit kecil */}
        <div className="flex flex-wrap justify-center gap-4 mb-8 text-[12px] text-gray-500">
          <span className="flex items-center gap-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Update artikel terbaru
          </span>
          <span className="flex items-center gap-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Bisa komentar di semua artikel
          </span>
          <span className="flex items-center gap-1.5">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            Gratis selamanya
          </span>
        </div>

        {/* Form subscribe — stack vertikal, mobile-friendly */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-[500px] mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Masukkan email kamu..."
            required
            disabled={loading || status === 'success'}
            className="w-full h-[52px] px-5 bg-gray-50 border-2 border-gray-200 text-[14px] text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading || !email.trim() || !token || status === 'success'}
            className="w-full h-[52px] px-8 bg-blue-500 hover:bg-blue-600 text-white text-[15px] font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? 'Mendaftar...' : status === 'success' ? 'Terdaftar!' : 'Daftar Sekarang'}
          </button>
        </form>

        {/* Turnstile Captcha */}
        <div className="mt-4 flex justify-center">
          {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? (
            <Turnstile
              siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY}
              onSuccess={(t) => setToken(t)}
            />
          ) : null}
        </div>

        {/* Feedback */}
        {status === 'success' && (
          <div className="mt-5 p-4 bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
            <p className="font-bold mb-1">Berhasil terdaftar!</p>
            <p>{message}</p>
          </div>
        )}
        {status === 'error' && (
          <div className="mt-5 p-4 bg-red-50 border border-red-200 text-red-600 text-sm">
            {message}
          </div>
        )}
      </div>
    </section>
  );
}
