'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const router = useRouter();

  // ambil riwayat pencarian dari localStorage pas pertama kali nge-mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('zekktech_search_history');
      if (saved) setSearchHistory(JSON.parse(saved));
    } catch {
      /* ignore */
    }
  }, []);

  const handleSearch = (e: React.FormEvent, directQuery?: string) => {
    e?.preventDefault();
    const query = (directQuery ?? searchQuery).trim();
    if (query) {
      // simpen histori pencarian (maks 2 biji)
      let newHistory = [query, ...searchHistory.filter(h => h !== query)];
      newHistory = newHistory.slice(0, 2);
      
      setSearchHistory(newHistory);
      localStorage.setItem('zekktech_search_history', JSON.stringify(newHistory));
      
      router.push(`/blog?search=${encodeURIComponent(query)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-24 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image src="/images/ZekkTech.png" alt="ZekkTech" width={120} height={30} className="h-[30px] w-auto" priority />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2">
          <div className="flex items-center gap-5 mr-6">
            <Link href="/" className="text-[14px] font-medium text-gray-900 hover:text-blue-500 transition-colors">
              Home
            </Link>
            <Link href="/blog" className="text-[14px] font-medium text-gray-600 hover:text-blue-500 transition-colors">
              Artikel
            </Link>
            <Link href="/#kategori" className="text-[14px] font-medium text-gray-600 hover:text-blue-500 transition-colors">
              Kategori
            </Link>
            <Link href="/about" className="text-[14px] font-medium text-gray-600 hover:text-blue-500 transition-colors">
              Tentang Saya
            </Link>
            <div className="relative flex items-center">
              {searchOpen ? (
                <div className="relative z-50 flex flex-col items-end">
                  <form onSubmit={handleSearch} className="flex items-center shadow-sm rounded-md bg-white border border-gray-200">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Ketik & Enter..."
                      autoFocus
                      className="h-9 px-4 w-48 lg:w-64 text-sm focus:outline-none bg-transparent"
                    />
                    <button type="submit" className="h-9 px-3 text-gray-400 hover:text-blue-500 transition-colors">
                      <svg width="15" height="15" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-current"><path d="M12.2 12.2L15.5 15.5M14 7.5C14 4.186 11.314 1.5 8 1.5C4.686 1.5 2 4.186 2 7.5C2 10.814 4.686 13.5 8 13.5C11.314 13.5 14 10.814 14 7.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
                    </button>
                    <button type="button" onClick={() => setSearchOpen(false)} className="h-9 px-3 border-l border-gray-100 text-gray-400 hover:text-red-500 transition-colors">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                  </form>
                  {searchHistory.length > 0 && (
                    <div className="absolute top-full right-0 mt-2 w-full bg-white border border-gray-100 shadow-xl rounded-lg py-2 px-1 z-[100] animate-in fade-in">
                      <div className="px-3 pb-2 pt-1 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50 mb-1">
                        Riwayat Pencarian
                      </div>
                      {searchHistory.map((h, i) => (
                        <button
                          key={i}
                          onClick={(e) => handleSearch(e, h)}
                          className="w-full text-left px-3 py-1.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-md flex items-center gap-2 transition-colors"
                        >
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                          <span className="truncate">{h}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={() => setSearchOpen(true)} className="flex items-center gap-2 text-[14px] font-medium text-gray-600 hover:text-blue-500 transition-colors">
                  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-current">
                    <path d="M12.2 12.2L15.5 15.5M14 7.5C14 4.186 11.314 1.5 8 1.5C4.686 1.5 2 4.186 2 7.5C2 10.814 4.686 13.5 8 13.5C11.314 13.5 14 10.814 14 7.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                  Cari
                </button>
              )}
            </div>
          </div>
          <a
            href="https://buymeacoffee.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full text-[13px] font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98]"
          >
            <Image src="/images/simple-icons_buymeacoffee.svg" alt="Coffee" width={16} height={16} />
            Buy Me A Coffee
          </a>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-gray-900 transition-transform ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`block w-6 h-0.5 bg-gray-900 transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`block w-6 h-0.5 bg-gray-900 transition-transform ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-6 space-y-4 animate-in slide-in-from-top-2">
          <Link href="/" className="block text-[14px] font-medium text-gray-900" onClick={() => setMobileOpen(false)}>Home</Link>
          <Link href="/blog" className="block text-[14px] font-medium text-gray-600" onClick={() => setMobileOpen(false)}>Artikel</Link>
          <Link href="/#kategori" className="block text-[14px] font-medium text-gray-600" onClick={() => setMobileOpen(false)}>Kategori</Link>
          <Link href="/about" className="block text-[14px] font-medium text-gray-600" onClick={() => setMobileOpen(false)}>Tentang Saya</Link>
          <a
            href="https://buymeacoffee.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-full text-[13px] font-semibold"
          >
            <Image src="/images/simple-icons_buymeacoffee.svg" alt="Coffee" width={16} height={16} />
            Buy Me A Coffee
          </a>
        </div>
      )}
    </nav>
  );
}
