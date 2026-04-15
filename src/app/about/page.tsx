import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Image from 'next/image';

export const metadata = {
  title: 'Tentang Saya | ZekkTech',
  description: 'Artikel dan halaman tentang profil kreator ZekkTech Blog.',
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      <article className="max-w-[720px] mx-auto px-6 py-10 sm:py-16">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold text-gray-900 leading-tight mb-8 text-center">
          Tentang Kreator
        </h1>
        
        {/* Image / Illustration */}
        <div className="w-full h-auto max-h-[400px] rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center p-8 mb-10 border border-gray-100">
          <Image
            src="/images/person-learn-coding.svg"
            alt="Profile Illustration"
            width={400}
            height={300}
            className="object-contain w-full h-[250px]"
          />
        </div>
        
        {/* Content */}
        <div className="prose prose-lg prose-gray max-w-none text-gray-700 leading-relaxed text-[16px]">
          <p className="mb-4">
            Halo! Selamat datang di halaman profil kreator <strong>ZekkTech Blog</strong>. ZekkTech dibangun dengan kebahagiaan untuk menjadi sarana berbagi hal-hal menakjubkan bagi kalangan IT, baik Anda yang baru belajar maupun profesional yang ingin terus  <em>up-to-date</em> dengan perkembangan dunia teknologi.
          </p>
          <p className="mb-4">
            Tujuan blog ini diciptakan adalah untuk merangkai berbagai ragam konten, seperti:
          </p>
          <ul className="list-disc pl-5 mb-4">
            <li className="mb-2"><strong>Berita Teknologi:</strong> Merangkum kabar dan tren perangkat lunak terbaru agar tidak tertinggal.</li>
            <li className="mb-2"><strong>Tutorial Teknologi:</strong> Pembelajaran praktik terbaik mengenai bahasa pemrograman dan *tools* kekinian.</li>
            <li className="mb-2"><strong>Template:</strong> Sumber daya *open source*, referensi, hingga *template* gratis yang dapat membantu mempercepat produktivitas.</li>
          </ul>
          <p className="mb-4">
            Setiap karya tulis di sini diharapkan mampu memacu motivasi *coding* Anda dan tentunya mendatangkan wawasan segar setiap harinya. Silakan telusuri semua artikel yang ada dan apabila berkenan, *support* selalu dengan secangkir kopi!
          </p>
          <p className="font-semibold text-gray-900">
            Terima kasih dan *Happy Coding*! 💻🚀
          </p>
        </div>
      </article>

      <Footer />
    </main>
  );
}
