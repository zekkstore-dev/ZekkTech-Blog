'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from './ThemeProvider';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  // ambil riwayat pencarian dari localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('zekktech_search_history');
      if (saved) setSearchHistory(JSON.parse(saved));
    } catch { /* ignore */ }
  }, []);

  // Ctrl+K shortcut untuk buka search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
        setMobileOpen(false);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // auto-focus input saat search terbuka
  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent, directQuery?: string) => {
    e?.preventDefault();
    const query = (directQuery ?? searchQuery).trim();
    if (query) {
      let newHistory = [query, ...searchHistory.filter(h => h !== query)];
      newHistory = newHistory.slice(0, 2);
      setSearchHistory(newHistory);
      localStorage.setItem('zekktech_search_history', JSON.stringify(newHistory));
      router.push(`/blog?search=${encodeURIComponent(query)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const SearchIcon = () => (
    <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-current">
      <path d="M12.2 12.2L15.5 15.5M14 7.5C14 4.186 11.314 1.5 8 1.5C4.686 1.5 2 4.186 2 7.5C2 10.814 4.686 13.5 8 13.5C11.314 13.5 14 10.814 14 7.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
    </svg>
  );

  return (
    <>
      <nav className="navbar-main sticky top-0 z-50 bg-[var(--bg-secondary)] border-b border-gray-100 shadow-sm transition-colors duration-300">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-24 h-[72px] flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="shrink-0">
            <Image
              src="/images/ZekkTech.png"
              alt="ZekkTech"
              width={120}
              height={30}
              className={`h-[30px] w-auto transition-all duration-300 ${theme === 'dark' ? 'brightness-0 invert' : ''}`}
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-5 mr-6">
              <Link href="/" className="text-[14px] font-medium text-gray-900 hover:text-blue-500 transition-colors">Home</Link>
              <Link href="/blog" className="text-[14px] font-medium text-gray-600 hover:text-blue-500 transition-colors">Artikel</Link>
              <Link href="/about" className="text-[14px] font-medium text-gray-600 hover:text-blue-500 transition-colors">Tentang Saya</Link>

              {/* Desktop Search */}
              <div className="relative flex items-center">
                {searchOpen ? (
                  <div className="relative z-50 flex flex-col items-end">
                    <form onSubmit={handleSearch} className="search-form flex items-center shadow-sm rounded-md bg-[var(--bg-secondary)] border border-gray-200 transition-colors">
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Ketik & Enter..."
                        autoFocus
                        className="h-9 px-4 w-48 lg:w-64 text-sm focus:outline-none bg-transparent text-[var(--text-primary)]"
                      />
                      <button type="submit" className="h-9 px-3 text-gray-400 hover:text-blue-500 transition-colors"><SearchIcon /></button>
                      <button type="button" onClick={() => setSearchOpen(false)} className="h-9 px-3 border-l border-gray-100 text-gray-400 hover:text-red-500 transition-colors">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                      </button>
                    </form>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setSearchOpen(true);
                      setTimeout(() => searchInputRef.current?.focus(), 100);
                    }}
                    className="flex items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800"
                  >
                    <SearchIcon />
                    <span className="text-[13px] font-medium">Cari</span>
                    <span className="text-[10px] bg-gray-100 dark:bg-slate-700 text-gray-400 px-1.5 py-0.5 rounded font-mono">^K</span>
                  </button>
                )}
              </div>
            </div>

            {/* Desktop Right (Theme & Button) */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                className="theme-toggle hover:bg-gray-50 dark:hover:bg-slate-800 transition-all"
                data-theme={theme}
                aria-label={theme === 'dark' ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
              >
                <svg className="sun-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
                <svg className="moon-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                </svg>
              </button>
              <a
                href="https://trakteer.id/zakariamp"
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 dark:bg-sky-500 dark:hover:bg-sky-600 text-white rounded-2xl text-[13px] font-bold shadow-sm flex items-center gap-2 hover:-translate-y-0.5 transition-all duration-300"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
                Trakteer
              </a>
            </div>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="theme-toggle hover:bg-gray-50 dark:hover:bg-slate-800 transition-all"
              data-theme={theme}
              aria-label={theme === 'dark' ? 'Aktifkan mode terang' : 'Aktifkan mode gelap'}
            >
              <svg className="sun-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
              <svg className="moon-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
              </svg>
            </button>
            <button className="flex flex-col gap-1.5 p-2" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Toggle menu">
              <span className={`hamburger-line block w-6 h-0.5 bg-gray-900 transition-transform ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`hamburger-line block w-6 h-0.5 bg-gray-900 transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`hamburger-line block w-6 h-0.5 bg-gray-900 transition-transform ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="mobile-menu md:hidden bg-[var(--bg-secondary)] border-t border-gray-100 px-6 py-6 space-y-4 animate-in slide-in-from-top-2 transition-colors">
            <Link href="/" className="block text-[14px] font-medium text-gray-900" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link href="/blog" className="block text-[14px] font-medium text-gray-600" onClick={() => setMobileOpen(false)}>Artikel</Link>
            <Link href="/about" className="block text-[14px] font-medium text-gray-600" onClick={() => setMobileOpen(false)}>Tentang Saya</Link>
            {/* Search di mobile menu */}
            <form onSubmit={(e) => { handleSearch(e); setMobileOpen(false); }} className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2 bg-[var(--bg-primary)]">
              <SearchIcon />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari artikel..."
                className="flex-1 text-sm bg-transparent focus:outline-none text-[var(--text-primary)] placeholder:text-gray-400"
              />
            </form>
            <a href="https://trakteer.id/zakariamp" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-full text-[13px] font-semibold">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z"/></svg>
              Trakteer
            </a>
          </div>
        )}
      </nav>

      {/* Floating Search Button — hanya mobile, muncul di tengah bawah */}
      <button
        onClick={() => { setSearchOpen(true); setMobileOpen(false); }}
        className="md:hidden fixed bottom-6 right-5 z-40 w-12 h-12 rounded-full bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-500/30 flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        aria-label="Cari artikel"
        title="Cari artikel"
      >
        <svg width="20" height="20" viewBox="0 0 17 17" fill="none">
          <path d="M12.2 12.2L15.5 15.5M14 7.5C14 4.186 11.314 1.5 8 1.5C4.686 1.5 2 4.186 2 7.5C2 10.814 4.686 13.5 8 13.5C11.314 13.5 14 10.814 14 7.5Z" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Full-screen Search Modal — mobile */}
      {searchOpen && (
        <div className="md:hidden fixed inset-0 z-[200] bg-black/60 backdrop-blur-sm flex flex-col" onClick={() => setSearchOpen(false)}>
          <div className="bg-[var(--bg-secondary)] shadow-xl p-4 animate-in slide-in-from-top-2" onClick={(e) => e.stopPropagation()}>
            <form onSubmit={handleSearch} className="flex items-center gap-3 border-2 border-blue-400 rounded-xl px-4 py-2">
              <svg width="18" height="18" viewBox="0 0 17 17" fill="none">
                <path d="M12.2 12.2L15.5 15.5M14 7.5C14 4.186 11.314 1.5 8 1.5C4.686 1.5 2 4.186 2 7.5C2 10.814 4.686 13.5 8 13.5C11.314 13.5 14 10.814 14 7.5Z" stroke="#3b82f6" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari artikel..."
                autoFocus
                className="flex-1 text-[15px] bg-transparent focus:outline-none text-[var(--text-primary)] placeholder:text-gray-400"
              />
              <button type="button" onClick={() => setSearchOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </form>
            {searchHistory.length > 0 && (
              <div className="mt-3 border-t border-gray-100 pt-3">
                <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Riwayat</p>
                {searchHistory.map((h, i) => (
                  <button key={i} onClick={(e) => handleSearch(e, h)} className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg flex items-center gap-2 transition-colors">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                    <span>{h}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
