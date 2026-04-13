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
              Digitaldastin by <span className="text-blue-400 font-medium">ZakariaMP</span>
            </p>
            {/* Social icons */}
            <div className="flex items-center gap-3">
              {/* Medium */}
              <a href="#" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-blue-500/30 transition-colors" aria-label="Medium">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400">
                  <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zm7.42 0c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
                </svg>
              </a>
              {/* X / Twitter */}
              <a href="#" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-blue-500/30 transition-colors" aria-label="X">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              {/* Instagram */}
              <a href="#" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-blue-500/30 transition-colors" aria-label="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gray-400">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="#" className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center hover:bg-blue-500/30 transition-colors" aria-label="LinkedIn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-gray-400">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Category */}
          <div>
            <h3 className="text-sm font-bold text-white mb-5 uppercase tracking-wider">Category</h3>
            <ul className="space-y-3">
              {['Tips & Tricks', 'Technology News', 'Fun Facts', 'Tutorial', 'Other Categories'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-[14px] text-gray-400 hover:text-blue-400 transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Me */}
          <div>
            <h3 className="text-sm font-bold text-white mb-5 uppercase tracking-wider">About Me</h3>
            <ul className="space-y-3">
              {['About me', 'Project', 'Performance'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-[14px] text-gray-400 hover:text-blue-400 transition-colors">{item}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="text-sm font-bold text-white mb-5 uppercase tracking-wider">Contact Us</h3>
            <ul className="space-y-3">
              <li>
                <a href="tel:0881081772005" className="text-[14px] text-gray-400 hover:text-blue-400 transition-colors">0881081772005</a>
              </li>
              <li>
                <a href="mailto:zakariamujur6@gmail.com" className="text-[14px] text-gray-400 hover:text-blue-400 transition-colors break-all">zakariamujur6@gmail.com</a>
              </li>
            </ul>
          </div>

          {/* Follow Me */}
          <div>
            <h3 className="text-sm font-bold text-white mb-5 uppercase tracking-wider">Follow Me</h3>
            <ul className="space-y-3">
              {['LinkedIn', 'Instagram', 'GitHub', 'Behance'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-[14px] text-gray-400 hover:text-blue-400 transition-colors">{item}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-white/10 mb-6" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[13px] text-gray-500">© 2025 | ZakariaMP</p>
          <p className="text-[13px] text-gray-500">Made With Coffee &amp; Heart eaa</p>
        </div>
      </div>
    </footer>
  );
}
