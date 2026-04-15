'use client';

import { useState } from 'react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const supabase = createClient();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;

    setLoading(true);
    setStatus('idle');
    setMessage('');

    try {
      // Periksa koneksi Supabase
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (!supabaseUrl || supabaseUrl.includes('your-project')) {
        // Jika mode dummy, simulasikan sukses
        await new Promise(resolve => setTimeout(resolve, 800));
        setStatus('success');
        setMessage('Terima kasih! (Mode Dummy Berhasil)');
        setEmail('');
        setLoading(false);
        return;
      }

      // Pastikan email valid & masukkan ke db
      const { error } = await supabase
        .from('subscribers')
        .insert([{ email: email.trim() }]);

      if (error) {
        if (error.code === '23505') {
          // Unique constraint error
          throw new Error('Email ini sudah berlangganan sebelumnya.');
        }
        throw new Error('Gagal berlangganan. Silakan coba lagi nanti.');
      }

      setStatus('success');
      setMessage('Luar biasa! Terima kasih sudah berlangganan newsletter kami.');
      setEmail('');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full bg-[#1a1a2e] py-16 sm:py-20 relative overflow-hidden">
      <div className="max-w-[708px] mx-auto px-6 text-center relative z-10">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-[100px] h-[100px] sm:w-[130px] sm:h-[130px] rounded-full bg-blue-500/20 flex items-center justify-center">
            <Image
              src="/images/subscribe-letter-email.png"
              alt="Subscribe to newsletter"
              width={80}
              height={107}
              className="w-[60px] sm:w-[80px] h-auto object-contain"
            />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-extrabold text-white leading-tight mb-3">
          Berlangganan Untuk Pembaruan Terbaru
        </h2>
        <p className="text-[14px] sm:text-[16px] text-gray-400 mb-8 max-w-[600px] mx-auto">
          Dapatkan pemberitahuan artikel, berita teknologi instan, dan ragam materi eksplorasi langsung ke inbox Anda.
        </p>

        {/* Form Container */}
        <div className="max-w-[708px] mx-auto">
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-0">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Masukkan email Anda di sini...."
              required
              disabled={loading}
              className="flex-1 h-[56px] sm:h-[67px] px-6 bg-white/10 border-2 border-white/20 rounded-xl sm:rounded-r-none sm:rounded-l-xl text-[15px] text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all backdrop-blur-sm disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="h-[50px] sm:h-[67px] px-10 bg-blue-500 hover:bg-blue-600 text-white rounded-xl sm:rounded-l-none sm:rounded-r-xl text-[16px] font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.98] mt-3 sm:mt-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Mengirim...' : 'Berlangganan'}
            </button>
          </form>

          {/* Feedback Messages */}
          {status === 'success' && (
            <div className="mt-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
              ✅ {message}
            </div>
          )}
          {status === 'error' && (
            <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm font-medium animate-in fade-in slide-in-from-bottom-2">
              🚨 {message}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
