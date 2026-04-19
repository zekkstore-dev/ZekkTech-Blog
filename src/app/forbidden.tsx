import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';

export const metadata = {
  title: 'Akses Ditolak | ZekkTech',
  description: 'Anda tidak memiliki izin untuk mengakses halaman ini.',
};

export default function Forbidden() {
  return (
    <main className="min-h-screen flex flex-col bg-[var(--bg-primary)] transition-colors duration-300">
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center animate-in">
        <div className="max-w-md w-full relative">
          <Image 
            src="/images/403zekktech.png" 
            alt="403 Forbidden"
            width={600}
            height={400}
            className="w-full h-auto drop-shadow-lg"
            priority
          />
        </div>
        
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#1f2937] dark:text-white mt-8 mb-4">
          Akses Ditolak (403)
        </h1>
        <p className="text-slate-500 dark:text-gray-400 mb-8 max-w-md mx-auto">
          Maaf, Anda tidak memiliki izin untuk mengakses halaman ini. Jika Anda rasa ini adalah sebuah kesalahan, silakan hubungi administrator.
        </p>

        <Link 
          href="/" 
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-[#0ea5e9] hover:bg-[#0284c7] text-white rounded-xl font-bold transition-all shadow-lg shadow-sky-500/30 hover:-translate-y-1"
        >
          Kembali ke Beranda Keselamatan
        </Link>
      </div>

      <Footer />
    </main>
  );
}
