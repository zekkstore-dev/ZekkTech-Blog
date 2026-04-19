'use client';

import { Plus_Jakarta_Sans } from 'next/font/google';
import Image from 'next/image';
import './globals.css';

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
});

// global-error.tsx is used when layout.tsx crashes completely
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="id">
      <body className={`${plusJakartaSans.className} antialiased bg-[#f4f7fb] text-slate-800`}>
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md w-full relative">
            <Image 
              src="/images/500zekktech.png" 
              alt="Fatal Error"
              width={600}
              height={400}
              className="w-full h-auto drop-shadow-xl"
              priority
            />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-extrabold mt-8 mb-4">
            Critical System Error
          </h1>
          <p className="text-slate-500 mb-8 max-w-md mx-auto font-medium">
            Aplikasi mengalami kesalahan fatal yang tidak dapat dipulihkan secara otomatis. Sabar ya, robot kami sedang kerja keras memperbaiki ini.
          </p>

          <button
            onClick={() => reset()}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#0ea5e9] hover:bg-[#0284c7] text-white rounded-xl font-bold transition-all shadow-lg shadow-sky-500/30"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
            Muat Ulang Aplikasi
          </button>
        </div>
      </body>
    </html>
  );
}
