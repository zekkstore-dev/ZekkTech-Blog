'use client';

import { useState } from 'react';

interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  start_date: string;
  end_date: string;
  description: string;
  type: string;
}

interface ExperienceTimelineProps {
  experiences: Experience[];
  title?: string;
}

export default function ExperienceTimeline({
  experiences,
  title = 'Pengalaman & Edukasi',
}: ExperienceTimelineProps) {
  const [activeTab, setActiveTab] = useState<'Semua' | 'Kerja' | 'Pendidikan' | 'Volunteers'>('Semua');

  const filteredExperiences = experiences.filter((exp) => {
    if (activeTab === 'Semua') return true;
    return exp.type === activeTab;
  });

  const tabs: ('Semua' | 'Pendidikan' | 'Kerja' | 'Volunteers')[] = ['Semua', 'Pendidikan', 'Kerja', 'Volunteers'];

  // Helper icons
  const getIcon = (type: string) => {
    if (type === 'Pendidikan') {
      return (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
        </svg>
      );
    }
    if (type === 'Volunteers') {
      return (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      );
    }
    // Default: Kerja
    return (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    );
  };

  return (
    <div className="bg-[var(--bg-secondary)] rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 gap-4">
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4 text-[#0ea5e9]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10"></circle>
            <polyline points="12 6 12 12 16 14"></polyline>
          </svg>
          <h3 className="text-sm font-bold text-slate-800 dark:text-white">{title}</h3>
        </div>

        {/* Tab Controls */}
        <div className="flex flex-wrap gap-1 bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg text-xs">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-md font-bold transition-all ${
                activeTab === tab
                  ? 'bg-white dark:bg-slate-700 text-[#0ea5e9] shadow-sm'
                  : 'text-slate-500 dark:text-gray-400 hover:text-slate-800 dark:hover:text-gray-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline List */}
      <div className="p-6">
        {filteredExperiences.length === 0 ? (
          <div className="text-center py-10 text-slate-500 dark:text-gray-400 text-xs">
            Tidak ada data untuk kategori &quot;{activeTab}&quot;.
          </div>
        ) : (
          <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-3 md:ml-4 pl-6 md:pl-8 space-y-8 py-2">
            {filteredExperiences.map((exp, idx) => {
              // Custom colors based on type
              const isPendidikan = exp.type === 'Pendidikan';
              const isVolunteer = exp.type === 'Volunteers';
              
              let dotBg = 'bg-blue-500 text-white';
              let badgeStyle = 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800/50';
              
              if (isPendidikan) {
                dotBg = 'bg-teal-500 text-white';
                badgeStyle = 'bg-teal-50 dark:bg-teal-900/20 text-teal-600 dark:text-teal-400 border-teal-100 dark:border-teal-800/50';
              } else if (isVolunteer) {
                dotBg = 'bg-rose-500 text-white';
                badgeStyle = 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-800/50';
              }

              return (
                <div key={exp.id} className="relative group">
                  {/* Timeline dot with icon */}
                  <div className={`absolute -left-[35px] md:-left-[43px] top-1.5 w-6 h-6 rounded-full flex items-center justify-center border-4 border-[var(--bg-secondary)] shadow-sm transition-transform duration-300 group-hover:scale-110 ${dotBg}`}>
                    {getIcon(exp.type)}
                  </div>

                  {/* Card Content */}
                  <div className="bg-[var(--bg-primary)] rounded-xl border border-slate-100 dark:border-slate-800/60 p-4 shadow-sm hover:shadow-md transition-all duration-300">
                    <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-white text-sm md:text-base leading-snug">
                          {exp.title}
                        </h4>
                        <p className="text-xs font-semibold text-slate-600 dark:text-gray-300 mt-0.5">
                          {exp.company} {exp.location ? `· ${exp.location}` : ''}
                        </p>
                      </div>

                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${badgeStyle}`}>
                        {exp.type}
                      </span>
                    </div>

                    <p className="text-[10px] text-slate-400 dark:text-gray-500 mb-3 font-medium">
                      {exp.start_date} — {exp.end_date}
                    </p>

                    {exp.description && (
                      <div className="text-xs text-slate-600 dark:text-gray-300 leading-relaxed whitespace-pre-line border-t border-slate-100 dark:border-slate-800/50 pt-2.5">
                        {exp.description}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
