import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';

export const metadata = {
  title: 'Halaman Tidak Ditemukan | ZekkTech',
  description: 'Maaf, halaman yang Anda cari tidak ditemukan.',
};

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col bg-[var(--bg-primary)] transition-colors duration-300">
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in">
        <div className="max-w-md w-full relative">
          <Image 
            src="/images/404zekktech.png" 
            alt="404 Not Found"
            width={600}
            height={400}
            className="w-full h-auto drop-shadow-lg"
            priority
          />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#1f2937] dark:text-white mt-8 mb-4">
          Oops! Halaman Tidak Ditemukan
        </h1>
        <p className="text-slate-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Robot kami sudah mencari ke seluruh sistem, tapi halaman yang Anda minta sepertinya sudah dipindahkan atau tidak pernah ada.
        </p>

        <Link 
          href="/" 
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#0ea5e9] hover:bg-[#0284c7] text-white rounded-xl font-bold transition-all shadow-lg shadow-sky-500/30 hover:-translate-y-1"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          Kembali ke Beranda
        </Link>
      </div>

      <Footer />
    </main>
  );
}
