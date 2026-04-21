import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="w-full bg-[#1a1a2e] text-gray-300">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-24 pt-16 pb-8">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-4">
              <Image src="/images/ZekkTech.png" alt="ZekkTech" width={120} height={30} className="h-[30px] w-auto brightness-0 invert" />
            </Link>
            <p className="text-[14px] text-gray-400 mb-5">
              ZekkTech Blog by <span className="text-blue-400 font-medium"><a href="https://github.com/ZekkCode">ZakariaMP</a></span>
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              {/* Github */}
              <a href="https://github.com/ZekkCode" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-blue-500/30 transition-colors" aria-label="GitHub">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              {/* Behance */}
              <a href="https://www.behance.net/zakariamp" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-blue-500/30 transition-colors" aria-label="Behance">
                <svg width="18" height="18" viewBox="0 0 512 512" fill="currentColor" className="text-gray-400">
                  <path d="M232 237.2c31.8-15.2 48.4-38.2 48.4-74 0-70.6-52.6-87.8-113.3-87.8H0v354.4h171.8c64.4 0 124.9-30.9 124.9-102.9 0-44.5-21.1-77.4-64.7-89.7zM68.3 135h79.5c35.6 0 53.6 12.1 53.6 36 0 24.1-15 36.3-51.5 36.3H68.3zM234.3 358c0 29.7-21.5 41.5-62.8 41.5H68.3V264h101.4c38.2 0 64.6 13.9 64.6 44.4v49.6zM464.3 194.2h-74v19.4h74zm-37.5 37.5c-42.3 0-73.6 29.5-73.6 77 0 49.3 33.3 78 77.2 78 35.8 0 63.6-16.7 70.3-50.5h-38.2c-2.3 12.3-13.6 18-28.7 18-20 0-33.6-11.4-36.2-34.8h106.8c1.3-43.6-15.1-87.7-77.6-87.7zm-35.8 55c2.3-17.6 14.5-24.8 33-24.8 19.3 0 31.2 8.5 33.4 24.8z" />
                </svg>
              </a>
              {/* Instagram */}
              <a href="https://www.instagram.com/zekksparow" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-blue-500/30 transition-colors" aria-label="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="https://www.linkedin.com/in/xakriamp" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-blue-500/30 transition-colors" aria-label="LinkedIn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Category */}
          <div>
            <h3 className="text-sm font-bold text-white mb-5 uppercase tracking-wider">Kategori</h3>
            <ul className="space-y-3">
              {['Berita Teknologi', 'Tutorial Teknologi', 'Template', 'Tips & Trik'].map((item) => (
                <li key={item}>
                  <Link href={`/blog?search=${encodeURIComponent(item)}`} className="text-[14px] text-gray-400 hover:text-blue-400 transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Me */}
          <div>
            <h3 className="text-sm font-bold text-white mb-5 uppercase tracking-wider">Tentang Saya</h3>
            <ul className="space-y-3">
              {[
                { name: 'Profil Penulis', url: '/about#profil' },
                { name: 'Portofolio', url: '/about#portofolio' },
                { name: 'Hubungi Kami', url: '/about#contact' }
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.url} className="text-[14px] text-gray-400 hover:text-blue-400 transition-colors">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-sm font-bold text-white mb-5 uppercase tracking-wider">Hubungi Saya</h3>
            <ul className="space-y-3">
              <li>
                <a href="https://wa.me/62881081772005" className="text-[14px] text-gray-400 hover:text-blue-400 transition-colors">0881081772005</a>
              </li>
              <li>
                <a href="mailto:zakariamujur6@gmail.com" className="text-[14px] text-gray-400 hover:text-blue-400 transition-colors break-all">zakariamujur6@gmail.com</a>
              </li>
            </ul>
          </div>

          {/* Follow Me */}
          <div>
            <h3 className="text-sm font-bold text-white mb-5 uppercase tracking-wider">Ikuti Saya</h3>
            <ul className="space-y-3">
              {[
                { name: 'LinkedIn', url: 'https://www.linkedin.com/in/zakariamp' },
                { name: 'Instagram', url: 'https://www.instagram.com/zekksparow' },
                { name: 'GitHub', url: 'https://github.com/ZekkCode' },
                { name: 'Behance', url: 'https://www.behance.net/zakariamp' }
              ].map((item) => (
                <li key={item.name}>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-[14px] text-gray-400 hover:text-blue-400 transition-colors">{item.name}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 mb-6" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[13px] text-gray-500">© {new Date().getFullYear()} | <a href="https://github.com/ZekkCode">ZakariaMP</a></p>
          <p className="text-[13px] text-gray-500">Build with ☕ &amp; ❤️ eaa</p>
        </div>
      </div>
    </footer>
  );
}
