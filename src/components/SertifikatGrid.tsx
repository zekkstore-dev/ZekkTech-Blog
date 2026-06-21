'use client';

import Link from 'next/link';
import PdfThumbnail from '@/components/PdfThumbnail';

interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  image_url: string;
  cert_url: string;
  section: string;
}

interface SertifikatGridProps {
  certificates: Certificate[];
  maxItems?: number;
  showViewAll?: boolean;
  viewAllHref?: string;
  title?: string;
  isCompact?: boolean;
}

export default function SertifikatGrid({
  certificates,
  maxItems = 10,
  showViewAll = true,
  viewAllHref = '/sertifikat',
  title = 'Sertifikat',
  isCompact = false,
}: SertifikatGridProps) {
  const displayCerts = certificates.slice(0, maxItems);
  const hasMore = certificates.length > maxItems;
  const remainingCount = certificates.length - maxItems;

  if (certificates.length === 0) {
    return (
      <div className="bg-[var(--bg-secondary)] rounded-2xl border border-slate-100 dark:border-slate-800 p-6 text-center">
        <svg className="w-10 h-10 mx-auto mb-3 text-slate-300 dark:text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
        <p className="text-sm text-slate-500 dark:text-gray-400">Belum ada sertifikat.</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-secondary)] rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-[#0ea5e9]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
          </svg>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">{title}</h3>
        </div>
        <span className="text-xs text-slate-500 dark:text-gray-400">
          {certificates.length} Sertifikat
        </span>
      </div>

      {/* Grid - compact grid for certificates */}
      <div className={`p-4 grid grid-cols-2 sm:grid-cols-3 ${isCompact ? 'lg:grid-cols-4 gap-2' : 'lg:grid-cols-4 xl:grid-cols-5 gap-3'}`}>
        {displayCerts.map((cert) => {
          const isPdf = cert.cert_url?.toLowerCase().includes('.pdf') || cert.cert_url?.toLowerCase().includes('/documents/');
          return (
            <div
              key={cert.id}
              className="group bg-[var(--bg-primary)] rounded-lg border border-slate-100 dark:border-slate-800/80 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col"
            >
              {/* Thumbnail */}
              <div className="w-full h-20 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-850 dark:to-slate-900 overflow-hidden relative flex items-center justify-center border-b border-slate-100 dark:border-slate-800/50">
                {cert.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={cert.image_url}
                    alt={cert.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : isPdf && cert.cert_url ? (
                  <PdfThumbnail pdfUrl={cert.cert_url} alt={cert.title} />
                ) : (
                  <svg className="w-6 h-6 opacity-30 text-slate-400 dark:text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                    <path d="M4 22h16" />
                    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                  </svg>
                )}
                {isPdf && (
                  <span className="absolute top-1 right-1 bg-red-600/90 text-white text-[6px] font-black px-1 py-0.5 rounded uppercase tracking-wider shadow-sm">
                    PDF
                  </span>
                )}
                {/* Section Badge */}
                <span className="absolute top-1 left-1 px-1 py-0.5 bg-white/90 dark:bg-slate-800/90 text-slate-600 dark:text-gray-400 text-[6px] font-bold rounded ring-1 ring-inset ring-slate-200/60 dark:ring-slate-700/60">
                  {cert.section || 'Lainnya'}
                </span>
              </div>

              {/* Info */}
              <div className="p-2 flex flex-col flex-1">
                <h4 className="font-bold text-slate-800 dark:text-white text-[9px] mb-0.5 line-clamp-2 leading-tight">
                  {cert.title}
                </h4>
                <p className="text-[7px] text-slate-500 dark:text-gray-400 mb-1 truncate">
                  {cert.issuer}
                </p>
                {cert.date && (
                  <p className="text-[7px] text-slate-400 dark:text-gray-500 mb-1.5">
                    {cert.date}
                  </p>
                )}
                {cert.cert_url && (
                  <a
                    href={cert.cert_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto w-full inline-flex items-center justify-center py-1 bg-blue-500 hover:bg-blue-600 dark:bg-sky-500 dark:hover:bg-sky-600 text-white text-[8px] font-extrabold rounded transition-colors"
                  >
                    Buka File
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* View All Card - Centered below the grid */}
      {hasMore && showViewAll && (
        <div className="flex justify-center p-4 pt-0 pb-6">
          <Link
            href={viewAllHref}
            className="group flex items-center justify-center gap-2 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 hover:border-[#0ea5e9] dark:hover:border-[#0ea5e9] hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all duration-300 py-2.5 px-6 w-full max-w-xs"
          >
            <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-3 h-3 text-[#0ea5e9]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
            <span className="text-[10px] font-bold text-slate-600 dark:text-gray-300 group-hover:text-[#0ea5e9] transition-colors">
              Lihat {remainingCount} Lainnya ({certificates.length} Sertifikat)
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}