'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Portfolio } from '@/types/portfolio';

interface PortofolioClientProps {
  initialPortfolios: Portfolio[];
  isAboutPage?: boolean;
}

export default function PortofolioClient({ initialPortfolios, isAboutPage = false }: PortofolioClientProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});

  // Group portfolios by status
  const groupedPorts = {
    completed: [] as Portfolio[],
    progress: [] as Portfolio[],
  };

  initialPortfolios.forEach((port) => {
    if (port.status === 'progress') {
      groupedPorts.progress.push(port);
    } else {
      groupedPorts.completed.push(port);
    }
  });

  const toggleSection = (status: 'completed' | 'progress') => {
    setCollapsedSections((prev) => ({
      ...prev,
      [status]: !prev[status],
    }));
  };

  return (
    <div className={isAboutPage ? "w-full" : "max-w-6xl mx-auto px-4 py-4 md:py-6"}>
      {/* Kembali ke Tentang Saya (Top Left) */}
      {!isAboutPage && (
        <div className="mb-3 flex justify-start">
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
      )}

      {/* Header */}
      <div className="text-center mb-6">
        <svg className="inline-block w-8 h-8 mb-1 mx-auto text-[#0ea5e9]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
          <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
        </svg>
        <h1 className="text-lg sm:text-xl font-extrabold text-slate-800 dark:text-white mb-1 tracking-tight">
          Portofolio & Proyek
        </h1>
        <p className="text-[10px] sm:text-[11px] text-slate-400 dark:text-gray-400 max-w-sm mx-auto leading-normal">
          Eksplorasi kumpulan karya terbaik saya. Dari aplikasi marketplace hingga Program ada di sini.
        </p>
      </div>

      {/* Kosong */}
      {initialPortfolios.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <svg className="w-16 h-16 mb-4 text-[#0ea5e9] opacity-40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
          <h2 className="text-xl font-bold text-slate-700 dark:text-gray-200 mb-2">
            Belum ada proyek portofolio
          </h2>
          <p className="text-slate-500 dark:text-gray-400 max-w-xs leading-normal text-xs">
            Silakan buat dan atur portofolio di Dashboard Admin.
          </p>
        </div>
      )}

      {initialPortfolios.length > 0 && (
        <>
          {/* View Mode Toggle & Total Count */}
          <div className="flex justify-between items-center mb-4 bg-slate-50 dark:bg-slate-900/50 p-1.5 px-2.5 rounded-lg border border-slate-100 dark:border-slate-800/60">
            <div className="text-[10px] font-bold text-slate-500 dark:text-gray-400">
              Total: <strong>{initialPortfolios.length}</strong> Proyek
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

          {/* Collapsible Sections (Completed & Progress) */}
          <div className="space-y-6">
            {/* 1. Proyek Selesai */}
            {groupedPorts.completed.length > 0 && (
              <div className="scroll-mt-32">
                {/* Folder Header */}
                <div
                  onClick={() => toggleSection('completed')}
                  className="flex items-center gap-1.5 mb-2.5 cursor-pointer hover:opacity-85 select-none group"
                >
                  <svg
                    className={`w-3.5 h-3.5 text-slate-400 dark:text-gray-500 transition-transform duration-200 ${
                      collapsedSections.completed ? '-rotate-90' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                  <svg className="w-4 h-4 text-[#3b82f6] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                  </svg>
                  <h2 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-white tracking-tight">
                    Proyek Selesai
                  </h2>
                  <div className="h-[1px] bg-slate-100 dark:bg-slate-800/50 flex-1 rounded-full" />
                  <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-gray-400 text-[9px] font-bold rounded border border-slate-200/50 dark:border-slate-700/50">
                    {groupedPorts.completed.length}
                  </span>
                </div>

                {!collapsedSections.completed && (
                  <>
                    {viewMode === 'grid' ? (
                      /* Grid View */
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {groupedPorts.completed.map((port) => (
                          <div key={port.id} className="group bg-[var(--bg-secondary)] rounded-lg border border-slate-100 dark:border-slate-800/80 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col">
                            {/* Pratayang Image */}
                            <div className="w-full h-28 overflow-hidden relative bg-slate-100 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800/50">
                              {port.image_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={port.image_url} alt={port.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-850 dark:to-slate-900 opacity-60">
                                  <svg className="w-8 h-8 opacity-30 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                                  </svg>
                                </div>
                              )}
                              <span className="absolute top-2 left-2 px-2 py-0.5 bg-teal-100/90 text-teal-700 text-[8px] font-black rounded-full ring-1 ring-inset ring-teal-600/20 shadow-sm flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-teal-500"></span>
                                Selesai
                              </span>
                            </div>

                            {/* Content */}
                            <div className="p-3 flex flex-col flex-1">
                              <h3 className="font-bold text-slate-800 dark:text-white text-xs mb-1 line-clamp-1">{port.title}</h3>
                              <p className="text-[10px] text-slate-500 dark:text-gray-400 mb-3 line-clamp-3 leading-relaxed flex-1">
                                {port.description}
                              </p>

                              {/* Tags */}
                              <div className="flex flex-wrap gap-1 mb-3">
                                {port.tags && port.tags.map((tag) => (
                                  <span key={tag} className="px-1.5 py-0.5 bg-sky-50 dark:bg-sky-900/30 text-[#0ea5e9] dark:text-sky-300 border border-sky-100 dark:border-sky-800/50 rounded text-[8px] font-bold">
                                    {tag}
                                  </span>
                                ))}
                              </div>

                              {/* Action Buttons */}
                              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                                <a href={port.repo_url || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 py-1.5 bg-white dark:bg-transparent border border-slate-200 text-slate-600 dark:text-gray-300 hover:text-[#0ea5e9] hover:border-[#0ea5e9] rounded text-[9px] font-extrabold transition-colors">
                                  Github
                                </a>
                                <a href={port.demo_url || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 py-1.5 bg-[#0ea5e9] hover:bg-[#0284c7] text-white rounded text-[9px] font-extrabold transition-colors">
                                  Demo
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* List View */
                      <div className="border border-slate-100 dark:border-slate-850 rounded-lg overflow-hidden bg-[var(--bg-secondary)] shadow-sm">
                        <div className="overflow-x-auto">
                          <table className="w-full min-w-[700px] text-left border-collapse table-fixed">
                            <thead>
                              <tr className="bg-slate-50 dark:bg-slate-800/40 text-[8px] font-black text-slate-400 dark:text-gray-500 border-b border-slate-100 dark:border-slate-800/60 uppercase tracking-wider">
                                <th className="py-1.5 px-3 w-[10%]">Pratayang</th>
                                <th className="py-1.5 px-3 w-[35%]">Nama Proyek</th>
                                <th className="py-1.5 px-3 w-[15%]">Status</th>
                                <th className="py-1.5 px-3 w-[25%]">Teknologi</th>
                                <th className="py-1.5 px-3 w-[15%] text-center">Aksi</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                              {groupedPorts.completed.map((port) => (
                                <tr key={port.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors text-[11px] text-slate-700 dark:text-gray-300">
                                  <td className="py-1.5 px-3">
                                    <div className="w-9 h-6 rounded border border-slate-150 dark:border-slate-800 overflow-hidden relative flex items-center justify-center bg-slate-100 dark:bg-slate-900">
                                      {port.image_url ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={port.image_url} alt={port.title} className="w-full h-full object-cover" />
                                      ) : (
                                        <svg className="w-3.5 h-3.5 opacity-30 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                        </svg>
                                      )}
                                    </div>
                                  </td>
                                  <td className="py-1.5 px-3 font-semibold text-slate-800 dark:text-white">
                                    <div className="truncate" title={port.title}>{port.title}</div>
                                  </td>
                                  <td className="py-1.5 px-3 text-teal-600 dark:text-teal-400 font-bold">
                                    Selesai
                                  </td>
                                  <td className="py-1.5 px-3 text-slate-500 dark:text-gray-400">
                                    <div className="truncate" title={port.tags ? port.tags.join(', ') : ''}>
                                      {port.tags ? port.tags.join(', ') : '-'}
                                    </div>
                                  </td>
                                  <td className="py-1.5 px-3 text-center">
                                    <div className="flex justify-center gap-1.5">
                                      <a href={port.repo_url || '#'} target="_blank" rel="noopener noreferrer" className="px-2 py-0.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[9px] font-black rounded hover:text-[#0ea5e9] transition-colors">
                                        Repo
                                      </a>
                                      <a href={port.demo_url || '#'} target="_blank" rel="noopener noreferrer" className="px-2 py-0.5 bg-blue-50 hover:bg-blue-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-blue-600 dark:text-blue-400 text-[9px] font-black rounded transition-colors">
                                        Demo
                                      </a>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* 2. Proyek Sedang Berjalan */}
            {groupedPorts.progress.length > 0 && (
              <div className="scroll-mt-32">
                {/* Folder Header */}
                <div
                  onClick={() => toggleSection('progress')}
                  className="flex items-center gap-1.5 mb-2.5 cursor-pointer hover:opacity-85 select-none group"
                >
                  <svg
                    className={`w-3.5 h-3.5 text-slate-400 dark:text-gray-500 transition-transform duration-200 ${
                      collapsedSections.progress ? '-rotate-90' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                  <svg className="w-4 h-4 text-[#eab308] shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                  </svg>
                  <h2 className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-white tracking-tight">
                    Sedang Berjalan
                  </h2>
                  <div className="h-[1px] bg-slate-100 dark:bg-slate-800/50 flex-1 rounded-full" />
                  <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-gray-400 text-[9px] font-bold rounded border border-slate-200/50 dark:border-slate-700/50">
                    {groupedPorts.progress.length}
                  </span>
                </div>

                {!collapsedSections.progress && (
                  <>
                    {viewMode === 'grid' ? (
                      /* Grid View */
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {groupedPorts.progress.map((port) => (
                          <div key={port.id} className="group bg-[var(--bg-secondary)] rounded-lg border border-slate-100 dark:border-slate-800/80 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col">
                            {/* Pratayang Image */}
                            <div className="w-full h-28 overflow-hidden relative bg-slate-100 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800/50">
                              {port.image_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={port.image_url} alt={port.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-850 dark:to-slate-900 opacity-60">
                                  <svg className="w-8 h-8 opacity-30 text-slate-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                                  </svg>
                                </div>
                              )}
                              <span className="absolute top-2 left-2 px-2 py-0.5 bg-amber-100/90 text-amber-700 text-[8px] font-black rounded-full ring-1 ring-inset ring-amber-600/20 shadow-sm flex items-center gap-1">
                                <span className="w-1 h-1 rounded-full bg-amber-500 animate-pulse"></span>
                                Dalam Proses
                              </span>
                            </div>

                            {/* Content */}
                            <div className="p-3 flex flex-col flex-1">
                              <h3 className="font-bold text-slate-800 dark:text-white text-xs mb-1 line-clamp-1">{port.title}</h3>
                              <p className="text-[10px] text-slate-500 dark:text-gray-400 mb-3 line-clamp-3 leading-relaxed flex-1">
                                {port.description}
                              </p>

                              {/* Tags */}
                              <div className="flex flex-wrap gap-1 mb-3">
                                {port.tags && port.tags.map((tag) => (
                                  <span key={tag} className="px-1.5 py-0.5 bg-sky-50 dark:bg-sky-900/30 text-[#0ea5e9] dark:text-sky-300 border border-sky-100 dark:border-sky-800/50 rounded text-[8px] font-bold">
                                    {tag}
                                  </span>
                                ))}
                              </div>

                              {/* Action Buttons */}
                              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                                <a href={port.repo_url || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 py-1.5 bg-white dark:bg-transparent border border-slate-200 text-slate-600 dark:text-gray-300 hover:text-[#0ea5e9] hover:border-[#0ea5e9] rounded text-[9px] font-extrabold transition-colors">
                                  Github
                                </a>
                                <a href={port.demo_url || '#'} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 py-1.5 bg-[#0ea5e9] hover:bg-[#0284c7] text-white rounded text-[9px] font-extrabold transition-colors">
                                  Demo
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      /* List View */
                      <div className="border border-slate-100 dark:border-slate-850 rounded-lg overflow-hidden bg-[var(--bg-secondary)] shadow-sm">
                        <div className="overflow-x-auto">
                          <table className="w-full min-w-[700px] text-left border-collapse table-fixed">
                            <thead>
                              <tr className="bg-slate-50 dark:bg-slate-800/40 text-[8px] font-black text-slate-400 dark:text-gray-500 border-b border-slate-100 dark:border-slate-800/60 uppercase tracking-wider">
                                <th className="py-1.5 px-3 w-[10%]">Pratayang</th>
                                <th className="py-1.5 px-3 w-[35%]">Nama Proyek</th>
                                <th className="py-1.5 px-3 w-[15%]">Status</th>
                                <th className="py-1.5 px-3 w-[25%]">Teknologi</th>
                                <th className="py-1.5 px-3 w-[15%] text-center">Aksi</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                              {groupedPorts.progress.map((port) => (
                                <tr key={port.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/20 transition-colors text-[11px] text-slate-700 dark:text-gray-300">
                                  <td className="py-1.5 px-3">
                                    <div className="w-9 h-6 rounded border border-slate-150 dark:border-slate-800 overflow-hidden relative flex items-center justify-center bg-slate-100 dark:bg-slate-900">
                                      {port.image_url ? (
                                        // eslint-disable-next-line @next/next/no-img-element
                                        <img src={port.image_url} alt={port.title} className="w-full h-full object-cover" />
                                      ) : (
                                        <svg className="w-3.5 h-3.5 opacity-30 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                          <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                                        </svg>
                                      )}
                                    </div>
                                  </td>
                                  <td className="py-1.5 px-3 font-semibold text-slate-800 dark:text-white">
                                    <div className="truncate" title={port.title}>{port.title}</div>
                                  </td>
                                  <td className="py-1.5 px-3 text-amber-600 dark:text-amber-400 font-bold">
                                    Dalam Proses
                                  </td>
                                  <td className="py-1.5 px-3 text-slate-500 dark:text-gray-400">
                                    <div className="truncate" title={port.tags ? port.tags.join(', ') : ''}>
                                      {port.tags ? port.tags.join(', ') : '-'}
                                    </div>
                                  </td>
                                  <td className="py-1.5 px-3 text-center">
                                    <div className="flex justify-center gap-1.5">
                                      <a href={port.repo_url || '#'} target="_blank" rel="noopener noreferrer" className="px-2 py-0.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[9px] font-black rounded hover:text-[#0ea5e9] transition-colors">
                                        Repo
                                      </a>
                                      <a href={port.demo_url || '#'} target="_blank" rel="noopener noreferrer" className="px-2 py-0.5 bg-blue-50 hover:bg-blue-100 dark:bg-slate-800 dark:hover:bg-slate-750 text-blue-600 dark:text-blue-400 text-[9px] font-black rounded transition-colors">
                                        Demo
                                      </a>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
