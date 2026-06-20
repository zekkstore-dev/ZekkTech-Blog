import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Sertifikat | ZekkTech',
  description: 'Koleksi sertifikat dan pencapaian Zakaria MP di dunia teknologi.',
};

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  image_url: string;
  cert_url: string;
}

async function getCertificates(): Promise<Certificate[]> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    if (!supabaseUrl || supabaseUrl.includes('your-project')) return [];
    const { createServerSupabaseClient } = await import('@/lib/supabase/server');
    const supabase = await createServerSupabaseClient();
    const { data } = await supabase
      .from('certificates')
      .select('*')
      .order('date', { ascending: false });
    return (data as Certificate[]) ?? [];
  } catch {
    return [];
  }
}

export default async function SertifikatPage() {
  const certs = await getCertificates();

  return (
    <main className="min-h-screen bg-[var(--bg-primary)] transition-colors duration-300">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-12 md:py-20">
        {/* Header */}
        <div className="text-center mb-12">
          <svg className="inline-block w-14 h-14 mb-4 mx-auto text-[#0ea5e9]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
          </svg>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 dark:text-white mb-3">
            Koleksi Sertifikat
          </h1>
          <p className="text-slate-500 dark:text-gray-400 max-w-md mx-auto">
            Pencapaian dan sertifikasi yang telah diraih dalam perjalanan belajar teknologi.
          </p>
          <Link
            href="/about"
            className="inline-flex items-center gap-2 mt-4 text-sm text-[#0ea5e9] hover:underline"
          >
            ← Kembali ke Tentang Saya
          </Link>
        </div>

        {/* Kosong */}
        {certs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            {/* Ilustrasi ngopi */}
            <svg className="w-20 h-20 mb-6 text-[#0ea5e9]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 2v2" />
              <path d="M14 2v2" />
              <path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h12Z" />
              <path d="M6 2v2" />
              <path d="M17 10h1a3 3 0 1 1 0 6h-1" />
            </svg>
            <h2 className="text-2xl font-extrabold text-slate-700 dark:text-gray-200 mb-3">
              Maaf, sertifikat kosong!
            </h2>
            <p className="text-slate-500 dark:text-gray-400 max-w-sm leading-relaxed text-[15px]">
              Lagi males ngisi, hehehe... belum ngopi.
              <br />
              Nanti diisi kalau udah melek ya!
            </p>
            <div className="mt-8 px-6 py-3 bg-[#0ea5e9]/10 text-[#0ea5e9] rounded-2xl text-sm font-semibold border border-[#0ea5e9]/20">
              <svg className="inline-block w-4 h-4 mr-1 -mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 2v2" />
                <path d="M14 2v2" />
                <path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h12Z" />
                <path d="M6 2v2" />
                <path d="M17 10h1a3 3 0 1 1 0 6h-1" />
              </svg>
              Coming soon... dulu bentar
            </div>
          </div>
        )}

        {/* Grid Sertifikat */}
        {certs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {certs.map((cert) => (
              <div
                key={cert.id}
                className="group bg-[var(--bg-secondary)] rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col"
              >
                {/* Gambar sertifikat */}
                <div className="w-full h-44 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-700 dark:to-slate-800 overflow-hidden relative">
                  {cert.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cert.image_url}
                      alt={cert.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <svg className="w-14 h-14 opacity-30 text-slate-400 dark:text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                      <path d="M4 22h16" />
                      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                    </svg>
                  )}
                </div>

                {/* Info */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-extrabold text-slate-800 dark:text-white text-sm mb-1 line-clamp-2">
                    {cert.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-gray-400 mb-1">
                    {cert.issuer}
                  </p>
                  {cert.date && (
                    <p className="text-xs text-slate-400 mb-4">
                      <svg className="inline-block w-3.5 h-3.5 mr-1 -mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      {cert.date}
                    </p>
                  )}
                  {cert.cert_url && (
                    <a
                      href={cert.cert_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-auto inline-flex items-center gap-2 px-4 py-2 bg-[#0ea5e9] hover:bg-[#0284c7] text-white text-xs font-bold rounded-xl transition-colors"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"/></svg>
                      Lihat Sertifikat
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
