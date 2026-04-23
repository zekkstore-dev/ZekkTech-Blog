import Link from 'next/link';
import { TextEffect } from '@/components/motion-primitives/text-effect';

export default function HeroSection() {
  return (
    <section className="hero-section relative w-full bg-white overflow-hidden transition-colors duration-300">
      {/* Dot pattern background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/images/Dot.svg)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'top center',
          backgroundSize: 'auto',
        }}
      />

      <div className="relative max-w-[1440px] mx-auto px-6 lg:px-24 pt-0 sm:pt-10 lg:pt-20 pb-10 min-h-[calc(100vh-86px)] flex flex-col">
        <div className="flex flex-col-reverse lg:flex-row items-center lg:items-start gap-0 sm:gap-5 lg:gap-5 flex-1">
          {/* Konten kiri */}
          <div className="flex-1 max-w-[742px] pt-0 sm:pt-6 lg:pt-16">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-[1.15] tracking-tight mb-6">
              Hello World!,{' '}
              <br />
              <span className="lg:text-[40px]"> I&apos;m Zakaria MP{' '}</span>
              <span className="aka-text text-gray-900 lg:text-[35px]">a.k.a</span>{' '}
              <span className="text-blue-500 underline lg:text-[40px]"><a href="https://github.com/ZekkCode">Zekk</a> </span>
            </h1>

            <div className="flex items-stretch gap-3 mb-8">
              <div className="w-[3px] bg-blue-500 rounded-full shrink-0" />
              <TextEffect preset='fade-in-blur' speedReveal={1.1} speedSegment={0.3} className="text-[15px] sm:text-[16px] text-gray-600 leading-relaxed max-w-[580px] font-bold">
                Di sini aku bakal share tentang teknologi, tips, trik, proyek,
                dan tutorial seru lainnya! Yuk mulai baca dan jangan ketinggalan artikel terbaru!
              </TextEffect>
            </div>

            {/* Ganti form subscribe jadi dua tombol CTA ke halaman artikel */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-[560px]">
              {/* Tombol utama: lihat semua artikel */}
              <Link
                href="/blog"
                className="flex items-center justify-center gap-2 h-[56px] px-8 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-[15px] font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 6h16M4 12h16M4 18h7"/>
                </svg>
                Baca Semua Artikel
              </Link>
              {/* Tombol sekunder: ke halaman portofolio */}
              <Link
                href="/portofolio"
                className="flex items-center justify-center gap-2 h-[56px] px-8 bg-white border-2 border-gray-200 hover:border-blue-400 text-gray-700 hover:text-blue-600 rounded-xl text-[15px] font-semibold transition-all active:scale-[0.98]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
                </svg>
                Lihat Proyek
              </Link>
            </div>

            {/* Label fitur kecil di bawah tombol */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-3 sm:mt-5 text-[10px] sm:text-xs text-gray-500 font-medium">
              <span className="flex items-center gap-1">
                <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-green-400 inline-block"></span>
                Artikel dikupas tuntas
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-blue-400 inline-block"></span>
                Komentar & diskusi terbuka
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-purple-400 inline-block"></span>
                Update berkala
              </span>
            </div>
          </div>

          {/* Ilustrasi kanan */}
          <div className="flex-shrink-0 w-[280px] mx-auto -mb-14 sm:mx-0 sm:mb-0 sm:w-[380px] lg:w-[620px] lg:-mt-35 self-start">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/person-learn-coding.svg"
              alt="Person learning to code illustration"
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center mt-8 pb-4">
          <a href="#kategori" className="scroll-indicator animate-bounce">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              className="text-gray-400"
            >
              <circle cx="20" cy="20" r="19" stroke="currentColor" strokeWidth="2" />
              <path
                d="M14 17L20 23L26 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
