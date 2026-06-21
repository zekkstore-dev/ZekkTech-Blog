'use client';

import { useState } from 'react';
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

interface SertifikatClientProps {
  initialCerts: Certificate[];
}

export default function SertifikatClient({ initialCerts }: SertifikatClientProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  // Group certificates by section
  const groupedCerts: Record<string, Certificate[]> = {};
  initialCerts.forEach((cert) => {
    const sec = cert.section || 'Lainnya';
    if (!groupedCerts[sec]) {
      groupedCerts[sec] = [];
    }
    groupedCerts[sec].push(cert);
  });

  const sectionOrder = [
    'Dicoding',
    'Canva',
    'Coursera',
    'Dibimbing',
    'Linkedin Learning',
    'Mereka-Microsoft-AI_for_My_Future',
    'Mereka-Microsoft-Edukator-Elevate',
    'Universitas Trunojoyo Madura',
  ];

  const sortedSections = Object.keys(groupedCerts).sort((a, b) => {
    const indexA = sectionOrder.indexOf(a);
    const indexB = sectionOrder.indexOf(b);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    if (a === 'Lainnya') return 1;
    if (b === 'Lainnya') return -1;
    return a.localeCompare(b);
  });

  const formatSectionTitle = (sec: string) => {
    if (sec === 'Mereka-Microsoft-AI_for_My_Future') return 'Microsoft AI for My Future';
    if (sec === 'Mereka-Microsoft-Edukator-Elevate') return 'Microsoft Edukator Elevate';
    return sec.replace(/-/g, ' ');
  };

  const toggleSection = (sec: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sec]: !prev[sec],
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-4 md:py-6">
      {/* Kembali ke Tentang Saya (Top Left) */}
      <div className="mb-2 flex justify-start">
        <Link
          href="/about"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#0ea5e9] dark:text-gray-400 dark:hover:text-[#0ea5e9] transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
          </svg>
          Kembali ke Tentang Saya
        </Link>
      </div>

      {/* Header */}
      <div className="text-center mb-4">
        <svg className="inline-block w-8 h-8 mb-1 mx-auto text-[#0ea5e9]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
          <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
          <path d="M4 22h16" />
          <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
          <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
          <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
        <h1 className="text-lg sm:text-xl font-extrabold text-slate-800 dark:text-white mb-1 tracking-tight">
          Koleksi Sertifikat
        </h1>
        <p className="text-[10px] sm:text-[11px] text-slate-400 dark:text-gray-400 max-w-sm mx-auto leading-normal">
          Pencapaian dan sertifikasi yang telah diraih dalam perjalanan belajar teknologi.
        </p>
      </div>

      {/* Kosong */}
      {initialCerts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <svg className="w-16 h-16 mb-4 text-[#0ea5e9]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 2v2" />
            <path d="M14 2v2" />
            <path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h12Z" />
            <path d="M6 2v2" />
            <path d="M17 10h1a3 3 0 1 1 0 6h-1" />
          </svg>
          <h2 className="text-xl font-bold text-slate-700 dark:text-gray-200 mb-2">
            Maaf, sertifikat kosong!
          </h2>
          <p className="text-slate-500 dark:text-gray-400 max-w-xs leading-normal text-xs">
            Lagi males ngisi, hehehe... belum ngopi.
            <br />
            Nanti diisi kalau udah melek ya!
          </p>
          <div className="mt-6 px-4 py-2 bg-[#0ea5e9]/10 text-[#0ea5e9] rounded-xl text-xs font-semibold border border-[#0ea5e9]/20">
            Coming soon... dulu bentar
          </div>
        </div>
      )}

      {/* Grouped Sertifikat */}
      {initialCerts.length > 0 && (
        <>
          {/* Sticky Navigation / Category Bar */}
          <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1.5 sticky top-[64px] md:top-[72px] z-20 bg-[var(--bg-primary)]/80 backdrop-blur-md py-1.5 border-b border-slate-100 dark:border-slate-800/80">
            {sortedSections.map((sec) => (
              <a
                key={sec}
                href={`#section-${sec}`}
                className="shrink-0 px-3 py-1 text-[10px] font-bold bg-[var(--bg-secondary)] hover:bg-slate-100 dark:hover:bg-slate-800/80 text-slate-600 dark:text-gray-300 rounded-full border border-slate-200/60 dark:border-slate-700/50 shadow-sm transition-all"
              >
                {formatSectionTitle(sec)} ({groupedCerts[sec].length})
              </a>
            ))}
          </div>

          {/* View Mode Toggle & Total Count */}
          <div className="flex justify-between items-center mb-3 bg-slate-50 dark:bg-slate-900/50 p-1.5 px-2.5 rounded-lg border border-slate-100 dark:border-slate-800/60">
            <div className="text-[10px] font-bold text-slate-500 dark:text-gray-400">
              Total: <strong>{initialCerts.length}</strong> Sertifikat
            </div>
            <div className="flex gap-1 bg-slate-100 dark:bg-slate-850 p-0.5 rounded-lg">
              <button
                onClick={() => setViewMode('grid')}
                className={`px-2.5 py-1 rounded-md text-[9px] font-extrabold transition-all flex items-center gap-1 uppercase tracking-wide ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-gray-200'
                }`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <rect x="3" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="3" width="7" height="7" rx="1" />
                  <rect x="14" y="14" width="7" height="7" rx="1" />
                  <rect x="3" y="14" width="7" height="7" rx="1" />
                </svg>
                Grid
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-2.5 py-1 rounded-md text-[9px] font-extrabold transition-all flex items-center gap-1 uppercase tracking-wide ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-gray-200'
                }`}
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
                List Detail
              </button>
            </div>
          </div>

          {/* List Grouped Sections */}
          <div className="space-y-4">
            {sortedSections.map((sec) => {
              const sectionCerts = groupedCerts[sec];
              const isCollapsed = collapsedSections[sec] || false;

              return (
                <div key={sec} id={`section-${sec}`} className="scroll-mt-32">
                  {/* Section Header (Clickable Folder) */}
                  <div
                    onClick={() => toggleSection(sec)}
                    className="flex items-center gap-1.5 mb-2 cursor-pointer hover:opacity-85 select-none group"
                  >
                    <svg
                      className={`w-3.5 h-3.5 text-slate-400 dark:text-gray-500 transition-transform duration-200 ${
                        isCollapsed ? '-rotate-90' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>

                    {/* Folder Icon */}
                    <svg className="w-4 h-4 text-[#3b82f6] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                    </svg>

                    <h2 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-white capitalize tracking-tight">
                      {formatSectionTitle(sec)}
                    </h2>
                    <div className="h-[1px] bg-slate-100 dark:bg-slate-800/50 flex-1 rounded-full" />
                    <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-gray-400 text-[9px] font-bold rounded border border-slate-200/50 dark:border-slate-700/50">
                      {sectionCerts.length}
                    </span>
                  </div>

                  {/* Section Items */}
                  {!isCollapsed && (
                    <>
                      {viewMode === 'grid' ? (
                        /* Grid View - Compact File Explorer style */
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                          {sectionCerts.map((cert) => {
                            const isPdf = cert.cert_url?.toLowerCase().includes('.pdf') || cert.cert_url?.toLowerCase().includes('/documents/');
                            return (
                              <div
                                key={cert.id}
                                className="group bg-[var(--bg-secondary)] rounded-lg border border-slate-100 dark:border-slate-800/80 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col"
                              >
                                {/* Thumbnail */}
                                <div className="w-full h-24 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-850 dark:to-slate-900 overflow-hidden relative flex items-center justify-center border-b border-slate-100 dark:border-slate-800/50">
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
                                    <svg className="w-8 h-8 opacity-30 text-slate-400 dark:text-slate-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
                                      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
                                      <path d="M4 22h16" />
                                      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
                                      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
                                      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                                    </svg>
                                  )}
                                  {isPdf && (
                                    <span className="absolute top-1.5 right-1.5 bg-red-600/90 text-white text-[7px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider shadow-sm">
                                      PDF
                                    </span>
                                  )}
                                </div>

                                {/* Info */}
                                <div className="p-2 flex flex-col flex-1">
                                  <h3 className="font-bold text-slate-800 dark:text-white text-[11px] mb-0.5 line-clamp-2 leading-snug">
                                    {cert.title}
                                  </h3>
                                  <p className="text-[8px] text-slate-500 dark:text-gray-400 mb-1.5 truncate">
                                    {cert.issuer}
                                  </p>
                                  {cert.cert_url && (
                                    <a
                                      href={cert.cert_url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="mt-auto w-full inline-flex items-center justify-center gap-1.5 py-1 bg-blue-500 hover:bg-blue-600 dark:bg-sky-500 dark:hover:bg-sky-600 text-white text-[9px] font-extrabold rounded transition-colors"
                                    >
                                      Buka File
                                    </a>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        /* List View - File Explorer Detail Style */
                        <div className="border border-slate-100 dark:border-slate-850 rounded-lg overflow-hidden bg-[var(--bg-secondary)] shadow-sm">
                          <div className="overflow-x-auto">
                            <table className="w-full min-w-[640px] text-left border-collapse table-fixed">
                              <thead>
                                <tr className="bg-slate-50 dark:bg-slate-800/40 text-[8px] font-black text-slate-400 dark:text-gray-500 border-b border-slate-100 dark:border-slate-800/60 uppercase tracking-wider">
                                  <th className="py-1.5 px-3 w-[10%]">Pratayang</th>
                                  <th className="py-1.5 px-3 w-[40%]">Nama Sertifikat</th>
                                  <th className="py-1.5 px-3 w-[25%]">Penerbit</th>
                                  <th className="py-1.5 px-3 w-[13%]">Tanggal</th>
                                  <th className="py-1.5 px-3 w-[12%] text-center">Aksi</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                                {sectionCerts.map((cert) => {
                                  const isPdf = cert.cert_url?.toLowerCase().includes('.pdf') || cert.cert_url?.toLowerCase().includes('/documents/');
                                  return (
                                    <tr key={cert.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors text-[11px] text-slate-700 dark:text-gray-300">
                                      <td className="py-1.5 px-3">
                                        <div className="w-9 h-6 rounded border border-slate-150 dark:border-slate-800 overflow-hidden relative flex items-center justify-center bg-slate-100 dark:bg-slate-900">
                                          {cert.image_url ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={cert.image_url} alt={cert.title} className="w-full h-full object-cover" />
                                          ) : isPdf && cert.cert_url ? (
                                            <PdfThumbnail pdfUrl={cert.cert_url} alt={cert.title} />
                                          ) : (
                                            <svg className="w-3.5 h-3.5 opacity-30 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                              <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
                                            </svg>
                                          )}
                                        </div>
                                      </td>
                                      <td className="py-1.5 px-3 font-semibold text-slate-800 dark:text-white">
                                        <div className="truncate" title={cert.title}>
                                          {cert.title}
                                        </div>
                                      </td>
                                      <td className="py-1.5 px-3 text-slate-500 dark:text-gray-400">
                                        <div className="truncate" title={cert.issuer}>
                                          {cert.issuer}
                                        </div>
                                      </td>
                                      <td className="py-1.5 px-3 text-slate-400 dark:text-gray-500">
                                        {cert.date || '-'}
                                      </td>
                                      <td className="py-1.5 px-3 text-center">
                                        {cert.cert_url && (
                                          <a
                                            href={cert.cert_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center px-3 py-0.5 bg-blue-50 hover:bg-blue-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-blue-600 dark:text-blue-400 text-[9px] font-black rounded transition-colors"
                                          >
                                            Buka
                                          </a>
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
