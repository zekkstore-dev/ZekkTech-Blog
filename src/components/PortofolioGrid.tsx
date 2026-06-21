'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Portfolio } from '@/types/portfolio';

interface PortofolioGridProps {
  portfolios: Portfolio[];
  maxItems?: number;
  showViewAll?: boolean;
  viewAllHref?: string;
  title?: string;
  isCompact?: boolean;
  expandOnClick?: boolean;
}

export default function PortofolioGrid({
  portfolios,
  maxItems = 6,
  showViewAll = true,
  viewAllHref = '/portofolio',
  title = 'Portofolio',
  isCompact = false,
  expandOnClick = false,
}: PortofolioGridProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const displayPortfolios = isExpanded ? portfolios : portfolios.slice(0, maxItems);
  const hasMore = portfolios.length > maxItems && !isExpanded;
  const remainingCount = portfolios.length - maxItems;

  if (portfolios.length === 0) {
    return (
      <div className="bg-[var(--bg-secondary)] rounded-2xl border border-slate-100 dark:border-slate-800 p-6 text-center">
        <p className="text-sm text-slate-500 dark:text-gray-400">Belum ada portofolio.</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-secondary)] rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-[#0ea5e9]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">{title}</h3>
        </div>
        <span className="text-xs text-slate-500 dark:text-gray-400">
          {portfolios.length} Proyek
        </span>
      </div>

      {/* Grid */}
      <div className={`p-4 ${isCompact ? 'grid grid-cols-2 sm:grid-cols-3 gap-3' : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'}`}>
        {displayPortfolios.map((port) => (
          <div
            key={port.id}
            className="group bg-[var(--bg-primary)] rounded-xl border border-slate-100 dark:border-slate-800/80 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 flex flex-col"
          >
            {/* Thumbnail */}
            <div className={`w-full overflow-hidden relative bg-slate-100 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800/50 ${isCompact ? 'h-20' : 'h-28'}`}>
              {port.image_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={port.image_url}
                  alt={port.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-850 dark:to-slate-900 opacity-60">
                  <svg className={`opacity-30 text-slate-400 ${isCompact ? 'w-6 h-6' : 'w-8 h-8'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                  </svg>
                </div>
              )}
              {/* Status Badge */}
              <span className={`absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-full text-[7px] font-black ring-1 ring-inset shadow-sm flex items-center gap-0.5 ${
                port.status === 'progress'
                  ? 'bg-amber-100/90 text-amber-700 ring-amber-600/20'
                  : 'bg-teal-100/90 text-teal-700 ring-teal-600/20'
              }`}>
                <span className={`w-1 h-1 rounded-full ${port.status === 'progress' ? 'bg-amber-500 animate-pulse' : 'bg-teal-500'}`}></span>
                {port.status === 'progress' ? 'Progress' : 'Selesai'}
              </span>
            </div>

            {/* Content */}
            <div className={`flex flex-col flex-1 ${isCompact ? 'p-2' : 'p-3'}`}>
              <h4 className={`font-bold text-slate-800 dark:text-white line-clamp-1 ${isCompact ? 'text-[10px] mb-0.5' : 'text-xs mb-1'}`}>
                {port.title}
              </h4>
              {!isCompact && (
                <p className="text-[10px] text-slate-500 dark:text-gray-400 mb-2 line-clamp-2 leading-relaxed flex-1">
                  {port.description}
                </p>
              )}
              
              {/* Tags - only show first 2 in compact mode */}
              <div className="flex flex-wrap gap-1 mb-2">
                {port.tags?.slice(0, isCompact ? 2 : 3).map((tag) => (
                  <span key={tag} className={`px-1.5 py-0.5 bg-sky-50 dark:bg-sky-900/30 text-[#0ea5e9] dark:text-sky-300 border border-sky-100 dark:border-sky-800/50 rounded text-[7px] font-bold`}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action Buttons */}
              <div className={`grid grid-cols-2 gap-1.5 pt-2 border-t border-slate-100 dark:border-slate-800/60 ${isCompact ? 'mt-auto' : ''}`}>
                <a
                  href={port.repo_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center bg-white dark:bg-transparent border border-slate-200 text-slate-600 dark:text-gray-300 hover:text-[#0ea5e9] hover:border-[#0ea5e9] rounded font-extrabold transition-colors ${isCompact ? 'py-1 text-[8px]' : 'py-1.5 text-[9px]'}`}
                >
                  Github
                </a>
                <a
                  href={port.demo_url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center bg-[#0ea5e9] hover:bg-[#0284c7] text-white rounded font-extrabold transition-colors ${isCompact ? 'py-1 text-[8px]' : 'py-1.5 text-[9px]'}`}
                >
                  Demo
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* View All Card - Centered below the grid */}
      {hasMore && showViewAll && (
        <div className="flex justify-center p-4 pt-0 pb-6">
          <Link
            href={viewAllHref}
            onClick={(e) => {
              if (expandOnClick) {
                e.preventDefault();
                setIsExpanded(true);
              }
            }}
            className="group flex items-center justify-center gap-2 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-700 hover:border-[#0ea5e9] dark:hover:border-[#0ea5e9] hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all duration-300 py-3 px-6 w-full max-w-xs"
          >
            <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-3 h-3 text-[#0ea5e9]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </div>
            <span className="text-xs font-bold text-slate-600 dark:text-gray-300 group-hover:text-[#0ea5e9] transition-colors">
              Lihat {remainingCount} Lainnya ({portfolios.length} Proyek)
            </span>
          </Link>
        </div>
      )}
    </div>
  );
}