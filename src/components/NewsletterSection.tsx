import Image from 'next/image';

export default function NewsletterSection() {
  return (
    <section className="w-full bg-[#1a1a2e] py-16 sm:py-20">
      <div className="max-w-[708px] mx-auto px-6 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-[100px] h-[100px] sm:w-[130px] sm:h-[130px] rounded-full bg-blue-500/20 flex items-center justify-center">
            <Image
              src="/images/subscribe-letter-email.png"
              alt="Subscribe to newsletter"
              width={80}
              height={107}
              className="w-[60px] sm:w-[80px] h-auto object-contain"
            />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl lg:text-[36px] font-extrabold text-white leading-tight mb-3">
          Berlangganan Untuk Pembaruan Terbaru
        </h2>
        <p className="text-[14px] sm:text-[16px] text-gray-400 mb-8 max-w-[600px] mx-auto">
          Berlangganan konten dan jangan pernah ketinggalan postingan baru.
        </p>

        {/* Form */}
        <form className="flex flex-col sm:flex-row gap-0 max-w-[708px] mx-auto">
          <input
            type="email"
            placeholder="Masukkan email Anda di sini...."
            className="flex-1 h-[56px] sm:h-[67px] px-6 bg-white/10 border-2 border-white/20 rounded-xl sm:rounded-r-none sm:rounded-l-xl text-[15px] text-white placeholder:text-gray-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all backdrop-blur-sm"
          />
          <button
            type="submit"
            className="h-[50px] sm:h-[67px] px-10 bg-blue-500 hover:bg-blue-600 text-white rounded-xl sm:rounded-l-none sm:rounded-r-xl text-[16px] font-semibold transition-all hover:shadow-lg hover:shadow-blue-500/30 active:scale-[0.98] mt-3 sm:mt-0"
          >
            Berlangganan
          </button>
        </form>
      </div>
    </section>
  );
}
