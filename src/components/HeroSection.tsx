import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="relative w-full bg-white overflow-hidden">
      {/* Dot pattern background */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/images/Dot.svg)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'top center',
          backgroundSize: 'auto',
        }}
      />

      <div className="relative max-w-[1440px] mx-auto px-6 lg:px-24 pt-20 pb-10 min-h-[calc(100vh-86px)] flex flex-col">
        <div className="flex flex-col-reverse lg:flex-row items-center lg:items-start gap-5 lg:gap-5 flex-1">
          {/* Left content */}
          <div className="flex-1 max-w-[742px] pt-8 lg:pt-16">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-[1.15] tracking-tight mb-6">
              Hello World!,{' '}
              <br />
              <span className="lg:text-[40px]"> I&apos;m Zakaria MP{' '}</span>
              <span className="text-gray-900 lg:text-[35px]">a.k.a</span>{' '}
              <span className="text-blue-500 underline lg:text-[40px]"><a href="https://github.com/ZekkCode">Zekk</a> </span>
            </h1>

            <div className="flex items-stretch gap-3 mb-8">
              <div className="w-[3px] bg-blue-500 rounded-full shrink-0" />
              <p className="text-[15px] sm:text-[16px] text-gray-600 leading-relaxed max-w-[580px] font-bold">
                Di sini aku bakal share tentang teknologi, tips, trik, proyek,
                dan tutorial seru lainnya! Jangan lupa subscribe biar gak
                ketinggalan update terbaru!
              </p>
            </div>

            <form className="flex flex-col sm:flex-row gap-0 max-w-[650px]">
              <input
                type="email"
                placeholder="Masukkan email kamu di sini...."
                className="flex-1 h-[60px] sm:h-[67px] px-6 bg-gray-50 border-2 border-gray-200 rounded-xl sm:rounded-r-none sm:rounded-l-xl text-[15px] text-gray-700 placeholder:text-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
              />
              <button
                type="submit"
                className="h-[54px] sm:h-[67px] px-8 bg-blue-500 hover:bg-blue-600 text-white rounded-xl sm:rounded-l-none sm:rounded-r-xl text-[16px] font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] mt-3 sm:mt-0"
              >
                Subscribe
              </button>
            </form>
          </div>

          {/* Right illustration */}
          <div className="flex-shrink-0 w-[300px] sm:w-[400px] lg:w-[470px] mt-4 lg:mt-10">
            <Image
              src="/images/person-learn-coding.svg"
              alt="Person learning to code illustration"
              width={470}
              height={387}
              priority
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="flex justify-center mt-8 pb-4">
          <a href="#kategori" className="animate-bounce">
            <svg
              width="40"
              height="40"
              viewBox="0 0 40 40"
              fill="none"
              className="text-gray-400"
            >
              <circle cx="20" cy="20" r="19" stroke="currentColor" strokeWidth="2" />
              <path
                d="M14 17L20 23L26 17"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
