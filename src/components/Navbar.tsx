'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-24 h-[86px] flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="shrink-0">
          <Image src="/images/ZekkTech.png" alt="ZekkTech" width={140} height={36} className="h-[36px] w-auto" priority />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-2">
          <div className="flex items-center gap-8 mr-8">
            <Link href="/" className="text-[16px] font-medium text-gray-900 hover:text-blue-500 transition-colors">
              Home
            </Link>
            <Link href="/#kategori" className="text-[16px] font-medium text-gray-600 hover:text-blue-500 transition-colors">
              Category
            </Link>
            <Link href="/#about" className="text-[16px] font-medium text-gray-600 hover:text-blue-500 transition-colors">
              About Me
            </Link>
            <button className="flex items-center gap-2 text-[16px] font-medium text-gray-600 hover:text-blue-500 transition-colors">
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-current">
                <path d="M12.2 12.2L15.5 15.5M14 7.5C14 4.186 11.314 1.5 8 1.5C4.686 1.5 2 4.186 2 7.5C2 10.814 4.686 13.5 8 13.5C11.314 13.5 14 10.814 14 7.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
              Search
            </button>
          </div>
          <a
            href="https://buymeacoffee.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-full text-[14px] font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98]"
          >
            <Image src="/images/simple-icons_buymeacoffee.svg" alt="Coffee" width={20} height={20} />
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
          <Link href="/" className="block text-[16px] font-medium text-gray-900" onClick={() => setMobileOpen(false)}>Home</Link>
          <Link href="/#kategori" className="block text-[16px] font-medium text-gray-600" onClick={() => setMobileOpen(false)}>Category</Link>
          <Link href="/#about" className="block text-[16px] font-medium text-gray-600" onClick={() => setMobileOpen(false)}>About Me</Link>
          <a
            href="https://buymeacoffee.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-500 text-white px-5 py-2.5 rounded-full text-[14px] font-semibold"
          >
            <Image src="/images/simple-icons_buymeacoffee.svg" alt="Coffee" width={20} height={20} />
            Buy Me A Coffee
          </a>
        </div>
      )}
    </nav>
  );
}
