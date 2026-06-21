import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="w-full bg-[#1a1a2e] text-gray-300">
      <div className="max-w-[1440px] mx-auto px-6 lg:px-24 pt-10 pb-6 md:pt-16 md:pb-8">
        {/* Main footer grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-10 lg:gap-12 mb-8 md:mb-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block mb-3">
              <Image src="/images/ZekkTech.png" alt="ZekkTech" width={110} height={28} className="h-[28px] w-auto brightness-0 invert" />
            </Link>
            <p className="text-[13px] sm:text-[14px] text-gray-400 mb-4">
              ZekkTech Blog by <span className="text-blue-400 font-medium"><a href="https://github.com/ZekkCode">ZakariaMP</a></span>
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-2.5">
              {/* Github */}
              <a href="https://github.com/ZekkCode" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-blue-500/30 transition-colors" aria-label="GitHub">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </a>
              {/* Behance */}
              <a href="https://www.behance.net/zakariamp" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-blue-500/30 transition-colors" aria-label="Behance">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor" className="text-gray-400">
                  <path d="M4.654 3c.461 0 .887.035 1.278.14.39.07.711.216.996.391s.497.426.641.747c.14.32.216.711.216 1.137 0 .496-.106.922-.356 1.242-.215.32-.566.606-.997.817.606.176 1.067.496 1.348.922s.461.957.461 1.563c0 .496-.105.922-.285 1.278a2.3 2.3 0 0 1-.782.887c-.32.215-.711.39-1.137.496a5.3 5.3 0 0 1-1.278.176L0 12.803V3zm-.285 3.978c.39 0 .71-.105.957-.285.246-.18.355-.497.355-.887 0-.216-.035-.426-.105-.567a1 1 0 0 0-.32-.355 1.8 1.8 0 0 0-.461-.176c-.176-.035-.356-.035-.567-.035H2.17v2.31c0-.005 2.2-.005 2.2-.005zm.105 4.193c.215 0 .426-.035.606-.07.176-.035.356-.106.496-.216s.25-.215.356-.39c.07-.176.14-.391.14-.641 0-.496-.14-.852-.426-1.102-.285-.215-.676-.32-1.137-.32H2.17v2.734h2.305zm6.858-.035q.428.427 1.278.426c.39 0 .746-.106 1.032-.286q.426-.32.53-.64h1.74c-.286.851-.712 1.457-1.278 1.848-.566.355-1.243.566-2.06.566a4.1 4.1 0 0 1-1.527-.285 2.8 2.8 0 0 1-1.137-.782 2.85 2.85 0 0 1-.712-1.172c-.175-.461-.25-.957-.25-1.528 0-.531.07-1.032.25-1.493.18-.46.426-.852.747-1.207.32-.32.711-.606 1.137-.782a4 4 0 0 1 1.493-.285c.606 0 1.137.105 1.598.355.46.25.817.532 1.102.958.285.39.496.851.641 1.348.07.496.105.996.07 1.563h-5.15c0 .58.21 1.11.496 1.396m2.24-3.732c-.25-.25-.642-.391-1.103-.391-.32 0-.566.07-.781.176s-.356.25-.496.39a.96.96 0 0 0-.25.497c-.036.175-.07.32-.07.46h3.196c-.07-.526-.25-.882-.497-1.132zm-3.127-3.728h3.978v.957h-3.978z" />
                </svg>
              </a>
              {/* Instagram */}
              <a href="https://www.instagram.com/zekksparow" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-blue-500/30 transition-colors" aria-label="Instagram">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="https://www.linkedin.com/in/xakriamp" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center hover:bg-blue-500/30 transition-colors" aria-label="LinkedIn">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Category */}
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white mb-3 sm:mb-5 uppercase tracking-wider">Kategori</h3>
            <ul className="space-y-2 sm:space-y-3">
              {['Berita Teknologi', 'Tutorial Teknologi', 'Template', 'Tips & Trik'].map((item) => (
                <li key={item}>
                  <Link href={`/blog?search=${encodeURIComponent(item)}`} className="text-[13px] sm:text-[14px] text-gray-400 hover:text-blue-400 transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Me */}
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white mb-3 sm:mb-5 uppercase tracking-wider">Tentang Saya</h3>
            <ul className="space-y-2 sm:space-y-3">
              {[
                { name: 'Profil Penulis', url: '/about#profil' },
                { name: 'Portofolio', url: '/about#portofolio' },
                { name: 'Hubungi Kami', url: '/about#contact' }
              ].map((item) => (
                <li key={item.name}>
                  <Link href={item.url} className="text-[13px] sm:text-[14px] text-gray-400 hover:text-blue-400 transition-colors">{item.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white mb-3 sm:mb-5 uppercase tracking-wider">Hubungi Saya</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a href="https://wa.me/62881081772005" className="text-[13px] sm:text-[14px] text-gray-400 hover:text-blue-400 transition-colors">0881081772005</a>
              </li>
              <li>
                <a href="mailto:zakariamujur6@gmail.com" className="text-[13px] sm:text-[14px] text-gray-400 hover:text-blue-400 transition-colors break-all">zakariamujur6@gmail.com</a>
              </li>
            </ul>
          </div>

          {/* Follow Me */}
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white mb-3 sm:mb-5 uppercase tracking-wider">Ikuti Saya</h3>
            <ul className="space-y-2 sm:space-y-3">
              {[
                { name: 'LinkedIn', url: 'https://www.linkedin.com/in/zakariamp' },
                { name: 'Instagram', url: 'https://www.instagram.com/zekksparow' },
                { name: 'GitHub', url: 'https://github.com/ZekkCode' },
                { name: 'Behance', url: 'https://www.behance.net/zakariamp' }
              ].map((item) => (
                <li key={item.name}>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-[13px] sm:text-[14px] text-gray-400 hover:text-blue-400 transition-colors">{item.name}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 mb-4 sm:mb-6" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-3">
          <p className="text-[11px] sm:text-[13px] text-gray-500">© {new Date().getFullYear()} | <a href="https://github.com/ZekkCode">ZakariaMP</a></p>
          <p className="text-[11px] sm:text-[13px] text-gray-500">Build with ☕ &amp; ❤️ eaa</p>
        </div>
      </div>
    </footer>
  );
}
