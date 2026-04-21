'use client';

import Link from 'next/link';

/**
 * CommunitySection — Ajakan bergabung komunitas WhatsApp + interaksi artikel
 * Ditampilkan sebelum Footer di semua halaman
 */
export default function NewsletterSection() {
  return (
    <section className="w-full bg-[#0f1117] py-16 sm:py-20 relative overflow-hidden">
      {/* Garis dekorasi horizontal di atas dan bawah */}
      <div className="absolute top-0 left-0 right-0 h-px bg-white/5" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/5" />

      <div className="max-w-[900px] mx-auto px-6 relative z-10">

        {/* ============================
            BAGIAN 1: Interaksi Artikel
            ============================ */}
        <div className="mb-14 pb-14 border-b border-white/8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-3 text-center">
            Ikuti, Komentari & Diskusikan Setiap Artikel
          </h2>
          <p className="text-[14px] sm:text-[15px] text-gray-400 mb-10 max-w-[520px] mx-auto text-center leading-relaxed">
            Setiap postingan punya kolom komentar terbuka. Tanya, diskusi, atau bagikan
            pengalamanmu.
          </p>

          {/* Grid fitur interaksi — tanpa border radius berlebihan */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
            <div className="bg-white/4 border border-white/8 p-5">
              <div className="w-7 h-7 flex items-center justify-center mb-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <p className="text-sm font-bold text-white mb-1">Kolom Komentar</p>
              <p className="text-xs text-gray-500 leading-relaxed">Setiap artikel punya kolom diskusi. Langsung tulis komentarmu.</p>
            </div>
            <div className="bg-white/4 border border-white/8 p-5">
              <div className="w-7 h-7 flex items-center justify-center mb-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/>
                </svg>
              </div>
              <p className="text-sm font-bold text-white mb-1">Bagikan Artikel</p>
              <p className="text-xs text-gray-500 leading-relaxed">Ada tombol share di setiap postingan untuk disebarkan ke teman.</p>
            </div>
            <div className="bg-white/4 border border-white/8 p-5">
              <div className="w-7 h-7 flex items-center justify-center mb-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
                </svg>
              </div>
              <p className="text-sm font-bold text-white mb-1">Update Berkala</p>
              <p className="text-xs text-gray-500 leading-relaxed">Artikel baru diterbitkan rutin. Pantau terus halaman blog.</p>
            </div>
          </div>

          {/* Tombol ke halaman blog */}
          <div className="flex justify-center">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 h-[48px] px-8 bg-blue-500 hover:bg-blue-600 text-white text-[14px] font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/20 active:scale-[0.98]"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 6h16M4 12h16M4 18h7"/>
              </svg>
              Mulai Baca & Komentar
            </Link>
          </div>
        </div>

        {/* ============================
            BAGIAN 2: Join Komunitas WhatsApp
            ============================ */}
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
          {/* Kiri — teks */}
          <div className="flex-1 text-center lg:text-left">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">
              Komunitas ZekkTech
            </p>
            <h3 className="text-xl sm:text-2xl font-extrabold text-white mb-3 leading-tight">
              Ikuti Grup WhatsApp<br />
              <span className="text-green-400">agar Tahu Update Artikel Setiap Hari</span>
            </h3>
            <p className="text-[13px] sm:text-[14px] text-gray-400 leading-relaxed max-w-[400px] mx-auto lg:mx-0">
              Gabung ke grup WhatsApp dan dapatkan notifikasi setiap ada artikel baru, tips teknologi, dan diskusi seru langsung dari admin.
            </p>
          </div>

          {/* Kanan — tombol bergabung WhatsApp */}
          <div className="flex-shrink-0 text-center">
            {/* Logo WhatsApp + CTA */}
            <a
              href="https://chat.whatsapp.com/BiwktQom1QS0n588Nw6B8j"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 h-[58px] px-8 bg-[#25D366] hover:bg-[#20bd5a] text-white text-[16px] font-bold transition-all hover:shadow-xl hover:shadow-green-500/20 active:scale-[0.98]"
            >
              {/* Icon WhatsApp SVG */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Bergabung Sekarang
            </a>

            {/* Info bawah tombol */}
            <p className="mt-3 text-[11px] text-gray-600">
              Gratis · Keluar kapan saja · Admin aktif setiap hari
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
